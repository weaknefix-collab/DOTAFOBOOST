import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Navbar from '@/components/Navbar';
import Hero from '@/sections/Hero';
import Boosters from '@/sections/Boosters';
import HowItWorks from '@/sections/HowItWorks';
import BecomeBooster from '@/sections/BecomeBooster';
import FAQ from '@/sections/FAQ';
import Footer from '@/sections/Footer';
import { LoginModal, RegisterModal, OrderModal } from '@/components/AuthModals';
import Chat from '@/components/Chat';
import ProfileModal from '@/components/ProfileModal';
import ModeratorPanel from '@/components/ModeratorPanel';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const { isAuthenticated } = useStore();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      <main>
        <Hero />
        {isAuthenticated && <Boosters />}
        <HowItWorks />
        <BecomeBooster />
        <FAQ />
      </main>

      <Footer />

      {/* Modals */}
      <LoginModal />
      <RegisterModal />
      <OrderModal />
      <Chat />
      <ProfileModal />
      <ModeratorPanel />

      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;
