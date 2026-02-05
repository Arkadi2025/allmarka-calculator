const productFields = [
  {
    label: 'Стоимость товара',
    name: 'price',
    hint: 'Инвойсная цена товара.',
    unit: 'USD'
  },
  {
    label: 'Количество единиц',
    name: 'quantity',
    hint: 'Нужно для расчёта себестоимости на единицу.',
    unit: 'PCS'
  }
];

export default function ProductForm({ values, onChange, onReset }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-black/20 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Входные данные</h2>
          <p className="text-sm text-slate-400">Все значения в долларах США.</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-brand-500 hover:text-white"
        >
          Сбросить
        </button>
      </div>

      <div className="mt-6 grid gap-5">
        {productFields.map((field) => (
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
