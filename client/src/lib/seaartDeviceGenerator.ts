/**
 * SeaArt AI Device Generator - Identidade para SeaArt (www.seaart.ai)
 * Campos específicos: SA_DEVICE_ID, SA_SESSION, SA_ANON_ID, SA_UID, SA_CHANNEL
 * Plataforma: geração de imagens com IA (login de criação, PT-BR)
 */
import { generateUniversalDevice, UniversalDeviceProfile } from './universalDeviceGenerator';

export interface SeaArtDeviceProfile extends UniversalDeviceProfile {
  saDeviceId: string;
  saSessionId: string;
  saAnonId: string;
  saUid: string;
  saChannel: string;
  saLocale: string;
}

export const SEAART_CHANNEL = 'google';

export function generateSeaArtDevice(): SeaArtDeviceProfile {
  const base = generateUniversalDevice('seaart');
  const rand = (n: number) => Math.random().toString(36).substring(2, 2 + n);
  return {
    ...base,
    saDeviceId: 'sa_dev_' + rand(16),
    saSessionId: 'sess_' + rand(20),
    saAnonId: 'anon_' + rand(18),
    saUid: 'uid_' + rand(14),
    saChannel: SEAART_CHANNEL,
    saLocale: 'pt-BR',
    cookies: {
      ...base.cookies,
      SA_DEVICE_ID: 'sa_dev_' + rand(16),
      SA_SESSION: 'sess_' + rand(20),
      SA_ANON_ID: 'anon_' + rand(18),
      SA_UID: 'uid_' + rand(14),
      SA_CHANNEL: SEAART_CHANNEL,
      SA_LOCALE: 'pt-BR',
    },
  };
}

export function buildSeaArtScriptBody(device: SeaArtDeviceProfile, persona: any): string {
  const profile = JSON.stringify({
    saDeviceId: device.saDeviceId,
    saSessionId: device.saSessionId,
    saAnonId: device.saAnonId,
    saUid: device.saUid,
    saChannel: device.saChannel,
    saLocale: device.saLocale,
    macAddress: device.macAddress,
    imei: device.imei,
    androidId: device.androidId,
    fingerprint: device.fingerprint,
    userAgent: device.userAgent,
    persona: persona ? { name: persona.fullName, email: persona.email, phone: persona.phone } : null,
  }).replace(/"/g, '\\"');

  return `
    // SEAART - identidade e sessão (domínio real)
    const saProfile = JSON.parse("${profile}");
    localStorage.setItem('sa_device_profile', JSON.stringify(saProfile));
    localStorage.setItem('sa_device_id', saProfile.saDeviceId);
    localStorage.setItem('sa_session_id', saProfile.saSessionId);
    localStorage.setItem('sa_anon_id', saProfile.saAnonId);
    localStorage.setItem('sa_uid', saProfile.saUid);
    localStorage.setItem('_device_fingerprint', saProfile.fingerprint);
    if (saProfile.persona) localStorage.setItem('sa_persona', JSON.stringify(saProfile.persona));

    // Cookies de sessão no domínio da SeaArt
    const setCookie = (k, v) => { document.cookie = k + '=' + v + '; path=/; max-age=31536000; SameSite=Lax'; };
    setCookie('SA_DEVICE_ID', saProfile.saDeviceId);
    setCookie('SA_SESSION', saProfile.saSessionId);
    setCookie('SA_ANON_ID', saProfile.saAnonId);
    setCookie('SA_UID', saProfile.saUid);
    setCookie('SA_CHANNEL', saProfile.saChannel);
    setCookie('SA_LOCALE', saProfile.saLocale);
  `;
}
