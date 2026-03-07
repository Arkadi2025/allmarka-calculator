import { COUNTRY_DB_LINKS, HS_CATALOG } from '../data/hsCatalog.js';

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[ё]/g, 'е')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (value) => normalize(value).split(' ').filter(Boolean);

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

  if (entry.code.startsWith(normalizedQuery.replace(/\D/g, ''))) {
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
  if (['eu', 'евросоюз', 'european union', 'европа'].includes(key)) {
    return [...COUNTRY_DB_LINKS.eu, ...COUNTRY_DB_LINKS.global];
  }

  return [...COUNTRY_DB_LINKS.global];
};

export const searchHsCode = async ({ query, country }) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return {
      query,
      country,
      result: null,
      alternatives: [],
      links: getCountryLinks(country)
    };
  }

  const ranked = HS_CATALOG
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, normalizedQuery)
    }))
    .filter((item) => item.score > 0)
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
    links: getCountryLinks(country)
  };
};
