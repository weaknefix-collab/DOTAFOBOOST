import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  X,
  Users,
  TrendingUp,
  LogOut
} from 'lucide-react';
import type { Rank, Role } from '@/types';
import { ranks, roles, languages } from '@/data/mockData';

const ModeratorPanel = () => {
  const {
    isModeratorPanelOpen,
    setModeratorPanelOpen,
    isModerator,
    moderatorLogin,
    logout,
    boosters,
    addBooster,
    removeBooster,
    verifyBooster,
    setAddBoosterModalOpen,
    isAddBoosterModalOpen,
  } = useStore();

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [newBooster, setNewBooster] = useState({
    username: '',
    currentRank: 'Immortal' as Rank,
    peakRank: 'Immortal' as Rank,
    winrate: 65,
    pricePerGame: 10,
    pricePerMMR: 0.5,
    languages: ['English'],
    roles: ['Carry'] as Role[],
    heroes: '',
    description: '',
  });

  const handleModeratorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const success = await moderatorLogin(loginData.username, loginData.password);
    if (!success) {
      setLoginError('Неверный логин или пароль');
    }
  };

  const handleAddBooster = async () => {
    const success = await addBooster({
      ...newBooster,
      heroes: newBooster.heroes.split(',').map(h => h.trim()).filter(Boolean),
    });
    
    if (success) {
      setAddBoosterModalOpen(false);
      setNewBooster({
        username: '',
        currentRank: 'Immortal',
        peakRank: 'Immortal',
        winrate: 65,
        pricePerGame: 10,
        pricePerMMR: 0.5,
        languages: ['English'],
        roles: ['Carry'],
        heroes: '',
        description: '',
      });
    }
  };

  const handleLogout = () => {
    logout();
    setModeratorPanelOpen(false);
  };

  // Login form for moderator
  if (!isModerator) {
    return (
      <Dialog open={isModeratorPanelOpen} onOpenChange={setModeratorPanelOpen}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Вход для модератора
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleModeratorLogin} className="mt-4 space-y-4">
            <div>
              <Label className="text-gray-400">Логин</Label>
              <Input
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="mt-1 bg-white/5 border-white/10 text-white"
                placeholder="Введите логин"
              />
            </div>

            <div>
              <Label className="text-gray-400">Пароль</Label>
              <Input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="mt-1 bg-white/5 border-white/10 text-white"
                placeholder="Введите пароль"
              />
            </div>

            {loginError && (
              <div className="text-red-400 text-sm">{loginError}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              <Shield className="w-4 h-4 mr-2" />
              Войти
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      {/* Main Moderator Panel */}
      <Dialog open={isModeratorPanelOpen} onOpenChange={setModeratorPanelOpen}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-400" />
              Панель модератора
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="boosters" className="mt-4">
            <TabsList className="grid w-full grid-cols-2 bg-white/5">
              <TabsTrigger value="boosters" className="data-[state=active]:bg-white data-[state=active]:text-black">
                <Users className="w-4 h-4 mr-2" />
                Бустеры
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-white data-[state=active]:text-black">
                <TrendingUp className="w-4 h-4 mr-2" />
                Статистика
              </TabsTrigger>
            </TabsList>

            <TabsContent value="boosters" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-gray-400">
                  Всего бустеров: <span className="text-white font-semibold">{boosters.length}</span>
                </div>
                <Button
                  onClick={() => setAddBoosterModalOpen(true)}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Добавить бустера
                </Button>
              </div>

              <div className="space-y-3">
                {boosters.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Нет добавленных бустеров</p>
                  </div>
                ) : (
                  boosters.map((booster) => (
                    <div key={booster.id} className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={booster.avatar}
                            alt={booster.username}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <div className="font-semibold text-white flex items-center gap-2">
                              {booster.username}
                              {booster.isVerified && (
                                <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">
                              {booster.currentRank} • {booster.winrate}% WR • ${booster.pricePerMMR}/MMR
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!booster.isVerified && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => verifyBooster(booster.id)}
                              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeBooster(booster.id)}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Заказов: {booster.completedOrders} | 
                        Рейтинг: {booster.rating > 0 ? (
                          <span className="text-yellow-400">★ {booster.rating}</span>
                        ) : '—'} |
                        Отзывов: {booster.reviews.length}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full mt-6 border-white/20 text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти из панели
              </Button>
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-white">{boosters.length}</div>
                  <div className="text-sm text-gray-500">Всего бустеров</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-white">
                    {boosters.filter(b => b.isOnline).length}
                  </div>
                  <div className="text-sm text-gray-500">Онлайн</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-white">
                    {boosters.filter(b => b.isVerified).length}
                  </div>
                  <div className="text-sm text-gray-500">Верифицированы</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-white">
                    {boosters.reduce((sum, b) => sum + b.completedOrders, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Всего заказов</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Booster Modal */}
      <Dialog open={isAddBoosterModalOpen} onOpenChange={setAddBoosterModalOpen}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Добавить бустера
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <Label className="text-gray-400">Никнейм</Label>
              <Input
                value={newBooster.username}
                onChange={(e) => setNewBooster({ ...newBooster, username: e.target.value })}
                className="mt-1 bg-white/5 border-white/10 text-white"
                placeholder="Введите никнейм"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Текущий ранг</Label>
                <select
                  value={newBooster.currentRank}
                  onChange={(e) => setNewBooster({ ...newBooster, currentRank: e.target.value as Rank })}
                  className="w-full mt-1 bg-white/5 border border-white/10 text-white rounded-md p-2"
                >
                  {ranks.map(rank => (
                    <option key={rank} value={rank} className="bg-gray-900">{rank}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-gray-400">Пиковый ранг</Label>
                <select
                  value={newBooster.peakRank}
                  onChange={(e) => setNewBooster({ ...newBooster, peakRank: e.target.value as Rank })}
                  className="w-full mt-1 bg-white/5 border border-white/10 text-white rounded-md p-2"
                >
                  {ranks.map(rank => (
                    <option key={rank} value={rank} className="bg-gray-900">{rank}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label className="text-gray-400">Винрейт (%)</Label>
              <Input
                type="number"
                value={newBooster.winrate}
                onChange={(e) => setNewBooster({ ...newBooster, winrate: Number(e.target.value) })}
                className="mt-1 bg-white/5 border-white/10 text-white"
                min={0}
                max={100}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Цена за игру ($)</Label>
                <Input
                  type="number"
                  value={newBooster.pricePerGame}
                  onChange={(e) => setNewBooster({ ...newBooster, pricePerGame: Number(e.target.value) })}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                  min={1}
                />
              </div>
              <div>
                <Label className="text-gray-400">Цена за MMR ($)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={newBooster.pricePerMMR}
                  onChange={(e) => setNewBooster({ ...newBooster, pricePerMMR: Number(e.target.value) })}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                  min={0.1}
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-400">Роли (выберите)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {roles.map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      const newRoles = newBooster.roles.includes(role)
                        ? newBooster.roles.filter(r => r !== role)
                        : [...newBooster.roles, role];
                      setNewBooster({ ...newBooster, roles: newRoles });
                    }}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      newBooster.roles.includes(role)
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-gray-400 border-white/20 hover:border-white/50'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-gray-400">Языки</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {languages.slice(0, 5).map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      const newLangs = newBooster.languages.includes(lang)
                        ? newBooster.languages.filter(l => l !== lang)
                        : [...newBooster.languages, lang];
                      setNewBooster({ ...newBooster, languages: newLangs });
                    }}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      newBooster.languages.includes(lang)
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-gray-400 border-white/20 hover:border-white/50'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-gray-400">Герои (через запятую)</Label>
              <Input
                value={newBooster.heroes}
                onChange={(e) => setNewBooster({ ...newBooster, heroes: e.target.value })}
                className="mt-1 bg-white/5 border-white/10 text-white"
                placeholder="Invoker, Shadow Fiend, Pudge"
              />
            </div>

            <div>
              <Label className="text-gray-400">Описание</Label>
              <textarea
                value={newBooster.description}
                onChange={(e) => setNewBooster({ ...newBooster, description: e.target.value })}
                className="w-full mt-1 bg-white/5 border border-white/10 text-white rounded-md p-3 resize-none"
                rows={3}
                placeholder="Опишите опыт и достижения бустера..."
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setAddBoosterModalOpen(false)}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                <X className="w-4 h-4 mr-2" />
                Отмена
              </Button>
              <Button
                onClick={handleAddBooster}
                disabled={!newBooster.username.trim()}
                className="flex-1 bg-white text-black hover:bg-gray-200"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModeratorPanel;
