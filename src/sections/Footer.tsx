import { MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { boosters } = useStore();
  
  const activeBoosters = boosters.filter(b => b.isActive && b.isOnline).length;
  const totalOrders = boosters.reduce((sum, b) => sum + b.completedOrders, 0);

  const footerLinks: Record<string, FooterLink[]> = {
    'Сервис': [
      { label: 'Бустеры', href: '#boosters' },
      { label: 'Как это работает', href: '#how-it-works' },
      { label: 'Стать бустером', href: '#become-booster' },
      { label: 'FAQ', href: '#faq' },
    ],
    'Поддержка': [
      { label: 'Telegram', href: 'https://t.me/y5jnh5rytnjm5rty6jn465tr436t24t', external: true },
      { label: 'Discord', href: '#', external: true },
      { label: 'Email', href: 'mailto:support@weak.gg', external: true },
    ],
    'Правовое': [
      { label: 'Условия использования', href: '#' },
      { label: 'Политика конфиденциальности', href: '#' },
      { label: 'Отказ от ответственности', href: '#' },
    ],
  };

  return (
    <footer className="py-16 px-4 border-t border-white/10 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="text-3xl font-black text-white tracking-tighter mb-4">
              WEAK
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Профессиональный бустинг в Dota 2. Поднимись в рейтинге с лучшими игроками. 
              Безопасно и анонимно.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://t.me/y5jnh5rytnjm5rty6jn465tr436t24t"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
              <a
                href="mailto:support@weak.gg"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                    >
                      {link.label}
                      {link.external && <ExternalLink className="w-3 h-3" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-500 text-sm">
            {currentYear} WEAK. Все права защищены.
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>{activeBoosters} бустеров онлайн</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full" />
            <span>{totalOrders} выполненных заказов</span>
          </div>
        </div>

        <div className="mt-8 p-4 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-500 text-center">
            WEAK не связан с Valve Corporation. Dota 2 является торговой маркой Valve Corporation. 
            Бустинг может нарушать условия использования игры. Используйте сервис на свой страх и риск.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
