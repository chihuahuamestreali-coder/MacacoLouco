import ManusStyleInjectionPage from '@/components/ManusStyleInjectionPage';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { generateRedfingerDevice, buildRedfingerScriptBody } from '@/lib/redfingerDeviceGenerator';

export default function RedfingerManager() {
  return (
    <ManusStyleInjectionPage
      config={{
        siteKey: 'redfinger',
        siteName: 'Redfinger',
        siteTitle: 'REDFINGER DEVICE MASTER',
        tagline: 'Emulador Android na nuvem • www.cloudemulator.net/app/sign-in',
        siteUrl: 'https://www.cloudemulator.net/app/sign-in',
        guide: MODULE_GUIDES['redfinger'],
        accent: {
          text: 'text-red-400',
          border: 'border-red-400/30',
          bg: 'bg-red-400/20',
          gradientFrom: 'from-red-500/30',
          gradientTo: 'to-rose-500/30',
          hex: '#f87171',
        },
        platform: 'universal',
        generateDevice: generateRedfingerDevice,
        buildScriptBody: (device, persona) => buildRedfingerScriptBody(device, persona),
        deviceInfo: (device) => [
          { label: 'RF DEVICE ID', value: device.rfDeviceId, highlight: true },
          { label: 'RF SESSION', value: device.rfSessionId, highlight: true },
          { label: 'RF ANON ID', value: device.rfAnonId },
          { label: 'RF EMULATOR', value: device.rfEmulatorModel },
          { label: 'RF CHANNEL', value: device.rfChannelCode },
          { label: 'MAC ADDRESS', value: device.macAddress },
          { label: 'IMEI', value: device.imei },
          { label: 'ANDROID ID', value: device.androidId },
        ],
      }}
    />
  );
}
