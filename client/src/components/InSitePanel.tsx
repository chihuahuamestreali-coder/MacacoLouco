import { useState } from 'react';
import { ExternalLink, Loader2, TerminalSquare, Bookmark } from 'lucide-react';
import { copyInjectionScript, openSiteInNewTab, toBookmarklet, IN_SITE_STEPS, BOOKMARKLET_STEPS } from '@/lib/inSiteInjection';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type InSitePanelProps = {
  siteName: string;
  siteUrl: string;
  accentText: string;
  accentHex: string;
  disabled: boolean;
  features: string[];
  buildScript: () => string;
  onAfterCopy?: () => void;
};

/**
 * Painel reutilizável de INJEÇÃO IN-SITE.
 *
 * Substitui o método antigo (about:blank + document.write + redirect), que era
 * cross-origin e não transferia nada para o site real. Aqui o script gerado é
 * copiado e rodado NO DOMÍNIO do site oficial (console F12 ou bookmarklet).
 */
export default function InSitePanel({
  siteName,
  siteUrl,
  accentText,
  accentHex,
  disabled,
  features,
  buildScript,
  onAfterCopy,
}: InSitePanelProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleCopyScript = async () => {
    if (disabled) return;
    setIsCopying(true);
    try {
      const script = buildScript();
      const result = await copyInjectionScript(script);
      if (result.success) {
        onAfterCopy?.();
        toast.success(`Script de injeção ${siteName} copiado!`, {
          description: 'Agora abra o site, pressione F12, cole no Console e dê Enter.',
        });
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      console.error(e);
      toast.error(`Erro ao copiar o script de injeção ${siteName}`);
    } finally {
      setIsCopying(false);
    }
  };

  const handleCopyBookmarklet = async () => {
    if (disabled) return;
    setIsBookmarking(true);
    try {
      const bookmarklet = toBookmarklet(buildScript());
      const result = await copyInjectionScript(bookmarklet);
      if (result.success) {
        onAfterCopy?.();
        toast.success(`Bookmarklet ${siteName} copiado!`, {
          description: 'Crie um favorito com o código e clique nele com a guia do site aberta.',
        });
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      console.error(e);
      toast.error(`Erro ao copiar o bookmarklet ${siteName}`);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleOpenSite = () => {
    if (disabled) return;
    openSiteInNewTab(siteUrl);
    toast.info(`${siteName} aberto em nova guia`, {
      description: 'Pressione F12 → Console → cole o script → Enter, ou use o bookmarklet.',
    });
  };

  return (
    <div className="rounded-xl bg-background/50 border border-border/50 p-4 text-xs font-mono space-y-3">
      <p className={`font-bold mb-1 flex items-center gap-2 ${accentText}`}>
        <TerminalSquare className="w-4 h-4" />
        COMO INJETAR NO SITE REAL ({features.length} módulos: {features.join(', ')})
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleOpenSite}
          disabled={disabled}
          className={`w-full sm:w-auto bg-transparent hover:bg-background/80 ${accentText} border ${accentHex === '#00d9ff' ? 'border-primary/60' : 'border-current/60'} font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2`}
        >
          <ExternalLink className="w-4 h-4" />
          Abrir Site Oficial
        </Button>
        <Button
          onClick={handleCopyScript}
          disabled={disabled || isCopying}
          className="w-full sm:w-auto text-white font-bold px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(to right, ${accentHex}, ${accentHex})` }}
        >
          {isCopying ? <Loader2 className="w-5 h-5 animate-spin" /> : <TerminalSquare className="w-5 h-5" />}
          Copiar Script de Injeção
        </Button>
        <Button
          onClick={handleCopyBookmarklet}
          disabled={disabled || isBookmarking}
          variant="outline"
          className="w-full sm:w-auto border-current/40 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2"
        >
          {isBookmarking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bookmark className="w-4 h-4" />}
          Copiar Bookmarklet
        </Button>
      </div>

      <div className="space-y-1.5">
        <p className={`font-bold ${accentText} flex items-center gap-2`}>
          <TerminalSquare className="w-3.5 h-3.5" />
          FLUXO CONSOLE
        </p>
        {IN_SITE_STEPS.map((step, i) => (
          <p key={i} className="text-muted-foreground">
            <span className={`font-bold ${accentText}`}>{i + 1}.</span> {step}
          </p>
        ))}
      </div>

      <div className="space-y-1.5 pt-2 border-t border-border/40">
        <p className={`font-bold ${accentText} flex items-center gap-2`}>
          <Bookmark className="w-3.5 h-3.5" />
          FLUXO BOOKMARKLET (RECOMENDADO)
        </p>
        {BOOKMARKLET_STEPS.map((step, i) => (
          <p key={i} className="text-muted-foreground">
            <span className={`font-bold ${accentText}`}>{i + 1}.</span> {step}
          </p>
        ))}
        <p className="text-yellow-400/90 mt-2 pt-2 border-t border-border/40">
          ⚠️ O script roda NO DOMÍNIO do site real (sem aba intermediária, sem redirect). Se o console bloquear o paste,
          digite "allow pasting" + Enter, ou use o bookmarklet.
        </p>
      </div>
    </div>
  );
}
