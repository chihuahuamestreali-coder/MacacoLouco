import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState, useEffect } from 'react';
import { generateSheinDeviceProfile, SheinDeviceProfile } from '@/lib/sheinDeviceGenerator';
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

export default function SheinManager() {
  const [, setLocation] = useLocation();
  const [device, setDevice] = useState<SheinDeviceProfile | null>(null);
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
    setHistoryCount(getAccountHistory().filter((record) => record.notes?.includes('SHEIN')).length);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const newDev = generateSheinDeviceProfile();
    const newPerson = generatePersonalData();
    setDevice(newDev);
    setPersonalData(newPerson);
    saveAccountRecord({
      id: `sh_${Date.now()}`,
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
      behaviorConfig: { minDelay: 550, maxDelay: 2300, typingSpeed: 135 },
      notes: 'SHEIN — perfil técnico e persona gerados localmente',
    });
    setHistoryCount((count) => count + 1);
    setIsGenerating(false);
    toast.success('Novo perfil SHEIN gerado com identidade MAC!', {
      description: `${newDev.deviceName} • ${newPerson.email}`,
    });
  };

  const handleInjectAndOpen = async () => {
    if (!device) {
      toast.error('Gere um perfil SHEIN primeiro!');
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
        ? generateNativeAppSimulationForProfile({ platform: 'shein', userAgent: device.userAgent, imei: device.imei })
        : '';
      const behaviorCode = enableHumanBehavior
        ? generateBehaviorInjectionScript({ minDelay: 550, maxDelay: 2300, minTypingSpeed: 70, maxTypingSpeed: 190, enableMouseMovement: true, enableScrolling: true })
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
        sheinDeviceId: device.sheinDeviceId,
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
        ...(simulateNativeApp ? ['App Nativo SHEIN (WebView Fashion)'] : []),
        ...(enableCookieShield ? ['Cookies & Sessão Blindados'] : []),
        ...(enableLocationSpoofing ? ['GPS Spoofing Ativo'] : []),
        ...(enableHumanBehavior ? ['Comportamento Humano'] : []),
      ];

      const fullScript = `
        (function() {
          try {
            // 1. Motor Anti-Detecção 16+
            ${antiDetectionCode}

            ${simulateNativeApp ? `// 2. Simulação App Nativo SHEIN\n${appSimCode}` : '// 2. Simulação de app nativo DESATIVADA'}

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
                console.log('%c📍 GPS Spoofing SHEIN Ativo: ' + loc.lat + ', ' + loc.lng, 'color: #e7114f; font-weight: bold;');
              } catch(e) {}
            ` : ''}

            // 5. Injeção de Identidade + Cookies de Sessão
            const profile = JSON.parse("${profileJson}");
            localStorage.setItem('shein_device_profile', JSON.stringify(profile));
            localStorage.setItem('_device_fingerprint', profile.fingerprint);
            localStorage.setItem('_device_model', profile.model);
            localStorage.setItem('_device_mac', profile.macAddress);
            localStorage.setItem('_device_imei', profile.imei);
            localStorage.setItem('_device_android_id', profile.androidId);
            localStorage.setItem('_shein_device_id', profile.sheinDeviceId);
            localStorage.setItem('_shein_sid', profile.sid);
            localStorage.setItem('_shein_country', profile.countryCode);
            localStorage.setItem('_shein_currency', profile.currency);

            ${enableCookieShield ? `
              try {
                const cookies = JSON.parse("${cookiesJson}");
                Object.keys(cookies).forEach(function(key) {
                  localStorage.setItem('shein_' + key, cookies[key]);
                });
                document.cookie = 'device_id=' + cookies.device_id + '; path=/; max-age=31536000';
                document.cookie = 'sid=' + cookies.sid + '; path=/; max-age=31536000';
                document.cookie = 'countryCode=BR; path=/; max-age=31536000';
                document.cookie = 'currency=BRL; path=/; max-age=31536000';
                console.log('%c🍪 Cookies de Sessão SHEIN Injetados', 'color: #e7114f; font-weight: bold;');
              } catch(e) {}
            ` : ''}

            console.log('%c✓ SHEIN Device & ${enabledFeatures.length} Módulos Injetados com Sucesso!', 'color: #e7114f; font-weight: bold; font-size: 16px;');

            document.body.innerHTML = \`
              <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #0a0e27; font-family: monospace; color: #e7114f; font-size: 24px; text-align: center; padding: 20px;">
                <div>
                  <div style="font-size: 64px; margin-bottom: 20px;">🛍️</div>
                  <div style="font-weight: bold; margin-bottom: 10px;">SHEIN BLINDAGEM & APP SIMULATOR ATIVO!</div>
                  <div style="font-size: 14px; opacity: 0.8; margin-bottom: 20px;">${enabledFeatures.join(' • ')}<br/>Redirecionando para a SHEIN...</div>
                </div>
              </div>
            \`;

            setTimeout(() => {
              window.location.href = 'https://br.shein.com';
            }, 1800);
          } catch(err) {
            console.error('Erro na injeção SHEIN:', err);
            document.body.innerHTML = '<div style="color: red; padding: 40px; font-family: monospace;">Erro ao injetar SHEIN: ' + err.message + '</div>';
          }
        })();
      `;

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Blindando SHEIN...</title>
          <style>
            body { margin: 0; padding: 0; background: #0a0e27; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; color: #e7114f; }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <div style="font-size: 48px;">🛍️</div>
            <div style="margin-top: 20px; font-size: 18px; color: #e7114f;">Injetando SHEIN Device & Cookie Shield...</div>
          </div>
          <script>${fullScript}</script>
        </body>
        </html>
      `);
      win.document.close();
      toast.success('Injeção SHEIN disparada com sucesso!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao abrir aba de injeção SHEIN');
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-fuchsia-600/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-fuchsia-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Shirt className="w-4 h-4" />
              <span>Fast Fashion & Anti-Bot SHEIN</span>
            </div>
            <h1 className="text-3xl font-extrabold text-fuchsia-500">SHEIN DEVICE MASTER</h1>
            <p className="text-sm text-muted-foreground">Nova identidade MAC/IMEI, cookies de sessão, blindagem anti-bot e simulação de app nativo</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-fuchsia-600/50 text-fuchsia-500 hover:bg-fuchsia-600/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['shein']} accentClass="text-fuchsia-400" />

        <div className="grid gap-6 mt-8">
          <div className="border border-fuchsia-600/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-fuchsia-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Gerar Nova Identidade + Persona SHEIN
            </h2>
            <p className="text-xs text-muted-foreground mb-2">Histórico local SHEIN: <span className="text-fuchsia-400 font-bold">{historyCount} perfil(is)</span></p>
            <p className="text-xs text-muted-foreground mb-4">
              Gera um dispositivo móvel realista com MAC, IMEI, Android ID, Device ID e sessão SHEIN, além de uma persona sintética completa para a tela de cadastro.
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold px-6 py-2.5">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Gerar Identidade SHEIN
            </Button>

            {device && (
              <div className="mt-6 p-4 rounded-xl bg-background/80 border border-fuchsia-600/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground">Dispositivo:</span> <span className="font-bold text-fuchsia-300">{device.deviceName} ({device.model})</span></div>
                <div><span className="text-muted-foreground">IMEI:</span> <span className="font-mono text-slate-200">{device.imei}</span></div>
                <div><span className="text-muted-foreground">MAC Address:</span> <span className="font-mono text-slate-200">{device.macAddress}</span></div>
                <div><span className="text-muted-foreground">Android ID:</span> <span className="font-mono text-slate-200">{device.androidId}</span></div>
                <div><span className="text-muted-foreground">SHEIN Device ID:</span> <span className="font-mono text-slate-200">{device.sheinDeviceId}</span></div>
                <div><span className="text-muted-foreground">SID:</span> <span className="font-mono text-slate-200">{device.sid}</span></div>
                <div><span className="text-muted-foreground">Fingerprint:</span> <span className="font-mono text-slate-200">{device.fingerprint}</span></div>
                <div><span className="text-muted-foreground">Geo:</span> <span className="text-emerald-400 font-bold">{device.location.lat.toFixed(4)}, {device.location.lng.toFixed(4)} (Precisão: {device.location.accuracy}m)</span></div>
                <div><span className="text-muted-foreground">Locale:</span> <span className="text-slate-200">{device.locale} • {device.countryCode} • {device.currency}</span></div>
                <div className="md:col-span-2"><span className="text-muted-foreground">User-Agent:</span> <div className="p-2 mt-1 rounded bg-slate-950 font-mono text-[11px] text-fuchsia-300 break-all">{device.userAgent}</div></div>
              </div>
            )}

            {personalData && (
              <div className="mt-4 p-4 rounded-xl bg-background/80 border border-fuchsia-600/20 relative text-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-fuchsia-400 flex items-center gap-2">
                    <User className="w-4 h-4" /> Persona Sintética para Cadastro
                  </h3>
                  <Button variant="ghost" size="sm" className="h-7 text-fuchsia-400 hover:bg-fuchsia-600/10" onClick={() => setShowPersona(!showPersona)}>
                    {showPersona ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                    {showPersona ? 'Ocultar' : 'Revelar'}
                  </Button>
                </div>
                {showPersona ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><span className="text-muted-foreground">Nome:</span> <span className="font-bold text-fuchsia-200">{personalData.fullName}</span></div>
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

          <div className="border border-fuchsia-600/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-fuchsia-400 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-fuchsia-500" />
              2. Módulos de Blindagem & Injeção SHEIN
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="sh-native" checked={simulateNativeApp} onCheckedChange={(c) => setSimulateNativeApp(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="sh-native" className="text-sm font-bold text-fuchsia-300 cursor-pointer">App Nativo Simulador</label>
                  <p className="text-[11px] text-muted-foreground">Injeta bridge do app ({'SheinBridge'}).</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="sh-gps" checked={enableLocationSpoofing} onCheckedChange={(c) => setEnableLocationSpoofing(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="sh-gps" className="text-sm font-bold text-fuchsia-300 cursor-pointer">GPS Spoofing</label>
                  <p className="text-[11px] text-muted-foreground">Força coordenadas em capitais brasileiras.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="sh-cookies" checked={enableCookieShield} onCheckedChange={(c) => setEnableCookieShield(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="sh-cookies" className="text-sm font-bold text-fuchsia-300 cursor-pointer">Cookies & Sessão Blindados</label>
                  <p className="text-[11px] text-muted-foreground">Injeta device_id, sid e cookies de país/moeda.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="sh-human" checked={enableHumanBehavior} onCheckedChange={(c) => setEnableHumanBehavior(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="sh-human" className="text-sm font-bold text-fuchsia-300 cursor-pointer">Comportamento Humano</label>
                  <p className="text-[11px] text-muted-foreground">Delays e movimentos anti-bot.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-fuchsia-600/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Cookie className="w-4 h-4 text-fuchsia-400" />
                {device ? '✓ Identidade pronta para injeção de cookies e blindagem.' : '⚠️ Gere uma identidade na etapa 1 antes de injetar.'}
              </div>
              <Button
                onClick={handleInjectAndOpen}
                disabled={!device || isInjecting}
                className="w-full sm:w-auto bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                {isInjecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                Injetar & Abrir SHEIN com Blindagem
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
