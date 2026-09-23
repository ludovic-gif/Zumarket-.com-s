import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Category } from '../types';
import { X, Upload, Trash2, CheckCircle2, Sparkles } from 'lucide-react';

const FASHION_PHOTO_PRESETS: { label: string; category: Category; url: string }[] = [
  {
    label: 'Sac en cuir',
    category: 'Sacs',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Cabas en raphia',
    category: 'Sacs',
    url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Bottines Chelsea',
    category: 'Chaussures',
    url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Mules en cuir',
    category: 'Chaussures',
    url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Collier de perles',
    category: 'Colliers',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Pendentif en or',
    category: 'Colliers',
    url: 'https://images.unsplash.com/photo-1611591477457-3f36ee3bc93c?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Trench en lin',
    category: 'Vêtements',
    url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Robe en soie',
    category: 'Vêtements',
    url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
  },
];

export const ProductFormModal: React.FC = () => {
  const {
    isProductFormOpen,
    setIsProductFormOpen,
    productToEdit,
    setProductToEdit,
    addProduct,
    updateProduct,
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>(35000);
  const [category, setCategory] = useState<Category>('Sacs');
  const [condition, setCondition] = useState<'Fait main' | 'Neuf' | 'Vintage' | 'Comme neuf'>('Fait main');
  const [stockQuantity, setStockQuantity] = useState<number | string>(5);
  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price);
      setCategory(productToEdit.category);
      setCondition(productToEdit.condition as any);
      setStockQuantity(productToEdit.stockQuantity);
      setImages(productToEdit.images);
    } else {
      setTitle('');
      setDescription('');
      setPrice(35000);
      setCategory('Sacs');
      setCondition('Fait main');
      setStockQuantity(5);
      // Photo par défaut
      setImages([
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      ]);
    }
    setSuccessNotice(false);
  }, [productToEdit, isProductFormOpen]);

  if (!isProductFormOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImages((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAddPreset = (url: string) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
    }
  };

  const handleAddCustomUrl = () => {
    if (customImageUrl.trim()) {
      setImages((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalImages =
      images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'];

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        title,
        description,
        price: Number(price),
        category,
        condition,
        stockQuantity: Number(stockQuantity),
        images: finalImages,
      });
    } else {
      // Publication immédiate sans validation admin préalable !
      addProduct({
        title,
        description,
        price: Number(price),
        category,
        condition,
        stockQuantity: Number(stockQuantity),
        images: finalImages,
      });
    }

    setSuccessNotice(true);
    setTimeout(() => {
      setIsProductFormOpen(false);
      setProductToEdit(null);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Gestion du catalogue vendeur
            </span>
            <h2 className="text-xl font-bold text-neutral-900">
              {productToEdit ? "Modifier l'article de mode" : 'Publier un nouvel article de mode'}
            </h2>
          </div>
          <button
            id="close-product-form-btn"
            onClick={() => {
              setIsProductFormOpen(false);
              setProductToEdit(null);
            }}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bannière de publication immédiate */}
        <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Visibilité instantanée :</strong> Cet article est publié et visible immédiatement sur la marketplace sans attendre d'approbation administrative.
          </span>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Titre & Catégorie */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Titre de l'article *
              </label>
              <input
                id="product-form-title"
                type="text"
                required
                placeholder="ex : Sac baguette en cuir pleine fleur"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Catégorie *
              </label>
              <select
                id="product-form-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white font-medium cursor-pointer"
              >
                <option value="Sacs">Sacs</option>
                <option value="Chaussures">Chaussures</option>
                <option value="Colliers">Colliers</option>
                <option value="Vêtements">Vêtements</option>
                <option value="Accessoires">Accessoires</option>
              </select>
            </div>
          </div>

          {/* Prix en FCFA, État, Quantité */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Prix (en FCFA) *
              </label>
              <div className="relative">
                <input
                  id="product-form-price"
                  type="number"
                  required
                  min="100"
                  step="100"
                  placeholder="ex : 35000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-3.5 pr-14 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-bold"
                />
                <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-bold">FCFA</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                État de l'article
              </label>
              <select
                id="product-form-condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white font-medium cursor-pointer"
              >
                <option value="Fait main">Fait main</option>
                <option value="Neuf">Neuf</option>
                <option value="Vintage">Vintage</option>
                <option value="Comme neuf">Comme neuf</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Quantité en stock
              </label>
              <input
                id="product-form-stock"
                type="number"
                required
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-medium"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Description & Finitions *
            </label>
            <textarea
              id="product-form-description"
              required
              rows={3}
              placeholder="Précisez les matières (ex : cuir tanné, pagne tissé, perles de verre, laiton), dimensions, finitions et entretien..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 leading-relaxed"
            />
          </div>

          {/* Section Photos */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
              Photos de la création (Téléversement ou préréglages mode)
            </label>

            {/* Aperçu des photos sélectionnées */}
            <div className="flex flex-wrap gap-2.5">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-300 group shadow-xs"
                >
                  <img src={img} alt="Aperçu article" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-neutral-900/80 hover:bg-rose-600 text-white rounded-full transition cursor-pointer"
                    title="Supprimer la photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Bouton de téléversement */}
              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-800 flex flex-col items-center justify-center text-neutral-500 hover:text-neutral-900 cursor-pointer transition bg-neutral-50">
                <Upload className="w-5 h-5 mb-1 text-neutral-400" />
                <span className="text-[10px] font-bold">Ajouter</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Sélecteur de suggestions */}
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80">
              <span className="text-[11px] font-bold text-neutral-500 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Ou cliquez pour ajouter des suggestions mode haute résolution :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {FASHION_PHOTO_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPreset(preset.url)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-100 text-neutral-800 transition cursor-pointer"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>

              {/* Saisie d'URL directe */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-neutral-200/60">
                <input
                  type="url"
                  placeholder="Ou collez une URL directe d'image..."
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
                <button
                  type="button"
                  onClick={handleAddCustomUrl}
                  className="px-3 py-1.5 text-xs font-bold bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg transition cursor-pointer"
                >
                  Ajouter l'URL
                </button>
              </div>
            </div>
          </div>

          {/* Actions du formulaire */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setIsProductFormOpen(false);
                setProductToEdit(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-950 cursor-pointer"
            >
              Annuler
            </button>

            <button
              id="submit-product-form-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {successNotice
                  ? 'Article publié avec succès !'
                  : productToEdit
                  ? 'Enregistrer les modifications'
                  : 'Publier immédiatement sur la marketplace'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
