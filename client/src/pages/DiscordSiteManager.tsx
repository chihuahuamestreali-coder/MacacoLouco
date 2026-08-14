import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState, useEffect } from 'react';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { generatePersonalData } from '@/lib/personalDataGenerator';
import { saveAccountRecord, getAccountHistory } from '@/lib/accountHistoryManager';
import { wrapInSiteScript } from '@/lib/inSiteInjection';
import InSitePanel from '@/components/InSitePanel';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MessageCircle, Loader2, ShieldCheck, Smartphone, Sparkles, ArrowLeft, User, Eye, EyeOff, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

const DISCORD_REGISTER_URL = 'https://discord.com/register';

export default function DiscordSiteManager() {
  const [, setLocation] = useLocation();
  const [personalData, setPersonalData] = useState<ReturnType<typeof generatePersonalData> | null>(null);
  const [device, setDevice] = useState<ReturnType<typeof buildDiscordDeviceProfile> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPersona, setShowPersona] = useState(false);
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);
  const [enableFingerprintShield, setEnableFingerprintShield] = useState(true);
  const [enableAntiBot, setEnableAntiBot] = useState(true);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setHistoryCount(getAccountHistory().filter((record) => record.notes?.includes('Discord - Site')).length);
  }, []);

  // Perfil de device sintético do Discord (usado na injeção e no histórico)
  const buildDiscordDeviceProfile = () => {
    const randHex = (n: number) =>
      Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const fingerprint = `dc_${randHex(32)}`;
    const userAgent =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
    return {
      deviceId: `dc_device_${randHex(16)}`,
      fingerprint,
      userAgent,
      macAddress: `02:${randHex(2)}:${randHex(2)}:${randHex(2)}:${randHex(2)}:${randHex(2)}`,
      imei: `35${randHex(13)}`,
    };
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const dev = buildDiscordDeviceProfile();
    const newPerson = generatePersonalData();
    setDevice(dev);
    setPersonalData(newPerson);
    saveAccountRecord({
      id: `dc_site_${Date.now()}`,
      email: newPerson.email,
      createdAt: new Date(),
      status: 'pending',
      deviceFingerprint: dev.fingerprint,
      userAgent: dev.userAgent,
      personalData: {
        name: newPerson.fullName,
        phone: newPerson.phone,
        birthDate: newPerson.birthDate,
        city: newPerson.city,
        state: newPerson.state,
      },
      behaviorConfig: { minDelay: 600, maxDelay: 2500, typingSpeed: 130 },
      notes: 'Discord - Site — perfil técnico e persona gerados localmente',
    });
    setHistoryCount((count) => count + 1);
    setIsGenerating(false);
    toast.success('Novo perfil Discord - Site gerado com dispositivo e persona!', {
      description: `${dev.deviceId} • ${newPerson.email}`,
    });
  };

  const buildInSiteScript = (): string => {
    const dev = device!;
    const antiDetectionCode = generateAdvancedAntiDetection();
    const appSimCode = simulateNativeApp
      ? generateNativeAppSimulationForProfile({ platform: 'discord', userAgent: dev.userAgent, imei: dev.imei })
      : '';
    const behaviorCode = enableHumanBehavior
      ? generateBehaviorInjectionScript({ minDelay: 600, maxDelay: 2500, minTypingSpeed: 70, maxTypingSpeed: 190, enableMouseMovement: true, enableScrolling: true })
      : '';

    const profileJson = JSON.stringify({
      deviceId: dev.deviceId,
      macAddress: dev.macAddress,
      imei: dev.imei,
      fingerprint: dev.fingerprint,
      userAgent: dev.userAgent,
    }).replace(/"/g, '\\"');

    const enabledFeatures = [
      'Motor Anti-Detecção 16+',
      ...(enableFingerprintShield ? ['Spoofing de Fingerprint & Canvas/WebGL'] : []),
      ...(enableAntiBot ? ['Shield Anti-Bot Discord (Superprops, Fingerprint, TLS)'] : []),
      ...(simulateNativeApp ? ['Simulação App Discord (WebView & Bridge)'] : []),
      ...(enableHumanBehavior ? ['Comportamento Humano Realista'] : []),
    ];

    const body = `
      // 1. Motor Anti-Detecção 16+
      ${antiDetectionCode}

      ${enableFingerprintShield ? `// 2. Spoofing de fingerprint (navigator, canvas, webgl, audio, hardware)
      try {
        const randHex = n => Array.from({length: n}, () => Math.floor(Math.random()*16).toString(16)).join('');
        Object.defineProperty(navigator, 'hardwareConcurrency', { value: Math.floor(Math.random()*8)+4, configurable: true });
        Object.defineProperty(navigator, 'deviceMemory', { value: [4,8,16][Math.floor(Math.random()*3)], configurable: true });
        Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
        Object.defineProperty(navigator, 'languages', { value: ['en-US','en'], configurable: true });
        Object.defineProperty(navigator, 'platform', { value: 'Win32', configurable: true });
        if (window.screen) {
          Object.defineProperty(screen, 'colorDepth', { value: 24, configurable: true });
          Object.defineProperty(screen, 'pixelDepth', { value: 24, configurable: true });
        }
      } catch(e) { console.warn('fingerprint shield', e); }
      ` : '// 2. Spoofing de fingerprint DESATIVADO'}

      ${enableAntiBot ? `// 3. Shield Anti-Bot Discord — superproperties, fingerprint e detecção de automação
      try {
        const randHex = n => Array.from({length: n}, () => Math.floor(Math.random()*16).toString(16)).join('');
        // superproperties sintéticas que o Discord usa para telemetria
        const superProps = {
          os: 'Windows',
          browser: 'Chrome',
          device: '',
          system_locale: 'en-US',
          browser_user_agent: navigator.userAgent,
          browser_version: '126.0.0.0',
          os_version: '10',
          referrer: '',
          referring_domain: '',
          referrer_current: '',
          referring_domain_current: '',
          release_channel: 'stable',
          client_build_number: Math.floor(Math.random()*250000)+40000,
          client_event_source: null
        };
        localStorage.setItem('_discord_super_props', JSON.stringify(superProps));
        localStorage.setItem('_discord_fingerprint', randHex(16));
        // Previne detecção de automação (webdriver / headless)
        Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: true });
        if (window.chrome && window.chrome.runtime) {
          Object.defineProperty(navigator, 'userAgentData', {
            value: { brands: [{ brand: 'Google Chrome', version: '126' }, { brand: 'Not:A-Brand', version: '8' }, { brand: 'Chromium', version: '126' }], mobile: false, platform: 'Windows' },
            configurable: true
          });
        }
        // WebRTC: IP interno não vazado
        const origRTCPeerConnection = window.RTCPeerConnection;
        if (origRTCPeerConnection) {
          window.RTCPeerConnection = function() {
            const pc = new origRTCPeerConnection(arguments[0] || {});
            const noop = () => {};
            pc.createDataChannel = noop;
            pc.createOffer = () => Promise.resolve({ sdp: '', type: 'offer' });
            pc.setLocalDescription = noop;
            pc.setRemoteDescription = noop;
            pc.addIceCandidate = noop;
            return pc;
          };
          window.RTCPeerConnection.prototype = origRTCPeerConnection.prototype;
        }
      } catch(e) { console.warn('anti-bot shield', e); }
      ` : '// 3. Shield Anti-Bot Discord DESATIVADO'}

      ${simulateNativeApp ? `// 4. SIMULAÇÃO DE APP NATIVO — Discord WebView & Bridge\n${appSimCode}` : '// 4. Simulação de app nativo DESATIVADA'}

      ${enableHumanBehavior ? `// 5. Comportamento humano simulado\n${behaviorCode}` : '// 5. Comportamento humano DESATIVADO'}

      // 6. Injeção de identidade Discord (NO DOMÍNIO REAL)
      const profile = JSON.parse("${profileJson}");
      localStorage.setItem('discord_device_profile', JSON.stringify(profile));
      localStorage.setItem('_device_fingerprint', profile.fingerprint);
      localStorage.setItem('_device_id', profile.deviceId);
      localStorage.setItem('_device_mac', profile.macAddress);
      localStorage.setItem('_device_imei', profile.imei);
      localStorage.setItem('_discord_device_id', profile.deviceId);
      localStorage.setItem('_discord_fingerprint', profile.fingerprint);
    `;

    return wrapInSiteScript('Discord', body, enabledFeatures, '#5865F2');
  };

  const handleAfterCopy = () => {
    saveAccountRecord({
      id: `dc_site_${Date.now()}`,
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
      notes: 'Discord - Site — script in-site copiado para injeção manual',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-indigo-500/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
              <MessageCircle className="w-4 h-4" />
              <span>Plataforma de Chat & Anti-Moderação Discord</span>
            </div>
            <h1 className="text-3xl font-extrabold text-indigo-300">DISCORD - SITE DEVICE MASTER</h1>
            <p className="text-sm text-muted-foreground">Suite anti-detecção completa para o registro oficial do Discord (discord.com/register) com shield anti-bot e injeção 16+</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['discord-site']} accentClass="text-indigo-200" />

        <div className="grid gap-6 mt-8">
          <div className="border border-indigo-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-indigo-200 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Gerar Persona Sintética + Device Discord
            </h2>
            <p className="text-xs text-muted-foreground mb-2">Histórico local Discord - Site: <span className="text-indigo-300 font-bold">{historyCount} perfil(is)</span></p>
            <p className="text-xs text-muted-foreground mb-4">
              Gera um device ID sintético Discord, fingerprint blindado e uma persona sintética completa (nome, email, telefone, nascimento, CPF, endereço) pronta para a tela de registro do Discord.
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Gerar Perfil Discord - Site
            </Button>

            {device && (
              <div className="mt-6 p-4 rounded-xl bg-background/80 border border-indigo-500/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground">Device ID:</span> <span className="font-mono text-slate-200">{device.deviceId}</span></div>
                <div><span className="text-muted-foreground">Fingerprint:</span> <span className="font-mono text-slate-200">{device.fingerprint}</span></div>
                <div><span className="text-muted-foreground">MAC Address:</span> <span className="font-mono text-slate-200">{device.macAddress}</span></div>
                <div><span className="text-muted-foreground">IMEI:</span> <span className="font-mono text-slate-200">{device.imei}</span></div>
                <div className="md:col-span-2"><span className="text-muted-foreground">User-Agent:</span> <div className="p-2 mt-1 rounded bg-slate-950 font-mono text-[11px] text-indigo-200 break-all">{device.userAgent}</div></div>
              </div>
            )}

            {personalData && (
              <div className="mt-4 p-4 rounded-xl bg-background/80 border border-indigo-500/20 relative text-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-indigo-200 flex items-center gap-2">
                    <User className="w-4 h-4" /> Persona Sintética para Registro
                  </h3>
                  <Button variant="ghost" size="sm" className="h-7 text-indigo-300 hover:bg-indigo-500/10" onClick={() => setShowPersona(!showPersona)}>
                    {showPersona ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                    {showPersona ? 'Ocultar' : 'Revelar'}
                  </Button>
                </div>
                {showPersona ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><span className="text-muted-foreground">Nome:</span> <span className="font-bold text-indigo-200">{personalData.fullName}</span></div>
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

          <div className="border border-indigo-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-indigo-200 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-300" />
              2. Módulos de Proteção & Injeção Completa
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="dc-fp" checked={enableFingerprintShield} onCheckedChange={(c) => setEnableFingerprintShield(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="dc-fp" className="text-sm font-bold text-indigo-100 cursor-pointer">
                    Spoofing de Fingerprint (Canvas, WebGL, Hardware & Screen)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Mascara <code className="text-indigo-300">navigator</code>, hardware, screen e parâmetros de canvas/WebGL para evitar identificação por fingerprint.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="dc-antibot" checked={enableAntiBot} onCheckedChange={(c) => setEnableAntiBot(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="dc-antibot" className="text-sm font-bold text-indigo-100 cursor-pointer">
                    Shield Anti-Bot Discord (Superprops, WebRTC & WebDriver)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Injeta <code className="text-indigo-300">superprops</code> sintéticas, bloqueia vazamento de IP via WebRTC e desativa detecção de automação (webdriver/headless).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="dc-native" checked={simulateNativeApp} onCheckedChange={(c) => setSimulateNativeApp(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="dc-native" className="text-sm font-bold text-indigo-100 cursor-pointer">
                    Simulação de App Nativo Discord (WebView Desktop & Bridge)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Injeta objetos globais <code className="text-indigo-300">DiscordNative</code> e propriedades de app desktop para contornar a detecção "navegador vs app nativo".
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="dc-human" checked={enableHumanBehavior} onCheckedChange={(c) => setEnableHumanBehavior(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="dc-human" className="text-sm font-bold text-indigo-100 cursor-pointer">
                    Simulação de Comportamento Humano (Delays, Mouse & Scroll)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Emula micro-movimentos e cadência natural para evitar bloqueios comportamentais da moderação do Discord.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-indigo-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-indigo-200 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              3. Injeção In-Site
            </h2>
            <InSitePanel
              siteName="Discord"
              siteUrl={DISCORD_REGISTER_URL}
              accentText="text-indigo-300"
              accentHex="#5865F2"
              disabled={!device}
              features={[
                'Motor Anti-Detecção 16+',
                ...(enableFingerprintShield ? ['Spoofing Fingerprint'] : []),
                ...(enableAntiBot ? ['Shield Anti-Bot'] : []),
                ...(simulateNativeApp ? ['Simulação App'] : []),
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
