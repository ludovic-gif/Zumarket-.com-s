import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  AlertTriangle,
  Users,
  Package,
  CheckCircle,
  Eye,
  Trash2,
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    users,
    reports,
    resolveReport,
    deleteProduct,
    setSelectedProductId,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'moderation' | 'users' | 'catalog'>('moderation');
  const [userSearch, setUserSearch] = useState('');
  const [catalogSearch, setCatalogSearch] = useState('');

  // Calculs statistiques
  const totalProducts = products.length;
  const totalVendors = users.filter((u) => u.role === 'seller').length;
  const totalBuyers = users.filter((u) => u.role === 'buyer').length;
  const pendingReports = reports.filter((r) => r.status === 'pending');
  const grossListingValue = products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredCatalog = products.filter(
    (p) =>
      p.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'seller':
        return 'Vendeur';
      case 'admin':
        return 'Administrateur';
      case 'buyer':
      default:
        return 'Acheteur';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* En-tête de l'administration */}
      <div className="bg-neutral-900 text-white p-6 rounded-3xl border border-neutral-800 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Super Administrateur
              </span>
              <span className="text-xs text-neutral-400">Sécurité & Supervision ZuMarket</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">Console de gestion de la plateforme</h1>
          </div>
        </div>

        {/* Bannière garantie d'architecture */}
        <div className="p-3 bg-neutral-800/80 rounded-xl border border-neutral-700/80 text-xs text-neutral-300 max-w-md">
          <strong className="text-indigo-300 font-semibold block mb-0.5">
            Politique d'architecture :
          </strong>
          La publication des vendeurs s'effectue sans aucune barrière ni approbation préalable. La file de modération intervient a posteriori sur les signalements de la communauté.
        </div>
      </div>

      {/* Statistiques globales de la plateforme */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            Total des annonces
          </span>
          <div className="text-2xl font-black text-neutral-950">{totalProducts}</div>
          <span className="text-[11px] text-neutral-500 mt-1 block">Articles de mode actifs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            Vendeurs inscrits
          </span>
          <div className="text-2xl font-black text-emerald-600">{totalVendors}</div>
          <span className="text-[11px] text-emerald-700/80 mt-1 block">Accès direct et immédiat</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            Acheteurs actifs
          </span>
          <div className="text-2xl font-black text-neutral-950">{totalBuyers}</div>
          <span className="text-[11px] text-neutral-500 mt-1 block">Membres clients</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            Valeur du catalogue
          </span>
          <div className="text-2xl font-black text-neutral-950">{formatPrice(grossListingValue)}</div>
          <span className="text-[11px] text-neutral-500 mt-1 block">Inventaire global réuni</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            Articles signalés
          </span>
          <div className="text-2xl font-black text-rose-600">{pendingReports.length}</div>
          <span className="text-[11px] text-rose-500 mt-1 block">
            {pendingReports.length > 0 ? 'Examen requis' : 'File de modération vide'}
          </span>
        </div>
      </div>

      {/* Onglets de navigation de l'administration */}
      <div className="flex border-b border-neutral-200 gap-6">
        <button
          id="admin-tab-moderation"
          onClick={() => setActiveAdminTab('moderation')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeAdminTab === 'moderation'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>File de modération</span>
          {pendingReports.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {pendingReports.length}
            </span>
          )}
        </button>

        <button
          id="admin-tab-users"
          onClick={() => setActiveAdminTab('users')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeAdminTab === 'users'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Annuaire des utilisateurs ({users.length})</span>
        </button>

        <button
          id="admin-tab-catalog"
          onClick={() => setActiveAdminTab('catalog')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeAdminTab === 'catalog'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Supervision du catalogue ({products.length})</span>
        </button>
      </div>

      {/* ONGLET 1 : File de modération */}
      {activeAdminTab === 'moderation' && (
        <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-bold text-neutral-950">Modération des contenus signalés</h2>
            <p className="text-xs text-neutral-500">
              Articles de mode signalés par la communauté. Rejetez le signalement s'il est infondé ou retirez l'annonce non conforme.
            </p>
          </div>

          <div className="divide-y divide-neutral-100">
            {reports.length === 0 ? (
              <div className="p-12 text-center text-neutral-400 text-xs">
                Aucun contenu signalé. La marketplace est saine et conforme !
              </div>
            ) : (
              reports.map((rep) => {
                const prod = products.find((p) => p.id === rep.productId);
                return (
                  <div key={rep.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/50 transition">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          rep.status === 'pending'
                            ? 'bg-rose-100 text-rose-800'
                            : rep.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {rep.status === 'pending' ? 'En attente' : rep.status === 'resolved' ? 'Résolu' : 'Rejeté'}
                        </span>
                        <span className="text-xs text-neutral-400">{rep.timestamp}</span>
                      </div>

                      <h4 className="text-sm font-bold text-neutral-900">
                        Article : {rep.productTitle}
                      </h4>
                      <p className="text-xs text-neutral-700 bg-neutral-100/70 p-2.5 rounded-xl border border-neutral-200">
                        <strong className="text-neutral-900">Motif du signalement :</strong> « {rep.reason} »
                      </p>
                      <span className="text-[11px] text-neutral-500 block">
                        Signalé par : {rep.reporterName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {prod && (
                        <button
                          onClick={() => setSelectedProductId(prod.id)}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg border border-neutral-300 hover:bg-neutral-100 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-neutral-600" />
                          <span>Examiner l'article</span>
                        </button>
                      )}

                      {rep.status === 'pending' && (
                        <>
                          <button
                            onClick={() => resolveReport(rep.id, 'dismiss')}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Ignorer</span>
                          </button>

                          <button
                            onClick={() => resolveReport(rep.id, 'unpublish')}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Retirer l'annonce</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ONGLET 2 : Gestion des utilisateurs */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-950">Annuaire des utilisateurs de la plateforme</h2>
              <p className="text-xs text-neutral-500">
                Consultez les acheteurs, vendeurs immédiats et rôles administrateurs.
              </p>
            </div>
            <input
              type="text"
              placeholder="Rechercher nom, e-mail ou rôle..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="px-3 py-1.5 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="py-3 px-4">Utilisateur</th>
                  <th className="py-3 px-4">Rôle</th>
                  <th className="py-3 px-4">Localisation</th>
                  <th className="py-3 px-4">Contact WhatsApp</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">Inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                        />
                        <div>
                          <span className="font-bold text-neutral-900 block">{u.name}</span>
                          <span className="text-[11px] text-neutral-400">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'seller'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.role === 'admin'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {getRoleLabel(u.role)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-neutral-700">{u.location}</td>

                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-600">
                      {u.phone || 'N/A'}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Actif
                      </span>
                    </td>

                    <td className="py-3 px-4 text-neutral-400 text-[11px]">{u.joinedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ONGLET 3 : Supervision globale du catalogue */}
      {activeAdminTab === 'catalog' && (
        <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-950">Supervision du catalogue de la marketplace</h2>
              <p className="text-xs text-neutral-500">
                Tous les articles publiés par l'ensemble des créateurs et vendeurs enregistrés.
              </p>
            </div>
            <input
              type="text"
              placeholder="Rechercher par titre, artisan, catégorie..."
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              className="px-3 py-1.5 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Vendeur</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Prix</th>
                  <th className="py-3 px-4">Disponibilité</th>
                  <th className="py-3 px-4 text-right">Actions de modération</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCatalog.map((prod) => (
                  <tr key={prod.id} className="hover:bg-neutral-50/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-10 h-10 rounded-xl object-cover border border-neutral-200 shrink-0"
                        />
                        <div>
                          <span
                            onClick={() => setSelectedProductId(prod.id)}
                            className="font-bold text-neutral-900 hover:text-amber-700 cursor-pointer block truncate max-w-[200px]"
                          >
                            {prod.title}
                          </span>
                          <span className="text-[11px] text-neutral-400">Réf : {prod.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-neutral-800">
                      {prod.sellerName}
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
                      <span className={`text-[11px] font-bold ${prod.inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {prod.inStock ? `${prod.stockQuantity} en stock` : 'Épuisé'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedProductId(prod.id)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
                          title="Aperçu du produit"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Retirer « ${prod.title} » de la marketplace ?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                          title="Retirer (action modérateur)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
