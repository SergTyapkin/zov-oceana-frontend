import swAPI from '~/serviceWorker/swAPI';
import routes from '~/routes';
import { Address } from '~/utils/models';
import { TBANK_PAYMENT_SCRIPT_URL } from '~/constants';

export function getRequestFoo<APIFoo extends (...args: any) => any, Fallback>(
  popupsError: (title: string, desc: string) => any,
) {
  return async (
    context: { loading: boolean },
    apiRequest: APIFoo,
    args: Parameters<APIFoo>,
    errorText: string,
    callback?: (data: Awaited<ReturnType<APIFoo>>['data'], status: number) => any,
    toFallbackValue?: Fallback,
    errorCallbacks?: { [key: number]: () => any },
  ) => {
    context.loading = true;
    try {
      const { status, ok, data } = await apiRequest(...<any[]>args);
      context.loading = false;
      if (!ok) {
        const errCallback = errorCallbacks?.[status];
        if (errCallback) {
          errCallback();
          return toFallbackValue;
        }
        if (toFallbackValue) {
          return toFallbackValue;
        }
        const errorTextFromBackend: string | undefined = data?.info;
        const totalErrorText = errorText + (errorTextFromBackend ? ' | ' + errorTextFromBackend : '');
        popupsError(`Ошибка ${status}`, totalErrorText);
        throw new Error(`Ошибка ${status} при запросе на API. ${totalErrorText}`);
      }
      callback?.(data, status);
      return data;
    } catch (err) {
      context.loading = false;
      console.error('Error while executing $request:', err);
    }
  }
}

export function getCookie(name: string) {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  options: { path?: string; expires?: Date | string; 'max-age'?: number;[key: string]: any } = {},
) {
  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options,
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (const optionKey in options) {
    updatedCookie += '; ' + optionKey;
    const optionValue = options[optionKey as keyof typeof options];
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
  setCookie(name, '', {
    'max-age': -1,
  });
}

export function toDebounced(callee: (...args: unknown[]) => unknown, timeoutMs: number) {
  return function perform(this: { lastCall: number, lastCallTimer: ReturnType<typeof setTimeout> }, ...args: unknown[]) {
    const previousCall = this.lastCall;

    this.lastCall = Date.now();

    if (previousCall && (this.lastCall - previousCall <= timeoutMs)) {
      clearTimeout(this.lastCallTimer);
    }

    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
  };
}

export function detectBrowser() {
  let result = 'Other';
  if (navigator.userAgent.indexOf('YaBrowser') !== -1) {
    result = 'Yandex Browser';
  } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
    result = 'Mozilla Firefox';
  } else if (navigator.userAgent.indexOf('MSIE') !== -1) {
    result = 'Internet Exploder';
  } else if (navigator.userAgent.indexOf('Edge') !== -1) {
    result = 'Microsoft Edge';
  } else if (navigator.userAgent.indexOf('Safari') !== -1) {
    result = 'Safari';
  } else if (navigator.userAgent.indexOf('Opera') !== -1) {
    result = 'Opera';
  } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
    result = 'Google Chrome';
  }
  return result;
}

export function detectOS() {
  if (window.navigator.userAgent.indexOf('Windows NT 11.0') !== -1) return 'Windows 11';
  if (window.navigator.userAgent.indexOf('Windows NT 10.0') !== -1) return 'Windows 10';
  if (window.navigator.userAgent.indexOf('Windows NT 6.3') !== -1) return 'Windows 8.1';
  if (window.navigator.userAgent.indexOf('Windows NT 6.2') !== -1) return 'Windows 8';
  if (window.navigator.userAgent.indexOf('Windows NT 6.1') !== -1) return 'Windows 7';
  if (window.navigator.userAgent.indexOf('Windows NT 6.0') !== -1) return 'Windows Vista';
  if (window.navigator.userAgent.indexOf('Windows NT 5.1') !== -1) return 'Windows XP';
  if (window.navigator.userAgent.indexOf('Windows NT 5.0') !== -1) return 'Windows 2000';
  if (window.navigator.userAgent.indexOf('Mac') !== -1) return 'Mac'; // Macintosh, MacIntel, MacPPC, Mac68K
  if (window.navigator.userAgent.indexOf('iP') !== -1) return 'iOS'; // iPad, iPhone, iPod
  if (window.navigator.userAgent.indexOf('Android') !== -1) return 'Android';
  if (window.navigator.userAgent.indexOf('X11') !== -1) return 'UNIX';
  if (window.navigator.userAgent.indexOf('Linux') !== -1) return 'Linux';
  return 'Unknown OS';
}

