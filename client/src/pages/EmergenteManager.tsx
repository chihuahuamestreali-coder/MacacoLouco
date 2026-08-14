import ManusStyleInjectionPage from '@/components/ManusStyleInjectionPage';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { generateEmergenteDevice, buildEmergenteScriptBody } from '@/lib/emergenteDeviceGenerator';

export default function EmergenteManager() {
  return (
    <ManusStyleInjectionPage
      config={{
        siteKey: 'emergente',
        siteName: 'Emergente',
        siteTitle: 'EMERGENTE DEVICE MASTER',
        tagline: 'Criação e login de conta • app.emergent.sh',
        siteUrl: 'https://app.emergent.sh/landing/br/',
        guide: MODULE_GUIDES['emergente'],
        accent: {
          text: 'text-amber-400',
          border: 'border-amber-400/30',
          bg: 'bg-amber-400/20',
          gradientFrom: 'from-amber-500/30',
          gradientTo: 'to-orange-500/30',
          hex: '#fbbf24',
        },
        platform: 'universal',
        generateDevice: generateEmergenteDevice,
        buildScriptBody: (device, persona) => buildEmergenteScriptBody(device, persona),
        deviceInfo: (device) => [
          { label: 'EMG DEVICE ID', value: device.emgDeviceId, highlight: true },
          { label: 'EMG SESSION', value: device.emgSessionId, highlight: true },
          { label: 'EMG ANON ID', value: device.emgAnonId },
          { label: 'EMG UTM', value: device.emgUtmSource },
          { label: 'MAC ADDRESS', value: device.macAddress },
          { label: 'IMEI', value: device.imei },
          { label: 'ANDROID ID', value: device.androidId },
        ],
      }}
    />
  );
}
