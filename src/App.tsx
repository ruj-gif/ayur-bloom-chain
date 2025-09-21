import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BatchUpdatePage from "./pages/BatchUpdatePage";
import LabReportsPage from "./pages/LabReportsPage";
import ScanUpdatePage from "./pages/ScanUpdatePage";
import RegisterHarvestPage from "./pages/RegisterHarvestPage";
import QRScannerPage from "./pages/QRScannerPage";
import ProductTracePage from "./pages/ProductTracePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Distributor Routes */}
            <Route path="/update-batch" element={<BatchUpdatePage />} />
            <Route path="/lab-reports" element={<LabReportsPage />} />
            <Route path="/scan-update" element={<ScanUpdatePage />} />
            {/* Farmer Routes */}
            <Route path="/register-harvest" element={<RegisterHarvestPage />} />
            {/* Consumer Routes */}
            <Route path="/scanner" element={<QRScannerPage />} />
            <Route path="/product-trace" element={<ProductTracePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
