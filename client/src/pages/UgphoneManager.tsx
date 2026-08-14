import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState, useEffect } from 'react';
import { generateUgphoneDeviceProfile, UgphoneDeviceProfile } from '@/lib/ugphoneDeviceGenerator';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { generatePersonalData } from '@/lib/personalDataGenerator';
import { saveAccountRecord, getAccountHistory } from '@/lib/accountHistoryManager';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Cloud, Play, Loader2, ShieldCheck, Smartphone, Sparkles, ArrowLeft, User, Eye, EyeOff, Cookie, Server } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function UgphoneManager() {
  const [, setLocation] = useLocation();
  const [device, setDevice] = useState<UgphoneDeviceProfile | null>(null);
  const [personalData, setPersonalData] = useState<ReturnType<typeof generatePersonalData> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [showPersona, setShowPersona] = useState(false);

  // Blindagem — todas ativadas por padrão
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);
  const [enableSessionShield, setEnableSessionShield] = useState(true);

  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setHistoryCount(getAccountHistory().filter((record) => record.notes?.includes('UGPhone')).length);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const newDev = generateUgphoneDeviceProfile();
    const newPerson = generatePersonalData();
    setDevice(newDev);
    setPersonalData(newPerson);
    saveAccountRecord({
      id: `ug_${Date.now()}`,
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
      notes: 'UGPhone — perfil técnico e persona gerados localmente',
    });
    setHistoryCount((count) => count + 1);
    setIsGenerating(false);
    toast.success('Novo perfil UGPhone gerado com identidade MAC!', {
      description: `${newDev.deviceName} • ${newDev.region} / ${newDev.plan}`,
    });
  };

  const handleInjectAndOpen = async () => {
    if (!device) {
      toast.error('Gere um perfil UGPhone primeiro!');
      return;
    }
    setIsInjecting(true);
    try {
      const win = window.open('', '_blank');
      if (!win) {
        toast.error('Pop-up bloqueado! Permita pop-ups no navegador.');
        setIsInjecting(false);
        return;
      }

      const antiDetectionCode = generateAdvancedAntiDetection();
      const appSimCode = simulateNativeApp
        ? generateNativeAppSimulationForProfile({ platform: 'ugphone', userAgent: device.userAgent, imei: device.imei })
        : '';
      const behaviorCode = enableHumanBehavior
        ? generateBehaviorInjectionScript({ minDelay: 600, maxDelay: 2500, minTypingSpeed: 70, maxTypingSpeed: 190, enableMouseMovement: true, enableScrolling: true })
        : '';

      const profileJson = JSON.stringify({
        macAddress: device.macAddress,
        imei: device.imei,
        androidId: device.androidId,
        model: device.model,
        manufacturer: device.manufacturer,
        resolution: device.resolution,
        fingerprint: device.fingerprint,
        userAgent: device.userAgent,
        ugphoneDeviceId: device.ugphoneDeviceId,
        sessionToken: device.sessionToken,
        region: device.region,
        plan: device.plan,
        locale: device.locale,
        timezone: device.timezone,
      }).replace(/"/g, '\\"');

      const cookiesJson = JSON.stringify(device.cookies).replace(/"/g, '\\"');

      const enabledFeatures = [
        'Motor Anti-Detecção 16+',
        ...(simulateNativeApp ? ['App Nativo UGPhone (Cloud Phone)'] : []),
        ...(enableSessionShield ? ['Sessão & Cookies Blindados'] : []),
        ...(enableHumanBehavior ? ['Comportamento Humano'] : []),
      ];

      const fullScript = `
        (function() {
          try {
            // 1. Motor Anti-Detecção 16+
            ${antiDetectionCode}

            ${simulateNativeApp ? `// 2. Simulação App Nativo UGPhone\n${appSimCode}` : '// 2. Simulação de app nativo DESATIVADA'}

            ${enableHumanBehavior ? `// 3. Comportamento humano\n${behaviorCode}` : ''}

            // 4. Injeção de Identidade + Sessão do Portal
            const profile = JSON.parse("${profileJson}");
            localStorage.setItem('ugphone_device_profile', JSON.stringify(profile));
            localStorage.setItem('_device_fingerprint', profile.fingerprint);
            localStorage.setItem('_device_model', profile.model);
            localStorage.setItem('_device_mac', profile.macAddress);
            localStorage.setItem('_device_imei', profile.imei);
            localStorage.setItem('_device_android_id', profile.androidId);
            localStorage.setItem('_ugphone_device_id', profile.ugphoneDeviceId);
            localStorage.setItem('_ugphone_session_token', profile.sessionToken);
            localStorage.setItem('_ugphone_region', profile.region);
            localStorage.setItem('_ugphone_plan', profile.plan);

            ${enableSessionShield ? `
              try {
                const cookies = JSON.parse("${cookiesJson}");
                Object.keys(cookies).forEach(function(key) {
                  localStorage.setItem('ugphone_' + key, cookies[key]);
                });
                document.cookie = 'device_id=' + cookies.device_id + '; path=/; max-age=31536000';
                document.cookie = 'session_token=' + cookies.session_token + '; path=/; max-age=31536000';
                document.cookie = 'region=' + cookies.region + '; path=/; max-age=31536000';
                document.cookie = 'plan=' + cookies.plan + '; path=/; max-age=31536000';
                document.cookie = 'locale=pt_BR; path=/; max-age=31536000';
                console.log('%c🍪 Sessão & Cookies UGPhone Injetados', 'color: #ff7f5b; font-weight: bold;');
              } catch(e) {}
            ` : ''}

            console.log('%c✓ UGPhone Device & ${enabledFeatures.length} Módulos Injetados com Sucesso!', 'color: #ff7f5b; font-weight: bold; font-size: 16px;');

            document.body.innerHTML = \`
              <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #0a0e27; font-family: monospace; color: #ff7f5b; font-size: 24px; text-align: center; padding: 20px;">
                <div>
                  <div style="font-size: 64px; margin-bottom: 20px;">☁️</div>
                  <div style="font-weight: bold; margin-bottom: 10px;">UGPHONE BLINDAGEM & APP SIMULATOR ATIVO!</div>
                  <div style="font-size: 14px; opacity: 0.8; margin-bottom: 20px;">${enabledFeatures.join(' • ')}<br/>Abrindo o portal de login/criação UGPhone...</div>
                </div>
              </div>
            \`;

            setTimeout(() => {
              window.location.href = 'https://www.ugphone.com/toc-portal/#/login';
            }, 1800);
          } catch(err) {
            console.error('Erro na injeção UGPhone:', err);
            document.body.innerHTML = '<div style="color: red; padding: 40px; font-family: monospace;">Erro ao injetar UGPhone: ' + err.message + '</div>';
          }
        })();
      `;

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Blindando UGPhone...</title>
          <style>
            body { margin: 0; padding: 0; background: #0a0e27; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; color: #ff7f5b; }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <div style="font-size: 48px;">☁️</div>
            <div style="margin-top: 20px; font-size: 18px; color: #ff7f5b;">Injetando UGPhone Device & Session Shield...</div>
          </div>
          <script>${fullScript}</script>
        </body>
        </html>
      `);
      win.document.close();
      toast.success('Injeção UGPhone disparada com sucesso!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao abrir aba de injeção UGPhone');
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-orange-600/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Cloud className="w-4 h-4" />
              <span>Cloud Phone & Gaming Portal UGPhone</span>
            </div>
            <h1 className="text-3xl font-extrabold text-orange-500">UGPHONE DEVICE MASTER</h1>
            <p className="text-sm text-muted-foreground">Nova identidade MAC/IMEI, sessão e cookies do portal, blindagem anti-bot e simulação de app nativo</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-orange-600/50 text-orange-500 hover:bg-orange-600/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['ugphone']} accentClass="text-orange-400" />

        <div className="grid gap-6 mt-8">
          <div className="border border-orange-600/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-orange-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Gerar Nova Identidade + Persona UGPhone
            </h2>
            <p className="text-xs text-muted-foreground mb-2">Histórico local UGPhone: <span className="text-orange-400 font-bold">{historyCount} perfil(is)</span></p>
            <p className="text-xs text-muted-foreground mb-4">
              Gera um dispositivo móvel realista com MAC, IMEI, Android ID, Device ID e sessão UGPhone, além de uma persona sintética completa para o portal de login/criação.
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Gerar Identidade UGPhone
            </Button>

            {device && (
              <div className="mt-6 p-4 rounded-xl bg-background/80 border border-orange-600/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground">Dispositivo:</span> <span className="font-bold text-orange-300">{device.deviceName} ({device.model})</span></div>
                <div><span className="text-muted-foreground">IMEI:</span> <span className="font-mono text-slate-200">{device.imei}</span></div>
                <div><span className="text-muted-foreground">MAC Address:</span> <span className="font-mono text-slate-200">{device.macAddress}</span></div>
                <div><span className="text-muted-foreground">Android ID:</span> <span className="font-mono text-slate-200">{device.androidId}</span></div>
                <div><span className="text-muted-foreground">UGPhone Device ID:</span> <span className="font-mono text-slate-200">{device.ugphoneDeviceId}</span></div>
                <div><span className="text-muted-foreground">Session Token:</span> <span className="font-mono text-slate-200">{device.sessionToken}</span></div>
                <div><span className="text-muted-foreground">Fingerprint:</span> <span className="font-mono text-slate-200">{device.fingerprint}</span></div>
                <div><span className="text-muted-foreground">Região / Plano:</span> <span className="text-emerald-400 font-bold">{device.region} • {device.plan}</span></div>
                <div className="md:col-span-2"><span className="text-muted-foreground">User-Agent:</span> <div className="p-2 mt-1 rounded bg-slate-950 font-mono text-[11px] text-orange-300 break-all">{device.userAgent}</div></div>
              </div>
            )}

            {personalData && (
              <div className="mt-4 p-4 rounded-xl bg-background/80 border border-orange-600/20 relative text-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-orange-400 flex items-center gap-2">
                    <User className="w-4 h-4" /> Persona Sintética para o Portal
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

          <div className="border border-orange-600/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-orange-400 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-orange-500" />
              2. Módulos de Blindagem & Injeção UGPhone
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="ug-native" checked={simulateNativeApp} onCheckedChange={(c) => setSimulateNativeApp(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="ug-native" className="text-sm font-bold text-orange-300 cursor-pointer">App Nativo Simulador</label>
                  <p className="text-[11px] text-muted-foreground">Injeta bridge do app ({'UgPhoneBridge'}) cloud phone.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="ug-session" checked={enableSessionShield} onCheckedChange={(c) => setEnableSessionShield(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="ug-session" className="text-sm font-bold text-orange-300 cursor-pointer">Sessão & Cookies Blindados</label>
                  <p className="text-[11px] text-muted-foreground">Injeta device_id, session_token, region e plan do portal.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="ug-human" checked={enableHumanBehavior} onCheckedChange={(c) => setEnableHumanBehavior(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="ug-human" className="text-sm font-bold text-orange-300 cursor-pointer">Comportamento Humano</label>
                  <p className="text-[11px] text-muted-foreground">Delays e movimentos anti-bot.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-orange-600/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Server className="w-4 h-4 text-orange-400" />
                {device ? '✓ Identidade pronta para abrir o portal de login/criação blindado.' : '⚠️ Gere uma identidade na etapa 1 antes de injetar.'}
              </div>
              <Button
                onClick={handleInjectAndOpen}
                disabled={!device || isInjecting}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                {isInjecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                Injetar & Abrir Portal UGPhone
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
