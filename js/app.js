'use strict';

// ═══════════════════════════════════════════════════════════
// FIREBASE
// ═══════════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey:            "AIzaSyC5Hu6pcABpqFkIrkB3l7X4fof8fQRtWIo",
  authDomain:        "wavecheck-9936e.firebaseapp.com",
  projectId:         "wavecheck-9936e",
  storageBucket:     "wavecheck-9936e.firebasestorage.app",
  messagingSenderId: "264775491280",
  appId:             "1:264775491280:web:5c2c0b7cbc3da8c6aa08d5"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// ═══════════════════════════════════════════════════════════
// PRAIAS — BAHIA / SALVADOR (todas as principais)
// ═══════════════════════════════════════════════════════════
const BEACHES = [
  // ── Costa Atlântica Norte (Litoral Norte) ──
  { id:'forte',        name:'Praia do Forte',     region:'Litoral Norte, BA', lat:-12.5774, lon:-38.0048, bestSwell:['NE','ENE','N'],  bestWind:['SW','S','W'],   grad:'linear-gradient(145deg,#0a2a1a 0%,#0d6640 55%,#12a05a 100%)', orientation:'NE', type:'beach_break', idealTide:'mid',  level:'iniciante',     desc:'Destino paradisíaco com recife de coral. Mar calmo na maior parte.' },
  { id:'guarajuba',    name:'Guarajuba',           region:'Litoral Norte, BA', lat:-12.6200, lon:-38.0800, bestSwell:['NE','ENE','E'],  bestWind:['SW','S','W'],   grad:'linear-gradient(145deg,#0a1a2a 0%,#0d406a 55%,#1268aa 100%)', orientation:'NE', type:'beach_break', idealTide:'mid',  level:'iniciante',     desc:'Beach break clássico do litoral norte. Frequentada por famílias e iniciantes.' },
  { id:'arembepe',     name:'Arembepe',            region:'Litoral Norte, BA', lat:-12.7600, lon:-38.1600, bestSwell:['NE','ENE','E'],  bestWind:['SW','W','NW'],  grad:'linear-gradient(145deg,#1a2a0a 0%,#3a6a10 55%,#5aaa20 100%)', orientation:'NE', type:'beach_break', idealTide:'mid',  level:'intermediario', desc:'Ondas consistentes. Famosa por sua colônia hippie. Picos variados.' },
  { id:'interlagos',   name:'Interlagos',          region:'Litoral Norte, BA', lat:-12.7800, lon:-38.1800, bestSwell:['NE','N','NNE'],  bestWind:['S','SW'],       grad:'linear-gradient(145deg,#2a0a1a 0%,#6a1a4a 55%,#aa2a7a 100%)', orientation:'N',  type:'beach_break', idealTide:'mid',  level:'intermediario', desc:'Praia tranquila com ondas boas em dias de swell de norte.' },
  // ── Orla de Salvador ──

  { id:'stella_maris', name:'Stella Maris',        region:'Salvador, BA',      lat:-12.9400, lon:-38.3100, bestSwell:['NE','ENE','E'],  bestWind:['SW','W','NW'],  grad:'linear-gradient(145deg,#2a1a0a 0%,#7a3a1a 55%,#cc6a2a 100%)', orientation:'NE', type:'beach_break', idealTide:'mid',  level:'intermediario', desc:'Beach break com bancadas boas. Popular entre os surfistas locais de Salvador.' },
  { id:'itapua',       name:'Itapoã',              region:'Salvador, BA',      lat:-12.9580, lon:-38.3280, bestSwell:['NE','ENE','E'],  bestWind:['SW','S','W'],   grad:'linear-gradient(145deg,#1a2a10 0%,#2d6b1a 55%,#4aaa28 100%)', orientation:'NE', type:'beach_break', idealTide:'mid',  level:'iniciante',     desc:'Praia urbana famosa. Boa para iniciantes. Ondas acessíveis o ano todo.' },
  { id:'amaralina',    name:'Amaralina',           region:'Salvador, BA',      lat:-12.9820, lon:-38.4320, bestSwell:['NE','N','NNE'],  bestWind:['S','SW'],       grad:'linear-gradient(145deg,#0a2a2a 0%,#1a6a6a 55%,#2aaaaa 100%)', orientation:'N',  type:'beach_break', idealTide:'mid',  level:'intermediario', desc:'Praia de bairro tradicional. Boa quando o swell de norte aparece.' },
  { id:'jardim_armacao',name:'Jardim de Allah',    region:'Salvador, BA',      lat:-12.9900, lon:-38.4500, bestSwell:['NE','N'],        bestWind:['S','SW','SE'],  grad:'linear-gradient(145deg,#1a1a0a 0%,#4a4a1a 55%,#8a8a2a 100%)', orientation:'N',  type:'beach_break', idealTide:'low',  level:'iniciante',     desc:'Praia urbana no coração da orla. Mar calmo frequente, bom para aprender.' },
  { id:'ondina',       name:'Ondina',              region:'Salvador, BA',      lat:-13.0100, lon:-38.5100, bestSwell:['NE','N','NW'],   bestWind:['S','SE','SW'],  grad:'linear-gradient(145deg,#0a1a2a 0%,#1a3a6a 55%,#2a5aaa 100%)', orientation:'NW', type:'beach_break', idealTide:'mid',  level:'intermediario', desc:'Perto do Farol da Barra. Recebe ondas de norte e noroeste nos dias certos.' },
  { id:'barra',        name:'Barra',               region:'Salvador, BA',      lat:-13.0100, lon:-38.5200, bestSwell:['N','NW','NNW'],  bestWind:['SE','S','E'],   grad:'linear-gradient(145deg,#0a0a2a 0%,#1a1a5a 55%,#2a2a9a 100%)', orientation:'NW', type:'beach_break', idealTide:'low',  level:'intermediario', desc:'Praia do Farol da Barra. Melhor com swell de norte. Ponto icônico de Salvador.' },
  { id:'flamengo',     name:'Flamengo',            region:'Salvador, BA',      lat:-12.9700, lon:-38.4100, bestSwell:['NE','N','NNE'],  bestWind:['S','SW','SE'],  grad:'linear-gradient(145deg,#0a1a2a 0%,#1a4a7a 55%,#2a7acc 100%)', orientation:'N',  type:'beach_break', idealTide:'low',  level:'intermediario', desc:'Beach break consistente. Bom para intermediários em dias de NE.' },
  { id:'piata',        name:'Piatã',               region:'Salvador, BA',      lat:-12.9800, lon:-38.4200, bestSwell:['NE','N','NNE'],  bestWind:['S','SW'],       grad:'linear-gradient(145deg,#0a2a1a 0%,#1a6a4a 55%,#2aaa7a 100%)', orientation:'NE', type:'beach_break', idealTide:'mid',  level:'iniciante',     desc:'Boa para iniciantes e famílias. Ondas suaves na maior parte do ano.' },
  { id:'placabuquerque',name:'Placabuquerque',     region:'Salvador, BA',      lat:-12.9600, lon:-38.3800, bestSwell:['NE','ENE'],      bestWind:['SW','W'],       grad:'linear-gradient(145deg,#2a1a0a 0%,#6a4a1a 55%,#aa8a2a 100%)', orientation:'NE', type:'beach_break', idealTide:'mid',  level:'intermediario', desc:'Pico entre Flamengo e Stella Maris. Beach break com bons dias de NE.' },
  { id:'rio_vermelho',  name:'Rio Vermelho',       region:'Salvador, BA',      lat:-13.0000, lon:-38.4900, bestSwell:['NE','N'],        bestWind:['S','SE','SW'],  grad:'linear-gradient(145deg,#2a0a0a 0%,#7a1a1a 55%,#cc2a2a 100%)', orientation:'N',  type:'beach_break', idealTide:'mid',  level:'iniciante',     desc:'Bairro boêmio e icônico. Ondas pequenas mas divertidas para aprender.' },
  // ── Litoral Sul / Ilha ──
  { id:'jaguaribe',    name:'Jaguaribe',           region:'Salvador, BA',      lat:-12.9250, lon:-38.3100, bestSwell:['NE','ENE','E'],  bestWind:['SW','S','W'],   grad:'linear-gradient(145deg,#1a0a0a 0%,#5a1a1a 55%,#9a2a2a 100%)', orientation:'NE', type:'beach_break', idealTide:'mid',  level:'avancado',      desc:'Um dos picos mais respeitados de Salvador. Ondas fortes e tubulares.' },
  { id:'corsario',     name:'Corsario',             region:'Salvador, BA',      lat:-12.9550, lon:-38.3450, bestSwell:['NE','ENE','E'],  bestWind:['SW','W'],       grad:'linear-gradient(145deg,#0a1a2a 0%,#1a5a7a 55%,#2a9acc 100%)', orientation:'NE', type:'beach_break', idealTide:'mid',  level:'intermediario', desc:'Praia entre Itapua e Stella Maris. Ondas consistentes de NE.' },
  { id:'inema',        name:'Praia do INEMA',       region:'Salvador, BA',      lat:-12.9350, lon:-38.3200, bestSwell:['NE','ENE'],      bestWind:['SW','S','W'],   grad:'linear-gradient(145deg,#0a2a1a 0%,#1a6a3a 55%,#2aaa5a 100%)', orientation:'NE', type:'beach_break', idealTide:'mid',  level:'intermediario', desc:'Praia reservada com acesso limitado. Beach break de qualidade.' },
  { id:'praia_grande', name:'Praia Grande (Ilha)', region:'Ilha de Itaparica, BA', lat:-12.7600, lon:-38.6400, bestSwell:['SE','S','SSE'], bestWind:['NE','N','NW'], grad:'linear-gradient(145deg,#0a2a2a 0%,#1a7a6a 55%,#2accaa 100%)', orientation:'S',  type:'beach_break', idealTide:'mid',  level:'avancado',      desc:'Ilha de Itaparica. Swell de sul abre ondas longas e bem formadas.' },
];

const DIRS     = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
const deg2card = d => DIRS[Math.round((+d) / 22.5) % 16];

// Validacao de praias — remove entradas invalidas em tempo de execucao
(function validateBeaches() {
  const INVALID_NAMES = ['placa da ford','placaford','unnamed','test','teste','praia x'];
  const seen = new Set();
  for (let i = BEACHES.length - 1; i >= 0; i--) {
    const b = BEACHES[i];
    const nameL = (b.name || '').toLowerCase().trim();
    const issues = [];
    if (!b.id || !b.name || !b.lat || !b.lon)       issues.push('campos obrigatorios ausentes');
    if (INVALID_NAMES.some(n => nameL.includes(n)))  issues.push('nome invalido: ' + b.name);
    if (seen.has(b.id))                              issues.push('id duplicado: ' + b.id);
    if (Math.abs(b.lat) > 90 || Math.abs(b.lon) > 180) issues.push('coordenadas invalidas');
    if (issues.length) {
      console.error('[WaveCheck] Praia removida (' + b.id + '):', issues.join('; '));
      BEACHES.splice(i, 1);
    } else {
      seen.add(b.id);
    }
  }
})();

// ═══════════════════════════════════════════════════════════
// STORMGLASS — controle de uso (max 10 req/dia, 6h por praia)
// ═══════════════════════════════════════════════════════════
// Coloque sua chave em js/config.js: window.STORMGLASS_KEY = 'sua_chave_aqui';
const SG_KEY        = (typeof window !== 'undefined' && window.STORMGLASS_KEY) || null;
const SG_CACHE_PFX  = 'wc_sg_';
const SG_DAILY_KEY  = 'wc_sg_day';
const SG_COOLDOWN   = 6 * 60 * 60 * 1000; // 6h em ms
const SG_MAX_DAILY  = 8; // conservador — limite real é 10

function sgUsageToday() {
  try {
    const raw = JSON.parse(localStorage.getItem(SG_DAILY_KEY) || '{}');
    const today = new Date().toDateString();
    if (raw.date !== today) return { date: today, count: 0 };
    return raw;
  } catch { return { date: new Date().toDateString(), count: 0 }; }
}

function sgCanRequest(beachId) {
  if (!SG_KEY) return false;
  const usage = sgUsageToday();
  if (usage.count >= SG_MAX_DAILY) return false;
  try {
    const cache = JSON.parse(localStorage.getItem(SG_CACHE_PFX + beachId) || 'null');
    if (cache && Date.now() - cache.ts < SG_COOLDOWN) return false;
  } catch {}
  return true;
}

function sgMarkUsed(beachId) {
  const usage = sgUsageToday();
  usage.count = (usage.count || 0) + 1;
  localStorage.setItem(SG_DAILY_KEY, JSON.stringify(usage));
}

function sgGetCache(beachId) {
  try {
    const c = JSON.parse(localStorage.getItem(SG_CACHE_PFX + beachId) || 'null');
    if (!c) return null;
    // cache válido por 6h
    if (Date.now() - c.ts > SG_COOLDOWN) return null;
    return c.data;
  } catch { return null; }
}

