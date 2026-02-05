import { useState } from 'react';

import { COUNTRIES, HS_CHAPTERS, HS_DATABASES, PORTS } from '../data/importData.js';
import { searchHsCode } from '../services/ai.js';

export default function HsSection() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle');

  const handleSearch = async (event) => {
    event.preventDefault();
    setStatus('loading');
    const response = await searchHsCode(query);
    setResult(response.result);
    setStatus('done');
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
      <h3 className="text-lg font-semibold">Подсказки по ТН ВЭД</h3>
      <p className="mt-2 text-sm text-slate-400">
        Используйте популярные главы и направления, чтобы быстрее подобрать код
        ТН ВЭД и уточнить ставку пошлины.
      </p>
      <form
        onSubmit={handleSearch}
        className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
      >
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Введите товар или код главы"
          className="min-w-[220px] flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
        <button
          type="submit"
          className="rounded-full border border-brand-500/50 px-4 py-2 text-sm text-white transition hover:border-brand-500"
        >
          Найти HS-код
        </button>
        <span className="text-xs text-slate-500">
          {status === 'loading'
            ? 'Поиск...'
            : result
              ? `Найдено: ${result.code} — ${result.label} (${
                  result.source === 'backup' ? 'резервный источник' : 'основной источник'
                })`
              : 'Нет результатов'}
        </span>
      </form>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Внешние базы HS
        </p>
        <div className="mt-3 grid gap-2">
          {HS_DATABASES.map((database) => (
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
        <p className="mt-3 text-xs text-slate-500">
          Если одна база недоступна, используйте резервную ссылку выше.
        </p>
      </div>

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
      <ul className="mt-5 space-y-3 text-sm text-slate-400">
        <li>
          • Обновляйте ставки пошлин и НДС в зависимости от категории товара.
        </li>
        <li>• НДС рассчитывается на базу с учётом пошлины и брокерских услуг.</li>
        <li>• Проверьте, входит ли страховка в стоимость фрахта.</li>
        <li>
          • Добавьте локальные складские сборы при расчёте конечной
          себестоимости.
        </li>
      </ul>
    </section>
  );
}
