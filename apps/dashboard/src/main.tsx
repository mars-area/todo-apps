import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider"
import ErrorBoundary from "@/pages/global-error";
import AppRoutes from "@/routes";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 60, // 1 hours,
      gcTime: 1000 * 60 * 60, // 1 hour
      refetchOnWindowFocus: false,
    }
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ErrorBoundary>
          <AppRoutes />
          <Toaster />
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
