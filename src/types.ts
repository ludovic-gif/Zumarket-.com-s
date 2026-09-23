export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string; // WhatsApp formatted
  businessName?: string;
  location: string;
  bio?: string;
  verified: boolean;
  joinedDate: string;
  status: 'active' | 'suspended';
}

export type Category = 'Sacs' | 'Chaussures' | 'Colliers' | 'Vêtements' | 'Accessoires' | 'Bags' | 'Shoes' | 'Necklaces' | 'Clothing' | 'Accessories';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: Category;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerLocation: string;
  sellerPhone: string;
  sellerAvatar?: string;
  sellerRating: number;
  sellerReviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  condition: 'Neuf' | 'Fait main' | 'Vintage' | 'Comme neuf' | 'Brand New' | 'Handcrafted' | 'Like New';
  featured?: boolean;
  views: number;
  createdAt: string;
  reported?: boolean;
  reportReason?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  productId?: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  productId?: string;
  productTitle?: string;
  productImage?: string;
  productPrice?: number;
  lastMessage: string;
  lastTimestamp: string;
  unreadBuyerCount: number;
  unreadSellerCount: number;
}

export interface ReportItem {
  id: string;
  productId: string;
  productTitle: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}
