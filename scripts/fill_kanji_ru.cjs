// Script: add meaningRu to kanji datasets where missing
// Run with: node scripts/fill_kanji_ru.cjs

const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', 'src', 'data', 'sets', 'kanji.json'),
  path.join(__dirname, '..', 'src', 'data', 'sets', 'kanji_extra_data.json'),
];

// Heuristics replicated from app utils
const PHRASE = {
  'go slowly': 'slow',
  'hands joined': 'join',
  'shoot with a bow': 'shoot',
  'right open box': 'box',
  'open box': 'box',
  'down box': 'box',
  'hiding enclosure': 'hide',
  'short-tailed bird': 'bird',
  'soft leather': 'leather',
  'long hair': 'hair',
  'sacrificial wine': 'wine',
  'half of a tree trunk': 'trunk',
  'lines on a trigram': 'trigram',
};
const TOKEN = { slowly: 'slow', joined: 'join', hiding: 'hide' };
const STOP = new Set(['a','an','the','of','with','and','to','in','on','by','for','right','left','up','down','open','closed','close','soft','long','short','tailed','previous','ahead']);

function toSingleWordMeaning(raw){
  const first = String(raw||'').split(/[\/,]/)[0].trim().toLowerCase();
  if (PHRASE[first]) return PHRASE[first];
  const norm = first.replace(/[-]+/g,' ');
  const tokens = norm.split(/\s+/).filter(Boolean).map(t=>TOKEN[t]||t);
  const filtered = tokens.filter(t=>!STOP.has(t));
  const pick = filtered.length?filtered:tokens;
  return pick.length?pick[pick.length-1]:first;
}

const RU = {
  one:'один', two:'два', three:'три', four:'четыре', five:'пять', six:'шесть', seven:'семь', eight:'восемь', nine:'девять', ten:'десять',
  hundred:'сто', thousand:'тысяча', 'ten thousand':'десять тысяч',
  person:'человек', man:'мужчина', woman:'женщина', child:'ребёнок', name:'имя', I:'я', me:'я',
  day:'день', sun:'солнце', moon:'луна', year:'год', time:'время', hour:'час', minute:'минута', now:'сейчас', before:'перед', front:'перед', after:'после', back:'назад',
  mountain:'гора', river:'река', tree:'дерево', forest:'лес', sky:'небо', sea:'море', rain:'дождь',
  fire:'огонь', water:'вода', earth:'земля', gold:'золото', money:'деньги', yen:'йена', circle:'круг',
  left:'лево', right:'право', up:'верх', down:'низ', middle:'середина', enter:'вход', exit:'выход', mouth:'рот', hand:'рука', foot:'нога',
  big:'большой', small:'малый', half:'половина', every:'каждый', what:'что', previous:'прежний', next:'следующий', beforehand:'заранее', afterword:'послесловие',
  north:'север', south:'юг', east:'восток', west:'запад', mountain:'гора', forest:'лес', sky2:'небо', heaven:'небеса', spirit:'дух', air:'воздух',
  flower:'цветок', rain2:'дождь', snow:'снег', sea2:'море', temple:'храм', store:'магазин', house:'дом', school:'школа', work:'работа', rest:'отдых',
  before2:'перед', after2:'после', first:'первый', previous2:'прежний', ahead:'впереди', every2:'каждый', what2:'что',
};

function toRu(raw){
  const en = toSingleWordMeaning(raw);
  return RU[en] || en;
}

function run(){
  for (const f of files){
    const arr = JSON.parse(fs.readFileSync(f,'utf8'));
    let changed = 0;
    for (const it of arr){
      const has = it.meaningRu && String(it.meaningRu).trim();
      if (!has && it.meaning){ it.meaningRu = toRu(it.meaning); changed++; }
    }
    fs.writeFileSync(f, JSON.stringify(arr, null, 2)+"\n", 'utf8');
    console.log(path.basename(f)+": "+changed+" updated");
  }
}

run();

