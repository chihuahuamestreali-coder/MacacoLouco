/**
 * Base-44 Device Generator - Identidade para Base-44 (app.base44.com)
 * Campos específicos: B44_DEVICE_ID, B44_SESSION, B44_REFERRER, B44_FINGERPRINT_ID
 */
import { generateUniversalDevice, UniversalDeviceProfile } from './universalDeviceGenerator';

export interface Base44DeviceProfile extends UniversalDeviceProfile {
  b44DeviceId: string;
  b44SessionId: string;
  b44Referrer: string;
  b44FingerprintId: string;
  b44RegistrationId: string;
}

export function generateBase44Device(): Base44DeviceProfile {
  const base = generateUniversalDevice('base44');
  const rand = (n: number) => Math.random().toString(36).substring(2, 2 + n);
  return {
    ...base,
    b44DeviceId: 'b44_dev_' + rand(16),
    b44SessionId: 'sess_' + rand(20),
    b44Referrer: 'google_cpc',
    b44FingerprintId: 'fp_' + rand(18),
    b44RegistrationId: 'reg_' + rand(14),
    cookies: {
      ...base.cookies,
      B44_DEVICE_ID: 'b44_dev_' + rand(16),
      B44_SESSION: 'sess_' + rand(20),
      B44_REFERRER: 'google_cpc',
      B44_FINGERPRINT_ID: 'fp_' + rand(18),
      B44_LANG: 'pt',
    },
  };
}

export function buildBase44ScriptBody(device: Base44DeviceProfile, persona: any): string {
  const profile = JSON.stringify({
    b44DeviceId: device.b44DeviceId,
    b44SessionId: device.b44SessionId,
    b44Referrer: device.b44Referrer,
    b44FingerprintId: device.b44FingerprintId,
    b44RegistrationId: device.b44RegistrationId,
    macAddress: device.macAddress,
    imei: device.imei,
    androidId: device.androidId,
    fingerprint: device.fingerprint,
    userAgent: device.userAgent,
    persona: persona ? { name: persona.fullName, email: persona.email, phone: persona.phone } : null,
  }).replace(/"/g, '\\"');

  return `
    // BASE-44 - identidade e sessão (domínio real)
    const b44Profile = JSON.parse("${profile}");
    localStorage.setItem('b44_device_profile', JSON.stringify(b44Profile));
    localStorage.setItem('b44_device_id', b44Profile.b44DeviceId);
    localStorage.setItem('b44_session_id', b44Profile.b44SessionId);
    localStorage.setItem('b44_fingerprint_id', b44Profile.b44FingerprintId);
    localStorage.setItem('b44_registration_id', b44Profile.b44RegistrationId);
    localStorage.setItem('_device_fingerprint', b44Profile.fingerprint);
    if (b44Profile.persona) localStorage.setItem('b44_persona', JSON.stringify(b44Profile.persona));

    // Cookies de sessão no domínio da Base-44
    const setCookie = (k, v) => { document.cookie = k + '=' + v + '; path=/; max-age=31536000; SameSite=Lax'; };
    setCookie('B44_DEVICE_ID', b44Profile.b44DeviceId);
    setCookie('B44_SESSION', b44Profile.b44SessionId);
    setCookie('B44_REFERRER', b44Profile.b44Referrer);
    setCookie('B44_FINGERPRINT_ID', b44Profile.b44FingerprintId);
    setCookie('B44_LANG', 'pt');
  `;
}
