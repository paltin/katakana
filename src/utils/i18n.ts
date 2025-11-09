import { toSingleWordMeaning } from './meaningLabel';

export type Lang = 'en' | 'ru';

// Clean, deduplicated EN->RU dictionary used as a fallback when dataset has no Russian.
export const RU_DICT: Record<string, string> = {
  yen: 'йена', circle: 'круг',
  cover: 'покрытие', claw: 'коготь', father: 'отец', trigram: 'триграмма', trunk: 'ствол', slice: 'ломтик', stand: 'стоять',
  profound: 'глубокий', steps: 'шаги', badger: 'барсук',
  heaven: 'небо', flower: 'цветок', school: 'школа', shop: 'магазин', company: 'компания', town: 'город',
  north: 'север', south: 'юг', east: 'восток', public: 'общественный', road: 'дорога', car: 'машина', electricity: 'электричество', self: 'сам',
  study: 'учёба', see: 'видеть', hear: 'слышать', say: 'сказать', talk: 'говорить', read: 'читать', write: 'писать', language: 'язык',
  tall: 'высокий', cheap: 'дешёвый', new: 'новый', tea: 'чай', alcohol: 'алкоголь', drink: 'пить', buy: 'покупать', sell: 'продавать', thing: 'вещь',
  station: 'станция', prohibit: 'запрещать', danger: 'опасность',
  i: 'я', me: 'я', book: 'книга', port: 'порт', weekday: 'будний', line: 'линия', close: 'закрыть', push: 'толкать', pull: 'тянуть', stop: 'остановка',
  building: 'здание', england: 'Англия', place: 'место', number: 'число', floor: 'этаж', mail: 'почта', bureau: 'бюро', silver: 'серебро', ride: 'ехать', garden: 'сад', diagram: 'схема', warm: 'тёплый',
  nothing: 'ничего', have: 'иметь', plan: 'план', craft: 'ремесло', wash: 'мыть', target: 'цель', view: 'вид', light: 'свет', appear: 'появляться', smoke: 'дым', steep: 'крутой', pour: 'лить', meaning: 'значение', medicine: 'лекарство', travel: 'путешествовать', island: 'остров', castle: 'замок', week: 'неделя',
  come: 'прийти', make: 'делать', nature: 'природа', need: 'нужно', strong: 'сильный', hold: 'держать', field: 'поле', cooperate: 'сотрудничать', take: 'брать', peace: 'мир', by: 'через', machine: 'машина', flat: 'плоский', near: 'близко', god: 'бог'
};

const CYRILLIC_RE = /[\u0400-\u04FF]/;

export function localizedMeaning(raw: string, lang: Lang): string {
  const en = toSingleWordMeaning(raw);
  if (lang === 'ru') {
    return RU_DICT[en] ?? en;
  }
  return en;
}

// Prefer dataset-provided localized meaning if present on the Kana record.
export function localizedMeaningFromKana(k: any, lang: Lang): string | undefined {
  if (lang === 'ru') {
    const direct = (k?.meaningRu ?? k?.meaning_ru ?? k?.ru) as string | undefined;
    if (direct && direct.trim()) {
      const first = direct.split(/[\/,]/)[0].trim();
      if (CYRILLIC_RE.test(first)) return first;
    }
  }
  const raw = String(k?.meaning ?? '');
  const out = localizedMeaning(raw, lang);
  return out;
}

export function addLocalizedSynonym(synonyms: string[], raw: string, lang: Lang): string[] {
  if (lang !== 'ru') return synonyms;
  const ru = localizedMeaning(raw, 'ru');
  if (ru && !synonyms.includes(ru)) return [...synonyms, ru];
  return synonyms;
}

export function addLocalizedSynonymFromKana(synonyms: string[], k: any, lang: Lang): string[] {
  if (lang !== 'ru') return synonyms;
  const candidate = (k?.meaningRu ?? k?.meaning_ru ?? k?.ru) as string | undefined;
  let ru: string | undefined;
  if (candidate && candidate.trim()) {
    const first = candidate.split(/[\/,]/)[0].trim();
    ru = CYRILLIC_RE.test(first) ? first : undefined;
  }
  if (!ru) ru = localizedMeaning(String(k?.meaning ?? ''), 'ru');
  if (ru && !synonyms.includes(ru)) return [...synonyms, ru];
  return synonyms;
}

