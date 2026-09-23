import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { VendorDashboard } from './components/VendorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductFormModal } from './components/ProductFormModal';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { ChatDrawer } from './components/ChatDrawer';
import {
  ShoppingBag,
  Store,
  ShieldCheck,
  Send,
  MessageCircle,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeView, setActiveView, switchDemoUser } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/70 text-neutral-900">
      {/* En-tête principal fixe avec barre de recherche et actions */}
      <Header />

      {/* Zone de contenu principal */}
      <main className="flex-1">
        {activeView === 'home' && <HomeFeed />}
        {activeView === 'vendor-dashboard' && <VendorDashboard />}
        {activeView === 'admin-dashboard' && <AdminDashboard />}
      </main>

      {/* Modales et volets coulissants */}
      <ProductDetailModal />
      <ProductFormModal />
      <AuthModal />
      <CartDrawer />
      <ChatDrawer />

      {/* Pied de page */}
      <footer className="bg-white border-t border-neutral-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-neutral-950">
                  Zu<span className="text-amber-600">Market</span>
                </span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Une marketplace de mode multi-vendeurs épurée et moderne. Découvrez des sacs artisanaux, chaussures, colliers, vêtements et accessoires avec messagerie directe intégrée et commande instantanée via WhatsApp.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                Catégories de mode
              </h4>
              <ul className="space-y-2 text-xs text-neutral-600">
                <li>Sacs & Maroquinerie</li>
                <li>Chaussures & Souliers</li>
                <li>Pendentifs & Colliers</li>
                <li>Vêtements & Prêt-à-porter</li>
                <li>Accessoires & Créations</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                Commande par contact direct
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed mb-2">
                Commandez directement auprès des créateurs sans intermédiaire ni frais superflus :
              </p>
              <div className="flex flex-col gap-1.5 text-xs text-neutral-700">
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <Send className="w-3 h-3 rotate-45" /> Commande pré-remplie WhatsApp en 1 clic
                </span>
                <span className="flex items-center gap-1.5 text-neutral-800 font-semibold">
                  <MessageCircle className="w-3 h-3 text-neutral-600" /> Messagerie instantanée intégrée
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                Espaces de la plateforme
              </h4>
              <div className="flex flex-col gap-2 text-xs">
                <button
                  onClick={() => {
                    switchDemoUser('buyer');
                    setActiveView('home');
                  }}
                  className="text-left text-neutral-600 hover:text-neutral-950 flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                  Catalogue Acheteur
                </button>
                <button
                  onClick={() => {
                    switchDemoUser('seller');
                    setActiveView('vendor-dashboard');
                  }}
                  className="text-left text-neutral-600 hover:text-neutral-950 flex items-center gap-1.5 cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  Espace Vendeur (Publication immédiate)
                </button>
                <button
                  onClick={() => {
                    switchDemoUser('admin');
                    setActiveView('admin-dashboard');
                  }}
                  className="text-left text-neutral-600 hover:text-neutral-950 flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Console de modération Administrateur
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
            <div>© {new Date().getFullYear()} ZuMarket. Marketplace de mode et d'artisanat.</div>
            <div className="flex items-center gap-4">
              <span>Typographie : Franklin Gothic Medium</span>
              <span>•</span>
              <span>Commerce multi-vendeurs direct et fluide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
