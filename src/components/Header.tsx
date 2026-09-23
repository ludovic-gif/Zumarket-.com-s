import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  MessageCircle,
  Search,
  MapPin,
  Store,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  PlusCircle,
} from 'lucide-react';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    cart,
    setIsCartOpen,
    conversations,
    setIsChatOpen,
    setActiveChatId,
    setIsAuthModalOpen,
    setAuthModalRole,
    setIsProductFormOpen,
    setProductToEdit,
    logout,
    switchDemoUser,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    sortBy,
    setSortBy,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Total d'articles dans le panier
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Nombre de messages non lus
  const unreadMessagesCount = conversations.reduce((sum, c) => {
    if (!currentUser) return 0;
    if (currentUser.role === 'buyer') {
      return sum + (c.unreadBuyerCount || 0);
    } else {
      return sum + (c.unreadSellerCount || 0);
    }
  }, 0);

  const locations = [
    'Toutes les villes',
    'Dakar, Sénégal',
    'Abidjan, Côte d\'Ivoire',
    'Lomé, Togo',
    'Cotonou, Bénin',
    'Paris, France',
    'Milan, Italie',
  ];

  const categories = ['Tous', 'Sacs', 'Chaussures', 'Colliers', 'Vêtements', 'Accessoires'];

  const getRoleLabel = (role?: string) => {
    if (role === 'buyer') return 'Acheteur';
    if (role === 'seller') return 'Vendeur';
    if (role === 'admin') return 'Administrateur';
    return 'Visiteur';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Barre supérieure du sélecteur de rôles démo */}
      <div className="bg-neutral-900 text-neutral-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-medium">
              <Sparkles className="w-3 h-3" />
              Mode Démo Rôles
            </span>
            <span className="hidden sm:inline text-neutral-400">
              Actif : <strong className="text-white capitalize">{currentUser?.name || 'Visiteur'}</strong> (
              <span className="text-amber-400 uppercase font-semibold">{getRoleLabel(currentUser?.role)}</span>)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-400 mr-1 hidden md:inline">Changer de rôle :</span>
            <button
              id="switch-buyer-btn"
              onClick={() => switchDemoUser('buyer')}
              className={`px-2 py-0.5 rounded transition ${
                currentUser?.role === 'buyer'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              Acheteur (Sophia)
            </button>
            <button
              id="switch-seller-btn"
              onClick={() => switchDemoUser('seller')}
              className={`px-2 py-0.5 rounded transition ${
                currentUser?.role === 'seller'
                  ? 'bg-emerald-500 text-neutral-950 font-bold'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              Vendeur (Elena)
            </button>
            <button
              id="switch-admin-btn"
              onClick={() => switchDemoUser('admin')}
              className={`px-2 py-0.5 rounded transition ${
                currentUser?.role === 'admin'
                  ? 'bg-indigo-400 text-neutral-950 font-bold'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              Admin (Marcus)
            </button>
          </div>
        </div>
      </div>

      {/* Barre de navigation principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Marque */}
          <div className="flex items-center gap-6">
            <button
              id="logo-brand-button"
              onClick={() => setActiveView('home')}
              className="flex items-center gap-1.5 text-left group cursor-pointer"
            >
              <span className="text-2xl font-black tracking-tight text-neutral-950 group-hover:text-amber-600 transition">
                Zu<span className="text-amber-600">Market</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                Mode
              </span>
            </button>

            {/* Sélecteur de ville / localisation sur Desktop */}
            <div className="hidden lg:flex items-center text-xs text-neutral-600 bg-neutral-100/80 px-2.5 py-1.5 rounded-lg border border-neutral-200/80">
              <MapPin className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
              <select
                id="header-location-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent font-medium text-neutral-800 focus:outline-none cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Barre de recherche centrale */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                id="header-search-input"
                type="text"
                placeholder="Rechercher sacs, chaussures, colliers, robes, vestes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-full text-sm bg-neutral-50/70 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-neutral-400 hover:text-neutral-700"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>

          {/* Boutons d'action droite */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Loupe mobile */}
            <button
              id="mobile-search-toggle"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 rounded-full text-neutral-700 hover:bg-neutral-100 transition"
              title="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Action rapide selon le rôle */}
            {currentUser?.role === 'seller' ? (
              <button
                id="seller-add-product-btn"
                onClick={() => {
                  setProductToEdit(null);
                  setIsProductFormOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Publier un article
              </button>
            ) : currentUser?.role === 'admin' ? (
              <button
                id="admin-console-header-btn"
                onClick={() => setActiveView('admin-dashboard')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full transition ${
                  activeView === 'admin-dashboard'
                    ? 'bg-neutral-950 text-white'
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                Console Admin
              </button>
            ) : (
              <button
                id="start-selling-header-btn"
                onClick={() => {
                  setAuthModalRole('seller');
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition"
              >
                <Store className="w-3.5 h-3.5 text-amber-700" />
                Vendre sur ZuMarket
              </button>
            )}

            {/* Messagerie instantanée */}
            <button
              id="open-chat-header-btn"
              onClick={() => {
                setIsChatOpen(true);
                if (conversations.length > 0) {
                  setActiveChatId(conversations[0].id);
                }
              }}
              className="relative p-2 rounded-full text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
              title="Messagerie & Discussions"
            >
              <MessageCircle className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-neutral-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Panier d'achat */}
            <button
              id="open-cart-header-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
              title="Panier d'achats"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-neutral-950 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Menu profil utilisateur */}
            <div className="relative">
              {currentUser ? (
                <button
                  id="user-profile-menu-button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-neutral-300 transition cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-neutral-300"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500 hidden sm:block" />
                </button>
              ) : (
                <button
                  id="header-login-btn"
                  onClick={() => {
                    setAuthModalRole('buyer');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition"
                >
                  Connexion
                </button>
              )}

              {/* Menu déroulant profil */}
              {isUserMenuOpen && currentUser && (
                <div
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-xs font-semibold text-neutral-900 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-neutral-100 text-neutral-700">
                      Espace {getRoleLabel(currentUser.role)}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      id="menu-nav-home"
                      onClick={() => {
                        setActiveView('home');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-neutral-500" />
                      Fil de la marketplace
                    </button>

                    {currentUser.role === 'seller' && (
                      <button
                        id="menu-nav-vendor"
                        onClick={() => {
                          setActiveView('vendor-dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-emerald-700 font-semibold hover:bg-emerald-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Store className="w-3.5 h-3.5" />
                        Espace Vendeur
                      </button>
                    )}

                    {currentUser.role === 'admin' && (
                      <button
                        id="menu-nav-admin"
                        onClick={() => {
                          setActiveView('admin-dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-indigo-700 font-semibold hover:bg-indigo-50 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Console Administrateur
                      </button>
                    )}

                    <button
                      id="menu-nav-messages"
                      onClick={() => {
                        setIsChatOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-neutral-500" />
                      Messagerie directe
                      {unreadMessagesCount > 0 && (
                        <span className="ml-auto bg-amber-500 text-neutral-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                          {unreadMessagesCount}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="border-t border-neutral-100 pt-1">
                    <button
                      id="menu-logout-btn"
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barre de recherche déroulante mobile */}
        {showMobileSearch && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative w-full">
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Rechercher sacs, chaussures, bijoux, robes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm rounded-full border border-neutral-300 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pilules des catégories de mode (sur la vue Accueil) */}
        {activeView === 'home' && (
          <div className="flex items-center justify-between py-2 border-t border-neutral-100 overflow-x-auto no-scrollbar gap-2">
            <div className="flex items-center gap-1.5 flex-nowrap min-w-max">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat || (cat === 'Tous' && (selectedCategory === 'All' || selectedCategory === 'Tous'));
                return (
                  <button
                    key={cat}
                    id={`category-pill-${cat.toLowerCase()}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1 text-xs font-semibold rounded-full transition whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sélecteur de tri */}
            <div className="flex items-center gap-2 text-xs text-neutral-600 min-w-max ml-2">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-100 border border-neutral-200 rounded-full px-2.5 py-1 text-xs font-medium text-neutral-700 focus:outline-none cursor-pointer"
              >
                <option value="featured">À la une</option>
                <option value="price-asc">Prix : Croissant</option>
                <option value="price-desc">Prix : Décroissant</option>
                <option value="rating">Mieux notés</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
