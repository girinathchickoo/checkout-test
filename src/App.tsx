import "./index.css";
import config from "./utils/wagmiconfig";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WidgetContainer from "./components/WidgetContainer";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import dynamicConfig from "./utils/dynamiconfig";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
const queryClient = new QueryClient();
function App() {
  return (
    <WagmiProvider config={config}>
      <DynamicContextProvider
        settings={{
          environmentId: "5d12d5a9-6206-433b-85b8-25fc9f0da5e3",
          walletConnectors: [SolanaWalletConnectors],
          initialAuthenticationMode: "connect-only",
          enableVisitTrackingOnConnectOnly: true,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <WidgetContainer />
        </QueryClientProvider>
      </DynamicContextProvider>
    </WagmiProvider>
  );
}

export default App;
