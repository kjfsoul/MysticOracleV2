import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { a, p } from "framer-motion/dist/types.d-B50aGbjN";
import { Loader2, View } from "lucide-react";
import React from "react";
import { any } from "zod";

interface TarotCard {
  name: string;
  imageUrl: string;
}

interface TarotReading {
  id: string;
  cards: TarotCard[];
  interpretation: string;
  createdAt: string;
  isSaved?: boolean;
}

export default function ReadingsList() {
  // Fetch readings data
  const {
    data: tarotReadings,
    isLoading: tarotLoading,
    error: tarotError,
  } = useQuery<TarotReading[]>({
    queryKey: ["/api/tarot-readings"],
    queryFn: async () => {
      try {
        return await apiRequest("/api/tarot-readings");
      } catch (error: any) {
        if (error?.response?.status === 401) {
          return [];
        }
        throw error;
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry on 401 authentication errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3; // Retry other errors up to 3 times
    },
  });

  if (tarotLoading) {
    return (
      <div className="flex justify-center my-12">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  // Handle error state (excluding 401 unauthorized errors)
  if (tarotError && (tarotError as any)?.response?.status !== 401) {
    return (
      <div className="text-center py-12 bg-dark/40 backdrop-blur-sm rounded-lg border border-light/10">
        <h3 className="font-heading text-xl font-semibold mb-2 text-accent">
          Error Loading Readings
        </h3>
        <p className="text-light/70 mb-6">
          There was a problem loading your readings.
        </p>
      </div>
    );
  }

  // Handle empty state
  if (!tarotReadings || tarotReadings.length === 0) {
    return (
      <div className="text-center py-12 bg-dark/40 backdrop-blur-sm rounded-lg border border-light/10">
        <h3 className="font-heading text-xl font-semibold mb-2 text-accent">
          No Readings Found
        </h3>
        <p className="text-light/70 mb-6">
          You haven&apos;t performed any tarot readings yet.
        </p>
        <Button className="bg-accent hover:bg-accent/80 text-dark">
          Get Your First Reading
        </Button>
      </div>
    );
  }

  // Display readings grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tarotReadings.map((reading) => (
        <Card
          key={reading.id}
          className="bg-dark/60 backdrop-blur-sm border-light/10 overflow-hidden hover:border-accent/30 transition-all cursor-pointer"
        >
          <div className="h-36 overflow-hidden">
            {reading.cards[0]?.imageUrl && (
              <img
                src={reading.cards[0].imageUrl}
                alt={reading.cards[0].name}
                className="w-full h-full object-cover opacity-70"
              />
            )}
          </div>
          <CardHeader>
            <CardTitle className="text-accent">
              {reading.cards[0]?.name || "Tarot Reading"}
            </CardTitle>
            <CardDescription className="text-light/70">
              {new Date(reading.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-light/80 text-sm line-clamp-3">
              {reading.interpretation.substring(0, 100)}...
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="text-accent p-0">
              View Full Reading
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
