import ManusStyleInjectionPage from '@/components/ManusStyleInjectionPage';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { generateSeaArtDevice, buildSeaArtScriptBody } from '@/lib/seaartDeviceGenerator';

export default function SeaArtManager() {
  return (
    <ManusStyleInjectionPage
      config={{
        siteKey: 'seaart',
        siteName: 'SeaArt AI',
        siteTitle: 'SEAART DEVICE MASTER',
        tagline: 'Geração de imagens com IA • www.seaart.ai (login de criação, PT-BR)',
        siteUrl: 'https://www.seaart.ai/login',
        guide: MODULE_GUIDES['seaart'],
        accent: {
          text: 'text-cyan-400',
          border: 'border-cyan-400/30',
          bg: 'bg-cyan-400/20',
          gradientFrom: 'from-cyan-500/30',
          gradientTo: 'to-sky-500/30',
          hex: '#22d3ee',
        },
        platform: 'universal',
        generateDevice: generateSeaArtDevice,
        buildScriptBody: (device, persona) => buildSeaArtScriptBody(device, persona),
        deviceInfo: (device) => [
          { label: 'SA DEVICE ID', value: device.saDeviceId, highlight: true },
          { label: 'SA SESSION', value: device.saSessionId, highlight: true },
          { label: 'SA ANON ID', value: device.saAnonId },
          { label: 'SA UID', value: device.saUid },
          { label: 'SA CHANNEL', value: device.saChannel },
          { label: 'MAC ADDRESS', value: device.macAddress },
          { label: 'IMEI', value: device.imei },
          { label: 'ANDROID ID', value: device.androidId },
        ],
      }}
    />
  );
}