function sgSetCache(beachId, data) {
  try {
    localStorage.setItem(SG_CACHE_PFX + beachId, JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

async function fetchStormglass(beach) {
  // Tenta cache primeiro
  const cached = sgGetCache(beach.id);
  if (cached) return cached;

  if (!sgCanRequest(beach.id)) return null;

  const now   = new Date();
  const end   = new Date(now.getTime() + 48 * 3600 * 1000);
  const start = now.toISOString();
  const endS  = end.toISOString();

  const params = 'swellHeight,swellPeriod,swellDirection,windSpeed,windDirection,waterTemperature,tideHeight';
  const url = `https://api.stormglass.io/v2/weather/point?lat=${beach.lat}&lng=${beach.lon}&params=${params}&start=${start}&end=${endS}&source=sg`;

  try {
    sgMarkUsed(beach.id);
    const res = await fetch(url, { headers: { Authorization: SG_KEY } });
    if (!res.ok) throw new Error(`SG ${res.status}`);
    const json = await res.json();
    const data = parseSGData(json);
    sgSetCache(beach.id, data);
    return data;
  } catch (e) {
    console.warn('Stormglass falhou:', e.message);
    return null;
  }
}

function parseSGData(json) {
  if (!json?.hours) return null;
  return json.hours.map(h => {
    const pick = (field) => h[field]?.sg ?? h[field]?.noaa ?? h[field]?.icon ?? null;
    return {
      time:      h.time,
      swellH:    pick('swellHeight'),
      swellP:    pick('swellPeriod'),
      swellDir:  pick('swellDirection'),
      windSpd:   pick('windSpeed') ? pick('windSpeed') * 3.6 : null, // m/s → km/h
      windDir:   pick('windDirection'),
      tideH:     pick('tideHeight'),
    };
  }).filter(h => h.swellH !== null);
}

// ═══════════════════════════════════════════════════════════
// FUSÃO DE DADOS — Open-Meteo + Stormglass
// ═══════════════════════════════════════════════════════════
function fuseSurfData(omSlot, sgHours) {
  if (!sgHours || !sgHours.length) {
    return { ...omSlot, confidence: 'media', source: 'openmeteo' };
  }

  // Encontra hora mais próxima no SG
  const slotTime = new Date(omSlot.t).getTime();
  const sgMatch  = sgHours.reduce((closest, h) => {
    const diff = Math.abs(new Date(h.time).getTime() - slotTime);
    return diff < Math.abs(new Date(closest.time).getTime() - slotTime) ? h : closest;
  }, sgHours[0]);

  const timeDiff = Math.abs(new Date(sgMatch.time).getTime() - slotTime);
  if (timeDiff > 3600000) {
    // SG não tem dado para esse horário, usa OM
    return { ...omSlot, confidence: 'media', source: 'openmeteo' };
  }

  // Média ponderada: OM 60%, SG 40%
  const w_om = 0.6, w_sg = 0.4;

  const sh_om = omSlot.sh;
  const sh_sg = sgMatch.swellH;
  const sp_om = omSlot.sp;
  const sp_sg = sgMatch.swellP;
  const ws_om = omSlot.ws;
  const ws_sg = sgMatch.windSpd;

  // Calcula divergência para indicador de confiança
  const shDiff  = sh_sg ? Math.abs(sh_om - sh_sg) / Math.max(sh_om, sh_sg) : 0;
  const spDiff  = sp_sg ? Math.abs(sp_om - sp_sg) / Math.max(sp_om, sp_sg) : 0;
  const diverge = (shDiff + spDiff) / 2;

  let confidence;
  if (diverge < 0.15)       confidence = 'alta';
  else if (diverge < 0.35)  confidence = 'media';
  else                      confidence = 'baixa';

  const sh_fused = sh_sg ? parseFloat((sh_om * w_om + sh_sg * w_sg).toFixed(1)) : sh_om;
  const sp_fused = sp_sg ? Math.round(sp_om * w_om + sp_sg * w_sg)              : sp_om;
  const ws_fused = ws_sg ? Math.round(ws_om * w_om + ws_sg * w_sg)              : ws_om;

  // Maré real do Stormglass
  const tideH = sgMatch.tideH;

  return {
    ...omSlot,
    sh:         sh_fused,
    sp:         sp_fused,
    ws:         ws_fused,
    tideH:      tideH,
    confidence,
    source:     'fused',
    diverge:    parseFloat(diverge.toFixed(2)),
    sg:         { sh: sh_sg, sp: sp_sg, ws: ws_sg, tideH },
    om:         { sh: sh_om, sp: sp_om, ws: ws_om },
  };
}

// ═══════════════════════════════════════════════════════════
// MOTOR DE SURF CHECK — computeSurfScore (0–100)
// ═══════════════════════════════════════════════════════════
function computeSurfScore(slot, beach, userLevel = 'intermediario') {
  let pts = 50;
  const bd = {};

  // ── 1. ENERGIA DO SWELL (altura × período) ────────────
  const h       = slot.sh || 0;
  const p       = slot.sp || 8;
  const energia = h * p; // kJ/m estimado (proxy)

  // Pontuação por altura base
  let hPts;
  if      (h < 0.3)           hPts = -30;
  else if (h < 0.5)           hPts = -15;
  else if (h < 1.0)           hPts =   8;
  else if (h < 1.5)           hPts =  20;
  else if (h < 2.0)           hPts =  25;
  else if (h < 2.5)           hPts =  20;
  else if (h < 3.0)           hPts =  12;
  else if (h < 4.0)           hPts =   5;
  else                        hPts = -10;

  // Ajuste por nível do surfista
  if (userLevel === 'iniciante') {
    if (h > 1.5) hPts -= Math.round((h - 1.5) * 18);
    if (h < 0.5) hPts += 8; // gosta de mar pequeno
  } else if (userLevel === 'avancado') {
    if (h < 1.2) hPts -= 18;
    if (h >= 2.0) hPts += 12;
    if (h >= 3.0) hPts += 8;
  }
  bd.altura = Math.max(-45, Math.min(35, hPts));
  pts += bd.altura;

  // ── 2. PERÍODO ────────────────────────────────────────
  let pPts;
  if      (p < 6)   pPts = -25;
  else if (p < 8)   pPts = -10;
  else if (p < 10)  pPts =   5;
  else if (p < 12)  pPts =  12;
  else if (p < 14)  pPts =  20;
  else if (p < 16)  pPts =  28;
  else              pPts =  35;
  bd.periodo = pPts;
  pts += pPts;

  // ── 3. DIREÇÃO DO SWELL vs orientação da praia ────────
  const swellCard  = deg2card(typeof slot.sdDeg === 'number' ? slot.sdDeg : 45);
  const swellOk    = beach.bestSwell.includes(swellCard);
  const swellClose = beach.bestSwell.some(d => {
    const a = DIRS.indexOf(swellCard), b2 = DIRS.indexOf(d);
    const diff = Math.abs(a - b2);
    return diff <= 2 || diff >= 14;
  });
  bd.direcaoSwell = swellOk ? 20 : (swellClose ? 8 : -15);
  pts += bd.direcaoSwell;

  // ── 4. VENTO — tipo + intensidade ────────────────────
  const windCard = deg2card(typeof slot.wdDeg === 'number' ? slot.wdDeg : 90);
  const windType = getWindType(windCard, beach.orientation);
  const ws       = slot.ws || 0;

  let wPts;
  if (windType === 'offshore') {
    if      (ws <= 8)   wPts = 25;
    else if (ws <= 15)  wPts = 20;
    else if (ws <= 22)  wPts = 12; // offshore forte ainda ok
    else                wPts = -5; // offshore muito forte atrapalha
  } else if (windType === 'cross') {
    if      (ws <= 8)   wPts =  5;
    else if (ws <= 15)  wPts = -5;
    else if (ws <= 22)  wPts = -18;
    else                wPts = -28;
  } else { // onshore
    if      (ws <= 8)   wPts = -15;
    else if (ws <= 15)  wPts = -28;
    else if (ws <= 22)  wPts = -38;
    else                wPts = -45;
  }
  bd.vento = wPts;
  pts += wPts;

  // ── 5. MARÉ ───────────────────────────────────────────
  const tideType = slot.tideH != null ? realTideType(slot.tideH) : estimateTideType(slot.hour);
  const tideOk   = beach.idealTide;
  bd.mare = (tideType === tideOk) ? 15 : (tideType === 'mid' ? 5 : -10);
  pts += bd.mare;

  // ── 6. CONSISTÊNCIA (via período) ────────────────────
  let consPts;
  if      (p >= 14)  consPts = 10; // sets longos e organizados
  else if (p >= 11)  consPts =  5;
  else if (p >= 8)   consPts =  0;
  else               consPts = -8; // wind chop desorganizado
  bd.consistencia = consPts;
  pts += consPts;

  // Clamp final
  const score = Math.min(100, Math.max(0, Math.round(pts)));

  // Labels
  let label, color, worthIt, emoji;
  if      (score >= 80) { label = 'CLÁSSICO'; color = '#00e676'; worthIt = 'SIM';    emoji = ''; }
  else if (score >= 65) { label = 'BOM';      color = '#29b6f6'; worthIt = 'SIM';    emoji = ''; }
  else if (score >= 45) { label = 'SURFÁVEL'; color = '#ffb74d'; worthIt = 'TALVEZ'; emoji = ''; }
  else                  { label = 'RUIM';     color = '#ef5350'; worthIt = 'NÃO';    emoji = ''; }

  const simpleText = genSimpleText(slot, beach, score, windType, tideType);
  const whyText    = genWhyText(slot, beach, bd, windType, tideType);

  return { score, label, color, worthIt, emoji, breakdown: bd, simpleText, whyText, windType, tideType };
}

function getWindType(windCard, beachOrientation) {
  const wIdx = DIRS.indexOf(windCard);
  const bIdx = DIRS.indexOf(beachOrientation);
  if (wIdx < 0 || bIdx < 0) return 'cross';
  const diff    = Math.abs(wIdx - bIdx) % 16;
  const minDiff = Math.min(diff, 16 - diff);
  if (minDiff >= 6 && minDiff <= 10) return 'offshore';
  if (minDiff <= 2 || minDiff >= 14) return 'onshore';
  return 'cross';
}

function realTideType(tideH) {
  if (tideH == null) return 'mid';
  if (tideH < 0.5)  return 'low';
  if (tideH > 1.4)  return 'high';
  return 'mid';
}

function estimateTideType(hour) {
  const h = typeof hour === 'string' ? parseInt(hour) : (hour || 12);
  if (h >= 5  && h <= 9)  return 'low';
  if (h >= 9  && h <= 13) return 'mid';
  if (h >= 13 && h <= 17) return 'high';
  if (h >= 17 && h <= 19) return 'mid';
  return 'low';
}

function genSimpleText(slot, beach, score, windType, tideType) {
  const h = slot.sh, p = slot.sp;
  const sizeMap = h < 0.5 ? 'Mar flat' : h < 1.0 ? 'Ondas pequenas' : h < 1.5 ? 'Ondas médias' : h < 2.5 ? 'Ondas boas' : 'Mar grande';
  const windMap = { offshore: 'vento terral limpa as ondas', cross: 'vento cruzado', onshore: 'vento maral bagunça o mar' };
  const tideMap = { low: 'maré baixa', mid: 'meia maré', high: 'maré cheia' };
  const perTxt  = p >= 14 ? ', período longo' : p >= 11 ? ', período bom' : p >= 8 ? '' : ', mar sem força';
  return `${sizeMap}, ${windMap[windType] || windType}${perTxt}. ${tideMap[tideType]}.`;
}

function genWhyText(slot, beach, bd, windType, tideType) {
  const lines = [];
  const h = slot.sh, p = slot.sp, ws = slot.ws;

  if (bd.altura >= 20)       lines.push(`Altura de ${h}m está no sweet spot — condição ideal.`);
  else if (bd.altura >= 5)   lines.push(`Mar de ${h}m, razoável.`);
  else if (bd.altura < -15)  lines.push(`${h < 0.5 ? 'Mar muito fraco' : 'Mar grande demais'} para uma boa sessão.`);

  if (p >= 14)               lines.push(`Período longo de ${p}s — ground swell organizado e potente.`);
  else if (p >= 11)          lines.push(`Período de ${p}s garante boa forma nas ondas.`);
  else if (p < 8)            lines.push(`Período curto de ${p}s — ondas sem força real.`);

  const windNames = { offshore: `terral (offline) de ${slot.wd}`, cross: `cruzado de ${slot.wd}`, onshore: `maral (onshore) de ${slot.wd}` };
  if (bd.vento >= 18)        lines.push(`Vento ${windNames[windType]} organiza e deixa as ondas limpas.`);
  else if (bd.vento <= -25)  lines.push(`Vento ${windNames[windType]} (${ws}km/h) está estragando o mar.`);

  const tideLabels = { low: 'baixa', mid: 'meia', high: 'cheia' };
  const tideImpact = beach.idealTide === tideType ? 'favorece' : 'não está no ponto ideal para';
  lines.push(`Maré ${tideLabels[tideType]} ${tideImpact} esta praia.`);

  if (bd.direcaoSwell >= 15) lines.push(`Swell de ${slot.sd} entra bem para a orientação desta praia.`);
  else if (bd.direcaoSwell < 0) lines.push(`Swell de ${slot.sd} chega de ângulo desfavorável.`);

  return lines.join(' ');
}

// ═══════════════════════════════════════════════════════════
// ESTADO GLOBAL
// ═══════════════════════════════════════════════════════════
const S = {
  user:          null,
  profile:       null,
  beach:         localStorage.getItem('wc_beach') || 'itapua',
  dark:          localStorage.getItem('wc_dark') !== 'false',
  page:          'home',
  slots:         [],
  forecastBeach: null,
  sgData:        null,
  sgBeach:       null,
  feeling:       'bom',
  commFeeling:   'bom',
  commBeach:     localStorage.getItem('wc_beach') || 'itapua',
  tideBeach:     localStorage.getItem('wc_beach') || 'itapua',
  pendingCI:     null,
  userLevel:     localStorage.getItem('wc_level') || 'intermediario',
  loading:       false,
};

// ═══════════════════════════════════════════════════════════
// BOOT — fluxo correto de inicialização
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  showSplash();

  auth.onAuthStateChanged(async user => {
    if (user) {
      S.user = user;
      await loadProfile();
      hideSplash();
      renderApp();
      // ── FIX: carrega dados ANTES do primeiro render
      await bootLoad();
    } else {
      S.user = null; S.profile = null;
      hideSplash();
      renderLogin();
    }
  });
});

// bootLoad: garante que dados estão prontos antes de renderizar a home
async function bootLoad() {
  setHomeLoading(true);
  await loadForecast(S.beach);
  setHomeLoading(false);
  renderCurrentPage();
  // Inicia verificacoes de notificacao se ja tiver permissao
  if (notifEnabled()) scheduleNotifChecks();
}

// ── FIX: onBeachChange — reativo, tudo acontece aqui ─────
async function onBeachChange(beachId) {
  if (S.beach === beachId && S.slots.length && S.forecastBeach === beachId) return;
  S.beach         = beachId;
  S.slots         = [];
  S.forecastBeach = null;
  S.sgData        = null;
  S.sgBeach       = null;
  localStorage.setItem('wc_beach', beachId);

  setPageLoading(true);
  await loadForecast(beachId);
  setPageLoading(false);
  renderCurrentPage();
}

function renderCurrentPage() {
  if (S.page === 'home')      renderHome();
  if (S.page === 'forecast')  renderForecastPage();
  if (S.page === 'beaches')   renderBeachesPage('');
  if (S.page === 'tide')      renderTidePage();
  if (S.page === 'community') renderCommunity();
  if (S.page === 'profile')   renderProfile();
}

// ═══════════════════════════════════════════════════════════
// SPLASH
// ═══════════════════════════════════════════════════════════
function showSplash() {
  root().innerHTML = `
    <div id="splash" class="splash-screen">
      <div class="splash-logo">
        <svg viewBox="0 0 80 50" fill="none" class="splash-wave">
          <path d="M0 25 Q10 8 20 25 Q30 42 40 25 Q50 8 60 25 Q70 42 80 25" stroke="white" stroke-width="4" stroke-linecap="round"/>
        </svg>
        <span class="splash-title">WaveCheck</span>
      </div>
      <span class="splash-sub">surf check com dados reais</span>
    </div>`;
}
function hideSplash() {
  const s = document.getElementById('splash'); if (!s) return;
  s.style.transition = 'opacity .4s,transform .4s';
  s.style.opacity = '0'; s.style.transform = 'scale(1.04)';
  setTimeout(() => s.remove(), 400);
}

// ═══════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════
function renderLogin() {
  root().innerHTML = `
    <div class="login-screen">
      <div class="login-bg"></div>
      <div class="login-content">
        <div class="login-logo">
          <svg viewBox="0 0 80 50" fill="none" class="login-wave">
            <path d="M0 25 Q10 8 20 25 Q30 42 40 25 Q50 8 60 25 Q70 42 80 25" stroke="white" stroke-width="4" stroke-linecap="round"/>
          </svg>
          <span>WaveCheck</span>
        </div>
        <button id="btn-google" class="btn-google">
          <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Entrar com Google
        </button>
        <div class="login-divider"><span>ou use e-mail</span></div>
        <div class="login-card">
          <div class="auth-tabs">
            <button class="atab active" data-t="login">Entrar</button>
            <button class="atab" data-t="register">Criar conta</button>
          </div>
          <div id="form-login" class="auth-form">
            <div class="field-wrap"><label class="field-label">E-mail</label>
              <input id="l-email" type="email" class="field-input" placeholder="seu@email.com" autocomplete="email"/></div>
            <div class="field-wrap"><label class="field-label">Senha</label>
              <input id="l-pass" type="password" class="field-input" placeholder="sua senha" autocomplete="current-password"/></div>
            <button id="btn-login" class="btn-auth">Entrar</button>
            <p id="login-msg" class="auth-msg"></p>
          </div>
          <div id="form-register" class="auth-form hidden">
            <div class="field-wrap"><label class="field-label">Nome</label>
              <input id="r-name" type="text" class="field-input" placeholder="Seu nome"/></div>
            <div class="field-wrap"><label class="field-label">E-mail</label>
              <input id="r-email" type="email" class="field-input" placeholder="seu@email.com"/></div>
            <div class="field-wrap"><label class="field-label">Senha</label>
              <input id="r-pass" type="password" class="field-input" placeholder="mínimo 6 caracteres"/></div>
            <button id="btn-register" class="btn-auth">Criar conta</button>
            <p id="register-msg" class="auth-msg"></p>
          </div>
        </div>
      </div>
    </div>`;
  bindLoginEvents();
}

function bindLoginEvents() {
  document.querySelectorAll('.atab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.atab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
      document.getElementById('form-' + btn.dataset.t)?.classList.remove('hidden');
    });
  });
  document.getElementById('btn-google')?.addEventListener('click', async () => {
    try { await auth.signInWithPopup(googleProvider); } catch(e) { toast(ptErr(e.message), 'err'); }
  });
  document.getElementById('btn-login')?.addEventListener('click', async () => {
    const email = fval('l-email'), pass = fval('l-pass');
    const msg = document.getElementById('login-msg');
    if (!email || !pass) { msg.textContent = 'Preencha e-mail e senha.'; return; }
    const btn = document.getElementById('btn-login');
    btn.textContent = 'Entrando...'; btn.disabled = true;
    try { await auth.signInWithEmailAndPassword(email, pass); }
    catch(e) { msg.style.color='var(--err)'; msg.textContent=ptErr(e.message); btn.textContent='Entrar'; btn.disabled=false; }
  });
  document.getElementById('btn-register')?.addEventListener('click', async () => {
    const name=fval('r-name'), email=fval('r-email'), pass=fval('r-pass');
    const msg = document.getElementById('register-msg');
    if (!name||!email||!pass) { msg.textContent='Preencha todos os campos.'; return; }
    if (pass.length<6) { msg.textContent='Senha mínima: 6 caracteres.'; return; }
    const btn = document.getElementById('btn-register');
    btn.textContent='Criando...'; btn.disabled=true;
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, pass);
      await cred.user.updateProfile({ displayName: name });
    } catch(e) { msg.style.color='var(--err)'; msg.textContent=ptErr(e.message); btn.textContent='Criar conta'; btn.disabled=false; }
  });
}

