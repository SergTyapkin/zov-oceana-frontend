export const IMAGES_URL_BASE_PATH = '/images/';

export const TBANK_PAYMENT_SCRIPT_URL = 'https://integrationjs.tbank.ru/integration.js';

export const PAYMENT_TIME_TO_BE_PAYED_MS = 15 * 60 * 1000; // 15 min

export const DISABLED_CACHING_URLS = [
  '/user',
];

export const QUERY_PARAM_REFERRER_ID = 'referrerId';

export const OrderStatuses = {
  created: {
    title: 'Не оплачен',
    color: 'yellow',
  },
  paid: {
    title: 'Оплачен',
    color: 'green',
  },
  prepared: {
    title: 'Собран',
    color: 'green',
  },
  delivered: {
    title: 'Доставлен',
    color: 'blue',
  },
  cancelled: {
    title: 'Отменен',
    color: 'red',
  },
};


export const COMPANY_PHONE = '+7-926-325-2452';
export const COMPANY_PHONE_RAW = '+79263252452';
export const COMPANY_EMAIL = 'support@zov-oceana.ru';
export const COMPANY_WORK_PLAN = 'Пн-Пт 9:00-18:00 МСК';
export const COMPANY_TITLE = 'Зов Океана';
export const COMPANY_FULL_NAME = 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ ГРУЗДКОВ АЛЕКСАНДР НИКОЛАЕВИЧ';
export const COMPANY_SHORT_NAME = 'ИП Груздков А.Н.';
export const COMPANY_LEGAL_ADDRESS = '346974, РОССИЯ, РОСТОВСКАЯ ОБЛ, МАТВЕЕВО-КУРГАНСКИЙ Р-Н, С РЯЖЕНОЕ, УЛ ГОРЬКОГО, Д 32, КВ 82';
export const COMPANY_INN = '891103098408';
export const COMPANY_OGRN = '324619600218605';
export const COMPANY_DATA_UPDATED_DATE = '14 августа';
export const COMPANY_DATA_UPDATED_YEAR = '2026';
export const COMPANY_BANK_ACCOUNT = '40802810900009630684';
export const COMPANY_BANK_NAME = 'АО «ТБанк»';
export const COMPANY_BANK_BIC = '044525974';
export const COMPANY_BANK_CORR_ACCOUNT = '30101810145250000974';