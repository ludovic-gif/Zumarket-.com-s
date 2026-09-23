import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, MessageSquarePlus } from 'lucide-react';

interface ReviewsSectionProps {
  productId: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ productId }) => {
  const { reviews, addReview, currentUser, setIsAuthModalOpen } = useApp();
  
  const productReviews = reviews.filter((r) => r.productId === productId);
  
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!comment.trim()) return;

    addReview(productId, rating, comment.trim());
    setComment('');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsFormOpen(false);
    }, 1500);
  };

  const avgRating =
    productReviews.length > 0
      ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="mt-8 pt-8 border-t border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Avis & Évaluations des acheteurs</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(Number(avgRating)) ? 'fill-amber-400' : 'text-neutral-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-neutral-900">{avgRating} sur 5</span>
            <span className="text-xs text-neutral-500">({productReviews.length} avis vérifié{productReviews.length > 1 ? 's' : ''})</span>
          </div>
        </div>

        <button
          id="toggle-write-review-btn"
          onClick={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
            } else {
              setIsFormOpen(!isFormOpen);
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4 text-neutral-600" />
          <span>Laisser un avis</span>
        </button>
      </div>

      {/* Formulaire de soumission d'avis */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-4 mb-6 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 animate-in fade-in duration-200"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Partagez votre retour d'expérience en tant que {currentUser?.name || 'Acheteur'}
          </h4>

          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Votre note</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(s)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      s <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-neutral-700 ml-2">
                {hoverRating || rating} étoile{(hoverRating || rating) > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Votre commentaire</label>
            <textarea
              required
              rows={3}
              placeholder="Comment s'est passée la commande ? Qualité de confection, finitions et échange avec le créateur..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2.5 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          {submitted ? (
            <div className="p-2 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg">
              Merci ! Votre avis a bien été enregistré.
            </div>
          ) : (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                Annuler
              </button>
              <button
                id="submit-review-btn"
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition cursor-pointer"
              >
                Publier l'avis
              </button>
            </div>
          )}
        </form>
      )}

      {/* Liste des avis */}
      <div className="space-y-4">
        {productReviews.length === 0 ? (
          <p className="text-xs text-neutral-400 italic py-4 text-center">
            Aucun avis pour le moment. Soyez le premier à commander et évaluer cet article !
          </p>
        ) : (
          productReviews.map((rev) => (
            <div key={rev.id} className="p-3.5 bg-white rounded-xl border border-neutral-100 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={rev.userAvatar}
                    alt={rev.userName}
                    className="w-6 h-6 rounded-full object-cover border border-neutral-200"
                  />
                  <span className="text-xs font-bold text-neutral-900">{rev.userName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400' : 'text-neutral-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400 ml-1">{rev.createdAt}</span>
                </div>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
