import { useMemo, useState } from 'react';

import CustomsPanel from './components/CustomsPanel.jsx';
import Header from './components/Header.jsx';
import HsSection from './components/HsSection.jsx';
import ProductForm from './components/ProductForm.jsx';
import ResultsPanel from './components/ResultsPanel.jsx';
import ShippingSection from './components/ShippingSection.jsx';
import { COUNTRY_IMPORT_PROFILES, COUNTRY_OPTIONS, CUSTOMS, DESTINATION_FX, DUTY, VAT } from './data/importData.js';

const DEFAULTS = {
  productName: '',
  countryFrom: COUNTRY_OPTIONS[0],
  countryTo: COUNTRY_OPTIONS[5],
  originPort: '',
  destinationPort: '',
  quantity: 120,
  price: 2500,
  currency: 'USD',
  incoterm: 'EXW',
  dimensionMode: 'cbm',
  volume: '',
  weight: '',
  hsMode: 'find',
  manualHsCode: '',
  hsFoundTitle: '',
  hsFoundSource: '',
  hsComplianceNote: '',
  fxRateOverride: '',
  shippingMode: 'calculate',
  deliveryMode: 'sea',
  shipping: 320,
  insurance: 60,
  dutyRate: DUTY.standardRate,
  vatRate: VAT.standardRate,
  brokerage: CUSTOMS.brokerageDefault,
  fxRateGoods: 3.12,
  fxRateTax: 3.4,
  computerFee: 41,
  securityFee: 48,
  localLogistics: 3944,
  inlandDelivery: 900
};

const countryProfileAliases = { us: 'usa', 'united states': 'usa', de: 'germany', il: 'israel', ae: 'uae' };

const REGION_BY_COUNTRY = {
  china: 'asia',
  india: 'asia',
  uae: 'middle-east',
  turkey: 'europe',
  germany: 'europe',
  canada: 'north-america',
  usa: 'north-america',
  israel: 'middle-east'
};

const SHIPPING_RATE_BOOK = {
  sea: { perCbm: 115, minCharge: 220, insuranceRatio: 0.02 },
  air: { perChargeableKg: 6.8, minCharge: 160, volumetricKgPerCbm: 167, insuranceRatio: 0.01 },
  land: { perKg: 1.15, perCbm: 78, minCharge: 140, insuranceRatio: 0.015 }
};

