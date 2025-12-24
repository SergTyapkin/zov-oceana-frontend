export const IMAGES_URL_BASE_PATH = '/images/';

export const DISABLED_CACHING_URLS = [
  '/user',
]

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
