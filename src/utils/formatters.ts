/**
 * Utilitaire de formatage monétaire pour le Franc CFA (FCFA)
 * Exemple: 15000 -> "15 000 FCFA"
 */
export const formatPrice = (amount: number): string => {
  if (isNaN(amount)) return '0 FCFA';
  return `${Math.round(amount).toLocaleString('fr-FR')} FCFA`;
};

export const formatNumber = (val: number): string => {
  if (isNaN(val)) return '0';
  return Math.round(val).toLocaleString('fr-FR');
};
