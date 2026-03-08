const customsFields = [
  {
    label: 'Ставка пошлины, % (рыночная)',
    name: 'dutyRate',
    hint: 'Подтягивается через AI-агент/рыночную модель.',
    unit: '%',
    editable: false
  },
  {
    label: 'НДС, % (рыночный)',
    name: 'vatRate',
    hint: 'Подтягивается через AI-агент/рыночную модель.',
    unit: '%',
    editable: false
  },
  {
    label: 'Курс USD для себестоимости',
    name: 'fxRateGoods',
    hint: 'Коммерческий курс для стоимости товара и международной доставки.',
    unit: '₪',
    editable: true
  },
  {
    label: 'Аграт מחשב (рыночный)',
    name: 'computerFee',
    hint: 'Фиксированный сбор по профилю рынка/агента.',
    unit: '₪',
    editable: false
  },
  {
    label: 'Аграт ביטחון (рыночный)',
    name: 'securityFee',
    hint: 'Сбор безопасности по профилю рынка/агента.',
    unit: '₪',
    editable: false
  },
  {
    label: 'Локальная логистика / шחרור (рыночная)',
    name: 'localLogistics',
    hint: 'Портовые/экспедиторские затраты, рассчитанные по рынку.',
    unit: '₪',
    editable: false
  },
  {
    label: 'Локальная доставка порт → склад (рыночная)',
    name: 'inlandDelivery',
    hint: 'Считается от веса/объёма и маршрута.',
    unit: '₪',
    editable: false
  },
  {
    label: 'Комиссия брокера (рыночная)',
    name: 'brokerage',
    hint: 'Считается агентом по стоимости партии и сложности оформления.',
    unit: '₪',
    editable: false
  }
];

const formatDate = (value) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export default function CustomsPanel({ values, onChange, marketCustomsInfo }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
      <h3 className="text-lg font-semibold">Таможенные платежи (рыночные)</h3>

      <div className="mt-4 rounded-2xl border border-brand-500/30 bg-brand-900/10 p-4 text-sm text-slate-200">
        <p className="font-semibold">Как считается внутренняя доставка и брокер</p>
        <p className="mt-1 text-xs text-slate-300">
          Внутренняя доставка порт → склад рассчитывается AI-агентом из веса, объёма, страны и маршрута.
          Комиссия брокера рассчитывается как рыночная ставка по стоимости груза + сложности оформления.
        </p>
        <p className="mt-2 text-xs text-slate-300">Курс USD для налоговой базы: <span className="font-semibold">{values.fxRateTax}</span> ₪ (инфо, не редактируется).</p>
        <p className="mt-1 text-xs text-slate-400">Источник: {marketCustomsInfo?.source || 'pending'} · Обновлено: {formatDate(marketCustomsInfo?.updatedAt)}</p>
        {marketCustomsInfo?.notes ? (
          <p className="mt-1 text-xs text-slate-400">{marketCustomsInfo.notes}</p>
        ) : null}
      </div>

      <div className="mt-4 grid gap-5">
        {customsFields.map((field) => (
          <label
            key={field.name}
            className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
          >
            <span className="text-sm font-medium text-slate-200">{field.label}</span>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">{field.unit}</span>
              <input
                type="number"
                name={field.name}
                value={values[field.name]}
                onChange={onChange}
                min="0"
                step="0.01"
                disabled={!field.editable}
                className="w-full bg-transparent text-lg font-semibold text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:text-slate-400"
              />
            </div>
            <span className="text-xs text-slate-500">{field.hint}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
