import { COUNTRY_OPTIONS, PORTS_BY_COUNTRY } from '../data/importData.js';

const COPY = {
  en: {
    title: 'Shipment setup',
    subtitle: 'Configure product and route details.',
    reset: 'Reset',
    productName: 'Product name',
    countryFrom: 'Country from',
    countryTo: 'Country to',
    originPort: 'Origin port',
    destinationPort: 'Destination port',
    countryHint: 'Choose from the arrow list or switch to manual country input.',
    autoSelect: 'Auto-select',
    quantity: 'Quantity',
    price: 'Price',
    currency: 'Currency',
    incoterm: 'Incoterm',
    dimensions: 'Dimensions & Weight',
    cbm: 'CBM',
    packageSize: 'Package Size',
    container: 'Container',
    volume: 'Volume (m3)',
    weight: 'Weight (kg)',
    hsCode: 'HS Code',
    findIt: 'Find it',
    iKnowIt: 'I know it',
    manualHs: 'Enter HS code manually',
    fxRate: 'FX rate USD to destination currency',
    shipping: 'Shipping',
    calculate: 'Calculate',
    knowCost: 'I know cost',
    shippingCost: 'Shipping cost',
    hsCollected: 'Collected HS details',
    qtyShort: 'Qty',
    priceShort: 'Price',
    currencyShort: 'Currency',
    fxShort: 'FX',
    incotermShort: 'Incoterm'
  },
  ru: {
    title: 'Параметры поставки',
    subtitle: 'Настройте товар и маршрут.',
    reset: 'Сбросить',
    productName: 'Название товара',
    countryFrom: 'Страна отправления',
    countryTo: 'Страна назначения',
    originPort: 'Порт отправления',
    destinationPort: 'Порт назначения',
    countryHint: 'Выберите страну стрелкой или переключитесь на ручной ввод.',
    autoSelect: 'Автовыбор',
    quantity: 'Количество',
    price: 'Цена',
    currency: 'Валюта',
    incoterm: 'Инкотермс',
    dimensions: 'Габариты и вес',
    cbm: 'CBM',
    packageSize: 'Размер упаковки',
    container: 'Контейнер',
    volume: 'Объём (м3)',
    weight: 'Вес (кг)',
    hsCode: 'HS код',
    findIt: 'Найти',
    iKnowIt: 'Я знаю код',
    manualHs: 'Введите HS код вручную',
    fxRate: 'Курс USD к валюте назначения',
    shipping: 'Доставка',
    calculate: 'Рассчитать',
    knowCost: 'Я знаю стоимость',
    shippingCost: 'Стоимость доставки',
    hsCollected: 'Собранные данные ТН ВЭД',
    qtyShort: 'Кол-во',
    priceShort: 'Цена',
    currencyShort: 'Валюта',
    fxShort: 'Курс',
    incotermShort: 'Инкотермс'
  },
  he: {
    title: 'הגדרות משלוח',
    subtitle: 'הגדר פרטי מוצר ונתיב.',
    reset: 'איפוס',
    productName: 'שם מוצר',
    countryFrom: 'מדינת מקור',
    countryTo: 'מדינת יעד',
    originPort: 'נמל יציאה',
    destinationPort: 'נמל יעד',
    countryHint: 'בחר מדינה מהחץ או עבור להזנה ידנית.',
    autoSelect: 'בחירה אוטומטית',
    quantity: 'כמות',
    price: 'מחיר',
    currency: 'מטבע',
    incoterm: 'Incoterm',
    dimensions: 'נפח ומשקל',
    cbm: 'CBM',
    packageSize: 'גודל אריזה',
    container: 'מכולה',
    volume: 'נפח (מ"ק)',
    weight: 'משקל (ק"ג)',
    hsCode: 'קוד HS',
    findIt: 'מצא',
    iKnowIt: 'אני יודע',
    manualHs: 'הזן קוד HS ידנית',
    fxRate: 'שער USD למטבע היעד',
    shipping: 'משלוח',
    calculate: 'חשב',
    knowCost: 'אני יודע עלות',
    shippingCost: 'עלות משלוח',
    hsCollected: 'פרטי HS שנאספו',
    qtyShort: 'כמות',
    priceShort: 'מחיר',
    currencyShort: 'מטבע',
    fxShort: 'שער',
    incotermShort: 'Incoterm'
  }
};

const CURRENCIES = ['USD', 'EUR', 'ILS'];
const INCOTERMS = ['EXW', 'FOB', 'CIF', 'DAP'];

const getPorts = (country) => PORTS_BY_COUNTRY[country] || [];
const CUSTOM_COUNTRY_VALUE = '__custom__';

const isPresetCountry = (country) => COUNTRY_OPTIONS.includes(country);

