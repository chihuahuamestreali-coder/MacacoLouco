import { useLocation } from 'wouter';
import { ShoppingCart, Instagram, Facebook, Video, Bot, Sparkles, Mail, ShieldAlert, Cpu, ArrowRight, Github, MessageCircle, Package, ShoppingBag, Shirt, Gem, Cloud } from 'lucide-react';
import DarkSpecialBanner from '@/components/DarkSpecialBanner';
import VanGoghBanner from '@/components/VanGoghBanner';
import ScoobyDooBanner from '@/components/ScoobyDooBanner';

export default function Home() {
  const [, setLocation] = useLocation();

  const generators = [
    { 
      title: 'AliExpress Master', 
      desc: 'Bypass anti-bot + Injeção 16+ ferramentas anti-detecção', 
      path: '/aliexpress', 
      icon: ShoppingCart, 
      color: 'from-red-500/15 via-red-500/5 to-transparent border-red-500/30 text-red-400 hover:border-red-500/80',
      badge: 'BLINDAGEM 16+'
    },
    { 
      title: 'Mercado Livre Master', 
      desc: 'Blindagem ML Device ID & Tracking + Injeção 16+ ferramentas anti-detecção', 
      path: '/mercado-livre', 
      icon: ShoppingCart, 
      color: 'from-yellow-400/15 via-yellow-400/5 to-transparent border-yellow-400/30 text-yellow-300 hover:border-yellow-400/80',
      badge: 'ML ANTI-FRAUDE'
    },
    { 
      title: 'Amazon Master', 
      desc: 'Tokens de device Amazon blindados + Injeção 16+ anti-detecção', 
      path: '/amazon', 
      icon: Package, 
      color: 'from-amber-600/15 via-amber-600/5 to-transparent border-amber-500/30 text-amber-400 hover:border-amber-500/80',
      badge: 'ANTI-FRAUD PRO'
    },
    { 
      title: 'Shopee Master', 
      desc: 'Bypass SACS anti-cheating + Device ID & SPSID blindados 16+', 
      path: '/shopee', 
      icon: ShoppingBag, 
      color: 'from-orange-600/15 via-orange-600/5 to-transparent border-orange-500/30 text-orange-400 hover:border-orange-500/80',
      badge: 'SACS BYPASS'
    },
    { 
      title: 'SHEIN Master', 
      desc: 'Nova identidade MAC/IMEI + cookies de sessão, blindagem anti-bot 16+ e app nativo', 
      path: '/shein', 
      icon: Shirt, 
      color: 'from-fuchsia-600/15 via-fuchsia-600/5 to-transparent border-fuchsia-500/30 text-fuchsia-400 hover:border-fuchsia-500/80',
      badge: 'ANTI-BOT 16+'
    },
    { 
      title: 'Cider Master', 
      desc: 'Nova identidade MAC/IMEI + cookies de sessão, blindagem anti-fraude e app nativo', 
      path: '/cider', 
      icon: Gem, 
      color: 'from-violet-600/15 via-violet-600/5 to-transparent border-violet-500/30 text-violet-400 hover:border-violet-500/80',
      badge: 'ANTI-FRAUD PRO'
    },
    { 
      title: 'UGPhone Master', 
      desc: 'Nova identidade MAC/IMEI + sessão e cookies do portal cloud phone, blindagem 16+ e app nativo', 
      path: '/ugphone', 
      icon: Cloud, 
      color: 'from-orange-600/15 via-red-600/5 to-transparent border-orange-500/30 text-orange-400 hover:border-orange-500/80',
      badge: 'CLOUD PHONE PRO'
    },
    { 
      title: 'Instagram Manager', 
      desc: 'Gerador de dispositivo mobile & injeção direta de conta', 
      path: '/instagram', 
      icon: Instagram, 
      color: 'from-pink-500/15 via-pink-500/5 to-transparent border-pink-500/30 text-pink-400 hover:border-pink-500/80',
      badge: 'MOBILE SPDF'
    },
    { 
      title: 'Facebook Manager', 
      desc: 'Spoofing de fingerprint, hardware e criação de perfis FB', 
      path: '/facebook', 
      icon: Facebook, 
      color: 'from-blue-600/15 via-blue-600/5 to-transparent border-blue-500/30 text-blue-400 hover:border-blue-500/80',
      badge: 'ADS BYPASS'
    },
    { 
      title: 'TikTok Manager', 
      desc: 'Criação e isolamento de hardware para automação TikTok', 
      path: '/tiktok', 
      icon: Video, 
      color: 'from-cyan-500/15 via-cyan-500/5 to-transparent border-cyan-500/30 text-cyan-400 hover:border-cyan-500/80',
      badge: 'TIKTOK PRO'
    },
    { 
      title: 'Manus AI Master', 
      desc: 'Injeção de perfil e sessão agente Manus autônoma', 
      path: '/manus', 
      icon: Bot, 
      color: 'from-purple-500/15 via-purple-500/5 to-transparent border-purple-500/30 text-purple-400 hover:border-purple-500/80',
      badge: 'AGENT CORE'
    },
    { 
      title: 'Claude AI Master', 
      desc: 'Spoofing avançado para sessões e prompts Claude', 
      path: '/claude', 
      icon: Sparkles, 
      color: 'from-amber-500/15 via-amber-500/5 to-transparent border-amber-500/30 text-amber-400 hover:border-amber-500/80',
      badge: 'CLAUDE API'
    },
    { 
      title: 'Gmail Generator', 
      desc: 'Gerador automatizado de contas e dados pessoais fake', 
      path: '/gmail', 
      icon: Mail, 
      color: 'from-rose-600/15 via-rose-600/5 to-transparent border-rose-500/30 text-rose-400 hover:border-rose-500/80',
      badge: 'GMAIL API'
    },
    { 
      title: 'Email Forwarder', 
      desc: 'Gerenciador de caixas de entrada e emails temporários', 
      path: '/emails', 
      icon: ShieldAlert, 
      color: 'from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/30 text-emerald-400 hover:border-emerald-500/80',
      badge: 'INBOX PRO'
    },
    { 
      title: 'Temu Master', 
      desc: 'Bypass anti-bot + Injeção 16+ ferramentas & App Nativo Temu', 
      path: '/temu', 
      icon: ShoppingCart, 
      color: 'from-orange-500/15 via-orange-500/5 to-transparent border-orange-500/30 text-orange-400 hover:border-orange-500/80',
      badge: 'BLINDAGEM 16+'
    },
    { 
      title: 'GitHub Manager', 
      desc: 'Cadastro direto (github.com/signup) com injeção 16+, shield anti-abuse e fingerprint blindado', 
      path: '/github-manager', 
      icon: Github, 
      color: 'from-slate-600/15 via-slate-600/5 to-transparent border-slate-500/30 text-slate-200 hover:border-slate-400/80',
      badge: 'SIGNUP BLINDADO'
    },
    { 
      title: 'DARK MASTER HUB', 
      desc: 'Menu mestre de privacidade: túneis onion, spoofing de headers e portais blindados', 
      path: '/discord-manager', 
      icon: MessageCircle, 
      color: 'from-indigo-600/15 via-indigo-600/5 to-transparent border-indigo-500/30 text-indigo-300 hover:border-indigo-400/80',
      badge: 'HUB PRIVACIDADE'
    },
    { 
      title: 'Discord - Site', 
      desc: 'Registro direto (discord.com/register) com injeção 16+, shield anti-bot e superprops sintéticas', 
      path: '/discord-site', 
      icon: MessageCircle, 
      color: 'from-violet-600/15 via-violet-600/5 to-transparent border-violet-500/30 text-violet-300 hover:border-violet-400/80',
      badge: 'REGISTER 16+'
    },
    { 
      title: 'Ursa', 
      desc: 'Abertura de link externo e serviços associados', 
      path: '/ursa', 
      icon: Bot, 
      color: 'from-blue-600/15 via-blue-600/5 to-transparent border-blue-500/30 text-blue-400 hover:border-blue-500/80',
      badge: 'EXTERNAL SITE'
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12" style={{ backgroundImage: "linear-gradient(rgba(7,12,31,0.94), rgba(7,12,31,0.98)), url('/manus-storage/field-manual-hero_13e2d1fa.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 border-b border-border/40 pb-8">
          <div className="mb-5 flex items-center justify-center gap-3">
            <img src="/manus-storage/device-master-mark_0b9ede57.png" alt="Símbolo Device Master" className="h-11 w-11 rounded-xl border border-teal-300/30 bg-slate-950/70 p-2" />
            <div className="text-left"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-teal-300">FIELD MANUAL / 19 MÓDULOS + 3 HUBS</p><p className="text-xs text-slate-400">Leia o escopo antes de operar</p></div>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs mb-4 shadow-sm">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span>ALI-DEV-MAN PRO v2.0 • CENTRAL DE GERENCIAMENTO DE DISPOSITIVOS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-3">
            PAINEL DE GERADORES & BYPASS
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Escolha abaixo qual plataforma deseja gerenciar. Cada card informa a missão do módulo; dentro dele, o botão Guia do menu explica campos, fluxo recomendado e por que alguns dados não aparecem.
          </p>
        </div>

        {/* Grid de Cards (Estilo Quadradinho) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {generators.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => setLocation(item.path)}
                className={`group relative rounded-2xl border bg-gradient-to-br ${item.color} p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between backdrop-blur-sm`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3.5 rounded-xl bg-background/90 border border-border/60 shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-background/80 border border-border/50 text-muted-foreground tracking-wider">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 tracking-wide group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
                
                <div className="mt-8 pt-4 border-t border-border/20 flex items-center justify-between text-xs font-bold">
                  <span className="opacity-70 group-hover:opacity-100 transition-opacity">ABRIR MÓDULO</span>
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center transform group-hover:translate-x-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dark Special Banner - Horizontal, Preto com Caveira */}
        <DarkSpecialBanner onClick={() => setLocation('/dark')} />

        {/* Van Gogh Master Banner - mesma linguagem visual, com submenus independentes */}
        <VanGoghBanner onClick={() => setLocation('/van-gogh')} />

        {/* Scooby-Doo Delivery Hub Banner */}
        <ScoobyDooBanner onClick={() => setLocation('/scooby-doo')} />

        {/* Footer */}
        <div className="mt-16 text-center text-xs text-muted-foreground border-t border-border/30 pt-6">
          <p>AliDevMan Pro Security Suite • Gerenciamento Multi-Plataforma com Anti-Detecção Avançada • 2026</p>
        </div>
      </div>
    </div>
  );
}
