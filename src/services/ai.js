import { HS_CHAPTERS, HS_CHAPTERS_FALLBACK } from '../data/importData.js';

const normalize = (value) => value.trim().toLowerCase();

const buildResult = (chapter, source) => {
  if (!chapter) {
    return null;
  }
  const [code, label] = chapter.split('—').map((part) => part.trim());
  return {
    code,
    label,
    description: chapter,
    source
  };
};

export const searchHsCode = async (query) => {
  const normalizedQuery = normalize(query || '');
  if (!normalizedQuery) {
    return {
      query,
      result: null
    };
  }

  const codeMatch = HS_CHAPTERS.find((chapter) =>
    normalize(chapter).startsWith(normalizedQuery)
  );
  const textMatch = HS_CHAPTERS.find((chapter) =>
    normalize(chapter).includes(normalizedQuery)
  );
  const fallbackCodeMatch = HS_CHAPTERS_FALLBACK.find((chapter) =>
    normalize(chapter).startsWith(normalizedQuery)
  );
  const fallbackTextMatch = HS_CHAPTERS_FALLBACK.find((chapter) =>
    normalize(chapter).includes(normalizedQuery)
  );

  const primaryMatch = codeMatch || textMatch;
  const fallbackMatch = fallbackCodeMatch || fallbackTextMatch;
  const result =
    buildResult(primaryMatch, primaryMatch ? 'primary' : null) ||
    buildResult(fallbackMatch, fallbackMatch ? 'backup' : null);

  return {
    query,
    result
  };
};
