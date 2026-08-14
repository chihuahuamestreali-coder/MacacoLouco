import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState, useEffect } from 'react';
import { generateDeliveryDeviceProfile, DeliveryDeviceProfile } from '@/lib/deliveryDeviceGenerator';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { generatePersonalData } from '@/lib/personalDataGenerator';
import { saveAccountRecord, getAccountHistory } from '@/lib/accountHistoryManager';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Utensils, Play, Loader2, ShieldCheck, Smartphone, Sparkles, ArrowLeft, User, Eye, EyeOff, MapPin, Beer, Pizza } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

type DeliveryPlatform = 'ifood' | 'zedelivery';

const PLATFORM_CONFIG = {
  ifood: {
    name: 'iFood Master',
    url: 'https://www.ifood.com.br',
    color: '#ea1d2c',
    icon: Pizza,
    accent: 'text-red-500',
    border: 'border-red-500/30',
    bg: 'bg-red-500/10'
  },
  zedelivery: {
    name: 'Zé Delivery Master',
    url: 'https://www.ze.delivery',
    color: '#ffcc00',
    icon: Beer,
    accent: 'text-yellow-500',
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/10'
  }
};

export default function ScoobyDooHub() {
  const [, setLocation] = useLocation();
  const [activePlatform, setActivePlatform] = useState<DeliveryPlatform>('ifood');
  const [device, setDevice] = useState<DeliveryDeviceProfile | null>(null);
  const [personalData, setPersonalData] = useState<ReturnType<typeof generatePersonalData> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [showPersona, setShowPersona] = useState(false);
  
  // Opções de Blindagem
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);
  const [enableLocationSpoofing, setEnableLocationSpoofing] = useState(true);
  const [enableDeviceTokens, setEnableDeviceTokens] = useState(true);
  
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setHistoryCount(getAccountHistory().filter((record) => record.notes?.includes(PLATFORM_CONFIG[activePlatform].name)).length);
  }, [activePlatform]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const newDev = generateDeliveryDeviceProfile(activePlatform);
    const newPerson = generatePersonalData();
    setDevice(newDev);
    setPersonalData(newPerson);
    
    saveAccountRecord({
      id: `scooby_${activePlatform}_${Date.now()}`,
      email: newPerson.email,
      createdAt: new Date(),
      status: 'pending',
      deviceFingerprint: newDev.fingerprint,
      userAgent: newDev.userAgent,
      personalData: {
        name: newPerson.fullName,
        phone: newPerson.phone,
        birthDate: newPerson.birthDate,
        city: newPerson.city,
        state: newPerson.state,
      },
      behaviorConfig: { minDelay: 500, maxDelay: 2000, typingSpeed: 140 },
      notes: `${PLATFORM_CONFIG[activePlatform].name} — Hub Scooby-Doo`,
    });
    
    setHistoryCount((count) => count + 1);
    setIsGenerating(false);
    toast.success(`Perfil ${PLATFORM_CONFIG[activePlatform].name} gerado!`, {
      description: `${newDev.deviceName} • ${capitalCase(activePlatform)}`,
    });
  };

  const capitalCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const handleInjectAndOpen = async () => {
    if (!device) {
      toast.error('Gere um perfil primeiro!');
      return;
    }
    setIsInjecting(true);
    try {
      const win = window.open('', '_blank');
      if (!win) {
        toast.error('Pop-up bloqueado!');
        setIsInjecting(false);
        return;
      }

      const config = PLATFORM_CONFIG[activePlatform];
      const antiDetectionCode = generateAdvancedAntiDetection();
      const appSimCode = simulateNativeApp
        ? generateNativeAppSimulationForProfile({ platform: activePlatform, userAgent: device.userAgent, imei: device.imei })
        : '';
      const behaviorCode = enableHumanBehavior
        ? generateBehaviorInjectionScript({ minDelay: 500, maxDelay: 2000, minTypingSpeed: 80, maxTypingSpeed: 200, enableMouseMovement: true, enableScrolling: true })
        : '';

      const profileJson = JSON.stringify({
        imei: device.imei,
        androidId: device.androidId,
        fingerprint: device.fingerprint,
        userAgent: device.userAgent,
        location: device.location,
        tokens: device.deliveryTokens
      }).replace(/"/g, '\\"');

      const enabledFeatures = [
        'Motor Anti-Detecção 16+',
        ...(simulateNativeApp ? [`App Nativo ${config.name}`] : []),
        ...(enableLocationSpoofing ? ['GPS Spoofing Ativo'] : []),
        ...(enableDeviceTokens ? ['Device Tokens Blindados'] : []),
        ...(enableHumanBehavior ? ['Comportamento Humano'] : []),
      ];

      const fullScript = `
        (function() {
          try {
            // 1. Motor Anti-Detecção
            ${antiDetectionCode}

            // 2. Simulação App Nativo
            ${simulateNativeApp ? appSimCode : ''}

            // 3. Comportamento Humano
            ${enableHumanBehavior ? behaviorCode : ''}

            // 4. GPS Spoofing
            ${enableLocationSpoofing ? `
              try {
                const loc = { lat: ${device.location.lat}, lng: ${device.location.lng}, acc: ${device.location.accuracy} };
                navigator.geolocation.getCurrentPosition = function(success) {
                  success({
                    coords: {
                      latitude: loc.lat,
                      longitude: loc.lng,
                      accuracy: loc.acc,
                      altitude: null,
                      altitudeAccuracy: null,
                      heading: null,
                      speed: null
                    },
                    timestamp: Date.now()
                  });
                };
                console.log('%c📍 GPS Spoofing Ativo: ' + loc.lat + ', ' + loc.lng, 'color: ${config.color}; font-weight: bold;');
              } catch(e) {}
            ` : ''}

            // 5. Injeção de Identidade
            const profile = JSON.parse("${profileJson}");
            localStorage.setItem('${activePlatform}_device_profile', JSON.stringify(profile));
            localStorage.setItem('_device_imei', profile.imei);
            localStorage.setItem('_device_android_id', profile.androidId);
            
            ${enableDeviceTokens ? `
              localStorage.setItem('${activePlatform}_did', profile.tokens.deviceId);
              localStorage.setItem('${activePlatform}_sid', profile.tokens.sessionToken);
            ` : ''}

            console.log('%c✓ ${config.name} Injetado com Sucesso!', 'color: ${config.color}; font-weight: bold; font-size: 16px;');

            document.body.innerHTML = \`
              <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #070c1f; font-family: monospace; color: ${config.color}; font-size: 24px; text-align: center; padding: 20px;">
                <div>
                  <div style="font-size: 64px; margin-bottom: 20px;">🛵</div>
                  <div style="font-weight: bold; margin-bottom: 10px;">${config.name.toUpperCase()} BLINDAGEM ATIVA!</div>
                  <div style="font-size: 14px; opacity: 0.8; margin-bottom: 20px;">${enabledFeatures.join(' • ')}<br/>Redirecionando para ${config.name}...</div>
                </div>
              </div>
            \`;

            setTimeout(() => {
              window.location.href = '${config.url}';
            }, 1800);
          } catch(err) {
            console.error('Erro na injeção:', err);
            document.body.innerHTML = '<div style="color: red; padding: 40px; font-family: monospace;">Erro: ' + err.message + '</div>';
          }
        })();
      `;

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Blindando ${config.name}...</title>
          <style>
            body { margin: 0; padding: 0; background: #070c1f; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; color: ${config.color}; }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <div style="font-size: 48px;">🛵</div>
            <div style="margin-top: 20px; font-size: 18px;">Injetando Delivery Device & GPS Shield...</div>
          </div>
          <script>${fullScript}</script>
        </body>
        </html>
      `);
      win.document.close();
      toast.success(`${config.name} disparado!`);
    } catch (e) {
      toast.error('Erro ao abrir aba de injeção');
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-primary/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>Scooby-Doo Delivery Hub / Menu Mestre</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">SCOOBY-DOO HUB</h1>
            <p className="text-sm text-muted-foreground">Suite especializada em plataformas de delivery com bypass de geolocalização e anti-fraude</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['scooby-doo']} accentClass="text-primary" />

        {/* Submenu Selector */}
        <div className="grid grid-cols-2 gap-4 my-8">
          {(Object.keys(PLATFORM_CONFIG) as DeliveryPlatform[]).map((p) => {
            const cfg = PLATFORM_CONFIG[p];
            const Icon = cfg.icon;
            return (
              <button
                key={p}
                onClick={() => { setActivePlatform(p); setDevice(null); setPersonalData(null); }}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${activePlatform === p ? `${cfg.bg} ${cfg.border} ${cfg.accent} shadow-lg scale-105` : 'bg-card/40 border-border/60 text-muted-foreground hover:border-primary/40'}`}
              >
                <Icon className="w-8 h-8" />
                <span className="font-bold text-sm">{cfg.name}</span>
              </button>
            );
          })}
        </div>

        {/* Platform Content */}
        <div className="grid gap-6">
          <div className={`border ${PLATFORM_CONFIG[activePlatform].border} rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl`}>
            <h2 className={`text-xl font-bold mb-4 ${PLATFORM_CONFIG[activePlatform].accent} flex items-center gap-2`}>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Gerar Perfil & Geolocalização: {PLATFORM_CONFIG[activePlatform].name}
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Gera um dispositivo móvel, tokens de app e coordenadas GPS em capitais brasileiras para bypass de restrições de entrega.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Button onClick={handleGenerate} disabled={isGenerating} className={`${activePlatform === 'ifood' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-500 hover:bg-yellow-600 text-black'} font-bold px-6 py-2.5`}>
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Gerar Perfil {PLATFORM_CONFIG[activePlatform].name}
              </Button>
              <span className="text-xs text-muted-foreground">Histórico local: <span className="font-bold text-white">{historyCount}</span></span>
            </div>

            {device && (
              <div className="mt-6 p-4 rounded-xl bg-background/80 border border-border/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground">Device:</span> <span className="font-bold text-white">{device.deviceName}</span></div>
                <div><span className="text-muted-foreground">IMEI:</span> <span className="font-mono text-slate-300">{device.imei}</span></div>
                <div><span className="text-muted-foreground">Localização:</span> <span className="text-emerald-400 font-bold">{device.location.lat.toFixed(4)}, {device.location.lng.toFixed(4)} (Precisão: {device.location.accuracy}m)</span></div>
                <div><span className="text-muted-foreground">Device ID:</span> <span className="font-mono text-slate-300">{device.deliveryTokens.deviceId}</span></div>
                <div className="md:col-span-2"><span className="text-muted-foreground">User-Agent:</span> <div className="p-2 mt-1 rounded bg-slate-950 font-mono text-[10px] text-primary/80 break-all">{device.userAgent}</div></div>
              </div>
            )}
          </div>

          <div className={`border ${PLATFORM_CONFIG[activePlatform].border} rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl`}>
            <h2 className={`text-xl font-bold mb-4 ${PLATFORM_CONFIG[activePlatform].accent} flex items-center gap-2`}>
              <Smartphone className="w-5 h-5" />
              2. Módulos de Blindagem Scooby-Doo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="deliv-native" checked={simulateNativeApp} onCheckedChange={(c) => setSimulateNativeApp(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="deliv-native" className="text-sm font-bold cursor-pointer">App Nativo Simulador</label>
                  <p className="text-[11px] text-muted-foreground">Injeta bridge do app ({activePlatform}Bridge).</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="deliv-gps" checked={enableLocationSpoofing} onCheckedChange={(c) => setEnableLocationSpoofing(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="deliv-gps" className="text-sm font-bold cursor-pointer">GPS Spoofing / Raio de Entrega</label>
                  <p className="text-[11px] text-muted-foreground">Força coordenadas GPS na sessão.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="deliv-tokens" checked={enableDeviceTokens} onCheckedChange={(c) => setEnableDeviceTokens(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="deliv-tokens" className="text-sm font-bold cursor-pointer">Tokens de Device Blindados</label>
                  <p className="text-[11px] text-muted-foreground">IDs sintéticos persistentes.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="deliv-human" checked={enableHumanBehavior} onCheckedChange={(c) => setEnableHumanBehavior(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="deliv-human" className="text-sm font-bold cursor-pointer">Comportamento Humano</label>
                  <p className="text-[11px] text-muted-foreground">Delays e movimentos anti-bot.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {device ? '✓ Pronto para injeção segura.' : '⚠️ Gere um perfil para ativar a blindagem.'}
              </div>
              <Button
                onClick={handleInjectAndOpen}
                disabled={!device || isInjecting}
                className={`w-full sm:w-auto ${activePlatform === 'ifood' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-500 hover:bg-yellow-600 text-black'} font-bold px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2`}
              >
                {isInjecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                Injetar & Abrir {PLATFORM_CONFIG[activePlatform].name}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
