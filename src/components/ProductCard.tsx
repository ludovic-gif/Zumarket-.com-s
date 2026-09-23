import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { MessageCircle, ShoppingBag, Star, MapPin, Send } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    setSelectedProductId,
    startChatWithSeller,
    addToCart,
    generateWhatsAppLink,
  } = useApp();

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = generateWhatsAppLink(product);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startChatWithSeller(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => setSelectedProductId(product.id)}
      className="group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Zone image du produit */}
      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges catégorie & état */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-white/90 backdrop-blur-md text-neutral-900 shadow-sm">
            {product.category}
          </span>
          {product.condition && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-neutral-900/80 backdrop-blur-md text-white">
              {product.condition}
            </span>
          )}
        </div>

        {/* Badge rupture de stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 bg-white text-neutral-900 font-bold text-xs rounded-full uppercase tracking-wider shadow">
              Épuisé
            </span>
          </div>
        )}

        {/* Bouton rapide d'ajout au panier */}
        {product.inStock && (
          <button
            id={`quick-cart-${product.id}`}
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white text-neutral-900 shadow-md hover:bg-neutral-950 hover:text-white transition transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
            title="Ajouter au panier"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Détails du produit */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Vendeur & Ville */}
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
            <span className="font-semibold text-neutral-800 truncate max-w-[140px]">
              {product.sellerName}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
              <MapPin className="w-3 h-3 text-neutral-400" />
              {product.sellerLocation.split(',')[0]}
            </span>
          </div>

          {/* Titre du produit */}
          <h3 className="text-sm font-bold text-neutral-900 line-clamp-1 group-hover:text-amber-700 transition">
            {product.title}
          </h3>

          {/* Prix en FCFA & Note */}
          <div className="flex items-center justify-between mt-2">
            <div className="text-base font-black text-neutral-950 tracking-tight">
              {formatPrice(product.price)}
            </div>

            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.sellerRating.toFixed(1)}</span>
              <span className="text-neutral-400 font-normal text-[10px]">
                ({product.sellerReviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* Boutons d'action : Commande directe */}
        <div className="pt-3 mt-3 border-t border-neutral-100 grid grid-cols-2 gap-2">
          {/* Bouton WhatsApp direct */}
          <button
            id={`whatsapp-order-btn-${product.id}`}
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition border border-emerald-200/80 shadow-xs cursor-pointer"
            title="Ouvre un message WhatsApp pré-rempli avec l'article et le prix en FCFA"
          >
            <Send className="w-3 h-3 text-emerald-600 rotate-45" />
            <span>WhatsApp</span>
          </button>

          {/* Bouton Chat en direct */}
          <button
            id={`chat-seller-btn-${product.id}`}
            onClick={handleChatClick}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition cursor-pointer"
            title="Discuter directement avec le vendeur"
          >
            <MessageCircle className="w-3.5 h-3.5 text-neutral-600" />
            <span>Discuter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
