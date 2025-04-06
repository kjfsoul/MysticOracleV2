import MobileNavigation from "@/components/layout/mobile-navigation";
import Navbar from "@/components/layout/navbar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-dark">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : !user ? (
        <Redirect to="/auth" />
      ) : (
        <>
          <MobileNavigation />
          <Navbar />
          <div className="pt-16 md:pt-20">
            <Component />
          </div>
        </>
      )}
    </Route>
  );
}
