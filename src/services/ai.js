import { COUNTRY_DB_LINKS, HS_CATALOG } from '../data/hsCatalog.js';
import { COUNTRY_IMPORT_PROFILES, CUSTOMS_FALLBACK_GUIDE } from '../data/importData.js';

const PRIMARY_SEARCH_URL =
  (import.meta.env && import.meta.env.VITE_PRIMARY_HS_SEARCH_URL) ||
  'https://api.duckduckgo.com/';

const AI_AGENT_URL = (import.meta.env && import.meta.env.VITE_AI_AGENT_URL) || '';
const AI_AGENT_KEY = (import.meta.env && import.meta.env.VITE_AI_AGENT_KEY) || '';

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[ё]/g, 'е')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const STOPWORDS = new Set(['product', 'товар', 'item', 'goods', 'products']);

const tokenize = (value) =>
  normalize(value)
    .split(' ')
    .filter((token) => token && token.length > 2 && !STOPWORDS.has(token));

const scoreEntry = (entry, query) => {
  const normalizedQuery = normalize(query);
  const tokens = tokenize(query);
  if (!normalizedQuery) {
    return 0;
  }

  const searchable = [entry.code, entry.title, entry.explanation, ...(entry.keywords || [])]
    .map(normalize)
    .join(' ');

  let score = 0;

  const numericQuery = normalizedQuery.replace(/\D/g, '');
  if (numericQuery && entry.code.startsWith(numericQuery)) {
    score += 120;
  }
  if (searchable.includes(normalizedQuery)) {
    score += 80;
  }

  tokens.forEach((token) => {
    if (searchable.includes(token)) {
      score += 20;
    }
  });

  return score;
};

const countryAliases = {
  us: 'usa',
  unitedstates: 'usa',
  'united states': 'usa',
  de: 'germany',
  il: 'israel',
  ae: 'uae',
  uae: 'uae',
  ca: 'canada'
};

const canonicalCountry = (country) => {
  const normalized = normalize(country);
  return countryAliases[normalized] || normalized;
};

const getCountryProfile = (country) => {
  const canonical = canonicalCountry(country);
  return COUNTRY_IMPORT_PROFILES[canonical] || COUNTRY_IMPORT_PROFILES.default;
};

const getCountryLinks = (country) => {
  const key = canonicalCountry(country);
  if (!key) {
    return [...COUNTRY_DB_LINKS.global];
  }

  if (['israel'].includes(key)) {
    return [...COUNTRY_DB_LINKS.israel, ...COUNTRY_DB_LINKS.global];
  }
  if (['eu', 'european union', 'europe', 'germany'].includes(key)) {
    return [...COUNTRY_DB_LINKS.eu, ...COUNTRY_DB_LINKS.global];
  }

  return [...COUNTRY_DB_LINKS.global];
};

const getFallbackGuide = (country) => {
  return (
    CUSTOMS_FALLBACK_GUIDE[country] ||
    CUSTOMS_FALLBACK_GUIDE[normalize(country)] ||
    CUSTOMS_FALLBACK_GUIDE.default
  );
};

const rankCatalog = (query) => {
  return HS_CATALOG
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, query)
    }))
    .filter((item) => item.score >= 40)
    .sort((a, b) => b.score - a.score);
};

const searchFromPrimaryEngine = async (query) => {
  try {
    const url = `${PRIMARY_SEARCH_URL}?q=${encodeURIComponent(
      `${query} HS code`
    )}&format=json&no_redirect=1&no_html=1&skip_disambig=1`;
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const relatedText = Array.isArray(data.RelatedTopics)
      ? data.RelatedTopics.flatMap((item) => {
          if (item.Text) {
            return [item.Text];
          }
          if (Array.isArray(item.Topics)) {
            return item.Topics.map((topic) => topic.Text).filter(Boolean);
          }
          return [];
        })
      : [];

    const sourceText = [data.AbstractText, data.Heading, ...relatedText]
      .filter(Boolean)
      .join(' ')
      .trim();

    if (!sourceText) {
      return null;
    }

    return sourceText;
  } catch {
    return null;
  }
};

