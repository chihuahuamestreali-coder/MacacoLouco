/**
 * Tensor.art Device Generator - Identidade para Tensor.art (tensor.art)
 * Campos específicos: TNS_DEVICE_ID, TNS_SESSION, TNS_ANON_ID, TNS_UID
 * Plataforma: galeria e geração de arte com IA (login de criação)
 */
import { generateUniversalDevice, UniversalDeviceProfile } from './universalDeviceGenerator';

export interface TensorDeviceProfile extends UniversalDeviceProfile {
  tnsDeviceId: string;
  tnsSessionId: string;
  tnsAnonId: string;
  tnsUid: string;
  tnsChannel: string;
  tnsLocale: string;
}

export const TENSOR_CHANNEL = 'web';

export function generateTensorDevice(): TensorDeviceProfile {
  const base = generateUniversalDevice('tensor');
  const rand = (n: number) => Math.random().toString(36).substring(2, 2 + n);
  return {
    ...base,
    tnsDeviceId: 'tns_dev_' + rand(16),
    tnsSessionId: 'sess_' + rand(20),
    tnsAnonId: 'anon_' + rand(18),
    tnsUid: 'uid_' + rand(14),
    tnsChannel: TENSOR_CHANNEL,
    tnsLocale: 'pt-BR',
    cookies: {
      ...base.cookies,
      TNS_DEVICE_ID: 'tns_dev_' + rand(16),
      TNS_SESSION: 'sess_' + rand(20),
      TNS_ANON_ID: 'anon_' + rand(18),
      TNS_UID: 'uid_' + rand(14),
      TNS_CHANNEL: TENSOR_CHANNEL,
      TNS_LOCALE: 'pt-BR',
    },
  };
}

export function buildTensorScriptBody(device: TensorDeviceProfile, persona: any): string {
  const profile = JSON.stringify({
    tnsDeviceId: device.tnsDeviceId,
    tnsSessionId: device.tnsSessionId,
    tnsAnonId: device.tnsAnonId,
    tnsUid: device.tnsUid,
    tnsChannel: device.tnsChannel,
    tnsLocale: device.tnsLocale,
    macAddress: device.macAddress,
    imei: device.imei,
    androidId: device.androidId,
    fingerprint: device.fingerprint,
    userAgent: device.userAgent,
    persona: persona ? { name: persona.fullName, email: persona.email, phone: persona.phone } : null,
  }).replace(/"/g, '\\"');

  return `
    // TENSOR.ART - identidade e sessão (domínio real)
    const tnsProfile = JSON.parse("${profile}");
    localStorage.setItem('tns_device_profile', JSON.stringify(tnsProfile));
    localStorage.setItem('tns_device_id', tnsProfile.tnsDeviceId);
    localStorage.setItem('tns_session_id', tnsProfile.tnsSessionId);
    localStorage.setItem('tns_anon_id', tnsProfile.tnsAnonId);
    localStorage.setItem('tns_uid', tnsProfile.tnsUid);
    localStorage.setItem('_device_fingerprint', tnsProfile.fingerprint);
    if (tnsProfile.persona) localStorage.setItem('tns_persona', JSON.stringify(tnsProfile.persona));

    // Cookies de sessão no domínio da Tensor.art
    const setCookie = (k, v) => { document.cookie = k + '=' + v + '; path=/; max-age=31536000; SameSite=Lax'; };
    setCookie('TNS_DEVICE_ID', tnsProfile.tnsDeviceId);
    setCookie('TNS_SESSION', tnsProfile.tnsSessionId);
    setCookie('TNS_ANON_ID', tnsProfile.tnsAnonId);
    setCookie('TNS_UID', tnsProfile.tnsUid);
    setCookie('TNS_CHANNEL', tnsProfile.tnsChannel);
    setCookie('TNS_LOCALE', tnsProfile.tnsLocale);
  `;
}
