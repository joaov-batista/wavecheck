# WaveCheck — Setup em 5 passos

## Stack
- **Frontend**: HTML + CSS + JS puro (sem framework)
- **Banco de dados**: Supabase (PostgreSQL grátis)
- **Autenticação**: Supabase Auth (email/senha)
- **Previsão do mar**: Open-Meteo Marine API (100% grátis, sem chave)
- **Deploy**: Vercel ou Netlify (grátis, sempre online)

---

## Passo 1 — Criar conta no Supabase

1. Acesse https://supabase.com e clique em **Start for free**
2. Crie um projeto novo (escolha região `South America (São Paulo)` se disponível)
3. Anote a **Project URL** e a **anon public key** (em Settings → API)

---

## Passo 2 — Criar o banco de dados

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New query**
3. Cole todo o conteúdo do arquivo `schema.sql`
4. Clique em **Run** (▶️)
5. Você verá as tabelas criadas em **Table Editor**

---

## Passo 3 — Configurar o app

Abra o arquivo `js/config.js` e substitua:

```js
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';
```

Pelos valores reais do seu projeto Supabase.

---

## Passo 4 — Testar localmente

```bash
# Opção A — Node.js
npx serve .

# Opção B — Python
python3 -m http.server 3000

# Opção C — VS Code
# Instale a extensão "Live Server" e clique em "Go Live"
```

Abra http://localhost:3000 no navegador.

---

## Passo 5 — Deploy online (grátis, sempre no ar)

### Vercel (recomendado)
```bash
npm i -g vercel
vercel --prod
```
Ou arraste a pasta para https://vercel.com/new

### Netlify
Arraste a pasta para https://app.netlify.com/drop

Ambos geram uma URL pública permanente e gratuita.

---

## Como funciona a previsão

O app usa a **Open-Meteo Marine API**:
- URL: `https://marine-api.open-meteo.com/v1/marine`
- Parâmetros: swell_wave_height, swell_wave_direction, swell_wave_period
- Complemento com vento via `https://api.open-meteo.com/v1/forecast`
- **Sem chave, sem limite**, cobertura global

O score (0–10) é calculado localmente em `js/forecast.js` considerando:
- Altura do swell (sweet spot: 1–2.5m)
- Período (quanto maior, melhor)
- Direção do swell vs. orientação da praia
- Intensidade e direção do vento (offshore = bônus)

---

## Estrutura dos arquivos

```
wavecheck-real/
├── index.html              # App completo (todas as telas)
├── schema.sql              # Cole no Supabase para criar o banco
├── manifest.json           # PWA config
├── service-worker.js       # Cache offline
├── css/
│   └── style.css           # Design system completo
├── js/
│   ├── config.js           # ← EDITE AQUI com suas chaves
│   ├── beaches.js          # Praias com coordenadas reais
│   ├── forecast.js         # Open-Meteo + score engine
│   ├── auth.js             # Supabase Auth
│   ├── db.js               # Operações no banco
│   └── app.js              # Lógica principal
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## Adicionar mais praias

Em `js/beaches.js`, adicione um objeto no array BEACHES:

```js
{
  id: 'floripa',
  name: 'Lagoinha do Leste',
  region: 'SC, Brasil',
  lat: -27.8200,   // latitude real
  lon: -48.5100,   // longitude real
  orientation: 'Sul',
  gradient: 'linear-gradient(145deg,#0a2a45,#0d4f7c)',
  bestSwellDir: ['S', 'SSE'],
  bestWindDir: ['N', 'NE'],
  description: 'Praia selvagem, acesso somente a pé.',
}
```

E insira no banco via SQL:
```sql
insert into beaches (id, name, region, latitude, longitude, ...) values (...);
```

---

## Limites do plano gratuito

| Serviço | Limite gratuito |
|---------|----------------|
| Supabase | 500MB banco, 50k linhas, 2 projetos |
| Open-Meteo | Sem limite (razoável) |
| Vercel | 100GB banda/mês, projetos ilimitados |

Mais que suficiente para uma comunidade inicial de surfistas.
