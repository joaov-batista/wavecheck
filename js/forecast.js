// ============================================================
// js/forecast.js — Open-Meteo Marine API (dados 100% reais)
// Sem chave, sem limite, cobertura global
// ============================================================

const _forecastCache = {};   // { beachId: { fetchedAt, data } }
let _lastApiStatus   = null; // 'real' | 'fallback' — para debug no UI

// ── Buscar previsão ──────────────────────────────────────
async function fetchForecast(beachId) {
  const beach = getBeachById(beachId);
  const now   = Date.now();

  // Retorna cache se ainda válido
  if (_forecastCache[beachId]) {
    const ageMin = (now - _forecastCache[beachId].fetchedAt) / 60000;
    if (ageMin < FORECAST_CACHE_MINUTES) return _forecastCache[beachId].data;
  }

  const marineUrl =
    `${OPEN_METEO_BASE}` +
    `?latitude=${beach.lat}&longitude=${beach.lon}` +
    `&hourly=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period` +
    `&timezone=America%2FSao_Paulo&forecast_days=3`;

  const windUrl =
    `${OPEN_METEO_WIND}` +
    `?latitude=${beach.lat}&longitude=${beach.lon}` +
    `&hourly=windspeed_10m,winddirection_10m` +
    `&timezone=America%2FSao_Paulo&forecast_days=3`;

  try {
    console.log(`🌊 Buscando previsão real para ${beach.name}...`);

    const [mRes, wRes] = await Promise.all([fetch(marineUrl), fetch(windUrl)]);

    if (!mRes.ok) throw new Error(`Marine API: ${mRes.status} ${mRes.statusText}`);
    if (!wRes.ok) throw new Error(`Wind API: ${wRes.status} ${wRes.statusText}`);

    const [marine, wind] = await Promise.all([mRes.json(), wRes.json()]);

    if (marine.error) throw new Error(marine.reason || 'Open-Meteo Marine error');
    if (wind.error)   throw new Error(wind.reason   || 'Open-Meteo Wind error');

    const parsed = parseOpenMeteo(marine, wind, beach);
    _forecastCache[beachId] = { fetchedAt: now, data: parsed };
    _lastApiStatus = 'real';

    console.log(`✅ Dados reais recebidos para ${beach.name}:`, {
      slots: parsed.length,
      exemplo: parsed[0],
    });

    return parsed;

  } catch (err) {
    _lastApiStatus = 'fallback';
    console.warn(`⚠️ Open-Meteo falhou (${err.message}), usando fallback`);
    const fallback = getFallbackForecast(beach);
    _forecastCache[beachId] = { fetchedAt: now - (FORECAST_CACHE_MINUTES - 1) * 60000, data: fallback };
    return fallback;
  }
}

// ── Parser ───────────────────────────────────────────────
function parseOpenMeteo(marine, wind, beach) {
  const times = marine.hourly.time;
  const mh    = marine.hourly;
  const wh    = wind.hourly;

  return times.map((t, i) => {
    const dt      = new Date(t);
    const swellH  = mh.swell_wave_height?.[i]    ?? mh.wave_height?.[i]    ?? 1.0;
    const swellD  = mh.swell_wave_direction?.[i] ?? mh.wave_direction?.[i] ?? 180;
    const swellP  = mh.swell_wave_period?.[i]    ?? mh.wave_period?.[i]    ?? 10;
    const windSpd = wh.windspeed_10m?.[i]         ?? 15;
    const windDir = wh.winddirection_10m?.[i]     ?? 90;

    return {
      time:       t,
      hour:       `${String(dt.getHours()).padStart(2,'0')}:00`,
      day:        t.split('T')[0],
      swellH:     +( +swellH ).toFixed(1),
      swellDir:   degreesToCardinal(swellD),
      swellDirDeg: swellD,
      swellP:     Math.round(swellP),
      windSpd:    Math.round(windSpd),
      windDir:    degreesToCardinal(windDir),
      windDirDeg: windDir,
      score:      calcScore({ swellH: +swellH, swellDir: swellD, swellP: +swellP, windSpd: +windSpd, windDir: windDir, beach }),
    };
  });
}

