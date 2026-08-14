/**
 * UGPhone Device Generator — Gerador específico para o ecossistema UGPhone (cloud phone / gaming)
 * A UGPhone (toc-portal) utiliza:
 *  - Login/criação de conta no portal oficial (ugphone.com/toc-portal)
 *  - Sessão de cloud phone com device fingerprint e tokens de sessão
 *  - Regiões de nó (Hong Kong, Taiwan, Singapura, Japão, EUA, Alemanha)
 *  - Planos (UVIP, GVIP, KVIP, MVIP) com performance de nuvem
 * Este gerador cria perfis técnicos consistentes para fins de
 * estudo/teste de segurança e privacidade digital.
 */

export interface UgphoneDeviceProfile {
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
  ugphoneDeviceId: string;
  sessionToken: string;
  region: string;
  plan: string;
  locale: string;
  timezone: string;
  cookies: Record<string, string>;
}

const DEVICES = [
  { model: 'SM-S911B', manufacturer: 'Samsung', name: 'Galaxy S23' },
  { model: 'RMX3363', manufacturer: 'Realme', name: 'Realme GT Master' },
  { model: 'M2012K11AC', manufacturer: 'Xiaomi', name: 'POCO F3' },
  { model: 'SM-G991B', manufacturer: 'Samsung', name: 'Galaxy S21' },
];

const REGIONS = ['Hong Kong', 'Taiwan', 'Singapura', 'Japão', 'EUA', 'Alemanha'];
const PLANS = ['UVIP', 'GVIP', 'KVIP', 'MVIP'];

const randHex = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');

export function generateUgphoneDeviceProfile(): UgphoneDeviceProfile {
  const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
  const androidVer = Math.random() > 0.5 ? '12' : '13';
  const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
  const plan = PLANS[Math.floor(Math.random() * PLANS.length)];
  const ua = `Mozilla/5.0 (Linux; Android ${androidVer}; ${device.model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36`;

  return {
    id: `ug_${Date.now()}_${randHex(6)}`,
    createdAt: new Date(),
    deviceName: `${device.name} Cloud-Node #${Math.floor(Math.random() * 9999)}`,
    model: device.model,
    manufacturer: device.manufacturer,
    resolution: '1080x2400',
    userAgent: ua,
    macAddress: '02:00:00:' + randHex(2) + ':' + randHex(2) + ':' + randHex(2),
    imei: '35' + randHex(13),
    androidId: randHex(16),
    sessionId: randHex(24),
    fingerprint: `ugphone_fp_${randHex(32)}`,
    ugphoneDeviceId: 'UGD-' + randHex(16).toUpperCase(),
    sessionToken: 'tok_' + randHex(28),
    region,
    plan,
    locale: 'pt_BR',
    timezone: 'America/Sao_Paulo',
    cookies: {
      device_id: 'dev_' + randHex(24),
      session_token: 'tok_' + randHex(28),
      region: region,
      plan: plan,
      countryCode: 'BR',
      currency: 'BRL',
      locale: 'pt_BR',
      _csrf: 'CSRF-' + randHex(32),
    },
  };
}

export function generateUgphoneBookmarklet(profile: UgphoneDeviceProfile): string {
  const profileJson = JSON.stringify({
    macAddress: profile.macAddress,
    imei: profile.imei,
    androidId: profile.androidId,
    model: profile.model,
    manufacturer: profile.manufacturer,
    resolution: profile.resolution,
    fingerprint: profile.fingerprint,
    userAgent: profile.userAgent,
    ugphoneDeviceId: profile.ugphoneDeviceId,
    sessionToken: profile.sessionToken,
    region: profile.region,
    plan: profile.plan,
    locale: profile.locale,
    timezone: profile.timezone,
  }).replace(/"/g, '\\"');

  const code = `
    (function() {
      try {
        const profile = JSON.parse("${profileJson}");
        localStorage.setItem('ugphone_device_profile', JSON.stringify(profile));
        localStorage.setItem('_device_fingerprint', profile.fingerprint);
        localStorage.setItem('_device_model', profile.model);
        localStorage.setItem('_ugphone_device_id', profile.ugphoneDeviceId);
        localStorage.setItem('_ugphone_session_token', profile.sessionToken);
        console.log('%c✓ UGPhone Device Injetado com Sucesso!', 'color: #ff7f5b; font-weight: bold; font-size: 16px;');
      } catch(err) {
        console.error('Erro na injeção:', err);
      }
    })();
  `;

  return `javascript:${code.replace(/\s+/g, ' ').trim()}`;
}
