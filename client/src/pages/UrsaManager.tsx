import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Loader2, Bot, ExternalLink } from 'lucide-react';

export default function UrsaManager() {
  const [, setLocation] = useLocation();

  const openSite = () => {
    window.open('https://tuamaeaquelaursa.com/', '_blank');
  };

  useEffect(() => {
    // Abre o site em uma guia NOVA, sem alterar esta página (o gerador permanece)
    const timer = setTimeout(() => {
      openSite();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full border border-blue-500/30 rounded-2xl p-8 bg-card/60 backdrop-blur-md text-center shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Bot className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-blue-400 mb-2">URSA EXTERNAL LINK</h1>
        <p className="text-xs text-muted-foreground mb-6">
          O site externo está abrindo em uma guia nova. Esta página permanece disponível.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-blue-300 mb-6">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Abrindo em nova guia...</span>
        </div>

        <button
          onClick={openSite}
          className="w-full mb-3 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 border border-blue-500/50 rounded transition-all font-bold text-xs flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          ABRIR URSA (NOVA GUIA)
        </button>

        <div className="mt-6 pt-4 border-t border-border/40">
          <button
            onClick={() => setLocation('/')}
            className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Voltar ao Menu Principal
          </button>
        </div>
      </div>
    </div>
  );
}
