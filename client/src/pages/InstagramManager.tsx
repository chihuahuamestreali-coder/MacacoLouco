import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState, useEffect } from 'react';
import { UniversalDeviceProfile, generateUniversalDevice } from '@/lib/universalDeviceGenerator';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { generatePersonalData } from '@/lib/personalDataGenerator';
import { saveAccountRecord, getAccountHistory } from '@/lib/accountHistoryManager';
import { wrapInSiteScript } from '@/lib/inSiteInjection';
import InSitePanel from '@/components/InSitePanel';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Zap, Loader2, Smartphone, User, ShieldCheck, Sparkles, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function InstagramManager() {
  const [, setLocation] = useLocation();
  const [device, setDevice] = useState<UniversalDeviceProfile | null>(null);
  const [personalData, setPersonalData] = useState<ReturnType<typeof generatePersonalData> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPersona, setShowPersona] = useState(false);
  // Simulação de App Nativo — ATIVADA POR PADRÃO
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setHistoryCount(getAccountHistory().filter((record) => record.notes?.includes('Instagram')).length);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const newDev = generateUniversalDevice('instagram');
    const newPerson = generatePersonalData();
    setDevice(newDev);
    setPersonalData(newPerson);
    saveAccountRecord({
      id: `ig_${Date.now()}`,
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
      behaviorConfig: { minDelay: 600, maxDelay: 2600, typingSpeed: 130 },
      notes: 'Instagram — perfil técnico e persona gerados localmente',
    });
    setHistoryCount((count) => count + 1);
    setIsGenerating(false);
    toast.success('Novo dispositivo Instagram gerado com app nativo simulado!', {
      description: `${newDev.deviceName} • ${newPerson.email}`,
    });
  };

  const buildInSiteScript = (): string => {
    const appSimCode = simulateNativeApp
      ? generateNativeAppSimulationForProfile({ platform: 'instagram', userAgent: device!.userAgent, imei: device!.imei })
      : '';
    const antiDetectionCode = generateAdvancedAntiDetection();
    const behaviorCode = enableHumanBehavior
      ? generateBehaviorInjectionScript({ minDelay: 600, maxDelay: 2600, minTypingSpeed: 70, maxTypingSpeed: 190, enableMouseMovement: true, enableScrolling: true })
      : '';

    const profileJson = JSON.stringify({
      macAddress: device!.macAddress,
      imei: device!.imei,
      androidId: device!.androidId,
      model: device!.model,
      manufacturer: device!.manufacturer,
      resolution: device!.resolution,
      fingerprint: device!.fingerprint,
      userAgent: device!.userAgent,
    }).replace(/"/g, '\\"');

    const enabledFeatures = [
      'Injeção de Device',
      ...(simulateNativeApp ? ['Simulação App Nativo (WebView Instagram)'] : []),
      ...(enableHumanBehavior ? ['Comportamento Humano'] : []),
      'Anti-Detecção Avançada 16+',
    ];

    const body = `
      // 1. Injeção de identidade + mock de navigator (NO DOMÍNIO REAL)
      const profile = JSON.parse("${profileJson}");
      localStorage.setItem('instagramDeviceProfile', JSON.stringify(profile));
      sessionStorage.setItem('instagramSession', '${device!.sessionId}');
      localStorage.setItem('_device_fingerprint', profile.fingerprint);
      localStorage.setItem('_device_mac', profile.macAddress);
      localStorage.setItem('_device_imei', profile.imei);

      try {
        Object.defineProperty(navigator, 'userAgent', { get: function() { return "${device!.userAgent}"; }, configurable: true });
        Object.defineProperty(navigator, 'hardwareConcurrency', { get: function() { return 8; }, configurable: true });
        Object.defineProperty(navigator, 'deviceMemory', { get: function() { return 8; }, configurable: true });
      } catch(e) {}

      // 2. SIMULAÇÃO DE APP NATIVO — WebView do Instagram
      ${simulateNativeApp ? appSimCode : '// Simulação de app nativo DESATIVADA (modo navegador)'}

      // 3. Motor anti-detecção avançado (Canvas, WebGL, Audio, Battery, etc.)
      ${antiDetectionCode}

      // 4. Comportamento humano simulado
      ${enableHumanBehavior ? behaviorCode : '// Comportamento humano DESATIVADO'}
    `;

    return wrapInSiteScript('Instagram', body, enabledFeatures, '#ec4899');
  };

  const handleAfterCopy = () => {
    saveAccountRecord({
      id: `ig_${Date.now()}`,
      email: personalData!.email,
      createdAt: new Date(),
      status: 'pending',
      deviceFingerprint: device!.fingerprint,
      userAgent: device!.userAgent,
      personalData: {
        name: personalData!.fullName,
        phone: personalData!.phone,
        birthDate: personalData!.birthDate,
        city: personalData!.city,
        state: personalData!.state,
      },
      behaviorConfig: { minDelay: 600, maxDelay: 2600, typingSpeed: 130 },
      notes: 'Instagram — script in-site copiado para injeção manual',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-pink-500/30 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-pink-400">INSTAGRAM DEVICE MANAGER</h1>
            <p className="text-sm text-muted-foreground">Injeção in-site, app nativo simulado, anti-detecção e persona para cadastro</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-pink-500/50 text-pink-400">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['instagram']} accentClass="text-pink-300" />

        <div className="grid gap-6 mt-8">
          <div className="border border-pink-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-pink-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Gerar Dispositivo & Persona
            </h2>
            <p className="text-xs text-muted-foreground mb-2">Histórico local Instagram: <span className="text-pink-400 font-bold">{historyCount} perfil(is)</span></p>
            <p className="text-xs text-muted-foreground mb-4">
              Gera um dispositivo móvel realista (MAC, IMEI, Android ID) e uma persona sintética para a tela de cadastro.
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2.5">
              {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
              Gerar Dispositivo Instagram
            </Button>

            {device && (
              <div className="mt-6 p-4 rounded-xl bg-background/80 border border-pink-500/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground">Dispositivo:</span> <span className="font-bold text-pink-300">{device.deviceName} ({device.model})</span></div>
                <div><span className="text-muted-foreground">IMEI:</span> <span className="font-mono text-slate-200">{device.imei}</span></div>
                <div><span className="text-muted-foreground">MAC:</span> <span className="font-mono text-slate-200">{device.macAddress}</span></div>
                <div><span className="text-muted-foreground">Android ID:</span> <span className="font-mono text-slate-200">{device.androidId}</span></div>
                <div className="md:col-span-2"><span className="text-muted-foreground">User-Agent:</span> <div className="p-2 mt-1 rounded bg-slate-950 font-mono text-[11px] text-pink-300 break-all">{device.userAgent}</div></div>
              </div>
            )}

            {personalData && (
              <div className="mt-4 p-4 rounded-xl bg-background/80 border border-pink-500/20 relative text-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-pink-400 flex items-center gap-2">
                    <User className="w-4 h-4" /> Persona Sintética para Cadastro
                  </h3>
                  <Button variant="ghost" size="sm" className="h-7 text-pink-400 hover:bg-pink-600/10" onClick={() => setShowPersona(!showPersona)}>
                    {showPersona ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                    {showPersona ? 'Ocultar' : 'Revelar'}
                  </Button>
                </div>
                {showPersona ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><span className="text-muted-foreground">Nome:</span> <span className="font-bold text-pink-200">{personalData.fullName}</span></div>
                    <div><span className="text-muted-foreground">Email:</span> <span className="font-mono text-slate-200">{personalData.email}</span></div>
                    <div><span className="text-muted-foreground">Telefone:</span> <span className="font-mono text-slate-200">{personalData.phone}</span></div>
                    <div><span className="text-muted-foreground">Nascimento:</span> <span className="text-slate-200">{personalData.birthDate}</span></div>
                    <div><span className="text-muted-foreground">CPF:</span> <span className="font-mono text-slate-200">{personalData.cpf}</span></div>
                    <div><span className="text-muted-foreground">Cidade/UF:</span> <span className="text-slate-200">{personalData.city} / {personalData.state}</span></div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Clique em "Revelar" para ver a persona sintética gerada (dados fictícios de teste).</p>
                )}
              </div>
            )}
          </div>

          <div className="border border-pink-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-pink-300 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-pink-400" />
              2. Módulos de Proteção (ativados por padrão)
            </h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3 border border-purple-500/40 rounded-md p-4 bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors">
                <Checkbox checked={simulateNativeApp} onCheckedChange={(checked) => setSimulateNativeApp(checked as boolean)} className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-purple-300">
                    <Smartphone className="w-4 h-4" />
                    Simulação de App Nativo (WebView Instagram)
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Injeta <code>window.InstagramWebView</code>, flags <code>isWebview</code> e bridge <code>ReactNativeWebView</code>.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 border border-cyan-500/40 rounded-md p-4 bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors">
                <Checkbox checked={enableHumanBehavior} onCheckedChange={(checked) => setEnableHumanBehavior(checked as boolean)} className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-cyan-300">
                    <User className="w-4 h-4" />
                    Simulação de Comportamento Humano
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Executa scrolls e movimentos de mouse aleatórios na sessão.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="border border-pink-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-pink-300 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              3. Injeção In-Site
            </h2>
            <InSitePanel
              siteName="Instagram"
              siteUrl="https://www.instagram.com/accounts/emailsignup/"
              accentText="text-pink-400"
              accentHex="#ec4899"
              disabled={!device}
              features={[
                'Injeção de Device',
                ...(simulateNativeApp ? ['Simulação App Nativo'] : []),
                ...(enableHumanBehavior ? ['Comportamento Humano'] : []),
                'Anti-Detecção 16+',
              ]}
              buildScript={buildInSiteScript}
              onAfterCopy={handleAfterCopy}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
