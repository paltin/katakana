// Script: add meaningRu to radicals.json where missing
// Run with: node scripts/fill_radicals_ru.cjs

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'data', 'sets', 'radicals.json');

// Heuristics to convert phrases to a single English keyword
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
const STOP = new Set(['a','an','the','of','with','and','to','in','on','by','for','right','left','up','down','open','closed','close','soft','long','short','tailed']);

function toSingleWordMeaning(raw){
  const first = String(raw||'').split(/[\/,]/)[0].trim().toLowerCase();
  if (PHRASE[first]) return PHRASE[first];
  const norm = first.replace(/[-]+/g,' ');
  const tokens = norm.split(/\s+/).filter(Boolean).map(t=>TOKEN[t]||t);
  const filtered = tokens.filter(t=>!STOP.has(t));
  const pick = filtered.length?filtered:tokens;
  return pick.length?pick[pick.length-1]:first;
}

// EN -> RU map (single-word keys)
const RU = {
  one:'один', two:'два', three:'три', four:'четыре', five:'пять', six:'шесть', seven:'семь', eight:'восемь', nine:'девять', ten:'десять',
  hundred:'сто', thousand:'тысяча', 'ten thousand':'десять тысяч',
  person:'человек', man:'мужчина', woman:'женщина', child:'ребёнок', name:'имя', I:'я', me:'я',
  day:'день', sun:'солнце', moon:'луна', year:'год', time:'время', hour:'час', minute:'минута', now:'сейчас', before:'перед', front:'перед', after:'после', back:'назад',
  mountain:'гора', river:'река', tree:'дерево', forest:'лес', sky:'небо', sea:'море', rain:'дождь',
  fire:'огонь', water:'вода', earth:'земля', gold:'золото', money:'деньги',
  left:'лево', right:'право', up:'верх', down:'низ', middle:'середина', enter:'вход', exit:'выход', mouth:'рот', hand:'рука', foot:'нога',
  big:'большой', small:'малый', half:'половина', every:'каждый', what:'что', previous:'прежний', next:'следующий',
  line:'линия', dot:'точка', slash:'черта', second:'второй', hook:'крюк', lid:'крышка', legs:'ноги',
  box:'коробка', enclosure:'ограда', private:'частный', seal:'печать', cliff:'утёс', again:'снова', scholar:'учёный', roof:'крыша', inch:'дюйм',
  go:'идти', slow:'медленно', night:'ночь', work:'работа', oneself:'сам', towel:'полотенце', dry:'сухой', thread:'нить', shelter:'укрытие', stride:'шаг', join:'соединить',
  shoot:'стрелять', bow:'лук', snout:'пасть', hair:'волос', step:'шаг', heart:'сердце', spear:'копьё', door:'дверь', branch:'ветвь', rap:'бить', script:'письмо',
  dipper:'ковш', axe:'топор', square:'квадрат', not:'не', say:'сказать', lack:'недостаток', stop:'остановка', death:'смерть', weapon:'оружие', mother:'мать', compare:'сравнить',
  fur:'шерсть', clan:'клан', steam:'пар', cow:'корова', dog:'собака', jade:'нефрит', melon:'дыня', tile:'черепица', sweet:'сладкий', life:'жизнь', use:'использовать', field:'поле',
  cloth:'ткань', ill:'болезнь', white:'белый', skin:'кожа', dish:'блюдо', eye:'глаз', arrow:'стрела', stone:'камень', spirit:'дух', track:'след', grain:'зерно', cave:'пещера',
  bamboo:'бамбук', rice:'рис', silk:'шёлк', jar:'кувшин', net:'сеть', sheep:'овца', feather:'перо', old:'старый', and:'и', plow:'плуг', ear:'ухо', brush:'кисть', meat:'мясо',
  minister:'министр', arrive:'прибыть', mortar:'ступка', tongue:'язык', contrary:'противоположный', boat:'лодка', color:'цвет', grass:'трава', tiger:'тигр', insect:'насекомое',
  blood:'кровь', walk:'идти', clothes:'одежда', west:'запад', horn:'рог', speech:'речь', valley:'долина', bean:'боб', pig:'свинья', shell:'раковина', red:'красный', body:'тело', cart:'повозка', bitter:'горький', morning:'утро', city:'город', wine:'вино', distinguish:'различать', village:'деревня', metal:'металл', long:'длинный', gate:'ворота', mound:'курган', slave:'раб', bird:'птица', blue:'синий', wrong:'неправильно', face:'лицо', leather:'кожа', leek:'лук-порей', sound:'звук', page:'страница', wind:'ветер', fly:'летать', eat:'есть', head:'голова', fragrant:'ароматный', horse:'лошадь', bone:'кость', high:'высокий', fight:'драться', cauldron:'котёл', ghost:'призрак', fish:'рыба', salty:'солёный', deer:'олень', wheat:'пшеница', hemp:'конопля', yellow:'жёлтый', millet:'просо', black:'чёрный', embroidery:'вышивка', frog:'лягушка', tripod:'треножник', drum:'барабан', rat:'крыса', nose:'нос', even:'ровный', tooth:'зуб', dragon:'дракон', turtle:'черепаха', flute:'флейта'
};

function toRu(raw){
  const en = toSingleWordMeaning(raw);
  return RU[en] || en; // fallback
}

function run(){
  const json = JSON.parse(fs.readFileSync(file,'utf8'));
  let changed = 0;
  for (const r of json){
    if (!r.meaningRu || !String(r.meaningRu).trim()){
      r.meaningRu = toRu(r.meaning);
      changed++;
    }
  }
  fs.writeFileSync(file, JSON.stringify(json, null, 2)+"\n", 'utf8');
  console.log(`Updated ${changed} entries with meaningRu`);
}

run();

