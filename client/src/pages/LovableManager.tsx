import ManusStyleInjectionPage from '@/components/ManusStyleInjectionPage';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { generateLovableDevice, buildLovableScriptBody } from '@/lib/lovableDeviceGenerator';

export default function LovableManager() {
  return (
    <ManusStyleInjectionPage
      config={{
        siteKey: 'lovable',
        siteName: 'Lovable',
        siteTitle: 'LOVABLE DEVICE MASTER',
        tagline: 'Criação e login de apps • lovable.dev',
        siteUrl: 'https://lovable.dev/pt-br/',
        guide: MODULE_GUIDES['lovable'],
        accent: {
          text: 'text-violet-400',
          border: 'border-violet-400/30',
          bg: 'bg-violet-400/20',
          gradientFrom: 'from-violet-500/30',
          gradientTo: 'to-fuchsia-500/30',
          hex: '#a78bfa',
        },
        platform: 'universal',
        generateDevice: generateLovableDevice,
        buildScriptBody: (device, persona) => buildLovableScriptBody(device, persona),
        deviceInfo: (device) => [
          { label: 'LB DEVICE ID', value: device.lbDeviceId, highlight: true },
          { label: 'LB SESSION', value: device.lbSessionId, highlight: true },
          { label: 'LB ANON ID', value: device.lbAnonId },
          { label: 'LB WORKSPACE', value: device.lbWorkspaceId },
          { label: 'MAC ADDRESS', value: device.macAddress },
          { label: 'IMEI', value: device.imei },
          { label: 'ANDROID ID', value: device.androidId },
        ],
      }}
    />
  );
}
