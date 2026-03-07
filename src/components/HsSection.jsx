import { useEffect, useMemo, useState } from 'react';

import { COUNTRIES, HS_CHAPTERS, HS_DATABASES, PORTS } from '../data/importData.js';
import { HS_CATALOG } from '../data/hsCatalog.js';
import { searchHsCode } from '../services/ai.js';

const QUICK_PRODUCTS = HS_CATALOG.slice(0, 6).map((item) => item.keywords?.[0]).filter(Boolean);

const getCountryTax = (map, country) => {
  if (!map) {
    return null;
  }
  return map[country] ?? map.Israel ?? null;
};

const getSourceLabel = (searchSource) => {
  if (searchSource === 'ai-agent') {
    return 'AI-агент + локальный каталог';
  }
  if (searchSource === 'primary-search') {
    return 'Поисковый источник + локальный каталог';
  }
  if (searchSource === 'catalog-fallback') {
    return 'Локальный каталог приложения';
  }
  return 'Источник не определён';
};

const getSourceDisclaimer = (searchSource) => {
  if (searchSource === 'ai-agent') {
    return 'AI-ответ не является официальным классификационным решением. Для декларирования подтвердите код у брокера или в таможне.';
  }
  if (searchSource === 'primary-search') {
    return 'Поисковая выдача используется только как вспомогательный сигнал. Юридически значимыми являются только официальные таможенные базы/решения.';
  }
  return 'Данные каталога являются справочными. Для подачи декларации требуется проверка по официальным источникам и/или предварительное решение таможни.';
};

