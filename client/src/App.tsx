import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import MobileNavigation from "./components/layout/mobile-navigation";
import Navbar from "./components/layout/navbar";
import { AuthProvider } from "./hooks/use-auth";
import { queryClient } from "./lib/queryClient";
import EclipseLandingPage from "./pages/EclipseLandingPage";

// Lazy load pages
const pages = {
  ReadingsPage: lazy(() => import("./pages/readings-page")),
  ProfilePage: lazy(() => import("./pages/profile-page")),
  TarotPage: lazy(() => import("./pages/tarot-page")),
  TarotCardsPage: lazy(() => import("./pages/tarot-cards-page")),
  AstrologyPage: lazy(() => import("./pages/astrology-page")),
  InteractiveWheelPage: lazy(() => import("./pages/interactive-wheel-page")),
  WheelDebugPage: lazy(() => import("./pages/wheel-debug")),
  JournalPage: lazy(() => import("./pages/journal-page")),
  PricingPage: lazy(() => import("./pages/pricing-page")),
  DebugAuthPage: lazy(() => import("./pages/debug-auth")),
  BlogPage: lazy(() => import("./pages/blog-page")),
  ShopPage: lazy(() => import("./pages/shop-page")),
  AuthPage: lazy(() => import("./pages/auth-page")),
  LandingPage: lazy(() => import("./pages/landing-page")),
  ZodiacSpreadPage: lazy(() => import("./pages/zodiac-spread-page")),
  NotFound: lazy(() => import("./pages/not-found")),
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <div className="flex-1 container mx-auto py-6 px-4 mt-16">
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route path="/" component={pages.LandingPage} />
                <Route path="/auth" component={pages.AuthPage} />
                <Route path="/home" component={pages.ReadingsPage} />
                <Route path="/profile" component={pages.ProfilePage} />
                <Route path="/readings" component={pages.ReadingsPage} />
                <Route path="/tarot" component={pages.TarotPage} />
                <Route path="/tarot-cards" component={pages.TarotCardsPage} />
                <Route
                  path="/zodiac-spread"
                  component={pages.ZodiacSpreadPage}
                />
                <Route path="/astrology" component={pages.AstrologyPage} />
                <Route
                  path="/interactive-wheel"
                  component={pages.InteractiveWheelPage}
                />
                <Route path="/wheel-debug" component={pages.WheelDebugPage} />
                <Route path="/journal" component={pages.JournalPage} />
                <Route path="/pricing" component={pages.PricingPage} />
                <Route path="/debug-auth" component={pages.DebugAuthPage} />
                <Route path="/blog" component={pages.BlogPage} />
                <Route path="/blog/:slug" component={pages.BlogPage} />
                <Route
                  path="/blog/category/:category"
                  component={pages.BlogPage}
                />
                <Route path="/settings" component={pages.DebugAuthPage} />
                <Route path="/upgrade" component={pages.PricingPage} />
                <Route path="/eclipse" component={EclipseLandingPage} />
                <Route path="/shop" component={pages.ShopPage} />
                <Route component={pages.NotFound} />
              </Switch>
            </Suspense>
          </div>
          <MobileNavigation />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
