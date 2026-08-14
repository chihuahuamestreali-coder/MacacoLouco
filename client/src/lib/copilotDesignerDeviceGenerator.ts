/**
 * Copilot Designer Device Generator - Identidade para Microsoft Designer (designer.microsoft.com)
 * Campos específicos: CDP_DEVICE_ID, CDP_SESSION, CDP_ANON_ID, CDP_UID, CDP_MARKET
 * Plataforma: criação de imagens com IA (login de criação, PT-BR)
 */
import { generateUniversalDevice, UniversalDeviceProfile } from './universalDeviceGenerator';

export interface CopilotDesignerDeviceProfile extends UniversalDeviceProfile {
  cdpDeviceId: string;
  cdpSessionId: string;
  cdpAnonId: string;
  cdpUid: string;
  cdpMarket: string;
  cdpLocale: string;
}

export const COPILOT_MARKET = 'pt-BR';

export function generateCopilotDesignerDevice(): CopilotDesignerDeviceProfile {
  const base = generateUniversalDevice('copilotdesigner');
  const rand = (n: number) => Math.random().toString(36).substring(2, 2 + n);
  return {
    ...base,
    cdpDeviceId: 'cdp_dev_' + rand(16),
    cdpSessionId: 'sess_' + rand(20),
    cdpAnonId: 'anon_' + rand(18),
    cdpUid: 'uid_' + rand(14),
    cdpMarket: COPILOT_MARKET,
    cdpLocale: COPILOT_MARKET,
    cookies: {
      ...base.cookies,
      CDP_DEVICE_ID: 'cdp_dev_' + rand(16),
      CDP_SESSION: 'sess_' + rand(20),
      CDP_ANON_ID: 'anon_' + rand(18),
      CDP_UID: 'uid_' + rand(14),
      CDP_MARKET: COPILOT_MARKET,
      CDP_LOCALE: COPILOT_MARKET,
    },
  };
}

export function buildCopilotDesignerScriptBody(device: CopilotDesignerDeviceProfile, persona: any): string {
  const profile = JSON.stringify({
    cdpDeviceId: device.cdpDeviceId,
    cdpSessionId: device.cdpSessionId,
    cdpAnonId: device.cdpAnonId,
    cdpUid: device.cdpUid,
    cdpMarket: device.cdpMarket,
    cdpLocale: device.cdpLocale,
    macAddress: device.macAddress,
    imei: device.imei,
    androidId: device.androidId,
    fingerprint: device.fingerprint,
    userAgent: device.userAgent,
    persona: persona ? { name: persona.fullName, email: persona.email, phone: persona.phone } : null,
  }).replace(/"/g, '\\"');

  return `
    // COPILOT DESIGNER - identidade e sessão (domínio real)
    const cdpProfile = JSON.parse("${profile}");
    localStorage.setItem('cdp_device_profile', JSON.stringify(cdpProfile));
    localStorage.setItem('cdp_device_id', cdpProfile.cdpDeviceId);
    localStorage.setItem('cdp_session_id', cdpProfile.cdpSessionId);
    localStorage.setItem('cdp_anon_id', cdpProfile.cdpAnonId);
    localStorage.setItem('cdp_uid', cdpProfile.cdpUid);
    localStorage.setItem('_device_fingerprint', cdpProfile.fingerprint);
    if (cdpProfile.persona) localStorage.setItem('cdp_persona', JSON.stringify(cdpProfile.persona));

    // Cookies de sessão no domínio do Microsoft Designer
    const setCookie = (k, v) => { document.cookie = k + '=' + v + '; path=/; max-age=31536000; SameSite=Lax'; };
    setCookie('CDP_DEVICE_ID', cdpProfile.cdpDeviceId);
    setCookie('CDP_SESSION', cdpProfile.cdpSessionId);
    setCookie('CDP_ANON_ID', cdpProfile.cdpAnonId);
    setCookie('CDP_UID', cdpProfile.cdpUid);
    setCookie('CDP_MARKET', cdpProfile.cdpMarket);
    setCookie('CDP_LOCALE', cdpProfile.cdpLocale);
  `;
}