function ptErr(m) {
  if (m.includes('user-not-found')||m.includes('wrong-password')||m.includes('invalid-credential')) return 'E-mail ou senha incorretos.';
  if (m.includes('email-already-in-use')) return 'E-mail já cadastrado.';
  if (m.includes('weak-password')) return 'Senha fraca. Use 6+ caracteres.';
  if (m.includes('popup-closed')) return 'Login cancelado.';
  if (m.includes('network-request-failed')) return 'Sem conexão.';
  return m;
}

// ═══════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════
async function loadProfile() {
  if (!S.user) return;
  const ref  = db.collection('profiles').doc(S.user.uid);
  const snap = await ref.get();
  if (snap.exists) {
    S.profile = snap.data();
  } else {
    const name = S.user.displayName || S.user.email?.split('@')[0] || 'Surfista';
    const p    = { uid: S.user.uid, username: name, favoriteBeach: 'itapua', level: 'intermediario', points: 0, streak: 0, bestStreak: 0, totalSessions: 0, totalCheckins: 0, earlyBird: false, classicDay: false, createdAt: firebase.firestore.FieldValue.serverTimestamp() };
    await ref.set(p);
    S.profile = p;
  }
  if (S.profile?.level) S.userLevel = S.profile.level;
}

async function updateProfile(fields) {
  if (!S.user) return;
  await db.collection('profiles').doc(S.user.uid).update(fields);
  S.profile = { ...S.profile, ...fields };
}

// ═══════════════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════════════
function renderApp() {
  root().innerHTML = appShell();
  applyTheme();
  bindAppEvents();
  // Não chama navigate aqui — bootLoad fará isso depois
}

