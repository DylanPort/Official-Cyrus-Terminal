import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WalletContextProvider } from './components/WalletContextProvider';
import AiHelper from './components/AiHelper';
import { LoadingSpinner } from './components/LoadingSpinner';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ProfileView from "./pages/ProfileView";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import CreateListing from "./pages/CreateListing";
import CreatorsDashboard from "./pages/CreatorsDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <WalletContextProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile/edit" element={<Profile />} />
                  <Route path="/profile/:walletAddress" element={<ProfileView />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/create-listing" element={<CreateListing />} />
                  <Route path="/creators-dashboard" element={<CreatorsDashboard />} />
                </Routes>
              </Suspense>
              <AiHelper />
            </Router>
          </TooltipProvider>
        </QueryClientProvider>
      </WalletContextProvider>
    </React.StrictMode>
  );
}

export default App;