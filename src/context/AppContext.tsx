import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Product,
  Review,
  CartItem,
  ChatMessage,
  Conversation,
  ReportItem,
  UserRole,
  Category,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_REPORTS,
} from '../data/mockData';
import { formatPrice } from '../utils/formatters';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  reviews: Review[];
  cart: CartItem[];
  conversations: Conversation[];
  messages: ChatMessage[];
  reports: ReportItem[];
  
  // Navigation & Modal states
  activeView: 'home' | 'vendor-dashboard' | 'admin-dashboard';
  setActiveView: (view: 'home' | 'vendor-dashboard' | 'admin-dashboard') => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalRole: UserRole;
  setAuthModalRole: (role: UserRole) => void;
  
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  
  isProductFormOpen: boolean;
  setIsProductFormOpen: (open: boolean) => void;
  productToEdit: Product | null;
  setProductToEdit: (prod: Product | null) => void;
  
  // Filters & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  registerUser: (userData: { name: string; email: string; role: UserRole; businessName?: string; location: string; phone: string }) => User;
  switchDemoUser: (role: UserRole) => void;
  
  addProduct: (data: Partial<Product>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStockStatus: (id: string) => void;
  
  addReview: (productId: string, rating: number, comment: string) => void;
  reportProduct: (productId: string, reason: string) => void;
  resolveReport: (reportId: string, action: 'dismiss' | 'unpublish') => void;
  
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  
  startChatWithSeller: (product: Product) => void;
  sendMessage: (conversationId: string, text: string) => void;
  generateWhatsAppLink: (product: Product, customNote?: string) => string;
  generateBulkWhatsAppLink: (sellerPhone: string, items: CartItem[]) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or default, ensuring FCFA migration
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('zumarket_fr_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zumarket_fr_current_user');
    if (saved) return JSON.parse(saved);
    // Default to Sophia (buyer)
    return INITIAL_USERS[0];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('zumarket_fr_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].currency === 'FCFA') {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('zumarket_fr_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('zumarket_fr_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.product?.currency === 'FCFA') {
          return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('zumarket_fr_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('zumarket_fr_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('zumarket_fr_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  // UI state
  const [activeView, setActiveView] = useState<'home' | 'vendor-dashboard' | 'admin-dashboard'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('buyer');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Filters & Search in French
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedLocation, setSelectedLocation] = useState('Toutes les villes');
  const [sortBy, setSortBy] = useState('featured');

  // Persistence effects with French-namespaced keys to ensure fresh data
  useEffect(() => {
    localStorage.setItem('zumarket_fr_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('zumarket_fr_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('zumarket_fr_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('zumarket_fr_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('zumarket_fr_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('zumarket_fr_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('zumarket_fr_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('zumarket_fr_reports', JSON.stringify(reports));
  }, [reports]);

  // Actions
  const login = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'seller') {
      setActiveView('vendor-dashboard');
    } else if (user.role === 'admin') {
      setActiveView('admin-dashboard');
    } else {
      setActiveView('home');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('home');
  };

  const registerUser = (data: {
    name: string;
    email: string;
    role: UserRole;
    businessName?: string;
    location: string;
    phone: string;
  }): User => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      phone: data.phone || '+221771234567',
      businessName: data.businessName || (data.role === 'seller' ? `Atelier de ${data.name}` : undefined),
      location: data.location || 'Dakar, Sénégal',
      verified: true, // Accès immédiat garanti !
      joinedDate: 'À l\'instant',
      status: 'active',
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    // Accès immédiat : si vendeur, redirection instantanée vers son tableau de bord
    if (data.role === 'seller') {
      setActiveView('vendor-dashboard');
    } else if (data.role === 'admin') {
      setActiveView('admin-dashboard');
    } else {
      setActiveView('home');
    }

    return newUser;
  };

  const switchDemoUser = (role: UserRole) => {
    const target = users.find((u) => u.role === role);
    if (target) {
      login(target);
    }
  };

  const addProduct = (data: Partial<Product>): Product => {
    const seller = currentUser?.role === 'seller' ? currentUser : users.find(u => u.role === 'seller') || users[1];
    
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title: data.title || 'Nouvel article de mode',
      description: data.description || 'Aucune description fournie.',
      price: Number(data.price) || 50000,
      currency: 'FCFA',
      category: (data.category as Category) || 'Vêtements',
      images: data.images && data.images.length > 0 ? data.images : [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'
      ],
      sellerId: seller.id,
      sellerName: seller.businessName || seller.name,
      sellerLocation: seller.location,
      sellerPhone: seller.phone,
      sellerAvatar: seller.avatar,
      sellerRating: 5.0,
      sellerReviewCount: 0,
      inStock: true,
      stockQuantity: Number(data.stockQuantity) || 5,
      condition: data.condition || 'Fait main',
      featured: false,
      views: 1,
      createdAt: 'Aujourd\'hui',
    };

    // Publication immédiate sans validation admin !
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProductId === id) setSelectedProductId(null);
  };

  const toggleStockStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const addReview = (productId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      comment,
      createdAt: 'À l\'instant',
    };
    setReviews((prev) => [newRev, ...prev]);

    const product = products.find((p) => p.id === productId);
    if (product) {
      const prodReviews = [...reviews.filter((r) => r.productId === productId), newRev];
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      updateProduct(productId, {
        sellerRating: Math.round(avg * 10) / 10,
        sellerReviewCount: (product.sellerReviewCount || 0) + 1,
      });
    }
  };

  const reportProduct = (productId: string, reason: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      productId,
      productTitle: prod.title,
      reporterId: currentUser?.id || 'anonyme',
      reporterName: currentUser?.name || 'Acheteur',
      reason,
      timestamp: 'Aujourd\'hui',
      status: 'pending',
    };

    setReports((prev) => [newReport, ...prev]);
    updateProduct(productId, { reported: true, reportReason: reason });
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'unpublish') => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;

    if (action === 'unpublish') {
      setProducts((prev) => prev.filter((p) => p.id !== report.productId));
    } else {
      updateProduct(report.productId, { reported: false, reportReason: undefined });
    }

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'resolved' } : r
      )
    );
  };

  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedSize }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const startChatWithSeller = (product: Product) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    // Recherche de conversation existante
    const existing = conversations.find(
      (c) =>
        (c.buyerId === currentUser.id && c.sellerId === product.sellerId) ||
        (c.sellerId === currentUser.id && c.buyerId === product.sellerId)
    );

    if (existing) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                productId: product.id,
                productTitle: product.title,
                productImage: product.images[0],
                productPrice: product.price,
              }
            : c
        )
      );
      setActiveChatId(existing.id);
    } else {
      const newConvId = `conv-${Date.now()}`;
      const newConv: Conversation = {
        id: newConvId,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        buyerAvatar: currentUser.avatar,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        sellerAvatar: product.sellerAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        productId: product.id,
        productTitle: product.title,
        productImage: product.images[0],
        productPrice: product.price,
        lastMessage: `Intéressé(e) par ${product.title}`,
        lastTimestamp: 'À l\'instant',
        unreadBuyerCount: 0,
        unreadSellerCount: 1,
      };

      setConversations((prev) => [newConv, ...prev]);

      const initMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId: newConvId,
        senderId: currentUser.id,
        receiverId: product.sellerId,
        productId: product.id,
        text: `Bonjour ${product.sellerName}, je consulte votre article "${product.title}" (${formatPrice(product.price)}). Est-il disponible actuellement ?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
      };
      setMessages((prev) => [...prev, initMsg]);
      setActiveChatId(newConvId);
    }

    setIsChatOpen(true);
  };

  const sendMessage = (conversationId: string, text: string) => {
    if (!currentUser || !text.trim()) return;

    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return;

    const isBuyer = currentUser.id === conv.buyerId;
    const receiverId = isBuyer ? conv.sellerId : conv.buyerId;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      receiverId,
      productId: conv.productId,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setMessages((prev) => [...prev, newMsg]);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text.trim(),
              lastTimestamp: 'À l\'instant',
              unreadSellerCount: isBuyer ? c.unreadSellerCount + 1 : c.unreadSellerCount,
              unreadBuyerCount: !isBuyer ? c.unreadBuyerCount + 1 : c.unreadBuyerCount,
            }
          : c
      )
    );

    // Simulation de réponse automatique si l'interlocuteur n'est pas l'utilisateur connecté
    if (isBuyer && conv.sellerId !== currentUser.id) {
      setTimeout(() => {
        const vendorReplies = [
          `Bonjour ${currentUser.name} ! Merci pour votre intérêt. Oui, "${conv.productTitle || 'cet article'}" est disponible et prêt à être expédié ! Souhaitez-vous des précisions sur la livraison ?`,
          `Bonjour ${currentUser.name} ! Cet article est en parfait état et réalisé à la main. Je peux vous le réserver immédiatement !`,
          `Ravi(e) de votre message ! Nous assurons un emballage très soigné et une expédition express. N'hésitez pas si vous avez une question sur les matières ou dimensions !`,
        ];
        const replyText = vendorReplies[Math.floor(Math.random() * vendorReplies.length)];

        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          conversationId,
          senderId: conv.sellerId,
          receiverId: currentUser.id,
          productId: conv.productId,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
        };

        setMessages((prev) => [...prev, replyMsg]);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: replyText,
                  lastTimestamp: 'À l\'instant',
                  unreadBuyerCount: c.unreadBuyerCount + 1,
                }
              : c
          )
        );
      }, 1200);
    }
  };

  const generateWhatsAppLink = (product: Product, customNote?: string): string => {
    const rawPhone = (product.sellerPhone || '+221771234567').replace(/[^0-9]/g, '');
    const defaultText = `Bonjour ${product.sellerName} ! J'ai vu votre article "${product.title}" (${formatPrice(product.price)}) sur la marketplace ZuMarket. Est-il disponible à la commande ?${customNote ? `\nNote : ${customNote}` : ''}`;
    const encoded = encodeURIComponent(defaultText);
    return `https://wa.me/${rawPhone}?text=${encoded}`;
  };

  const generateBulkWhatsAppLink = (sellerPhone: string, items: CartItem[]): string => {
    const cleanPhone = sellerPhone.replace(/[^0-9]/g, '') || '221771234567';
    const itemsList = items
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.product.title} (Qté : ${i.quantity}, ${formatPrice(i.product.price * i.quantity)})`
      )
      .join('\n');
    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const message = `Bonjour ! Je souhaite passer commande sur ZuMarket pour les articles suivants :\n\n${itemsList}\n\nTotal estimé : ${formatPrice(total)}\n\nMerci de me confirmer la disponibilité et les modalités d'expédition.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        products,
        reviews,
        cart,
        conversations,
        messages,
        reports,
        activeView,
        setActiveView,
        selectedProductId,
        setSelectedProductId,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalRole,
        setAuthModalRole,
        isCartOpen,
        setIsCartOpen,
        isChatOpen,
        setIsChatOpen,
        activeChatId,
        setActiveChatId,
        isProductFormOpen,
        setIsProductFormOpen,
        productToEdit,
        setProductToEdit,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedLocation,
        setSelectedLocation,
        sortBy,
        setSortBy,
        login,
        logout,
        registerUser,
        switchDemoUser,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStockStatus,
        addReview,
        reportProduct,
        resolveReport,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        startChatWithSeller,
        sendMessage,
        generateWhatsAppLink,
        generateBulkWhatsAppLink,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être utilisé au sein d\'un AppProvider');
  }
  return context;
};
