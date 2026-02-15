import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, User, Chrome, AtSign } from 'lucide-react';
import { toast } from 'sonner';

// Google Login Button Component
const GoogleLoginButton = ({ onClick, isLoading }: { onClick: () => void; isLoading: boolean }) => (
  <Button
    type="button"
    onClick={onClick}
    disabled={isLoading}
    variant="outline"
    className="w-full border-white/20 text-white hover:bg-white/10 h-12"
  >
    {isLoading ? (
      <span className="flex items-center gap-2">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Вход...
      </span>
    ) : (
      <>
        <Chrome className="w-5 h-5 mr-2 text-blue-400" />
        Войти через Google
      </>
    )}
  </Button>
);

export const LoginModal = () => {
  const { isLoginModalOpen, setLoginModalOpen, login, loginWithGoogle, setRegisterModalOpen } = useStore();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Load Google API
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(identifier, password);
      if (success) {
        setLoginModalOpen(false);
        setIdentifier('');
        setPassword('');
        toast.success('Добро пожаловать!');
      } else {
        setError('Неверный логин/email или пароль');
      }
    } catch {
      setError('Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');

    // Simulate Google OAuth login
    // In production, this would use actual Google OAuth
    setTimeout(async () => {
      // Generate mock Google user data
      const mockGoogleData = {
        email: `user${Date.now()}@gmail.com`,
        name: `Google User ${Math.floor(Math.random() * 1000)}`,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=google${Date.now()}`,
      };

      try {
        const success = await loginWithGoogle(mockGoogleData);
        if (success) {
          setLoginModalOpen(false);
          toast.success('Успешный вход через Google!');
        } else {
          setError('Ошибка входа через Google');
        }
      } catch {
        setError('Ошибка входа через Google');
      } finally {
        setIsGoogleLoading(false);
      }
    }, 1500);
  };

  const switchToRegister = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
    setError('');
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={setLoginModalOpen}>
      <DialogContent className="bg-gray-900 border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Вход в аккаунт</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Google Login */}
          <GoogleLoginButton onClick={handleGoogleLogin} isLoading={isGoogleLoading} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-gray-900 text-gray-500">или</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="login-identifier" className="text-gray-400">Логин или Email</Label>
              <div className="relative mt-1">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="login-identifier"
                  type="text"
                  placeholder="username или email@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="bg-white/5 border-white/10 text-white pl-10"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Можно ввести логин или email
              </p>
            </div>

            <div>
              <Label htmlFor="login-password" className="text-gray-400">Пароль</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200"
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-400">
            Нет аккаунта?{' '}
            <button
              type="button"
              onClick={switchToRegister}
              className="text-white hover:underline"
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const RegisterModal = () => {
  const { isRegisterModalOpen, setRegisterModalOpen, register, loginWithGoogle, setLoginModalOpen } = useStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    if (username.length < 3) {
      setError('Логин должен быть не менее 3 символов');
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(email, username, password);
      if (success) {
        setRegisterModalOpen(false);
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        toast.success('Регистрация успешна!');
      } else {
        setError('Пользователь с таким email или логином уже существует');
      }
    } catch {
      setError('Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    setError('');

    setTimeout(async () => {
      const mockGoogleData = {
        email: `user${Date.now()}@gmail.com`,
        name: `Google User ${Math.floor(Math.random() * 1000)}`,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=google${Date.now()}`,
      };

      try {
        const success = await loginWithGoogle(mockGoogleData);
        if (success) {
          setRegisterModalOpen(false);
          toast.success('Регистрация через Google успешна!');
        } else {
          setError('Ошибка регистрации через Google');
        }
      } catch {
        setError('Ошибка регистрации через Google');
      } finally {
        setIsGoogleLoading(false);
      }
    }, 1500);
  };

  const switchToLogin = () => {
    setRegisterModalOpen(false);
    setLoginModalOpen(true);
    setError('');
  };

  return (
    <Dialog open={isRegisterModalOpen} onOpenChange={setRegisterModalOpen}>
      <DialogContent className="bg-gray-900 border-white/20 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Создать аккаунт</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Google Register */}
          <Button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isGoogleLoading}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 h-12"
          >
            {isGoogleLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Регистрация...
              </span>
            ) : (
              <>
                <Chrome className="w-5 h-5 mr-2 text-blue-400" />
                Регистрация через Google
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-gray-900 text-gray-500">или</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-1 bg-white/5">
                <TabsTrigger value="email" className="data-[state=active]:bg-white data-[state=active]:text-black">
                  Регистрация по email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="register-username" className="text-gray-400">Логин</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="Придумайте логин"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-white/5 border-white/10 text-white pl-10"
                      required
                      minLength={3}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-email" className="text-gray-400">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/5 border-white/10 text-white pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-password" className="text-gray-400">Пароль</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/5 border-white/10 text-white pl-10 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-confirm" className="text-gray-400">Подтвердите пароль</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="register-confirm"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white/5 border-white/10 text-white pl-10"
                      required
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200"
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-400">
            Уже есть аккаунт?{' '}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-white hover:underline"
            >
              Войти
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const OrderModal = () => {
  const { isOrderModalOpen, setOrderModalOpen, selectedBooster, createOrder } = useStore();
  const [currentMMR, setCurrentMMR] = useState(2000);
  const [targetMMR, setTargetMMR] = useState(3000);
  const [steamLink, setSteamLink] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'payment'>('details');

  const mmrDiff = Math.max(0, targetMMR - currentMMR);
  const estimatedPrice = selectedBooster ? Math.round(mmrDiff * selectedBooster.pricePerMMR) : 0;
  const estimatedGames = Math.ceil(mmrDiff / 25);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'details') {
      setStep('payment');
      return;
    }

    setIsLoading(true);
    try {
      const success = await createOrder({
        boosterId: selectedBooster?.id,
        boosterName: selectedBooster?.username,
        currentMMR,
        targetMMR,
        price: estimatedPrice,
      });
      if (success) {
        setOrderModalOpen(false);
        setStep('details');
        setCurrentMMR(2000);
        setTargetMMR(3000);
        setSteamLink('');
        setNotes('');
        toast.success('Заказ создан! Ожидайте подтверждения оплаты.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedBooster) return null;

  return (
    <Dialog open={isOrderModalOpen} onOpenChange={setOrderModalOpen}>
      <DialogContent className="bg-gray-900 border-white/20 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 'details' ? 'Новый заказ' : 'Оплата'}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg mb-6">
            <img
              src={selectedBooster.avatar}
              alt={selectedBooster.username}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-semibold text-white">{selectedBooster.username}</div>
              <div className="text-sm text-gray-400">{selectedBooster.currentRank}</div>
            </div>
          </div>

          {step === 'details' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Текущий MMR</Label>
                  <Input
                    type="number"
                    value={currentMMR}
                    onChange={(e) => setCurrentMMR(Number(e.target.value))}
                    className="bg-white/5 border-white/10 text-white mt-1"
                    min={0}
                    max={10000}
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Целевой MMR</Label>
                  <Input
                    type="number"
                    value={targetMMR}
                    onChange={(e) => setTargetMMR(Number(e.target.value))}
                    className="bg-white/5 border-white/10 text-white mt-1"
                    min={currentMMR}
                    max={10000}
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-400">Ссылка на Steam профиль</Label>
                <Input
                  type="url"
                  placeholder="https://steamcommunity.com/id/..."
                  value={steamLink}
                  onChange={(e) => setSteamLink(e.target.value)}
                  className="bg-white/5 border-white/10 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-400">Примечания (опционально)</Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Особые пожелания, предпочитаемые герои и т.д."
                  className="w-full bg-white/5 border border-white/10 text-white rounded-md p-3 mt-1 resize-none h-24"
                />
              </div>

              <div className="bg-white/5 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Разница MMR:</span>
                  <span className="text-white">+{mmrDiff}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Примерно игр:</span>
                  <span className="text-white">~{estimatedGames}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-white/10">
                  <span className="text-white">Итого:</span>
                  <span className="text-white">${estimatedPrice}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
              >
                Перейти к оплате
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg mb-4">
                <div className="text-sm text-gray-400 mb-2">Сумма к оплате</div>
                <div className="text-3xl font-bold text-white">${estimatedPrice}</div>
              </div>

              <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/5">
                  <TabsTrigger value="card" className="data-[state=active]:bg-white data-[state=active]:text-black">Карта</TabsTrigger>
                  <TabsTrigger value="crypto" className="data-[state=active]:bg-white data-[state=active]:text-black">Crypto</TabsTrigger>
                  <TabsTrigger value="paypal" className="data-[state=active]:bg-white data-[state=active]:text-black">PayPal</TabsTrigger>
                </TabsList>

                <TabsContent value="card" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-400">Номер карты</Label>
                      <Input
                        placeholder="0000 0000 0000 0000"
                        className="bg-white/5 border-white/10 text-white mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-400">Срок</Label>
                        <Input
                          placeholder="MM/YY"
                          className="bg-white/5 border-white/10 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-400">CVC</Label>
                        <Input
                          placeholder="123"
                          className="bg-white/5 border-white/10 text-white mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="crypto" className="mt-4">
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">Выберите криптовалюту</div>
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" className="border-white/20">BTC</Button>
                      <Button variant="outline" className="border-white/20">ETH</Button>
                      <Button variant="outline" className="border-white/20">USDT</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="paypal" className="mt-4">
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">Вы будете перенаправлены на PayPal</div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('details')}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Назад
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-white text-black hover:bg-gray-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Обработка...' : `Оплатить $${estimatedPrice}`}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
