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

export const COUNTRY_IMPORT_PROFILES = {
  default: {
    dutyRate: 7.5,
    vatRate: 18,
    brokerage: 75,
    currency: 'USD',
    fxRate: 1,
    notes:
      'Базовый профиль. Для финального оформления проверьте официальные классификаторы и локальные ставки в стране назначения.'
  },
  israel: {
    dutyRate: 12,
    vatRate: 17,
    brokerage: 90,
    currency: 'ILS',
    fxRate: 3.65
  },
  usa: {
    dutyRate: 4,
    vatRate: 0,
    brokerage: 120,
    currency: 'USD',
    fxRate: 1
  },
  germany: {
    dutyRate: 5,
    vatRate: 19,
    brokerage: 95,
    currency: 'EUR',
    fxRate: 0.92
  },
  canada: {
    dutyRate: 6,
    vatRate: 5,
    brokerage: 95,
    currency: 'CAD',
    fxRate: 1.36
  },
  china: {
    dutyRate: 8,
    vatRate: 13,
    brokerage: 85,
    currency: 'CNY',
    fxRate: 7.2
  },
  india: {
    dutyRate: 10,
    vatRate: 18,
    brokerage: 80,
    currency: 'INR',
    fxRate: 83.1
  },
  turkey: {
    dutyRate: 8,
    vatRate: 20,
    brokerage: 85,
    currency: 'TRY',
    fxRate: 32.5
  },
  uae: {
    dutyRate: 5,
    vatRate: 5,
    brokerage: 70,
    currency: 'AED',
    fxRate: 3.67
  }
};

export const CUSTOMS_FALLBACK_GUIDE = {
  default:
    'Если HS-код не определён, подготовьте техописание, состав/материал, фото, назначение товара и передайте брокеру для предварительной классификации до отгрузки.',
  Israel:
    'Для Израиля запросите предварительное мнение по классификации (если доступно) через брокера/каналы таможни и держите готовыми: datasheet, инвойс, COO и описание назначения товара.',
  Canada:
    'Для Канады используйте материалы CBSA по tariff classification и подготовьте полный product brief, состав/материалы и декларацию производителя для поддержки pre-ruling.',
  Germany:
    'Для Германии/ЕС используйте TARIC и подготовьте состав, назначение и техописание для консультанта по таможне (при необходимости — процедура BTI).'
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
