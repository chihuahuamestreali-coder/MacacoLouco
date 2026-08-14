import ManusStyleInjectionPage from '@/components/ManusStyleInjectionPage';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { generateVmosCloudDevice, buildVmosCloudScriptBody, VMOS_CHANNEL } from '@/lib/vmoscloudDeviceGenerator';

export default function VmosCloudManager() {
  return (
    <ManusStyleInjectionPage
      config={{
        siteKey: 'vmoscloud',
        siteName: 'VmosCloud',
        siteTitle: 'VMOSCLOUD DEVICE MASTER',
        tagline: 'Cloud phone • cloud.vmoscloud.com/buy (canal googlead_hant)',
        siteUrl: 'https://cloud.vmoscloud.com/buy?channel=' + VMOS_CHANNEL,
        guide: MODULE_GUIDES['vmoscloud'],
        accent: {
          text: 'text-sky-400',
          border: 'border-sky-400/30',
          bg: 'bg-sky-400/20',
          gradientFrom: 'from-sky-500/30',
          gradientTo: 'to-blue-500/30',
          hex: '#38bdf8',
        },
        platform: 'universal',
        generateDevice: generateVmosCloudDevice,
        buildScriptBody: (device, persona) => buildVmosCloudScriptBody(device, persona),
        deviceInfo: (device) => [
          { label: 'VMC DEVICE ID', value: device.vmcDeviceId, highlight: true },
          { label: 'VMC SESSION', value: device.vmcSessionId, highlight: true },
          { label: 'VMC ANON ID', value: device.vmcAnonId },
          { label: 'VMC CHANNEL', value: device.vmcChannel },
          { label: 'VMC PLAN', value: device.vmcPlan },
          { label: 'MAC ADDRESS', value: device.macAddress },
          { label: 'IMEI', value: device.imei },
          { label: 'ANDROID ID', value: device.androidId },
        ],
      }}
    />
  );
}
