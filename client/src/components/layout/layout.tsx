// Import the CookieBanner component
import { CookieBanner } from './cookie-banner';

// Add the CookieBanner component to your layout
// This should be placed near the end of your layout component, before the closing tag

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}