export function deepClone<T>(obj: T): T {
  const ret = (obj instanceof Array ? [] : {}) as T;
  for (const key in obj) {
    if (obj[key] === undefined) {
      continue;
    }
    let val = obj[key];
    if (val && typeof (val) == 'object') {
      val = deepClone(val);
    }
    ret[key] = val;
  }
  return ret;
}


const SUPPORTED_LANGUAGES = ['en', 'ru'];
type Language = (typeof SUPPORTED_LANGUAGES)[number];
let userLanguage: Language = SUPPORTED_LANGUAGES[0];
for (const lang of navigator.languages) {
  if (SUPPORTED_LANGUAGES.includes(lang)) {
    userLanguage = lang;
    break;
  }
}
const TRANSLATIONS: Record<string, Record<Language, string>> = {
  today: {en: 'Today', ru: 'Сегодня'},
  yesterday: {en: 'Yesterday', ru: 'Вчера'},
  tomorrow: {en: 'Tomorrow', ru: 'Завтра'},
  now: {en: 'Now', ru: 'Сейчас'},
  zero: {en: 'From start', ru: 'С начала'},
  from: {en: 'From', ru: 'С'},
  to: {en: 'To', ru: 'До'},
  allTime: {en: 'All time', ru: 'Все время'},

  yearOne:   { en: 'Year',     ru: 'Год' },
  yearFew:   { en: 'Years',    ru: 'Года' },
  yearMany:  { en: 'Years',    ru: 'Лет' },

  monthOne:  { en: 'Month',    ru: 'Месяц' },
  monthFew:  { en: 'Months',   ru: 'Месяца' },
  monthMany: { en: 'Months',   ru: 'Месяцев' },

  dayOne:    { en: 'Day',      ru: 'День' },
  dayFew:    { en: 'Days',     ru: 'Дня' },
  dayMany:   { en: 'Days',     ru: 'Дней' },

  hourOne:   { en: 'Hour',     ru: 'Час' },
  hourFew:   { en: 'Hours',    ru: 'Часа' },
  hourMany:  { en: 'Hours',    ru: 'Часов' },

  minuteOne:  { en: 'Min',     ru: 'Мин' },
  minuteFew:  { en: 'Mins',    ru: 'Мин' },
  minuteMany: { en: 'Mins',    ru: 'Мин' },

  secondOne:  { en: 'Sec',     ru: 'Сек' },
  secondFew:  { en: 'Secs',    ru: 'Сек' },
  secondMany: { en: 'Secs',    ru: 'Сек' },
}

function getTranslation(key: keyof typeof TRANSLATIONS) {
  return TRANSLATIONS[key][userLanguage];
}

type DateTypeStyle = 'full' | 'long' | 'medium' | 'short';
const currentYear = new Date().getFullYear();
export function dateFormatter(d: Date | string | number | null, style: DateTypeStyle | any = 'medium', suppressToday = false) {
  if (!d) {
    return '';
  }
  d = new Date(d);
  if (isNaN(d.getTime())) return '';

  if (typeof style !== 'string') {
    style = 'medium';
  }
  if (d.toDateString() === new Date().toDateString()) {
    return suppressToday ? '' : getTranslation('today');
  } else if (d.toDateString() === new Date(new Date().getTime() - 1000 * 60 * 60 * 24).toDateString()) {
    return getTranslation('yesterday');
  } else if (d.toDateString() === new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toDateString()) {
    return getTranslation('tomorrow');
  }
  return d.toLocaleDateString(userLanguage, { dateStyle: style }).replace(' г.', '').replace(String(currentYear), '').replace(/\./, '');
}

