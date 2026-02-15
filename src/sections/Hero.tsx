import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Lock, Users, Shield, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { isAuthenticated, setLoginModalOpen, getActiveBoostersCount } = useStore();
  const activeBoostersCount = getActiveBoostersCount();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        const dx = mousePos.x - particle.x;
        const dy = mousePos.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          particle.vx -= dx * 0.0001;
          particle.vy -= dy * 0.0001;
        }

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();

        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const scrollToBoosters = () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    document.getElementById('boosters')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      <div className="absolute inset-0 grid-pattern opacity-50 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-[2]" />

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Online boosters badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 fade-in">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">
            {activeBoostersCount > 0 ? `${activeBoostersCount} бустеров онлайн` : 'Бустеры ждут заказов'}
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 fade-in">
          <span className="text-white glow-text">WEAK</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 mb-4 fade-in stagger-1">
          Профессиональный бустинг в Dota 2
        </p>

        <p className="text-gray-500 max-w-2xl mx-auto mb-12 fade-in stagger-2">
          Поднимись в рейтинге с лучшими игроками. Безопасно и анонимно. 
          {isAuthenticated 
            ? ' Выбери бустера и начни свой путь к высокому рейтингу.'
            : ' Войди или зарегистрируйся, чтобы увидеть доступных бустеров.'
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 fade-in stagger-3">
          {!isAuthenticated ? (
            <>
              <Button
                size="lg"
                onClick={() => setLoginModalOpen(true)}
                className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg font-semibold btn-shine glow-hover"
              >
                <Lock className="w-5 h-5 mr-2" />
                Войти для просмотра
              </Button>
              <a
                href="https://t.me/y5jnh5rytnjm5rty6jn465tr436t24t"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  Связаться в Telegram
                </Button>
              </a>
            </>
          ) : (
            <>
              <Button
                size="lg"
                onClick={scrollToBoosters}
                className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg font-semibold btn-shine glow-hover"
              >
                Выбрать бустера
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <a
                href="https://t.me/y5jnh5rytnjm5rty6jn465tr436t24t"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  Поддержка
                </Button>
              </a>
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto fade-in stagger-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-white/60" />
            </div>
            <div className="text-lg font-bold text-white mb-1">Проверенные</div>
            <div className="text-sm text-gray-500">Только верифицированные бустеры</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Shield className="w-6 h-6 text-white/60" />
            </div>
            <div className="text-lg font-bold text-white mb-1">Безопасность</div>
            <div className="text-sm text-gray-500">Без VPN и сторонних программ</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 text-white/60" />
            </div>
            <div className="text-lg font-bold text-white mb-1">Быстро</div>
            <div className="text-sm text-gray-500">Начинаем сразу после оплаты</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Lock className="w-6 h-6 text-white/60" />
            </div>
            <div className="text-lg font-bold text-white mb-1">Анонимно</div>
            <div className="text-sm text-gray-500">Ваши данные под защитой</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[3]" />
    </section>
  );
};

export default Hero;
