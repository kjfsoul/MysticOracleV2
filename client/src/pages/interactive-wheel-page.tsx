import React, { useState } from 'react';
import { format } from 'date-fns';
import AstrologyWheel from '../components/astrology/astrology-wheel';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, InfoIcon, DownloadIcon, Share2Icon } from 'lucide-react';

export default function InteractiveWheelPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>('12:00');
  const [location, setLocation] = useState<string>('');
  const [showControls, setShowControls] = useState<boolean>(true);

  const handleGenerateChart = () => {
    // In a real implementation, this would fetch accurate planetary positions
    // based on the date, time and location from a proper astrology API
    toast({
      title: "Chart Generated",
      description: `Chart for ${format(date, 'MMMM d, yyyy')} at ${time} ${location ? `in ${location}` : ''}`,
      variant: "default"
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your chart is being prepared for download.",
      variant: "default"
    });
    // Actual download implementation would go here
  };

  const handleShare = () => {
    // Simple share implementation
    const shareText = `Check out my astrological chart for ${format(date, 'MMMM d, yyyy')}!`;

    if (navigator.share) {
      navigator.share({
        title: 'My Astrological Chart',
        text: shareText,
        // url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      toast({
        title: "Share",
        description: "Sharing is not supported in your browser.",
        variant: "default"
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Interactive Astrology Wheel"
        description="Explore the positions of celestial bodies and their influence on your life"
      />

      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <Card className="md:col-span-1 border-gold/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-gold" />
              Chart Settings
            </CardTitle>
            <CardDescription>
              Adjust date, time and location to view different charts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={format(date, 'yyyy-MM-dd')}
                  onChange={(e) => setDate(new Date(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time (optional)</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (optional)</Label>
                <div className="relative">
                  <Input
                    id="location"
                    type="text"
                    placeholder="e.g. New York, USA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={isValidating ? "pr-8" : ""}
                  />
                  {isValidating && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <span className="animate-spin">⌛</span>
                    </div>
                  )}
                  {!isValidating && isValid && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500">
                      ✓
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerateChart} 
              className="w-full bg-gold hover:bg-gold/80 text-background"
            >
              Generate Chart
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-2">
          <Card className="border-gold/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  Astrology Wheel
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowControls(!showControls)}>
                    <InfoIcon className="h-4 w-4 mr-1" />
                    {showControls ? 'Hide' : 'Show'} Details
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownload}>
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2Icon className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <AstrologyWheel 
                  date={date}
                  birthTime={time}
                  birthLocation={location}
                  interactive={false}
                  size={500}
                />
              </div>
            </CardContent>
          </Card>

          {showControls && (
            <Card className="mt-6 border-gold/20">
              <CardHeader>
                <CardTitle className="text-lg">Chart Interpretation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This interactive wheel shows the positions of planets in the zodiac signs for the selected date and time.
                  Hover over planets to see detailed information about their positions.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gold">What This Chart Shows:</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>The current positions of planets in the zodiac</li>
                      <li>The relationships between planets (aspects)</li>
                      <li>The houses and their planetary rulers</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gold">How to Use It:</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Set a specific date to see planetary positions for that time</li>
                      <li>Compare different dates to see how planets move</li>
                      <li>Look for aspects (relationships) between planets</li>
                      <li>Check your birth chart to understand your astrological makeup</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}