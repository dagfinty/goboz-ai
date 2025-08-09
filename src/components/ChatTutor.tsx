import { useState, useRef, useEffect } from 'react';
import { Send, Upload, Smile, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { useChatAI } from '@/hooks/useChatAI';
import tutorAvatar from '@/assets/gobez-tutor-avatar.jpg';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'tutor';
  timestamp: Date;
  type?: 'text' | 'file';
}

const ChatTutor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'ሰላም! Welcome to Gobez! I am your AI tutor ready to help you learn. Upload files or ask me anything about your studies. Gobez neh! 🇪🇹✨',
      sender: 'tutor',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { processFile, processYouTubeUrl, isProcessing } = useFileProcessor();
  const { generateResponse, isThinking } = useChatAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const ethiopianPhrases = [
    'Gobez neh! 👏',
    'Betam konjo! 🌟',
    'Selam! Let me help you with that 📚',
    'Weyz ena! Great question! 💡',
    'Dehna neh? How can I assist? ☕',
    'Abate! Excellent work! 🎉'
  ];

  const getRandomEthiopianPhrase = () => {
    return ethiopianPhrases[Math.floor(Math.random() * ethiopianPhrases.length)];
  };

  const handleAIResponse = async (userMessage: string, context?: string) => {
    const response = await generateResponse(userMessage, context);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: response.message,
      sender: 'tutor',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    handleAIResponse(inputMessage);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileMessage: Message = {
      id: Date.now().toString(),
      content: `Uploaded: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      type: 'file'
    };

    setMessages(prev => [...prev, fileMessage]);
    
    const processed = await processFile(file);
    if (processed) {
      handleAIResponse(`I uploaded a file: ${file.name}`, processed.content);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col gobez-card">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-gobez-green/10 to-gobez-yellow/10">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={tutorAvatar} alt="Gobez Tutor" />
            <AvatarFallback className="bg-gobez-green text-white">GT</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">Gobez Tutor</h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <Coffee className="w-3 h-3 mr-1" />
              AI የትምህርት መምህር • Always here to help
            </p>
          </div>
          <div className="ml-auto">
            <div className="w-2 h-2 bg-gobez-green rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground border border-gobez-green/20'
              } ${message.type === 'file' ? 'bg-gobez-yellow/20 border-gobez-yellow' : ''}`}
            >
              {message.sender === 'tutor' && (
                <div className="flex items-center space-x-2 mb-1">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={tutorAvatar} alt="Gobez Tutor" />
                    <AvatarFallback className="bg-gobez-green text-white text-xs">GT</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">Gobez Tutor</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        
        {(isThinking || isProcessing) && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg border border-gobez-green/20">
              <div className="flex items-center space-x-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={tutorAvatar} alt="Gobez Tutor" />
                  <AvatarFallback className="bg-gobez-green text-white text-xs">GT</AvatarFallback>
                </Avatar>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gobez-green rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gobez-yellow rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gobez-red rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0"
          >
            <Upload className="w-4 h-4" />
          </Button>
          
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything... ማንኛውንም ጠይቀኝ..."
            className="flex-1"
          />
          
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            size="sm"
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            Upload files or type your questions
          </p>
          <div className="flex space-x-1">
            <Smile className="w-4 h-4 text-gobez-yellow" />
            <Coffee className="w-4 h-4 text-gobez-green" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatTutor;