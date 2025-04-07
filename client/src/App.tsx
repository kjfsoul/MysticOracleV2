import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import MobileNavigation from "./components/layout/mobile-navigation";
import Navbar from "./components/layout/navbar";
import CosmicBackground from "./components/ui/cosmic-background";
import { AuthProvider } from "./hooks/use-auth";
import { queryClient } from "./lib/queryClient";
import EclipseLandingPage from "./pages/EclipseLandingPage";
import TarotInterpretationDemo from "./pages/tarot-interpretation-demo";

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
  SimpleAuthPage: lazy(() => import("./pages/simple-auth")),
  BasicAuthPage: lazy(() => import("./pages/basic-auth")),
  VeryBasicAuthPage: lazy(() => import("./pages/very-basic-auth")),
  SuperSimpleAuthPage: lazy(() => import("./pages/super-simple-auth")),
  PlainAuthPage: lazy(() => import("./pages/plain-auth")),
  ExactAuthPage: lazy(() => import("./pages/exact-auth")),
  LandingPage: lazy(() => import("./pages/landing-page")),
  ZodiacSpreadPage: lazy(() => import("./pages/zodiac-spread-page")),
  AgentLearningDemo: lazy(() => import("./pages/agent-learning-demo")),
  TestPage: lazy(() => import("./pages/test-page")),
  NotFound: lazy(() => import("./pages/not-found")),
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-background relative">
          <CosmicBackground />
          <Navbar />
          <div className="flex-1 container mx-auto py-8 px-4 mt-16 mb-16 md:mb-0">
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route path="/" component={pages.LandingPage} />
                <Route path="/auth" component={pages.ExactAuthPage} />
                <Route path="/simple-auth" component={pages.SimpleAuthPage} />
                <Route path="/basic-auth" component={pages.BasicAuthPage} />
                <Route
                  path="/very-basic-auth"
                  component={pages.VeryBasicAuthPage}
                />
                <Route
                  path="/super-simple-auth"
                  component={pages.SuperSimpleAuthPage}
                />
                <Route path="/plain-auth" component={pages.PlainAuthPage} />
                <Route path="/exact-auth" component={pages.ExactAuthPage} />
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
                <Route
                  path="/agent-learning"
                  component={pages.AgentLearningDemo}
                />
                <Route
                  path="/tarot-interpretation"
                  component={TarotInterpretationDemo}
                />
                <Route path="/test" component={pages.TestPage} />
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
