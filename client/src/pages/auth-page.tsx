import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthForm from "@/components/ui/auth-form";

export default function AuthPage() {
  const { user, isLoading } = useAuth();

  // Redirect if already logged in
  if (!isLoading && user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-dark" 
         style={{
           backgroundImage: `
             radial-gradient(circle at 10% 20%, rgba(74, 33, 116, 0.2) 0%, rgba(26, 26, 74, 0.1) 80%),
             url('https://images.unsplash.com/photo-1518818608552-195ed130cda4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')
           `,
           backgroundBlendMode: 'overlay',
           backgroundAttachment: 'fixed',
           backgroundSize: 'cover'
         }}>
      {/* Auth Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary border border-accent flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-accent">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                </svg>
              </div>
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2 text-accent bg-gradient-to-r from-[#D4AF37] to-[#F5E1A4] bg-clip-text text-transparent">
              Mystic Arcana
            </h1>
            <p className="text-light/80">Discover your cosmic destiny</p>
          </div>
          
          <div className="bg-gradient-to-b from-primary/40 to-secondary/40 backdrop-blur-md rounded-xl border border-accent/30 p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <AuthForm type="login" />
              </TabsContent>
              
              <TabsContent value="register">
                <AuthForm type="register" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-primary/70 to-secondary/70 backdrop-blur-md p-12 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-dark/30 border-2 border-accent flex items-center justify-center">
              <div className="text-accent text-4xl rotate-12 transform transition-transform animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                  <path d="M12 22v-9" />
                  <path d="m15.4 10.7 1.1-11.3 1.3 3.2 2.7-2.1-.7 4.7 2.9 1.8-2.1 2 2.2 3-4.6-.3-.6 4-2.6-2-2.6 2-.6-4-4.6.3 2.2-3-2.1-2 2.9-1.8-.7-4.7 2.7 2.1 1.3-3.2 1.1 11.3" />
                </svg>
              </div>
            </div>
          </div>
          
          <h2 className="font-heading text-4xl font-bold mb-4 text-light">
            Begin Your Mystical Journey
          </h2>
          
          <p className="text-light/90 mb-6">
            Unlock the ancient secrets of tarot and astrology with Mystic Arcana. 
            Discover personalized insights through AI-powered readings, celestial charts, 
            and mystical guidance.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-dark/20 backdrop-blur-sm rounded-lg p-4 border border-light/10">
              <div className="text-accent text-xl mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mx-auto mb-2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m16 10-4 4-4-4" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-light mb-1">Tarot Readings</h3>
              <p className="text-light/70 text-sm">Interactive card spreads with deep insights</p>
            </div>
            
            <div className="bg-dark/20 backdrop-blur-sm rounded-lg p-4 border border-light/10">
              <div className="text-accent text-xl mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mx-auto mb-2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-light mb-1">Astrology Charts</h3>
              <p className="text-light/70 text-sm">Personalized celestial forecasts</p>
            </div>
          </div>
          
          <div className="text-accent/80 text-sm italic">
            "The cosmos holds answers to questions you haven't even thought to ask."
          </div>
        </div>
      </div>
    </div>
  );
}
