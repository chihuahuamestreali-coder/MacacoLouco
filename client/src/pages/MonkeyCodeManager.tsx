import ManusStyleInjectionPage from '@/components/ManusStyleInjectionPage';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { generateMonkeyCodeDevice, buildMonkeyCodeScriptBody } from '@/lib/monkeyCodeDeviceGenerator';

export default function MonkeyCodeManager() {
  return (
    <ManusStyleInjectionPage
      config={{
        siteKey: 'monkeycode',
        siteName: 'MonkeyCode',
        siteTitle: 'MONKEYCODE DEVICE MASTER',
        tagline: 'Plataforma de coding AI • monkeycode-ai.net',
        siteUrl: 'https://monkeycode-ai.net/',
        guide: MODULE_GUIDES['monkeycode'],
        accent: {
          text: 'text-cyan-400',
          border: 'border-cyan-400/30',
          bg: 'bg-cyan-400/20',
          gradientFrom: 'from-cyan-500/30',
          gradientTo: 'to-blue-500/30',
          hex: '#00d9ff',
        },
        platform: 'universal',
        generateDevice: generateMonkeyCodeDevice,
        buildScriptBody: (device, persona) => buildMonkeyCodeScriptBody(device, persona),
        deviceInfo: (device) => [
          { label: 'MC DEVICE ID', value: device.mcDeviceId, highlight: true },
          { label: 'MC SESSION', value: device.mcSessionId, highlight: true },
          { label: 'MC VISITOR', value: device.mcVisitorId },
          { label: 'MAC ADDRESS', value: device.macAddress },
          { label: 'IMEI', value: device.imei },
          { label: 'ANDROID ID', value: device.androidId },
        ],
      }}
    />
  );
}
