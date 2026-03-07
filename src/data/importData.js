export const COUNTRY_OPTIONS = [
  'China',
  'Turkey',
  'India',
  'UAE',
  'Israel',
  'Canada',
  'USA',
  'Germany'
];

export const PORTS_BY_COUNTRY = {
  China: ['Shanghai', 'Ningbo', 'Shenzhen'],
  Turkey: ['Istanbul', 'Mersin', 'Izmir'],
  India: ['Nhava Sheva', 'Chennai', 'Mundra'],
  UAE: ['Jebel Ali', 'Abu Dhabi', 'Sharjah'],
  Israel: ['Haifa', 'Ashdod', 'Eilat'],
  Canada: ['Vancouver', 'Montreal', 'Halifax'],
  USA: ['Los Angeles', 'New York', 'Houston'],
  Germany: ['Hamburg', 'Bremerhaven', 'Wilhelmshaven']
};

export const COUNTRIES = COUNTRY_OPTIONS;
export const PORTS = ['Shanghai', 'Ningbo', 'Istanbul', 'Jebel Ali', 'Haifa', 'Vancouver'];

export const HS_CHAPTERS = [
  '84 — Machinery',
  '85 — Electronics',
  '87 — Vehicles',
  '90 — Optical and medical instruments',
  '61 — Knitted apparel',
  '62 — Woven apparel'
];

export const HS_CHAPTERS_FALLBACK = [
  '39 — Plastics',
  '73 — Iron and steel articles',
  '94 — Furniture',
  '95 — Toys and games'
];

export const HS_DATABASES = [
  {
    name: 'Israel Customs',
    url: 'https://shaarolami-query.customs.mof.gov.il/'
  },
  {
    name: 'EU TARIC',
    url: 'https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp?Lang=en'
  },
  {
    name: 'WCO HS',
    url: 'https://www.wcoomd.org/en/topics/nomenclature/overview/what-is-the-harmonized-system.aspx'
  }
];

export const DESTINATION_FX = {
  China: { currency: 'CNY', rate: 7.2 },
  Turkey: { currency: 'TRY', rate: 32.5 },
  India: { currency: 'INR', rate: 83.1 },
  UAE: { currency: 'AED', rate: 3.67 },
  Israel: { currency: 'ILS', rate: 3.65 },
  Canada: { currency: 'CAD', rate: 1.36 },
  USA: { currency: 'USD', rate: 1 },
  Germany: { currency: 'EUR', rate: 0.92 }
};

export const CUSTOMS_FALLBACK_GUIDE = {
  default:
    'If HS code cannot be determined, submit technical specs, product composition, photos, and intended use to a licensed customs broker for pre-classification before shipment.',
  Israel:
    'For Israel, request a preliminary classification opinion (if available) via customs/broker channels and keep product datasheets, invoice, COO, and usage description ready for clearance review.',
  Canada:
    'For Canada, consult CBSA tariff classification resources and keep a full product brief, materials, and manufacturer declaration for broker pre-ruling support.',
  Germany:
    'For Germany/EU, use TARIC guidance and prepare product composition + intended use details for an EU customs advisor to obtain a binding tariff information route when needed.'
};

export const VAT = {
  standardRate: 18
};

export const DUTY = {
  standardRate: 7.5
};

export const CUSTOMS = {
  brokerageDefault: 75
};
