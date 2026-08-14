import ManusStyleInjectionPage from '@/components/ManusStyleInjectionPage';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { generateLeonardoDevice, buildLeonardoScriptBody } from '@/lib/leonardoDeviceGenerator';

export default function LeonardoManager() {
  return (
    <ManusStyleInjectionPage
      config={{
        siteKey: 'leonardo',
        siteName: 'Leonardo.ai',
        siteTitle: 'LEONARDO.AI DEVICE MASTER',
        tagline: 'Geração de imagens com IA • app.leonardo.ai (login de criação, PT-BR)',
        siteUrl: 'https://app.leonardo.ai/auth/login',
        guide: MODULE_GUIDES['leonardo-ai'],
        accent: {
          text: 'text-emerald-400',
          border: 'border-emerald-400/30',
          bg: 'bg-emerald-400/20',
          gradientFrom: 'from-emerald-500/30',
          gradientTo: 'to-green-500/30',
          hex: '#34d399',
        },
        platform: 'universal',
        generateDevice: generateLeonardoDevice,
        buildScriptBody: (device, persona) => buildLeonardoScriptBody(device, persona),
        deviceInfo: (device) => [
          { label: 'LEO DEVICE ID', value: device.leoDeviceId, highlight: true },
          { label: 'LEO SESSION', value: device.leoSessionId, highlight: true },
          { label: 'LEO ANON ID', value: device.leoAnonId },
          { label: 'LEO UID', value: device.leoUid },
          { label: 'LEO PLAN', value: device.leoPlan },
          { label: 'MAC ADDRESS', value: device.macAddress },
          { label: 'IMEI', value: device.imei },
          { label: 'ANDROID ID', value: device.androidId },
        ],
      }}
    />
  );
}
