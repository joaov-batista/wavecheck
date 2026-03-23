// ============================================================
// js/auth.js — Autenticação via Supabase Auth
// ============================================================

// Guarda o cliente para reusar em db.js também
let supabase;

try {
  if (!window.__CONFIG_INVALID__) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
} catch (e) {
  console.error('Falha ao inicializar Supabase:', e.message);
}

let _currentUser    = null;
let _currentProfile = null;

// ── Inicialização ────────────────────────────────────────
async function initAuth() {
  if (window.__CONFIG_INVALID__ || !supabase) return false;

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (session?.user) {
      _currentUser = session.user;
      await loadProfile();
    }
  } catch (e) {
    console.error('initAuth erro:', e.message);
    showConfigError(e.message);
    return false;
  }

  // Reage a login/logout em tempo real
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      _currentUser = session.user;
      await loadProfile();
      hideAuthScreen();
      renderCurrentPage();
    } else if (event === 'SIGNED_OUT') {
      _currentUser    = null;
      _currentProfile = null;
      showAuthScreen();
    }
  });

  return !!_currentUser;
}

// ── Registro ─────────────────────────────────────────────
async function signUp(email, password, username) {
  guardSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (error) throw error;
  return data;
}

// ── Login ─────────────────────────────────────────────────
async function signIn(email, password) {
  guardSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw translateAuthError(error);
  return data;
}

// ── Logout ───────────────────────────────────────────────
async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

// ── Perfil ───────────────────────────────────────────────
async function loadProfile() {
  if (!_currentUser || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', _currentUser.id)
      .single();
    if (error) throw error;
    _currentProfile = data;
    return data;
  } catch (e) {
    console.warn('loadProfile:', e.message);
    return null;
  }
}

async function updateProfile(fields) {
  if (!_currentUser || !supabase) return;
  const { data, error } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', _currentUser.id)
    .select()
    .single();
  if (error) throw error;
  _currentProfile = data;
  return data;
}

function getProfile()  { return _currentProfile; }
function getUser()     { return _currentUser; }
function isLoggedIn()  { return !!_currentUser; }

// ── Helpers internos ─────────────────────────────────────
function guardSupabase() {
  if (!supabase) throw new Error('Supabase não inicializado. Verifique js/config.js');
}

function translateAuthError(error) {
  const map = {
    'Invalid login credentials':       'E-mail ou senha incorretos.',
    'Email not confirmed':             'Confirme seu e-mail antes de entrar.',
    'User already registered':         'Esse e-mail já está cadastrado.',
    'Password should be at least 6':   'Senha deve ter pelo menos 6 caracteres.',
    'Failed to fetch':                 'Sem conexão com o Supabase. Verifique a URL no config.js e se está rodando com servidor HTTP (não file://).',
    'NetworkError':                    'Erro de rede. Rode com npx serve . ou python3 -m http.server 3000.',
  };
  const msg = error.message || '';
  const friendly = Object.entries(map).find(([k]) => msg.includes(k));
  error.message = friendly ? friendly[1] : msg;
  return error;
}

function showConfigError(msg) {
  const el = document.getElementById('auth-screen');
  if (!el) return;
  el.classList.remove('hidden');

  const card = el.querySelector('.auth-card');
  if (!card) return;

  card.innerHTML = `
    <div style="text-align:center;padding:8px 0">
      <div style="font-size:2rem;margin-bottom:12px">🔌</div>
      <h3 style="font-size:1rem;font-weight:700;color:#ff6b6b;margin-bottom:10px">
        Erro de conexão com Supabase
      </h3>
      <p style="font-size:.82rem;color:var(--txt2);line-height:1.65;margin-bottom:14px">
        ${msg}
      </p>
      <div style="background:var(--input-bg);border-radius:10px;padding:14px;font-size:.78rem;
        text-align:left;line-height:1.9;border:1px solid var(--border2)">
        <strong>Checklist:</strong><br>
        ☐ Editou <code>js/config.js</code> com a URL real?<br>
        ☐ Editou <code>js/config.js</code> com a anon key real?<br>
        ☐ Rodando com servidor HTTP (não <code>file://</code>)?<br>
        ☐ Rodou o <code>schema.sql</code> no Supabase?
      </div>
    </div>
  `;
}