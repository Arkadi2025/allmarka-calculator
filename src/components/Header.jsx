const LANG_OPTIONS = [
  { value: 'en', label: 'EN' },
  { value: 'ru', label: 'RU' },
  { value: 'he', label: 'HE' }
];

const COPY = {
  en: {
    tag: 'Logistics Toolkit',
    title: 'Import Cost Calculator',
    desc: 'Estimate full landed import cost and quickly compare suppliers, routes and customs scenarios.',
    lang: 'Language'
  },
  ru: {
    tag: 'Logistics Toolkit',
    title: 'Import Cost Calculator',
    desc: 'Оцените полную стоимость ввоза товара и быстро сравнивайте поставщиков, маршруты и таможенные сценарии.',
    lang: 'Язык'
  },
  he: {
    tag: 'ערכת לוגיסטיקה',
    title: 'מחשבון עלות יבוא',
    desc: 'חשב עלות יבוא מלאה והשווה ספקים, נתיבים ותרחישי מכס במהירות.',
    lang: 'שפה'
  }
};

export default function Header({ language, onLanguageChange }) {
  const t = COPY[language] || COPY.en;

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{t.tag}</p>
        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
          {t.lang}
          <select
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100"
          >
            {LANG_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h1 className="text-4xl font-semibold text-white md:text-5xl">{t.title}</h1>
      <p className="max-w-3xl text-base text-slate-300 md:text-lg">{t.desc}</p>
    </header>
  );
}
