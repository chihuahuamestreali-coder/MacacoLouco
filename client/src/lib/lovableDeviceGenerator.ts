/**
 * Lovable Device Generator - Identidade para Lovable (lovable.dev)
 * Campos específicos: LB_DEVICE_ID, LB_SESSION, LB_ANON_ID, LB_THEME
 */
import { generateUniversalDevice, UniversalDeviceProfile } from './universalDeviceGenerator';

export interface LovableDeviceProfile extends UniversalDeviceProfile {
  lbDeviceId: string;
  lbSessionId: string;
  lbAnonId: string;
  lbWorkspaceId: string;
  lbOnboardingToken: string;
}

export function generateLovableDevice(): LovableDeviceProfile {
  const base = generateUniversalDevice('lovable');
  const rand = (n: number) => Math.random().toString(36).substring(2, 2 + n);
  return {
    ...base,
    lbDeviceId: 'lb_dev_' + rand(16),
    lbSessionId: 'sess_' + rand(20),
    lbAnonId: 'anon_' + rand(18),
    lbWorkspaceId: 'ws_' + rand(14),
    lbOnboardingToken: 'onb_' + rand(22),
    cookies: {
      ...base.cookies,
      LB_DEVICE_ID: 'lb_dev_' + rand(16),
      LB_SESSION: 'sess_' + rand(20),
      LB_ANON_ID: 'anon_' + rand(18),
      LB_WORKSPACE_ID: 'ws_' + rand(14),
      LB_LOCALE: 'pt-BR',
    },
  };
}

export function buildLovableScriptBody(device: LovableDeviceProfile, persona: any): string {
  const profile = JSON.stringify({
    lbDeviceId: device.lbDeviceId,
    lbSessionId: device.lbSessionId,
    lbAnonId: device.lbAnonId,
    lbWorkspaceId: device.lbWorkspaceId,
    lbOnboardingToken: device.lbOnboardingToken,
    macAddress: device.macAddress,
    imei: device.imei,
    androidId: device.androidId,
    fingerprint: device.fingerprint,
    userAgent: device.userAgent,
    persona: persona ? { name: persona.fullName, email: persona.email, phone: persona.phone } : null,
  }).replace(/"/g, '\\"');

  return `
    // LOVABLE - identidade e sessão (domínio real)
    const lbProfile = JSON.parse("${profile}");
    localStorage.setItem('lb_device_profile', JSON.stringify(lbProfile));
    localStorage.setItem('lb_device_id', lbProfile.lbDeviceId);
    localStorage.setItem('lb_session_id', lbProfile.lbSessionId);
    localStorage.setItem('lb_anon_id', lbProfile.lbAnonId);
    localStorage.setItem('lb_workspace_id', lbProfile.lbWorkspaceId);
    localStorage.setItem('lb_onboarding_token', lbProfile.lbOnboardingToken);
    localStorage.setItem('_device_fingerprint', lbProfile.fingerprint);
    if (lbProfile.persona) localStorage.setItem('lb_persona', JSON.stringify(lbProfile.persona));

    // Cookies de sessão no domínio da Lovable
    const setCookie = (k, v) => { document.cookie = k + '=' + v + '; path=/; max-age=31536000; SameSite=Lax'; };
    setCookie('LB_DEVICE_ID', lbProfile.lbDeviceId);
    setCookie('LB_SESSION', lbProfile.lbSessionId);
    setCookie('LB_ANON_ID', lbProfile.lbAnonId);
    setCookie('LB_WORKSPACE_ID', lbProfile.lbWorkspaceId);
    setCookie('LB_LOCALE', 'pt-BR');
  `;
}
