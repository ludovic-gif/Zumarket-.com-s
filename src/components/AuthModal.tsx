import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { X, ShoppingBag, Store, ShieldCheck, CheckCircle2, ArrowRight, Phone, Mail, User as UserIcon, Lock } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalRole,
    setAuthModalRole,
    registerUser,
    login,
    users,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('Dakar, Sénégal');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setAuthModalRole(role);
    setError('');
  };

  const getRoleLabel = (role: UserRole) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.role === authModalRole
      );
      if (found) {
        login(found);
        setIsAuthModalOpen(false);
      } else {
        const roleUser = users.find((u) => u.role === authModalRole);
        if (roleUser) {
          login(roleUser);
          setIsAuthModalOpen(false);
        } else {
          setError(`Aucun compte ${getRoleLabel(authModalRole)} trouvé avec cet e-mail.`);
        }
      }
    } else {
      // Inscription
      if (!name.trim() || !email.trim()) {
        setError('Veuillez renseigner votre nom complet et votre adresse e-mail.');
        return;
      }

      const defaultPhone = phone.trim() || (authModalRole === 'seller' ? '+221771234567' : '+221789876543');

      // Accès immédiat dès l'inscription !
      registerUser({
        name: name.trim(),
        email: email.trim(),
        role: authModalRole,
        businessName: businessName.trim() || (authModalRole === 'seller' ? `Atelier de ${name}` : undefined),
        location: location.trim() || 'Dakar, Sénégal',
        phone: defaultPhone,
      });

      setIsAuthModalOpen(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    const demo = users.find((u) => u.role === role);
    if (demo) {
      login(demo);
      setIsAuthModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
        {/* En-tête avec bouton Fermer */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-neutral-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Portail ZuMarket
            </span>
            <h2 className="text-xl font-bold text-neutral-900">
              {mode === 'login' ? 'Connexion' : 'Créer un compte'}
            </h2>
          </div>
          <button
            id="close-auth-modal"
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sélection des rôles (3 espaces distincts) */}
        <div className="p-6 pb-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            Sélectionnez votre espace d'accès
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-100 rounded-xl">
            <button
              type="button"
              id="role-tab-buyer"
              onClick={() => handleRoleSelect('buyer')}
              className={`flex flex-col items-center py-2.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                authModalRole === 'buyer'
                  ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/80'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 mb-1 ${authModalRole === 'buyer' ? 'text-amber-600' : ''}`} />
              <span>Acheteur</span>
            </button>

            <button
              type="button"
              id="role-tab-seller"
              onClick={() => handleRoleSelect('seller')}
              className={`flex flex-col items-center py-2.5 px-2 rounded-lg text-xs font-bold transition relative cursor-pointer ${
                authModalRole === 'seller'
                  ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/80'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Store className={`w-4 h-4 mb-1 ${authModalRole === 'seller' ? 'text-emerald-600' : ''}`} />
              <span>Vendeur</span>
              <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-emerald-500 text-[9px] text-white font-extrabold rounded-full">
                Immédiat
              </span>
            </button>

            <button
              type="button"
              id="role-tab-admin"
              onClick={() => handleRoleSelect('admin')}
              className={`flex flex-col items-center py-2.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                authModalRole === 'admin'
                  ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/80'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 mb-1 ${authModalRole === 'admin' ? 'text-indigo-600' : ''}`} />
              <span>Admin</span>
            </button>
          </div>

          {/* Explication du rôle sélectionné */}
          {authModalRole === 'seller' && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Accès vendeur immédiat :</strong>
                Inscrivez-vous et commencez à publier vos articles immédiatement. Aucune approbation préalable ni attente de validation requise.
              </div>
            </div>
          )}

          {authModalRole === 'buyer' && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Espace Acheteur :</strong>
                Découvrez des pièces de mode uniques, échangez en direct avec les artisans ou commandez en un clic via WhatsApp.
              </div>
            </div>
          )}

          {authModalRole === 'admin' && (
            <div className="mt-3 p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Console d'administration :</strong>
                Supervisez les statistiques, modérez les annonces signalées et gérez les comptes utilisateurs de la plateforme.
              </div>
            </div>
          )}
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-3.5">
          {error && (
            <div className="p-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Nom complet
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  id="auth-name-input"
                  type="text"
                  required
                  placeholder="ex : Aminata Diallo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>
          )}

          {mode === 'register' && authModalRole === 'seller' && (
            <>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nom de marque ou d'atelier
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    id="auth-brand-input"
                    type="text"
                    required
                    placeholder="ex : Atelier Cuir de Dakar"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Numéro WhatsApp <span className="text-emerald-600 font-bold">(Essentiel pour vos commandes directes)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    id="auth-phone-input"
                    type="tel"
                    required
                    placeholder="ex : +221771234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
                <span className="text-[11px] text-neutral-500 mt-0.5 block">
                  Les acheteurs cliqueront sur un bouton pour vous contacter directement sur ce numéro WhatsApp.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Ville / Région
                </label>
                <select
                  id="auth-location-select"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
                >
                  <option value="Dakar, Sénégal">Dakar, Sénégal</option>
                  <option value="Abidjan, Côte d'Ivoire">Abidjan, Côte d'Ivoire</option>
                  <option value="Bamako, Mali">Bamako, Mali</option>
                  <option value="Cotonou, Bénin">Cotonou, Bénin</option>
                  <option value="Lomé, Togo">Lomé, Togo</option>
                  <option value="Ouagadougou, Burkina Faso">Ouagadougou, Burkina Faso</option>
                  <option value="Douala, Cameroun">Douala, Cameroun</option>
                  <option value="Paris, France">Paris, France</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Adresse e-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                id="auth-email-input"
                type="email"
                required
                placeholder={authModalRole === 'admin' ? 'admin@zumarket.com' : 'vous@exemple.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                id="auth-password-input"
                type="password"
                required
                defaultValue="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Bouton de validation */}
          <button
            id="auth-submit-button"
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 text-white font-bold text-sm hover:bg-neutral-800 transition flex items-center justify-center gap-2 mt-2 shadow-sm cursor-pointer"
          >
            <span>
              {mode === 'login'
                ? `Connexion en tant que ${getRoleLabel(authModalRole)}`
                : authModalRole === 'seller'
                ? 'Créer mon compte vendeur & Publier'
                : `Créer un compte ${getRoleLabel(authModalRole)}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Boutons de test démo instantanés */}
          <div className="pt-2 border-t border-neutral-100 text-center">
            <span className="text-[11px] text-neutral-400 block mb-1.5">
              Test rapide ? Cliquez pour vous connecter directement avec un compte de démonstration :
            </span>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                id="demo-login-buyer"
                onClick={() => handleQuickDemoLogin('buyer')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-amber-100 text-neutral-800 rounded-md transition cursor-pointer"
              >
                Aminata (Acheteuse)
              </button>
              <button
                type="button"
                id="demo-login-seller"
                onClick={() => handleQuickDemoLogin('seller')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-emerald-100 text-neutral-800 rounded-md transition cursor-pointer"
              >
                Khadija (Vendeuse)
              </button>
              <button
                type="button"
                id="demo-login-admin"
                onClick={() => handleQuickDemoLogin('admin')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-indigo-100 text-neutral-800 rounded-md transition cursor-pointer"
              >
                Moussa (Admin)
              </button>
            </div>
          </div>

          {/* Bascule connexion / inscription */}
          <div className="text-center pt-2">
            <button
              type="button"
              id="auth-toggle-mode-btn"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-xs text-neutral-600 hover:text-neutral-950 underline underline-offset-4 cursor-pointer"
            >
              {mode === 'login'
                ? 'Pas encore de compte ? Inscrivez-vous ici'
                : 'Déjà inscrit(e) ? Connectez-vous ici'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