export function timeFormatter(d: Date | string | number | null, style: DateTypeStyle | any = 'short') {
  if (!d) {
    return '';
  }
  d = new Date(d);
  if (isNaN(d.getTime())) return '';

  if (typeof style !== 'string') {
    style = 'short';
  }
  return d.toLocaleTimeString(userLanguage, { timeStyle: style });
}

export function timeMinutesFormatter(d: Date | null) {
  const str = timeFormatter(d, 'medium');
  const idx = str.indexOf(':');
  return str.slice(idx + 1);
}

export function timeDurationFormatter(d: Date | string | number | null): string {
    if (!d) return '';

    d = new Date(d);
    if (isNaN(d.getTime())) return '';

    const from = new Date(0);
    const to = d;

    let years   = to.getFullYear() - from.getFullYear();
    let months  = to.getMonth()    - from.getMonth();
    let days    = to.getDate()     - from.getDate();
    let hours   = to.getHours()    - from.getHours();
    let minutes = to.getMinutes()  - from.getMinutes();
    let seconds = to.getSeconds()  - from.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours   < 0) { hours   += 24; days--; }
    if (days    < 0) {
        const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }
    if (months  < 0) { months += 12; years--; }

    // Принимает ключи объекта TRANSLATIONS
    const plural = (n: number, oneKey: string, fewKey: string, manyKey: string): string => {
        const mod10  = n % 10;
        const mod100 = n % 100;
        if (mod10 === 1 && mod100 !== 11) return getTranslation(oneKey).toLocaleLowerCase();
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return getTranslation(fewKey).toLocaleLowerCase();
        return getTranslation(manyKey).toLocaleLowerCase();
    };

    const parts: string[] = [];

    if (years   > 0) parts.push(`${years} ${plural(years,   'yearOne',   'yearFew',   'yearMany')}`);
    if (months  > 0) parts.push(`${months} ${plural(months,  'monthOne',  'monthFew',  'monthMany')}`);
    if (days    > 0) parts.push(`${days} ${plural(days,    'dayOne',    'dayFew',    'dayMany')}`);
    if (hours   > 0) parts.push(`${hours} ${plural(hours,   'hourOne',   'hourFew',   'hourMany')}`);
    if (minutes > 0) parts.push(`${minutes} ${plural(minutes, 'minuteOne', 'minuteFew', 'minuteMany')}`);
    if (seconds > 0) parts.push(`${seconds} ${plural(seconds, 'secondOne', 'secondFew', 'secondMany')}`);

    if (parts.length === 0) {
        return `0 ${getTranslation('secondMany')}`;
    }

    return parts.join(' ');
}

export function dateTimeFormatter(
  d: Date | string | number | null,
  dateStyle: DateTypeStyle | any = 'medium',
  timeStyle: DateTypeStyle | any = 'short',
  suppressToday = false
) {
  if (!d) {
    return '';
  }
  d = new Date(d);
  if (isNaN(d.getTime())) return '';

  const minutes = d.getTime() / 1000 / 60;
  const nowMinutes = (new Date()).getTime() / 1000 / 60;
  // console.log(minutes, (d).toLocaleTimeString(), nowMinutes, (new Date()).toLocaleTimeString())
  if (d.toDateString() === (new Date()).toDateString() && (nowMinutes - 3 < minutes && minutes < nowMinutes + 3)) {
    return getTranslation('now');
  }
  if (d.getTime() < 1000 * 60 * 60 * 24) { // 1 day from 1970
    return getTranslation('zero');
  }
  if (typeof dateStyle !== 'string') {
    dateStyle = 'medium';
  }
  if (typeof timeStyle !== 'string') {
    timeStyle = 'short';
  }
  const date = dateFormatter(d, dateStyle, suppressToday);
  const time = timeFormatter(d, timeStyle);
  if (!date) {
    return time;
  }
  return date + ' - ' + time;
}

