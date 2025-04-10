import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send, Sparkles, Stars, Code, PenTool } from 'lucide-react';

interface CrewAIResponse {
  success: boolean;
  reading?: string;
  analysis?: string;
  error?: string;
}

/**
 * CrewAIConnector Component
 * 
 * This component provides an interface for interacting with the CrewAI integration.
 * It allows users to:
 * 1. Get tarot readings from the Tarot Crew
 * 2. Get UI analysis from the Development Crew
 * 3. Chat with CrewAI agents
 */
const CrewAIConnector: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tarot');
  const [isLoading, setIsLoading] = useState(false);
  const [tarotQuestion, setTarotQuestion] = useState('');
  const [tarotReading, setTarotReading] = useState('');
  const [uiAnalysis, setUiAnalysis] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const { toast } = useToast();

  // Check if CrewAI server is running
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:8765/health');
        if (!response.ok) {
          toast({
            title: 'CrewAI Server Not Running',
            description: 'The CrewAI server is not running. Some features may not work.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'CrewAI Server Not Running',
          description: 'The CrewAI server is not running. Some features may not work.',
          variant: 'destructive',
        });
      }
    };

    checkServer();
  }, [toast]);

  // Get a tarot reading from the Tarot Crew
  const getTarotReading = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8765', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getDailyCard',
          userContext: {
            question: tarotQuestion,
          },
        }),
      });

      const data: CrewAIResponse = await response.json();
      
      if (data.success && data.reading) {
        setTarotReading(data.reading);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to get tarot reading',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect to CrewAI server',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get UI analysis from the Development Crew
  const getUIAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8765', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'analyzeUI',
          screenshotPath: null, // No screenshot for now
        }),
      });

      const data: CrewAIResponse = await response.json();
      
      if (data.success && data.analysis) {
        setUiAnalysis(data.analysis);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to get UI analysis',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect to CrewAI server',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message to the CrewAI chat
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    
    setIsLoading(true);
    
    // Simulate a response for now
    // In a real implementation, this would call the CrewAI server
    setTimeout(() => {
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: `I'm the CrewAI assistant. You asked: "${chatInput}". This is a simulated response since the actual integration is not yet implemented. In the future, this will connect to the CrewAI server to provide real responses.` 
      };
      setChatMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-gold flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          CrewAI Integration
        </CardTitle>
        <CardDescription>
          Interact with CrewAI agents for tarot readings, UI analysis, and more
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="tarot" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Tarot Crew
            </TabsTrigger>
            <TabsTrigger value="development" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Development Crew
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Chat with CrewAI
            </TabsTrigger>
          </TabsList>
          
          {/* Tarot Crew Tab */}
          <TabsContent value="tarot" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="tarot-question" className="block text-sm font-medium mb-2">
                  What would you like guidance on?
                </label>
                <Textarea
                  id="tarot-question"
                  placeholder="Enter your question or leave blank for a general reading..."
                  value={tarotQuestion}
                  onChange={(e) => setTarotQuestion(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Button 
                onClick={getTarotReading} 
                disabled={isLoading}
                className="w-full bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Reading...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Tarot Reading
                  </>
                )}
              </Button>
              
              {tarotReading && (
                <div className="mt-6 p-4 bg-primary-10 border border-gold/30 rounded-md">
                  <h3 className="text-lg font-medium text-gold mb-2">Your Tarot Reading</h3>
                  <div className="whitespace-pre-line">{tarotReading}</div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Development Crew Tab */}
          <TabsContent value="development" className="space-y-4">
            <div className="space-y-4">
              <p className="text-light/80">
                The Development Crew can analyze the UI of your application and provide suggestions for improvement.
              </p>
              
              <Button 
                onClick={getUIAnalysis} 
                disabled={isLoading}
                className="w-full bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing UI...
                  </>
                ) : (
                  <>
                    <Code className="mr-2 h-4 w-4" />
                    Analyze UI
                  </>
                )}
              </Button>
              
              {uiAnalysis && (
                <div className="mt-6 p-4 bg-primary-10 border border-gold/30 rounded-md">
                  <h3 className="text-lg font-medium text-gold mb-2">UI Analysis</h3>
                  <div className="whitespace-pre-line">{uiAnalysis}</div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            <div className="space-y-4">
              <div className="border border-gold/30 rounded-md h-80 overflow-y-auto p-4 bg-primary-10">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-light/50">
                    <p>No messages yet. Start a conversation with CrewAI.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div 
                        key={index} 
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user' 
                              ? 'bg-gold/20 text-gold' 
                              : 'bg-primary/30 text-light'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={sendChatMessage} 
                  disabled={isLoading || !chatInput.trim()}
                  className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-xs text-light/50">
          Powered by CrewAI - Autonomous AI Agents
        </p>
        <Button variant="link" className="text-xs p-0 h-auto" onClick={() => window.open('http://localhost:8765/health', '_blank')}>
          Check Server Status
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CrewAIConnector;
