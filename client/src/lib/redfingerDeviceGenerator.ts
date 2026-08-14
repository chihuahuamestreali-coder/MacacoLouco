/**
 * Redfinger Device Generator - Identidade para Redfinger (cloudemulator.net)
 * Campos específicos: RF_DEVICE_ID, RF_SESSION, RF_ANON_ID, RF_EMULATOR_MODEL
 * Plataforma: emulador de Android na nuvem (login de criação)
 */
import { generateUniversalDevice, UniversalDeviceProfile } from './universalDeviceGenerator';

export interface RedfingerDeviceProfile extends UniversalDeviceProfile {
  rfDeviceId: string;
  rfSessionId: string;
  rfAnonId: string;
  rfEmulatorModel: string;
  rfChannelCode: string;
}

export function generateRedfingerDevice(): RedfingerDeviceProfile {
  const base = generateUniversalDevice('redfinger');
  const rand = (n: number) => Math.random().toString(36).substring(2, 2 + n);
  const emulators = ['Redfinger 2', 'Redfinger 3', 'Redfinger Cloud'];
  const emulatorModel = emulators[Math.floor(Math.random() * emulators.length)];
  return {
    ...base,
    rfDeviceId: 'rf_dev_' + rand(16),
    rfSessionId: 'sess_' + rand(20),
    rfAnonId: 'anon_' + rand(18),
    rfEmulatorModel: emulatorModel,
    rfChannelCode: 'web',
    cookies: {
      ...base.cookies,
      RF_DEVICE_ID: 'rf_dev_' + rand(16),
      RF_SESSION: 'sess_' + rand(20),
      RF_ANON_ID: 'anon_' + rand(18),
      RF_EMULATOR_MODEL: emulatorModel,
      RF_LOCALE: 'pt-BR',
    },
  };
}

export function buildRedfingerScriptBody(device: RedfingerDeviceProfile, persona: any): string {
  const profile = JSON.stringify({
    rfDeviceId: device.rfDeviceId,
    rfSessionId: device.rfSessionId,
    rfAnonId: device.rfAnonId,
    rfEmulatorModel: device.rfEmulatorModel,
    rfChannelCode: device.rfChannelCode,
    macAddress: device.macAddress,
    imei: device.imei,
    androidId: device.androidId,
    fingerprint: device.fingerprint,
    userAgent: device.userAgent,
    persona: persona ? { name: persona.fullName, email: persona.email, phone: persona.phone } : null,
  }).replace(/"/g, '\\"');

  return `
    // REDFINGER - identidade e sessão (domínio real)
    const rfProfile = JSON.parse("${profile}");
    localStorage.setItem('rf_device_profile', JSON.stringify(rfProfile));
    localStorage.setItem('rf_device_id', rfProfile.rfDeviceId);
    localStorage.setItem('rf_session_id', rfProfile.rfSessionId);
    localStorage.setItem('rf_anon_id', rfProfile.rfAnonId);
    localStorage.setItem('rf_emulator_model', rfProfile.rfEmulatorModel);
    localStorage.setItem('_device_fingerprint', rfProfile.fingerprint);
    if (rfProfile.persona) localStorage.setItem('rf_persona', JSON.stringify(rfProfile.persona));

    // Cookies de sessão no domínio do Redfinger
    const setCookie = (k, v) => { document.cookie = k + '=' + v + '; path=/; max-age=31536000; SameSite=Lax'; };
    setCookie('RF_DEVICE_ID', rfProfile.rfDeviceId);
    setCookie('RF_SESSION', rfProfile.rfSessionId);
    setCookie('RF_ANON_ID', rfProfile.rfAnonId);
    setCookie('RF_EMULATOR_MODEL', rfProfile.rfEmulatorModel);
    setCookie('RF_LOCALE', 'pt-BR');
  `;
}
