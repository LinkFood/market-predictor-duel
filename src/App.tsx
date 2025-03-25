
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { extendedTheme } from "@/lib/chakra-theme";
import { AuthProvider } from "@/lib/auth-context";
import { SubscriptionProvider } from "@/lib/subscription/subscription-context";
import { MarketDataProvider } from "@/lib/market/MarketDataProvider";

// Routes
import AppRoutes from "@/routes/AppRoutes";

function App() {
  return (
    <ChakraProvider value={extendedTheme}>
      <BrowserRouter>
        <ThemeProvider>
          <Toaster />
          <AuthProvider>
            <SubscriptionProvider>
              <MarketDataProvider>
                <AppRoutes />
              </MarketDataProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
