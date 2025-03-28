import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth-fixed';
import { useLocation } from 'wouter';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  birthDate: z.string().min(1, 'Birth date is required'),
  birthTime: z.string().optional(),
  birthLocation: z.string().min(2, 'Birth location must be at least 2 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export default function BirthChartPreview() {
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      birthDate: '',
      birthTime: '',
      birthLocation: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/api/public/birth-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setPreviewData(result.previewChart);
      toast({
        title: 'Birth Chart Generated',
        description: 'Your birth chart preview has been created successfully!',
      });
    } catch (error) {
      console.error('Error generating birth chart:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate birth chart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to login if the user tries to save and isn't authenticated
  const handleSave = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in or create an account to save your birth chart.',
      });
      navigate('/auth');
    } else {
      toast({
        title: 'Premium Feature',
        description: 'Upgrade to premium to save and access detailed birth chart interpretations.',
      });
      navigate('/pricing');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!previewData ? (
        <Card>
          <CardHeader>
            <CardTitle>Birth Chart Preview</CardTitle>
            <CardDescription>
              Enter your birth details to generate a free preview of your astrological birth chart
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Time (optional)</FormLabel>
                      <FormControl>
                        <Input type="time" placeholder="HH:MM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Generating Chart...' : 'Generate Free Birth Chart Preview'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Birth Chart Preview for {previewData.chartData.name}</CardTitle>
            <CardDescription>
              Born on {previewData.chartData.date} at {previewData.chartData.time} in {previewData.chartData.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: previewData.interpretation.replace(/\n/g, '<br/>') }} />
            </div>
            {previewData.message && (
              <div className="mt-4 p-4 bg-primary/10 rounded-md border border-primary/20">
                <p className="text-sm">{previewData.message}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setPreviewData(null)}>
              Generate Another Chart
            </Button>
            <Button onClick={handleSave}>
              Save & Get Full Interpretation
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}