import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './hooks/use-auth-fixed';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/layout/navbar-fixed';
import MobileNavigation from './components/layout/mobile-navigation';

// Page imports
const ReadingsPage = lazy(() => import('./pages/readings-page'));
const ProfilePage = lazy(() => import('./pages/profile-page'));
const TarotPage = lazy(() => import('./pages/tarot-page'));
const TarotCardsPage = lazy(() => import('./pages/tarot-cards-page'));
const AstrologyPage = lazy(() => import('./pages/astrology-page'));
const InteractiveWheelPage = lazy(() => import('./pages/interactive-wheel-page'));
const WheelDebugPage = lazy(() => import("./pages/wheel-debug"));
const JournalPage = lazy(() => import("./pages/journal-page"));
const PricingPage = lazy(() => import("./pages/pricing-page"));
const DebugAuthPage = lazy(() => import("./pages/debug-auth"));
const BlogPage = lazy(() => import('./pages/blog-page'));
const ShopPage = lazy(() => import('./pages/shop-page'));
const AuthPage = lazy(() => import('./pages/auth-page'));
const LandingPage = lazy(() => import('./pages/landing-page'));
const ZodiacSpreadPage = lazy(() => import('./pages/zodiac-spread-page'));
const NotFound = lazy(() => import('./pages/not-found'));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <div className="flex-1 container mx-auto py-6 px-4 mt-16">
            <Suspense fallback={<div>Loading...</div>}> {/* Added Suspense fallback */}
              <Switch>
                <Route path="/" component={LandingPage} />
                <Route path="/auth" component={AuthPage} />
                <Route path="/home" component={ReadingsPage} />
                <Route path="/profile" component={ProfilePage} />
                <Route path="/readings" component={ReadingsPage} />
                <Route path="/tarot" component={TarotPage} />
                <Route path="/tarot-cards" component={TarotCardsPage} />
                <Route path="/zodiac-spread" component={ZodiacSpreadPage} />
                <Route path="/astrology" component={AstrologyPage} />
                <Route path="/interactive-wheel" component={InteractiveWheelPage} />
                <Route path="/wheel-debug" component={WheelDebugPage} />
                <Route path="/journal" component={JournalPage} />
                <Route path="/pricing" component={PricingPage} />
                <Route path="/debug-auth" component={DebugAuthPage} />
                <Route path="/blog" component={BlogPage} />
                <Route path="/blog/:slug" component={BlogPage} />
                <Route path="/blog/category/:category" component={BlogPage} />
                <Route path="/settings" component={DebugAuthPage} />
                <Route path="/upgrade" component={PricingPage} />
                <Route path="/shop" component={ShopPage} />
                <Route component={NotFound} />
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