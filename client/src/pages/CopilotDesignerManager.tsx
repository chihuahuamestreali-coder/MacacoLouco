import ManusStyleInjectionPage from '@/components/ManusStyleInjectionPage';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { generateCopilotDesignerDevice, buildCopilotDesignerScriptBody } from '@/lib/copilotDesignerDeviceGenerator';

export default function CopilotDesignerManager() {
  return (
    <ManusStyleInjectionPage
      config={{
        siteKey: 'copilot-designer',
        siteName: 'Copilot Designer',
        siteTitle: 'COPILOT DESIGNER DEVICE MASTER',
        tagline: 'Criação de imagens com IA Microsoft • designer.microsoft.com (login de criação, PT-BR)',
        siteUrl: 'https://designer.microsoft.com/',
        guide: MODULE_GUIDES['copilot-designer'],
        accent: {
          text: 'text-blue-400',
          border: 'border-blue-400/30',
          bg: 'bg-blue-400/20',
          gradientFrom: 'from-blue-500/30',
          gradientTo: 'to-indigo-500/30',
          hex: '#60a5fa',
        },
        platform: 'universal',
        generateDevice: generateCopilotDesignerDevice,
        buildScriptBody: (device, persona) => buildCopilotDesignerScriptBody(device, persona),
        deviceInfo: (device) => [
          { label: 'CDP DEVICE ID', value: device.cdpDeviceId, highlight: true },
          { label: 'CDP SESSION', value: device.cdpSessionId, highlight: true },
          { label: 'CDP ANON ID', value: device.cdpAnonId },
          { label: 'CDP UID', value: device.cdpUid },
          { label: 'CDP MARKET', value: device.cdpMarket },
          { label: 'MAC ADDRESS', value: device.macAddress },
          { label: 'IMEI', value: device.imei },
          { label: 'ANDROID ID', value: device.androidId },
        ],
      }}
    />
  );
}
