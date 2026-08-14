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
import { Zap, Loader2, ShieldCheck, Smartphone, User, Sparkles, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function AliExpressManager() {
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
    setHistoryCount(getAccountHistory().filter((record) => record.notes?.includes('AliExpress')).length);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const newDev = generateUniversalDevice('aliexpress');
    const newPerson = generatePersonalData();
    setDevice(newDev);
    setPersonalData(newPerson);
    saveAccountRecord({
      id: `al_${Date.now()}`,
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
      notes: 'AliExpress — perfil técnico e persona gerados localmente',
    });
    setHistoryCount((count) => count + 1);
    setIsGenerating(false);
    toast.success('Novo dispositivo AliExpress gerado com 16+ ferramentas!', {
      description: `${newDev.deviceName} • ${newPerson.email}`,
    });
  };

  const buildInSiteScript = (): string => {
    const antiDetectionCode = generateAdvancedAntiDetection();
    const appSimCode = simulateNativeApp
      ? generateNativeAppSimulationForProfile({ platform: 'aliexpress', userAgent: device!.userAgent, imei: device!.imei })
      : '';
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
      'Motor Anti-Detecção 16+',
      ...(simulateNativeApp ? ['Simulação App Nativo (WebView)'] : []),
      ...(enableHumanBehavior ? ['Comportamento Humano'] : []),
    ];

    const body = `
      // 1. Motor Anti-Detecção 16+
      ${antiDetectionCode}

      ${simulateNativeApp ? `// 2. SIMULAÇÃO DE APP NATIVO — WebView do AliExpress\n${appSimCode}` : '// 2. Simulação de app nativo DESATIVADA'}

      ${enableHumanBehavior ? `// 3. Comportamento humano simulado\n${behaviorCode}` : '// 3. Comportamento humano DESATIVADO'}

      // 4. Injeção de identidade (NO DOMÍNIO REAL)
      const profile = JSON.parse("${profileJson}");
      localStorage.setItem('device_profile', JSON.stringify(profile));
      localStorage.setItem('_device_fingerprint', profile.fingerprint);
      localStorage.setItem('_device_model', profile.model);
      localStorage.setItem('_device_mac', profile.macAddress);
      localStorage.setItem('_device_imei', profile.imei);
      localStorage.setItem('_device_android_id', profile.androidId);
    `;

    return wrapInSiteScript('AliExpress', body, enabledFeatures, '#22c55e');
  };

  const handleAfterCopy = () => {
    saveAccountRecord({
      id: `al_${Date.now()}`,
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
      notes: 'AliExpress — script in-site copiado para injeção manual',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-red-500/30 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-red-400">ALIEXPRESS MASTER (BLINDAGEM 16+)</h1>
            <p className="text-sm text-muted-foreground">Injeção in-site, app nativo simulado, hardware fake e persona para cadastro</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-red-500/50 text-red-400">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['aliexpress']} accentClass="text-red-300" />

        <div className="grid gap-6 mt-8">
          <div className="border border-red-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-red-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Gerar Dispositivo & Persona
            </h2>
            <p className="text-xs text-muted-foreground mb-2">Histórico local AliExpress: <span className="text-red-400 font-bold">{historyCount} perfil(is)</span></p>
            <p className="text-xs text-muted-foreground mb-4">
              Gera um dispositivo móvel realista (MAC, IMEI, Android ID) e uma persona sintética completa para a tela de cadastro.
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5">
              {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
              Gerar Perfil Anti-Detecção
            </Button>

            {device && (
              <div className="mt-6 p-4 rounded-xl bg-background/80 border border-red-500/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground">Dispositivo:</span> <span className="font-bold text-red-300">{device.deviceName} ({device.model})</span></div>
                <div><span className="text-muted-foreground">IMEI:</span> <span className="font-mono text-slate-200">{device.imei}</span></div>
                <div><span className="text-muted-foreground">MAC:</span> <span className="font-mono text-slate-200">{device.macAddress}</span></div>
                <div><span className="text-muted-foreground">Android ID:</span> <span className="font-mono text-slate-200">{device.androidId}</span></div>
                <div><span className="text-muted-foreground">Fingerprint:</span> <span className="font-mono text-slate-200">{device.fingerprint}</span></div>
                <div><span className="text-emerald-400 font-semibold">✓ 16 Técnicas de Spoofing prontas.</span></div>
              </div>
            )}

            {personalData && (
              <div className="mt-4 p-4 rounded-xl bg-background/80 border border-red-500/20 relative text-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-red-400 flex items-center gap-2">
                    <User className="w-4 h-4" /> Persona Sintética para Cadastro
                  </h3>
                  <Button variant="ghost" size="sm" className="h-7 text-red-400 hover:bg-red-600/10" onClick={() => setShowPersona(!showPersona)}>
                    {showPersona ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                    {showPersona ? 'Ocultar' : 'Revelar'}
                  </Button>
                </div>
                {showPersona ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><span className="text-muted-foreground">Nome:</span> <span className="font-bold text-red-200">{personalData.fullName}</span></div>
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

          <div className="border border-red-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-red-300 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-red-400" />
              2. Módulos de Proteção (ativados por padrão)
            </h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3 border border-orange-500/40 rounded-md p-4 bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors">
                <Checkbox checked={simulateNativeApp} onCheckedChange={(checked) => setSimulateNativeApp(checked as boolean)} className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-orange-300">
                    <Smartphone className="w-4 h-4" />
                    Simulação de App Nativo (WebView AliExpress)
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Simula o ambiente do app AliExpress (WebView, SDK WindVane, UA de app).
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
                    Injeta delays, movimentos de mouse naturais e scroll progressivo na sessão.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="border border-red-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-red-300 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              3. Injeção In-Site
            </h2>
            <InSitePanel
              siteName="AliExpress"
              siteUrl="https://www.aliexpress.com"
              accentText="text-green-400"
              accentHex="#22c55e"
              disabled={!device}
              features={[
                'Motor Anti-Detecção 16+',
                ...(simulateNativeApp ? ['Simulação App Nativo'] : []),
                ...(enableHumanBehavior ? ['Comportamento Humano'] : []),
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
