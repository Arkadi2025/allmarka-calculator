import { useMemo, useState } from 'react';

import { COUNTRIES, HS_CHAPTERS, PORTS } from '../data/importData.js';
import { HS_CATALOG } from '../data/hsCatalog.js';
import { searchHsCode } from '../services/ai.js';

const COUNTRY_OPTIONS = ['Israel', 'EU', 'Global'];
const QUICK_PRODUCTS = HS_CATALOG.slice(0, 6).map((item) => item.keywords?.[0]).filter(Boolean);

export default function HsSection() {
  const [productName, setProductName] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [country, setCountry] = useState('Israel');
  const [chapter, setChapter] = useState('');
  const [result, setResult] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [links, setLinks] = useState([]);
  const [status, setStatus] = useState('idle');

  const searchQuery = useMemo(() => {
    return [productName, manualCode, chapter].filter(Boolean).join(' ');
  }, [productName, manualCode, chapter]);

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
      return 'Совпадение не найдено. Проверьте название товара, страну, главу и откройте внешние базы ниже.';
    }
    return 'Поиск работает по названию товара, коду, главе и ключевым словам.';
  }, [result, status]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setStatus('loading');
    const response = await searchHsCode({ query: searchQuery, country });
    setResult(response.result);
    setAlternatives(response.alternatives);
    setLinks(response.links);
    setStatus('done');
  };

  const setQuickProduct = (value) => {
    setProductName(value);
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
      <h3 className="text-lg font-semibold">Подсказки по ТН ВЭД</h3>
      <p className="mt-2 text-sm text-slate-400">
        Вернул поиск по названию продукта и все ключевые опции: страна, глава,
        код, быстрые примеры и внешние базы.
      </p>

      <form
        onSubmit={handleSearch}
        className="mt-4 grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-slate-500">
            Название продукта
            <input
              type="text"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              placeholder="Например: смартфон, ноутбук, кроссовки"
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm normal-case tracking-normal text-white outline-none placeholder:text-slate-500"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-slate-500">
            Код / доп. ключ
            <input
              type="text"
              value={manualCode}
              onChange={(event) => setManualCode(event.target.value)}
              placeholder="Например: 8517"
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm normal-case tracking-normal text-white outline-none placeholder:text-slate-500"
            />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-slate-500">
            Страна
            <select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm normal-case tracking-normal text-slate-100 outline-none"
            >
              {COUNTRY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-slate-500">
            Глава ТН ВЭД
            <select
              value={chapter}
              onChange={(event) => setChapter(event.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm normal-case tracking-normal text-slate-100 outline-none"
            >
              <option value="">Любая</option>
              {HS_CHAPTERS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-full border border-brand-500/50 px-4 py-2 text-sm text-white transition hover:border-brand-500"
            >
              Найти HS-код
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_PRODUCTS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setQuickProduct(item)}
              className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-brand-500 hover:text-white"
            >
              {item}
            </button>
          ))}
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
