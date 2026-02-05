const formatCurrency = (value) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);

export default function ResultsPanel({ totals }) {
  return (
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
        <p className="mt-2 text-sm text-slate-400">
          {formatCurrency(totals.perUnit)} / единицу при количестве{' '}
          {totals.quantity} шт.
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
          <span>Себестоимость на единицу</span>
          <span className="font-medium text-white">
            {formatCurrency(totals.perUnit)}
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
  );
}
