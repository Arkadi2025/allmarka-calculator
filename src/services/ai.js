import { HS_CHAPTERS } from '../data/importData.js';

const normalize = (value) => value.trim().toLowerCase();

const buildResult = (chapter) => {
  if (!chapter) {
    return null;
  }
  const [code, label] = chapter.split('—').map((part) => part.trim());
  return {
    code,
    label,
    description: chapter
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

  const result = buildResult(codeMatch || textMatch);

  return {
    query,
    result
  };
};