const getCountryProfile = (country) => {
  const normalized = String(country || '').toLowerCase().trim();
  const key = countryProfileAliases[normalized] || normalized;
  return COUNTRY_IMPORT_PROFILES[key] || COUNTRY_IMPORT_PROFILES.default;
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

const getRouteFactor = (fromCountry, toCountry) => {
  const from = String(fromCountry || '').toLowerCase().trim();
  const to = String(toCountry || '').toLowerCase().trim();
  if (!from || !to) {
    return 1;
  }
  if (from === to) {
    return 0.35;
  }

  const fromRegion = REGION_BY_COUNTRY[from];
  const toRegion = REGION_BY_COUNTRY[to];
  if (fromRegion && toRegion && fromRegion === toRegion) {
    return 0.8;
  }

  return 1.18;
};

const getMarketFactor = (date) => {
  const hourFactor = 1 + ((date.getUTCHours() - 12) / 24) * 0.06;
  const dayFactor = 1 + ((date.getUTCDay() - 3) / 7) * 0.03;
  return Math.max(0.9, Math.min(1.12, hourFactor * dayFactor));
};

const estimateShipping = ({ values, now }) => {
  const mode = values.deliveryMode || 'sea';
  const rates = SHIPPING_RATE_BOOK[mode] || SHIPPING_RATE_BOOK.sea;
  const volume = Math.max(0, toNumber(values.volume));
  const weight = Math.max(0, toNumber(values.weight));
  const routeFactor = getRouteFactor(values.countryFrom, values.countryTo);
  const marketFactor = getMarketFactor(now);

  let baseCost = 0;
  let basisLabel = '';

  if (mode === 'sea') {
    const usedCbm = volume > 0 ? volume : Math.max(0.1, weight / 350);
    baseCost = Math.max(rates.minCharge, usedCbm * rates.perCbm);
    basisLabel = `${usedCbm.toFixed(2)} CBM × ${rates.perCbm} USD`;
  } else if (mode === 'air') {
    const chargeableWeight = Math.max(weight, volume * rates.volumetricKgPerCbm, 1);
    baseCost = Math.max(rates.minCharge, chargeableWeight * rates.perChargeableKg);
    basisLabel = `${chargeableWeight.toFixed(1)} chargeable kg × ${rates.perChargeableKg} USD`;
  } else {
    const byWeight = weight * rates.perKg;
    const byVolume = volume * rates.perCbm;
    const dominant = Math.max(byWeight, byVolume);
    baseCost = Math.max(rates.minCharge, dominant);
    basisLabel = `max(${weight.toFixed(1)}kg×${rates.perKg}, ${volume.toFixed(2)}m³×${rates.perCbm})`;
  }

  const totalUsd = baseCost * routeFactor * marketFactor;

  return {
    mode,
    basisLabel,
    routeFactor,
    marketFactor,
    totalUsd,
    generatedAt: now.toISOString().replace('T', ' ').slice(0, 16) + ' UTC'
  };
};

export default function App() {
  const [language, setLanguage] = useState('en');
  const [values, setValues] = useState(DEFAULTS);

  const marketEstimate = useMemo(() => estimateShipping({ values, now: new Date() }), [values]);

  const totals = useMemo(() => {
    const priceUsd = toNumber(values.price);
    const shippingManual = toNumber(values.shipping);
    const shippingUsd = values.shippingMode === 'calculate' ? marketEstimate.totalUsd : shippingManual;
    const insuranceUsd = toNumber(values.insurance);
    const quantity = toNumber(values.quantity);

    const dutyRate = toNumber(values.dutyRate) / 100;
    const vatRate = toNumber(values.vatRate) / 100;

    const fxGoods = Math.max(0.0001, toNumber(values.fxRateGoods) || 1);
    const fxTax = Math.max(0.0001, toNumber(values.fxRateTax) || fxGoods);

    const computerFee = toNumber(values.computerFee);
    const securityFee = toNumber(values.securityFee);
    const localLogistics = toNumber(values.localLogistics);
    const inlandDelivery = toNumber(values.inlandDelivery);
    const brokerage = toNumber(values.brokerage);

    const internationalUsd = shippingUsd + insuranceUsd;
    const purchaseNis = priceUsd * fxGoods;
    const internationalNis = internationalUsd * fxGoods;
    const cifNis = purchaseNis + internationalNis;

    const taxBaseNis = (priceUsd + internationalUsd) * fxTax;
    const dutyNis = taxBaseNis * dutyRate;
    const vatNis = (taxBaseNis + dutyNis) * vatRate;
    const customsTotalNis = dutyNis + vatNis + computerFee + securityFee;

    const totalNis = cifNis + customsTotalNis + localLogistics + inlandDelivery + brokerage;

    const destinationFx = DESTINATION_FX[values.countryTo] || {
      currency: getCountryProfile(values.countryTo).currency,
      rate: getCountryProfile(values.countryTo).fxRate
    };
    const manualFx = toNumber(values.fxRateOverride);
    const effectiveRate = manualFx > 0 ? manualFx : destinationFx.rate;

    const totalUsd = totalNis / fxGoods;
    const safeQuantity = quantity > 0 ? quantity : 1;
    const perUnitNis = totalNis / safeQuantity;
    const perUnitUsd = totalUsd / safeQuantity;
    const totalInDestinationCurrency = totalUsd * effectiveRate;

    return {
      priceUsd,
      shippingUsd,
      insuranceUsd,
      internationalUsd,
      purchaseNis,
      internationalNis,
      cifNis,
      taxBaseNis,
      dutyNis,
      vatNis,
      customsTotalNis,
      computerFee,
      securityFee,
      localLogistics,
      inlandDelivery,
      brokerage,
      totalNis,
      total: totalUsd,
      perUnit: perUnitUsd,
      perUnitNis,
      quantity: safeQuantity,
      destinationCurrency: destinationFx.currency,
      destinationRate: effectiveRate,
      destinationCountry: values.countryTo,
      totalInDestinationCurrency,
      fxGoods,
      fxTax
    };
  }, [values, marketEstimate]);

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
        <Header language={language} onLanguageChange={setLanguage} />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <ProductForm
              values={values}
              onChange={handleChange}
              onReset={reset}
              language={language}
            />
            <HsSection
              productName={values.productName}
              destinationCountry={values.countryTo}
              onProductNameChange={(value) =>
                setValues((prev) => ({
                  ...prev,
                  productName: value
                }))
              }
              onApplyHsResult={(payload) => {
                setValues((prev) => ({
                  ...prev,
                  hsMode: 'manual',
                  manualHsCode: payload.code || prev.manualHsCode,
                  dutyRate: payload.dutyRate ?? prev.dutyRate,
                  vatRate: payload.vatRate ?? prev.vatRate,
                  hsFoundTitle: payload.title || '',
                  hsFoundSource: payload.source || '',
                  hsComplianceNote: payload.note || ''
                }));
              }}
            />
            <ShippingSection values={values} onChange={handleChange} marketEstimate={marketEstimate} />
            <CustomsPanel values={values} onChange={handleChange} />
          </div>

          <ResultsPanel totals={totals} />
        </div>
      </div>
    </div>
  );
}
