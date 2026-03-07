import { COUNTRY_DB_LINKS, HS_CATALOG } from '../data/hsCatalog.js';
import { CUSTOMS_FALLBACK_GUIDE } from '../data/importData.js';

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

const getCountryLinks = (country) => {
  const key = normalize(country);
  if (!key) {
    return [...COUNTRY_DB_LINKS.global];
  }

  if (['israel', 'израиль', 'il'].includes(key)) {
    return [...COUNTRY_DB_LINKS.israel, ...COUNTRY_DB_LINKS.global];
  }
  if (['eu', 'евросоюз', 'european union', 'европа', 'germany', 'германия'].includes(key)) {
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

export const searchHsCode = async ({ query, country }) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return {
      query,
      country,
      result: null,
      alternatives: [],
      links: getCountryLinks(country),
      legalGuidance: getFallbackGuide(country)
    };
  }

  const ranked = HS_CATALOG
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, normalizedQuery)
    }))
    .filter((item) => item.score >= 40)
    .sort((a, b) => b.score - a.score);

  const [best, ...rest] = ranked;

  return {
    query,
    country,
    result: best
      ? {
          ...best.entry,
          source: 'catalog',
          confidence: Math.min(0.99, Number((best.score / 140).toFixed(2)))
        }
      : null,
    alternatives: rest.slice(0, 3).map((item) => ({
      ...item.entry,
      source: 'catalog',
      confidence: Math.min(0.99, Number((item.score / 140).toFixed(2)))
    })),
    links: getCountryLinks(country),
    legalGuidance: getFallbackGuide(country)
  };
};
