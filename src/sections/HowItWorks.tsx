import { useEffect, useRef, useState } from 'react';
import { Search, UserCheck, CreditCard, TrendingUp, Shield, Clock } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Выбери бустера',
    description: 'Просматривай профили бустеров, сравнивай рейтинги, цены и отзывы. Фильтруй по рангу, роли и языку.',
  },
  {
    icon: UserCheck,
    title: 'Укажи детали',
    description: 'Введи текущий и желаемый MMR, укажи ссылку на свой Steam профиль и особые пожелания.',
  },
  {
    icon: CreditCard,
    title: 'Оплати',
    description: 'Выбери удобный способ оплаты: банковская карта, криптовалюта или PayPal. Все транзакции защищены.',
  },
  {
    icon: TrendingUp,
    title: 'Следи за прогрессом',
    description: 'Бустер начинает работу сразу после оплаты. Следи за прогрессом в реальном времени.',
  },
];

const features = [
  {
    icon: Shield,
    title: 'Безопасность',
    description: 'Честная игра без читов и сторонних программ.',
  },
  {
    icon: Clock,
    title: 'Скорость',
    description: 'Среднее время выполнения заказа — 1-3 дня.',
  },
  {
    icon: TrendingUp,
    title: 'Гарантия',
    description: 'Возврат средств, если не выполним заказ.',
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 px-4 relative"
    >
      <div className="absolute inset-0 line-pattern opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Как это <span className="text-gradient">работает</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Простой и прозрачный процесс. Начни свой путь к высокому рейтингу за 4 шага.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`relative ${isVisible ? 'slide-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="absolute -top-4 -left-2 text-7xl font-black text-white/5 select-none">
                {index + 1}
              </div>

              <div className="relative bg-white/5 border border-white/10 rounded-xl p-6 h-full card-hover">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <step.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-white/20 to-transparent" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-xl ${
                isVisible ? 'slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${(steps.length + index) * 0.15}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
