import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import {
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  MapPin,
  Send,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  Store,
} from 'lucide-react';

export const HomeFeed: React.FC = () => {
  const {
    products,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    sortBy,
    setSortBy,
    setAuthModalRole,
    setIsAuthModalOpen,
  } = useApp();

  // Filtrer les articles par catégorie, ville et recherche textuelle
  const filteredProducts = products.filter((p) => {
    const matchCat =
      selectedCategory === 'Tous' ||
      selectedCategory === 'All' ||
      p.category === selectedCategory ||
      (selectedCategory === 'Sacs' && p.category === 'Bags') ||
      (selectedCategory === 'Chaussures' && p.category === 'Shoes') ||
      (selectedCategory === 'Colliers' && p.category === 'Necklaces') ||
      (selectedCategory === 'Vêtements' && p.category === 'Clothing') ||
      (selectedCategory === 'Accessoires' && p.category === 'Accessories');

    const matchLoc =
      selectedLocation === 'Toutes les villes' ||
      selectedLocation === 'All Cities' ||
      p.sellerLocation.toLowerCase().includes(selectedLocation.split(',')[0].toLowerCase());

    const matchSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCat && matchLoc && matchSearch;
  });

  // Trier les articles
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.sellerRating - a.sellerRating;
    // Par défaut : articles mis en avant en premier
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const categories = [
    {
      name: 'Sacs',
      count: products.filter((p) => p.category === 'Sacs' || p.category === 'Bags').length,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: 'Chaussures',
      count: products.filter((p) => p.category === 'Chaussures' || p.category === 'Shoes').length,
      image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: 'Colliers',
      count: products.filter((p) => p.category === 'Colliers' || p.category === 'Necklaces').length,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: 'Vêtements',
      count: products.filter((p) => p.category === 'Vêtements' || p.category === 'Clothing').length,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: 'Accessoires',
      count: products.filter((p) => p.category === 'Accessoires' || p.category === 'Accessories').length,
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Bannière Hero Éditoriale */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
            alt="Ambiance Mode ZuMarket"
            className="w-full h-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-4 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Place de Marché Mode & Créateurs Directs
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            Mode Raffinée, <br />
            <span className="text-amber-400">En direct des artisans.</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 mb-6 leading-relaxed">
            Sacs en cuir véritable, souliers d'exception, bijoux d'artisanat et vêtements sur-mesure. Échangez avec les vendeurs en temps réel ou commandez instantanément via WhatsApp en FCFA.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedCategory('Tous')}
              className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Découvrir la collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setAuthModalRole('seller');
                setIsAuthModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Vendre sans attendre (Aucune validation requise)</span>
            </button>
          </div>

          {/* Points forts */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
            <div>
              <strong className="block text-white font-bold">100% En Direct</strong>
              <span className="text-neutral-400 text-[11px]">Contactez directement les créateurs</span>
            </div>
            <div>
              <strong className="block text-white font-bold">Commandes WhatsApp</strong>
              <span className="text-neutral-400 text-[11px]">Message pré-rempli en un clic</span>
            </div>
            <div>
              <strong className="block text-white font-bold">Vendeurs Immédiats</strong>
              <span className="text-neutral-400 text-[11px]">Publication instantanée garantie</span>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie des Catégories de Mode */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-neutral-950">Acheter par catégorie</h2>
            <p className="text-xs text-neutral-500">Sélection soignée de pièces fortes et accessoires de mode</p>
          </div>
          {selectedCategory !== 'Tous' && selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('Tous')}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
            >
              Voir toutes les catégories
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div
                key={cat.name}
                id={`cat-card-${cat.name.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat.name)}
                className={`group relative h-36 rounded-2xl overflow-hidden cursor-pointer border transition-all ${
                  isSelected
                    ? 'border-neutral-950 ring-2 ring-neutral-950 shadow-md scale-[1.02]'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-sm tracking-wide">{cat.name}</h3>
                  <span className="text-[11px] text-neutral-300 font-medium">
                    {cat.count} article{cat.count > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Grille des Produits et Filtres */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barre des résultats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-neutral-200 gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-neutral-950">
              {sortedProducts.length} article{sortedProducts.length > 1 ? 's' : ''} de mode trouvé{sortedProducts.length > 1 ? 's' : ''}
            </span>

            {selectedCategory !== 'Tous' && selectedCategory !== 'All' && (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-900 flex items-center gap-1">
                Catégorie : {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('Tous')}
                  className="hover:text-amber-950 font-bold ml-1 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedLocation !== 'Toutes les villes' && selectedLocation !== 'All Cities' && (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-neutral-200 text-neutral-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-600" />
                {selectedLocation}
                <button
                  onClick={() => setSelectedLocation('Toutes les villes')}
                  className="hover:text-neutral-950 font-bold ml-1 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-neutral-200 text-neutral-800">
                "{searchQuery}"
              </span>
            )}
          </div>

          <div className="text-xs text-neutral-500 flex items-center gap-2">
            <span>Commande directe : WhatsApp ou Messagerie instantanée</span>
          </div>
        </div>

        {/* Grille d'articles */}
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-neutral-200 p-8">
            <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="text-lg font-bold text-neutral-800">Aucun article de mode correspondant</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Nous n'avons trouvé aucun article correspondant à vos filtres. Essayez d'effacer votre recherche ou de réinitialiser la catégorie.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Tous');
                setSelectedLocation('Toutes les villes');
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition cursor-pointer"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Bannière explicative sur la commande directe */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent p-8 rounded-3xl border border-amber-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-emerald-600 rotate-45" />
              Comment fonctionne la commande directe sur ZuMarket
            </span>
            <h3 className="text-xl font-bold text-neutral-950">
              Aucun intermédiaire superflu. Connectez-vous directement aux créateurs.
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              1. Cliquez sur <strong>WhatsApp</strong> sur n'importe quel article pour ouvrir une discussion avec le vendeur contenant le nom de l'article et son prix en FCFA.<br />
              2. Ou utilisez notre <strong>Messagerie intégrée</strong> pour vérifier la taille, demander des teintes personnalisées ou organiser la livraison.
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => {
                setAuthModalRole('seller');
                setIsAuthModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Ouvrir votre boutique immédiatement</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
