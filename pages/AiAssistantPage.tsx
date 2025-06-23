
import React, { useState, useEffect, useRef } from 'react';
// Import of GoogleGenAI and GenerateContentResponse is removed as we call a PHP proxy
import { SectionWrapper, Input, Button, Card, LoadingSpinner, Alert } from '../components/CommonUI';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const AiAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  // API Key and GoogleGenAI client initialization are removed from client-side.

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    setMessages([{ 
      id: Date.now().toString(), 
      text: "Hello! I'm your AI Solar Assistant. How can I help you today with your solar energy questions?", 
      sender: 'ai',
      timestamp: Date.now()
    }]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const timestamp = Date.now();
    const newUserMessage: Message = { id: timestamp.toString(), text: inputMessage, sender: 'user', timestamp };
    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini_proxy.php', { // Call your PHP proxy
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentInput }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error structure" }));
        throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}. Details: ${JSON.stringify(errorData.details || errorData)}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }
      if (!data.text && data.warning) {
        console.warn("AI Warning:", data.warning, "Raw:", data.raw_response);
        setError(`AI response might be incomplete: ${data.warning}`);
         const newAiMessage: Message = { id: (timestamp + 1).toString(), text: data.warning, sender: 'ai', timestamp: Date.now() };
        setMessages(prev => [...prev, newAiMessage]);
        return;
      }
      if (!data.text) {
        console.error("Received empty or malformed text response from proxy:", data);
        throw new Error("Received an empty or malformed text response from the AI service via proxy.");
      }

      const newAiMessage: Message = { id: (timestamp + 1).toString(), text: data.text, sender: 'ai', timestamp: Date.now() };
      setMessages(prev => [...prev, newAiMessage]);

    } catch (e: any) {
      console.error("Error calling AI proxy:", e);
      const errorMessage = e.message || "An unknown error occurred while contacting the AI service.";
      setError(`Sorry, I encountered an error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SectionWrapper title="AI Solar Assistant" titleClassName="text-primary">
      <Card className="p-4 md:p-6 max-w-3xl mx-auto">
        <p className="text-center text-secondary mb-6">Ask me anything about solar panels, savings, our services, or how to get started!</p>
        
        {/* Warning about API key config is now server-side concern */}

        <div className="h-96 overflow-y-auto mb-4 p-4 bg-lightgray rounded-md border border-mediumgray space-y-3 scroll-smooth">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-darkgray rounded-bl-none'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className="text-xs mt-1 opacity-70 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="max-w-[70%] p-3 rounded-xl bg-white text-darkgray shadow-sm rounded-bl-none">
                <LoadingSpinner size="sm" />
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your question..."
            className="flex-grow"
            aria-label="Your message"
            disabled={isLoading} // Removed !apiKey condition
          />
          <Button type="submit" disabled={isLoading || !inputMessage.trim()} aria-label="Send message">
            {isLoading ? <LoadingSpinner size="sm" /> : 'Send'}
          </Button>
        </form>
         <p className="text-xs text-gray-500 mt-2 text-center">
            AI can make mistakes. Consider checking important information.
        </p>
      </Card>
    </SectionWrapper>
  );
};

export default AiAssistantPage;