export default function HsSection({ productName, destinationCountry, onProductNameChange, onApplyHsResult }) {
  const [manualCode, setManualCode] = useState('');
  const [country, setCountry] = useState(destinationCountry || 'Israel');

  useEffect(() => {
    if (destinationCountry) {
      setCountry(destinationCountry);
    }
  }, [destinationCountry]);

  const [chapter, setChapter] = useState('');
  const [result, setResult] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [links, setLinks] = useState([]);
  const [status, setStatus] = useState('idle');
  const [legalGuidance, setLegalGuidance] = useState('');
  const [searchSource, setSearchSource] = useState('catalog-fallback');

  const searchQuery = useMemo(() => {
    return [productName, manualCode, chapter].filter(Boolean).join(' ');
  }, [productName, manualCode, chapter]);

  const officialSources = useMemo(() => {
    const merged = [...links, ...HS_DATABASES];
    const seen = new Set();
    return merged.filter((item) => {
      const key = item.url;
      if (!key || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, [links]);

  const statusText = useMemo(() => {
    if (status === 'loading') {
      return 'Поиск...';
    }
    if (result) {
      const sourceLabel =
        searchSource === 'ai-agent'
          ? 'AI-агент'
          : searchSource === 'primary-search'
            ? 'основной поисковик'
            : 'локальный каталог';
      return `Найдено: ${result.code || 'N/A'} — ${result.title} (точность ${Math.round(
        result.confidence * 100
      )}%, источник: ${sourceLabel})`;
    }
    if (status === 'done') {
      return 'Совпадение не найдено. Проверьте название товара, страну, главу и откройте внешние базы ниже.';
    }
    return 'Поиск работает по названию товара, коду, главе и ключевым словам. При VITE_AI_AGENT_URL включается AI-анализ для любых стран.';
  }, [result, searchSource, status]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setStatus('loading');
    const response = await searchHsCode({ query: searchQuery, country });
    setResult(response.result);
    setAlternatives(response.alternatives);
    setLinks(response.links);
    setLegalGuidance(response.legalGuidance || '');
    setSearchSource(response.searchSource || 'catalog-fallback');

    if (response.countryProfile) {
      onApplyHsResult?.({
        dutyRate: response.countryProfile.dutyRate,
        vatRate: response.countryProfile.vatRate,
        note: response.countryProfile.notes || ''
      });
    }
    setStatus('done');
  };

  const setQuickProduct = (value) => {
    onProductNameChange?.(value);
  };

  const dutyRate = getCountryTax(result?.compliance?.dutyByCountry, country);
  const vatRate = getCountryTax(result?.compliance?.vatByCountry, country);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
      <h3 className="text-lg font-semibold">Подсказки по ТН ВЭД + AI анализ</h3>
      <p className="mt-2 text-sm text-slate-400">
        Поиск по названию продукта, ориентировочные ставки и требования по растаможке для любой
        страны назначения.
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
              onChange={(event) => onProductNameChange?.(event.target.value)}
              placeholder="Например: смартфон, ноутбук, сауна"
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
            Страна назначения
            <input
              type="text"
              list="hs-country-options"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm normal-case tracking-normal text-slate-100 outline-none"
            />
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
              className="w-full rounded-xl border border-brand-500/60 bg-brand-600/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600/30"
            >
              Найти HS и рассчитать ставки
            </button>
          </div>
        </div>

        <datalist id="hs-country-options">
          {COUNTRIES.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>

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
            HS {result.code || 'N/A'} — {result.title}
          </p>
          <p className="mt-2 text-sm text-slate-300">{result.explanation}</p>

          {result.compliance ? (
            <div className="mt-4 space-y-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-300">
              <div>
                <p className="font-semibold text-white">Источник данных и официальный статус</p>
                <p className="mt-2">Текущий источник: {getSourceLabel(searchSource)}.</p>
                <p className="mt-1 text-xs text-amber-300">{getSourceDisclaimer(searchSource)}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Официальное закрепление: итоговый HS-код и ставки подтверждаются только по базам
                  таможенных органов/предварительным решениям (ruling/BTI) страны назначения.
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                  {officialSources.map((item) => (
                    <li key={item.url}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-300 hover:text-brand-200"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-white">Требования к ввозу / растаможке</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {(result.compliance.requirements || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-white">Документы</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {(result.compliance.documents || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-white">Нормативная база / ссылки</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {(result.compliance.legalReferences || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-brand-500/30 bg-brand-900/10 p-3">
                <p className="font-semibold text-white">Ориентировочные ставки для {country}</p>
                <p className="mt-1">Пошлина: {dutyRate ?? 'N/A'}%</p>
                <p>НДС/налог на импорт: {vatRate ?? 'N/A'}%</p>
                <p className="mt-2 text-xs text-slate-400">{result.compliance.notes}</p>
                <p className="mt-2 text-xs text-amber-300">
                  Ставки выше — ориентир. Официально закрепляются через национальный тариф/базу
                  таможни (например TARIC/CBSA/Israel Customs) и могут зависеть от подкатегории,
                  происхождения, преференций и даты декларации.
                </p>
              </div>

              {dutyRate != null || vatRate != null ? (
                <button
                  type="button"
                  onClick={() =>
                    onApplyHsResult?.({
                      code: result.code,
                      title: result.title,
                      source: searchSource,
                      note: result.compliance?.notes || '',
                      dutyRate,
                      vatRate
                    })
                  }
                  className="rounded-full border border-brand-500/50 px-4 py-2 text-sm text-white hover:border-brand-500"
                >
                  Применить HS-код и ставки в расчёт
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {!result && status === 'done' && legalGuidance ? (
        <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-900/10 p-4">
          <p className="text-sm font-semibold text-amber-300">
            Юридическое пояснение при отсутствии HS-кода
          </p>
          <p className="mt-2 text-sm text-slate-300">{legalGuidance}</p>
        </div>
      ) : null}

      {alternatives.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Альтернативные варианты</p>
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
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Внешние базы HS для {country}</p>
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
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Страны (примеры)</p>
            <p className="mt-2 text-slate-300">{COUNTRIES.join(', ')}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Основные порты</p>
            <p className="mt-2 text-slate-300">{PORTS.join(', ')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
