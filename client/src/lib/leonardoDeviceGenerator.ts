/**
 * Leonardo.ai Device Generator - Identidade para Leonardo.ai (app.leonardo.ai)
 * Campos específicos: LEO_DEVICE_ID, LEO_SESSION, LEO_ANON_ID, LEO_UID, LEO_PLAN
 * Plataforma: geração de imagens com IA (login de criação, PT-BR)
 */
import { generateUniversalDevice, UniversalDeviceProfile } from './universalDeviceGenerator';

export interface LeonardoDeviceProfile extends UniversalDeviceProfile {
  leoDeviceId: string;
  leoSessionId: string;
  leoAnonId: string;
  leoUid: string;
  leoPlan: string;
  leoLocale: string;
}

const LEONARDO_PLANS = ['APP_FREE', 'APP_PAYG', 'APP_PRO'];

export function generateLeonardoDevice(): LeonardoDeviceProfile {
  const base = generateUniversalDevice('leonardo');
  const rand = (n: number) => Math.random().toString(36).substring(2, 2 + n);
  const plan = LEONARDO_PLANS[Math.floor(Math.random() * LEONARDO_PLANS.length)];
  return {
    ...base,
    leoDeviceId: 'leo_dev_' + rand(16),
    leoSessionId: 'sess_' + rand(20),
    leoAnonId: 'anon_' + rand(18),
    leoUid: 'uid_' + rand(14),
    leoPlan: plan,
    leoLocale: 'pt-BR',
    cookies: {
      ...base.cookies,
      LEO_DEVICE_ID: 'leo_dev_' + rand(16),
      LEO_SESSION: 'sess_' + rand(20),
      LEO_ANON_ID: 'anon_' + rand(18),
      LEO_UID: 'uid_' + rand(14),
      LEO_PLAN: plan,
      LEO_LOCALE: 'pt-BR',
    },
  };
}

export function buildLeonardoScriptBody(device: LeonardoDeviceProfile, persona: any): string {
  const profile = JSON.stringify({
    leoDeviceId: device.leoDeviceId,
    leoSessionId: device.leoSessionId,
    leoAnonId: device.leoAnonId,
    leoUid: device.leoUid,
    leoPlan: device.leoPlan,
    leoLocale: device.leoLocale,
    macAddress: device.macAddress,
    imei: device.imei,
    androidId: device.androidId,
    fingerprint: device.fingerprint,
    userAgent: device.userAgent,
    persona: persona ? { name: persona.fullName, email: persona.email, phone: persona.phone } : null,
  }).replace(/"/g, '\\"');

  return `
    // LEONARDO.AI - identidade e sessão (domínio real)
    const leoProfile = JSON.parse("${profile}");
    localStorage.setItem('leo_device_profile', JSON.stringify(leoProfile));
    localStorage.setItem('leo_device_id', leoProfile.leoDeviceId);
    localStorage.setItem('leo_session_id', leoProfile.leoSessionId);
    localStorage.setItem('leo_anon_id', leoProfile.leoAnonId);
    localStorage.setItem('leo_uid', leoProfile.leoUid);
    localStorage.setItem('_device_fingerprint', leoProfile.fingerprint);
    if (leoProfile.persona) localStorage.setItem('leo_persona', JSON.stringify(leoProfile.persona));

    // Cookies de sessão no domínio da Leonardo.ai
    const setCookie = (k, v) => { document.cookie = k + '=' + v + '; path=/; max-age=31536000; SameSite=Lax'; };
    setCookie('LEO_DEVICE_ID', leoProfile.leoDeviceId);
    setCookie('LEO_SESSION', leoProfile.leoSessionId);
    setCookie('LEO_ANON_ID', leoProfile.leoAnonId);
    setCookie('LEO_UID', leoProfile.leoUid);
    setCookie('LEO_PLAN', leoProfile.leoPlan);
    setCookie('LEO_LOCALE', leoProfile.leoLocale);
  `;
}
