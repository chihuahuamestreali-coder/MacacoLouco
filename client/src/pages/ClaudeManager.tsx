import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
/**
 * Claude Manager Page - Gerenciador de Dispositivos para Claude
 * Design: Cyberpunk Industrial (Cores: Roxo/Magenta)
 *
 * INJEÇÃO IN-SITE: o script é copiado e rodado no console da guia do site real
 * (claude.ai), sem aba intermediária nem redirect.
 */

import { useState, useEffect } from 'react';
import { ClaudeDeviceProfile, generateClaudeDeviceProfile, formatClaudeDataForDisplay } from '@/lib/claudeDeviceGenerator';
import { generateCompleteAntiDetectionScript } from '@/lib/cookieAndUserAgentManager';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { wrapInSiteScript } from '@/lib/inSiteInjection';
import InSitePanel from '@/components/InSitePanel';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Zap, Copy, AlertCircle, Loader2, MonitorPlay, User, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

const HISTORY_KEY = 'claudeDeviceHistory';

export default function ClaudeManager() {
  const [, setLocation] = useLocation();
  const [devices, setDevices] = useState<ClaudeDeviceProfile[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<ClaudeDeviceProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);

  // Persistência de histórico em localStorage (dados não somem ao fechar a aba)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ClaudeDeviceProfile[];
        setDevices(parsed);
        if (parsed.length > 0) setSelectedDevice(parsed[0]);
      }
    } catch (e) { console.error('Erro ao carregar histórico Claude:', e); }
  }, []);

  const persistHistory = (list: ClaudeDeviceProfile[]) => {
    setDevices(list);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
    } catch (e) { console.error('Erro ao salvar histórico Claude:', e); }
  };

  // Gerar novo dispositivo
  const handleGenerateDevice = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newDevice = generateClaudeDeviceProfile();
      persistHistory([newDevice, ...devices]);
      setSelectedDevice(newDevice);
      toast.success('✓ Dispositivo Claude gerado e salvo no histórico!');
    } catch (error) {
      toast.error('✗ Erro ao gerar dispositivo');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copiar dados pessoais
  const handleCopyData = () => {
    if (!selectedDevice) return;
    const data = formatClaudeDataForDisplay(selectedDevice);
    navigator.clipboard.writeText(data);
    toast.success('✓ Dados copiados para a área de transferência!');
  };

  // Script de injeção in-site (roda no domínio real do claude.ai)
  const buildInSiteScript = (): string => {
    const dev = selectedDevice!;
    const nativeAppCode = simulateNativeApp
      ? generateNativeAppSimulationForProfile({ platform: 'claude', userAgent: dev.userAgent, imei: dev.deviceFingerprint })
      : '';
    const antiDetectionScript = generateCompleteAntiDetectionScript({ userAgent: dev.userAgent } as any);
    const advancedAntiDetection = generateAdvancedAntiDetection();
    const behaviorCode = enableHumanBehavior
      ? generateBehaviorInjectionScript({ minDelay: 800, maxDelay: 3000, minTypingSpeed: 60, maxTypingSpeed: 180, enableMouseMovement: true, enableScrolling: true })
      : '';

    const enabledFeatures = [
      'Motor Anti-Detecção 16+',
      ...(simulateNativeApp ? ['Simulação App Nativo Claude'] : []),
      ...(enableHumanBehavior ? ['Comportamento Humano'] : []),
      'Anti-detecção 13+ técnicas',
    ];

    const cookiesJson = JSON.stringify(dev.cookies);
    const deviceJson = JSON.stringify({
      id: dev.id,
      email: dev.email,
      password: dev.password,
      firstName: dev.firstName,
      lastName: dev.lastName,
      userAgent: dev.userAgent,
      ipAddress: dev.ipAddress,
      timezone: dev.timezone,
      language: dev.language,
      locale: dev.locale,
      deviceFingerprint: dev.deviceFingerprint,
      sessionId: dev.sessionId,
    }).replace(/"/g, '\\"');

    const body = `
      // 1. Motor Anti-Detecção 16+
      ${advancedAntiDetection}

      ${simulateNativeApp ? `// 2. SIMULAÇÃO DE APP NATIVO — WebView Claude & Bridge\n${nativeAppCode}` : '// 2. Simulação de app nativo DESATIVADA'}

      // 3. Anti-detecção completa (user agent + navegador)
      ${antiDetectionScript}

      ${enableHumanBehavior ? `// 4. Comportamento humano simulado\n${behaviorCode}` : '// 4. Comportamento humano DESATIVADO'}

      // 5. Injeção de identidade Claude (NO DOMÍNIO REAL)
      const profile = JSON.parse("${deviceJson}");
      window.claudeDevice = profile;
      localStorage.setItem('claudeDeviceProfile', JSON.stringify(profile));
      sessionStorage.setItem('claudeSession', profile.sessionId);

      // 6. Injeção de cookies (mesmo domínio)
      try {
        Object.entries(${cookiesJson}).forEach(([key, value]) => {
          document.cookie = key + '=' + value + '; path=/; domain=.claude.ai';
        });
      } catch(e) { console.warn('cookie inject', e); }
    `;

    return wrapInSiteScript('Claude', body, enabledFeatures, '#cc00ff');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <ModuleGuide guide={MODULE_GUIDES['claude']} accentClass="text-purple-300" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-2">
            CLAUDE MASTER
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4"><p className="text-slate-400">Gerenciador de Dispositivos para Claude (Anthropic) • v2.1 (Injeção In-Site)</p><Button type="button" variant="outline" onClick={() => setLocation('/')} className="border-purple-400/40 text-purple-200 hover:bg-purple-400/10">← Página principal</Button></div>
        </div>

        {/* Status Box */}
        <div className="border border-purple-500/50 rounded-lg p-6 mb-8 bg-purple-950/20 backdrop-blur">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-purple-400 animate-pulse" size={24} />
            <h2 className="text-xl font-bold text-purple-400">STATUS</h2>
          </div>
          <div className="text-slate-300 space-y-2">
            <p>✓ Novo: Injeção In-Site (v2.1) — script roda no domínio real do claude.ai</p>
            <p>✓ Bypass de Verificação de Email: Ativado</p>
            <p>✓ Anti-detecção: 16+ técnicas</p>
            <p>✓ Persistência de Histórico: Ativada (dados salvos em localStorage)</p>
            <p>✓ Histórico salvo: {devices.length} dispositivo(s)</p>
          </div>
        </div>

        {/* Módulos de Proteção */}
        <div className="border border-purple-500/30 rounded-lg p-6 mb-8 bg-slate-800/50 backdrop-blur">
          <h2 className="text-xl font-bold mb-4 text-purple-400">Módulos de Proteção (ativados por padrão)</h2>
                      <div className="space-y-4">
              <label className="flex items-start gap-3 border border-purple-400/30 rounded-md p-4 bg-secondary/20 cursor-pointer">
                <Checkbox checked={simulateNativeApp} onCheckedChange={(checked) => setSimulateNativeApp(checked as boolean)} className="mt-0.5" />
                <div className="flex-1"><div className="font-semibold text-purple-200">Simulação de app nativo Claude</div><p className="text-xs text-muted-foreground mt-1">Injeta metadados de WebView/app no domínio real do Claude para contornar a detecção "navegador vs app nativo".</p></div>
              </label>
              <label className="flex items-start gap-3 border border-cyan-500/40 rounded-md p-4 bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors">
              <Checkbox
                checked={enableHumanBehavior}
                onCheckedChange={(checked) => setEnableHumanBehavior(checked as boolean)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-semibold text-cyan-300">
                  <User className="w-4 h-4" />
                  Simulação de Comportamento Humano
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Injeta delays aleatórios, movimentos de mouse naturais e scroll progressivo na sessão do Claude,
                  simulando um usuário humano antes de preencher o formulário de criação de conta.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gerador */}
          <div className="lg:col-span-1">
            <div className="border border-purple-500/30 rounded-lg p-6 bg-slate-800/50 backdrop-blur">
              <h3 className="text-lg font-bold text-purple-400 mb-4">GERADOR</h3>
              
              <button
                onClick={handleGenerateDevice}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mb-4"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    GERAR NOVO DISPOSITIVO
                  </>
                )}
              </button>

              <div className="bg-slate-900/50 border border-slate-700 rounded p-4 text-sm text-slate-300 mb-4">
                <p className="font-bold text-purple-400 mb-2">💡 DICA:</p>
                <p>Clique em "GERAR NOVO DISPOSITIVO" para criar uma identidade única com:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Email único</li>
                  <li>Senha forte</li>
                  <li>Device fingerprint</li>
                  <li>Session ID realista</li>
                  <li>Cookies de autenticação</li>
                  <li>Anti-detecção ativa</li>
                </ul>
              </div>

              {selectedDevice && (
                <button
                  onClick={handleCopyData}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Copy size={18} />
                  COPIAR DADOS
                </button>
              )}
            </div>
          </div>

          {/* Dispositivo Selecionado */}
          <div className="lg:col-span-2">
            {selectedDevice ? (
              <div className="border border-purple-500/30 rounded-lg p-6 bg-slate-800/50 backdrop-blur">
                <h3 className="text-lg font-bold text-purple-400 mb-4">DISPOSITIVO SELECIONADO</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Nome</p>
                      <p className="text-white font-mono">{selectedDevice.firstName} {selectedDevice.lastName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">ID do Dispositivo</p>
                      <p className="text-white font-mono text-xs">{selectedDevice.id.substring(0, 20)}...</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Email</p>
                    <p className="text-white font-mono text-sm break-all">{selectedDevice.email}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Senha</p>
                    <p className="text-white font-mono text-sm break-all">{selectedDevice.password}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">IP</p>
                      <p className="text-white font-mono text-sm">{selectedDevice.ipAddress}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Timezone</p>
                      <p className="text-white font-mono text-sm">{selectedDevice.timezone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Session ID</p>
                    <p className="text-white font-mono text-xs break-all">{selectedDevice.sessionId.substring(0, 40)}...</p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Device Fingerprint</p>
                    <p className="text-white font-mono text-sm">{selectedDevice.deviceFingerprint}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                    <MonitorPlay size={16} />
                    INJEÇÃO IN-SITE
                  </h4>
                  <InSitePanel
                    siteName="Claude"
                    siteUrl="https://claude.ai/login"
                    accentText="text-purple-300"
                    accentHex="#cc00ff"
                    disabled={!selectedDevice}
                    features={[
                      'Motor Anti-Detecção 16+',
                      ...(simulateNativeApp ? ['Simulação App Nativo'] : []),
                      ...(enableHumanBehavior ? ['Comportamento Humano'] : []),
                    ]}
                    buildScript={buildInSiteScript}
                  />
                </div>
              </div>
            ) : (
              <div className="border border-slate-700 rounded-lg p-12 bg-slate-800/50 backdrop-blur flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="text-slate-500 mx-auto mb-4" size={48} />
                  <p className="text-slate-400">Nenhum dispositivo gerado</p>
                  <p className="text-slate-500 text-sm">Clique em "GERAR NOVO DISPOSITIVO" para começar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dispositivos Anteriores */}
        {devices.length > 1 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-purple-400 mb-4">HISTÓRICO DE DISPOSITIVOS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.slice(1).map((device) => (
                <div
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className="border border-slate-700 hover:border-purple-500/50 rounded-lg p-4 bg-slate-800/50 backdrop-blur cursor-pointer transition-all duration-200 hover:bg-slate-800"
                >
                  <p className="text-white font-mono text-sm break-all">{device.email}</p>
                  <p className="text-slate-400 text-xs mt-2">{device.firstName} {device.lastName}</p>
                  <p className="text-slate-500 text-xs">{new Date(device.createdAt).toLocaleString('pt-BR')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
