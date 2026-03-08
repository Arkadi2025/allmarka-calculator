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


const toFinite = (value, fallback = 0) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const fallbackMarketCustoms = ({ destinationCountry, weightKg, volumeCbm, priceUsd }) => {
  const profile = getCountryProfile(destinationCountry);
  const weight = Math.max(0, toFinite(weightKg));
  const volume = Math.max(0, toFinite(volumeCbm));
  const price = Math.max(0, toFinite(priceUsd));
  const handlingUnits = Math.max(1, Math.ceil(Math.max(weight / 120, volume / 1.5)));

  return {
    dutyRate: profile.dutyRate,
    vatRate: profile.vatRate,
    fxTax: Number((profile.fxRate * 1.08).toFixed(4)),
    computerFee: Number((32 + handlingUnits * 6).toFixed(2)),
    securityFee: Number((38 + handlingUnits * 5).toFixed(2)),
    localLogistics: Number((1800 + weight * 1.9 + volume * 420).toFixed(2)),
    inlandDelivery: Number((380 + weight * 0.65 + volume * 120).toFixed(2)),
    brokerage: Number((290 + price * 0.012).toFixed(2)),
    source: 'fallback-model',
    updatedAt: new Date().toISOString(),
    notes:
      'Fallback-модель на основе веса/объёма/стоимости. Для точной ставки используйте AI-агент и подтверждение от брокера.'
  };
};

export const getMarketCustomsProfile = async ({
  destinationCountry,
  originCountry,
  productName,
  weightKg,
  volumeCbm,
  priceUsd,
  hsCode
}) => {
  const fallback = fallbackMarketCustoms({ destinationCountry, weightKg, volumeCbm, priceUsd });

  if (!AI_AGENT_URL) {
    return fallback;
  }

  try {
    const response = await fetch(AI_AGENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(AI_AGENT_KEY ? { Authorization: `Bearer ${AI_AGENT_KEY}` } : {})
      },
      body: JSON.stringify({
        task: 'market_customs_inputs',
        destinationCountry,
        originCountry,
        productName,
        hsCode,
        weightKg,
        volumeCbm,
        priceUsd
      })
    });

    if (!response.ok) {
      return fallback;
    }

    const data = await response.json();

    return {
      dutyRate: toFinite(data.dutyRate, fallback.dutyRate),
      vatRate: toFinite(data.vatRate, fallback.vatRate),
      fxTax: toFinite(data.fxTax, fallback.fxTax),
      computerFee: toFinite(data.computerFee, fallback.computerFee),
      securityFee: toFinite(data.securityFee, fallback.securityFee),
      localLogistics: toFinite(data.localLogistics, fallback.localLogistics),
      inlandDelivery: toFinite(data.inlandDelivery, fallback.inlandDelivery),
      brokerage: toFinite(data.brokerage, fallback.brokerage),
      source: 'ai-agent',
      updatedAt: data.updatedAt || new Date().toISOString(),
      notes:
        data.notes ||
        'Оценка на основе AI-агента и рыночных данных. Подтверждайте финальные сборы у таможенного брокера.'
    };
  } catch {
    return fallback;
  }
};
