// src/utils/calculator.js

export const formatRupiah = (number) => {
  // Hanya menampilkan angka utuh, tanpa desimal, sesuai aturan sistem
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const calculateLineTotal = (qty, unitPrice, isPromo) => {
  let discountPercent = 0;

  // Aturan diskon bertingkat (hanya jika bukan promo)
  if (!isPromo) {
    if (qty >= 50) {
      discountPercent = 10;
    } else if (qty >= 10) {
      discountPercent = 5;
    }
  }

  // Perhitungan: floor(qty * unit_price * (100 - discount_percent) / 100)[cite: 4]
  const rawTotal = qty * unitPrice;
  const discountMultiplier = (100 - discountPercent) / 100;
  
  // Pembulatan ke bawah (floor) wajib dilakukan per baris[cite: 4]
  const lineTotal = Math.floor(rawTotal * discountMultiplier);

  return { discountPercent, lineTotal };
};