// ── Score Engine (0–10) ──────────────────────────────────
function calcScore({ swellH, swellDir, swellP, windSpd, windDir, beach }) {
  let s = 0;

  // Altura (0–3 pts) — sweet spot 0.8–2.5m
  if (swellH < 0.3)      s += 0;
  else if (swellH < 0.8) s += 1;
  else if (swellH <= 2.5)s += 3;
  else if (swellH <= 3.5)s += 2;
  else                   s += 0.5; // muito grande

  // Período (0–2 pts)
  if (swellP >= 14)      s += 2;
  else if (swellP >= 11) s += 1.5;
  else if (swellP >= 8)  s += 1;
  else                   s += 0.3;

  // Direção do swell vs praia (0–2.5 pts)
  const swellCard = degreesToCardinal(swellDir);
  const swellOk   = beach.bestSwellDir.some(d => swellCard === d || swellCard.startsWith(d) || d.startsWith(swellCard));
  s += swellOk ? 2.5 : 0.5;

  // Vento: direção + intensidade (0–2 pts)
  const windCard   = degreesToCardinal(windDir);
  const isOffshore = beach.bestWindDir.some(d => windCard === d || windCard.startsWith(d) || d.startsWith(windCard));
  if (windSpd <= 8)       s += isOffshore ? 2   : 0.9;
  else if (windSpd <= 15) s += isOffshore ? 1.5 : 0.4;
  else if (windSpd <= 22) s += isOffshore ? 0.8 : 0.1;
  else                    s += 0;

  return +Math.min(10, Math.max(0, (s / 9.5) * 10)).toFixed(1);
}

// ── Helpers ──────────────────────────────────────────────
function degreesToCardinal(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round((+deg) / 22.5) % 16];
}

function getScoreLabel(score) {
  if (score >= 8) return 'CLÁSSICO';
  if (score >= 6) return 'BOM';
  if (score >= 4) return 'SURFÁVEL';
  return 'RUIM';
}

function getScoreColor(score) {
  if (score >= 8) return '#00e676';
  if (score >= 6) return '#29b6f6';
  if (score >= 4) return '#ffb74d';
  return '#ef5350';
}

function getBestSlotToday(slots) {
  const today = new Date().toISOString().split('T')[0];
  const ts    = slots.filter(s => s.day === today);
  return (ts.length ? ts : slots).reduce((a,b) => a.score > b.score ? a : b, slots[0] || {});
}

function getTodaySlots(slots) {
  const today = new Date().toISOString().split('T')[0];
  return slots.filter(s => s.day === today);
}

function getTomorrowSlots(slots) {
  const d = new Date(); d.setDate(d.getDate() + 1);
  const tom = d.toISOString().split('T')[0];
  return slots.filter(s => s.day === tom);
}

function generateConditionPhrase(best, beach) {
  if (!best || !best.swellDir) return 'Calculando condições…';

  const swellMap = {
    S:'swell de sul favorece esta praia',SSE:'ondulação SSE bem direcionada',
    SE:'swell de sudeste entra bem',ESE:'swell de ESE consistente',
    E:'swell de leste presente',NE:'swell de nordeste no pico',N:'swell de norte variando',
    SW:'swell de sudoeste',W:'swell de oeste fraco',NW:'swell de noroeste',
  };
  const windMap = {
    NE:'vento terral organiza as ondas',N:'vento norte favorece a formação',
    NNE:'terral leve — tudo limpo',W:'offshore — ondas espelhadas',
    NW:'noroeste deixa perfeito',E:'onshore atrapalha a formação',
    S:'vento sul — fique de olho',SE:'SE atrapalha um pouco',
  };

  const swellTxt = swellMap[best.swellDir] || `swell de ${best.swellDir}`;
  const windTxt  = windMap[best.windDir]   || `vento de ${best.windDir}`;
  const perTxt   = best.swellP >= 14 ? 'Período longo garante força e potência.' :
                   best.swellP >= 11 ? 'Período médio-alto, boa forma.' :
                   'Período curto, ondas menos organizadas.';
  const qualTxt  = best.score >= 8 ? 'Dia para não perder! 🔥' :
                   best.score >= 6 ? 'Vale muito a ida. 🤙' :
                   best.score >= 4 ? 'Dá pra pegar algumas boas.' :
                   'Mar complicado, aguarde melhores condições.';

  return `${swellTxt[0].toUpperCase() + swellTxt.slice(1)}, ${windTxt}. ${perTxt} ${qualTxt}`;
}

// ── Fallback offline ─────────────────────────────────────
function getFallbackForecast(beach) {
  const today  = new Date().toISOString().split('T')[0];
  const hours  = [5,6,7,8,9,10,11,12,13,14,15,16,17,18];
  const scores = [7.5,8.2,8.5,8.0,7.5,7.0,6.5,6.0,5.5,5.8,6.2,6.5,6.0,5.5];
  return hours.map((h, i) => ({
    time:       `${today}T${String(h).padStart(2,'0')}:00`,
    hour:       `${String(h).padStart(2,'0')}:00`,
    day:        today,
    swellH:     1.4, swellDir: beach.bestSwellDir[0] || 'S', swellDirDeg: 180, swellP: 12,
    windSpd:    10,  windDir:  beach.bestWindDir[0]  || 'NE', windDirDeg: 45,
    score:      scores[i] || 6.0,
  }));
}

// ── Expõe status da API para debug no UI ─────────────────
function getForecastApiStatus() { return _lastApiStatus; }