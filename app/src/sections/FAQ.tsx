import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Насколько безопасен бустинг?',
    answer: 'Наши бустеры играют честно без использования читов и сторонних программ. Мы тщательно отбираем бустеров и следим за качеством их работы. Однако бустинг может нарушать условия использования игры, поэтому используйте сервис на свой страх и риск.',
  },
  {
    question: 'Сколько времени занимает буст?',
    answer: 'Время зависит от разницы MMR. В среднем бустер делает 75-150 MMR в день. Например, поднятие с 2000 до 3000 MMR занимает 7-14 дней. Вы всегда можете уточнить сроки у конкретного бустера перед заказом.',
  },
  {
    question: 'Могу ли я играть во время буста?',
    answer: 'Нет, во время выполнения заказа играть на аккаунте нельзя. Это может привести к бану и увеличению сроков выполнения. Если нужно поиграть — согласуйте перерыв с бустером.',
  },
  {
    question: 'Какие способы оплаты доступны?',
    answer: 'Мы принимаем банковские карты (Visa, Mastercard), криптовалюту (BTC, ETH, USDT) и PayPal. Все транзакции защищены и анонимны.',
  },
  {
    question: 'Что если мне не понравится бустер?',
    answer: 'Вы можете связаться с нами в любое время. Если бустер еще не начал работу — вернем полную сумму. Если работа уже ведется — решим вопрос индивидуально, вплоть до замены бустера.',
  },
  {
    question: 'Есть ли гарантия результата?',
    answer: 'Да, мы гарантируем достижение заказанного MMR. Если по каким-то причинам бустер не справится — вернем деньги или предложим альтернативное решение.',
  },
  {
    question: 'Могу ли я указать предпочитаемых героев?',
    answer: 'Да, при оформлении заказа можно указать пожелания по героям. Бустер постарается использовать их, но основной приоритет — эффективность и скорость повышения рейтинга.',
  },
  {
    question: 'Как стать бустером на WEAK?',
    answer: 'Для начала нужно иметь ранг Divine или Immortal, винрейт выше 60% и активно играть. Напиши нам в Telegram — мы проверим твой профиль и проведем короткое собеседование.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-4 relative">
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Частые <span className="text-gradient">вопросы</span>
          </h2>
          <p className="text-gray-400">
            Ответы на самые популярные вопросы о нашем сервисе
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-white pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-5">
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Не нашел ответ на свой вопрос?</p>
          <a
            href="https://t.me/y5jnh5rytnjm5rty6jn465tr436t24t"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          >
            Напиши нам в Telegram
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
