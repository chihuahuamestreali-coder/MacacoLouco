/**
 * GeeLark Device Generator - Identidade para GeeLark (app.geelark.com)
 * Campos específicos: GLE_DEVICE_ID, GLE_SESSION, GLE_INVITE_CODE, GLE_ANDROID_ID
 * Plataforma: cloud phone anti-detectável (cadastro/login em PT-BR)
 */
import { generateUniversalDevice, UniversalDeviceProfile } from './universalDeviceGenerator';

export interface GeeLarkDeviceProfile extends UniversalDeviceProfile {
  gleDeviceId: string;
  gleSessionId: string;
  gleAnonId: string;
  gleInviteCode: string;
  gleCloudId: string;
}

export const GEELARK_INVITE_CODE = 'UEJ3oz';

export function generateGeeLarkDevice(): GeeLarkDeviceProfile {
  const base = generateUniversalDevice('geelark');
  const rand = (n: number) => Math.random().toString(36).substring(2, 2 + n);
  return {
    ...base,
    gleDeviceId: 'gle_dev_' + rand(16),
    gleSessionId: 'sess_' + rand(20),
    gleAnonId: 'anon_' + rand(18),
    gleInviteCode: GEELARK_INVITE_CODE,
    gleCloudId: 'cloud_' + rand(14),
    cookies: {
      ...base.cookies,
      GLE_DEVICE_ID: 'gle_dev_' + rand(16),
      GLE_SESSION: 'sess_' + rand(20),
      GLE_ANON_ID: 'anon_' + rand(18),
      GLE_INVITE_CODE: GEELARK_INVITE_CODE,
      GLE_LOCALE: 'pt-BR',
    },
  };
}

export function buildGeeLarkScriptBody(device: GeeLarkDeviceProfile, persona: any): string {
  const profile = JSON.stringify({
    gleDeviceId: device.gleDeviceId,
    gleSessionId: device.gleSessionId,
    gleAnonId: device.gleAnonId,
    gleInviteCode: device.gleInviteCode,
    gleCloudId: device.gleCloudId,
    macAddress: device.macAddress,
    imei: device.imei,
    androidId: device.androidId,
    fingerprint: device.fingerprint,
    userAgent: device.userAgent,
    persona: persona ? { name: persona.fullName, email: persona.email, phone: persona.phone } : null,
  }).replace(/"/g, '\\"');

  return `
    // GEELARK - identidade e sessão (domínio real)
    const gleProfile = JSON.parse("${profile}");
    localStorage.setItem('gle_device_profile', JSON.stringify(gleProfile));
    localStorage.setItem('gle_device_id', gleProfile.gleDeviceId);
    localStorage.setItem('gle_session_id', gleProfile.gleSessionId);
    localStorage.setItem('gle_anon_id', gleProfile.gleAnonId);
    localStorage.setItem('gle_invite_code', gleProfile.gleInviteCode);
    localStorage.setItem('_device_fingerprint', gleProfile.fingerprint);
    if (gleProfile.persona) localStorage.setItem('gle_persona', JSON.stringify(gleProfile.persona));

    // Cookies de sessão no domínio da GeeLark
    const setCookie = (k, v) => { document.cookie = k + '=' + v + '; path=/; max-age=31536000; SameSite=Lax'; };
    setCookie('GLE_DEVICE_ID', gleProfile.gleDeviceId);
    setCookie('GLE_SESSION', gleProfile.gleSessionId);
    setCookie('GLE_ANON_ID', gleProfile.gleAnonId);
    setCookie('GLE_INVITE_CODE', gleProfile.gleInviteCode);
    setCookie('GLE_LOCALE', 'pt-BR');
  `;
}
