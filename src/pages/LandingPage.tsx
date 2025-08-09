import { useState } from 'react';
import { Star, Users, BookOpen, Trophy, ArrowRight, Play, Check } from 'lucide-react';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/AuthDialog';
import heroBg from '@/assets/gobez-hero-bg.jpg';

const LandingPage = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'AI-Powered Learning',
      titleAmharic: 'AI የተደገፈ ትምህርት',
      description: 'Upload PDFs, images, and documents. Get instant summaries and personalized tutoring.',
    },
    {
      icon: Users,
      title: 'Ethiopian Context',
      titleAmharic: 'የኢትዮጵያ አውድ',
      description: 'Culturally relevant education with Amharic support and local examples.',
    },
    {
      icon: Trophy,
      title: 'Progress Tracking',
      titleAmharic: 'እድገት መከታተል',
      description: 'Track your Gobez Score, learning streaks, and adaptive assessments.',
    },
  ];

  const testimonials = [
    {
      name: 'Hanan Mohammed',
      nameAmharic: 'ሃናን መሃመድ',
      role: 'Medical Student, AAU',
      content: 'Gobez helped me understand complex medical concepts in both English and Amharic. Wayz ena!',
      rating: 5,
    },
    {
      name: 'Dawit Tadesse',
      nameAmharic: 'ዳዊት ታደሰ',
      role: 'Engineering Student',
      content: 'The AI tutor explains everything so clearly. My grades improved by 40% this semester!',
      rating: 5,
    },
    {
      name: 'Sara Bekele',
      nameAmharic: 'ሳራ በቀለ',
      role: 'High School Student',
      content: 'Finally, an AI that understands Ethiopian education. Gobez neh really!',
      rating: 5,
    },
  ];

  const stats = [
    { number: '25,000+', label: 'Students Learning', labelAmharic: 'ተማሪዎች' },
    { number: '95%', label: 'Success Rate', labelAmharic: 'የስኬት መጠን' },
    { number: '24/7', label: 'AI Support', labelAmharic: 'AI ድጋፍ' },
    { number: '50+', label: 'Universities', labelAmharic: 'ዩኒቨርሲቲዎች' },
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setShowAuthDialog(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 ethiopian-motif overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 font-ethiopic">
            <span className="bg-gradient-to-r from-gobez-green to-gobez-yellow bg-clip-text text-transparent">
              Gobez
            </span>
            <br />
            <span className="text-foreground text-4xl sm:text-5xl lg:text-6xl">AI Learning Platform</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            The first AI-powered learning platform designed for Ethiopian students
          </p>
          
          <p className="text-lg text-gobez-green mb-8 font-ethiopic">
            ለኢትዮጵያ ተማሪዎች የተዘጋጀው የመጀመሪያው AI የትምህርት መድረክ
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="gobez-hover-lift bg-primary hover:bg-primary/90 text-lg px-8 py-4"
              onClick={handleGetStarted}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Learning Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="gobez-hover-lift text-lg px-8 py-4"
              onClick={() => navigate('/demo')}
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-gobez-green font-ethiopic">{stat.labelAmharic}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-ethiopic">
              Why Choose Gobez?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built specifically for Ethiopian students with AI that understands your educational context
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 text-center gobez-card gobez-hover-lift">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-gobez-green to-gobez-yellow flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gobez-green font-ethiopic mb-4">{feature.titleAmharic}</p>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-ethiopic">
              Student Success Stories
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of Ethiopian students achieving their academic goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 gobez-card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gobez-yellow text-gobez-yellow" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-gobez-green font-ethiopic">{testimonial.nameAmharic}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gobez-green/10 to-gobez-yellow/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the AI learning revolution designed for Ethiopian students
          </p>
          <Button 
            size="lg" 
            className="gobez-hover-lift bg-primary hover:bg-primary/90 text-lg px-12 py-4"
            onClick={handleGetStarted}
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Start Your Journey - Gobez neh!
          </Button>
        </div>
      </section>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      <Footer />
    </div>
  );
};

export default LandingPage;