export function rangeFormatter(
  from: Date | string | number | null,
  to: Date | string | number | null,
  dateStyle: DateTypeStyle | any = 'medium',
  timeStyle: DateTypeStyle | any = 'short',
) {
  if (!from || !to) {
    return '';
  }
  if (typeof dateStyle !== 'string') {
    dateStyle = 'medium';
  }
  if (typeof timeStyle !== 'string') {
    timeStyle = 'short';
  }

  from = new Date(from);
  to = new Date(to);
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return '';

  const minutesTo = to.getTime() / 1000 / 60;
  const nowMinutes = (new Date()).getTime() / 1000 / 60;
  // console.log(minutes, (d).toLocaleTimeString(), nowMinutes, (new Date()).toLocaleTimeString())
  const toIsNow = to.toDateString() === (new Date()).toDateString() && (nowMinutes - 3 < minutesTo && minutesTo < nowMinutes + 3);
  const fromIsStart = from.getTime() < 1000 * 60 * 60 * 24;

  if (!toIsNow && !fromIsStart) {
    return `${getTranslation('from')} ${dateTimeFormatter(from)} ${getTranslation('to').toLocaleLowerCase()} ${dateTimeFormatter(to)}`;
  }
  if (toIsNow && fromIsStart) {
    return getTranslation('allTime');
  }
  if (toIsNow) {
    return `${getTranslation('from')} ${dateTimeFormatter(from)}`;
  }
  // if (fromIsStart) {
  return `${getTranslation('to')} ${dateTimeFormatter(to)}`;
  // }
}

export function valuteFormatter(val: number, valuteSign = '₽') {
  return `${val < 0 ? '-' : ''}${valuteSign} ${Math.round(Math.abs(val) * 100) / 100}`;
}
export function costFormatter(val: number) {
  return valuteFormatter(val, '₽');
}
export function bonusesFormatter(val: number) {
  return valuteFormatter(val, '₿');
}

export function costFormatterWorded(val: number): string {
  let postfix = '';
  if (val >= 1_000_000_000) {
    val /= 1_000_000_000;
    postfix = 'млрд.';
  } else if (val >= 1_000_000) {
    val /= 1_000_000;
    postfix = 'млн.';
  } else if (val >= 1_000) {
    val /= 1_000;
    postfix = 'тыс.';
  }
  return `${val < 0 ? '-' : ''}₽ ${Math.floor(Math.abs(val) * 10) / 10} ${postfix}`;
}

export async function saveAllAssetsByServiceWorker(
  callbackEach?: (data: { current: string, progress: number, total: number }) => void,
  callbackFinish?: () => void,
  callbackError?: (errUrl: string | null) => void,
) {
  let allCachableResources: string[] = [];
  try {
    const module = await import(/* @vite-ignore */ `${'/assetsList.js'}`);
    allCachableResources = module.default; // list of all cachable resources urls
    console.log('Imported assetsList.js:', allCachableResources);
  } catch {
    console.warn('Cannot find assetsList.js. Nothing to cache. Maybe we are in develompent mode')
  }

  async function saveAllSite() {
    try {
      await swAPI.cacheUrls(allCachableResources, callbackEach);
      if (callbackFinish) {
        callbackFinish();
      }
    } catch (errUrl) {
      if (callbackError) {
        callbackError(errUrl as unknown as string | null);
      }
    }
  }

  async function saveAllIfNotSaved() {
    if (await swAPI.isFilesCached(allCachableResources)) {
      if (callbackFinish) {
        callbackFinish();
      }
      return;
    }
    await saveAllSite();
  }

  async function setOverrideResourceRegexps() {
    const word = '[\\w-~!*\'()<>"{}|^`]+';
    const baseUrl = `(http(s)?://${word}(\\.${word})+)`;
    const anyEnding = `([?/].*)?`;
    const regexps = {} as { [key: string]: string };
    Object.keys(routes).forEach(route => {
      if (route.includes('pathMatch')) {
        return;
      }
      route = route.replace(/:\w+/, word);
      regexps[`^${baseUrl}${route}${anyEnding}$`] = '$1/index.html';
    });
    console.log("Send to SW override caching regexps:", regexps);
    await swAPI.setResourceMappingRegexps(regexps);
  }

  await setOverrideResourceRegexps();
  await saveAllIfNotSaved();
}

