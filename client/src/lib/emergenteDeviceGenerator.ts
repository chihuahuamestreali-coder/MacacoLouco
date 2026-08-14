/**
 * Emergente Device Generator - Identidade para Emergente (app.emergent.sh)
 * Campos específicos: EMG_DEVICE_ID, EMG_SESSION, EMG_ANON_ID, EMG_UTM_SOURCE
 */
import { generateUniversalDevice, UniversalDeviceProfile } from './universalDeviceGenerator';

export interface EmergenteDeviceProfile extends UniversalDeviceProfile {
  emgDeviceId: string;
  emgSessionId: string;
  emgAnonId: string;
  emgUtmSource: string;
  emgCampaignId: string;
}

export function generateEmergenteDevice(): EmergenteDeviceProfile {
  const base = generateUniversalDevice('emergente');
  const rand = (n: number) => Math.random().toString(36).substring(2, 2 + n);
  return {
    ...base,
    emgDeviceId: 'emg_dev_' + rand(16),
    emgSessionId: 'sess_' + rand(20),
    emgAnonId: 'anon_' + rand(18),
    emgUtmSource: 'google',
    emgCampaignId: '23820533915',
    cookies: {
      ...base.cookies,
      EMG_DEVICE_ID: 'emg_dev_' + rand(16),
      EMG_SESSION: 'sess_' + rand(20),
      EMG_ANON_ID: 'anon_' + rand(18),
      EMG_UTM_SOURCE: 'google',
      EMG_CAMPAIGN_ID: '23820533915',
      EMG_LOCALE: 'pt-BR',
    },
  };
}

export function buildEmergenteScriptBody(device: EmergenteDeviceProfile, persona: any): string {
  const profile = JSON.stringify({
    emgDeviceId: device.emgDeviceId,
    emgSessionId: device.emgSessionId,
    emgAnonId: device.emgAnonId,
    emgUtmSource: device.emgUtmSource,
    emgCampaignId: device.emgCampaignId,
    macAddress: device.macAddress,
    imei: device.imei,
    androidId: device.androidId,
    fingerprint: device.fingerprint,
    userAgent: device.userAgent,
    persona: persona ? { name: persona.fullName, email: persona.email, phone: persona.phone } : null,
  }).replace(/"/g, '\\"');

  return `
    // EMERGENTE - identidade e sessão (domínio real)
    const emgProfile = JSON.parse("${profile}");
    localStorage.setItem('emg_device_profile', JSON.stringify(emgProfile));
    localStorage.setItem('emg_device_id', emgProfile.emgDeviceId);
    localStorage.setItem('emg_session_id', emgProfile.emgSessionId);
    localStorage.setItem('emg_anon_id', emgProfile.emgAnonId);
    localStorage.setItem('_device_fingerprint', emgProfile.fingerprint);
    if (emgProfile.persona) localStorage.setItem('emg_persona', JSON.stringify(emgProfile.persona));

    // Cookies de sessão no domínio da Emergente
    const setCookie = (k, v) => { document.cookie = k + '=' + v + '; path=/; max-age=31536000; SameSite=Lax'; };
    setCookie('EMG_DEVICE_ID', emgProfile.emgDeviceId);
    setCookie('EMG_SESSION', emgProfile.emgSessionId);
    setCookie('EMG_ANON_ID', emgProfile.emgAnonId);
    setCookie('EMG_UTM_SOURCE', emgProfile.emgUtmSource);
    setCookie('EMG_CAMPAIGN_ID', emgProfile.emgCampaignId);
    setCookie('EMG_LOCALE', 'pt-BR');
  `;
}
