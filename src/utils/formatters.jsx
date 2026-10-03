// src/utils/formatters.js

export const formatRP = (value) => {
  if (value === undefined || value === null) return "RP 0";
  
  // Bulatkan nilai sesuai aturan desimal (.50 ke atas dibulatkan ke atas, di bawahnya ke bawah)
  const rounded = Math.round(Number(value));
  
  // Format angka dengan pemisah titik (.) ala Indonesia
  const formattedNumber = rounded.toLocaleString("id-ID");
  
  return `RP ${formattedNumber}`;
};