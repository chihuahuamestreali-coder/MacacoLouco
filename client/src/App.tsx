import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Router, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AliExpressManager from "./pages/AliExpressManager";
import EmailManager from "./pages/EmailManager";
import FacebookManager from "./pages/FacebookManager";
import InstagramManager from "./pages/InstagramManager";
import ManusManager from "./pages/ManusManager";
import TikTokManager from "./pages/TikTokManager";
import GmailManager from "./pages/GmailManager";
import ClaudeManager from "./pages/ClaudeManager";
import TemuManager from "./pages/TemuManager";
import MercadoLibreManager from "./pages/MercadoLibreManager";
import GitHubManager from "./pages/GitHubManager";
import DiscordSiteManager from "./pages/DiscordSiteManager";
import ScoobyDooHub from "./pages/ScoobyDooHub";
import AmazonManager from "./pages/AmazonManager";
import ShopeeManager from "./pages/ShopeeManager";
import PrivateTunnelsManager from "./pages/PrivateTunnelsManager";
import DarkSpecial from "./pages/DarkSpecial";
import UrsaManager from "@/pages/UrsaManager";
import VanGoghHub from "@/pages/VanGoghHub";
import SheinManager from "@/pages/SheinManager";
import CiderManager from "@/pages/CiderManager";
import UgphoneManager from "@/pages/UgphoneManager";

function AppRouter() {
  return (
    <Router base="/Gerador_Manus-Infinity">
      <Switch>
      {/* Rotas específicas primeiro */}
      <Route path={"/emails"} component={EmailManager} />
      <Route path={"/facebook"} component={FacebookManager} />
      <Route path={"/instagram"} component={InstagramManager} />
      <Route path={"/manus"} component={ManusManager} />
      <Route path={"/tiktok"} component={TikTokManager} />
      <Route path={"/gmail"} component={GmailManager} />
      <Route path={"/claude"} component={ClaudeManager} />
      <Route path={"/temu"} component={TemuManager} />
      <Route path={"/mercado-livre"} component={MercadoLibreManager} />
      <Route path={"/amazon"} component={AmazonManager} />
      <Route path={"/shopee"} component={ShopeeManager} />
      <Route path={"/discord-site"} component={DiscordSiteManager} />
      <Route path={"/github-manager"} component={GitHubManager} />
      <Route path={"/discord-manager"} component={PrivateTunnelsManager} />
      <Route path={"/private-tunnels"} component={PrivateTunnelsManager} />
      <Route path={"/dark"} component={DarkSpecial} />
      <Route path={"/scooby-doo"} component={ScoobyDooHub} />
      <Route path={"/shein"} component={SheinManager} />
      <Route path={"/cider"} component={CiderManager} />
      <Route path={"/ugphone"} component={UgphoneManager} />
      <Route path={"/ursa"} component={UrsaManager} />
      <Route path={"/van-gogh"} component={VanGoghHub} />
      <Route path={"/404"} component={NotFound} />
      {/* Rotas raiz por último */}
      <Route path={"/aliexpress"} component={AliExpressManager} />
      <Route path={"/"} component={Home} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch></Router>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
