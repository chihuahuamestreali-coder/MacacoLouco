/**
 * VmosCloud Device Generator - Identidade para VmosCloud (cloud.vmoscloud.com)
 * Campos específicos: VMC_DEVICE_ID, VMC_SESSION, VMC_ANON_ID, VMC_CHANNEL
 * Plataforma: cloud phone (login de criação) - canal googlead_hant
 */
import { generateUniversalDevice, UniversalDeviceProfile } from './universalDeviceGenerator';

export interface VmosCloudDeviceProfile extends UniversalDeviceProfile {
  vmcDeviceId: string;
  vmcSessionId: string;
  vmcAnonId: string;
  vmcChannel: string;
  vmcPlan: string;
}

export const VMOS_CHANNEL = 'googlead_hant';

export function generateVmosCloudDevice(): VmosCloudDeviceProfile {
  const base = generateUniversalDevice('vmoscloud');
  const rand = (n: number) => Math.random().toString(36).substring(2, 2 + n);
  const plans = ['BASIC', 'PRO', 'ULTIMATE'];
  const plan = plans[Math.floor(Math.random() * plans.length)];
  return {
    ...base,
    vmcDeviceId: 'vmc_dev_' + rand(16),
    vmcSessionId: 'sess_' + rand(20),
    vmcAnonId: 'anon_' + rand(18),
    vmcChannel: VMOS_CHANNEL,
    vmcPlan: plan,
    cookies: {
      ...base.cookies,
      VMC_DEVICE_ID: 'vmc_dev_' + rand(16),
      VMC_SESSION: 'sess_' + rand(20),
      VMC_ANON_ID: 'anon_' + rand(18),
      VMC_CHANNEL: VMOS_CHANNEL,
      VMC_PLAN: plan,
      VMC_LOCALE: 'pt-BR',
    },
  };
}

export function buildVmosCloudScriptBody(device: VmosCloudDeviceProfile, persona: any): string {
  const profile = JSON.stringify({
    vmcDeviceId: device.vmcDeviceId,
    vmcSessionId: device.vmcSessionId,
    vmcAnonId: device.vmcAnonId,
    vmcChannel: device.vmcChannel,
    vmcPlan: device.vmcPlan,
    macAddress: device.macAddress,
    imei: device.imei,
    androidId: device.androidId,
    fingerprint: device.fingerprint,
    userAgent: device.userAgent,
    persona: persona ? { name: persona.fullName, email: persona.email, phone: persona.phone } : null,
  }).replace(/"/g, '\\"');

  return `
    // VMOSCLOUD - identidade e sessão (domínio real)
    const vmcProfile = JSON.parse("${profile}");
    localStorage.setItem('vmc_device_profile', JSON.stringify(vmcProfile));
    localStorage.setItem('vmc_device_id', vmcProfile.vmcDeviceId);
    localStorage.setItem('vmc_session_id', vmcProfile.vmcSessionId);
    localStorage.setItem('vmc_anon_id', vmcProfile.vmcAnonId);
    localStorage.setItem('vmc_channel', vmcProfile.vmcChannel);
    localStorage.setItem('_device_fingerprint', vmcProfile.fingerprint);
    if (vmcProfile.persona) localStorage.setItem('vmc_persona', JSON.stringify(vmcProfile.persona));

    // Cookies de sessão no domínio do VmosCloud
    const setCookie = (k, v) => { document.cookie = k + '=' + v + '; path=/; max-age=31536000; SameSite=Lax'; };
    setCookie('VMC_DEVICE_ID', vmcProfile.vmcDeviceId);
    setCookie('VMC_SESSION', vmcProfile.vmcSessionId);
    setCookie('VMC_ANON_ID', vmcProfile.vmcAnonId);
    setCookie('VMC_CHANNEL', vmcProfile.vmcChannel);
    setCookie('VMC_PLAN', vmcProfile.vmcPlan);
    setCookie('VMC_LOCALE', 'pt-BR');
  `;
}
