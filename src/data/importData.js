export const COUNTRIES = ['Китай', 'Турция', 'Индия', 'ОАЭ', 'Европа'];
export const PORTS = ['Шанхай', 'Нингбо', 'Стамбул', 'Джебель-Али'];
export const HS_CHAPTERS = [
  '85 — Электрооборудование',
  '87 — Транспортные средства',
  '90 — Оптика и измерительные приборы',
  '61 — Одежда трикотажная'
];

export const HS_CHAPTERS_FALLBACK = [
  '84 — Механические устройства',
  '62 — Одежда текстильная',
  '39 — Пластмассы и изделия из них',
  '73 — Изделия из чугуна или стали'
];

export const HS_DATABASES = [
  {
    name: 'Официальная база (Israel)',
    url: 'https://shaarolami-query.customs.mof.gov.il/'
  },
  {
    name: 'World Customs Organization',
    url: 'https://www.wcoomd.org/en/topics/nomenclature/hs-nomenclature/hs-nomenclature-2022-edition.aspx'
  },
  {
    name: 'European TARIC',
    url: 'https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp?Lang=en'
  }
];

export const VAT = {
  standardRate: 12
};

export const DUTY = {
  standardRate: 7.5
};

export const CUSTOMS = {
  brokerageDefault: 75
};
