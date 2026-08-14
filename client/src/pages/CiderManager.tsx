import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState, useEffect } from 'react';
import { generateCiderDeviceProfile, CiderDeviceProfile } from '@/lib/ciderDeviceGenerator';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { generatePersonalData } from '@/lib/personalDataGenerator';
import { saveAccountRecord, getAccountHistory } from '@/lib/accountHistoryManager';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Shirt, Play, Loader2, ShieldCheck, Smartphone, Sparkles, ArrowLeft, User, Eye, EyeOff, MapPin, Cookie } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function CiderManager() {
  const [, setLocation] = useLocation();
  const [device, setDevice] = useState<CiderDeviceProfile | null>(null);
  const [personalData, setPersonalData] = useState<ReturnType<typeof generatePersonalData> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [showPersona, setShowPersona] = useState(false);

  // Blindagem — todas ativadas por padrão
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);
  const [enableLocationSpoofing, setEnableLocationSpoofing] = useState(true);
  const [enableCookieShield, setEnableCookieShield] = useState(true);

  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setHistoryCount(getAccountHistory().filter((record) => record.notes?.includes('Cider')).length);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const newDev = generateCiderDeviceProfile();
    const newPerson = generatePersonalData();
    setDevice(newDev);
    setPersonalData(newPerson);
    saveAccountRecord({
      id: `cd_${Date.now()}`,
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
      behaviorConfig: { minDelay: 600, maxDelay: 2400, typingSpeed: 128 },
      notes: 'Cider — perfil técnico e persona gerados localmente',
    });
    setHistoryCount((count) => count + 1);
    setIsGenerating(false);
    toast.success('Novo perfil Cider gerado com identidade MAC!', {
      description: `${newDev.deviceName} • ${newPerson.email}`,
    });
  };

  const handleInjectAndOpen = async () => {
    if (!device) {
      toast.error('Gere um perfil Cider primeiro!');
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
        ? generateNativeAppSimulationForProfile({ platform: 'cider', userAgent: device.userAgent, imei: device.imei })
        : '';
      const behaviorCode = enableHumanBehavior
        ? generateBehaviorInjectionScript({ minDelay: 600, maxDelay: 2400, minTypingSpeed: 70, maxTypingSpeed: 190, enableMouseMovement: true, enableScrolling: true })
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
        ciderDeviceId: device.ciderDeviceId,
        guestId: device.guestId,
        sid: device.sid,
        countryCode: device.countryCode,
        currency: device.currency,
        locale: device.locale,
        timezone: device.timezone,
        location: device.location,
      }).replace(/"/g, '\\"');

      const cookiesJson = JSON.stringify(device.cookies).replace(/"/g, '\\"');

      const enabledFeatures = [
        'Motor Anti-Detecção 16+',
        ...(simulateNativeApp ? ['App Nativo Cider (WebView Fashion)'] : []),
        ...(enableCookieShield ? ['Cookies & Sessão Blindados'] : []),
        ...(enableLocationSpoofing ? ['GPS Spoofing Ativo'] : []),
        ...(enableHumanBehavior ? ['Comportamento Humano'] : []),
      ];

      const fullScript = `
        (function() {
          try {
            // 1. Motor Anti-Detecção 16+
            ${antiDetectionCode}

            ${simulateNativeApp ? `// 2. Simulação App Nativo Cider\n${appSimCode}` : '// 2. Simulação de app nativo DESATIVADA'}

            ${enableHumanBehavior ? `// 3. Comportamento humano\n${behaviorCode}` : ''}

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
                console.log('%c📍 GPS Spoofing Cider Ativo: ' + loc.lat + ', ' + loc.lng, 'color: #8b5cf6; font-weight: bold;');
              } catch(e) {}
            ` : ''}

            // 5. Injeção de Identidade + Cookies de Sessão
            const profile = JSON.parse("${profileJson}");
            localStorage.setItem('cider_device_profile', JSON.stringify(profile));
            localStorage.setItem('_device_fingerprint', profile.fingerprint);
            localStorage.setItem('_device_model', profile.model);
            localStorage.setItem('_device_mac', profile.macAddress);
            localStorage.setItem('_device_imei', profile.imei);
            localStorage.setItem('_device_android_id', profile.androidId);
            localStorage.setItem('_cider_device_id', profile.ciderDeviceId);
            localStorage.setItem('_cider_guest_id', profile.guestId);
            localStorage.setItem('_cider_sid', profile.sid);

            ${enableCookieShield ? `
              try {
                const cookies = JSON.parse("${cookiesJson}");
                Object.keys(cookies).forEach(function(key) {
                  localStorage.setItem('cider_' + key, cookies[key]);
                });
                document.cookie = 'device_id=' + cookies.device_id + '; path=/; max-age=31536000';
                document.cookie = 'guest_id=' + cookies.guest_id + '; path=/; max-age=31536000';
                document.cookie = 'sid=' + cookies.sid + '; path=/; max-age=31536000';
                document.cookie = 'countryCode=BR; path=/; max-age=31536000';
                document.cookie = 'currency=BRL; path=/; max-age=31536000';
                console.log('%c🍪 Cookies de Sessão Cider Injetados', 'color: #8b5cf6; font-weight: bold;');
              } catch(e) {}
            ` : ''}

            console.log('%c✓ Cider Device & ${enabledFeatures.length} Módulos Injetados com Sucesso!', 'color: #8b5cf6; font-weight: bold; font-size: 16px;');

            document.body.innerHTML = \`
              <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #0a0e27; font-family: monospace; color: #8b5cf6; font-size: 24px; text-align: center; padding: 20px;">
                <div>
                  <div style="font-size: 64px; margin-bottom: 20px;">👗</div>
                  <div style="font-weight: bold; margin-bottom: 10px;">CIDER BLINDAGEM & APP SIMULATOR ATIVO!</div>
                  <div style="font-size: 14px; opacity: 0.8; margin-bottom: 20px;">${enabledFeatures.join(' • ')}<br/>Redirecionando para a Cider...</div>
                </div>
              </div>
            \`;

            setTimeout(() => {
              window.location.href = 'https://www.shopcider.com';
            }, 1800);
          } catch(err) {
            console.error('Erro na injeção Cider:', err);
            document.body.innerHTML = '<div style="color: red; padding: 40px; font-family: monospace;">Erro ao injetar Cider: ' + err.message + '</div>';
          }
        })();
      `;

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Blindando Cider...</title>
          <style>
            body { margin: 0; padding: 0; background: #0a0e27; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; color: #8b5cf6; }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <div style="font-size: 48px;">👗</div>
            <div style="margin-top: 20px; font-size: 18px; color: #8b5cf6;">Injetando Cider Device & Cookie Shield...</div>
          </div>
          <script>${fullScript}</script>
        </body>
        </html>
      `);
      win.document.close();
      toast.success('Injeção Cider disparada com sucesso!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao abrir aba de injeção Cider');
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-violet-600/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-violet-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Shirt className="w-4 h-4" />
              <span>Fast Fashion Global & Anti-Fraud Cider</span>
            </div>
            <h1 className="text-3xl font-extrabold text-violet-500">CIDER DEVICE MASTER</h1>
            <p className="text-sm text-muted-foreground">Nova identidade MAC/IMEI, cookies de sessão, blindagem anti-fraude e simulação de app nativo</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-violet-600/50 text-violet-500 hover:bg-violet-600/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['cider']} accentClass="text-violet-400" />

        <div className="grid gap-6 mt-8">
          <div className="border border-violet-600/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-violet-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Gerar Nova Identidade + Persona Cider
            </h2>
            <p className="text-xs text-muted-foreground mb-2">Histórico local Cider: <span className="text-violet-400 font-bold">{historyCount} perfil(is)</span></p>
            <p className="text-xs text-muted-foreground mb-4">
              Gera um dispositivo móvel realista com MAC, IMEI, Android ID, Device ID e sessão Cider, além de uma persona sintética completa para a tela de cadastro.
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-2.5">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Gerar Identidade Cider
            </Button>

            {device && (
              <div className="mt-6 p-4 rounded-xl bg-background/80 border border-violet-600/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground">Dispositivo:</span> <span className="font-bold text-violet-300">{device.deviceName} ({device.model})</span></div>
                <div><span className="text-muted-foreground">IMEI:</span> <span className="font-mono text-slate-200">{device.imei}</span></div>
                <div><span className="text-muted-foreground">MAC Address:</span> <span className="font-mono text-slate-200">{device.macAddress}</span></div>
                <div><span className="text-muted-foreground">Android ID:</span> <span className="font-mono text-slate-200">{device.androidId}</span></div>
                <div><span className="text-muted-foreground">Cider Device ID:</span> <span className="font-mono text-slate-200">{device.ciderDeviceId}</span></div>
                <div><span className="text-muted-foreground">Guest ID:</span> <span className="font-mono text-slate-200">{device.guestId}</span></div>
                <div><span className="text-muted-foreground">SID:</span> <span className="font-mono text-slate-200">{device.sid}</span></div>
                <div><span className="text-muted-foreground">Fingerprint:</span> <span className="font-mono text-slate-200">{device.fingerprint}</span></div>
                <div><span className="text-muted-foreground">Geo:</span> <span className="text-emerald-400 font-bold">{device.location.lat.toFixed(4)}, {device.location.lng.toFixed(4)} (Precisão: {device.location.accuracy}m)</span></div>
                <div><span className="text-muted-foreground">Locale:</span> <span className="text-slate-200">{device.locale} • {device.countryCode} • {device.currency}</span></div>
                <div className="md:col-span-2"><span className="text-muted-foreground">User-Agent:</span> <div className="p-2 mt-1 rounded bg-slate-950 font-mono text-[11px] text-violet-300 break-all">{device.userAgent}</div></div>
              </div>
            )}

            {personalData && (
              <div className="mt-4 p-4 rounded-xl bg-background/80 border border-violet-600/20 relative text-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-violet-400 flex items-center gap-2">
                    <User className="w-4 h-4" /> Persona Sintética para Cadastro
                  </h3>
                  <Button variant="ghost" size="sm" className="h-7 text-violet-400 hover:bg-violet-600/10" onClick={() => setShowPersona(!showPersona)}>
                    {showPersona ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                    {showPersona ? 'Ocultar' : 'Revelar'}
                  </Button>
                </div>
                {showPersona ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><span className="text-muted-foreground">Nome:</span> <span className="font-bold text-violet-200">{personalData.fullName}</span></div>
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

          <div className="border border-violet-600/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-violet-400 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-violet-500" />
              2. Módulos de Blindagem & Injeção Cider
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="cd-native" checked={simulateNativeApp} onCheckedChange={(c) => setSimulateNativeApp(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="cd-native" className="text-sm font-bold text-violet-300 cursor-pointer">App Nativo Simulador</label>
                  <p className="text-[11px] text-muted-foreground">Injeta bridge do app ({'CiderBridge'}).</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="cd-gps" checked={enableLocationSpoofing} onCheckedChange={(c) => setEnableLocationSpoofing(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="cd-gps" className="text-sm font-bold text-violet-300 cursor-pointer">GPS Spoofing</label>
                  <p className="text-[11px] text-muted-foreground">Força coordenadas em capitais brasileiras.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="cd-cookies" checked={enableCookieShield} onCheckedChange={(c) => setEnableCookieShield(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="cd-cookies" className="text-sm font-bold text-violet-300 cursor-pointer">Cookies & Sessão Blindados</label>
                  <p className="text-[11px] text-muted-foreground">Injeta device_id, guest_id, sid e cookies de país/moeda.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="cd-human" checked={enableHumanBehavior} onCheckedChange={(c) => setEnableHumanBehavior(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="cd-human" className="text-sm font-bold text-violet-300 cursor-pointer">Comportamento Humano</label>
                  <p className="text-[11px] text-muted-foreground">Delays e movimentos anti-bot.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-violet-600/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Cookie className="w-4 h-4 text-violet-400" />
                {device ? '✓ Identidade pronta para injeção de cookies e blindagem.' : '⚠️ Gere uma identidade na etapa 1 antes de injetar.'}
              </div>
              <Button
                onClick={handleInjectAndOpen}
                disabled={!device || isInjecting}
                className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                {isInjecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                Injetar & Abrir Cider com Blindagem
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
