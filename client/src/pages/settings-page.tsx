import { useEffect } from "react";
import { useLocation } from "wouter";

export default function SettingsPage() {
  const [_, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect to profile page with settings tab
    setLocation("/profile");
  }, [setLocation]);
  
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gold mb-4">Redirecting to settings...</h2>
        <p className="text-muted-foreground">You'll be redirected to your profile settings automatically.</p>
      </div>
    </div>
  );
}