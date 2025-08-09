import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import DashboardGrid from '@/components/DashboardGrid';
import { useAuth } from '@/contexts/AuthContext';
import ChatTutor from '@/components/ChatTutor';
import QuizModule from '@/components/QuizModule';
import ProgressTracker from '@/components/ProgressTracker';
import { X, Brain, FileText, MessageCircle, BookOpen, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type ActiveModule = 'grid' | 'flashcards' | 'summary' | 'chat' | 'quiz' | 'progress' | 'practice';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const moduleParam = searchParams.get('module');
  const [activeModule, setActiveModule] = useState<ActiveModule>(
    (moduleParam as ActiveModule) || 'grid'
  );
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gobez-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Gobez...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'flashcards':
        return <FlashcardsDemo />;
      case 'summary':
        return <SummaryDemo />;
      case 'chat':
        return <ChatTutor />;
      case 'quiz':
        return <QuizModule />;
      case 'progress':
        return <ProgressTracker />;
      case 'practice':
        return <PracticeDemo />;
      default:
        return <DashboardGrid />;
    }
  };

  // Demo Components
  const FlashcardsDemo = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Flashcards Demo</h3>
      <p className="text-muted-foreground mb-4">AI-generated flashcards from your study materials</p>
      <div className="bg-gradient-to-r from-gobez-green/10 to-gobez-yellow/10 p-4 rounded-lg">
        <p className="text-sm">Demo: Ethiopian History flashcard set loaded! Practice with spaced repetition.</p>
      </div>
    </Card>
  );

  const SummaryDemo = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">AI Summary Demo</h3>
      <p className="text-muted-foreground mb-4">Instant summaries of your uploaded documents</p>
      <div className="bg-gradient-to-r from-gobez-green/10 to-gobez-yellow/10 p-4 rounded-lg">
        <p className="text-sm">Demo: Generated summary of "Ethiopian Constitution" - 5 key points identified.</p>
      </div>
    </Card>
  );

  const PracticeDemo = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Practice Demo</h3>
      <p className="text-muted-foreground mb-4">Bite-sized practice sessions</p>
      <div className="bg-gradient-to-r from-gobez-green/10 to-gobez-yellow/10 p-4 rounded-lg">
        <p className="text-sm">Demo: 5-minute Ethiopian History quiz ready. Gobez neh!</p>
      </div>
    </Card>
  );

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'flashcards':
        return { en: 'Flashcards', am: 'ካርዶች' };
      case 'summary':
        return { en: 'AI Summary', am: 'ማሳያ' };
      case 'chat':
        return { en: 'Chat Tutor', am: 'AI መምህር' };
      case 'quiz':
        return { en: 'Quiz Master', am: 'ፈተና' };
      case 'progress':
        return { en: 'Progress Tracker', am: 'እድገት' };
      case 'practice':
        return { en: 'Quick Practice', am: 'ልምምድ' };
      default:
        return { en: 'Learning Hub', am: 'የትምህርት ማዕከል' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className={activeModule === 'chat' ? 'pt-16 pb-20' : 'pt-16'}>
        {activeModule === 'grid' ? (
          <DashboardGrid />
        ) : (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Module Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {getModuleTitle().en}
                </h1>
                <p className="text-lg font-ethiopic text-gobez-green">
                  {getModuleTitle().am}
                </p>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setActiveModule('grid')}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Back to Hub
              </Button>
            </div>

            {/* Module Content */}
            <div className="space-y-6">
              {renderActiveModule()}
            </div>
          </div>
        )}
      </main>

      {/* Module Navigation - Always visible when not on grid */}
      {activeModule !== 'grid' && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-wrap justify-center gap-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg max-w-sm">
            {[
              { key: 'flashcards', label: 'Cards', icon: Brain },
              { key: 'summary', label: 'Summary', icon: FileText },
              { key: 'chat', label: 'Chat', icon: MessageCircle },
              { key: 'quiz', label: 'Quiz', icon: BookOpen },
              { key: 'progress', label: 'Progress', icon: TrendingUp },
              { key: 'practice', label: 'Practice', icon: Zap }
            ].map((module) => {
              const IconComponent = module.icon;
              return (
                <Button
                  key={module.key}
                  variant={activeModule === module.key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveModule(module.key as ActiveModule)}
                  className="gap-2 text-xs"
                >
                  <IconComponent className="w-3 h-3" />
                  {module.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;