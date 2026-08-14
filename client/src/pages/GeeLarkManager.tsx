import ManusStyleInjectionPage from '@/components/ManusStyleInjectionPage';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { generateGeeLarkDevice, buildGeeLarkScriptBody, GEELARK_INVITE_CODE } from '@/lib/geelarkDeviceGenerator';

export default function GeeLarkManager() {
  return (
    <ManusStyleInjectionPage
      config={{
        siteKey: 'geelark',
        siteName: 'GeeLark',
        siteTitle: 'GEELARK DEVICE MASTER',
        tagline: 'Cloud phone anti-detectável • app.geelark.com (cadastro PT-BR)',
        siteUrl: 'https://app.geelark.com/#/register-pt?invite_code=' + GEELARK_INVITE_CODE,
        guide: MODULE_GUIDES['geelark'],
        accent: {
          text: 'text-orange-400',
          border: 'border-orange-400/30',
          bg: 'bg-orange-400/20',
          gradientFrom: 'from-orange-500/30',
          gradientTo: 'to-amber-500/30',
          hex: '#fb923c',
        },
        platform: 'universal',
        generateDevice: generateGeeLarkDevice,
        buildScriptBody: (device, persona) => buildGeeLarkScriptBody(device, persona),
        deviceInfo: (device) => [
          { label: 'GLE DEVICE ID', value: device.gleDeviceId, highlight: true },
          { label: 'GLE SESSION', value: device.gleSessionId, highlight: true },
          { label: 'GLE ANON ID', value: device.gleAnonId },
          { label: 'GLE INVITE', value: device.gleInviteCode },
          { label: 'GLE CLOUD ID', value: device.gleCloudId },
          { label: 'MAC ADDRESS', value: device.macAddress },
          { label: 'IMEI', value: device.imei },
          { label: 'ANDROID ID', value: device.androidId },
        ],
      }}
    />
  );
}
