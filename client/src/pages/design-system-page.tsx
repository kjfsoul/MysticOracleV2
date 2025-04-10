import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState("colors");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-gold mb-2">
          Mystic Arcana Design System
        </h1>
        <p className="text-light/80 max-w-2xl mx-auto">
          A comprehensive guide to the design tokens, components, and patterns used throughout the application.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Primary Colors</CardTitle>
              <CardDescription>
                The main colors used throughout the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ColorSwatch name="Dark" color="bg-dark" textColor="text-white" value="#0f0a1e" />
                <ColorSwatch name="Primary" color="bg-primary" textColor="text-white" value="#4a2174" />
                <ColorSwatch name="Secondary" color="bg-secondary" textColor="text-white" value="#2e1a47" />
                <ColorSwatch name="Accent (Gold)" color="bg-accent" textColor="text-dark" value="#d4af37" />
                <ColorSwatch name="Light" color="bg-light" textColor="text-dark" value="#f5f5f7" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Primary Color Variations</CardTitle>
              <CardDescription>
                Opacity variations of the primary color
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <ColorSwatch name="Primary 10%" color="bg-primary-10" textColor="text-white" value="rgba(74, 33, 116, 0.1)" />
                <ColorSwatch name="Primary 20%" color="bg-primary-20" textColor="text-white" value="rgba(74, 33, 116, 0.2)" />
                <ColorSwatch name="Primary 30%" color="bg-primary-30" textColor="text-white" value="rgba(74, 33, 116, 0.3)" />
                <ColorSwatch name="Primary 40%" color="bg-primary-40" textColor="text-white" value="rgba(74, 33, 116, 0.4)" />
                <ColorSwatch name="Primary 50%" color="bg-primary-50" textColor="text-white" value="rgba(74, 33, 116, 0.5)" />
                <ColorSwatch name="Primary 60%" color="bg-primary-60" textColor="text-white" value="rgba(74, 33, 116, 0.6)" />
                <ColorSwatch name="Primary 70%" color="bg-primary-70" textColor="text-white" value="rgba(74, 33, 116, 0.7)" />
                <ColorSwatch name="Primary 80%" color="bg-primary-80" textColor="text-white" value="rgba(74, 33, 116, 0.8)" />
                <ColorSwatch name="Primary 90%" color="bg-primary-90" textColor="text-white" value="rgba(74, 33, 116, 0.9)" />
                <ColorSwatch name="Primary 100%" color="bg-primary" textColor="text-white" value="rgba(74, 33, 116, 1)" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gold Color Variations</CardTitle>
              <CardDescription>
                Opacity variations of the gold accent color
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <ColorSwatch name="Gold 10%" color="bg-gold-10" textColor="text-white" value="rgba(212, 175, 55, 0.1)" />
                <ColorSwatch name="Gold 20%" color="bg-gold-20" textColor="text-white" value="rgba(212, 175, 55, 0.2)" />
                <ColorSwatch name="Gold 30%" color="bg-gold-30" textColor="text-white" value="rgba(212, 175, 55, 0.3)" />
                <ColorSwatch name="Gold 40%" color="bg-gold-40" textColor="text-dark" value="rgba(212, 175, 55, 0.4)" />
                <ColorSwatch name="Gold 50%" color="bg-gold-50" textColor="text-dark" value="rgba(212, 175, 55, 0.5)" />
                <ColorSwatch name="Gold 60%" color="bg-gold-60" textColor="text-dark" value="rgba(212, 175, 55, 0.6)" />
                <ColorSwatch name="Gold 70%" color="bg-gold-70" textColor="text-dark" value="rgba(212, 175, 55, 0.7)" />
                <ColorSwatch name="Gold 80%" color="bg-gold-80" textColor="text-dark" value="rgba(212, 175, 55, 0.8)" />
                <ColorSwatch name="Gold 90%" color="bg-gold-90" textColor="text-dark" value="rgba(212, 175, 55, 0.9)" />
                <ColorSwatch name="Gold 100%" color="bg-gold" textColor="text-dark" value="rgba(212, 175, 55, 1)" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Colors</CardTitle>
              <CardDescription>
                Colors used to indicate status or feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ColorSwatch name="Success" color="bg-success" textColor="text-white" value="#10b981" />
                <ColorSwatch name="Warning" color="bg-warning" textColor="text-dark" value="#f59e0b" />
                <ColorSwatch name="Error" color="bg-error" textColor="text-white" value="#ef4444" />
                <ColorSwatch name="Info" color="bg-info" textColor="text-white" value="#3b82f6" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Font Families</CardTitle>
              <CardDescription>
                The typefaces used throughout the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gold">Heading Font: Cinzel</h3>
                <div className="p-4 bg-primary-20 rounded-md">
                  <p className="font-heading text-4xl">The Mystic Arcana</p>
                  <p className="font-heading text-2xl">Discover your cosmic destiny</p>
                  <p className="font-heading text-xl">Tarot, Astrology, and Mystical Guidance</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gold">Body Font: Inter</h3>
                <div className="p-4 bg-primary-20 rounded-md">
                  <p className="font-sans text-base">
                    The Mystic Arcana platform offers personalized tarot readings, astrological insights, and spiritual guidance to help you navigate life's journey.
                  </p>
                  <p className="font-sans text-sm mt-2">
                    Our intuitive interface and AI-powered interpretations provide deep, meaningful connections to ancient wisdom.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gold">Monospace Font: JetBrains Mono</h3>
                <div className="p-4 bg-primary-20 rounded-md">
                  <p className="font-mono text-base">
                    const tarotReading = await getTarotReading('celtic-cross');
                  </p>
                  <p className="font-mono text-sm mt-2">
                    // This is used for code examples and technical content
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Font Sizes</CardTitle>
              <CardDescription>
                The range of font sizes available in the design system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-2 border-b border-gold/20">
                  <p className="text-xs">Text Extra Small (xs): 0.75rem / 12px</p>
                </div>
                <div className="p-2 border-b border-gold/20">
                  <p className="text-sm">Text Small (sm): 0.875rem / 14px</p>
                </div>
                <div className="p-2 border-b border-gold/20">
                  <p className="text-base">Text Base: 1rem / 16px</p>
                </div>
                <div className="p-2 border-b border-gold/20">
                  <p className="text-lg">Text Large (lg): 1.125rem / 18px</p>
                </div>
                <div className="p-2 border-b border-gold/20">
                  <p className="text-xl">Text XL: 1.25rem / 20px</p>
                </div>
                <div className="p-2 border-b border-gold/20">
                  <p className="text-2xl">Text 2XL: 1.5rem / 24px</p>
                </div>
                <div className="p-2 border-b border-gold/20">
                  <p className="text-3xl">Text 3XL: 1.875rem / 30px</p>
                </div>
                <div className="p-2 border-b border-gold/20">
                  <p className="text-4xl">Text 4XL: 2.25rem / 36px</p>
                </div>
                <div className="p-2">
                  <p className="text-5xl">Text 5XL: 3rem / 48px</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spacing Tab */}
        <TabsContent value="spacing" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Spacing Scale</CardTitle>
              <CardDescription>
                The spacing values used for margins, padding, and layout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-light/70">Spacing 1: 0.25rem / 4px</p>
                  <div className="h-4 w-4 bg-gold"></div>
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-light/70">Spacing 2: 0.5rem / 8px</p>
                  <div className="h-4 w-8 bg-gold"></div>
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-light/70">Spacing 4: 1rem / 16px</p>
                  <div className="h-4 w-16 bg-gold"></div>
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-light/70">Spacing 6: 1.5rem / 24px</p>
                  <div className="h-4 w-24 bg-gold"></div>
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-light/70">Spacing 8: 2rem / 32px</p>
                  <div className="h-4 w-32 bg-gold"></div>
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-light/70">Spacing 12: 3rem / 48px</p>
                  <div className="h-4 w-48 bg-gold"></div>
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-light/70">Spacing 16: 4rem / 64px</p>
                  <div className="h-4 w-64 bg-gold"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>
                Button variants and states
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gold">Primary</h3>
                  <div className="space-y-2">
                    <Button variant="default">Default Button</Button>
                    <div className="mt-2">
                      <Button variant="default" disabled>Disabled</Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gold">Secondary</h3>
                  <div className="space-y-2">
                    <Button variant="secondary">Secondary Button</Button>
                    <div className="mt-2">
                      <Button variant="secondary" disabled>Disabled</Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gold">Outline</h3>
                  <div className="space-y-2">
                    <Button variant="outline">Outline Button</Button>
                    <div className="mt-2">
                      <Button variant="outline" disabled>Disabled</Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gold">Ghost</h3>
                  <div className="space-y-2">
                    <Button variant="ghost">Ghost Button</Button>
                    <div className="mt-2">
                      <Button variant="ghost" disabled>Disabled</Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gold">Destructive</h3>
                  <div className="space-y-2">
                    <Button variant="destructive">Destructive Button</Button>
                    <div className="mt-2">
                      <Button variant="destructive" disabled>Disabled</Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gold">Link</h3>
                  <div className="space-y-2">
                    <Button variant="link">Link Button</Button>
                    <div className="mt-2">
                      <Button variant="link" disabled>Disabled</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
              <CardDescription>
                Card components for containing content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description text</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This is the main content of the card.</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary-20 border-gold/30">
                  <CardHeader>
                    <CardTitle className="text-gold">Custom Card</CardTitle>
                    <CardDescription>With custom styling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Cards can be customized with different background colors and borders.</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patterns Tab */}
        <TabsContent value="patterns" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Common UI Patterns</CardTitle>
              <CardDescription>
                Reusable UI patterns and layouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gold mb-4">Hero Section</h3>
                  <div className="bg-gradient-to-r from-primary/40 to-secondary/40 backdrop-blur-sm rounded-lg p-8 border border-gold/20">
                    <div className="max-w-2xl mx-auto text-center">
                      <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gold">
                        Discover Your Cosmic Destiny
                      </h2>
                      <p className="text-light/80 mb-6">
                        Unlock the ancient secrets of tarot and astrology with Mystic Arcana's personalized readings.
                      </p>
                      <Button className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50">
                        Begin Your Journey
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gold mb-4">Feature Grid</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-primary-20 rounded-lg p-6 border border-gold/20">
                        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                          <span className="text-gold text-xl">✨</span>
                        </div>
                        <h3 className="font-heading text-xl font-medium mb-2 text-gold">
                          Feature {i}
                        </h3>
                        <p className="text-light/70">
                          A short description of this feature and how it benefits the user.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Color Swatch Component
function ColorSwatch({ name, color, textColor, value }: { name: string; color: string; textColor: string; value: string }) {
  return (
    <div className="flex flex-col">
      <div className={`h-20 rounded-t-md ${color} flex items-end p-2`}>
        <span className={`text-xs font-mono ${textColor}`}>{value}</span>
      </div>
      <div className="bg-primary-10 p-2 rounded-b-md">
        <p className="text-sm font-medium">{name}</p>
      </div>
    </div>
  );
}
