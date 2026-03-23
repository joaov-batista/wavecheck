/**
 * WaveCheck — Configuração
 *
 * As chaves do Firebase já estão incorporadas no app.js (firebaseConfig).
 * Este arquivo é para configurações opcionais e URLs de API.
 *
 * STORMGLASS (opcional):
 *   Se você tiver uma chave da API Stormglass (stormglass.io),
 *   defina abaixo para ativar fusão de dados e indicador de confiança.
 *   Sem ela, o app funciona 100% via Open-Meteo (gratuito, sem chave).
 *
 *   ATENÇÃO: esta chave fica exposta no JS do cliente.
 *   Use apenas a anon/public key do Stormglass.
 *   Nunca coloque aqui chaves de admin ou secrets de backend.
 */

// window.STORMGLASS_KEY = 'sua_chave_stormglass_aqui';

/**
 * Open-Meteo — sem chave necessária
 */
window.OPEN_METEO_BASE  = 'https://marine-api.open-meteo.com/v1/marine';
window.OPEN_METEO_WIND  = 'https://api.open-meteo.com/v1/forecast';

/**
 * Cache de previsão: tempo em minutos antes de revalidar da API
 * Padrão: 60 minutos (dados marinhos não mudam a cada minuto)
 */
window.FORECAST_CACHE_MINUTES = 60;