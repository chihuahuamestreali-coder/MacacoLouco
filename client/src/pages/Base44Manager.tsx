import ManusStyleInjectionPage from '@/components/ManusStyleInjectionPage';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { generateBase44Device, buildBase44ScriptBody } from '@/lib/base44DeviceGenerator';

export default function Base44Manager() {
  return (
    <ManusStyleInjectionPage
      config={{
        siteKey: 'base44',
        siteName: 'Base-44',
        siteTitle: 'BASE-44 DEVICE MASTER',
        tagline: 'Registro e criação de conta • app.base44.com/register',
        siteUrl: 'https://app.base44.com/register?from_url=https%3A%2F%2Fapp.base44.com%2F%3Flng%3Dpt%26utm_source%3Dgoogle%26utm_medium%3Dcpc%26gclid%3DEAIaIQobChMImdvm0qKflgMVIkBIAB2H2wUNEAAYAiAAEgKsBvD_BwE%26gad_campaignid%3D22787403330%26gbraid%3D0AAAAADwEfwWk_t0V5mS7UMPadRcKLEvZv&lng=pt',
        guide: MODULE_GUIDES['base44'],
        accent: {
          text: 'text-indigo-400',
          border: 'border-indigo-400/30',
          bg: 'bg-indigo-400/20',
          gradientFrom: 'from-indigo-500/30',
          gradientTo: 'to-blue-500/30',
          hex: '#818cf8',
        },
        platform: 'universal',
        generateDevice: generateBase44Device,
        buildScriptBody: (device, persona) => buildBase44ScriptBody(device, persona),
        deviceInfo: (device) => [
          { label: 'B44 DEVICE ID', value: device.b44DeviceId, highlight: true },
          { label: 'B44 SESSION', value: device.b44SessionId, highlight: true },
          { label: 'B44 FINGERPRINT', value: device.b44FingerprintId },
          { label: 'B44 REGISTRATION', value: device.b44RegistrationId },
          { label: 'MAC ADDRESS', value: device.macAddress },
          { label: 'IMEI', value: device.imei },
          { label: 'ANDROID ID', value: device.androidId },
        ],
      }}
    />
  );
}
