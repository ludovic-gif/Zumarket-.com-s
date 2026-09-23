import React from 'react';
import { useApp } from '../context/AppContext';
import { CartItem } from '../types';
import {
  X,
  Trash2,
  Send,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface SellerCartGroup {
  sellerName: string;
  sellerPhone: string;
  items: CartItem[];
}

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    generateBulkWhatsAppLink,
    startChatWithSeller,
    setSelectedProductId,
  } = useApp();

  if (!isCartOpen) return null;

  const totalAmount = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // Regrouper par vendeur pour des échanges clairs multi-vendeurs
  const itemsBySeller: Record<string, SellerCartGroup> = cart.reduce((acc, item) => {
    const sId = item.product.sellerId;
    if (!acc[sId]) {
      acc[sId] = {
        sellerName: item.product.sellerName,
        sellerPhone: item.product.sellerPhone,
        items: [],
      };
    }
    acc[sId].items.push(item);
    return acc;
  }, {} as Record<string, SellerCartGroup>);

  const handleOrderAllSellerWhatsApp = (sellerPhone: string, items: CartItem[]) => {
    const link = generateBulkWhatsAppLink(sellerPhone, items);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* En-tête du volet panier */}
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-lg font-bold text-neutral-900">Votre Panier d'achats</h2>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-neutral-200 text-neutral-800">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bannière commande directe */}
          <div className="px-6 py-2.5 bg-amber-50/80 border-b border-amber-200/80 text-xs text-amber-900 flex items-center gap-2">
            <Send className="w-3.5 h-3.5 text-amber-600 rotate-45 shrink-0" />
            <span>
              Commande directe : Finalisez les modalités et la livraison directement avec les créateurs sur WhatsApp ou par message intégré !
            </span>
          </div>

          {/* Liste des articles du panier */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto stroke-1" />
                <p className="text-sm font-bold text-neutral-700">Votre panier est vide</p>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Explorez les sacs, chaussures, colliers et tenues pour ajouter des créations à votre panier.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition cursor-pointer"
                >
                  Découvrir les articles
                </button>
              </div>
            ) : (
              // Regroupement par vendeur
              Object.entries(itemsBySeller).map(([sellerId, group]) => {
                const groupSubtotal = group.items.reduce(
                  (sum, i) => sum + i.product.price * i.quantity,
                  0
                );

                return (
                  <div
                    key={sellerId}
                    className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                          Vendeur
                        </span>
                        <span className="text-xs font-bold text-neutral-900">
                          {group.sellerName}
                        </span>
                      </div>
                      <span className="text-xs font-black text-neutral-900">
                        {formatPrice(groupSubtotal)}
                      </span>
                    </div>

                    {/* Articles du vendeur */}
                    <div className="space-y-3">
                      {group.items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex gap-3 bg-white p-2.5 rounded-xl border border-neutral-200/70 shadow-xs"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            onClick={() => {
                              setSelectedProductId(item.product.id);
                              setIsCartOpen(false);
                            }}
                            className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-90"
                          />

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between">
                                <h4
                                  onClick={() => {
                                    setSelectedProductId(item.product.id);
                                    setIsCartOpen(false);
                                  }}
                                  className="text-xs font-bold text-neutral-900 hover:text-amber-700 cursor-pointer line-clamp-1"
                                >
                                  {item.product.title}
                                </h4>
                                <button
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="text-neutral-400 hover:text-rose-600 p-0.5 ml-1 cursor-pointer"
                                  title="Supprimer l'article"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <span className="text-[11px] text-neutral-500">
                                {item.product.category}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-1">
                              {/* Contrôles de quantité */}
                              <div className="flex items-center border border-neutral-200 rounded-md bg-neutral-50 text-xs">
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, -1)}
                                  className="px-2 py-0.5 font-bold hover:bg-neutral-200 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="px-2 font-bold">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, 1)}
                                  className="px-2 py-0.5 font-bold hover:bg-neutral-200 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>

                              <span className="text-xs font-bold text-neutral-950">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action directe pour ce vendeur */}
                    <div className="pt-2 flex gap-2">
                      <button
                        id={`cart-whatsapp-seller-${sellerId}`}
                        onClick={() => handleOrderAllSellerWhatsApp(group.sellerPhone, group.items)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 rotate-45" />
                        <span>Commander par WhatsApp</span>
                      </button>

                      <button
                        onClick={() => {
                          startChatWithSeller(group.items[0].product);
                          setIsCartOpen(false);
                        }}
                        className="py-2 px-3 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                        title="Discuter avec ce vendeur"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pied de page du panier */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500 font-medium">Total estimé</span>
                <span className="text-xl font-black text-neutral-950">{formatPrice(totalAmount)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Contact direct vendeur</span>
                <button
                  onClick={clearCart}
                  className="hover:text-rose-600 transition underline underline-offset-2 cursor-pointer"
                >
                  Vider le panier
                </button>
              </div>

              <p className="text-[11px] text-neutral-500 leading-tight">
                Utilisez le bouton vert <strong>Commander par WhatsApp</strong> ci-dessus pour chaque vendeur afin de lui envoyer votre sélection et organiser la livraison.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