function appShell() {
  return `
  <div class="app-wrap">
    <div class="sb-pad"></div>
    <main id="main-area">

      <!-- CHECK -->
      <section id="pg-home" class="pg active">
        <header class="topbar glass">
          <div class="tb-left">
            <span id="greeting" class="greeting-lbl"></span>
            <span id="hdr-name" class="hdr-name"></span>
          </div>
          <div class="tb-right">
            <button id="btn-theme" class="ic-btn"></button>
            <button id="btn-go-profile" class="av-btn"><div id="hdr-av" class="mini-av">?</div></button>
          </div>
        </header>
        <div class="pg-body">
          <div id="home-skeleton" class="skeleton-wrap">
            <div class="skel-hero"></div><div class="skel-chips"></div><div class="skel-block"></div>
          </div>
          <div id="home-content" class="hidden">
            <div id="hero-card" class="hero-card">
              <div class="hero-waves"></div>
              <div class="hero-inner">
                <div class="hero-top-row">
                  <div>
                    <span class="micro-lbl">SURF CHECK AGORA</span>
                    <button id="btn-pick-beach" class="beach-selector-btn">
                      <span id="hero-beach" class="hero-beach">--</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                  </div>
                </div>
                <div class="hero-decision-row">
                  <div class="hero-score-big">
                    <span id="hero-score-num" class="hero-score-num">--</span>
                    <span id="hero-score-label" class="hero-score-label">--</span>
                  </div>
                  <div class="hero-verdict">
                    <div class="verdict-item"><span class="verdict-key">Vale ir?</span><span id="verdict-worth" class="verdict-val">--</span></div>
                    <div class="verdict-item"><span class="verdict-key">Nivel</span><span id="verdict-level" class="verdict-val">--</span></div>
                    <div class="verdict-item"><span class="verdict-key">Melhor hora</span><span id="verdict-time" class="verdict-val">--</span></div>
                  </div>
                </div>
                <p id="hero-simple-text" class="hero-simple-text"></p>
                <div class="hero-badges-row">
                  <span id="api-badge" class="api-badge"></span>
                  <span id="conf-badge" class="conf-badge hidden"></span>
                </div>
              </div>
            </div>
            <div class="quick-stats">
              <div class="qs-item"><span class="qs-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M2 12 Q6 6 10 12 Q14 18 18 12 Q20 9 22 12"/></svg></span><span id="qs-swell" class="qs-val">--</span><span class="qs-lbl">Swell</span></div>
              <div class="qs-item"><span class="qs-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg></span><span id="qs-wind" class="qs-val">--</span><span class="qs-lbl">Vento</span></div>
              <div class="qs-item"><span class="qs-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span><span id="qs-period" class="qs-val">--</span><span class="qs-lbl">Periodo</span></div>
              <div class="qs-item"><span class="qs-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></span><span id="qs-dir" class="qs-val">--</span><span class="qs-lbl">Direcao</span></div>
            </div>
            <div id="why-block" class="why-block hidden">
              <div class="why-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>Por que esta assim?</span>
              </div>
              <p id="why-text" class="why-text"></p>
            </div>
            <div class="section">
              <div class="sec-row"><h3 class="sec-title">Hoje por hora</h3><button id="btn-go-forecast" class="sec-link">Semana</button></div>
              <div id="home-hourly" class="hourly-scroll-wrap"><p class="loading-txt">...</p></div>
            </div>
            <div id="score-breakdown" class="score-breakdown hidden">
              <div class="sec-row" style="margin-bottom:12px"><h3 class="sec-title">Composicao do score</h3></div>
              <div id="breakdown-bars" class="breakdown-bars"></div>
            </div>
            <div class="section">
              <div class="sec-row"><h3 class="sec-title">Mare hoje</h3></div>
              <div id="tide-card" class="tide-card">
                <div id="tide-content" class="tide-content"><p class="loading-txt">Calculando...</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PREVISAO -->
      <section id="pg-forecast" class="pg">
        <header class="topbar glass">
          <div class="tb-left">
            <span class="micro-lbl">PREVISAO</span>
            <button class="beach-selector-btn" id="btn-pick-beach-forecast">
              <span id="forecast-beach-name" class="hdr-name">--</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
          <div class="tb-right">
            <div class="mode-toggle" id="mode-toggle">
              <button class="mode-btn active" data-mode="simple">Simples</button>
              <button class="mode-btn" data-mode="technical">Tecnico</button>
            </div>
          </div>
        </header>
        <div class="pg-body">
          <!-- Hero card identico ao Check -->
          <div id="fc-hero-card" class="hero-card">
            <div class="hero-waves"></div>
            <div class="hero-inner">
              <div class="hero-top-row">
                <div>
                  <span class="micro-lbl">SURF CHECK — PREVISAO</span>
                  <span id="fc-hero-beach" class="hero-beach">--</span>
                </div>
              </div>
              <div class="hero-decision-row">
                <div class="hero-score-big">
                  <span id="fc-score-num" class="hero-score-num">--</span>
                  <span id="fc-score-lbl" class="hero-score-label">--</span>
                </div>
                <div class="hero-verdict">
                  <div class="verdict-item"><span class="verdict-key">Vale ir?</span><span id="fc-verdict-worth" class="verdict-val">--</span></div>
                  <div class="verdict-item"><span class="verdict-key">Nivel</span><span id="fc-verdict-level" class="verdict-val">--</span></div>
                  <div class="verdict-item"><span class="verdict-key">Melhor hora</span><span id="fc-verdict-time" class="verdict-val">--</span></div>
                </div>
              </div>
              <p id="fc-hero-text" class="hero-simple-text"></p>
              <div class="hero-badges-row">
                <span id="fc-api-badge" class="api-badge"></span>
              </div>
            </div>
          </div>
          <!-- Quick stats identicos ao Check -->
          <div class="quick-stats">
            <div class="qs-item"><span class="qs-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M2 12 Q6 6 10 12 Q14 18 18 12 Q20 9 22 12"/></svg></span><span id="fc-qs-swell" class="qs-val">--</span><span class="qs-lbl">Swell</span></div>
            <div class="qs-item"><span class="qs-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg></span><span id="fc-qs-wind" class="qs-val">--</span><span class="qs-lbl">Vento</span></div>
            <div class="qs-item"><span class="qs-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span><span id="fc-qs-period" class="qs-val">--</span><span class="qs-lbl">Periodo</span></div>
            <div class="qs-item"><span class="qs-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></span><span id="fc-qs-dir" class="qs-val">--</span><span class="qs-lbl">Direcao</span></div>
          </div>
          <!-- Por que esta assim -->
          <div id="fc-why-home" class="why-block hidden">
            <div class="why-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>Por que esta assim?</span>
            </div>
            <p id="fc-why-text" class="why-text"></p>
          </div>
          <div id="fc-loading" class="beach-loading hidden"><div class="spinner"></div><span>Buscando dados...</span></div>
          <div id="fc-body">
            <div id="view-simple">
              <div class="section"><div class="sec-row"><h3 class="sec-title">Hoje por hora</h3></div><div id="fc-hourly-today" class="hourly-scroll-wrap"></div></div>
              <div class="section"><div class="sec-row"><h3 class="sec-title">Score detalhado</h3></div><div id="fc-breakdown-home" class="breakdown-bars"></div></div>
              <div class="section"><div class="sec-row"><h3 class="sec-title">Amanha</h3></div><div id="fc-hourly-tom" class="hourly-scroll-wrap"></div></div>
              <div class="section"><div class="sec-row"><h3 class="sec-title">Proximos dias</h3></div><div id="fc-daily" class="daily-col"></div></div>
            </div>
            <div id="view-technical" class="hidden">
              <div class="section"><h3 class="sec-title" style="margin-bottom:12px">Condicoes atuais</h3><div id="fc-tech-grid" class="tech-grid"></div></div>
              <div id="fc-why-block" class="why-block" style="margin-bottom:16px"></div>
              <div class="section"><h3 class="sec-title" style="margin-bottom:12px">Score detalhado</h3><div id="fc-breakdown-bars" class="breakdown-bars"></div></div>
              <div class="section"><div class="sec-row"><h3 class="sec-title">Hoje (tecnico)</h3></div><div id="fc-tech-hourly" class="hourly-scroll-wrap"></div></div>
              <div class="section"><div class="sec-row"><h3 class="sec-title">Semana</h3></div><div id="fc-tech-daily" class="daily-col"></div></div>
            </div>
            <div class="fc-side-panel">
              <div id="fc-side-score" class="side-score-card"></div>
              <div class="side-card">
                <div class="sec-title" style="margin-bottom:10px">Score detalhado</div>
                <div id="fc-side-bd" class="breakdown-bars"></div>
              </div>
              <div class="side-card">
                <div class="sec-title" style="margin-bottom:10px">Mare agora</div>
                <div id="fc-side-tide-content" class="tide-content"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PRAIAS -->
      <section id="pg-beaches" class="pg">
        <header class="topbar glass"><h2 class="topbar-title">Praias</h2></header>
        <div class="pg-body">
          <input id="beach-filter" class="modal-search" type="text" placeholder="Buscar praia..." style="margin-bottom:16px"/>
          <div class="section"><div class="sec-row"><h3 class="sec-title">Salvador e arredores</h3></div><div id="beaches-city" class="beaches-list"></div></div>
          <div class="section"><div class="sec-row"><h3 class="sec-title">Litoral Norte</h3></div><div id="beaches-norte" class="beaches-list"></div></div>
          <div class="section"><div class="sec-row"><h3 class="sec-title">Ilha de Itaparica</h3></div><div id="beaches-ilha" class="beaches-list"></div></div>
        </div>
      </section>

      <!-- MARE -->
      <section id="pg-tide" class="pg">
        <header class="topbar glass">
          <div class="tb-left">
            <span class="micro-lbl">MARE</span>
            <button class="beach-selector-btn" id="btn-pick-beach-tide">
              <span id="tide-beach-name" class="hdr-name">--</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </header>
        <div class="pg-body">
          <!-- Hero card identico ao Check — mostra condicoes atuais da praia selecionada -->
          <div id="tide-hero-card" class="hero-card" style="margin-bottom:var(--sp-md)">
            <div class="hero-waves"></div>
            <div class="hero-inner">
              <div class="hero-top-row">
                <div>
                  <span class="micro-lbl">CONDICOES ATUAIS</span>
                  <span id="tide-hero-beach" class="hero-beach">--</span>
                </div>
              </div>
              <div class="hero-decision-row">
                <div class="hero-score-big">
                  <span id="tide-score-num" class="hero-score-num">--</span>
                  <span id="tide-score-lbl" class="hero-score-label">--</span>
                </div>
                <div class="hero-verdict">
                  <div class="verdict-item"><span class="verdict-key">Swell</span><span id="tide-qs-swell" class="verdict-val">--</span></div>
                  <div class="verdict-item"><span class="verdict-key">Vento</span><span id="tide-qs-wind" class="verdict-val">--</span></div>
                  <div class="verdict-item"><span class="verdict-key">Periodo</span><span id="tide-qs-period" class="verdict-val">--</span></div>
                </div>
              </div>
              <p id="tide-hero-text" class="hero-simple-text"></p>
            </div>
          </div>
          <div id="tide-full-content"></div>
        </div>
      </section>

      <!-- COMUNIDADE -->
      <section id="pg-community" class="pg">
        <header class="topbar glass">
          <div class="tb-left">
            <span class="micro-lbl">COMUNIDADE</span>
            <button class="beach-selector-btn" id="btn-pick-beach-comm">
              <span id="comm-beach-name" class="hdr-name">--</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
          <div class="tb-right">
            <button id="btn-comm-checkin" class="btn-add-small">+ Check-in</button>
          </div>
        </header>
        <div class="pg-body">
          <div class="section">
            <div class="sec-row"><h3 class="sec-title">Sentimento do dia</h3></div>
            <div id="comm-sentiment" class="sentiment-row"></div>
          </div>
          <div class="section">
            <div class="sec-row"><h3 class="sec-title">Ultimos check-ins</h3></div>
            <div id="comm-feed" class="feed-col"><p class="loading-txt">Carregando...</p></div>
          </div>
          <div class="community-form-col">
            <div class="side-card">
              <div class="sec-title" style="margin-bottom:12px">Registrar sessao</div>
              <div class="field-wrap" style="margin-bottom:12px">
                <label class="field-label">Praia</label>
                <select id="comm-beach-sel" class="field-input"></select>
              </div>
              <div class="field-wrap" style="margin-bottom:12px">
                <label class="field-label">Horario</label>
                <input id="comm-time" type="time" class="field-input" value="06:00"/>
              </div>
              <p class="field-label" style="margin-bottom:8px">Como estavam as ondas?</p>
              <div class="feeling-grid" style="margin-bottom:12px" id="comm-feeling-grid">
                <button class="feel-btn" data-cf="ruim">Ruim</button>
                <button class="feel-btn" data-cf="ok">Ok</button>
                <button class="feel-btn active" data-cf="bom">Bom</button>
                <button class="feel-btn" data-cf="classico">Classico</button>
              </div>
              <div class="field-wrap" style="margin-bottom:12px">
                <label class="field-label">Comentario</label>
                <input id="comm-comment" type="text" class="field-input" placeholder="Como foi? (opcional)"/>
              </div>
              <button id="btn-comm-submit" class="btn-primary full-w">Publicar sessao</button>
            </div>
          </div>
        </div>
      </section>


      <!-- PERFIL -->
      <section id="pg-profile" class="pg">
        <header class="topbar glass">
          <h2 class="topbar-title">Perfil</h2>
          <div class="tb-right">
            <button id="btn-edit-profile" class="ic-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
            <button id="btn-logout" class="ic-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></button>
          </div>
        </header>
        <div class="pg-body">
          <div class="profile-hero">
            <div class="ph-av-wrap"><div id="ph-av" class="ph-av">?</div></div>
            <h2 id="ph-name" class="ph-name">-</h2>
            <p id="ph-fav" class="ph-fav">-</p>
          </div>
          <div class="pref-section">
            <h3 class="sec-title" style="margin-bottom:12px">Meu nivel de surf</h3>
            <div class="level-select-grid" id="level-select-grid">
              <button class="level-opt" data-lv="iniciante"><span class="level-opt-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg></span><div><span class="level-opt-name">Iniciante</span><span class="level-opt-desc">Prefiro ondas menores e limpas</span></div></button>
              <button class="level-opt" data-lv="intermediario"><span class="level-opt-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></span><div><span class="level-opt-name">Intermediario</span><span class="level-opt-desc">Pego bem, curto variedade</span></div></button>
              <button class="level-opt" data-lv="avancado"><span class="level-opt-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span><div><span class="level-opt-name">Avancado</span><span class="level-opt-desc">Quero ondas grandes e potentes</span></div></button>
            </div>
          </div>
          <div class="stats-row">
            <div class="stat-box"><span id="st-ci" class="stat-n">0</span><span class="stat-l">Check-ins</span></div>
            <div class="stat-box streak-box"><span id="st-streak" class="stat-n">0</span><span class="stat-l">Streak</span></div>
            <div class="stat-box"><span id="st-pts" class="stat-n">0</span><span class="stat-l">Pontos</span></div>
          </div>
          <div class="section">
            <button class="btn-primary full-w" id="btn-checkin-profile">Registrar sessao de hoje</button>
          </div>
          <div class="section">
            <div class="sec-row"><h3 class="sec-title">Alertas de surf</h3></div>
            <p class="field-label" style="margin-bottom:10px;line-height:1.6">Receba uma notificacao quando o surf estiver Bom ou Classico nas proximas horas.</p>
            <button id="btn-notif-toggle" class="btn-primary full-w">Ativar alertas de surf</button>
          </div>
          <div class="section"><div class="sec-row"><h3 class="sec-title">Historico</h3></div><div id="hist-list" class="hist-col"></div></div>
        </div>
      </section>

    </main>

    <!-- NAV MOBILE (bottom) / SIDEBAR DESKTOP (left) -->
    <nav class="bot-nav">
      <button class="nav-btn active" data-pg="home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12 Q6 6 10 12 Q14 18 18 12 Q20 9 22 12"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
        <span>Check</span>
      </button>
      <button class="nav-btn" data-pg="forecast">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <span>Previsao</span>
      </button>
      <button class="nav-btn" data-pg="community">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span>Galera</span>
      </button>
      <button class="nav-btn" data-pg="tide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 6 Q6 2 10 6 Q14 10 18 6 Q20 4 22 6"/><path d="M2 12 Q6 8 10 12 Q14 16 18 12 Q20 10 22 12"/><path d="M2 18 Q6 14 10 18 Q14 22 18 18 Q20 16 22 18"/></svg>
        <span>Mare</span>
      </button>

      <button class="nav-btn" data-pg="profile">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Perfil</span>
      </button>
    </nav>

    <!-- MODAL BEACH SELECTOR GLOBAL -->
    <div id="modal-beach" class="modal-ov hidden"><div class="modal-sheet">
      <div class="modal-grip"></div>
      <h3 class="modal-title">Selecionar praia</h3>
      <input id="beach-search" class="modal-search" type="text" placeholder="Buscar praia..."/>
      <div id="beach-modal-list" class="modal-list"></div>
    </div></div>

    <!-- MODAL CHECK-IN -->
    <div id="modal-ci" class="modal-ov hidden"><div class="modal-sheet">
      <div class="modal-grip"></div>
      <h3 class="modal-title">Registrar sessao</h3>
      <div class="field-wrap">
        <label class="field-label">Praia</label>
        <select id="ci-beach-sel" class="field-input"></select>
      </div>
      <div class="field-wrap">
        <label class="field-label">Horario</label>
        <input id="ci-time" type="time" class="field-input" value="06:00"/>
      </div>
      <p class="modal-sub" style="margin-top:8px">Como estavam as ondas?</p>
      <div class="feeling-grid">
        <button class="feel-btn" data-f="ruim">Ruim</button>
        <button class="feel-btn" data-f="ok">Ok</button>
        <button class="feel-btn active" data-f="bom">Bom</button>
        <button class="feel-btn" data-f="classico">Classico</button>
      </div>
      <div class="field-wrap">
        <label class="field-label">Comentario</label>
        <input id="ci-comment" type="text" class="field-input" placeholder="Como foi? (opcional)"/>
      </div>
      <button id="btn-do-ci" class="btn-primary full-w">Registrar</button>
      <button id="btn-cancel-ci" class="btn-ghost full-w">Cancelar</button>
    </div></div>

    <!-- MODAL EDITAR PERFIL -->
    <div id="modal-edit" class="modal-ov hidden"><div class="modal-sheet">
      <div class="modal-grip"></div>
      <h3 class="modal-title">Editar perfil</h3>
      <div class="field-wrap"><label class="field-label">Nome</label>
        <input id="edit-name" type="text" class="field-input"/></div>
      <button id="btn-save-edit" class="btn-primary full-w">Salvar</button>
      <button id="btn-cancel-edit" class="btn-ghost full-w">Cancelar</button>
    </div></div>

    <div id="toasts" class="toasts-wrap"></div>
  </div>`;
}

