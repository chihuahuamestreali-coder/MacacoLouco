import ManusStyleInjectionPage from '@/components/ManusStyleInjectionPage';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { generateTensorDevice, buildTensorScriptBody } from '@/lib/tensorDeviceGenerator';

export default function TensorManager() {
  return (
    <ManusStyleInjectionPage
      config={{
        siteKey: 'tensor',
        siteName: 'Tensor.art',
        siteTitle: 'TENSOR.ART DEVICE MASTER',
        tagline: 'Galeria de arte com IA • tensor.art (login de criação)',
        siteUrl: 'https://tensor.art/',
        guide: MODULE_GUIDES['tensor'],
        accent: {
          text: 'text-violet-400',
          border: 'border-violet-400/30',
          bg: 'bg-violet-400/20',
          gradientFrom: 'from-violet-500/30',
          gradientTo: 'to-fuchsia-500/30',
          hex: '#a78bfa',
        },
        platform: 'universal',
        generateDevice: generateTensorDevice,
        buildScriptBody: (device, persona) => buildTensorScriptBody(device, persona),
        deviceInfo: (device) => [
          { label: 'TNS DEVICE ID', value: device.tnsDeviceId, highlight: true },
          { label: 'TNS SESSION', value: device.tnsSessionId, highlight: true },
          { label: 'TNS ANON ID', value: device.tnsAnonId },
          { label: 'TNS UID', value: device.tnsUid },
          { label: 'TNS CHANNEL', value: device.tnsChannel },
          { label: 'MAC ADDRESS', value: device.macAddress },
          { label: 'IMEI', value: device.imei },
          { label: 'ANDROID ID', value: device.androidId },
        ],
      }}
    />
  );
}
