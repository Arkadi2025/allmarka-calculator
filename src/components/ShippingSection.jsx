const shippingFields = [
  {
    label: 'Международная доставка',
    name: 'shipping',
    hint: 'Стоимость перевозки до склада.',
    unit: 'USD'
  },
  {
    label: 'Страхование',
    name: 'insurance',
    hint: 'Опционально, при расчёте рисков.',
    unit: 'USD'
  }
];

export default function ShippingSection({ values, onChange }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
      <h3 className="text-lg font-semibold">Логистика</h3>
      <div className="mt-4 grid gap-5">
        {shippingFields.map((field) => (
          <label
            key={field.name}
            className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
          >
            <span className="text-sm font-medium text-slate-200">
              {field.label}
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                {field.unit}
              </span>
              <input
                type="number"
                name={field.name}
                value={values[field.name]}
                onChange={onChange}
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
  );
}
