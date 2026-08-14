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
import { ShoppingBag, Loader2, ShieldCheck, Smartphone, Sparkles, ArrowLeft, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function TemuManager() {
  const [, setLocation] = useLocation();
  const [device, setDevice] = useState<UniversalDeviceProfile | null>(null);
  const [personalData, setPersonalData] = useState<ReturnType<typeof generatePersonalData> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPersona, setShowPersona] = useState(false);
  // Simulação de App Nativo — ATIVADA POR PADRÃO
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);
  const [enableCouponBypass, setEnableCouponBypass] = useState(true);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setHistoryCount(getAccountHistory().filter((record) => record.notes?.includes('Temu')).length);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const newDev = generateUniversalDevice('temu');
    const newPerson = generatePersonalData();
    setDevice(newDev);
    setPersonalData(newPerson);
    saveAccountRecord({
      id: `temu_${Date.now()}`,
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
      notes: 'Temu — perfil técnico e persona gerados localmente',
    });
    setHistoryCount((count) => count + 1);
    setIsGenerating(false);
    toast.success('Novo perfil Temu gerado com simulação de app de compras e cupons!', {
      description: `${newDev.deviceName} • ${newPerson.email}`,
    });
  };

  const buildInSiteScript = (): string => {
    const antiDetectionCode = generateAdvancedAntiDetection();
    const appSimCode = simulateNativeApp
      ? generateNativeAppSimulationForProfile({ platform: 'temu', userAgent: device!.userAgent, imei: device!.imei })
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
    }).replace(/"/g, '\\"');

    const enabledFeatures = [
      'Motor Anti-Detecção 16+',
      ...(simulateNativeApp ? ['Simulação App Temu (WebView Shopping)'] : []),
      ...(enableCouponBypass ? ['Bypass de Cupons Novo Usuário'] : []),
      ...(enableHumanBehavior ? ['Comportamento Humano Realista'] : []),
    ];

    const body = `
      // 1. Motor Anti-Detecção 16+
      ${antiDetectionCode}

      ${simulateNativeApp ? `// 2. SIMULAÇÃO DE APP NATIVO — WebView Temu e Bridge\n${appSimCode}` : '// 2. Simulação de app nativo DESATIVADA'}

      ${enableCouponBypass ? `
        // 3. Injeção de cupons e flags de novo usuário Temu
        window.__TEMU_NEW_USER_PROMO__ = true;
        window.__TEMU_DISCOUNT_MULTIPLIER__ = 0.5;
        localStorage.setItem('temu_new_user', 'true');
        localStorage.setItem('temu_coupon_pack', 'ACTIVE_100_OFF');
      ` : ''}

      ${enableHumanBehavior ? `// 4. Comportamento humano simulado\n${behaviorCode}` : ''}

      // 5. Injeção de identidade (NO DOMÍNIO REAL)
      const profile = JSON.parse("${profileJson}");
      localStorage.setItem('temu_device_profile', JSON.stringify(profile));
      localStorage.setItem('_device_fingerprint', profile.fingerprint);
      localStorage.setItem('_device_mac', profile.macAddress);
      localStorage.setItem('_device_imei', profile.imei);
      localStorage.setItem('_device_android_id', profile.androidId);
    `;

    return wrapInSiteScript('Temu', body, enabledFeatures, '#ff6600');
  };

  const handleAfterCopy = () => {
    saveAccountRecord({
      id: `temu_${Date.now()}`,
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
      notes: 'Temu — script in-site copiado para injeção manual',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-orange-500/30 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-orange-400">TEMU DEVICE MASTER</h1>
            <p className="text-sm text-muted-foreground">Injeção in-site, simulação de app nativo e bypass de preços de aplicativo</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['temu']} accentClass="text-orange-300" />

        <div className="grid gap-6 mt-8">
          <div className="border border-orange-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-orange-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Gerar Perfil Técnico & Persona
            </h2>
            <p className="text-xs text-muted-foreground mb-2">Histórico local Temu: <span className="text-orange-300 font-bold">{historyCount} perfil(is)</span></p>
            <p className="text-xs text-muted-foreground mb-4">
              Gera um dispositivo móvel realista (IMEI, MAC, Android ID) e uma persona sintética para cadastro.
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Gerar Dispositivo Temu
            </Button>

            {device && (
              <div className="mt-6 p-4 rounded-xl bg-background/80 border border-orange-500/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground">Dispositivo:</span> <span className="font-bold text-orange-300">{device.deviceName} ({device.model})</span></div>
                <div><span className="text-muted-foreground">IMEI:</span> <span className="font-mono text-slate-200">{device.imei}</span></div>
                <div><span className="text-muted-foreground">MAC Address:</span> <span className="font-mono text-slate-200">{device.macAddress}</span></div>
                <div><span className="text-muted-foreground">Android ID:</span> <span className="font-mono text-slate-200">{device.androidId}</span></div>
                <div><span className="text-muted-foreground">Fingerprint:</span> <span className="font-mono text-slate-200">{device.fingerprint}</span></div>
              </div>
            )}

            {personalData && (
              <div className="mt-4 p-4 rounded-xl bg-background/80 border border-orange-500/20 relative text-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-orange-400 flex items-center gap-2">
                    <User className="w-4 h-4" /> Persona Sintética para Cadastro
                  </h3>
                  <Button variant="ghost" size="sm" className="h-7 text-orange-400 hover:bg-orange-600/10" onClick={() => setShowPersona(!showPersona)}>
                    {showPersona ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                    {showPersona ? 'Ocultar' : 'Revelar'}
                  </Button>
                </div>
                {showPersona ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><span className="text-muted-foreground">Nome:</span> <span className="font-bold text-orange-200">{personalData.fullName}</span></div>
                    <div><span className="text-muted-foreground">Email:</span> <span className="font-mono text-slate-200">{personalData.email}</span></div>
                    <div><span className="text-muted-foreground">Telefone:</span> <span className="font-mono text-slate-200">{personalData.phone}</span></div>
                    <div><span className="text-muted-foreground">CPF:</span> <span className="font-mono text-slate-200">{personalData.cpf}</span></div>
                    <div><span className="text-muted-foreground">Cidade/UF:</span> <span className="text-slate-200">{personalData.city} / {personalData.state}</span></div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Clique em "Revelar" para ver a persona sintética gerada (dados fictícios de teste).</p>
                )}
              </div>
            )}
          </div>

          <div className="border border-orange-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-orange-300 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-orange-400" />
              2. Módulos de Proteção & Simulação de App
            </h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="temu-native" checked={simulateNativeApp} onCheckedChange={(c) => setSimulateNativeApp(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="temu-native" className="text-sm font-bold text-orange-200 cursor-pointer">Simulação de App Nativo Temu (WebView Shopping & Bridge)</label>
                  <p className="text-xs text-muted-foreground">Injeta <code className="text-orange-400">TemuBridge</code> e propriedades de app móvel.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="temu-coupon" checked={enableCouponBypass} onCheckedChange={(c) => setEnableCouponBypass(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="temu-coupon" className="text-sm font-bold text-orange-200 cursor-pointer">Bypass de Cupons & Promoções de Novo Usuário</label>
                  <p className="text-xs text-muted-foreground">Injeta flags de primeiro acesso na sessão.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="temu-human" checked={enableHumanBehavior} onCheckedChange={(c) => setEnableHumanBehavior(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="temu-human" className="text-sm font-bold text-orange-200 cursor-pointer">Simulação de Comportamento Humano</label>
                  <p className="text-xs text-muted-foreground">Emula micro-movimentos e cadência natural.</p>
                </div>
              </label>
            </div>
          </div>

          <div className="border border-orange-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-orange-300 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-400" />
              3. Injeção In-Site
            </h2>
            <InSitePanel
              siteName="Temu"
              siteUrl="https://www.temu.com"
              accentText="text-orange-400"
              accentHex="#ff6600"
              disabled={!device}
              features={[
                'Motor Anti-Detecção 16+',
                ...(simulateNativeApp ? ['Simulação App Temu'] : []),
                ...(enableCouponBypass ? ['Bypass de Cupons'] : []),
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
