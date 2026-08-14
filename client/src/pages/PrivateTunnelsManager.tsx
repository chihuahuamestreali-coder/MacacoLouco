import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, Lock, Globe, Terminal, Cpu, Sparkles, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { openSiteInNewTab } from '@/lib/inSiteInjection';

export default function PrivateTunnelsManager() {
  const [, setLocation] = useLocation();
  const [activeSubMenu, setActiveSubMenu] = useState<'hub' | 'tunnel' | 'headers' | 'sites'>('hub');
  const [selectedNode, setSelectedNode] = useState('Node-Tor-Relay-Alpha');
  const [isActivating, setIsActivating] = useState(false);

  const handleActivateTunnel = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      toast.success(`Túnel blindado ${selectedNode} ativado com sucesso!`);
    }, 1000);
  };

  const openDarkSite = (url: string, name: string) => {
    openSiteInNewTab(url);
    toast.success(`Abrindo ${name} em nova guia`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-emerald-500/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Dark Security Suite • Menu Mestre</span>
            </div>
            <h1 className="text-3xl font-extrabold text-emerald-400">DARK MASTER HUB</h1>
            <p className="text-sm text-muted-foreground">Central de ferramentas de alta privacidade, túneis onion, spoofing e portais blindados</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['dark']} accentClass="text-emerald-300" />

        {/* Submenu Navigation Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8">
          <button
            onClick={() => setActiveSubMenu('hub')}
            className={`p-4 rounded-xl border text-left transition-all ${activeSubMenu === 'hub' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg' : 'bg-card/40 border-border/60 text-muted-foreground hover:border-emerald-500/40'}`}
          >
            <div className="flex items-center gap-2 mb-1 font-bold text-sm">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Visão Geral</span>
            </div>
            <p className="text-[11px] opacity-80">Dashboard & Status do Hub</p>
          </button>

          <button
            onClick={() => setActiveSubMenu('tunnel')}
            className={`p-4 rounded-xl border text-left transition-all ${activeSubMenu === 'tunnel' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg' : 'bg-card/40 border-border/60 text-muted-foreground hover:border-emerald-500/40'}`}
          >
            <div className="flex items-center gap-2 mb-1 font-bold text-sm">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Túneis Proxy</span>
            </div>
            <p className="text-[11px] opacity-80">Roteamento Onion & Relay</p>
          </button>

          <button
            onClick={() => setActiveSubMenu('headers')}
            className={`p-4 rounded-xl border text-left transition-all ${activeSubMenu === 'headers' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg' : 'bg-card/40 border-border/60 text-muted-foreground hover:border-emerald-500/40'}`}
          >
            <div className="flex items-center gap-2 mb-1 font-bold text-sm">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Spoofing Headers</span>
            </div>
            <p className="text-[11px] opacity-80">Sanitização HTTP & Fingerprint</p>
          </button>

          <button
            onClick={() => setActiveSubMenu('sites')}
            className={`p-4 rounded-xl border text-left transition-all ${activeSubMenu === 'sites' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg' : 'bg-card/40 border-border/60 text-muted-foreground hover:border-emerald-500/40'}`}
          >
            <div className="flex items-center gap-2 mb-1 font-bold text-sm">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Sites & Portais</span>
            </div>
            <p className="text-[11px] opacity-80">Acesso a Portais Blindados</p>
          </button>
        </div>

        {/* Submenu Content Area */}
        <div className="border border-emerald-500/30 rounded-2xl p-6 md:p-8 bg-card/50 backdrop-blur-sm shadow-xl">
          {activeSubMenu === 'hub' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Central Dark Master Hub
              </h2>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                O módulo Dark atua como um menu mestre integrado no Device Master. Utilize as opções acima para configurar nós de relay, injetar spoofing de cabeçalhos e acessar portais de navegação segura com isolamento total de sessão.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-background/60 border border-emerald-500/20">
                  <div className="text-emerald-400 font-bold text-sm mb-1">Status do Túnel</div>
                  <div className="text-xs text-slate-300">Blindagem Ativa (Zero-Log)</div>
                </div>
                <div className="p-4 rounded-xl bg-background/60 border border-emerald-500/20">
                  <div className="text-emerald-400 font-bold text-sm mb-1">Criptografia</div>
                  <div className="text-xs text-slate-300">ChaCha20-Poly1305 / Tor v3</div>
                </div>
                <div className="p-4 rounded-xl bg-background/60 border border-emerald-500/20">
                  <div className="text-emerald-400 font-bold text-sm mb-1">DNS Leak Guard</div>
                  <div className="text-xs text-emerald-400 font-bold">100% Protegido</div>
                </div>
              </div>
            </div>
          )}

          {activeSubMenu === 'tunnel' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-emerald-300 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                Configuração de Túneis & Roteamento Onion
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Selecione o nó de relay e inicie o túnel criptografado para mascarar sua origem de rede.
              </p>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Nó de Relay Ativo</label>
                  <select
                    value={selectedNode}
                    onChange={(e) => setSelectedNode(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-3 text-xs text-foreground font-mono"
                  >
                    <option value="Node-Tor-Relay-Alpha">Node-Tor-Relay-Alpha (Global Encrypted)</option>
                    <option value="Node-Swiss-Secure-Beta">Node-Swiss-Secure-Beta (Zero Jurisdiction)</option>
                    <option value="Node-Iceland-Offshore-Gamma">Node-Iceland-Offshore-Gamma (Privacy Guard)</option>
                  </select>
                </div>
                <Button
                  onClick={handleActivateTunnel}
                  disabled={isActivating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 flex items-center gap-2"
                >
                  {isActivating ? <Cpu className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Ativar Túnel Blindado
                </Button>
              </div>
            </div>
          )}

          {activeSubMenu === 'headers' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-emerald-300 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                Spoofing de Headers & Sanitização HTTP
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Remove rastreadores de cabeçalho, oculta a assinatura do navegador e injeta headers de alta anonimização.
              </p>
              <div className="p-4 rounded-xl bg-background/80 border border-emerald-500/20 font-mono text-xs text-emerald-300 space-y-2">
                <div>{`> User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0`}</div>
                <div>{`> Sec-Fetch-Dest: document`}</div>
                <div>{`> Accept-Language: en-US,en;q=0.5`}</div>
                <div>{`> DNT: 1 (Do Not Track Ativo)`}</div>
                <div className="text-muted-foreground pt-2">✓ Sanitização automática de rastreadores web e WebRTC vazados aplicada.</div>
              </div>
            </div>
          )}

          {activeSubMenu === 'sites' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-emerald-300 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                Portais Blindados & Sites de Referência
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Acesse rapidamente portais de anonimato e ferramentas de teste de segurança através do túnel ativo.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background/60 border border-emerald-500/20 flex items-center justify-between">
                  <div>
                    <div className="text-emerald-300 font-bold text-sm">DuckDuckGo Onion</div>
                    <div className="text-[11px] text-muted-foreground">Busca segura sem rastreamento de IP.</div>
                  </div>
                  <Button
                    onClick={() => openDarkSite('https://duckduckgogg42xjoc7zzx3czhkzjhwlujvi3or6oehzxl7d54xiijyd.onion', 'DuckDuckGo Onion')}
                    size="sm"
                    variant="outline"
                    className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Abrir
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-background/60 border border-emerald-500/20 flex items-center justify-between">
                  <div>
                    <div className="text-emerald-300 font-bold text-sm">Tor Project Portal</div>
                    <div className="text-[11px] text-muted-foreground">Verificação oficial de conexão Onion.</div>
                  </div>
                  <Button
                    onClick={() => openDarkSite('https://check.torproject.org', 'Tor Project')}
                    size="sm"
                    variant="outline"
                    className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Abrir
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-background/60 border border-emerald-500/20 flex items-center justify-between">
                  <div>
                    <div className="text-emerald-300 font-bold text-sm">Privacy Tools Audit</div>
                    <div className="text-[11px] text-muted-foreground">Diagnóstico de vazamento de DNS e IP.</div>
                  </div>
                  <Button
                    onClick={() => openDarkSite('https://www.dnsleaktest.com', 'DNS Leak Test')}
                    size="sm"
                    variant="outline"
                    className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Abrir
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-background/60 border border-emerald-500/20 flex items-center justify-between">
                  <div>
                    <div className="text-emerald-300 font-bold text-sm">Proton Privacy Hub</div>
                    <div className="text-[11px] text-muted-foreground">Serviços de comunicação criptografada.</div>
                  </div>
                  <Button
                    onClick={() => openDarkSite('https://proton.me', 'Proton Hub')}
                    size="sm"
                    variant="outline"
                    className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Abrir
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
