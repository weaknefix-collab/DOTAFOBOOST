import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Booster, Order, Review, Chat, Message, BoosterFilters } from '@/types';

interface StoreState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  loginWithGoogle: (googleData: { email: string; name: string; picture: string }) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  uploadAvatar: (avatarUrl: string) => void;

  // Moderator
  isModerator: boolean;
  moderatorLogin: (username: string, password: string) => Promise<boolean>;
  addBooster: (boosterData: Partial<Booster>) => Promise<boolean>;
  removeBooster: (boosterId: string) => void;
  verifyBooster: (boosterId: string) => void;

  // Boosters
  boosters: Booster[];
  selectedBooster: Booster | null;
  filters: BoosterFilters;
  setFilters: (filters: BoosterFilters) => void;
  selectBooster: (booster: Booster | null) => void;
  getFilteredBoosters: () => Booster[];
  getActiveBoostersCount: () => number;

  // Reviews
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<boolean>;
  canReviewBooster: (userId: string, boosterId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (order: Partial<Order>) => Promise<boolean>;
  completeOrder: (orderId: string) => void;
  getUserOrders: (userId: string) => Order[];
  getBoosterOrders: (boosterId: string) => Order[];

  // Chat
  chats: Chat[];
  messages: Message[];
  activeChat: string | null;
  createChat: (participantId: string, participantName: string, participantAvatar: string) => string;
  sendMessage: (chatId: string, content: string) => void;
  getChatMessages: (chatId: string) => Message[];
  getUserChats: (userId: string) => Chat[];
  setActiveChat: (chatId: string | null) => void;
  markChatAsRead: (chatId: string) => void;

  // UI
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  isOrderModalOpen: boolean;
  isProfileModalOpen: boolean;
  isChatModalOpen: boolean;
  isModeratorPanelOpen: boolean;
  isAddBoosterModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  setRegisterModalOpen: (open: boolean) => void;
  setOrderModalOpen: (open: boolean) => void;
  setProfileModalOpen: (open: boolean) => void;
  setChatModalOpen: (open: boolean) => void;
  setModeratorPanelOpen: (open: boolean) => void;
  setAddBoosterModalOpen: (open: boolean) => void;
}

// Moderator credentials
const MODERATOR_USERNAME = 'weakne';
const MODERATOR_PASSWORD = 'GHGHghgh123';

