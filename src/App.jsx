import { useMemo, useState } from 'react';

const DEFAULTS = {
  price: 2500,
  shipping: 320,
  insurance: 60,
  dutyRate: 7.5,
  vatRate: 12,
  brokerage: 75
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);

const toNumber = (value) => {
  if (typeof value === 'string') {
    const normalized = value.replace(',', '.');
    const parsed = Number.parseFloat(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export default function App() {
  const [values, setValues] = useState(DEFAULTS);

  const totals = useMemo(() => {
    const price = toNumber(values.price);
    const shipping = toNumber(values.shipping);
    const insurance = toNumber(values.insurance);
    const dutyRate = toNumber(values.dutyRate) / 100;
    const vatRate = toNumber(values.vatRate) / 100;
    const brokerage = toNumber(values.brokerage);

    const subtotal = price + shipping + insurance;
    const duty = subtotal * dutyRate;
    const vatBase = subtotal + duty + brokerage;
    const vat = vatBase * vatRate;
    const total = subtotal + duty + vat + brokerage;

    return {
      subtotal,
      duty,
      vat,
      brokerage,
      total
    };
  }, [values]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const reset = () => setValues(DEFAULTS);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Logistics Toolkit
          </p>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">
            Import Cost Calculator
          </h1>
          <p className="max-w-2xl text-base text-slate-300 md:text-lg">
            Оцените полную стоимость ввоза товара, включая пошлины, НДС и
            дополнительные сборы, и быстро пересчитайте сценарии для разных
            поставщиков.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-black/20 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Входные данные</h2>
                <p className="text-sm text-slate-400">
                  Все значения в долларах США.
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-brand-500 hover:text-white"
              >
                Сбросить
              </button>
            </div>

            <div className="mt-6 grid gap-5">
              {[
                {
                  label: 'Стоимость товара',
                  name: 'price',
                  hint: 'Инвойсная цена товара.'
                },
                {
                  label: 'Международная доставка',
                  name: 'shipping',
                  hint: 'Стоимость перевозки до склада.'
                },
                {
                  label: 'Страхование',
                  name: 'insurance',
                  hint: 'Опционально, при расчёте рисков.'
                },
                {
                  label: 'Ставка пошлины, %',
                  name: 'dutyRate',
                  hint: 'Таможенная ставка по коду ТН ВЭД.'
                },
                {
                  label: 'НДС, %',
                  name: 'vatRate',
                  hint: 'Налог на добавленную стоимость.'
                },
                {
                  label: 'Брокерские услуги',
                  name: 'brokerage',
                  hint: 'Сопровождение и оформление.'
                }
              ].map((field) => (
                <label
                  key={field.name}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <span className="text-sm font-medium text-slate-200">
                    {field.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                      {field.name.includes('Rate') ? '%' : 'USD'}
                    </span>
                    <input
                      type="number"
                      name={field.name}
                      value={values[field.name]}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full bg-transparent text-lg font-semibold text-white outline-none placeholder:text-slate-600"
                    />
                  </div>
                  <span className="text-xs text-slate-500">{field.hint}</span>
                </label>
              ))}
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <section className="rounded-3xl border border-brand-500/40 bg-gradient-to-br from-brand-600/20 via-slate-900/80 to-slate-950 p-6 shadow-xl shadow-brand-500/10 md:p-8">
              <h2 className="text-xl font-semibold">Итоговая стоимость</h2>
              <p className="mt-2 text-sm text-slate-300">
                Суммарные расходы с учётом всех налогов и сборов.
              </p>
              <div className="mt-6 rounded-2xl border border-brand-500/30 bg-slate-950/70 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Total
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {formatCurrency(totals.total)}
                </p>
              </div>
              <div className="mt-6 grid gap-4 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>База (товар + доставка)</span>
                  <span className="font-medium text-white">
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Пошлина</span>
                  <span className="font-medium text-white">
                    {formatCurrency(totals.duty)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>НДС</span>
                  <span className="font-medium text-white">
                    {formatCurrency(totals.vat)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Брокерские услуги</span>
                  <span className="font-medium text-white">
                    {formatCurrency(totals.brokerage)}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
              <h3 className="text-lg font-semibold">Подсказки</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li>
                  • Обновляйте ставки пошлин и НДС в зависимости от категории
                  товара.
                </li>
                <li>
                  • НДС рассчитывается на базу с учётом пошлины и брокерских
                  услуг.
                </li>
                <li>• Проверьте, входит ли страховка в стоимость фрахта.</li>
                <li>
                  • Добавьте локальные складские сборы при расчёте конечной
                  себестоимости.
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
