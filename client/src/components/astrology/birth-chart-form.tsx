import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, Info, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Birth chart form schema with name, birth date, time and location
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  birthDate: z.date({
    required_error: "Birth date is required",
  }),
  birthTime: z.string().optional(),
  birthLocation: z.string().min(2, {
    message: "Birth location must be at least 2 characters",
  }),
});

type BirthChartFormValues = z.infer<typeof formSchema>;

// Example famous people for quick testing
const famousPeople = [
  { name: "Albert Einstein", birthDate: new Date("1879-03-14"), birthTime: "11:30", birthLocation: "Ulm, Germany" },
  { name: "Marie Curie", birthDate: new Date("1867-11-07"), birthTime: "12:00", birthLocation: "Warsaw, Poland" },
  { name: "Nikola Tesla", birthDate: new Date("1856-07-10"), birthTime: "00:00", birthLocation: "Smiljan, Croatia" },
];

interface BirthChartFormProps {
  onSubmit: (data: BirthChartFormValues) => Promise<void>;
  isLoading?: boolean;
}

export default function BirthChartForm({ onSubmit, isLoading = false }: BirthChartFormProps) {
  const [formStep, setFormStep] = useState(0);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false); // Added state for calendar
  const { user } = useAuth();

  // Initialize form with default values
  const form = useForm<BirthChartFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.username || "",
      birthDate: undefined,
      birthTime: "",
      birthLocation: "",
    },
  });

  // Watch form fields for conditional validation
  const watchBirthDate = form.watch("birthDate");
  const watchBirthLocation = form.watch("birthLocation");
  const watchName = form.watch("name");

  // Handle form submission
  const handleSubmit = async (values: BirthChartFormValues) => {
    try {
      await onSubmit(values)
    } catch (error) {
      console.error("Error in birth chart form submission:", error)
      
      // Error handling enhancements
      // The parent component handles the main error display with toast
      // Here we can reset form state or provide inline feedback if needed
      
      // Move back to the location step if there's a location error
      if (error instanceof Error && 
          (error.message.includes("location") || error.message.includes("geocode"))) {
        setFormStep(1);
      }
      
      // Vibrate device if available for tactile feedback on error
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    }
  };

  // Handle loading famous person data
  const loadFamousPerson = (person: typeof famousPeople[0]) => {
    form.setValue("name", person.name);
    form.setValue("birthDate", person.birthDate);
    form.setValue("birthTime", person.birthTime);
    form.setValue("birthLocation", person.birthLocation);
    setShowExamples(false);
    setFormStep(2); // Go directly to review step
  };

  // Progress to next form step
  const nextFormStep = () => {
    setFormStep((prev) => Math.min(prev + 1, 2));
  };

  // Go back to previous form step
  const prevFormStep = () => {
    setFormStep((prev) => Math.max(prev - 1, 0));
  };

  // Default to previous step if a field becomes invalid
  useEffect(() => {
    if (formStep === 1 && !watchBirthDate) {
      setFormStep(0);
    } else if (formStep === 2 && !watchBirthLocation) {
      setFormStep(1);
    }
  }, [watchBirthDate, watchBirthLocation, formStep]);

  // Auto-detect location
  const detectLocation = async () => {
    setLoadingLocation(true);
    try {
      // Get user's current location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Convert coordinates to location name using client-side geocoding API
            // Using direct fetch since this is an external API and not our backend
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const location = `${data.city || data.locality || ''}, ${data.principalSubdivision || ''}, ${data.countryName}`;
            form.setValue("birthLocation", location.replace(/^, /, ''));
          } catch (error) {
            console.error("Error getting location name:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } catch (error) {
      console.error("Error detecting location:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Form step variations
  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="bg-dark/50 p-4 sm:p-6 rounded-xl border border-light/10">
      <h2 className="text-xl font-semibold mb-4">Birth Chart Analysis</h2>

      {/* Form steps indicator */}
      <div className="flex mb-6 text-sm">
        <div 
          className={`flex-1 pb-2 ${formStep >= 0 ? 'border-b-2 border-accent text-accent' : 'border-b border-light/20 text-light/50'}`}
        >
          1. Personal Details
        </div>
        <div 
          className={`flex-1 pb-2 ${formStep >= 1 ? 'border-b-2 border-accent text-accent' : 'border-b border-light/20 text-light/50'}`}
        >
          2. Birth Location
        </div>
        <div 
          className={`flex-1 pb-2 ${formStep >= 2 ? 'border-b-2 border-accent text-accent' : 'border-b border-light/20 text-light/50'}`}
        >
          3. Review
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Step 1: Personal Details */}
          {formStep === 0 && (
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Birth Date</FormLabel>
                    <Popover open={openCalendar} onOpenChange={setOpenCalendar}> {/* Updated Popover */}
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date);
                            // Close the popover after selection
                            setOpenCalendar(false);
                          }}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Birth Time
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-light/50" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-80">
                            <p>
                              Birth time is optional but recommended for a more accurate reading.
                              It helps determine your Rising sign and house placements.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="time"
                          placeholder="HH:MM"
                          {...field}
                          className="pl-9"
                        />
                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-light/50" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {/* Step 2: Birth Location */}
          {formStep === 1 && (
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="birthLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span>Birth Location</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-accent hover:text-accent/80"
                        onClick={detectLocation}
                        disabled={loadingLocation}
                      >
                        {loadingLocation ? "Detecting..." : "Detect Current Location"}
                      </Button>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="City, State/Province, Country"
                          {...field}
                          className="pl-9"
                        />
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-light/50" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Alert className="bg-dark/30 border-light/10">
                <AlertDescription className="text-sm text-light/70">
                  For the most accurate birth chart, please provide the city, state/province, and country where you were born. This information helps determine the precise planetary positions at your time of birth.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {formStep === 2 && (
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <h3 className="text-lg font-medium">Confirm Your Details</h3>

              <div className="bg-dark/30 p-4 rounded-lg border border-light/10">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-light/50 text-sm">Name</div>
                      <div className="text-light font-medium">{watchName}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setFormStep(0)}
                    >
                      Edit
                    </Button>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <div className="text-light/50 text-sm">Birth Date</div>
                      <div className="text-light font-medium">
                        {watchBirthDate ? format(watchBirthDate, "MMMM d, yyyy") : "Not provided"}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setFormStep(0)}
                    >
                      Edit
                    </Button>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <div className="text-light/50 text-sm">Birth Time</div>
                      <div className="text-light font-medium">
                        {form.getValues("birthTime") || "Not provided"}
                        {!form.getValues("birthTime") && (
                          <span className="text-yellow-400/70 text-xs ml-2">(Less accurate chart)</span>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setFormStep(0)}
                    >
                      Edit
                    </Button>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <div className="text-light/50 text-sm">Birth Location</div>
                      <div className="text-light font-medium">{form.getValues("birthLocation") || "Not provided"}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setFormStep(1)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-dark/30 p-4 rounded-lg border border-light/10">
                <h3 className="text-accent flex items-center gap-2 mb-2">
                  <Sparkles size={16} />
                  <span className="font-medium">What You'll Receive</span>
                </h3>
                <ul className="text-sm text-light/80 list-disc list-inside space-y-1">
                  <li>Full birth chart with planetary positions</li>
                  <li>Detailed analysis of your Sun, Moon, and Rising signs</li>
                  <li>Interpretation of major planetary aspects</li>
                  <li>Personal strengths and challenges based on your chart</li>
                  <li>Life path insights and cosmic guidance</li>
                </ul>
              </div>

              {!form.getValues("birthTime") && (
                <div className="bg-yellow-900/30 border border-yellow-600/50 p-3 rounded-lg text-yellow-200/80 text-sm flex items-start gap-2">
                  <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>Without birth time, we'll provide a simplified chart. For a complete analysis, including rising sign and houses, please provide your birth time.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-2">
            {formStep > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={prevFormStep}
                className="border-light/20 hover:bg-dark/50"
              >
                Back
              </Button>
            ) : (
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowExamples(!showExamples)}
                  className="border-light/20 hover:bg-dark/50"
                >
                  Examples
                </Button>

                {/* Examples dropdown */}
                {showExamples && (
                  <div id="examples-dropdown" className="absolute top-full left-0 mt-1 p-2 bg-dark/90 border border-light/10 rounded-md shadow-lg z-10 w-60">
                    <p className="text-xs text-light/50 mb-2">Famous people:</p>
                    {famousPeople.map((person, i) => (
                      <button
                        key={i}
                        type="button"
                        className="w-full text-left px-2 py-1.5 text-sm hover:bg-light/10 rounded flex items-center"
                        onClick={() => {
                          loadFamousPerson(person);
                          document.getElementById("examples-dropdown")?.classList.add("hidden");
                        }}
                      >
                        <User className="h-4 w-4 mr-2 opacity-70" />
                        {person.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Button
              type="button"
              onClick={formStep === 2 ? form.handleSubmit(handleSubmit) : nextFormStep}
              className={`w-full sm:w-auto bg-accent hover:bg-accent/90 text-dark ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading || (formStep === 0 && !watchBirthDate) || (formStep === 1 && !watchBirthLocation)}
            >
              {formStep === 2 ? (isLoading ? "Generating..." : "Generate Birth Chart") : "Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}