// ═══════════════════════════════════════════════════════════
// BIND EVENTS
// ═══════════════════════════════════════════════════════════
function bindAppEvents() {
  // Nav
  document.querySelectorAll('.nav-btn[data-pg]').forEach(b =>
    b.addEventListener('click', () => navigate(b.dataset.pg))
  );
  document.getElementById('btn-go-forecast')?.addEventListener('click', () => navigate('forecast'));
  document.getElementById('btn-go-profile')?.addEventListener('click',  () => navigate('profile'));

  // Tema
  document.getElementById('btn-theme')?.addEventListener('click', () => {
    S.dark = !S.dark;
    localStorage.setItem('wc_dark', S.dark);
    applyTheme(); updateThemeBtn();
  });
  updateThemeBtn();

  // BeachSelectorModal — botoes globais de troca de praia
  // Check page
  document.getElementById('btn-pick-beach')?.addEventListener('click', () => openBeachSelector('home'));
  // Forecast page
  document.getElementById('btn-pick-beach-forecast')?.addEventListener('click', () => openBeachSelector('forecast'));
  // Tide page
  document.getElementById('btn-pick-beach-tide')?.addEventListener('click', () => openBeachSelector('tide'));
  // Community page
  document.getElementById('btn-pick-beach-comm')?.addEventListener('click', () => openBeachSelector('community'));

  // Busca no modal de praia
  document.getElementById('beach-search')?.addEventListener('input', e => populateBeachModal(e.target.value));

  // Modo simples/tecnico
  document.querySelectorAll('.mode-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      document.getElementById('view-simple')?.classList.toggle('hidden', b.dataset.mode !== 'simple');
      document.getElementById('view-technical')?.classList.toggle('hidden', b.dataset.mode !== 'technical');
    });
  });

  // Check-in
  document.querySelectorAll('#modal-ci .feel-btn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('#modal-ci .feel-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); S.feeling = b.dataset.f;
  }));
  document.getElementById('btn-do-ci')?.addEventListener('click', doCheckin);
  document.getElementById('btn-cancel-ci')?.addEventListener('click', () => closeModal('modal-ci'));
  document.getElementById('btn-checkin-profile')?.addEventListener('click', () => openCheckinModal(null, S.beach));
  document.getElementById('btn-notif-toggle')?.addEventListener('click', toggleNotifications);

  // Comunidade
  document.getElementById('btn-comm-checkin')?.addEventListener('click', () => openCheckinModal(null, S.commBeach || S.beach));
  document.getElementById('btn-comm-submit')?.addEventListener('click', doCommCheckin);
  document.getElementById('comm-feeling-grid')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-cf]'); if (!btn) return;
    document.querySelectorAll('#comm-feeling-grid .feel-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    S.commFeeling = btn.dataset.cf;
  });

  // Nivel
  document.getElementById('level-select-grid')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-lv]'); if (!btn) return;
    S.userLevel = btn.dataset.lv;
    localStorage.setItem('wc_level', S.userLevel);
    updateProfile({ level: S.userLevel }).catch(() => {});
    document.querySelectorAll('.level-opt').forEach(b => b.classList.toggle('active', b.dataset.lv === S.userLevel));
  renderNotifBtn();
    S.slots = []; S.forecastBeach = null;
    toast('Nivel: ' + levelLabel(S.userLevel));
    if (S.page === 'home' || S.page === 'forecast') onBeachChange(S.beach);
  });

  // Praias — busca
  document.getElementById('beach-filter')?.addEventListener('input', e => renderBeachesPage(e.target.value));

  // Perfil
  document.getElementById('btn-edit-profile')?.addEventListener('click', () => {
    setVal('edit-name', S.profile?.username || ''); openModal('modal-edit');
  });
  document.getElementById('btn-save-edit')?.addEventListener('click', saveProfileEdit);
  document.getElementById('btn-cancel-edit')?.addEventListener('click', () => closeModal('modal-edit'));
  document.getElementById('btn-logout')?.addEventListener('click', () => auth.signOut());

  // Modal backdrop
  document.querySelectorAll('.modal-ov').forEach(m =>
    m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); })
  );
}

// ── BeachSelectorModal: unico componente global de selecao de praia ──
// context: 'home' | 'forecast' | 'tide' | 'community'
function openBeachSelector(context) {
  S._beachSelectorCtx = context;
  populateBeachModal('');
  setVal('beach-search', '');
  openModal('modal-beach');
}

function populateBeachModal(filter) {
  const el = document.getElementById('beach-modal-list'); if (!el) return;
  const q  = filter.toLowerCase();
  const list = BEACHES.filter(b =>
    b.name.toLowerCase().includes(q) || b.region.toLowerCase().includes(q)
  );

  // Praia ativa depende do contexto
  const ctx       = S._beachSelectorCtx || 'home';
  const activeId  = ctx === 'tide'      ? S.tideBeach  :
                    ctx === 'community' ? S.commBeach  : S.beach;

  el.innerHTML = list.map(b => `
    <button class="modal-beach-row${b.id === activeId ? ' active' : ''}" data-bid="${b.id}" data-ctx="${ctx}">
      <div>
        <span class="mbr-name">${b.name}</span>
        <span class="mbr-region">${b.region} — ${levelLabel(b.level)}</span>
      </div>
      <div class="mbr-dot" style="background:${b.grad.match(/#[0-9a-fA-F]{6}/g)?.[1] || '#29b6f6'}"></div>
    </button>`).join('');

  el.querySelectorAll('.modal-beach-row').forEach(btn => btn.addEventListener('click', () => {
    const bid    = btn.dataset.bid;
    const ctx    = btn.dataset.ctx;
    closeModal('modal-beach');
    if (ctx === 'tide') {
      S.tideBeach = bid;
      setText('tide-beach-name', BEACHES.find(b => b.id === bid)?.name || '');
      renderTidePageContent();
    } else if (ctx === 'community') {
      S.commBeach = bid;
      setText('comm-beach-name', BEACHES.find(b => b.id === bid)?.name || '');
      renderCommunity();
    } else {
      onBeachChange(bid);
    }
  }));
}

function updateThemeBtn() {
  const btn = document.getElementById('btn-theme'); if (!btn) return;
  btn.innerHTML = S.dark
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

// ═══════════════════════════════════════════════════════════
// NAVEGAÇÃO
// ═══════════════════════════════════════════════════════════
function navigate(pg, animate = true) {
  if (S.page === pg) {
    // Mesma página mas praia mudou → re-render
    renderCurrentPage(); return;
  }
  const prev = document.getElementById('pg-' + S.page);
  const next = document.getElementById('pg-' + pg);
  if (!next) return;

  if (animate && prev) {
    prev.style.cssText = 'opacity:0;transform:translateY(8px);transition:opacity .18s,transform .18s';
    setTimeout(() => { prev.classList.remove('active'); prev.style.cssText = ''; }, 180);
    setTimeout(() => {
      next.classList.add('active');
      next.style.cssText = 'opacity:0;transform:translateY(8px)';
      requestAnimationFrame(() => {
        next.style.cssText = 'opacity:1;transform:translateY(0);transition:opacity .22s,transform .22s';
        setTimeout(() => { next.style.cssText = ''; }, 220);
      });
    }, 120);
  } else {
    prev?.classList.remove('active');
    next.classList.add('active');
  }

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.pg === pg));
  S.page = pg;
  renderCurrentPage();
}

// ═══════════════════════════════════════════════════════════
// LOADING STATES
// ═══════════════════════════════════════════════════════════
function setHomeLoading(on) {
  const skel = document.getElementById('home-skeleton');
  const cont = document.getElementById('home-content');
  if (on) {
    skel?.classList.remove('hidden');
    cont?.classList.add('hidden');
    // Update header mesmo durante loading
    setText('greeting', greet());
    setText('hdr-name', S.profile?.username?.split(' ')[0] || 'Surfista');
    const av = document.getElementById('hdr-av');
    if (av) av.textContent = (S.profile?.username || S.user?.displayName || 'S')[0].toUpperCase();
  } else {
    skel?.classList.add('hidden');
    cont?.classList.remove('hidden');
  }
}

function setPageLoading(on) {
  const fcLoad = document.getElementById('fc-loading');
  const fcBody = document.getElementById('fc-body');
  if (fcLoad) fcLoad.classList.toggle('hidden', !on);
  if (fcBody) fcBody.classList.toggle('hidden', on);
}

// ═══════════════════════════════════════════════════════════
// FORECAST — carregamento com fusão Open-Meteo + Stormglass
// ═══════════════════════════════════════════════════════════
async function loadForecast(beachId) {
  const bId = beachId || S.beach;
  // Cache hit
  if (S.forecastBeach === bId && S.slots.length > 0) return;

  S.forecastBeach = bId;
  const beach = BEACHES.find(x => x.id === bId);
  if (!beach) return;

  const mUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${beach.lat}&longitude=${beach.lon}&hourly=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period&timezone=America%2FSao_Paulo&forecast_days=5`;
  const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${beach.lat}&longitude=${beach.lon}&hourly=windspeed_10m,winddirection_10m&timezone=America%2FSao_Paulo&forecast_days=5`;

  try {
    const [mr, wr] = await Promise.all([fetch(mUrl), fetch(wUrl)]);
    if (!mr.ok || !wr.ok) throw new Error('API error');
    const [md, wd] = await Promise.all([mr.json(), wr.json()]);
    if (md.error) throw new Error(md.reason);

    // Tenta Stormglass (se configurado e não throttlado)
    let sgHours = null;
    if (SG_KEY) {
      sgHours = sgGetCache(bId) || null;
      if (!sgHours && sgCanRequest(bId)) {
        sgHours = await fetchStormglass(beach);
      }
      if (bId !== S.sgBeach) { S.sgData = sgHours; S.sgBeach = bId; }
    }

    // Constrói slots Open-Meteo e faz fusão
    const omSlots = md.hourly.time.map((t, i) => {
      const sh    = +(md.hourly.swell_wave_height?.[i]    ?? md.hourly.wave_height?.[i]    ?? 0.8).toFixed(1);
      const sdDeg = md.hourly.swell_wave_direction?.[i]   ?? md.hourly.wave_direction?.[i]   ?? 45;
      const sp    = Math.round(md.hourly.swell_wave_period?.[i]  ?? md.hourly.wave_period?.[i]  ?? 9);
      const ws    = Math.round((wd.hourly.windspeed_10m?.[i] ?? 12) * 3.6); // m/s → km/h
      const wdDeg = wd.hourly.winddirection_10m?.[i] ?? 90;
      return { t, day: t.slice(0,10), hour: new Date(t).getHours(), sh, sdDeg, sd: deg2card(sdDeg), sp, ws, wdDeg, wd: deg2card(wdDeg) };
    });

    S.slots = omSlots.map(omSlot => {
      const fused  = fuseSurfData(omSlot, sgHours);
      const result = computeSurfScore(fused, beach, S.userLevel);
      return { ...fused, ...result };
    });

    S.apiReal = true;
    // Salva último dado no localStorage para offline
    try { localStorage.setItem('wc_last_' + bId, JSON.stringify({ ts: Date.now(), slots: S.slots.slice(0, 48) })); } catch {}

  } catch(e) {
    console.warn('Open-Meteo falhou:', e.message);
    // Tenta cache offline
    try {
      const cached = JSON.parse(localStorage.getItem('wc_last_' + bId) || 'null');
      if (cached && Date.now() - cached.ts < 24 * 3600 * 1000) {
        S.slots   = cached.slots;
        S.apiReal = false;
        toast('Usando dados do cache (offline)', 'warn');
        return;
      }
    } catch {}
    S.slots   = [];
    S.apiReal = false;
  }
}

// Helpers de slots
const todaySlots    = () => { const d = today();    return S.slots.filter(s => s.day === d && s.hour >= 5 && s.hour <= 20); };
const tomorrowSlots = () => { const d = tomorrow(); return S.slots.filter(s => s.day === d && s.hour >= 5 && s.hour <= 20); };
const bestToday     = () => { const ts = todaySlots(); return ts.reduce((a, b) => a.score > b.score ? a : b, ts[0] || {}); };
const currentSlot   = () => {
  const h  = new Date().getHours();
  const ts = todaySlots();
  return ts.find(s => s.hour === h) || ts[0] || bestToday();
};

// ═══════════════════════════════════════════════════════════
// HOME RENDER
// ═══════════════════════════════════════════════════════════
function renderHome() {
  const beach = BEACHES.find(b => b.id === S.beach);
  if (!beach) return;

  // Header
  setText('greeting', greet());
  setText('hdr-name', S.profile?.username?.split(' ')[0] || 'Surfista');
  const av = document.getElementById('hdr-av');
  if (av) av.textContent = (S.profile?.username || S.user?.displayName || 'S')[0].toUpperCase();

  if (!S.slots.length) {
    setHomeLoading(true); return;
  }

  setHomeLoading(false);

  const hc = document.getElementById('hero-card');
  if (hc) hc.style.background = beach.grad;
  setText('hero-beach', beach.name);
  setText('forecast-beach-name', BEACHES.find(b=>b.id===S.beach)?.name||'');

  const cur  = currentSlot();
  const best = bestToday();
  if (!cur) return;

  // Score
  const scoreEl = document.getElementById('hero-score-num');
  const labelEl = document.getElementById('hero-score-label');
  if (scoreEl) { scoreEl.textContent = cur.score; scoreEl.style.color = cur.color; }
  if (labelEl) { labelEl.textContent = cur.label; labelEl.style.color = cur.color; }

  // Veredicto
  setText('verdict-worth', cur.worthIt || '--');
  setText('verdict-level', levelLabel(S.userLevel));
  setText('verdict-time', best.hour != null ? `${best.hour}h — ${best.hour + 2}h` : '--');

  // Texto
  setText('hero-simple-text', cur.simpleText || '');

  // Quick stats
  setText('qs-swell',  `${cur.sh}m`);
  setText('qs-wind',   `${cur.ws}km/h ${cur.wd}`);
  setText('qs-period', `${cur.sp}s`);
  setText('qs-dir',    cur.sd || '--');

  // Badges
  setApiBadge(S.apiReal);
  setConfBadge(cur.confidence);

  // Por que está assim
  const wb = document.getElementById('why-block');
  if (wb && cur.whyText) { wb.classList.remove('hidden'); setText('why-text', cur.whyText); }

  // Previsão por hora
  renderHourlyCards('home-hourly', todaySlots());

  // Score breakdown
  renderBreakdownBars('breakdown-bars', cur.breakdown);
  document.getElementById('score-breakdown')?.classList.remove('hidden');

  // Maré
  renderTideCard('tide-content', cur, beach);
}

function setApiBadge(real) {
  const el = document.getElementById('api-badge'); if (!el) return;
  el.textContent = real ? '● Dados ao vivo' : '⚠ Cache / offline';
  el.className   = real ? 'api-badge badge-real' : 'api-badge badge-warn';
}

