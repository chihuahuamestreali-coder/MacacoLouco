import ManusStyleInjectionPage from '@/components/ManusStyleInjectionPage';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { generateLdplayerDevice, buildLdplayerScriptBody } from '@/lib/ldplayerDeviceGenerator';

export default function LdplayerManager() {
  return (
    <ManusStyleInjectionPage
      config={{
        siteKey: 'ldplayer',
        siteName: 'LDPlayer',
        siteTitle: 'LDPLAYER DEVICE MASTER',
        tagline: 'Emulador Android para PC • pt.ldplayer.net',
        siteUrl: 'https://pt.ldplayer.net/',
        guide: MODULE_GUIDES['ldplayer'],
        accent: {
          text: 'text-lime-400',
          border: 'border-lime-400/30',
          bg: 'bg-lime-400/20',
          gradientFrom: 'from-lime-500/30',
          gradientTo: 'to-green-500/30',
          hex: '#a3e635',
        },
        platform: 'universal',
        generateDevice: generateLdplayerDevice,
        buildScriptBody: (device, persona) => buildLdplayerScriptBody(device, persona),
        deviceInfo: (device) => [
          { label: 'LDP DEVICE ID', value: device.ldpDeviceId, highlight: true },
          { label: 'LDP SESSION', value: device.ldpSessionId, highlight: true },
          { label: 'LDP ANON ID', value: device.ldpAnonId },
          { label: 'LDP EMULATOR', value: device.ldpEmulatorVer },
          { label: 'LDP ANDROID', value: device.ldpAndroidVer },
          { label: 'MAC ADDRESS', value: device.macAddress },
          { label: 'IMEI', value: device.imei },
          { label: 'ANDROID ID', value: device.androidId },
        ],
      }}
    />
  );
}
