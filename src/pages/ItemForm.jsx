// src/pages/ItemForm.jsx
import { useState, useEffect } from "react";
import { getItemById, createItem, updateItem } from "../services/mockApi";

export default function ItemForm({ itemId, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock: 0,
    is_promo: false,
  });
  const [loading, setLoading] = useState(!!itemId);

  useEffect(() => {
    if (itemId) {
      getItemById(itemId).then((data) => {
        if (data) setFormData(data);
        setLoading(false);
      });
    }
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (itemId) {
      await updateItem(itemId, formData);
    } else {
      await createItem(formData);
    }
    onSuccess();
  };

  if (loading) return <div className="p-8">Memuat form...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={onBack} className="text-gray-500 hover:text-gray-900 mb-4 text-sm flex items-center gap-1">
        ← Kembali ke daftar
      </button>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {itemId ? "Ubah Data Barang" : "Buat Barang Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok Awal</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="promo"
              checked={formData.is_promo}
              onChange={(e) => setFormData({ ...formData, is_promo: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="promo" className="text-sm font-medium text-gray-700">Tandai sebagai item Promo</label>
          </div>

          <div className="pt-6 flex gap-3">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              Simpan Barang
            </button>
            <button type="button" onClick={onBack} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}