// Initial empty state - no fake data
const initialBoosters: Booster[] = [];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: async (identifier: string, _password: string) => {
        const users = JSON.parse(localStorage.getItem('weak-users') || '[]');
        
        // Try to find user by email or username
        const user = users.find((u: User) => 
          u.email === identifier || u.username === identifier
        );
        
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      loginWithGoogle: async (googleData: { email: string; name: string; picture: string }) => {
        const users = JSON.parse(localStorage.getItem('weak-users') || '[]');
        
        // Check if user already exists
        let user = users.find((u: User) => u.email === googleData.email);
        
        if (!user) {
          // Create new user from Google data
          user = {
            id: 'google-' + Date.now(),
            email: googleData.email,
            username: googleData.name.replace(/\s+/g, '_').toLowerCase(),
            avatar: googleData.picture,
            createdAt: new Date(),
            isBooster: false,
            isModerator: false,
            balance: 0,
          };
          users.push(user);
          localStorage.setItem('weak-users', JSON.stringify(users));
        }
        
        set({ user, isAuthenticated: true });
        return true;
      },
      register: async (email: string, username: string, _password: string) => {
        const users = JSON.parse(localStorage.getItem('weak-users') || '[]');
        
        if (users.some((u: User) => u.email === email)) {
          return false;
        }
        if (users.some((u: User) => u.username === username)) {
          return false;
        }
        
        const newUser: User = {
          id: 'user-' + Date.now(),
          email,
          username,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          createdAt: new Date(),
          isBooster: false,
          isModerator: false,
          balance: 0,
        };
        
        users.push(newUser);
        localStorage.setItem('weak-users', JSON.stringify(users));
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, isModerator: false });
      },
      updateProfile: (data) => {
        const { user } = get();
        if (!user) return;
        
        const updatedUser = { ...user, ...data };
        const users = JSON.parse(localStorage.getItem('weak-users') || '[]');
        const index = users.findIndex((u: User) => u.id === user.id);
        if (index !== -1) {
          users[index] = updatedUser;
          localStorage.setItem('weak-users', JSON.stringify(users));
        }
        set({ user: updatedUser });
      },
      uploadAvatar: (avatarUrl) => {
        const { user } = get();
        if (!user) return;
        
        const updatedUser = { ...user, avatar: avatarUrl };
        const users = JSON.parse(localStorage.getItem('weak-users') || '[]');
        const index = users.findIndex((u: User) => u.id === user.id);
        if (index !== -1) {
          users[index] = updatedUser;
          localStorage.setItem('weak-users', JSON.stringify(users));
        }
        set({ user: updatedUser });
      },

      // Moderator
      isModerator: false,
      moderatorLogin: async (username: string, password: string) => {
        if (username === MODERATOR_USERNAME && password === MODERATOR_PASSWORD) {
          set({ isModerator: true });
          return true;
        }
        return false;
      },
      addBooster: async (boosterData) => {
        const { boosters } = get();
        const newBooster: Booster = {
          id: 'booster-' + Date.now(),
          userId: '',
          username: boosterData.username || 'New Booster',
          avatar: boosterData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
          currentRank: boosterData.currentRank || 'Immortal',
          peakRank: boosterData.peakRank || 'Immortal',
          winrate: boosterData.winrate || 65,
          totalOrders: 0,
          completedOrders: 0,
          rating: 0,
          reviews: [],
          pricePerGame: boosterData.pricePerGame || 10,
          pricePerMMR: boosterData.pricePerMMR || 0.5,
          languages: boosterData.languages || ['English'],
          roles: boosterData.roles || ['Carry'],
          heroes: boosterData.heroes || [],
          description: boosterData.description || '',
          isOnline: true,
          isVerified: true,
          isActive: true,
          createdAt: new Date(),
        };
        
        const updatedBoosters = [...boosters, newBooster];
        set({ boosters: updatedBoosters });
        localStorage.setItem('weak-boosters', JSON.stringify(updatedBoosters));
        return true;
      },
      removeBooster: (boosterId) => {
        const { boosters } = get();
        const updatedBoosters = boosters.filter(b => b.id !== boosterId);
        set({ boosters: updatedBoosters });
        localStorage.setItem('weak-boosters', JSON.stringify(updatedBoosters));
      },
      verifyBooster: (boosterId) => {
        const { boosters } = get();
        const updatedBoosters = boosters.map(b => 
          b.id === boosterId ? { ...b, isVerified: true } : b
        );
        set({ boosters: updatedBoosters });
        localStorage.setItem('weak-boosters', JSON.stringify(updatedBoosters));
      },

      // Boosters
      boosters: initialBoosters,
      selectedBooster: null,
      filters: {},
      setFilters: (filters) => set({ filters }),
      selectBooster: (booster) => set({ selectedBooster: booster }),
      getFilteredBoosters: () => {
        const { boosters, filters } = get();
        return boosters.filter(booster => {
          if (!booster.isActive) return false;
          if (filters.rank && booster.currentRank !== filters.rank) return false;
          if (filters.role && !booster.roles.includes(filters.role)) return false;
          if (filters.minPrice && booster.pricePerMMR < filters.minPrice) return false;
          if (filters.maxPrice && booster.pricePerMMR > filters.maxPrice) return false;
          if (filters.minRating && booster.rating < filters.minRating) return false;
          if (filters.language && !booster.languages.includes(filters.language)) return false;
          if (filters.isOnline !== undefined && booster.isOnline !== filters.isOnline) return false;
          return true;
        });
      },
      getActiveBoostersCount: () => {
        return get().boosters.filter(b => b.isActive && b.isOnline).length;
      },

      // Reviews
      addReview: async (reviewData) => {
        const { boosters, user } = get();
        if (!user) return false;
        
        const newReview: Review = {
          id: 'review-' + Date.now(),
          ...reviewData,
          date: new Date(),
        };
        
        const updatedBoosters = boosters.map(b => {
          if (b.id === reviewData.boosterId) {
            const newReviews = [...b.reviews, newReview];
            const newRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
            return { 
              ...b, 
              reviews: newReviews,
              rating: Math.round(newRating * 10) / 10
            };
          }
          return b;
        });
        
        set({ boosters: updatedBoosters });
        localStorage.setItem('weak-boosters', JSON.stringify(updatedBoosters));
        
        // Mark order as reviewed
        const orders = JSON.parse(localStorage.getItem('weak-orders') || '[]');
        const orderIndex = orders.findIndex((o: Order) => o.id === reviewData.orderId);
        if (orderIndex !== -1) {
          orders[orderIndex].isReviewed = true;
          orders[orderIndex].canReview = false;
          localStorage.setItem('weak-orders', JSON.stringify(orders));
        }
        
        return true;
      },
      canReviewBooster: (userId, boosterId) => {
        const orders = JSON.parse(localStorage.getItem('weak-orders') || '[]');
        return orders.some((o: Order) => 
          o.userId === userId && 
          o.boosterId === boosterId && 
          o.status === 'completed' && 
          o.canReview && 
          !o.isReviewed
        );
      },

      // Orders
      orders: [],
      createOrder: async (orderData) => {
        const { user } = get();
        if (!user) return false;
        
        const newOrder: Order = {
          id: 'order-' + Date.now(),
          userId: user.id,
          userName: user.username,
          status: 'pending',
          type: 'mmr_boost',
          currentMMR: orderData.currentMMR || 0,
          targetMMR: orderData.targetMMR || 0,
          price: orderData.price || 0,
          createdAt: new Date(),
          canReview: false,
          isReviewed: false,
          ...orderData,
        };
        
        const orders = JSON.parse(localStorage.getItem('weak-orders') || '[]');
        orders.push(newOrder);
        localStorage.setItem('weak-orders', JSON.stringify(orders));
        
        set(state => ({ orders: [...state.orders, newOrder] }));
        return true;
      },
      completeOrder: (orderId) => {
        const orders = JSON.parse(localStorage.getItem('weak-orders') || '[]');
        const index = orders.findIndex((o: Order) => o.id === orderId);
        if (index !== -1) {
          orders[index].status = 'completed';
          orders[index].completedAt = new Date();
          orders[index].canReview = true;
          localStorage.setItem('weak-orders', JSON.stringify(orders));
        }
        
        set(state => ({
          orders: state.orders.map(o => 
            o.id === orderId 
              ? { ...o, status: 'completed', completedAt: new Date(), canReview: true }
              : o
          )
        }));
      },
      getUserOrders: (userId) => {
        const orders = JSON.parse(localStorage.getItem('weak-orders') || '[]');
        return orders.filter((o: Order) => o.userId === userId);
      },
      getBoosterOrders: (boosterId) => {
        const orders = JSON.parse(localStorage.getItem('weak-orders') || '[]');
        return orders.filter((o: Order) => o.boosterId === boosterId);
      },

      // Chat
      chats: [],
      messages: [],
      activeChat: null,
      createChat: (participantId, participantName, participantAvatar) => {
        const { user, chats } = get();
        if (!user) return '';
        
        const existingChat = chats.find(c => 
          c.participants.includes(user.id) && c.participants.includes(participantId)
        );
        if (existingChat) return existingChat.id;
        
        const newChat: Chat = {
          id: 'chat-' + Date.now(),
          participants: [user.id, participantId],
          participantNames: [user.username, participantName],
          participantAvatars: [user.avatar || '', participantAvatar],
          unreadCount: 0,
        };
        
        const updatedChats = [...chats, newChat];
        set({ chats: updatedChats });
        localStorage.setItem('weak-chats', JSON.stringify(updatedChats));
        return newChat.id;
      },
      sendMessage: (chatId, content) => {
        const { user, messages } = get();
        if (!user) return;
        
        const newMessage: Message = {
          id: 'msg-' + Date.now(),
          chatId,
          senderId: user.id,
          senderName: user.username,
          senderAvatar: user.avatar,
          content,
          createdAt: new Date(),
          isRead: false,
        };
        
        const updatedMessages = [...messages, newMessage];
        set({ messages: updatedMessages });
        localStorage.setItem('weak-messages', JSON.stringify(updatedMessages));
        
        // Update chat last message
        const { chats } = get();
        const updatedChats = chats.map(c => {
          if (c.id === chatId) {
            return {
              ...c,
              lastMessage: content,
              lastMessageTime: new Date(),
            };
          }
          return c;
        });
        set({ chats: updatedChats });
        localStorage.setItem('weak-chats', JSON.stringify(updatedChats));
      },
      getChatMessages: (chatId) => {
        const { messages } = get();
        return messages.filter(m => m.chatId === chatId).sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      },
      getUserChats: (userId) => {
        const { chats } = get();
        return chats.filter(c => c.participants.includes(userId));
      },
      setActiveChat: (chatId) => set({ activeChat: chatId }),
      markChatAsRead: (chatId) => {
        const { chats } = get();
        const updatedChats = chats.map(c => 
          c.id === chatId ? { ...c, unreadCount: 0 } : c
        );
        set({ chats: updatedChats });
        localStorage.setItem('weak-chats', JSON.stringify(updatedChats));
      },

      // UI
      isLoginModalOpen: false,
      isRegisterModalOpen: false,
      isOrderModalOpen: false,
      isProfileModalOpen: false,
      isChatModalOpen: false,
      isModeratorPanelOpen: false,
      isAddBoosterModalOpen: false,
      setLoginModalOpen: (open) => set({ isLoginModalOpen: open }),
      setRegisterModalOpen: (open) => set({ isRegisterModalOpen: open }),
      setOrderModalOpen: (open) => set({ isOrderModalOpen: open }),
      setProfileModalOpen: (open) => set({ isProfileModalOpen: open }),
      setChatModalOpen: (open) => set({ isChatModalOpen: open }),
      setModeratorPanelOpen: (open) => set({ isModeratorPanelOpen: open }),
      setAddBoosterModalOpen: (open) => set({ isAddBoosterModalOpen: open }),
    }),
    {
      name: 'weak-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        isModerator: state.isModerator,
        boosters: state.boosters,
        orders: state.orders,
        chats: state.chats,
        messages: state.messages,
      }),
    }
  )
);

// Load data from localStorage on init
if (typeof window !== 'undefined') {
  const savedBoosters = localStorage.getItem('weak-boosters');
  if (savedBoosters) {
    useStore.setState({ boosters: JSON.parse(savedBoosters) });
  }
  
  const savedOrders = localStorage.getItem('weak-orders');
  if (savedOrders) {
    useStore.setState({ orders: JSON.parse(savedOrders) });
  }
  
  const savedChats = localStorage.getItem('weak-chats');
  if (savedChats) {
    useStore.setState({ chats: JSON.parse(savedChats) });
  }
  
  const savedMessages = localStorage.getItem('weak-messages');
  if (savedMessages) {
    useStore.setState({ messages: JSON.parse(savedMessages) });
  }
}
