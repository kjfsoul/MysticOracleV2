
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth-fixed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export default function WheelDebugPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.username || "Test User",
    birthDate: "2000-01-01",
    birthTime: "12:00",
    birthLocation: "New York, NY, United States",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [wheelData, setWheelData] = useState<null | any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setWheelData({
        ascendant: "Aries",
        midheaven: "Capricorn",
        sun: { sign: "Capricorn", house: 10, degree: 11 },
        moon: { sign: "Libra", house: 7, degree: 23 },
        mercury: { sign: "Sagittarius", house: 9, degree: 15 },
        venus: { sign: "Aquarius", house: 11, degree: 3 },
        mars: { sign: "Scorpio", house: 8, degree: 27 },
        jupiter: { sign: "Taurus", house: 2, degree: 9 },
        saturn: { sign: "Aries", house: 1, degree: 5 },
        houses: [
          { number: 1, sign: "Aries", degree: 0 },
          { number: 2, sign: "Taurus", degree: 0 },
          { number: 3, sign: "Gemini", degree: 0 },
          { number: 4, sign: "Cancer", degree: 0 },
          { number: 5, sign: "Leo", degree: 0 },
          { number: 6, sign: "Virgo", degree: 0 },
          { number: 7, sign: "Libra", degree: 0 },
          { number: 8, sign: "Scorpio", degree: 0 },
          { number: 9, sign: "Sagittarius", degree: 0 },
          { number: 10, sign: "Capricorn", degree: 0 },
          { number: 11, sign: "Aquarius", degree: 0 },
          { number: 12, sign: "Pisces", degree: 0 },
        ],
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader 
        title="Interactive Astrology Wheel Debug" 
        subtitle="Test the wheel functionality with sample data"
      />
      
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <Card className="border-gold/30">
          <CardHeader>
            <CardTitle>Input Data</CardTitle>
            <CardDescription>
              Enter birth details to generate a sample chart
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-gold/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="border-gold/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthTime">Birth Time</Label>
                <Input
                  id="birthTime"
                  name="birthTime"
                  type="time"
                  value={formData.birthTime}
                  onChange={handleInputChange}
                  className="border-gold/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthLocation">Birth Location</Label>
                <Input
                  id="birthLocation"
                  name="birthLocation"
                  value={formData.birthLocation}
                  onChange={handleInputChange}
                  className="border-gold/30"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gold hover:bg-gold/80 text-background"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Sample Chart
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="border-gold/30">
          <CardHeader>
            <CardTitle>Chart Visualization</CardTitle>
            <CardDescription>
              Interactive wheel visualization preview
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-80">
                <Loader2 className="h-12 w-12 animate-spin text-gold" />
              </div>
            ) : wheelData ? (
              <div className="space-y-4">
                <div className="relative w-80 h-80 mx-auto rounded-full border-2 border-gold/30 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg font-semibold">{formData.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(formData.birthDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">{formData.birthTime}</p>
                    </div>
                  </div>
                  
                  {/* Wheel segments for houses */}
                  {wheelData.houses.map((house: any, i: number) => (
                    <div 
                      key={i}
                      className="absolute w-full h-full"
                      style={{
                        transform: `rotate(${i * 30}deg)`,
                        transformOrigin: 'center',
                      }}
                    >
                      <div className="absolute top-0 left-1/2 h-full w-px bg-gold/30" />
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs">
                        {house.number}
                      </div>
                    </div>
                  ))}
                  
                  {/* Center circle */}
                  <div className="absolute inset-0 m-auto w-20 h-20 rounded-full border border-gold/50 flex items-center justify-center">
                    <span className="text-xs">Asc: {wheelData.ascendant}</span>
                  </div>
                </div>
                
                {/* Planet positions */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gold">☉</span>
                    <span>Sun: {wheelData.sun.sign} ({wheelData.sun.house}H)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gold">☽</span>
                    <span>Moon: {wheelData.moon.sign} ({wheelData.moon.house}H)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gold">☿</span>
                    <span>Mercury: {wheelData.mercury.sign}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gold">♀</span>
                    <span>Venus: {wheelData.venus.sign}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gold">♂</span>
                    <span>Mars: {wheelData.mars.sign}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gold">♃</span>
                    <span>Jupiter: {wheelData.jupiter.sign}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-80 text-muted-foreground">
                Submit the form to see a sample wheel
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          This is a debug version of the interactive astrology wheel. The full implementation will include accurate astronomical calculations.
        </p>
      </div>
    </div>
  );
}
