import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ShoppingBag,
  TrendingUp,
  MessageCircle,
  CheckCircle2,
  Package,
  MapPin,
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export const VendorDashboard: React.FC = () => {
  const {
    currentUser,
    products,
    setIsProductFormOpen,
    setProductToEdit,
    deleteProduct,
    toggleStockStatus,
    setSelectedProductId,
    conversations,
    setIsChatOpen,
    setActiveChatId,
  } = useApp();

  const [filterCategory, setFilterCategory] = useState('Tous');
  const [vendorSearch, setVendorSearch] = useState('');

  // Récupérer les articles appartenant à ce vendeur
  const sellerId = currentUser?.id || 'user-seller-1';
  const myProducts = products.filter(
    (p) => p.sellerId === sellerId || (currentUser?.role === 'seller' && p.sellerName.includes(currentUser.name))
  );

  const filteredProducts = myProducts.filter((p) => {
    const matchCategory =
      filterCategory === 'Tous' ||
      filterCategory === 'All' ||
      p.category === filterCategory ||
      (filterCategory === 'Sacs' && p.category === 'Bags') ||
      (filterCategory === 'Chaussures' && p.category === 'Shoes') ||
      (filterCategory === 'Colliers' && p.category === 'Necklaces') ||
      (filterCategory === 'Vêtements' && p.category === 'Clothing') ||
      (filterCategory === 'Accessoires' && p.category === 'Accessories');

    const matchSearch = p.title.toLowerCase().includes(vendorSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Calcul des statistiques vendeur
  const totalViews = myProducts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalCatalogValue = myProducts.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);
  const activeCount = myProducts.filter((p) => p.inStock).length;
  
  // Demandes reçues pour ce vendeur
  const sellerConversations = conversations.filter(
    (c) => c.sellerId === sellerId || (currentUser?.name && c.sellerName.includes(currentUser.name))
  );

  const handleEdit = (prod: Product) => {
    setProductToEdit(prod);
    setIsProductFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr(e) de vouloir supprimer cet article de votre boutique ?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* En-tête de l'espace vendeur */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={
              currentUser?.avatar ||
              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
            }
            alt="Avatar Vendeur"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800">
                Espace Vendeur Actif
              </span>
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {currentUser?.location || 'Dakar, Sénégal'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-neutral-950 mt-1">
              {currentUser?.businessName || `Atelier de ${currentUser?.name || 'Créateur'}`}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Commandes WhatsApp connectées : <span className="font-bold text-neutral-800 font-mono">{currentUser?.phone || '+221771234567'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="vendor-add-item-btn"
            onClick={() => {
              setProductToEdit(null);
              setIsProductFormOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Ajouter un article de mode</span>
          </button>
        </div>
      </div>

      {/* Garantie d'accès et publication immédiate */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950 leading-relaxed">
          <strong>Publication instantanée garantie :</strong> En tant que vendeur sur ZuMarket, dès que vous créez ou modifiez un article, il est publié et visible immédiatement par tous les acheteurs. Aucun délai d'attente, examen préalable ou approbation requise.
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Articles publiés
            </span>
            <Package className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-black text-neutral-950">{myProducts.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {activeCount} actif{activeCount > 1 ? 's' : ''} et prêt{activeCount > 1 ? 's' : ''} à l'envoi
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Valeur du catalogue
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-neutral-950">{formatPrice(totalCatalogValue)}</div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Valeur brute du stock d'articles
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Demandes clients
            </span>
            <MessageCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-neutral-950">{sellerConversations.length}</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
            Conversations directes actives
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Vues totales
            </span>
            <Eye className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-neutral-950">{totalViews}</div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Consultations des fiches produits
          </span>
        </div>
      </div>

      {/* Tableau de gestion du catalogue et filtres */}
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
        {/* Barre d'outils du tableau */}
        <div className="p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-950">Votre catalogue de mode</h2>
            <p className="text-xs text-neutral-500">
              Gérez vos sacs, chaussures, colliers, vêtements et ajustez les stocks à tout moment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Recherche interne */}
            <input
              type="text"
              placeholder="Rechercher vos articles..."
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
              className="px-3 py-1.5 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />

            {/* Filtre catégorie */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 text-xs border border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer"
            >
              <option value="Tous">Toutes les catégories</option>
              <option value="Sacs">Sacs</option>
              <option value="Chaussures">Chaussures</option>
              <option value="Colliers">Colliers</option>
              <option value="Vêtements">Vêtements</option>
              <option value="Accessoires">Accessoires</option>
            </select>
          </div>
        </div>

        {/* Tableau des articles */}
        <div className="overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto" />
              <p className="text-sm font-bold text-neutral-700">Aucun article trouvé</p>
              <p className="text-xs text-neutral-400">
                Cliquez sur « Ajouter un article de mode » ci-dessus pour publier votre première création.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="py-3 px-4">Détails de l'article</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Prix</th>
                  <th className="py-3 px-4">Disponibilité</th>
                  <th className="py-3 px-4">Vues</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-neutral-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                        />
                        <div>
                          <h4
                            onClick={() => setSelectedProductId(prod.id)}
                            className="font-bold text-neutral-900 hover:text-amber-700 cursor-pointer"
                          >
                            {prod.title}
                          </h4>
                          <span className="text-[11px] text-neutral-400 font-medium">
                            {prod.condition} • {prod.stockQuantity} en stock
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 font-semibold text-[10px]">
                        {prod.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-black text-neutral-950">
                      {formatPrice(prod.price)}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleStockStatus(prod.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          prod.inStock
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Cliquer pour basculer le statut du stock"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            prod.inStock ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {prod.inStock ? 'En stock' : 'Épuisé'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-neutral-500 font-medium">
                      {prod.views || 0} vues
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`vendor-view-prod-${prod.id}`}
                          onClick={() => setSelectedProductId(prod.id)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
                          title="Voir sur la marketplace"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          id={`vendor-edit-prod-${prod.id}`}
                          onClick={() => handleEdit(prod)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
                          title="Modifier l'article"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          id={`vendor-delete-prod-${prod.id}`}
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                          title="Supprimer l'article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Boîte des demandes acheteurs récentes */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-950">Dernières demandes acheteurs</h2>
            <p className="text-xs text-neutral-500">
              Acheteurs échangeant directement au sujet de vos créations de mode.
            </p>
          </div>
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-neutral-100 text-neutral-800 hover:bg-neutral-200 transition cursor-pointer"
          >
            Ouvrir toutes les discussions
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sellerConversations.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">Aucune demande acheteur pour le moment.</p>
          ) : (
            sellerConversations.slice(0, 4).map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveChatId(conv.id);
                  setIsChatOpen(true);
                }}
                className="p-3 bg-neutral-50 hover:bg-neutral-100/80 rounded-2xl border border-neutral-200/70 cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={conv.buyerAvatar}
                    alt={conv.buyerName}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 truncate">
                      {conv.buyerName}
                    </h4>
                    <span className="text-[11px] text-amber-700 font-semibold block truncate">
                      Au sujet de : {conv.productTitle}
                    </span>
                    <p className="text-xs text-neutral-500 truncate mt-0.5">
                      « {conv.lastMessage} »
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-neutral-400 ml-2 shrink-0">
                  {conv.lastTimestamp}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
