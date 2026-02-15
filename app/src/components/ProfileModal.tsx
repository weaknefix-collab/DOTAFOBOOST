import { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  DollarSign, 
  Camera,
  Edit2,
  Save,
  X,
  CheckCircle2,
  Clock,
  Star
} from 'lucide-react';

const ProfileModal = () => {
  const {
    isProfileModalOpen,
    setProfileModalOpen,
    user,
    updateProfile,
    uploadAvatar,
    getUserOrders,
  } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    description: user?.description || '',
    discord: user?.discord || '',
    telegram: user?.telegram || '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const orders = user ? getUserOrders(user.id) : [];
  const completedOrders = orders.filter(o => o.status === 'completed');
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'in_progress');

  const handleSave = () => {
    updateProfile({
      username: editData.username,
      description: editData.description,
      discord: editData.discord,
      telegram: editData.telegram,
    });
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isProfileModalOpen} onOpenChange={setProfileModalOpen}>
      <DialogContent className="bg-gray-900 border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Мой профиль</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/5">
            <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Информация
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Заказы
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.username}
                  className="w-24 h-24 rounded-full border-2 border-white/20"
                />
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <h3 className="text-xl font-bold text-white mt-4">{user.username}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="border-white/20">
                  <Mail className="w-3 h-3 mr-1" />
                  {user.email}
                </Badge>
                {user.isBooster && (
                  <Badge className="bg-green-500/20 text-green-400 border-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Бустер
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-white">{completedOrders.length}</div>
                <div className="text-xs text-gray-500">Выполнено заказов</div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-white">{pendingOrders.length}</div>
                <div className="text-xs text-gray-500">Активных заказов</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-400">О себе</Label>
                {isEditing ? (
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full mt-1 bg-white/5 border border-white/10 text-white rounded-md p-3 resize-none"
                    rows={3}
                    placeholder="Расскажите о себе..."
                  />
                ) : (
                  <p className="text-gray-300 mt-1">
                    {user.description || 'Описание не добавлено'}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-gray-400">Discord</Label>
                {isEditing ? (
                  <Input
                    value={editData.discord}
                    onChange={(e) => setEditData({ ...editData, discord: e.target.value })}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                    placeholder="username#0000"
                  />
                ) : (
                  <p className="text-gray-300 mt-1">{user.discord || 'Не указан'}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-400">Telegram</Label>
                {isEditing ? (
                  <Input
                    value={editData.telegram}
                    onChange={(e) => setEditData({ ...editData, telegram: e.target.value })}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                    placeholder="@username"
                  />
                ) : (
                  <p className="text-gray-300 mt-1">{user.telegram || 'Не указан'}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-400">Дата регистрации</Label>
                <p className="text-gray-300 mt-1">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-6">
              {isEditing ? (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Отмена
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-white text-black hover:bg-gray-200"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Редактировать профиль
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>У вас пока нет заказов</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white/5 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">Заказ #{order.id.slice(-6)}</span>
                      <Badge
                        className={
                          order.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : order.status === 'in_progress'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }
                      >
                        {order.status === 'completed'
                          ? 'Выполнен'
                          : order.status === 'in_progress'
                          ? 'В процессе'
                          : 'Ожидает'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400 mb-1">
                      Бустер: {order.boosterName || 'Не назначен'}
                    </div>
                    <div className="text-sm text-gray-400 mb-1">
                      MMR: {order.currentMMR} → {order.targetMMR}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">${order.price}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {order.canReview && !order.isReviewed && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <Badge className="bg-yellow-500/20 text-yellow-400">
                          <Star className="w-3 h-3 mr-1" />
                          Можно оставить отзыв
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400">Email</Label>
                <Input
                  value={user.email}
                  disabled
                  className="mt-1 bg-white/5 border-white/10 text-gray-500"
                />
              </div>

              <div>
                <Label className="text-gray-400">Баланс</Label>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-white">{user.balance}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="font-semibold text-white mb-3">Уведомления</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded border-white/20" />
                    <span className="text-gray-300">Email-уведомления о заказах</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded border-white/20" />
                    <span className="text-gray-300">Уведомления о сообщениях</span>
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
