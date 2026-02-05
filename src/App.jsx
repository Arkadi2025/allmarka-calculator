import { useMemo, useState } from 'react';

import CustomsPanel from './components/CustomsPanel.jsx';
import Header from './components/Header.jsx';
import HsSection from './components/HsSection.jsx';
import ProductForm from './components/ProductForm.jsx';
import ResultsPanel from './components/ResultsPanel.jsx';
import ShippingSection from './components/ShippingSection.jsx';
import { CUSTOMS, DUTY, VAT } from './data/importData.js';

const DEFAULTS = {
  price: 2500,
  shipping: 320,
  insurance: 60,
  quantity: 120,
  dutyRate: DUTY.standardRate,
  vatRate: VAT.standardRate,
  brokerage: CUSTOMS.brokerageDefault
};

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
    const quantity = toNumber(values.quantity);
    const dutyRate = toNumber(values.dutyRate) / 100;
    const vatRate = toNumber(values.vatRate) / 100;
    const brokerage = toNumber(values.brokerage);

    const subtotal = price + shipping + insurance;
    const duty = subtotal * dutyRate;
    const vatBase = subtotal + duty + brokerage;
    const vat = vatBase * vatRate;
    const total = subtotal + duty + vat + brokerage;
    const safeQuantity = quantity > 0 ? quantity : 1;
    const perUnit = total / safeQuantity;

    return {
      subtotal,
      duty,
      vat,
      brokerage,
      total,
      perUnit,
      quantity: safeQuantity
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
        <Header />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <ProductForm
              values={values}
              onChange={handleChange}
              onReset={reset}
            />
            <ShippingSection values={values} onChange={handleChange} />
            <CustomsPanel values={values} onChange={handleChange} />
            <HsSection />
          </div>

          <ResultsPanel totals={totals} />
        </div>
      </div>
    </div>
  );
}
