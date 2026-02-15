import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Award, 
  Zap,
  CheckCircle2,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { useStore } from '@/store/useStore';

const benefits = [
  {
    icon: DollarSign,
    title: 'Высокий доход',
    description: 'Зарабатывай от $500 до $3000 в месяц в зависимости от количества заказов.',
  },
  {
    icon: Clock,
    title: 'Гибкий график',
    description: 'Работай когда удобно. Никаких обязательств и фиксированных часов.',
  },
  {
    icon: TrendingUp,
    title: 'Рост рейтинга',
    description: 'Получай бонусы за высокий винрейт и положительные отзывы.',
  },
  {
    icon: Users,
    title: 'Стабильный поток',
    description: 'Большая база клиентов обеспечивает постоянный поток заказов.',
  },
];

const requirements = [
  'Ранг Divine или Immortal',
  'Винрейт выше 60%',
  'Активная игра последние 3 месяца',
  'Коммуникабельность и пунктуальность',
  'Честная игра без читов',
];

const BecomeBooster = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { boosters } = useStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const activeBoosters = boosters.filter(b => b.isActive).length;
  const totalOrders = boosters.reduce((sum, b) => sum + b.completedOrders, 0);

  return (
    <section
      id="become-booster"
      ref={sectionRef}
      className="py-24 px-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 ${isVisible ? 'fade-in' : 'opacity-0'}`}>
            <Award className="w-4 h-4 text-white" />
            <span className="text-sm text-gray-300">Присоединяйся к команде</span>
          </div>

          <h2 className={`text-4xl md:text-5xl font-bold text-white mb-4 ${isVisible ? 'fade-in stagger-1' : 'opacity-0'}`}>
            Стань <span className="text-gradient">бустером</span>
          </h2>

          <p className={`text-gray-400 max-w-2xl mx-auto ${isVisible ? 'fade-in stagger-2' : 'opacity-0'}`}>
            Преврати свои навыки Dota 2 в доход. Мы ищем талантливых игроков 
            с высоким рейтингом для работы в нашей команде.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className={`text-2xl font-bold text-white mb-6 ${isVisible ? 'slide-up' : 'opacity-0'}`}>
              Почему WEAK?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <Card
                  key={benefit.title}
                  className={`bg-white/5 border-white/10 card-hover ${
                    isVisible ? 'slide-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                >
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                      <benefit.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Card className={`bg-white/5 border-white/10 ${isVisible ? 'slide-up stagger-3' : 'opacity-0'}`}>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Требования
                </h3>

                <ul className="space-y-3 mb-6">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{req}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-400">Средний доход</div>
                      <div className="text-2xl font-bold text-white">$1500/мес</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Топ бустеры</div>
                      <div className="text-2xl font-bold text-white">$3000+</div>
                    </div>
                  </div>

                  <a
                    href="https://t.me/y5jnh5rytnjm5rty6jn465tr436t24t"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button className="w-full bg-white text-black hover:bg-gray-200 btn-shine">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Написать в Telegram
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>

                  <p className="text-center text-xs text-gray-500 mt-3">
                    Ответим в течение 24 часов
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats bar - real data */}
        <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-white/5 border border-white/10 rounded-xl ${isVisible ? 'slide-up stagger-5' : 'opacity-0'}`}>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{activeBoosters}</div>
            <div className="text-sm text-gray-500">Активных бустеров</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{totalOrders}</div>
            <div className="text-sm text-gray-500">Выполнено заказов</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">—</div>
            <div className="text-sm text-gray-500">Рейтинг платформы</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm text-gray-500">Поддержка</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeBooster;
