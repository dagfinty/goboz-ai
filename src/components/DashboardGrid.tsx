import { useState } from 'react';
import { 
  Brain, 
  FileText, 
  MessageCircle, 
  BookOpen, 
  TrendingUp, 
  Zap 
} from 'lucide-react';
import DashboardCard from './DashboardCard';
import FileUploadModal from './FileUploadModal';
import { useUserUploads } from '@/hooks/useUserUploads';

const DashboardGrid = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { hasUploads, isLoading } = useUserUploads();
  const modules = [
    {
      title: 'Flashcards',
      titleAmharic: 'ካርዶች',
      description: 'Smart spaced repetition flashcards to boost memory retention',
      icon: Brain,
      iconColor: 'bg-gobez-green',
      notificationCount: 12,
      size: 'col-span-1 row-span-1'
    },
    {
      title: 'AI Summary',
      titleAmharic: 'ማሳያ',
      description: 'Get instant summaries of your uploaded documents and study materials',
      icon: FileText,
      iconColor: 'bg-gobez-yellow',
      notificationCount: 3,
      size: 'col-span-1 row-span-2'
    },
    {
      title: 'Chat Tutor',
      titleAmharic: 'AI መምህር',
      description: 'Ask questions and get personalized help from Gobez AI tutor',
      icon: MessageCircle,
      iconColor: 'bg-gobez-red',
      notificationCount: 5,
      size: 'col-span-2 row-span-1'
    },
    {
      title: 'Quiz Master',
      titleAmharic: 'ፈተና',
      description: 'Adaptive quizzes that adjust to your learning level',
      icon: BookOpen,
      iconColor: 'bg-primary',
      notificationCount: 2,
      size: 'col-span-1 row-span-1'
    },
    {
      title: 'Progress Tracker',
      titleAmharic: 'እድገት',
      description: 'Track your Gobez Score and learning streaks',
      icon: TrendingUp,
      iconColor: 'bg-gobez-gold',
      size: 'col-span-1 row-span-1'
    },
    {
      title: 'Quick Practice',
      titleAmharic: 'ልምምድ',
      description: 'Bite-sized practice sessions for busy schedules',
      icon: Zap,
      iconColor: 'bg-accent-foreground',
      size: 'col-span-1 row-span-1'
    }
  ];

  const handleModuleClick = (title: string) => {
    console.log(`Opening ${title} module`);
    // Navigate to dashboard with module parameter
    const moduleMap: { [key: string]: string } = {
      'Flashcards': '/dashboard?module=flashcards',
      'AI Summary': '/dashboard?module=summary', 
      'Chat Tutor': '/dashboard?module=chat',
      'Quiz Master': '/dashboard?module=quiz',
      'Progress Tracker': '/dashboard?module=progress',
      'Quick Practice': '/dashboard?module=practice'
    };
    
    const url = moduleMap[title] || '/dashboard';
    window.location.href = url;
  };

  const handleContinueLearning = () => {
    window.location.href = '/dashboard?module=chat';
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gobez-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4 font-ethiopic">
            የትምህርት ማዕከል • Learning Hub
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {hasUploads 
              ? "Continue your AI-powered learning journey with Ethiopian students"
              : "Start your AI-powered learning journey with Ethiopian students"
            }
          </p>
          
          {/* Upload Prompt - Show only if no uploads */}
          {!hasUploads && (
            <div className="max-w-lg mx-auto mb-8 p-6 border-2 border-dashed border-gobez-green/30 rounded-lg bg-gradient-to-r from-gobez-green/5 to-gobez-yellow/5">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gobez-green" />
                <h3 className="text-lg font-semibold mb-2">Start Learning!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a PDF (max 20MB) or paste a YouTube link to begin your AI-powered learning experience
                </p>
                <div className="flex gap-2 justify-center">
                  <button 
                    onClick={() => setIsUploadModalOpen(true)} 
                    className="px-4 py-2 bg-gobez-green text-white rounded-lg hover:bg-gobez-green/90 transition-colors"
                  >
                    Upload & Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Show learning modules only if user has uploads */}
        {hasUploads && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto">
            {/* Row 1 */}
            <DashboardCard
              {...modules[0]}
              onClick={() => handleModuleClick(modules[0].title)}
              className="md:col-span-1"
            />
            
            <DashboardCard
              {...modules[1]}
              onClick={() => handleModuleClick(modules[1].title)}
              className="md:col-span-1 md:row-span-2"
            />
            
            <DashboardCard
              {...modules[2]}
              onClick={() => handleModuleClick(modules[2].title)}
              className="md:col-span-2 lg:col-span-2"
            />

            {/* Row 2 */}
            <DashboardCard
              {...modules[3]}
              onClick={() => handleModuleClick(modules[3].title)}
              className="md:col-span-1"
            />
            
            <DashboardCard
              {...modules[4]}
              onClick={() => handleModuleClick(modules[4].title)}
              className="md:col-span-1"
            />
            
            <DashboardCard
              {...modules[5]}
              onClick={() => handleModuleClick(modules[5].title)}
              className="md:col-span-1"
            />
          </div>
        )}

        {/* Quick Action Bar */}
        {hasUploads && (
          <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-gobez-green/10 to-gobez-yellow/10 border border-gobez-green/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Ready to learn? Gobez neh!</h3>
                <p className="text-sm text-muted-foreground">Upload new materials or continue where you left off</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors gobez-smooth"
                >
                  Upload Files
                </button>
                <button 
                  onClick={handleContinueLearning}
                  className="px-4 py-2 border border-gobez-green text-gobez-green rounded-lg hover:bg-gobez-green/10 transition-colors gobez-smooth"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <FileUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={() => handleModuleClick('Chat Tutor')}
      />
    </section>
  );
};

export default DashboardGrid;