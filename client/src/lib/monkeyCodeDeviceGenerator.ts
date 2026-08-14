/**
 * MonkeyCode Device Generator - Identidade para MonkeyCode (AI coding platform)
 * Campos específicos: MC_DEVICE_ID, MC_SESSION, MC_VISITOR_ID, MC_ANTI_BOT_TOKEN
 */
import { generateUniversalDevice, UniversalDeviceProfile } from './universalDeviceGenerator';

export interface MonkeyCodeDeviceProfile extends UniversalDeviceProfile {
  mcDeviceId: string;
  mcSessionId: string;
  mcVisitorId: string;
  mcAntiBotToken: string;
  mcClientId: string;
}

export function generateMonkeyCodeDevice(): MonkeyCodeDeviceProfile {
  const base = generateUniversalDevice('monkeycode');
  const rand = (n: number) => Math.random().toString(36).substring(2, 2 + n);
  return {
    ...base,
    mcDeviceId: 'mc_dev_' + rand(16),
    mcSessionId: 'sess_' + rand(20),
    mcVisitorId: 'vis_' + rand(14),
    mcAntiBotToken: 'abt_' + rand(24),
    mcClientId: 'client_' + rand(12),
    cookies: {
      ...base.cookies,
      MC_DEVICE_ID: 'mc_dev_' + rand(16),
      MC_SESSION: 'sess_' + rand(20),
      MC_VISITOR_ID: 'vis_' + rand(14),
      MC_ANTI_BOT_TOKEN: 'abt_' + rand(24),
      MC_LANG: 'pt-BR',
    },
  };
}

export function buildMonkeyCodeScriptBody(device: MonkeyCodeDeviceProfile, persona: any): string {
  const profile = JSON.stringify({
    mcDeviceId: device.mcDeviceId,
    mcSessionId: device.mcSessionId,
    mcVisitorId: device.mcVisitorId,
    mcAntiBotToken: device.mcAntiBotToken,
    mcClientId: device.mcClientId,
    macAddress: device.macAddress,
    imei: device.imei,
    androidId: device.androidId,
    fingerprint: device.fingerprint,
    userAgent: device.userAgent,
    persona: persona ? { name: persona.fullName, email: persona.email, phone: persona.phone } : null,
  }).replace(/"/g, '\\"');

  return `
    // MONKEYCODE - identidade e sessão (domínio real)
    const mcProfile = JSON.parse("${profile}");
    localStorage.setItem('mc_device_profile', JSON.stringify(mcProfile));
    localStorage.setItem('mc_device_id', mcProfile.mcDeviceId);
    localStorage.setItem('mc_session_id', mcProfile.mcSessionId);
    localStorage.setItem('mc_visitor_id', mcProfile.mcVisitorId);
    localStorage.setItem('mc_anti_bot_token', mcProfile.mcAntiBotToken);
    localStorage.setItem('_device_fingerprint', mcProfile.fingerprint);
    if (mcProfile.persona) localStorage.setItem('mc_persona', JSON.stringify(mcProfile.persona));

    // Cookies de sessão no domínio do MonkeyCode
    const setCookie = (k, v) => { document.cookie = k + '=' + v + '; path=/; max-age=31536000; SameSite=Lax; Secure'; };
    setCookie('MC_DEVICE_ID', mcProfile.mcDeviceId);
    setCookie('MC_SESSION', mcProfile.mcSessionId);
    setCookie('MC_VISITOR_ID', mcProfile.mcVisitorId);
    setCookie('MC_ANTI_BOT_TOKEN', mcProfile.mcAntiBotToken);
    setCookie('MC_LANG', 'pt-BR');
  `;
}
