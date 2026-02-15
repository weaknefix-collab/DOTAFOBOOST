import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Menu, X, ChevronDown, MessageSquare, Shield, UserCircle } from 'lucide-react';

const Navbar = () => {
  const { 
    user, 
    isAuthenticated, 
    logout, 
    setLoginModalOpen,
    setProfileModalOpen,
    setChatModalOpen,
    setModeratorPanelOpen,
    getUserChats,
  } = useStore();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userChats = user ? getUserChats(user.id) : [];
  const unreadMessages = userChats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Бустеры', id: 'boosters' },
    { label: 'Как это работает', id: 'how-it-works' },
    { label: 'Стать бустером', id: 'become-booster' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-lg border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-2xl font-black text-white tracking-tighter hover:opacity-80 transition-opacity"
            >
              WEAK
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Chat Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setChatModalOpen(true)}
                    className="relative text-white hover:bg-white/10"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-xs rounded-full flex items-center justify-center font-semibold">
                        {unreadMessages}
                      </span>
                    )}
                  </Button>

                  {/* Moderator Button (hidden for regular users) */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setModeratorPanelOpen(true)}
                    className="text-gray-500 hover:text-white hover:bg-white/10"
                  >
                    <Shield className="w-5 h-5" />
                  </Button>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-white hover:bg-white/10 flex items-center gap-2"
                      >
                        {user?.avatar ? (
                          <img src={user.avatar} alt="" className="w-6 h-6 rounded-full" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                        <span className="max-w-[100px] truncate">{user?.username}</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-900 border-white/20 text-white">
                      <DropdownMenuItem 
                        onClick={() => setProfileModalOpen(true)}
                        className="hover:bg-white/10 cursor-pointer"
                      >
                        <UserCircle className="w-4 h-4 mr-2" />
                        Мой профиль
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setChatModalOpen(true)}
                        className="hover:bg-white/10 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Сообщения
                        {unreadMessages > 0 && (
                          <span className="ml-auto bg-white text-black text-xs px-2 py-0.5 rounded-full">
                            {unreadMessages}
                          </span>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem
                        onClick={logout}
                        className="hover:bg-white/10 cursor-pointer text-red-400"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Выйти
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setLoginModalOpen(true)}
                    className="text-white hover:bg-white/10"
                  >
                    Войти
                  </Button>
                  <a
                    href="https://t.me/y5jnh5rytnjm5rty6jn465tr436t24t"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-white text-black hover:bg-gray-200">
                      Написать нам
                    </Button>
                  </a>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-2xl text-white hover:text-gray-300 transition-colors"
            >
              {link.label}
            </button>
          ))}

          {isAuthenticated ? (
            <div className="flex flex-col gap-4 mt-8">
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setProfileModalOpen(true);
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8"
              >
                <User className="w-5 h-5 mr-2" />
                Мой профиль
              </Button>
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setChatModalOpen(true);
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Сообщения
              </Button>
              <Button
                onClick={logout}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 px-8"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Выйти
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setLoginModalOpen(true);
                }}
                className="border-white/20 text-white hover:bg-white/10 px-8"
              >
                Войти
              </Button>
              <a
                href="https://t.me/y5jnh5rytnjm5rty6jn465tr436t24t"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-white text-black hover:bg-gray-200 px-8">
                  Написать нам
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
