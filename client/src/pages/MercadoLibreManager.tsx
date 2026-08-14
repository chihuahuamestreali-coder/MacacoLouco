import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState, useEffect } from 'react';
import { generateMercadoLibreDeviceProfile, MercadoLibreDeviceProfile } from '@/lib/mercadolibreDeviceGenerator';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { generatePersonalData } from '@/lib/personalDataGenerator';
import { saveAccountRecord, getAccountHistory } from '@/lib/accountHistoryManager';
import { wrapInSiteScript } from '@/lib/inSiteInjection';
import InSitePanel from '@/components/InSitePanel';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, ShieldCheck, Smartphone, Sparkles, ArrowLeft, User, Eye, EyeOff, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function MercadoLibreManager() {
  const [, setLocation] = useLocation();
  const [device, setDevice] = useState<MercadoLibreDeviceProfile | null>(null);
  const [personalData, setPersonalData] = useState<ReturnType<typeof generatePersonalData> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPersona, setShowPersona] = useState(false);
  // Simulação de App Nativo — ATIVADA POR PADRÃO (pedido do usuário)
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);
  const [enableMLDeviceId, setEnableMLDeviceId] = useState(true);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setHistoryCount(getAccountHistory().filter((record) => record.notes?.includes('Mercado Livre')).length);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const newDev = generateMercadoLibreDeviceProfile();
    const newPerson = generatePersonalData();
    setDevice(newDev);
    setPersonalData(newPerson);
    saveAccountRecord({
      id: `ml_${Date.now()}`,
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
      behaviorConfig: { minDelay: 600, maxDelay: 2500, typingSpeed: 130 },
      notes: 'Mercado Livre — perfil técnico e persona gerados localmente',
    });
    setHistoryCount((count) => count + 1);
    setIsGenerating(false);
    toast.success('Novo perfil Mercado Livre gerado com dispositivo e persona!', {
      description: `${newDev.deviceName} • ${newPerson.email}`,
    });
  };

  const buildInSiteScript = (): string => {
    const antiDetectionCode = generateAdvancedAntiDetection();
    const appSimCode = simulateNativeApp
      ? generateNativeAppSimulationForProfile({ platform: 'mercadolibre', userAgent: device!.userAgent, imei: device!.imei })
      : '';
    const behaviorCode = enableHumanBehavior
      ? generateBehaviorInjectionScript({ minDelay: 600, maxDelay: 2500, minTypingSpeed: 70, maxTypingSpeed: 190, enableMouseMovement: true, enableScrolling: true })
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
      mlDeviceId: device!.mlDeviceId,
      mlDeviceInfo: device!.mlDeviceInfo,
      mlTrackingId: device!.mlTrackingId,
    }).replace(/"/g, '\\"');

    const enabledFeatures = [
      'Motor Anti-Detecção 16+',
      ...(simulateNativeApp ? ['Simulação App Mercado Livre (WebView Marketplace)'] : []),
      ...(enableMLDeviceId ? ['Device ID & Tracking ML Blindados'] : []),
      ...(enableHumanBehavior ? ['Comportamento Humano Realista'] : []),
    ];

    const body = `
      // 1. Motor Anti-Detecção 16+
      ${antiDetectionCode}

      ${simulateNativeApp ? `// 2. SIMULAÇÃO DE APP NATIVO — WebView Mercado Livre e Bridge\n${appSimCode}` : '// 2. Simulação de app nativo DESATIVADA'}

      ${enableHumanBehavior ? `// 3. Comportamento humano simulado\n${behaviorCode}` : '// 3. Comportamento humano DESATIVADO'}

      // 4. Injeção de identidade ML (NO DOMÍNIO REAL)
      const profile = JSON.parse("${profileJson}");
      localStorage.setItem('ml_device_profile', JSON.stringify(profile));
      localStorage.setItem('_device_fingerprint', profile.fingerprint);
      localStorage.setItem('_device_model', profile.model);
      localStorage.setItem('_device_mac', profile.macAddress);
      localStorage.setItem('_device_imei', profile.imei);
      localStorage.setItem('_ml_device_id', profile.mlDeviceId);
      localStorage.setItem('_ml_tracking_id', profile.mlTrackingId);
    `;

    return wrapInSiteScript('Mercado Livre', body, enabledFeatures, '#ffe600');
  };

  const handleAfterCopy = () => {
    saveAccountRecord({
      id: `ml_${Date.now()}`,
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
      behaviorConfig: { minDelay: 600, maxDelay: 2500, typingSpeed: 130 },
      notes: 'Mercado Livre — script in-site copiado para injeção manual',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-yellow-400/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-1">
              <ShoppingCart className="w-4 h-4" />
              <span>Marketplace LATAM & Anti-Fraude ML</span>
            </div>
            <h1 className="text-3xl font-extrabold text-yellow-300">MERCADO LIVRE DEVICE MASTER</h1>
            <p className="text-sm text-muted-foreground">Suite anti-detecção avançada para Mercado Livre com simulação de app nativo e blindagem de Device ID</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['mercadolibre']} accentClass="text-yellow-200" />

        <div className="grid gap-6 mt-8">
          <div className="border border-yellow-400/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-yellow-200 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Gerar Perfil Técnico + Persona Mercado Livre
            </h2>
            <p className="text-xs text-muted-foreground mb-2">Histórico local Mercado Livre: <span className="text-yellow-300 font-bold">{historyCount} perfil(is)</span></p>
            <p className="text-xs text-muted-foreground mb-4">
              Gera um dispositivo móvel realista com IMEI, MAC, Android ID, Device ID do ML e uma persona sintética completa para a tela de cadastro.
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold px-6 py-2.5">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Gerar Perfil Mercado Livre
            </Button>

            {device && (
              <div className="mt-6 p-4 rounded-xl bg-background/80 border border-yellow-400/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground">Dispositivo:</span> <span className="font-bold text-yellow-300">{device.deviceName} ({device.model})</span></div>
                <div><span className="text-muted-foreground">IMEI:</span> <span className="font-mono text-slate-200">{device.imei}</span></div>
                <div><span className="text-muted-foreground">MAC Address:</span> <span className="font-mono text-slate-200">{device.macAddress}</span></div>
                <div><span className="text-muted-foreground">ML Device ID:</span> <span className="font-mono text-slate-200">{device.mlDeviceId}</span></div>
                <div><span className="text-muted-foreground">Fingerprint:</span> <span className="font-mono text-slate-200">{device.fingerprint}</span></div>
                <div><span className="text-muted-foreground">ML Tracking ID:</span> <span className="font-mono text-slate-200">{device.mlTrackingId}</span></div>
                <div className="md:col-span-2"><span className="text-muted-foreground">User-Agent:</span> <div className="p-2 mt-1 rounded bg-slate-950 font-mono text-[11px] text-yellow-200 break-all">{device.userAgent}</div></div>
              </div>
            )}

            {personalData && (
              <div className="mt-4 p-4 rounded-xl bg-background/80 border border-yellow-400/20 relative text-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-yellow-200 flex items-center gap-2">
                    <User className="w-4 h-4" /> Persona Sintética para Cadastro
                  </h3>
                  <Button variant="ghost" size="sm" className="h-7 text-yellow-300 hover:bg-yellow-400/10" onClick={() => setShowPersona(!showPersona)}>
                    {showPersona ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                    {showPersona ? 'Ocultar' : 'Revelar'}
                  </Button>
                </div>
                {showPersona ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><span className="text-muted-foreground">Nome:</span> <span className="font-bold text-yellow-200">{personalData.fullName}</span></div>
                    <div><span className="text-muted-foreground">Email:</span> <span className="font-mono text-slate-200">{personalData.email}</span></div>
                    <div><span className="text-muted-foreground">Telefone:</span> <span className="font-mono text-slate-200">{personalData.phone}</span></div>
                    <div><span className="text-muted-foreground">Nascimento:</span> <span className="text-slate-200">{personalData.birthDate}</span></div>
                    <div><span className="text-muted-foreground">CPF:</span> <span className="font-mono text-slate-200">{personalData.cpf}</span></div>
                    <div><span className="text-muted-foreground">Cidade/UF:</span> <span className="text-slate-200">{personalData.city} / {personalData.state}</span></div>
                    <div className="md:col-span-2"><span className="text-muted-foreground">Endereço:</span> <span className="text-slate-200">{personalData.address.street}, {personalData.address.number} — {personalData.address.neighborhood}, {personalData.zipCode}</span></div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Clique em "Revelar" para ver a persona sintética gerada (dados fictícios de teste).</p>
                )}
              </div>
            )}
          </div>

          <div className="border border-yellow-400/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-yellow-200 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-yellow-300" />
              2. Módulos de Proteção & Simulação de App
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="ml-native" checked={simulateNativeApp} onCheckedChange={(c) => setSimulateNativeApp(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="ml-native" className="text-sm font-bold text-yellow-100 cursor-pointer">
                    Simulação de App Nativo Mercado Livre (WebView Marketplace & Bridge)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Injeta objetos globais <code className="text-yellow-300">MLBridge</code> e propriedades de app móvel para contornar a detecção "navegador vs app nativo".
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="ml-deviceid" checked={enableMLDeviceId} onCheckedChange={(c) => setEnableMLDeviceId(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="ml-deviceid" className="text-sm font-bold text-yellow-100 cursor-pointer">
                    Device ID & Tracking do ML Blindados (ml-device & ML Tracking)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Injeta um Device ID e Tracking ID sintéticos persistentes para manter consistência de sessão e evitar repetição de fingerprint entre perfis.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="ml-human" checked={enableHumanBehavior} onCheckedChange={(c) => setEnableHumanBehavior(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="ml-human" className="text-sm font-bold text-yellow-100 cursor-pointer">
                    Simulação de Comportamento Humano (Delays, Mouse & Scroll)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Emula micro-movimentos e cadência natural para evitar bloqueios comportamentais do anti-bot do Mercado Livre.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-yellow-400/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-yellow-200 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              3. Injeção In-Site
            </h2>
            <InSitePanel
              siteName="Mercado Livre"
              siteUrl="https://www.mercadolivre.com.br"
              accentText="text-yellow-300"
              accentHex="#ffe600"
              disabled={!device}
              features={[
                'Motor Anti-Detecção 16+',
                ...(simulateNativeApp ? ['Simulação App Mercado Livre'] : []),
                ...(enableMLDeviceId ? ['Device ID & Tracking ML'] : []),
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
