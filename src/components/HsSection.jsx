import { useMemo, useState } from 'react';

import { COUNTRIES, HS_CHAPTERS, PORTS } from '../data/importData.js';
import { searchHsCode } from '../services/ai.js';

const COUNTRY_OPTIONS = ['Israel', 'EU', 'Global'];

export default function HsSection() {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('Israel');
  const [result, setResult] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [links, setLinks] = useState([]);
  const [status, setStatus] = useState('idle');

  const statusText = useMemo(() => {
    if (status === 'loading') {
      return 'Поиск...';
    }
    if (result) {
      return `Найдено: ${result.code} — ${result.title} (точность ${Math.round(
        result.confidence * 100
      )}%)`;
    }
    if (status === 'done') {
      return 'Совпадение не найдено. Проверьте формулировку и откройте внешние базы ниже.';
    }
    return 'Введите товар, материал или код и нажмите «Найти HS-код».';
  }, [result, status]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setStatus('loading');
    const response = await searchHsCode({ query, country });
    setResult(response.result);
    setAlternatives(response.alternatives);
    setLinks(response.links);
    setStatus('done');
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
      <h3 className="text-lg font-semibold">Подсказки по ТН ВЭД</h3>
      <p className="mt-2 text-sm text-slate-400">
        Ищем по локальному каталогу (код, название, ключевые слова) и показываем
        пояснение + альтернативы.
      </p>

      <form
        onSubmit={handleSearch}
        className="mt-4 grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
      >
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Например: смартфон, laptop, 8517"
            className="min-w-[220px] flex-1 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <select
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none"
          >
            {COUNTRY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-full border border-brand-500/50 px-4 py-2 text-sm text-white transition hover:border-brand-500"
          >
            Найти HS-код
          </button>
        </div>

        <div className="text-xs text-slate-400">{statusText}</div>
      </form>

      {result ? (
        <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-900/10 p-4">
          <p className="text-sm font-semibold text-emerald-300">
            HS {result.code} — {result.title}
          </p>
          <p className="mt-2 text-sm text-slate-300">{result.explanation}</p>
        </div>
      ) : null}

      {alternatives.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Альтернативные варианты
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {alternatives.map((item) => (
              <li key={item.code}>
                • {item.code} — {item.title}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {links.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Внешние базы HS для {country}
          </p>
          <div className="mt-3 grid gap-2">
            {links.map((database) => (
              <a
                key={database.url}
                href={database.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-800 px-3 py-2 text-sm text-slate-200 transition hover:border-brand-500 hover:text-white"
              >
                <span>{database.name}</span>
                <span className="text-xs text-slate-500">Открыть ↗</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 text-sm text-slate-400">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Частые главы
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {HS_CHAPTERS.map((chapter) => (
              <span
                key={chapter}
                className="rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1"
              >
                {chapter}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Страны происхождения
            </p>
            <p className="mt-2 text-slate-300">{COUNTRIES.join(', ')}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Основные порты
            </p>
            <p className="mt-2 text-slate-300">{PORTS.join(', ')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
