import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReviewsSection } from './ReviewsSection';
import {
  X,
  MessageCircle,
  ShoppingBag,
  Star,
  MapPin,
  Send,
  ExternalLink,
  ShieldCheck,
  Check,
  AlertTriangle,
  Share2,
  Package,
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductId,
    setSelectedProductId,
    products,
    startChatWithSeller,
    addToCart,
    generateWhatsAppLink,
    reportProduct,
  } = useApp();

  const product = products.find((p) => p.id === selectedProductId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [addedToCartFeedback, setAddedToCartFeedback] = useState(false);

  if (!product) return null;

  const handleClose = () => {
    setSelectedProductId(null);
    setActiveImageIndex(0);
    setIsReporting(false);
    setReportSubmitted(false);
  };

  const handleWhatsApp = () => {
    const link = generateWhatsAppLink(product);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleChat = () => {
    startChatWithSeller(product);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCartFeedback(true);
    setTimeout(() => setAddedToCartFeedback(false), 2000);
  };

  const handleCopyOrderSummary = () => {
    const summary = `Demande de commande : ${product.title} (${formatPrice(product.price)}) par ${product.sellerName}. Contact Vendeur : ${product.sellerPhone}`;
    navigator.clipboard.writeText(summary);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    reportProduct(product.id, reportReason.trim());
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReporting(false);
      setReportSubmitted(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* En-tête de la modale */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-900">{product.category}</span>
            <span>•</span>
            <span>{product.sellerLocation}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyOrderSummary}
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition cursor-pointer"
              title="Copier les détails"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              id="close-product-detail-btn"
              onClick={handleClose}
              className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corps défilable */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Colonne gauche : Galerie photos */}
            <div className="space-y-3">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-inner">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-bold rounded-full text-neutral-900 shadow">
                  {product.condition}
                </span>

                {!product.inStock && (
                  <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="px-4 py-2 bg-white text-neutral-900 font-bold text-sm rounded-full">
                      Actuellement en rupture de stock
                    </span>
                  </div>
                )}
              </div>

              {/* Vignettes photos */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-neutral-950 scale-95 shadow-sm'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="vignette" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Fiche vendeur */}
              <div className="mt-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  Détails de l'artisan / vendeur
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        product.sellerAvatar ||
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={product.sellerName}
                      className="w-11 h-11 rounded-full object-cover border border-neutral-300 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-neutral-900">
                          {product.sellerName}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        {product.sellerLocation}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 justify-end">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{product.sellerRating.toFixed(1)}</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      {product.sellerReviewCount} ventes vérifiées
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-600">
                  <span>Contact WhatsApp :</span>
                  <span className="font-semibold text-emerald-700 font-mono">
                    {product.sellerPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Colonne droite : Informations et Commande directe */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                    {product.category}
                  </span>
                  <span className="text-xs text-neutral-400">Réf : {product.id}</span>
                </div>

                <h1 className="text-2xl font-black text-neutral-950 mt-1 mb-3 leading-tight">
                  {product.title}
                </h1>

                {/* Affichage du prix en FCFA */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-black text-neutral-950">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs font-medium text-neutral-400">• Tarif direct créateur</span>
                </div>

                {/* Disponibilité du stock */}
                <div className="flex items-center gap-2 mb-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      product.inStock
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    {product.inStock
                      ? `En stock (${product.stockQuantity} pièce${product.stockQuantity > 1 ? 's' : ''} prête${product.stockQuantity > 1 ? 's' : ''} à l'envoi)`
                      : 'Actuellement en rupture de stock'}
                  </span>
                </div>

                {/* Description du produit */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    Description de la création
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {/* Boîte d'action principale : Commande directe & WhatsApp */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
                    <Send className="w-3.5 h-3.5 text-amber-600 rotate-45" />
                    <span>Commande par contact direct</span>
                  </div>
                  <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                    Sans intermédiaire superflu ! Échangez sur la taille, confirmez les teintes ou finalisez la livraison directement avec l'artisan.
                  </p>

                  <div className="space-y-2.5">
                    {/* Bouton WhatsApp direct */}
                    <button
                      id="modal-order-whatsapp-btn"
                      onClick={handleWhatsApp}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4 rotate-45" />
                      <span>Commander / Échanger via WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
                    </button>

                    {/* Bouton Messagerie directe intégrée */}
                    <button
                      id="modal-chat-inapp-btn"
                      onClick={handleChat}
                      className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Messagerie instantanée intégrée</span>
                    </button>
                  </div>
                </div>

                {/* Section Ajout au panier */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 px-2 py-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2 py-1 text-sm font-bold text-neutral-600 hover:text-neutral-950 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2 text-sm font-bold text-neutral-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2 py-1 text-sm font-bold text-neutral-600 hover:text-neutral-950 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    id="modal-add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-sm transition flex items-center justify-center gap-2 border border-neutral-200 disabled:opacity-50 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-neutral-700" />
                    <span>{addedToCartFeedback ? 'Ajouté au panier !' : 'Ajouter au panier'}</span>
                  </button>
                </div>
              </div>

              {/* Lien de signalement */}
              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                <span>Plateforme de mise en relation directe</span>
                <button
                  id="report-product-link"
                  onClick={() => setIsReporting(!isReporting)}
                  className="hover:text-rose-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Signaler l'annonce
                </button>
              </div>

              {/* Formulaire de signalement */}
              {isReporting && (
                <form
                  onSubmit={handleReportSubmit}
                  className="mt-3 p-3 bg-rose-50/80 rounded-xl border border-rose-200 space-y-2 text-xs"
                >
                  <p className="font-semibold text-rose-900">Signaler cet article à l'administrateur</p>
                  <textarea
                    required
                    rows={2}
                    placeholder="Motif du signalement (ex : photo trompeuse, catégorie erronée, article indisponible)"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2 text-xs border border-rose-300 rounded-lg bg-white focus:outline-none"
                  />
                  {reportSubmitted ? (
                    <div className="text-emerald-700 font-semibold">Signalement transmis à la modération.</div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsReporting(false)}
                        className="px-2 py-1 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 cursor-pointer"
                      >
                        Envoyer le signalement
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Section Avis et Notations */}
          <ReviewsSection productId={product.id} />
        </div>
      </div>
    </div>
  );
};
