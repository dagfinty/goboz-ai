import { useState } from 'react';
import { Globe, Menu, X, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'am'>('en');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { 
      en: 'Home', 
      am: 'ቤት', 
      href: '/' 
    },
    { 
      en: 'Features', 
      am: 'ባህሪያት', 
      href: '/features' 
    },
    { 
      en: 'Dashboard', 
      am: 'ዳሽቦርድ', 
      href: '/dashboard' 
    },
    { 
      en: 'Resources', 
      am: 'ሃብቶች', 
      href: '/resources' 
    }
  ];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'am' : 'en');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gobez-green to-gobez-yellow flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-bold text-foreground font-ethiopic">
              {language === 'en' ? 'Gobez' : 'ጎበዝ'}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors gobez-smooth font-medium"
              >
                {language === 'en' ? item.en : item.am}
              </a>
            ))}
          </div>

          {/* Right side - Language toggle and Sign In */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  {language === 'en' ? 'EN' : 'አማ'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('am')}>
                  አማርኛ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    {language === 'en' ? 'Dashboard' : 'ዳሽቦርድ'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/account')}>
                    <User className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Account' : 'መለያ'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Sign Out' : 'ውጣ'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/signin')}>
                {language === 'en' ? 'Sign In' : 'ግባ'}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-border mt-2">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors gobez-smooth font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === 'en' ? item.en : item.am}
                </a>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Globe className="w-4 h-4" />
                      {language === 'en' ? 'EN' : 'አማ'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setLanguage('en')}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('am')}>
                      አማርኛ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {user ? (
                  <Button variant="ghost" onClick={signOut} className="gap-2">
                    <LogOut className="w-4 h-4" />
                    {language === 'en' ? 'Sign Out' : 'ውጣ'}
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => navigate('/signin')}>
                    {language === 'en' ? 'Sign In' : 'ግባ'}
                  </Button>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;