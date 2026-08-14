/**
 * SHEIN Device Generator — Gerador específico para o ecossistema SHEIN (Roadget Business PTE)
 * A SHEIN utiliza:
 *  - Anti-bot com fingerprint de device e análise de WebView/emulador
 *  - Cookies de sessão (device_id, sid, session_id, countryCode, currency)
 *  - Detecção de múltiplas contas por fingerprint de device
 *  - Verificação de phone/email no cadastro com anti-fraude de rede
 * Este gerador cria perfis técnicos consistentes para fins de
 * estudo/teste de segurança e privacidade digital.
 */

export interface SheinDeviceProfile {
  id: string;
  createdAt: Date;
  deviceName: string;
  model: string;
  manufacturer: string;
  resolution: string;
  userAgent: string;
  macAddress: string;
  imei: string;
  androidId: string;
  sessionId: string;
  fingerprint: string;
  sheinDeviceId: string;
  sid: string;
  countryCode: string;
  currency: string;
  locale: string;
  timezone: string;
  location: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  cookies: Record<string, string>;
}

const DEVICES = [
  { model: 'SM-A135M', manufacturer: 'Samsung', name: 'Galaxy A13' },
  { model: '2201117TG', manufacturer: 'Xiaomi', name: 'Redmi Note 11' },
  { model: 'RMX3511', manufacturer: 'Realme', name: 'Realme 8i' },
  { model: 'SM-A725F', manufacturer: 'Samsung', name: 'Galaxy A72' },
  { model: 'M2101K7AG', manufacturer: 'Xiaomi', name: 'Redmi Note 10S' },
];

const BRAZIL_CAPITALS = [
  { lat: -23.5505, lng: -46.6333, name: 'São Paulo' },
  { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro' },
  { lat: -19.9167, lng: -43.9345, name: 'Belo Horizonte' },
  { lat: -15.7975, lng: -47.8919, name: 'Brasília' },
  { lat: -30.0346, lng: -51.2177, name: 'Porto Alegre' },
];

const randHex = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');

export function generateSheinDeviceProfile(): SheinDeviceProfile {
  const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
  const androidVer = Math.random() > 0.5 ? '12' : '13';
  const capital = BRAZIL_CAPITALS[Math.floor(Math.random() * BRAZIL_CAPITALS.length)];
  const lat = capital.lat + (Math.random() - 0.5) * 0.002;
  const lng = capital.lng + (Math.random() - 0.5) * 0.002;
  const ua = `Mozilla/5.0 (Linux; Android ${androidVer}; ${device.model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36`;

  return {
    id: `shein_${Date.now()}_${randHex(6)}`,
    createdAt: new Date(),
    deviceName: `${device.name} #${Math.floor(Math.random() * 9999)}`,
    model: device.model,
    manufacturer: device.manufacturer,
    resolution: '1080x2400',
    userAgent: ua,
    macAddress: '02:00:00:' + randHex(2) + ':' + randHex(2) + ':' + randHex(2),
    imei: '35' + randHex(13),
    androidId: randHex(16),
    sessionId: randHex(24),
    fingerprint: `shein_fp_${randHex(32)}`,
    sheinDeviceId: 'SDID-' + randHex(16).toUpperCase(),
    sid: 'sid_' + randHex(28),
    countryCode: 'BR',
    currency: 'BRL',
    locale: 'pt_BR',
    timezone: 'America/Sao_Paulo',
    location: {
      lat,
      lng,
      accuracy: Math.floor(Math.random() * 20) + 5,
    },
    cookies: {
      device_id: 'dev_' + randHex(24),
      sid: 'sid_' + randHex(28),
      session_id: randHex(28),
      countryCode: 'BR',
      currency: 'BRL',
      locale: 'pt_BR',
      _csrf: 'CSRF-' + randHex(32),
      helios: 'HL_' + randHex(32),
    },
  };
}

export function generateSheinBookmarklet(profile: SheinDeviceProfile): string {
  const profileJson = JSON.stringify({
    macAddress: profile.macAddress,
    imei: profile.imei,
    androidId: profile.androidId,
    model: profile.model,
    manufacturer: profile.manufacturer,
    resolution: profile.resolution,
    fingerprint: profile.fingerprint,
    userAgent: profile.userAgent,
    sheinDeviceId: profile.sheinDeviceId,
    sid: profile.sid,
    countryCode: profile.countryCode,
    currency: profile.currency,
    locale: profile.locale,
    timezone: profile.timezone,
    location: profile.location,
  }).replace(/"/g, '\\"');

  const code = `
    (function() {
      try {
        const profile = JSON.parse("${profileJson}");
        localStorage.setItem('shein_device_profile', JSON.stringify(profile));
        localStorage.setItem('_device_fingerprint', profile.fingerprint);
        localStorage.setItem('_device_model', profile.model);
        localStorage.setItem('_shein_device_id', profile.sheinDeviceId);
        localStorage.setItem('_shein_sid', profile.sid);
        console.log('%c✓ SHEIN Device Injetado com Sucesso!', 'color: #e7114f; font-weight: bold; font-size: 16px;');
      } catch(err) {
        console.error('Erro na injeção:', err);
      }
    })();
  `;

  return `javascript:${code.replace(/\s+/g, ' ').trim()}`;
}
