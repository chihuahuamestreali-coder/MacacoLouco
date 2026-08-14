import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';

import { useState, useEffect } from 'react';
import { generateTikTokDeviceProfile, generateTikTokSignupUrl } from '@/lib/tiktokDeviceGenerator';
import { generatePersonalData } from '@/lib/personalDataGenerator';
import { generateCompleteAntiDetectionScript } from '@/lib/cookieAndUserAgentManager';
import { generateRandomUserAgent } from '@/lib/cookieAndUserAgentManager';
import { saveAccountRecord, generatePerformanceReport, PerformanceReport } from '@/lib/accountHistoryManager';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { wrapInSiteScript } from '@/lib/inSiteInjection';
import InSitePanel from '@/components/InSitePanel';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Zap, Copy, BarChart3, Loader2, MonitorPlay, Smartphone, Shield, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

const HISTORY_KEY = 'tiktokDeviceHistory';

export default function TikTokManager() {
  const [, setLocation] = useLocation();
  const [referralCode, setReferralCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<any>(null);
  const [currentPersonalData, setCurrentPersonalData] = useState<any>(null);
  const [currentUserAgent, setCurrentUserAgent] = useState<any>(null);
  const [antiFraudMode, setAntiFraudMode] = useState(true);
  // Simulação de App Nativo — ATIVADA POR PADRÃO (TikTokApp, como no Instagram/AliExpress)
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [savedDevices, setSavedDevices] = useState<any[]>([]);

  // Persistência de histórico em localStorage (dados não somem ao fechar a aba)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as any[];
        setSavedDevices(parsed);
      }
    } catch (e) { console.error('Erro ao carregar histórico TikTok:', e); }
  }, []);

  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);

  const persistDeviceHistory = (list: any[]) => {
    setSavedDevices(list);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
    } catch (e) { console.error('Erro ao salvar histórico TikTok:', e); }
  };

  useEffect(() => {
    const report = generatePerformanceReport();
    setPerformanceReport(report);
  }, []);

  const handleGenerateDevice = async () => {
    setIsGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const newDevice = generateTikTokDeviceProfile();
    const personalData = generatePersonalData();
    const userAgent = generateRandomUserAgent();

    setCurrentDevice(newDevice);
    setCurrentPersonalData(personalData);
    setCurrentUserAgent(userAgent);
    persistDeviceHistory([newDevice, ...savedDevices]);
    setIsGenerating(false);

    toast.success('Novo dispositivo TikTok gerado e salvo no histórico!', {
      description: `${newDevice.deviceName} • ${personalData.fullName}`,
    });
  };

  const buildInSiteScript = (): string => {
    const dev = currentDevice;
    const antiDetectionCode = generateAdvancedAntiDetection();
    const appSimCode = simulateNativeApp
      ? generateNativeAppSimulationForProfile({ platform: 'tiktok', userAgent: currentUserAgent ? currentUserAgent.userAgent : dev.userAgent, imei: dev.imei })
      : '';
    const behaviorCode = enableHumanBehavior
      ? generateBehaviorInjectionScript({ minDelay: 600, maxDelay: 2500, minTypingSpeed: 70, maxTypingSpeed: 190, enableMouseMovement: true, enableScrolling: true })
      : '';

    const profileJson = JSON.stringify({
      deviceName: dev.deviceName,
      model: dev.model,
      manufacturer: dev.manufacturer,
      macAddress: dev.mac,
      imei: dev.imei,
      androidId: dev.androidId,
      fingerprint: dev.fingerprint,
      userAgent: currentUserAgent ? currentUserAgent.userAgent : dev.userAgent,
      resolution: dev.resolution,
      ramMb: dev.ramMb,
      cpuCores: dev.cpuCores,
      osName: dev.osName,
      osVersion: dev.osVersion,
    }).replace(/"/g, '\\"');

    const enabledFeatures = [
      'Motor Anti-Detecção 16+',
      ...(simulateNativeApp ? ['Simulação App Nativo TikTok (WebView & Bridge)'] : []),
      ...(enableHumanBehavior ? ['Comportamento Humano Realista'] : []),
      ...(antiFraudMode ? ['Modo Anti-Fraude Ativo'] : []),
    ];

    const body = `
      // 1. Motor Anti-Detecção 16+
      ${antiDetectionCode}

      ${simulateNativeApp ? `// 2. SIMULAÇÃO DE APP NATIVO — TikTokApp (WebView & Bridge)\n${appSimCode}` : '// 2. Simulação de app nativo DESATIVADA'}

      ${enableHumanBehavior ? `// 3. Comportamento humano simulado\n${behaviorCode}` : '// 3. Comportamento humano DESATIVADO'}

      ${antiFraudMode ? `// 4. Modo Anti-Fraude — máscara de automação adicional
      try {
        Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: true });
      } catch(e) { console.warn('anti-fraude', e); }
      ` : '// 4. Modo Anti-Fraude DESATIVADO'}

      // 5. Injeção de identidade TikTok (NO DOMÍNIO REAL)
      const profile = JSON.parse("${profileJson}");
      localStorage.setItem('tiktok_device_profile', JSON.stringify(profile));
      localStorage.setItem('_device_fingerprint', profile.fingerprint);
      localStorage.setItem('_device_model', profile.model);
      localStorage.setItem('_device_mac', profile.macAddress);
      localStorage.setItem('_device_imei', profile.imei);
      localStorage.setItem('_device_android_id', profile.androidId);
    `;

    return wrapInSiteScript('TikTok', body, enabledFeatures, '#ec4899');
  };

  const handleAfterCopy = () => {
    saveAccountRecord({
      id: `tiktok_${Date.now()}`,
      email: currentPersonalData.email,
      createdAt: new Date(),
      status: 'pending',
      referralLink: referralCode,
      deviceFingerprint: currentDevice.fingerprint,
      userAgent: currentUserAgent.userAgent,
      personalData: {
        name: currentPersonalData.fullName,
        phone: currentPersonalData.phone,
        birthDate: currentPersonalData.birthDate,
        city: currentPersonalData.city,
        state: currentPersonalData.state,
      },
      behaviorConfig: {
        minDelay: antiFraudMode ? 1000 : 500,
        maxDelay: antiFraudMode ? 5000 : 3000,
        typingSpeed: antiFraudMode ? 150 : 100,
      },
      notes: `TikTok | Anti-fraude: ${antiFraudMode ? 'Ativo' : 'Inativo'} | script in-site copiado`,
    });
  };

  const copyPersonalData = () => {
    if (!currentPersonalData) {
      toast.error('Gere um dispositivo primeiro!');
      return;
    }

    const dataText = `
Nome: ${currentPersonalData.fullName}
Email: ${currentPersonalData.email}
Telefone: ${currentPersonalData.phone}
Data de Nascimento: ${currentPersonalData.birthDate}
Cidade: ${currentPersonalData.city}
Estado: ${currentPersonalData.state}
    `.trim();

    navigator.clipboard.writeText(dataText);
    toast.success('Dados pessoais copiados!', {
      description: 'Cole nos campos do formulário',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
        <ModuleGuide guide={MODULE_GUIDES['tiktok']} accentClass="text-sky-300" />
      {/* Background Grid Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(236, 72, 153, 0.05) 25%, rgba(236, 72, 153, 0.05) 26%, transparent 27%, transparent 74%, rgba(236, 72, 153, 0.05) 75%, rgba(236, 72, 153, 0.05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(236, 72, 153, 0.05) 25%, rgba(236, 72, 153, 0.05) 26%, transparent 27%, transparent 74%, rgba(236, 72, 153, 0.05) 75%, rgba(236, 72, 153, 0.05) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-pink-400/30 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl lg:text-4xl font-bold text-pink-400 font-mono mb-1">
                ▌TIKTOK DEVICE MASTER▌
              </h1>
              <p className="text-xs lg:text-sm text-muted-foreground font-mono">
                Gerenciador Anti-Fraude para TikTok • v2.1 (Injeção In-Site)
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-400/20 hover:bg-blue-400/40 text-blue-400 border border-blue-400/50 rounded transition-all font-bold text-xs"
              >
                <BarChart3 size={16} />
                HISTÓRICO
              </button>
              <button
                onClick={() => setLocation('/')}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-400/20 hover:bg-cyan-400/40 text-cyan-400 border border-cyan-400/50 rounded transition-all font-bold text-xs neon-glow"
              >
                ← DEVICE MASTER
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Info Banner */}
        <div className="neon-glow-pink rounded-lg p-4 mb-8 bg-secondary/50 border-2 border-pink-500/50">
          <div className="flex gap-3">
            <Shield size={20} className="text-pink-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-pink-400 mb-1">🛡️ Modo Anti-Fraude</h3>
              <p className="text-sm text-foreground font-mono mb-2">
                {antiFraudMode ? '✓ ATIVO' : '✗ INATIVO'} - Simula comportamento mobile realista
              </p>
              <button
                onClick={() => setAntiFraudMode(!antiFraudMode)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  antiFraudMode
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}
              >
                {antiFraudMode ? 'Desativar' : 'Ativar'} Anti-Fraude
              </button>
            </div>
          </div>
        </div>

        {/* Módulos de Proteção — checkbox de Simulação de App Nativo (ativada por padrão) */}
        <div className="neon-glow-pink rounded-lg p-4 mb-8 bg-secondary/50 border-2 border-pink-500/50">
          <div className="flex gap-3">
            <Smartphone size={20} className="text-sky-400 flex-shrink-0 mt-0.5" />
            <label className="flex-1 cursor-pointer" htmlFor="tiktok-native-app">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="tiktok-native-app"
                  checked={simulateNativeApp}
                  onCheckedChange={(checked) => setSimulateNativeApp(checked as boolean)}
                  className="mt-0.5"
                />
                <div>
                  <h3 className="font-bold text-sky-400">Simulação de App Nativo (TikTok App)</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Injeta <code>TikTokWebView</code>, bridge nativa e User-Agent com a assinatura oficial do app
                    TikTok ({'{'}app_name: tiktok_trill, channel: googleplay{'}'}). Quando ativa, o TikTok reconhece a
                    sessão como o app instalado no celular. Desative para usar o modo navegador normal. Ativa por padrão.
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="neon-glow-pink rounded-lg p-4 mb-8 bg-secondary/50 border-2 border-pink-500/50">
          <div className="flex gap-3">
            <MonitorPlay size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            <label className="flex-1 cursor-pointer" htmlFor="tiktok-human-behavior">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="tiktok-human-behavior"
                  checked={enableHumanBehavior}
                  onCheckedChange={(checked) => setEnableHumanBehavior(checked as boolean)}
                  className="mt-0.5"
                />
                <div>
                  <h3 className="font-bold text-cyan-400">Simulação de Comportamento Humano</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Injeta delays, movimentos de mouse naturais e scroll progressivo na sessão do TikTok.
                    Ativa por padrão.
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {showHistory && performanceReport && (
          <div className="neon-glow rounded-lg p-6 bg-card border border-blue-400/30 mb-8">
            <h2 className="text-lg font-bold text-blue-400 mb-4 font-mono">▌RELATÓRIO DE DESEMPENHO▌</h2>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-secondary/30 rounded p-3 text-center">
                <div className="text-2xl font-bold text-cyan-400">{performanceReport.totalAccounts}</div>
                <p className="text-xs text-muted-foreground">Total de Contas</p>
              </div>
              <div className="bg-secondary/30 rounded p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{performanceReport.successfulAccounts}</div>
                <p className="text-xs text-muted-foreground">Bem-sucedidas</p>
              </div>
              <div className="bg-secondary/30 rounded p-3 text-center">
                <div className="text-2xl font-bold text-red-400">{performanceReport.fraudDetected}</div>
                <p className="text-xs text-muted-foreground">Fraude Detectada</p>
              </div>
              <div className="bg-secondary/30 rounded p-3 text-center">
                <div className="text-2xl font-bold text-purple-400">{performanceReport.pendingAccounts}</div>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
              <div className="bg-secondary/30 rounded p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {performanceReport.overallSuccessRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Taxa de Sucesso</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generator */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Generator Card */}
              <div className="neon-glow rounded-lg p-6 bg-card">
                <h2 className="text-xl font-bold text-pink-400 mb-4 font-mono">
                  ▌GERADOR▌
                </h2>

                <button
                  onClick={handleGenerateDevice}
                  disabled={isGenerating}
                  className="w-full mb-4 flex items-center justify-center gap-2 px-6 py-4 bg-pink-400/20 hover:bg-pink-400/40 text-pink-400 border-2 border-pink-400 rounded font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed neon-glow"
                >
                  {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                  {isGenerating ? 'GERANDO...' : 'GERAR NOVO DISPOSITIVO'}
                </button>

                {isGenerating && (
                  <div className="mb-4 p-3 bg-secondary/50 rounded border border-pink-400/30">
                    <div className="text-xs text-pink-400 font-mono mb-2">SCAN EM PROGRESSO</div>
                    <div className="h-1 bg-secondary rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-400 to-purple-500 animate-pulse"
                        style={{
                          animation: 'scan-line 1.5s ease-in-out infinite',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Referral Code Input */}
                <div className="mb-4 space-y-2">
                  <label className="text-xs text-pink-400 font-mono font-bold">
                    CÓDIGO DE CONVITE (Opcional)
                  </label>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Cole seu código de convite..."
                    className="w-full px-3 py-2 bg-input border border-pink-400/30 rounded text-foreground text-xs font-mono placeholder-muted-foreground focus:outline-none focus:border-pink-400"
                  />
                </div>

                <div className="p-3 bg-green-500/10 rounded border border-green-500/30 text-xs text-green-400 font-mono mb-4">
                  <p className="font-bold mb-1">💡 DICA:</p>
                  <p>Use dados realistas e mantenha o modo anti-fraude ativo para máximo sucesso!</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-mono">
                    Cada dispositivo inclui:
                  </p>
                  <ul className="text-xs text-foreground font-mono space-y-1 ml-2">
                    <li>✓ Dados pessoais realistas</li>
                    <li>✓ User-Agent mobile TikTok</li>
                    <li>✓ Comportamento app-like</li>
                    <li>✓ Anti-detecção ativa</li>
                    <li>✓ Injeção in-site (console/bookmarklet)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Device Info */}
          <div className="lg:col-span-2">
            {!currentDevice ? (
              <div className="neon-glow rounded-lg p-12 bg-card text-center">
                <div className="text-6xl mb-4">♪</div>
                <h3 className="text-xl font-bold text-pink-400 mb-2 font-mono">
                  NENHUM DISPOSITIVO
                </h3>
                <p className="text-muted-foreground font-mono">
                  Clique em "Gerar Novo Dispositivo" para começar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Device Card */}
                <div className="neon-glow rounded-lg p-6 bg-card border border-pink-400/30">
                  <h3 className="text-lg font-bold text-pink-400 mb-4 font-mono">
                    ▌{currentDevice.deviceName}▌
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-xs font-mono">
                    <div>
                      <p className="text-muted-foreground mb-1">MODELO</p>
                      <p className="text-foreground font-bold">{currentDevice.model}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">FABRICANTE</p>
                      <p className="text-foreground font-bold">{currentDevice.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">RESOLUÇÃO</p>
                      <p className="text-foreground font-bold">{currentDevice.resolution}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">IMEI</p>
                      <p className="text-foreground font-bold break-all">{currentDevice.imei}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">MAC</p>
                      <p className="text-foreground font-bold break-all">{currentDevice.mac}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">ANDROID ID</p>
                      <p className="text-foreground font-bold break-all">{currentDevice.androidId}</p>
                    </div>
                  </div>
                </div>

                {/* Personal Data Card */}
                {currentPersonalData && (
                  <div className="neon-glow rounded-lg p-6 bg-card border border-green-400/30">
                    <h3 className="text-lg font-bold text-green-400 mb-4 font-mono">
                      ▌DADOS PESSOAIS▌
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-mono">
                      <div>
                        <p className="text-muted-foreground mb-1">NOME</p>
                        <p className="text-foreground font-bold">{currentPersonalData.fullName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">EMAIL</p>
                        <p className="text-green-400 font-bold break-all">{currentPersonalData.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">TELEFONE</p>
                        <p className="text-foreground font-bold">{currentPersonalData.phone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">DATA NASCIMENTO</p>
                        <p className="text-foreground font-bold">{currentPersonalData.birthDate}</p>
                      </div>
                    </div>

                    <button
                      onClick={copyPersonalData}
                      className="w-full px-3 py-2 bg-green-500/20 hover:bg-green-500/40 text-green-400 border border-green-500/50 rounded transition-colors font-bold text-xs"
                    >
                      <Copy size={14} className="inline mr-2" />
                      COPIAR DADOS PESSOAIS
                    </button>
                  </div>
                )}

                {/* Injection Section - In-Site */}
                <div className="neon-glow rounded-lg p-6 bg-card border border-pink-400/30">
                  <h3 className="text-lg font-bold text-pink-400 mb-4 font-mono">
                    ▌INJEÇÃO IN-SITE▌
                  </h3>
                  <InSitePanel
                    siteName="TikTok"
                    siteUrl={generateTikTokSignupUrl(referralCode)}
                    accentText="text-pink-400"
                    accentHex="#ec4899"
                    disabled={!currentDevice}
                    features={[
                      'Motor Anti-Detecção 16+',
                      ...(simulateNativeApp ? ['Simulação App Nativo'] : []),
                      ...(enableHumanBehavior ? ['Comportamento Humano'] : []),
                      ...(antiFraudMode ? ['Modo Anti-Fraude'] : []),
                    ]}
                    buildScript={buildInSiteScript}
                    onAfterCopy={handleAfterCopy}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-pink-400/30 mt-16 py-8 text-center text-xs text-muted-foreground font-mono">
        <p>TikTok Device Master v2.1 • Injeção In-Site Implementada</p>
        <p className="mt-2">⚠️ Use responsavelmente. Respeite os termos de serviço do TikTok.</p>
      </footer>
    </div>
  );
}