export default function ProductForm({ values, onChange, onReset, language }) {
  const t = COPY[language] || COPY.en;
  const originPorts = getPorts(values.countryFrom);
  const destinationPorts = getPorts(values.countryTo);
  const dir = language === 'he' ? 'rtl' : 'ltr';
  const countryFromSelectValue = isPresetCountry(values.countryFrom)
    ? values.countryFrom
    : CUSTOM_COUNTRY_VALUE;
  const countryToSelectValue = isPresetCountry(values.countryTo)
    ? values.countryTo
    : CUSTOM_COUNTRY_VALUE;

  const handleCountrySelect = (field) => (event) => {
    const nextValue = event.target.value;
    if (nextValue === CUSTOM_COUNTRY_VALUE) {
      if (isPresetCountry(values[field])) {
        onChange({ target: { name: field, value: '' } });
      }
      return;
    }

    onChange({ target: { name: field, value: nextValue } });
  };

  const handleCountryCustomInput = (field) => (event) => {
    onChange({ target: { name: field, value: event.target.value } });
  };

  return (
    <section
      dir={dir}
      className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-black/20 md:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{t.title}</h2>
          <p className="text-sm text-slate-400">{t.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-brand-500 hover:text-white"
        >
          {t.reset}
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        <input
          type="text"
          name="productName"
          value={values.productName}
          onChange={onChange}
          placeholder={t.productName}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
        />

        <p className="text-xs text-slate-500">{t.countryHint}</p>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-300">
            {t.countryFrom}
            <select
              name="countryFromSelect"
              value={countryFromSelectValue}
              onChange={handleCountrySelect('countryFrom')}
              className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
            >
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
              <option value={CUSTOM_COUNTRY_VALUE}>Другая страна (ввести вручную)</option>
            </select>
            {countryFromSelectValue === CUSTOM_COUNTRY_VALUE ? (
              <input
                type="text"
                name="countryFrom"
                value={values.countryFrom}
                onChange={handleCountryCustomInput('countryFrom')}
                placeholder="China / Brazil / UAE ..."
                className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
              />
            ) : null}
          </label>

          <label className="grid gap-2 text-sm text-slate-300">
            {t.countryTo}
            <select
              name="countryToSelect"
              value={countryToSelectValue}
              onChange={handleCountrySelect('countryTo')}
              className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
            >
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
              <option value={CUSTOM_COUNTRY_VALUE}>Другая страна (ввести вручную)</option>
            </select>
            {countryToSelectValue === CUSTOM_COUNTRY_VALUE ? (
              <input
                type="text"
                name="countryTo"
                value={values.countryTo}
                onChange={handleCountryCustomInput('countryTo')}
                placeholder="Canada / Germany / Japan ..."
                className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
              />
            ) : null}
          </label>

          <label className="grid gap-2 text-sm text-slate-300">
            {t.originPort}
            <input
              type="text"
              list="origin-ports"
              name="originPort"
              value={values.originPort}
              onChange={onChange}
              placeholder={t.autoSelect}
              className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-300">
            {t.destinationPort}
            <input
              type="text"
              list="destination-ports"
              name="destinationPort"
              value={values.destinationPort}
              onChange={onChange}
              placeholder={t.autoSelect}
              className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
            />
          </label>
        </div>

        <datalist id="origin-ports">
          {originPorts.map((port) => (
            <option key={port} value={port} />
          ))}
        </datalist>
        <datalist id="destination-ports">
          {destinationPorts.map((port) => (
            <option key={port} value={port} />
          ))}
        </datalist>

        <div className="grid gap-4 md:grid-cols-5">
          <label className="grid gap-1 text-xs uppercase tracking-[0.2em] text-slate-500">
            {t.qtyShort}
            <input
              type="number"
              name="quantity"
              value={values.quantity}
              onChange={onChange}
              min="0"
              step="1"
              placeholder={t.quantity}
              className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
            />
          </label>
          <label className="grid gap-1 text-xs uppercase tracking-[0.2em] text-slate-500">
            {t.priceShort}
            <input
              type="number"
              name="price"
              value={values.price}
              onChange={onChange}
              min="0"
              step="0.01"
              placeholder={t.price}
              className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
            />
          </label>
          <label className="grid gap-1 text-xs uppercase tracking-[0.2em] text-slate-500">
            {t.currencyShort}
            <select
              name="currency"
              value={values.currency}
              onChange={onChange}
              className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
            >
              {CURRENCIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs uppercase tracking-[0.2em] text-slate-500">
            {t.fxShort}
            <input
              type="number"
              name="fxRateOverride"
              value={values.fxRateOverride}
              onChange={onChange}
              min="0"
              step="0.0001"
              placeholder={t.fxRate}
              className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
            />
          </label>
          <label className="grid gap-1 text-xs uppercase tracking-[0.2em] text-slate-500">
            {t.incotermShort}
            <select
              name="incoterm"
              value={values.incoterm}
              onChange={onChange}
              className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
            >
              {INCOTERMS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-xl border border-slate-800 p-4">
          <p className="text-sm font-medium text-slate-200">{t.dimensions}</p>
          <div className="mt-3 flex flex-wrap gap-6 text-sm text-slate-300">
            {['cbm', 'package', 'container'].map((mode) => (
              <label key={mode} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="dimensionMode"
                  value={mode}
                  checked={values.dimensionMode === mode}
                  onChange={onChange}
                />
                <span>
                  {mode === 'cbm'
                    ? t.cbm
                    : mode === 'package'
                      ? t.packageSize
                      : t.container}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <input
              type="number"
              name="volume"
              value={values.volume}
              onChange={onChange}
              step="0.01"
              min="0"
              placeholder={t.volume}
              className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
            />
            <input
              type="number"
              name="weight"
              value={values.weight}
              onChange={onChange}
              step="0.01"
              min="0"
              placeholder={t.weight}
              className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
