const shippingFields = [
  {
    label: 'Международная доставка',
    name: 'shipping',
    hint: 'Если выбран авторасчёт — применяется рыночная оценка по весу/объёму и типу доставки.',
    unit: 'USD'
  },
  {
    label: 'Страхование',
    name: 'insurance',
    hint: 'Опционально, при расчёте рисков.',
    unit: 'USD'
  }
];

const DELIVERY_MODES = [
  { value: 'sea', label: 'Морем' },
  { value: 'air', label: 'Воздухом' },
  { value: 'land', label: 'Сухопутно' }
];

export default function ShippingSection({ values, onChange, marketEstimate }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
      <h3 className="text-lg font-semibold">Логистика</h3>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <span className="text-sm font-medium text-slate-200">Тип доставки</span>
          <select
            name="deliveryMode"
            value={values.deliveryMode}
            onChange={onChange}
            className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
          >
            {DELIVERY_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <span className="text-sm font-medium text-slate-200">Режим стоимости доставки</span>
          <select
            name="shippingMode"
            value={values.shippingMode}
            onChange={onChange}
            className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
          >
            <option value="calculate">Рыночная автооценка (по весу/объёму)</option>
            <option value="manual">Ввести вручную</option>
          </select>
        </label>
      </div>

      {marketEstimate ? (
        <div className="mt-4 rounded-2xl border border-brand-500/30 bg-brand-900/10 p-4 text-sm text-slate-200">
          <p className="font-semibold">Текущая рыночная оценка: {marketEstimate.totalUsd.toFixed(2)} USD</p>
          <p className="mt-1 text-xs text-slate-300">
            Основа: {marketEstimate.basisLabel}, коэффициент рынка: {marketEstimate.marketFactor.toFixed(3)},
            маршрутный коэффициент: {marketEstimate.routeFactor.toFixed(2)}.
          </p>
          <p className="mt-1 text-xs text-slate-400">Обновлено: {marketEstimate.generatedAt}</p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-5">
        {shippingFields.map((field) => (
          <label
            key={field.name}
            className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
          >
            <span className="text-sm font-medium text-slate-200">{field.label}</span>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                {field.unit}
              </span>
              <input
                type="number"
                name={field.name}
                value={field.name === 'shipping' && values.shippingMode === 'calculate' && marketEstimate
                  ? marketEstimate.totalUsd.toFixed(2)
                  : values[field.name]}
                onChange={onChange}
                min="0"
                step="0.01"
                disabled={field.name === 'shipping' && values.shippingMode === 'calculate'}
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
