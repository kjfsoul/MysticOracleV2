import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";
import { AstrologyWheel } from "./astrology-wheel";

interface BirthChartDisplayProps {
  chartData: {
    positions: Record<
      string,
      { sign: string; degree: number; retrograde?: boolean }
    >;
    validLocation: boolean;
    formattedLocation: string;
  };
  interpretation: string;
  onNewChart?: () => void;
}

export default function BirthChartDisplay({
  chartData,
  interpretation,
  onNewChart,
}: BirthChartDisplayProps) {
  const planetIcons: Record<string, string> = {
    sun: "☉",
    moon: "☽",
    mercury: "☿",
    venus: "♀",
    mars: "♂",
    jupiter: "♃",
    saturn: "♄",
    uranus: "♅",
    neptune: "♆",
    pluto: "♇",
  };

  const signSymbols: Record<string, string> = {
    aries: "♈",
    taurus: "♉",
    gemini: "♊",
    cancer: "♋",
    leo: "♌",
    virgo: "♍",
    libra: "♎",
    scorpio: "♏",
    sagittarius: "♐",
    capricorn: "♑",
    aquarius: "♒",
    pisces: "♓",
  };

  const { positions } = chartData;

  if (!positions) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading chart data...</p>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <Tabs defaultValue="chart" className="w-full">
        {!chartData.validLocation && (
          <Alert className="mb-4">
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              Location could not be verified. Some chart features may be
              limited.
            </AlertDescription>
          </Alert>
        )}

        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="interpretation">Interpretation</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="p-4">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {chartData.formattedLocation}
            </div>

            <div className="aspect-square w-full max-w-2xl mx-auto">
              <AstrologyWheel
                positions={positions}
                size={500}
                interactive={false}
                hideBackground={false}
              />
            </div>

            <div className="grid gap-2 mt-4">
              {Object.entries(positions).map(([planet, data]) => (
                <div
                  key={planet}
                  className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{planetIcons[planet]}</span>
                    <span className="capitalize">{planet}</span>
                  </span>
                  <span>
                    {data.sign}{" "}
                    {signSymbols[data.sign?.toLowerCase() || ""] || "?"}{" "}
                    {data.degree?.toFixed(1) || 0}°
                    {data.retrograde && (
                      <span className="ml-1 text-muted-foreground">℞</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="interpretation" className="p-4">
          <div className="prose prose-invert max-w-none">
            {interpretation.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