function setConfBadge(conf) {
  const el = document.getElementById('conf-badge'); if (!el) return;
  if (!conf || !SG_KEY) { el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  const map = { alta: ['🔵 Alta confiança','conf-high'], media: ['🟡 Confiança média','conf-mid'], baixa: ['🔴 Baixa confiança','conf-low'] };
  const [txt, cls] = map[conf] || map.media;
  el.textContent = txt;
  el.className = `conf-badge ${cls}`;
}

// ═══════════════════════════════════════════════════════════
// FORECAST PAGE
// ═══════════════════════════════════════════════════════════
async function renderForecastPage() {
  const beach = BEACHES.find(b => b.id === S.beach);
  if (!beach) return;

  setText('forecast-beach-name', beach.name);

  // Aplica gradiente e nome imediatamente (antes dos dados)
  const fcHero = document.getElementById('fc-hero-card');
  if (fcHero) fcHero.style.background = beach.grad;
  setText('fc-hero-beach', beach.name);
  setText('fc-hero-text', 'Buscando condicoes...');

  if (!S.slots.length) {
    setPageLoading(true);
    await loadForecast(S.beach);
    setPageLoading(false);
  }

  if (!S.slots.length) { setText('fc-hero-text', 'Sem dados disponíveis.'); return; }

  const cur  = currentSlot();
  const best = bestToday();
  if (!cur) return;

  const scoreEl = document.getElementById('fc-score-num');
  const labelEl = document.getElementById('fc-score-lbl');
  if (scoreEl) { scoreEl.textContent = cur.score; scoreEl.style.color = cur.color; }
  if (labelEl) { labelEl.textContent = cur.label; labelEl.style.color = cur.color; }

  setText('fc-verdict-worth', cur.worthIt || '--');
  setText('fc-verdict-level', levelLabel(S.userLevel));
  setText('fc-verdict-time',  best.hour != null ? `${best.hour}h — ${best.hour + 2}h` : '--');
  setText('fc-hero-text', cur.simpleText || '');

  setText('fc-qs-swell',  `${cur.sh}m`);
  setText('fc-qs-wind',   `${cur.ws}km/h ${cur.wd}`);
  setText('fc-qs-period', `${cur.sp}s`);
  setText('fc-qs-dir',    cur.sd || '--');

  const apiBadge = document.getElementById('fc-api-badge');
  if (apiBadge) {
    apiBadge.textContent = S.apiReal ? '● Dados ao vivo' : '⚠ Cache / offline';
    apiBadge.className   = S.apiReal ? 'api-badge badge-real' : 'api-badge badge-warn';
  }

  // Por que esta assim
  const wb = document.getElementById('fc-why-home');
  if (wb && cur.whyText) { wb.classList.remove('hidden'); setText('fc-why-text', cur.whyText); }

  // Previsao por hora e breakdown (modo simples)
  renderHourlyCards('fc-hourly-today', todaySlots());
  renderBreakdownBars('fc-breakdown-home', cur.breakdown);
  renderHourlyCards('fc-hourly-tom',   tomorrowSlots());
  renderDailyCards('fc-daily');

  // Técnico
  renderTechGrid('fc-tech-grid', cur, beach);
  const fwb = document.getElementById('fc-why-block');
  if (fwb) fwb.innerHTML = cur.whyText ? `
    <div class="why-header"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>Por que está assim?</span></div>
    <p class="why-text">${cur.whyText}</p>` : '';
  renderBreakdownBars('fc-breakdown-bars', cur.breakdown);
  renderHourlyCards('fc-tech-hourly', todaySlots(), true);
  renderDailyCards('fc-tech-daily');

  // ── Painel lateral desktop ──
  const sideScore = document.getElementById('fc-side-score');
  if (sideScore) {
    sideScore.innerHTML = `
      <div class="side-score-inner" style="border-color:${cur.color}44">
        <span class="side-score-num" style="color:${cur.color}">${cur.score}</span>
        <span class="side-score-lbl" style="color:${cur.color}">${cur.emoji} ${cur.label}</span>
        <p class="side-score-text">${cur.simpleText || ''}</p>
        <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
          <span class="api-badge ${S.apiReal?'badge-real':'badge-warn'}">${S.apiReal?'● Dados ao vivo':'⚠ Cache'}</span>
          ${cur.confidence && SG_KEY ? `<span class="conf-badge conf-${cur.confidence==='alta'?'high':cur.confidence==='media'?'mid':'low'}">${cur.confidence==='alta'?'🔵 Alta':cur.confidence==='media'?'🟡 Média':'🔴 Baixa'} confiança</span>` : ''}
        </div>
      </div>`;
  }
  renderBreakdownBars('fc-side-bd', cur.breakdown);
  renderTideCard('fc-side-tide-content', cur, beach);

  // Debug fonte de dados (opcional)
  const debugEl = document.getElementById('source-debug');
  if (debugEl && cur.source) {
    debugEl.classList.remove('hidden');
    debugEl.innerHTML = `
      <div class="debug-header">Fontes de dados</div>
      <div class="debug-row"><span>Open-Meteo</span><span class="debug-val">swell ${cur.om?.sh ?? cur.sh}m / ${cur.om?.sp ?? cur.sp}s</span></div>
      ${cur.sg ? `<div class="debug-row"><span>Stormglass</span><span class="debug-val">swell ${cur.sg.sh?.toFixed(1) ?? '--'}m / ${cur.sg.sp?.toFixed(0) ?? '--'}s</span></div>` : '<div class="debug-row"><span>Stormglass</span><span class="debug-val">não configurado</span></div>'}
      <div class="debug-row"><span>Fusão</span><span class="debug-val">${cur.source === 'fused' ? `média ponderada (divergência: ${(cur.diverge*100).toFixed(0)}%)` : 'Open-Meteo apenas'}</span></div>
      <div class="debug-row"><span>Confiança</span><span class="debug-val">${cur.confidence || 'média'}</span></div>`;
  }
}

function renderSimpleSummary(id, cur, beach) {
  const el = document.getElementById(id); if (!el) return;
  el.innerHTML = `
    <div class="ss-verdict" style="border-color:${cur.color}44;background:${cur.color}0f">
      <span class="ss-emoji">${cur.emoji || '🏄'}</span>
      <div class="ss-texts">
        <span class="ss-label" style="color:${cur.color}">${cur.label} — ${cur.score}/100</span>
        <p class="ss-simple">${cur.simpleText}</p>
      </div>
    </div>
    <p class="ss-beach-info"> ${beach.desc}</p>`;
}

function renderTechGrid(id, cur, beach) {
  const el = document.getElementById(id); if (!el) return;
  const windTypeLabel = { offshore: ' Offshore (terral)', cross: ' Cruzado', onshore: ' Onshore (maral)' };
  const tideLabel2 = { low: ' Baixa', mid: ' Meia', high: ' Cheia' };
  const swellType  = cur.sp >= 14 ? 'Ground swell' : cur.sp >= 10 ? 'Wind swell' : 'Wind chop';
  const energyKJ   = Math.round(1025 * 9.81 / 64 * cur.sh * cur.sh * cur.sp / 1000);

  el.innerHTML = [
    { lbl:'Altura swell', val:`${cur.sh} m`,       sub:`Dir: ${cur.sd} — ${swellType}` },
    { lbl:'Período',      val:`${cur.sp} s`,        sub:swellType },
    { lbl:'Vento',        val:`${cur.ws} km/h`,     sub:windTypeLabel[cur.windType] || cur.windType },
    { lbl:'Dir. vento',   val:cur.wd,               sub:`Ideal: ${beach.bestWind?.slice(0,2).join('/')}` },
    { lbl:'Maré',         val:tideLabel2[cur.tideType] || cur.tideType, sub:`Ideal: ${tideLabel2[beach.idealTide]}` },
    { lbl:'Energia',      val:`~${energyKJ} kJ/m²`, sub:'Potência estimada' },
    { lbl:'Score',        val:cur.score,            sub:`${cur.label} para ${levelLabel(S.userLevel)}` },
    { lbl:'Confiança',    val:cur.confidence || 'média', sub: cur.source === 'fused' ? '2 fontes' : '1 fonte' },
  ].map(c => `
    <div class="tech-card">
      <span class="tech-lbl">${c.lbl}</span>
      <span class="tech-val">${c.val}</span>
      <span class="tech-sub">${c.sub}</span>
    </div>`).join('');
}

// ═══════════════════════════════════════════════════════════
// BEACHES PAGE
// ═══════════════════════════════════════════════════════════
function renderBeachesPage(filter = '') {
  const f     = filter.toLowerCase();
  const all   = BEACHES.filter(b => b.name.toLowerCase().includes(f) || b.region.toLowerCase().includes(f));
  const city  = all.filter(b => b.region.includes('Salvador'));
  const norte = all.filter(b => b.region.includes('Litoral Norte'));
  const ilha  = all.filter(b => b.region.includes('Itaparica'));

  renderBeachList('beaches-city',  city);
  renderBeachList('beaches-norte', norte);
  renderBeachList('beaches-ilha',  ilha);
}

function renderBeachList(id, list) {
  const el = document.getElementById(id); if (!el) return;
  if (!list.length) { el.innerHTML = '<p class="no-data-txt">Nenhuma praia encontrada.</p>'; return; }
  el.innerHTML = list.map(b => `
    <button class="beach-list-row${b.id === S.beach ? ' active' : ''}" data-bid="${b.id}">
      <div class="blr-dot" style="background:${b.grad.match(/#[0-9a-fA-F]{6}/g)?.[1] || '#29b6f6'}"></div>
      <div class="blr-info">
        <span class="blr-name">${b.name}</span>
        <span class="blr-meta">${b.region} · ${typeLabel(b.type)} · ${levelLabel(b.level)}</span>
        <span class="blr-desc">${b.desc}</span>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16"><polyline points="9 18 15 12 9 6"/></svg>
    </button>`).join('');
  el.querySelectorAll('.beach-list-row').forEach(btn => btn.addEventListener('click', () => {
    onBeachChange(btn.dataset.bid);
    toast(BEACHES.find(b => b.id === btn.dataset.bid)?.name + ' selecionada');
    navigate('forecast');
  }));
}

// ═══════════════════════════════════════════════════════════
// TIDE PAGE
// ═══════════════════════════════════════════════════════════
function renderTidePage() {
  const tBeach = S.tideBeach || S.beach;
  S.tideBeach  = tBeach;
  const beach  = BEACHES.find(b => b.id === tBeach);
  setText('tide-beach-name', beach?.name || '');

  // Aplica gradiente e nome imediatamente
  const tideHero = document.getElementById('tide-hero-card');
  if (tideHero && beach) tideHero.style.background = beach.grad;
  setText('tide-hero-beach', beach?.name || '');
  setText('tide-hero-text', 'Buscando condicoes...');

  // Se temos slots para essa praia, usa os dados reais
  const cur = (S.forecastBeach === tBeach && S.slots.length) ? currentSlot() : null;
  if (cur) {
    const sEl = document.getElementById('tide-score-num');
    const lEl = document.getElementById('tide-score-lbl');
    if (sEl) { sEl.textContent = cur.score; sEl.style.color = cur.color; }
    if (lEl) { lEl.textContent = cur.label; lEl.style.color = cur.color; }
    setText('tide-qs-swell',  `${cur.sh}m`);
    setText('tide-qs-wind',   `${cur.ws}km/h ${cur.wd}`);
    setText('tide-qs-period', `${cur.sp}s`);
    setText('tide-hero-text', cur.simpleText || '');
  } else {
    // Praia diferente da selecionada no check — carrega forecast em background
    setText('tide-score-num', '--');
    setText('tide-score-lbl', '');
    setText('tide-hero-text', 'Carregando dados...');
    loadForecast(tBeach).then(() => {
      if (S.page === 'tide' && S.tideBeach === tBeach) renderTidePage();
    });
  }

  renderTidePageContent();
}

function renderTidePageContent() {
  const beach = BEACHES.find(b => b.id === (S.tideBeach || S.beach));
  if (!beach) return;

  const cur      = (S.tideBeach === S.beach ? currentSlot() : null) || {};
  const hasSGTide = cur.tideH != null;
  const tideNow  = hasSGTide ? cur.tideH : parseFloat(getTideHeightEst(new Date().getHours()));
  const tideType = realTideType(tideNow);
  const schedule = buildTideSchedule(cur);
  const el       = document.getElementById('tide-full-content');
  if (!el) return;

  el.innerHTML = `
    <div class="tide-status-card">
      <h3 class="tide-status-title">Estado atual da maré</h3>
      <div class="tide-status-body">
        <div class="tide-status-big">
          <span class="tide-current-label" style="color:var(--acc)">${tideLabelFull(tideType)}</span>
          <span class="tide-current-height">${tideNow.toFixed(1)} m${hasSGTide ? ' (Stormglass)' : ' (estimado)'}</span>
        </div>
        <p class="tide-impact">${getTideImpact(beach, tideType)}</p>
      </div>
    </div>

    <div class="section">
      <div class="sec-row"><h3 class="sec-title">Tábua de hoje</h3></div>
      <div class="tide-table">
        ${schedule.map(t => `
          <div class="tide-row">
            <span class="tide-time">${t.time}</span>
            <div class="tide-bar-wrap"><div class="tide-bar-fill" style="width:${Math.round(t.pct*100)}%;background:${t.type==='high'?'#29b6f6':'#3d8eff'}"></div></div>
            <span class="tide-h-val">${t.height} m</span>
            <span class="tide-type-lbl ${t.type==='high'?'tide-high':'tide-low'}">${t.type==='high'?'Alta':'Baixa'}</span>
          </div>`).join('')}
      </div>
    </div>

    <div class="section">
      <div class="sec-row"><h3 class="sec-title">Variação ao longo do dia</h3></div>
      <div class="tide-graph-wrap">
        <svg viewBox="0 0 300 80" class="tide-svg">${generateTideSVG()}</svg>
        <div class="tide-hours-row">${[0,3,6,9,12,15,18,21].map(h=>`<span>${h}h</span>`).join('')}</div>
      </div>
    </div>

    <div class="section">
      <div class="sec-row"><h3 class="sec-title">Maré ideal para ${beach.name}</h3></div>
      <div class="tide-info-card">
        <div class="tic-row"><span class="tic-lbl">Maré ideal</span><span class="tic-val">${tideLabelFull(beach.idealTide)}</span></div>
        <div class="tic-row"><span class="tic-lbl">Tipo de pico</span><span class="tic-val">${typeLabel(beach.type)}</span></div>
        <div class="tic-row"><span class="tic-lbl">Orientação</span><span class="tic-val">${beach.orientation}</span></div>
        <p class="tic-note">${getTideImpact(beach, beach.idealTide)}</p>
      </div>
    </div>`;
}

function buildTideSchedule(cur) {
  // Se tem dados do SG com maré real, usa. Senão, usa padrão semi-diurno estimado.
  if (cur?.sg?.tideH != null) {
    // Simplificado: busca picos nos slots de hoje
    const tSlots = todaySlots().filter(s => s.tideH != null);
    if (tSlots.length > 2) {
      const highs = [], lows = [];
      for (let i = 1; i < tSlots.length - 1; i++) {
        if (tSlots[i].tideH > tSlots[i-1].tideH && tSlots[i].tideH > tSlots[i+1].tideH) highs.push(tSlots[i]);
        if (tSlots[i].tideH < tSlots[i-1].tideH && tSlots[i].tideH < tSlots[i+1].tideH) lows.push(tSlots[i]);
      }
      const result = [...highs.map(s => ({ time:`${s.hour}:00`, height: s.tideH.toFixed(1), type:'high', pct: Math.min(1, s.tideH / 2) })),
                      ...lows.map(s  => ({ time:`${s.hour}:00`, height: s.tideH.toFixed(1), type:'low',  pct: Math.min(1, s.tideH / 2) }))];
      if (result.length) return result.sort((a,b) => parseInt(a.time) - parseInt(b.time));
    }
  }
  // Fallback: padrão semi-diurno tropical (BA tem amplitudes de ~2.0m)
  return [
    { time:'03:00', height:'0.3', type:'low',  pct:0.15 },
    { time:'09:00', height:'1.9', type:'high', pct:0.95 },
    { time:'15:15', height:'0.4', type:'low',  pct:0.20 },
    { time:'21:30', height:'1.7', type:'high', pct:0.85 },
  ];
}

function getTideHeightEst(hour) {
  const t = hour / 24 * 2 * Math.PI * 2;
  return ((Math.sin(t + 1.2) * 0.5 + 0.5) * 1.6 + 0.3).toFixed(1);
}

function generateTideSVG() {
  const pts = [];
  for (let i = 0; i <= 300; i += 3) {
    const t = i / 300 * 2 * Math.PI * 2;
    const y = 70 - (Math.sin(t + 1.2) * 0.5 + 0.5) * 55;
    pts.push(`${i},${y.toFixed(1)}`);
  }
  const path = `M${pts.join(' L')}`;
  const area = `M0,80 L${pts.join(' L')} L300,80 Z`;
  return `<defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#29b6f6" stop-opacity="0.45"/><stop offset="100%" stop-color="#29b6f6" stop-opacity="0.04"/></linearGradient></defs>
    <path d="${area}" fill="url(#tg)"/>
    <path d="${path}" fill="none" stroke="#29b6f6" stroke-width="2" stroke-linecap="round"/>`;
}

function getTideImpact(beach, tideType) {
  const map = {
    low:  { beach_break: 'Maré baixa expõe os bancos — pode criar ondas com mais forma e definição.', point_break: 'Maré baixa no point aumenta a definição. Cuidado com pedras rasas.', reef_break: 'Atenção: maré baixa no reef pode ser perigosa. Verifique a profundidade.' },
    mid:  { beach_break: 'Meia maré costuma ser a janela mais equilibrada para beach breaks.', point_break: 'Meia maré no point funciona bem — ondas com bom curso.', reef_break: 'Janela segura para o reef. Boa profundidade e ondas bem formadas.' },
    high: { beach_break: 'Maré cheia tende a embocar as ondas — menos forma, ondas mais pesadas.', point_break: 'Maré alta pode cobrir o pico. Ondas maiores e mais perigosas.', reef_break: 'Maré alta oferece mais segurança no reef. Ondas mais roláveis.' },
  };
  return map[tideType]?.[beach.type] || 'A maré influencia diretamente a qualidade das ondas nesta praia.';
}

function tideLabelFull(type) {
  return { low:' Maré Baixa', mid:' Meia Maré', high:' Maré Cheia' }[type] || type;
}

function renderTideCard(id, cur, beach) {
  const el = document.getElementById(id); if (!el) return;
  const tideNow = cur.tideH != null ? cur.tideH.toFixed(1) : getTideHeightEst(cur.hour || new Date().getHours());
  const tType   = cur.tideH != null ? realTideType(cur.tideH) : estimateTideType(cur.hour);
  const src     = cur.tideH != null ? '(Stormglass)' : '(estimado)';
  el.innerHTML = `
    <div class="tide-mini-row">
      <div class="tide-mini-item"><span class="tide-mini-lbl">Agora</span><span class="tide-mini-val">${tideLabelFull(tType).split(' ').slice(1).join(' ')}</span></div>
      <div class="tide-mini-item"><span class="tide-mini-lbl">Altura</span><span class="tide-mini-val">${tideNow}m ${src}</span></div>
      <div class="tide-mini-item"><span class="tide-mini-lbl">Ideal aqui</span><span class="tide-mini-val">${tideLabelFull(beach.idealTide).split(' ').slice(1).join(' ')}</span></div>
    </div>
    <p class="tide-mini-note">${getTideImpact(beach, tType)}</p>`;
}

// ═══════════════════════════════════════════════════════════
// COMUNIDADE
// ═══════════════════════════════════════════════════════════
async function renderCommunity() {
  const beachId = S.commBeach || S.beach;
  const beach   = BEACHES.find(b => b.id === beachId);

  setText('comm-beach-name', beach?.name || '');

  // Preenche select do form inline
  const sel = document.getElementById('comm-beach-sel');
  if (sel) sel.innerHTML = BEACHES.map(b =>
    `<option value="${b.id}"${b.id === beachId ? ' selected' : ''}>${b.name} — ${b.region}</option>`
  ).join('');

  // Sentimento
  try {
    const sentSnap = await db.collection('checkins')
      .where('beachId','==', beachId)
      .where('date','==', today())
      .get();

    const counts = { ruim:0, ok:0, bom:0, classico:0 };
    sentSnap.forEach(d => { const f=d.data().feeling; if(f in counts) counts[f]++; });
    const total = Object.values(counts).reduce((a,b)=>a+b,0) || 1;
    const cfg   = { ruim:[' Ruim','#ef5350'], ok:[' Ok','#ffb74d'], bom:[' Bom','#29b6f6'], classico:[' Clássico','#00e676'] };
    const sentEl = document.getElementById('comm-sentiment');
    if (sentEl) sentEl.innerHTML = Object.entries(counts).map(([k,n]) => `
      <div class="sent-bar-row">
        <span class="sent-label">${cfg[k][0]}</span>
        <div class="sent-track"><div class="sent-fill" style="width:${Math.round(n/total*100)}%;background:${cfg[k][1]}"></div></div>
        <span class="sent-count" style="color:${cfg[k][1]}">${n}</span>
      </div>`).join('');
  } catch(e) { console.warn('sentiment:', e); }

  // Feed de check-ins
  const feedEl = document.getElementById('comm-feed');
  if (!feedEl) return;
  feedEl.innerHTML = '<p class="loading-txt">Carregando check-ins...</p>';

  try {
    const snap = await db.collection('checkins')
      .where('beachId','==', beachId)
      .orderBy('createdAt','desc')
      .limit(30)
      .get();

    if (snap.empty) {
      feedEl.innerHTML = `<div class="empty-state">
        <p>Nenhum check-in ainda em ${beach?.name}.</p>
        <p>Seja o primeiro a surfar hoje!</p>
      </div>`;
      return;
    }

    const feelCfg = {
      classico: { icon:'', label:'Clássico', color:'#00e676' },
      bom:      { icon:'', label:'Bom',      color:'#29b6f6' },
      ok:       { icon:'', label:'Ok',        color:'#ffb74d' },
      ruim:     { icon:'', label:'Ruim',      color:'#ef5350' },
    };

    feedEl.innerHTML = snap.docs.map((doc, idx) => {
      const c      = doc.data();
      const isMe   = c.userId === S.user?.uid;
      const fc     = feelCfg[c.feeling] || feelCfg.ok;
      const avatar = (c.username || '?')[0].toUpperCase();
      const timeStr = c.time ? ` às ${c.time}` : '';
      const scoreStr = c.waveScore != null ? `<span class="feed-score" style="color:${fc.color}">Score ${c.waveScore}</span>` : '';
      return `
        <div class="feed-card${isMe ? ' feed-me' : ''}" style="animation-delay:${idx*30}ms">
          <div class="feed-row">
            <div class="feed-av${isMe ? ' feed-av-me' : ''}">${avatar}</div>
            <div class="feed-info">
              <span class="feed-name">${isMe ? 'Você' : (c.username || 'Surfista')}</span>
              <span class="feed-meta">${c.beachName || c.beachId}${timeStr} · ${ago(c.createdAt?.toDate?.())}</span>
            </div>
            <span class="feel-tag" style="background:${fc.color}22;color:${fc.color};border:1px solid ${fc.color}44">${fc.icon} ${fc.label}</span>
          </div>
          ${c.comment ? `<p class="feed-comment">${c.comment}</p>` : ''}
          ${scoreStr}
        </div>`;
    }).join('');

  } catch(e) {
    console.error('Feed:', e);
    feedEl.innerHTML = `<div class="empty-state"><p>Erro ao carregar. Verifique a conexão.</p></div>`;
  }
}

// ═══════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════
async function renderProfile() {
  await loadProfile();
  const p   = S.profile || {};
  const fav = BEACHES.find(b => b.id === (p.favoriteBeach || 'itapua'));
  const av  = document.getElementById('ph-av');
  if (av) av.textContent = (p.username || S.user?.displayName || 'S')[0].toUpperCase();
  setText('ph-name', p.username || S.user?.displayName || '-');
  setText('ph-fav',  fav?.name || '-');
  setText('st-ci',     p.totalCheckins || 0);
  setText('st-streak', p.streak        || 0);
  setText('st-pts',    p.points        || 0);
  document.querySelectorAll('.level-opt').forEach(b => b.classList.toggle('active', b.dataset.lv === S.userLevel));

  try {
    const snap = await db.collection('checkins').where('userId','==',S.user.uid).orderBy('createdAt','desc').limit(8).get();
    const hist = document.getElementById('hist-list');
    if (hist) {
      if (snap.empty) { hist.innerHTML = '<div class="empty-state"><p>Nenhum check-in ainda. Vai surfar!</p></div>'; }
      else {
        const femap = { classico:' Clássico', bom:' Bom', ok:' Ok', ruim:' Ruim' };
        hist.innerHTML = snap.docs.map((d,idx) => {
          const c = d.data();
          const col = c.feeling==='classico'?'#00e676':c.feeling==='bom'?'#29b6f6':c.feeling==='ok'?'#ffb74d':'#ef5350';
          return `<div class="hist-item" style="animation-delay:${idx*40}ms">
            <div class="hist-dot" style="background:${col}"></div>
            <div class="hist-info">
              <span class="hist-beach">${beachName(c.beachId)}</span>
              <span class="hist-when">${dateShort(c.date)} · ${femap[c.feeling]||c.feeling}</span>
              ${c.comment?`<span class="hist-note">${c.comment}</span>`:''}
            </div></div>`;
        }).join('');
      }
    }
  } catch(e) { console.error('History:', e); }
}

// ═══════════════════════════════════════════════════════════
// RENDER HELPERS
// ═══════════════════════════════════════════════════════════
function renderHourlyCards(id, slots, technical = false) {
  const el = document.getElementById(id); if (!el) return;
  if (!slots.length) { el.innerHTML = '<p class="no-data-txt">Sem dados para este período.</p>'; return; }
  const best = slots.reduce((a, b) => a.score > b.score ? a : b, slots[0]);
  el.innerHTML = `<div class="hourly-inner">${slots.map((s, idx) => {
    const isBest = s.hour === best.hour;
    return `<div class="hourly-card${isBest?' hourly-best':''}" style="animation-delay:${idx*18}ms">
      ${isBest ? '<span class="hourly-best-tag">Melhor</span>' : ''}
      <span class="hourly-time">${s.hour}h</span>
      <div class="hourly-bar-wrap">
        <div class="hourly-bar" style="height:${s.score}%;background:${s.color};box-shadow:0 0 8px ${s.color}55"></div>
      </div>
      <span class="hourly-score" style="color:${s.color}">${s.score}</span>
      <span class="hourly-height">${s.sh}m</span>
      ${technical ? `<span class="hourly-period">${s.sp}s</span><span class="hourly-wind">${s.wd}</span>` : ''}
    </div>`;
  }).join('')}</div>`;
}

function renderDailyCards(id) {
  const el = document.getElementById(id); if (!el) return;
  const days = {};
  S.slots.forEach(s => {
    if (!days[s.day]) days[s.day] = [];
    if (s.hour >= 6 && s.hour <= 18) days[s.day].push(s);
  });
  const entries = Object.entries(days).slice(0, 5);
  if (!entries.length) { el.innerHTML = '<p class="no-data-txt">Sem previsão disponível.</p>'; return; }
  el.innerHTML = entries.map(([day, slots], idx) => {
    if (!slots.length) return '';
    const avg    = Math.round(slots.reduce((a,s)=>a+s.score,0)/slots.length);
    const maxH   = Math.max(...slots.map(s=>s.sh)).toFixed(1);
    const minH   = Math.min(...slots.map(s=>s.sh)).toFixed(1);
    const best   = slots.reduce((a,b)=>a.score>b.score?a:b);
    const avgP   = Math.round(slots.reduce((a,s)=>a+s.sp,0)/slots.length);
    const emoji  = avg>=80?'':avg>=65?'':avg>=45?'':'';
    return `<div class="daily-card" style="animation-delay:${idx*50}ms">
      <div class="daily-left">
        <span class="daily-day">${dayName(day)}</span>
        <span class="daily-score" style="color:${best.color}">${avg}</span>
        <span class="daily-label" style="color:${best.color}">${best.label}</span>
      </div>
      <div class="daily-mid">
        <span class="daily-swell">${minH}–${maxH}m</span>
        <span class="daily-period">T: ${avgP}s</span>
        <span class="daily-best-time">Melhor: ${best.hour}h</span>
      </div>
      <span class="daily-emoji">${emoji}</span>
    </div>`;
  }).join('');
}

function renderBreakdownBars(id, bd) {
  const el = document.getElementById(id); if (!el || !bd) return;
  const items = [
    { lbl:'Altura',        val:bd.altura,       icon:'' },
    { lbl:'Período',       val:bd.periodo,      icon:'' },
    { lbl:'Dir. swell',    val:bd.direcaoSwell, icon:'' },
    { lbl:'Vento',         val:bd.vento,        icon:'' },
    { lbl:'Maré',          val:bd.mare,         icon:'' },
    { lbl:'Consistência',  val:bd.consistencia, icon:'' },
  ];
  el.innerHTML = items.map(it => {
    const isPos = it.val >= 0;
    const pct   = Math.min(100, Math.abs(it.val) / 45 * 100);
    const col   = it.val >= 15?'#00e676':it.val >= 0?'#29b6f6':it.val >= -15?'#ffb74d':'#ef5350';
    return `<div class="bdb-row">
      <span class="bdb-icon">${it.icon}</span>
      <span class="bdb-lbl">${it.lbl}</span>
      <div class="bdb-bar-bg">
        <div class="bdb-bar" style="width:${pct}%;background:${col};${!isPos?'margin-left:auto':''}"></div>
      </div>
      <span class="bdb-val" style="color:${col}">${it.val>0?'+':''}${it.val}</span>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════
// BEACH MODAL
// ═══════════════════════════════════════════════════════════
function populateBeachModal(filter) {
  const el = document.getElementById('beach-modal-list'); if (!el) return;
  const list = BEACHES.filter(b => b.name.toLowerCase().includes(filter.toLowerCase()));
  el.innerHTML = list.map(b => `
    <button class="modal-beach-row${b.id===S.beach?' active':''}" data-bid="${b.id}">
      <div><span class="mbr-name">${b.name}</span><span class="mbr-region">${b.region} · ${levelLabel(b.level)}</span></div>
      <div class="mbr-dot" style="background:${b.grad.match(/#[0-9a-fA-F]{6}/g)?.[1]||'#29b6f6'}"></div>
    </button>`).join('');
  el.querySelectorAll('.modal-beach-row').forEach(btn => btn.addEventListener('click', () => {
    closeModal('modal-beach');
    onBeachChange(btn.dataset.bid);
  }));
}

// ═══════════════════════════════════════════════════════════
// CHECK-IN
// ═══════════════════════════════════════════════════════════
function openCheckinModal(sessionId, beachId) {
  S.pendingCI = { sessionId, beachId: beachId || S.beach };
  // Preenche select de praias
  const sel = document.getElementById('ci-beach-sel');
  if (sel) {
    sel.innerHTML = BEACHES.map(b =>
      `<option value="${b.id}"${b.id === (beachId||S.beach) ? ' selected' : ''}>${b.name} — ${b.region}</option>`
    ).join('');
  }
  // Pré-preenche horário com hora atual arredondada
  const timeEl = document.getElementById('ci-time');
  if (timeEl) {
    const h = new Date().getHours();
    timeEl.value = `${String(h).padStart(2,'0')}:00`;
  }
  // Reset feeling
  document.querySelectorAll('#modal-ci .feel-btn').forEach(b => b.classList.toggle('active', b.dataset.f === 'bom'));
  S.feeling = 'bom';
  setVal('ci-comment', '');
  openModal('modal-ci');
}

async function doCheckin() {
  // Lê praia e horário do modal
  const beachId  = document.getElementById('ci-beach-sel')?.value || S.pendingCI?.beachId || S.beach;
  const timeVal  = document.getElementById('ci-time')?.value || new Date().getHours() + ':00';
  const comment  = fval('ci-comment') || null;
  const beach    = BEACHES.find(b => b.id === beachId);
  const cur      = currentSlot();
  const btn      = document.getElementById('btn-do-ci');
  if (btn) { btn.disabled = true; btn.textContent = 'Registrando...'; }
  try {
    await db.collection('checkins').add({
      userId:   S.user.uid,
      username: S.profile?.username || 'Surfista',
      beachId,
      beachName: beach?.name || beachId,
      time:     timeVal,
      feeling:  S.feeling,
      comment,
      waveScore: cur?.score ?? null,
      date:     today(),
      type:     'checkin',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    const upd = {
      totalCheckins: (S.profile?.totalCheckins || 0) + 1,
      streak:        (S.profile?.streak || 0) + 1,
      bestStreak:    Math.max(S.profile?.bestStreak || 0, (S.profile?.streak || 0) + 1),
      points:        (S.profile?.points || 0) + 15,
    };
    if (parseInt(timeVal) < 7) upd.earlyBird = true;
    if ((cur?.score || 0) >= 80) upd.classicDay = true;
    await updateProfile(upd);
    closeModal('modal-ci');
    toast(`Check-in em ${beach?.name || beachId} às ${timeVal}! +15 pts`);
    if (S.page === 'profile')   renderProfile();
    if (S.page === 'community') renderCommunity();
  } catch(e) { toast(e.message, 'err'); }
  finally { if (btn) { btn.disabled = false; btn.textContent = 'Registrar'; } }
}

// ── Check-in inline da comunidade (desktop) ──
async function doCommCheckin() {
  const beachId = document.getElementById('comm-beach-sel')?.value || S.commBeach || S.beach;
  const timeVal = document.getElementById('comm-time')?.value || '06:00';
  const comment = document.getElementById('comm-comment')?.value?.trim() || null;
  const feeling = S.commFeeling || 'bom';
  const beach   = BEACHES.find(b => b.id === beachId);
  const btn     = document.getElementById('btn-comm-submit');
  if (btn) { btn.disabled = true; btn.textContent = 'Publicando...'; }
  try {
    await db.collection('checkins').add({
      userId:    S.user.uid,
      username:  S.profile?.username || 'Surfista',
      beachId,
      beachName: beach?.name || beachId,
      time:      timeVal,
      feeling,
      comment,
      waveScore: currentSlot()?.score ?? null,
      date:      today(),
      type:      'checkin',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    const upd = {
      totalCheckins: (S.profile?.totalCheckins || 0) + 1,
      streak:        (S.profile?.streak || 0) + 1,
      bestStreak:    Math.max(S.profile?.bestStreak || 0, (S.profile?.streak || 0) + 1),
      points:        (S.profile?.points || 0) + 15,
    };
    await updateProfile(upd);
    // Limpa formulário
    if (document.getElementById('comm-comment')) document.getElementById('comm-comment').value = '';
    document.querySelectorAll('#comm-feeling-grid .feel-btn').forEach(b => b.classList.toggle('active', b.dataset.cf === 'bom'));
    S.commFeeling = 'bom';
    toast(`Sessão em ${beach?.name} publicada! +15 pts`);
    renderCommunity();
  } catch(e) { toast(e.message, 'err'); }
  finally { if (btn) { btn.disabled = false; btn.textContent = 'Publicar sessão'; } }
}

async function saveProfileEdit() {
  const name = fval('edit-name').trim();
  if (!name) { toast('Digite um nome', 'err'); return; }
  await updateProfile({ username: name });
  closeModal('modal-edit');
  toast('Perfil atualizado');
  renderProfile();
}

// ═══════════════════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════════════════
function openModal(id) {
  const m = document.getElementById(id); m?.classList.remove('hidden');
  requestAnimationFrame(() => m?.classList.add('modal-open'));
}
function closeModal(id) {
  const m = document.getElementById(id); m?.classList.remove('modal-open');
  setTimeout(() => m?.classList.add('hidden'), 300);
}

// ═══════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════
function toast(msg, type = 'ok') {
  const wrap = document.getElementById('toasts'); if (!wrap) return;
  const el   = document.createElement('div');
  el.className = `toast ${type === 'err' ? 'toast-err' : type === 'warn' ? 'toast-warn' : 'toast-ok'}`;
  el.textContent = msg; wrap.appendChild(el);
  requestAnimationFrame(() => el.classList.add('toast-show'));
  setTimeout(() => { el.classList.remove('toast-show'); setTimeout(() => el.remove(), 300); }, 3200);
}


// ═══════════════════════════════════════════════════════════
// NOTIFICACOES — alerta quando pico estiver bom ou classico
// ═══════════════════════════════════════════════════════════

const NOTIF_KEY      = 'wc_notif_enabled';
const NOTIF_LAST_KEY = 'wc_notif_last'; // evita spam: 1 notif por praia por hora
const NOTIF_MIN_SCORE = 65; // >= 65 = Bom, >= 80 = Classico

// Solicita permissao ao usuario
async function requestNotifPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied')  return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

function notifEnabled() {
  return ('Notification' in window)
    && Notification.permission === 'granted'
    && localStorage.getItem(NOTIF_KEY) !== 'false';
}

function setNotifEnabled(val) {
  localStorage.setItem(NOTIF_KEY, val ? 'true' : 'false');
}

// Verifica todos os slots de hoje e dispara notificacao se houver
// janela boa ou classica nas proximas 3 horas
function checkAndNotify() {
  if (!notifEnabled()) return;
  const beach = BEACHES.find(b => b.id === S.beach);
  if (!beach) return;

  const now   = new Date();
  const nowH  = now.getHours();
  const slots = todaySlots().filter(s => s.hour >= nowH && s.hour <= nowH + 3);
  if (!slots.length) return;

  const best = slots.reduce((a, b) => a.score > b.score ? a : b);
  if (best.score < NOTIF_MIN_SCORE) return;

  // Anti-spam: nao notificar a mesma praia mais de 1x por hora
  const lastKey = NOTIF_LAST_KEY + '_' + S.beach;
  const lastTs  = parseInt(localStorage.getItem(lastKey) || '0');
  if (Date.now() - lastTs < 60 * 60 * 1000) return;

  localStorage.setItem(lastKey, Date.now().toString());

  const label = best.score >= 80 ? 'Classico' : 'Bom';
  const title = `WaveCheck — ${label} em ${beach.name}`;
  const body  = `Score ${best.score} às ${best.hour}h — ${best.simpleText || 'Boas ondas esperando.'}`;

  // Push Notification nativa
  try {
    new Notification(title, {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'wavecheck-surf-' + S.beach,
      renotify: true,
    });
  } catch(e) {
    console.warn('Notificacao nativa falhou:', e.message);
    // Fallback: toast persistente
    showSurfAlert(title, body, best.color);
  }
}

// Toast especial de alerta de surf (mais visivel que o toast comum)
function showSurfAlert(title, body, color) {
  const wrap = document.getElementById('toasts'); if (!wrap) return;
  const el   = document.createElement('div');
  el.className = 'toast toast-surf-alert';
  el.style.borderColor = color;
  el.innerHTML = `
    <div class="surf-alert-inner">
      <div class="surf-alert-bar" style="background:${color}"></div>
      <div class="surf-alert-content">
        <strong class="surf-alert-title">${title}</strong>
        <span class="surf-alert-body">${body}</span>
      </div>
      <button class="surf-alert-close" onclick="this.closest('.toast').remove()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`;
  wrap.appendChild(el);
  requestAnimationFrame(() => el.classList.add('toast-show'));
  // Nao remove automaticamente — usuario fecha manualmente
}

// Agenda verificacoes periodicas (a cada 30min enquanto o app estiver aberto)
function scheduleNotifChecks() {
  // Verificacao imediata apos carregar dados
  setTimeout(checkAndNotify, 3000);
  // Depois a cada 30 minutos
  setInterval(checkAndNotify, 30 * 60 * 1000);
}

// Toggle de notificacoes — chamado pelo botao nas settings do perfil
async function toggleNotifications() {
  if (!('Notification' in window)) {
    toast('Seu navegador nao suporta notificacoes.', 'warn'); return;
  }
  if (!notifEnabled()) {
    const granted = await requestNotifPermission();
    if (granted) {
      setNotifEnabled(true);
      toast('Notificacoes ativadas. Vamos avisar quando o surf estiver bom.');
      scheduleNotifChecks();
    } else {
      toast('Permissao negada. Ative nas configuracoes do navegador.', 'warn');
    }
  } else {
    setNotifEnabled(false);
    toast('Notificacoes desativadas.');
  }
  renderNotifBtn();
}

function renderNotifBtn() {
  const btn = document.getElementById('btn-notif-toggle'); if (!btn) return;
  const on  = notifEnabled();
  btn.textContent = on ? 'Desativar alertas' : 'Ativar alertas de surf';
  btn.className   = on ? 'btn-ghost full-w notif-on' : 'btn-primary full-w';
}


// ═══════════════════════════════════════════════════════════
// THEME & UTILS
// ═══════════════════════════════════════════════════════════
function applyTheme() {
  document.body.classList.toggle('dark',  S.dark);
  document.body.classList.toggle('light', !S.dark);
}

const root      = () => document.getElementById('root');
const setText   = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
const setVal    = (id, v) => { const e = document.getElementById(id); if (e) e.value = v; };
const fval      = id => document.getElementById(id)?.value?.trim() || '';
const show      = id => document.getElementById(id)?.classList.remove('hidden');
const hide      = id => document.getElementById(id)?.classList.add('hidden');
const today     = () => new Date().toISOString().split('T')[0];
const tomorrow  = () => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0]; };
const greet     = () => { const h = new Date().getHours(); return h<12?'Bom dia':h<18?'Boa tarde':'Boa noite'; };
const beachName = id => BEACHES.find(b => b.id === id)?.name || id;
const dateShort = d => { if (!d) return ''; const t=today(), tm=tomorrow(); if (d===t) return 'Hoje'; if (d===tm) return 'Amanhã'; return new Date(d+'T12:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}); };
const dayName   = d => { if (!d) return ''; const t=today(), tm=tomorrow(); if (d===t) return 'Hoje'; if (d===tm) return 'Amanhã'; return new Date(d+'T12:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short'}); };
const levelLabel= lv => ({ iniciante:'Iniciante', intermediario:'Intermediário', avancado:'Avançado' }[lv] || lv);
const typeLabel = t  => ({ beach_break:'Beach Break', point_break:'Point Break', reef_break:'Reef Break' }[t] || t);
const ago       = dt => {
  if (!dt) return '';
  const s = (Date.now() - dt.getTime()) / 1000;
  if (s < 60)    return 'agora';
  if (s < 3600)  return Math.floor(s/60) + 'min';
  if (s < 86400) return Math.floor(s/3600) + 'h';
  return Math.floor(s/86400) + 'd';
};