const parseAgentResponse = (data, fallbackResult, destinationCountry) => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const estimatedDutyRate = Number.parseFloat(data.estimatedDutyRate);
  const estimatedVatRate = Number.parseFloat(data.estimatedVatRate);

  return {
    code: data.hsCode || fallbackResult?.code || '',
    title: data.title || fallbackResult?.title || 'AI estimated classification',
    explanation: data.reasoning || fallbackResult?.explanation || '',
    source: 'ai-agent',
    confidence: Number.isFinite(Number.parseFloat(data.confidence))
      ? Math.min(0.99, Number.parseFloat(data.confidence))
      : 0.55,
    compliance: {
      requirements: Array.isArray(data.requirements) ? data.requirements : [],
      documents: Array.isArray(data.documents) ? data.documents : [],
      legalReferences: Array.isArray(data.legalReferences) ? data.legalReferences : [],
      dutyByCountry: {
        [destinationCountry]: Number.isFinite(estimatedDutyRate)
          ? Number(estimatedDutyRate.toFixed(2))
          : null
      },
      vatByCountry: {
        [destinationCountry]: Number.isFinite(estimatedVatRate)
          ? Number(estimatedVatRate.toFixed(2))
          : null
      },
      notes:
        data.notes ||
        'AI-оценка ориентировочная. Перед декларированием подтвердите HS-код у брокера или в таможенном органе.'
    }
  };
};

const requestAiAgent = async ({ query, country, fallbackResult }) => {
  if (!AI_AGENT_URL) {
    return null;
  }

  try {
    const response = await fetch(AI_AGENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(AI_AGENT_KEY ? { Authorization: `Bearer ${AI_AGENT_KEY}` } : {})
      },
      body: JSON.stringify({
        task: 'import_customs_estimation',
        query,
        destinationCountry: country,
        fallbackHsCode: fallbackResult?.code || null,
        fallbackTitle: fallbackResult?.title || null
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return parseAgentResponse(data, fallbackResult, country);
  } catch {
    return null;
  }
};

export const searchHsCode = async ({ query, country }) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return {
      query,
      country,
      result: null,
      alternatives: [],
      links: getCountryLinks(country),
      legalGuidance: getFallbackGuide(country),
      searchSource: 'empty',
      countryProfile: getCountryProfile(country)
    };
  }

  const webSnippet = await searchFromPrimaryEngine(normalizedQuery);
  const rankedFromWeb = webSnippet ? rankCatalog(`${normalizedQuery} ${webSnippet}`) : [];
  const rankedLocal = rankCatalog(normalizedQuery);
  const ranked = rankedFromWeb.length > 0 ? rankedFromWeb : rankedLocal;

  const [best, ...rest] = ranked;
  const fallbackResult = best
    ? {
        ...best.entry,
        source: rankedFromWeb.length > 0 ? 'primary-search' : 'catalog',
        confidence: Math.min(0.99, Number((best.score / 140).toFixed(2)))
      }
    : null;

  const aiResult = await requestAiAgent({ query: normalizedQuery, country, fallbackResult });
  const result = aiResult || fallbackResult;

  return {
    query,
    country,
    result,
    alternatives: rest.slice(0, 3).map((item) => ({
      ...item.entry,
      source: rankedFromWeb.length > 0 ? 'primary-search' : 'catalog',
      confidence: Math.min(0.99, Number((item.score / 140).toFixed(2)))
    })),
    links: getCountryLinks(country),
    legalGuidance: getFallbackGuide(country),
    searchSource: aiResult
      ? 'ai-agent'
      : rankedFromWeb.length > 0
        ? 'primary-search'
        : 'catalog-fallback',
    countryProfile: getCountryProfile(country)
  };
};
