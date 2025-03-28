import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "../../hooks/use-auth";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/api";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import TarotCard from "./tarot-card";

// ZodiacSpread component for the specialized tarot spread based on astrological houses
export default function ZodiacSpread() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [birthDetails, setBirthDetails] = useState({
    birthDate: "",
    birthTime: "12:00",
    birthLocation: "",
    question: "",
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBirthDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Generate zodiac spread mutation
  const zodiacSpreadMutation = useMutation({
    mutationFn: async (data: typeof birthDetails) => {
      const endpoint = user
        ? "/api/tarot-readings/zodiac-spread"
        : "/api/public/zodiac-spread";
      return apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Zodiac Spread Generated",
        description: "Your personalized zodiac spread is ready.",
      });
      // The API returns the reading inside a 'reading' property
      if (data && !data.cards && data.reading) {
        zodiacSpreadMutation.data = data.reading;
      }
    },
    onError: (error) => {
      toast({
        title: "Error Generating Spread",
        description:
          "There was an error generating your zodiac spread. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await zodiacSpreadMutation.mutateAsync(birthDetails);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Zodiac Spread</CardTitle>
              <CardDescription>
                A unique tarot spread based on your astrological birth chart.
                This spread reveals insights for each of the 12 astrological
                houses in your chart.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="birthDate"
                    className="block text-sm font-medium"
                  >
                    Birth Date
                  </label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    required
                    value={birthDetails.birthDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="birthTime"
                    className="block text-sm font-medium"
                  >
                    Birth Time (approximate)
                  </label>
                  <input
                    id="birthTime"
                    name="birthTime"
                    type="time"
                    value={birthDetails.birthTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="birthLocation"
                    className="block text-sm font-medium"
                  >
                    Birth Location
                  </label>
                  <input
                    id="birthLocation"
                    name="birthLocation"
                    type="text"
                    placeholder="City, Country"
                    required
                    value={birthDetails.birthLocation}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="question"
                    className="block text-sm font-medium"
                  >
                    Question (Optional)
                  </label>
                  <input
                    id="question"
                    name="question"
                    type="text"
                    placeholder="What would you like to know?"
                    value={birthDetails.question}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isGenerating || zodiacSpreadMutation.isPending}
                  className="w-full"
                >
                  {isGenerating || zodiacSpreadMutation.isPending
                    ? "Generating..."
                    : "Generate Zodiac Spread"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>About Zodiac Spread</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Zodiac Spread is a specialized tarot reading that aligns
                with your personal astrological chart. Each card corresponds to
                one of the 12 houses in your birth chart, revealing insights
                about different areas of your life.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="border p-2 rounded">
                  <strong>1st House:</strong> Self & Identity
                </div>
                <div className="border p-2 rounded">
                  <strong>2nd House:</strong> Wealth & Values
                </div>
                <div className="border p-2 rounded">
                  <strong>3rd House:</strong> Communication & Learning
                </div>
                <div className="border p-2 rounded">
                  <strong>4th House:</strong> Home & Family
                </div>
                <div className="border p-2 rounded">
                  <strong>5th House:</strong> Creativity & Pleasure
                </div>
                <div className="border p-2 rounded">
                  <strong>6th House:</strong> Health & Service
                </div>
                <div className="border p-2 rounded">
                  <strong>7th House:</strong> Partnerships
                </div>
                <div className="border p-2 rounded">
                  <strong>8th House:</strong> Transformation
                </div>
                <div className="border p-2 rounded">
                  <strong>9th House:</strong> Higher Learning
                </div>
                <div className="border p-2 rounded">
                  <strong>10th House:</strong> Career & Status
                </div>
                <div className="border p-2 rounded">
                  <strong>11th House:</strong> Community & Aspirations
                </div>
                <div className="border p-2 rounded">
                  <strong>12th House:</strong> Spirituality
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Premium Features:</h3>
                <ul className="list-disc pl-5">
                  <li>
                    Enhanced card selection based on elemental associations
                  </li>
                  <li>More detailed interpretations for each house</li>
                  <li>Ability to save and compare multiple readings</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {zodiacSpreadMutation.data && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Zodiac Spread</CardTitle>
              <CardDescription>
                Based on birth chart for {birthDetails.birthDate} at{" "}
                {birthDetails.birthTime} in {birthDetails.birthLocation}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="spread">
                <TabsList>
                  <TabsTrigger value="spread">Card Spread</TabsTrigger>
                  <TabsTrigger value="interpretation">
                    Interpretation
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="spread">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {(zodiacSpreadMutation.data.cards || []).map(
                      (card: any, index: number) => (
                        <div
                          key={index}
                          className="flex flex-col items-center bg-primary/5 p-4 rounded-lg"
                        >
                          <div className="text-center mb-2">
                            <span className="text-xs text-muted-foreground">
                              {index + 1}/12
                            </span>
                            <h3 className="text-sm font-medium">
                              {card.position}
                            </h3>
                          </div>
                          <TarotCard
                            cardName={card.name}
                            arcana={card.arcana}
                            suit={card.suit}
                            isReversed={card.reversal}
                            size="md"
                          />
                          <div className="mt-2 text-center">
                            <h4 className="font-semibold">{card.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {card.reversal ? "Reversed" : "Upright"}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="interpretation">
                  <div className="prose dark:prose-invert mt-4 max-w-none">
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Complete Reading
                      </h3>
                      <div className="mt-4 whitespace-pre-line">
                        {zodiacSpreadMutation.data.interpretation}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Cards by House
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {(zodiacSpreadMutation.data.cards || []).map(
                          (card: any, index: number) => (
                            <div
                              key={index}
                              className="border rounded-lg p-4 bg-card/50"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className="bg-primary/10 h-8 w-8 flex items-center justify-center rounded-full">
                                  <span className="text-sm font-bold">
                                    {index + 1}
                                  </span>
                                </div>
                                <h4 className="font-semibold">
                                  {card.position}: {card.name}{" "}
                                  {card.reversal ? "(Reversed)" : ""}
                                </h4>
                              </div>
                              <p className="text-sm">{card.description}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {user &&
                      user.subscriptionLevel !== "free" &&
                      zodiacSpreadMutation.data.aiInsight && (
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold border-b pb-2">
                            Premium AI Insight
                          </h3>
                          <div className="mt-4 bg-primary/10 p-6 rounded-lg">
                            <div className="whitespace-pre-line">
                              {zodiacSpreadMutation.data.aiInsight}
                            </div>
                          </div>
                        </div>
                      )}

                    {!user && (
                      <div className="bg-muted p-4 rounded-lg border">
                        <h4 className="text-base font-medium">
                          Sign up for Premium Benefits
                        </h4>
                        <p className="text-sm mb-2">
                          Premium members receive detailed AI insights and
                          personalized readings.
                        </p>
                        <Link
                          href="/signup"
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          Create an account →
                        </Link>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => zodiacSpreadMutation.reset()}
              >
                New Reading
              </Button>
              {user && <Button>Save Reading</Button>}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
