import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Star, 
  TrendingUp, 
  Gamepad2, 
  Globe, 
  CheckCircle2, 
  Circle,
  Filter,
  X,
  MessageCircle,
  ShoppingCart,
  Lock,
  Send,
  User
} from 'lucide-react';
import type { Booster, Rank, Role, Review } from '@/types';
import { ranks, roles, languages, getRankColor } from '@/data/mockData';

const Boosters = () => {
  const { 
    boosters, 
    filters, 
    setFilters, 
    selectBooster, 
    selectedBooster,
    setOrderModalOpen,
    isAuthenticated,
    setLoginModalOpen,
    user,
    createChat,
    setChatModalOpen,
    addReview,
    canReviewBooster,
    getUserOrders
  } = useStore();

  const [showFilters, setShowFilters] = useState(false);
  const [filteredBoosters, setFilteredBoosters] = useState<Booster[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewOrderId, setReviewOrderId] = useState('');

  useEffect(() => {
    let result = boosters.filter(b => b.isActive);

    if (filters.rank) {
      result = result.filter(b => b.currentRank === filters.rank);
    }
    if (filters.role) {
      result = result.filter(b => b.roles.includes(filters.role as Role));
    }
    if (filters.minRating) {
      result = result.filter(b => b.rating >= (filters.minRating || 0));
    }
    if (filters.language) {
      result = result.filter(b => b.languages.includes(filters.language as string));
    }
    if (filters.isOnline) {
      result = result.filter(b => b.isOnline);
    }

    if (searchQuery) {
      result = result.filter(b => 
        b.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.heroes.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredBoosters(result);
  }, [boosters, filters, searchQuery]);

  const handleOrderClick = (booster: Booster) => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    selectBooster(booster);
    setOrderModalOpen(true);
  };

  const handleChatClick = (booster: Booster) => {
    if (!isAuthenticated || !user) {
      setLoginModalOpen(true);
      return;
    }
    createChat(booster.id, booster.username, booster.avatar);
    setChatModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!user || !selectedBooster) return;
    
    await addReview({
      orderId: reviewOrderId,
      authorId: user.id,
      authorName: user.username,
      authorAvatar: user.avatar,
      boosterId: selectedBooster.id,
      rating: reviewRating,
      comment: reviewComment,
      isVerified: true,
    });
    
    setShowReviewForm(false);
    setReviewComment('');
    setReviewRating(5);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const openReviewForm = (booster: Booster) => {
    if (!user) return;
    const orders = getUserOrders(user.id);
    const completedOrder = orders.find(o => 
      o.boosterId === booster.id && 
      o.status === 'completed' && 
      o.canReview && 
      !o.isReviewed
    );
    if (completedOrder) {
      setReviewOrderId(completedOrder.id);
      selectBooster(booster);
      setShowReviewForm(true);
    }
  };

  // If not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <section id="boosters" className="py-24 px-4 relative">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12">
            <Lock className="w-16 h-16 text-white/40 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Бустеры скрыты</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Для просмотра каталога бустеров необходимо войти в аккаунт или зарегистрироваться
            </p>
            <Button
              onClick={() => setLoginModalOpen(true)}
              className="bg-white text-black hover:bg-gray-200 px-8"
            >
              Войти / Регистрация
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="boosters" className="py-24 px-4 relative">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Выбери своего <span className="text-gradient">бустера</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Все бустеры проходят строгую верификацию. Выбирай по рейтингу, роли и языку.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Поиск по нику или герою..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 pl-4"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
              {Object.keys(filters).length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-white text-black">
                  {Object.keys(filters).length}
                </Badge>
              )}
            </Button>
          </div>

          {showFilters && (
            <Card className="bg-white/5 border-white/10 mb-4 slide-up">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Ранг</label>
                    <Select
                      value={filters.rank || ''}
                      onValueChange={(value) => setFilters({ ...filters, rank: value as Rank })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Все ранги" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/20">
                        <SelectItem value="">Все ранги</SelectItem>
                        {ranks.map(rank => (
                          <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Роль</label>
                    <Select
                      value={filters.role || ''}
                      onValueChange={(value) => setFilters({ ...filters, role: value as Role })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Все роли" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/20">
                        <SelectItem value="">Все роли</SelectItem>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Язык</label>
                    <Select
                      value={filters.language || ''}
                      onValueChange={(value) => setFilters({ ...filters, language: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Все языки" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/20">
                        <SelectItem value="">Все языки</SelectItem>
                        {languages.map(lang => (
                          <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Онлайн</label>
                    <Select
                      value={filters.isOnline !== undefined ? String(filters.isOnline) : ''}
                      onValueChange={(value) => {
                        if (value === '') {
                          const { isOnline, ...rest } = filters;
                          setFilters(rest);
                        } else {
                          setFilters({ ...filters, isOnline: value === 'true' });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Все" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/20">
                        <SelectItem value="">Все</SelectItem>
                        <SelectItem value="true">Онлайн</SelectItem>
                        <SelectItem value="false">Офлайн</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {Object.keys(filters).length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="mt-4 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Сбросить фильтры
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="text-gray-400 mb-6">
          Найдено: <span className="text-white font-semibold">{filteredBoosters.length}</span> бустеров
        </div>

        {/* Boosters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBoosters.map((booster, index) => (
            <Card
              key={booster.id}
              className="bg-white/5 border-white/10 overflow-hidden card-hover group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="relative p-6 pb-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <img
                        src={booster.avatar}
                        alt={booster.username}
                        className="w-16 h-16 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-black ${booster.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}>
                        {booster.isOnline ? (
                          <CheckCircle2 className="w-3 h-3 text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        ) : (
                          <Circle className="w-3 h-3 text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">
                          {booster.rating > 0 ? booster.rating : '—'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {booster.reviews.length} отзывов
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{booster.username}</h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: getRankColor(booster.currentRank), color: getRankColor(booster.currentRank) }}
                    >
                      {booster.currentRank}
                    </Badge>
                    {booster.isVerified && (
                      <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="px-6 py-3 bg-white/5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{booster.winrate}% WR</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{booster.roles[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-3">
                  <div className="flex items-center gap-2 mb-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{booster.languages.join(', ')}</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 line-clamp-2">{booster.description}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-white">${booster.pricePerMMR}</div>
                      <div className="text-xs text-gray-500">за 1 MMR</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">${booster.pricePerGame}</div>
                      <div className="text-xs text-gray-500">за игру</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                      onClick={() => handleChatClick(booster)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Чат
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-white text-black hover:bg-gray-200"
                      onClick={() => handleOrderClick(booster)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Заказать
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBoosters.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">Бустеры не найдены</div>
            {boosters.length === 0 ? (
              <div className="text-gray-600">
                В данный момент нет доступных бустеров. Загляните позже!
              </div>
            ) : (
              <Button variant="outline" onClick={clearFilters} className="border-white/20 text-white">
                Сбросить фильтры
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Booster Detail Dialog */}
      <Dialog open={!!selectedBooster && !showReviewForm} onOpenChange={() => selectBooster(null)}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedBooster && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Профиль бустера</DialogTitle>
              </DialogHeader>

              <div className="mt-4">
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={selectedBooster.avatar}
                    alt={selectedBooster.username}
                    className="w-24 h-24 rounded-full border-2 border-white/20"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedBooster.username}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge 
                        variant="outline"
                        style={{ borderColor: getRankColor(selectedBooster.currentRank), color: getRankColor(selectedBooster.currentRank) }}
                      >
                        {selectedBooster.currentRank}
                      </Badge>
                      {selectedBooster.isVerified && (
                        <Badge className="bg-green-500/20 text-green-400 border-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge variant="outline" className="border-white/20">
                        {selectedBooster.isOnline ? 'Онлайн' : 'Офлайн'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">
                          {selectedBooster.rating > 0 ? selectedBooster.rating : '—'}
                        </span>
                        <span className="text-gray-500">({selectedBooster.reviews.length} отзывов)</span>
                      </div>
                      <div className="text-gray-400">{selectedBooster.completedOrders} заказов</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/5 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">{selectedBooster.winrate}%</div>
                    <div className="text-xs text-gray-500">Винрейт</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">{selectedBooster.peakRank}</div>
                    <div className="text-xs text-gray-500">Пиковый ранг</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">${selectedBooster.pricePerMMR}</div>
                    <div className="text-xs text-gray-500">За MMR</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">${selectedBooster.pricePerGame}</div>
                    <div className="text-xs text-gray-500">За игру</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Описание</h4>
                  <p className="text-gray-300">{selectedBooster.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Роли</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooster.roles.map(role => (
                      <Badge key={role} variant="outline" className="border-white/20">{role}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Лучшие герои</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooster.heroes.map(hero => (
                      <Badge key={hero} className="bg-white/10">{hero}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Языки</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooster.languages.map(lang => (
                      <Badge key={lang} variant="outline" className="border-white/20">{lang}</Badge>
                    ))}
                  </div>
                </div>

                {selectedBooster.reviews.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Отзывы</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedBooster.reviews.map((review: Review) => (
                        <div key={review.id} className="bg-white/5 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {review.authorAvatar ? (
                                <img src={review.authorAvatar} alt="" className="w-6 h-6 rounded-full" />
                              ) : (
                                <User className="w-6 h-6 text-gray-500" />
                              )}
                              <span className="font-semibold text-white text-sm">{review.authorName}</span>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-sm">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-400">{review.comment}</p>
                          <div className="text-xs text-gray-600 mt-1">
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add review button if can review */}
                {user && canReviewBooster(user.id, selectedBooster.id) && (
                  <Button
                    variant="outline"
                    className="w-full mb-3 border-white/20 text-white hover:bg-white/10"
                    onClick={() => openReviewForm(selectedBooster)}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Оставить отзыв
                  </Button>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    onClick={() => handleChatClick(selectedBooster)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Написать
                  </Button>
                  <Button
                    className="flex-1 bg-white text-black hover:bg-gray-200"
                    onClick={() => {
                      selectBooster(null);
                      handleOrderClick(selectedBooster);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Заказать буст
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Form Dialog */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Оставить отзыв</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-2 block">Оценка</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1"
                  >
                    <Star 
                      className={`w-8 h-8 ${star <= reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-2 block">Комментарий</label>
              <Textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Расскажите о вашем опыте работы с бустером..."
                className="bg-white/5 border-white/10 text-white resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Отмена
              </Button>
              <Button
                onClick={handleSubmitReview}
                className="flex-1 bg-white text-black hover:bg-gray-200"
                disabled={!reviewComment.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Отправить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Boosters;
