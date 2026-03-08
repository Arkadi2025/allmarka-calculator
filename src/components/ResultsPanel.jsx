const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(value);

export default function ResultsPanel({ totals }) {
  return (
    <section className="rounded-3xl border border-brand-500/40 bg-gradient-to-br from-brand-600/20 via-slate-900/80 to-slate-950 p-6 shadow-xl shadow-brand-500/10 md:p-8">
      <h2 className="text-xl font-semibold">Итоговая стоимость (по таблице растаможки)</h2>
      <p className="mt-2 text-sm text-slate-300">
        Расчёт с раздельным курсом для себестоимости и налоговой базы, как в вашей таблице.
      </p>

      <div className="mt-6 rounded-2xl border border-brand-500/30 bg-slate-950/70 p-5">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Total</p>
        <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(totals.totalNis, 'ILS')}</p>
        <p className="mt-2 text-sm text-slate-400">
          {formatCurrency(totals.perUnitNis, 'ILS')} / единицу при количестве {totals.quantity} шт.
        </p>
        <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
          <p className="font-medium text-white">Эквивалент в USD</p>
          <p className="mt-1 text-lg font-semibold text-brand-100">{formatCurrency(totals.total, 'USD')}</p>
          <p className="text-xs text-slate-500">Курс себестоимости: 1 USD = {totals.fxGoods} ₪</p>
        </div>
        <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
          <p className="font-medium text-white">В валюте страны назначения ({totals.destinationCountry})</p>
          <p className="mt-1 text-lg font-semibold text-brand-100">
            {formatCurrency(totals.totalInDestinationCurrency, totals.destinationCurrency)}
          </p>
          <p className="text-xs text-slate-500">Курс: 1 USD = {totals.destinationRate} {totals.destinationCurrency}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-2 text-sm text-slate-300">
        <div className="flex items-center justify-between"><span>Цена товара, USD</span><span>{formatCurrency(totals.priceUsd, 'USD')}</span></div>
        <div className="flex items-center justify-between"><span>Международная доставка + страхование, USD</span><span>{formatCurrency(totals.internationalUsd, 'USD')}</span></div>
        <div className="flex items-center justify-between"><span>CIF (курс себестоимости)</span><span>{formatCurrency(totals.cifNis, 'ILS')}</span></div>
        <div className="flex items-center justify-between"><span>Налоговая база CIF (курс таможни)</span><span>{formatCurrency(totals.taxBaseNis, 'ILS')}</span></div>
        <div className="flex items-center justify-between"><span>Пошлина</span><span>{formatCurrency(totals.dutyNis, 'ILS')}</span></div>
        <div className="flex items-center justify-between"><span>НДС</span><span>{formatCurrency(totals.vatNis, 'ILS')}</span></div>
        <div className="flex items-center justify-between"><span>Сборы (компьютер + безопасность)</span><span>{formatCurrency(totals.computerFee + totals.securityFee, 'ILS')}</span></div>
        <div className="flex items-center justify-between"><span>Итого таможенные платежи</span><span>{formatCurrency(totals.customsTotalNis, 'ILS')}</span></div>
        <div className="flex items-center justify-between"><span>Локальная логистика / шחרור</span><span>{formatCurrency(totals.localLogistics, 'ILS')}</span></div>
        <div className="flex items-center justify-between"><span>Локальная доставка</span><span>{formatCurrency(totals.inlandDelivery, 'ILS')}</span></div>
        <div className="flex items-center justify-between"><span>Брокерские услуги</span><span>{formatCurrency(totals.brokerage, 'ILS')}</span></div>
      </div>
    </section>
  );
}
