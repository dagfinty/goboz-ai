import { useState } from 'react';
import { Upload, MessageCircle, FileText, Image, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { useChatAI } from '@/hooks/useChatAI';
import { useToast } from '@/hooks/use-toast';
import heroBg from '@/assets/gobez-hero-bg.jpg';

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'chat'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const { user } = useAuth();
  const { processFile, processYouTubeUrl, isProcessing } = useFileProcessor();
  const { generateResponse, isThinking } = useChatAI();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (!user) {
      toast({
        title: "Please sign in first",
        description: "You need to be signed in to upload files",
        variant: "destructive",
      });
      return;
    }
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const processed = await processFile(file);
      if (processed) {
        navigate('/dashboard');
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast({
        title: "Please sign in first",
        description: "You need to be signed in to upload files",
        variant: "destructive",
      });
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      const processed = await processFile(file);
      if (processed) {
        navigate('/dashboard');
      }
    }
  };

  const handleChatSubmit = async () => {
    if (!user) {
      toast({
        title: "Please sign in first",
        description: "You need to be signed in to chat with Gobez",
        variant: "destructive",
      });
      return;
    }

    if (!chatMessage.trim()) return;

    const response = await generateResponse(chatMessage);
    toast({
      title: "Gobez AI Response",
      description: response.message.slice(0, 100) + "...",
    });
    navigate('/dashboard');
  };

  const loadDemoFile = async () => {
    if (!user) {
      toast({
        title: "Please sign in first",
        description: "You need to be signed in to try the demo",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/demo-file.txt');
      const content = await response.text();
      
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Demo file loaded! 📚",
        description: "Ethiopian History study guide has been processed by Gobez AI",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Failed to load demo",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 ethiopian-motif overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Text */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-ethiopic">
              <span className="bg-gradient-to-r from-gobez-green to-gobez-yellow bg-clip-text text-transparent">
                Gobez
              </span>
              <br />
              <span className="text-foreground">AI Learning</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Upload your study materials and chat with our AI tutor. 
              Learn faster with personalized Ethiopian education.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="gobez-hover-lift bg-primary hover:bg-primary/90"
                onClick={() => user ? navigate('/dashboard') : toast({
                  title: "Please sign in first",
                  description: "Create an account to start learning with Gobez",
                })}
              >
                <Play className="w-5 h-5 mr-2" />
                Get Started - ابدء እንጀምር
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="gobez-hover-lift"
                onClick={loadDemoFile}
                disabled={isProcessing}
              >
                {isProcessing ? 'Loading Demo...' : 'Try Demo File'}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gobez-yellow">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gobez-red">24/7</div>
                <div className="text-sm text-muted-foreground">AI Support</div>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Widget */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md p-6 gobez-card gobez-hover-lift">
              {/* Tab Headers */}
              <div className="flex rounded-lg bg-muted p-1 mb-6">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors gobez-smooth ${
                    activeTab === 'upload'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors gobez-smooth ${
                    activeTab === 'chat'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Chat
                </button>
              </div>

              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors gobez-smooth ${
                      dragActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="flex justify-center space-x-2 mb-4">
                      <FileText className="w-8 h-8 text-gobez-green" />
                      <Image className="w-8 h-8 text-gobez-yellow" />
                      <Upload className="w-8 h-8 text-gobez-red" />
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      Drop files here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, Images, Text files supported
                    </p>
                    
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileSelect}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer"
                    >
                      <Button variant="outline" className="mt-4" asChild>
                        <span>Choose Files</span>
                      </Button>
                    </label>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Upload to Learn with Gobez'}
                  </Button>
                </div>
              )}

              {/* Chat Tab */}
              {activeTab === 'chat' && (
                <div className="space-y-4">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Ask me anything about your studies... ስለ ትምህርትህ ማንኛውንም ጠይቀኝ..."
                      rows={4}
                      className="resize-none"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                    
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.txt"
                        className="text-sm"
                        onChange={handleFileSelect}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleChatSubmit}
                    disabled={isThinking || !chatMessage.trim()}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {isThinking ? 'Thinking...' : 'Chat with Gobez Tutor'}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Powered by AI • Responds in English & Amharic
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;