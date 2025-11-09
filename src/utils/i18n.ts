import { toSingleWordMeaning } from './meaningLabel';

export type Lang = 'en' | 'ru';

// Minimal EN->RU dictionary for common meanings used in kanji/radicals.
const RU_DICT: Record<string, string> = {
  // basics
  one: 'один', two: 'два', three: 'три', four: 'четыре', five: 'пять', six: 'шесть', seven: 'семь', eight: 'восемь', nine: 'девять', ten: 'десять',
  hundred: 'сто', thousand: 'тысяча', 'ten thousand': 'десять тысяч',
  person: 'человек', man: 'мужчина', woman: 'женщина', child: 'ребёнок', name: 'имя', I: 'я', me: 'я',
  day: 'день', sun: 'солнце', moon: 'луна', year: 'год', time: 'время', hour: 'час', minute: 'минута', now: 'сейчас', before: 'перед', front: 'перед', after: 'после', back: 'назад',
  mountain: 'гора', river: 'река', tree: 'дерево', forest: 'лес', sky: 'небо', sea: 'море', rain: 'дождь',
  fire: 'огонь', water: 'вода', earth: 'земля', gold: 'золото', money: 'деньги',
  left: 'лево', right: 'право', up: 'верх', down: 'низ', middle: 'середина', enter: 'вход', exit: 'выход', mouth: 'рот', hand: 'рука', foot: 'нога',
  big: 'большой', small: 'малый', half: 'половина', every: 'каждый', what: 'что', previous: 'прежний', next: 'следующий',
  // radicals common
  line: 'линия', dot: 'точка', slash: 'черта', second: 'второй', hook: 'крюк', lid: 'крышка', legs: 'ноги',
  ice: 'лёд', table: 'стол', knife: 'нож', power: 'сила', wrap: 'обёртка', ladle: 'черпак', hide: 'скрыть', divination: 'гадание', lame: 'хромой', corpse: 'труп', sprout: 'росток',
  cover: 'покрытие', claw: 'коготь', father: 'отец', trigram: 'триграмма', trunk: 'ствол', slice: 'ломтик', stand: 'стоять',
  profound: 'глубокий', steps: 'шаги', badger: 'барсук',
  heaven: 'небо', flower: 'цветок', school: 'школа', shop: 'магазин', company: 'компания', town: 'город',
  north: 'север', south: 'юг', east: 'восток', public: 'общественный', road: 'дорога', car: 'машина', electricity: 'электричество', self: 'сам',
  study: 'учёба', see: 'видеть', hear: 'слышать', say: 'сказать', talk: 'говорить', read: 'читать', write: 'писать', language: 'язык',
  tall: 'высокий', cheap: 'дешёвый', new: 'новый', tea: 'чай', alcohol: 'алкоголь', drink: 'пить', buy: 'покупать', sell: 'продавать', thing: 'вещь',
  station: 'станция', prohibit: 'запрещать', danger: 'опасность',
  i: 'я', me: 'я', book: 'книга',
  yen: 'йена', circle: 'круг',
  come: 'прийти', make: 'делать', nature: 'природа', need: 'нужно', strong: 'сильный', hold: 'держать', field: 'поле', cooperate: 'сотрудничать', take: 'брать',
  metropolis: 'столица', capital: 'столица', peace: 'мир', by: 'через', machine: 'машина', flat: 'плоский', near: 'близко', god: 'бог', port: 'порт', weekday: 'будний', line: 'линия',
  close: 'закрыть', push: 'толкать', pull: 'тянуть', stop: 'остановка', building: 'здание', england: 'Англия', place: 'место', number: 'число', floor: 'этаж', mail: 'почта', bureau: 'бюро', silver: 'серебро', ride: 'ехать', garden: 'сад', diagram: 'схема', warm: 'тёплый',
  nothing: 'ничего', have: 'иметь', plan: 'план', craft: 'ремесло', wash: 'мыть', target: 'цель', view: 'вид', light: 'свет', appear: 'появляться', smoke: 'дым', steep: 'крутой', pour: 'лить', meaning: 'значение', medicine: 'лекарство', travel: 'путешествовать', island: 'остров', castle: 'замок', week: 'неделя',
  box: 'коробка', enclosure: 'ограда', private: 'частный', seal: 'печать', cliff: 'утёс', again: 'снова', scholar: 'учёный', roof: 'крыша', inch: 'дюйм',
  go: 'идти', slow: 'медленно', night: 'ночь', work: 'работа', oneself: 'сам', towel: 'полотенце', dry: 'сухой', thread: 'нить', shelter: 'укрытие', stride: 'шаг', join: 'соединить',
  shoot: 'стрелять', bow: 'лук', snout: 'пасть', hair: 'волос', step: 'шаг', heart: 'сердце', spear: 'копьё', door: 'дверь', hand: 'рука', branch: 'ветвь', rap: 'бить', script: 'письмо',
  dipper: 'ковш', axe: 'топор', square: 'квадрат', not: 'не', say: 'сказать', lack: 'недостаток', stop: 'остановка', death: 'смерть', weapon: 'оружие', mother: 'мать', compare: 'сравнить',
  fur: 'шерсть', clan: 'клан', steam: 'пар', cow: 'корова', dog: 'собака', jade: 'нефрит', melon: 'дыня', tile: 'черепица', sweet: 'сладкий', life: 'жизнь', use: 'использовать', field: 'поле',
  cloth: 'ткань', ill: 'болезнь', white: 'белый', skin: 'кожа', dish: 'блюдо', eye: 'глаз', arrow: 'стрела', stone: 'камень', spirit: 'дух', track: 'след', grain: 'зерно', cave: 'пещера',
  bamboo: 'бамбук', rice: 'рис', silk: 'шёлк', jar: 'кувшин', net: 'сеть', sheep: 'овца', feather: 'перо', old: 'старый', and: 'и', plow: 'плуг', ear: 'ухо', brush: 'кисть', meat: 'мясо',
  minister: 'министр', oneself2: 'сам', arrive: 'прибыть', mortar: 'ступка', tongue: 'язык', contrary: 'противоположный', boat: 'лодка', color: 'цвет', grass: 'трава', tiger: 'тигр', insect: 'насекомое',
  blood: 'кровь', walk: 'идти', clothes: 'одежда', west: 'запад', horn: 'рог', speech: 'речь', valley: 'долина', bean: 'боб', pig: 'свинья', shell: 'раковина', red: 'красный', foot: 'нога', body: 'тело', cart: 'повозка', bitter: 'горький', morning: 'утро', city: 'город', wine: 'вино', distinguish: 'различать', village: 'деревня', metal: 'металл', long: 'длинный', gate: 'ворота', mound: 'курган', slave: 'раб', bird: 'птица', rain: 'дождь', blue: 'синий', wrong: 'неправильно', face: 'лицо', leather: 'кожа', leek: 'лук-порей', sound: 'звук', page: 'страница', wind: 'ветер', fly: 'летать', eat: 'есть', head: 'голова', fragrant: 'ароматный', horse: 'лошадь', bone: 'кость', high: 'высокий', hair2: 'волос', fight: 'драться', wine2: 'вино', cauldron: 'котёл', ghost: 'призрак', fish: 'рыба', salty: 'солёный', deer: 'олень', wheat: 'пшеница', hemp: 'конопля', yellow: 'жёлтый', millet: 'просо', black: 'чёрный', embroidery: 'вышивка', frog: 'лягушка', tripod: 'треножник', drum: 'барабан', rat: 'крыса', nose: 'нос', even: 'ровный', tooth: 'зуб', dragon: 'дракон', turtle: 'черепаха', flute: 'флейта'
};

export function localizedMeaning(raw: string, lang: Lang): string {
  const en = toSingleWordMeaning(raw);
  if (lang === 'ru') {
    return RU_DICT[en] ?? en; // fallback to English word if missing
  }
  return en;
}

// Prefer dataset-provided localized meaning if present on the Kana record.
export function localizedMeaningFromKana(k: any, lang: Lang): string | undefined {
  if (lang === 'ru') {
    const direct = (k?.meaningRu ?? k?.meaning_ru ?? k?.ru) as string | undefined;
    if (direct && direct.trim()) {
      const first = direct.split(/[\/,]/)[0].trim();
      // If direct value already Russian (contains Cyrillic), use it; otherwise fallback to dictionary
      if (/[\u0400-\u04FF]/.test(first)) return first;
    }
  }
  const raw = String(k?.meaning ?? '');
  return localizedMeaning(raw, lang);
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
    ru = /[\u0400-\u04FF]/.test(first) ? first : undefined;
  }
  if (!ru) ru = localizedMeaning(String(k?.meaning ?? ''), 'ru');
  if (ru && !synonyms.includes(ru)) return [...synonyms, ru];
  return synonyms;
}
