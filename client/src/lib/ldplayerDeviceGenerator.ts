/**
 * LDPlayer Device Generator - Identidade para LDPlayer (pt.ldplayer.net)
 * Campos específicos: LDP_DEVICE_ID, LDP_SESSION, LDP_ANDROID_ID, LDP_EMULATOR_VER
 * Plataforma: emulador Android para PC (versão pt-BR)
 */
import { generateUniversalDevice, UniversalDeviceProfile } from './universalDeviceGenerator';

export interface LdplayerDeviceProfile extends UniversalDeviceProfile {
  ldpDeviceId: string;
  ldpSessionId: string;
  ldpAnonId: string;
  ldpEmulatorVer: string;
  ldpAndroidVer: string;
}

export function generateLdplayerDevice(): LdplayerDeviceProfile {
  const base = generateUniversalDevice('ldplayer');
  const rand = (n: number) => Math.random().toString(36).substring(2, 2 + n);
  const versions = ['9.1.24', '9.0.66', '4.0.83'];
  const androidVersions = ['Android 7.1.2', 'Android 9', 'Android 5.1'];
  return {
    ...base,
    ldpDeviceId: 'ldp_dev_' + rand(16),
    ldpSessionId: 'sess_' + rand(20),
    ldpAnonId: 'anon_' + rand(18),
    ldpEmulatorVer: versions[Math.floor(Math.random() * versions.length)],
    ldpAndroidVer: androidVersions[Math.floor(Math.random() * androidVersions.length)],
    cookies: {
      ...base.cookies,
      LDP_DEVICE_ID: 'ldp_dev_' + rand(16),
      LDP_SESSION: 'sess_' + rand(20),
      LDP_ANON_ID: 'anon_' + rand(18),
      LDP_EMULATOR_VER: versions[Math.floor(Math.random() * versions.length)],
      LDP_LOCALE: 'pt-BR',
    },
  };
}

export function buildLdplayerScriptBody(device: LdplayerDeviceProfile, persona: any): string {
  const profile = JSON.stringify({
    ldpDeviceId: device.ldpDeviceId,
    ldpSessionId: device.ldpSessionId,
    ldpAnonId: device.ldpAnonId,
    ldpEmulatorVer: device.ldpEmulatorVer,
    ldpAndroidVer: device.ldpAndroidVer,
    macAddress: device.macAddress,
    imei: device.imei,
    androidId: device.androidId,
    fingerprint: device.fingerprint,
    userAgent: device.userAgent,
    persona: persona ? { name: persona.fullName, email: persona.email, phone: persona.phone } : null,
  }).replace(/"/g, '\\"');

  return `
    // LDPLAYER - identidade e sessão (domínio real)
    const ldpProfile = JSON.parse("${profile}");
    localStorage.setItem('ldp_device_profile', JSON.stringify(ldpProfile));
    localStorage.setItem('ldp_device_id', ldpProfile.ldpDeviceId);
    localStorage.setItem('ldp_session_id', ldpProfile.ldpSessionId);
    localStorage.setItem('ldp_anon_id', ldpProfile.ldpAnonId);
    localStorage.setItem('ldp_emulator_ver', ldpProfile.ldpEmulatorVer);
    localStorage.setItem('_device_fingerprint', ldpProfile.fingerprint);
    if (ldpProfile.persona) localStorage.setItem('ldp_persona', JSON.stringify(ldpProfile.persona));

    // Cookies de sessão no domínio do LDPlayer
    const setCookie = (k, v) => { document.cookie = k + '=' + v + '; path=/; max-age=31536000; SameSite=Lax'; };
    setCookie('LDP_DEVICE_ID', ldpProfile.ldpDeviceId);
    setCookie('LDP_SESSION', ldpProfile.ldpSessionId);
    setCookie('LDP_ANON_ID', ldpProfile.ldpAnonId);
    setCookie('LDP_EMULATOR_VER', ldpProfile.ldpEmulatorVer);
    setCookie('LDP_LOCALE', 'pt-BR');
  `;
}
