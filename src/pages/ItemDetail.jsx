// src/pages/ItemDetail.jsx
import { useState, useEffect } from "react";
import { getItemById } from "../services/mockApi";
import { formatRupiah } from "../utils/calculator";

export default function ItemDetail({ itemId, onBack, onEdit }) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    getItemById(itemId).then((data) => setItem(data));
  }, [itemId]);

  if (!item) return <div className="p-8">Memuat detail barang...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={onBack} className="text-gray-500 hover:text-gray-900 mb-4 text-sm flex items-center gap-1">
        ← Kembali ke daftar
      </button>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">ID: {item.id}</p>
            <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
          </div>
          {item.is_promo ? (
            <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">Kategori Promo</span>
          ) : (
            <span className="bg-teal-50 text-teal-700 border border-teal-100 text-sm font-medium px-3 py-1 rounded-full">Reguler</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-100 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Harga Satuan</p>
            <p className="text-lg font-semibold text-gray-900">{formatRupiah(item.price)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Sisa Stok Tersedia</p>
            <p className="text-lg font-semibold text-gray-900">{item.stock} Unit</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => onEdit(item.id)}
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Ubah Data
          </button>
        </div>
      </div>
    </div>
  );
}