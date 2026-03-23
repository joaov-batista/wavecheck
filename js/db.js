// ============================================================
// js/db.js — Operações no banco Supabase
// ============================================================
// Usa o `supabase` client criado em auth.js
// Todas as funções retornam [] ou null se Supabase não inicializado

function getSupabase() {
  if (!supabase) throw new Error('Supabase não configurado. Veja js/config.js');
  return supabase;
}

// ── Sessões ──────────────────────────────────────────────

async function createSession({ beachId, date, time, note }) {
  const user = getUser();
  if (!user) throw new Error('Não autenticado');
  const sb = getSupabase();
  const { data, error } = await sb
    .from('sessions')
    .insert({ user_id: user.id, beach_id: beachId, session_date: date, session_time: time, note: note || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function getMyUpcomingSessions() {
  const user = getUser();
  if (!user || !supabase) return [];
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('sessions')
    .select('*, beaches(name, gradient)')
    .eq('user_id', user.id)
    .gte('session_date', today)
    .order('session_date').order('session_time');
  if (error) { console.warn('getMyUpcomingSessions:', error.message); return []; }
  return data ?? [];
}

async function markSessionCheckedIn(sessionId) {
  if (!supabase) return;
  const { error } = await supabase
    .from('sessions')
    .update({ checked_in: true })
    .eq('id', sessionId);
  if (error) throw error;
}

async function deleteSession(sessionId) {
  const sb = getSupabase();
  const { error } = await sb.from('sessions').delete().eq('id', sessionId);
  if (error) throw error;
}

// Sessões públicas de uma praia numa data (para comunidade)
async function getSessionsForBeachDate(beachId, dateStr) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('sessions')
    .select('*, profiles(username, avatar_letter)')
    .eq('beach_id', beachId)
    .eq('session_date', dateStr)
    .order('session_time');
  if (error) { console.warn('getSessionsForBeachDate:', error.message); return []; }
  return data ?? [];
}

// ── Check-ins ────────────────────────────────────────────

async function createCheckin({ sessionId, beachId, feeling, comment, waveScore }) {
  const user = getUser();
  if (!user) throw new Error('Não autenticado');
  const sb = getSupabase();
  const { data, error } = await sb
    .from('checkins')
    .insert({
      user_id:    user.id,
      session_id: sessionId || null,
      beach_id:   beachId,
      feeling,
      comment:    comment || null,
      wave_score: waveScore ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function getMyCheckins(limit = 10) {
  const user = getUser();
  if (!user || !supabase) return [];
  const { data, error } = await supabase
    .from('checkins')
    .select('*, beaches(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) { console.warn('getMyCheckins:', error.message); return []; }
  return data ?? [];
}

// ── Community feed ───────────────────────────────────────

async function getCommunityFeed(beachId = null, limit = 20) {
  if (!supabase) return [];
  let q = supabase
    .from('community_feed')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (beachId) q = q.eq('beach_id', beachId);
  const { data, error } = await q;
  if (error) { console.warn('getCommunityFeed:', error.message); return []; }
  return data ?? [];
}

// ── Sentimento ───────────────────────────────────────────

async function getSentiment(beachId) {
  if (!supabase) return { ruim: 0, ok: 0, bom: 0, classico: 0 };
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('checkins')
    .select('feeling')
    .eq('beach_id', beachId)
    .gte('checkin_date', today);
  if (error || !data) return { ruim: 0, ok: 0, bom: 0, classico: 0 };
  const counts = { ruim: 0, ok: 0, bom: 0, classico: 0 };
  data.forEach(c => { if (c.feeling in counts) counts[c.feeling]++; });
  return counts;
}

// ── Pontos e títulos ─────────────────────────────────────

const TITLES = [
  { name: 'Haole',         minPoints: 0,    color: '#9e9e9e' },
  { name: 'Local',         minPoints: 100,  color: '#29b6f6' },
  { name: 'Surfista Raiz', minPoints: 500,  color: '#66bb6a' },
  { name: 'Pro',           minPoints: 1000, color: '#ffb74d' },
  { name: 'Big Z',         minPoints: 2500, color: '#ef5350' },
];

function getTitleByPoints(pts) {
  return [...TITLES].reverse().find(t => pts >= t.minPoints) || TITLES[0];
}

function getNextTitle(pts) {
  return TITLES.find(t => pts < t.minPoints) || null;
}

async function awardPoints(extra = {}) {
  const profile = getProfile();
  if (!profile) return 0;

  let pts = extra.base ?? 15;
  const h = new Date().getHours();

  // Bônus madrugador
  if (h < 7) {
    pts += 5;
    if (!profile.early_bird) await updateProfile({ early_bird: true }).catch(() => {});
  }

  // Bônus sessão clássica
  if ((extra.score ?? 0) >= 8) {
    pts += 10;
    if (!profile.classic_day) await updateProfile({ classic_day: true }).catch(() => {});
  }

  const newStreak  = (profile.streak ?? 0) + 1;
  const bestStreak = Math.max(profile.best_streak ?? 0, newStreak);

  await updateProfile({
    points:         (profile.points ?? 0) + pts,
    streak:         newStreak,
    best_streak:    bestStreak,
    total_checkins: (profile.total_checkins ?? 0) + 1,
  });

  return pts;
}

async function awardSessionPoints() {
  const profile = getProfile();
  if (!profile) return;
  await updateProfile({
    points:         (profile.points ?? 0) + 5,
    total_sessions: (profile.total_sessions ?? 0) + 1,
  }).catch(console.warn);
}