export async function setDisableCachingUrlsByServiceWorker(paths: string[]) {
  const word = '[\\w-~!*\'()<>"{}|^`]+';
  const baseUrl = `(http(s)?://${word}(\\.${word})+)`;
  const regexps = paths.map(path => `^${baseUrl}${path}$`);
  console.log("Send to SW disable caching regexps:", regexps);
  return await swAPI.setDisableCachingRegexps(regexps)
}

/** Перехват переходов по якорным ссылкам и вместо этого прокрутка до нужного места на странице **/
export function setSmoothScrollOnThisPage() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      console.log('Click on anchor link captured. Start smooth scrolling...');
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href) {
        const target = document.querySelector(href);
        target?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

export function addressFormatter(address: Address, defaultTitle = '', addFullDescription = false) {
  const fullAddress = `г. ${address.city}, ул. ${address.street}, д. ${address.house}`;
  const title = address.title || defaultTitle;
  return title ? (addFullDescription ? `${title} (${fullAddress})` : title) : fullAddress;
}

export function telFormatter(tel: string) {
  tel = tel.trim().replace(/^8/, '+7').replace('-()', '');
  if (tel.length < 12) {
    return tel;
  }
  return `${tel.slice(0, 2)} ${tel.slice(2, 5)} ${tel.slice(5, 8)}-${tel.slice(8, 10)}-${tel.slice(10)}`;
}


export async function loadES5JsScript(url: string) {
  return new Promise((resolve, reject) => {
    // Проверяем, не загружен ли уже скрипт
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
      // Если скрипт уже есть, проверяем его состояние
      if (existingScript.hasAttribute('data-loaded')) {
        // Скрипт уже загружен
        resolve(null);
      } else {
        // Скрипт добавлен, но еще не загружен - ждем его загрузки
        existingScript.addEventListener('load', () => resolve(null));
        existingScript.addEventListener('error', () => reject());
      }
      return;
    }

    const element = document.createElement('script');
    element.src = url;
    element.type = 'text/javascript';
    element.async = true;
    
    element.onload = () => {
      element.setAttribute('data-loaded', 'true');
      resolve(null);
    };
    element.onerror = () => reject();
    
    document.body.appendChild(element);
  });
}

export interface IntegrationInitConfig {
  terminalKey: string;
  product: 'eacq';
  features?:  {
    addcardIframe?: {
      container?: HTMLElement | null;
      paymentStartCallback?: () => unknown;
    };
    iframe?: {
      container?: HTMLElement | null;
      paymentStartCallback?: () => unknown;
    };
    payment?: {
      container?: HTMLElement | null;
      paymentStartCallback?: () => unknown;
    };
  };
}
export async function initPaymentWidget(initConfig: IntegrationInitConfig) {
  await loadES5JsScript(TBANK_PAYMENT_SCRIPT_URL);

  // @ts-expect-error PaymentIntegration is ES5 object from imported script
  return await PaymentIntegration.init(initConfig);
}