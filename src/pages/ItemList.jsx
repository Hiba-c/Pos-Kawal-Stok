// src/pages/ItemList.jsx
import { useState, useEffect } from "react";
import { fetchItems, deleteItem } from "../services/mockApi";
import { formatRP } from "../utils/formatters";

export default function ItemList({ onCreate, onEdit, onDetail }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (error) {
      console.error("Gagal memuat data barang:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) {
      await deleteItem(id);
      loadData(); // Refresh data setelah dihapus
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat data barang...</div>;
  }

  return (
    <div className="p-8 w-full max-w-4xl">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header Bagian Atas */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Daftar Barang</h2>
            <p className="text-sm text-gray-500">Kelola inventaris dan stok barang Anda di sini.</p>
          </div>
          <button 
            onClick={onCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Tambah Barang
          </button>
        </div>

        <div className="p-6">
          {/* Input Pencarian */}
          <div className="mb-4 border border-gray-200 rounded-lg px-4 bg-gray-50/50">
            <input
              type="text"
              placeholder="Cari nama barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 text-sm text-gray-700 focus:outline-none bg-transparent"
            />
          </div>

          {/* Daftar Barang */}
          <div className="divide-y divide-gray-100">
            {filteredItems.length === 0 ? (
              <p className="py-8 text-center text-gray-400 text-sm">Tidak ada barang yang ditemukan.</p>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="py-5 flex justify-between items-center group">
                  {/* Bagian Kiri: Gambar & Info */}
                  <div 
                    className="flex items-center gap-4 cursor-pointer hover:opacity-80"
                    onClick={() => onDetail(item.id)}
                  >
                    <img 
                      src={item.image || "/hero.png"} 
                      alt={item.name} 
                      className="w-14 h-14 object-cover rounded-lg border border-gray-200 shadow-sm flex-shrink-0" 
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-400 mb-1">{item.id}</p>
                      <p className="text-sm text-gray-600 font-medium">{formatRP(item.price)} / unit</p>
                      <p className="text-xs text-gray-500 mt-0.5">Stok: {item.stock}</p>
                    </div>
                  </div>

                  {/* Bagian Kanan: Status & Tombol Aksi */}
                  <div className="flex flex-col items-end gap-2">
                    {item.is_promo ? (
                      <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Promo</span>
                    ) : (
                      <span className="text-teal-700 bg-teal-50 text-xs font-medium px-2.5 py-0.5 rounded-full">Reguler</span>
                    )}
                    <div className="text-sm text-blue-600 flex gap-2 mt-1">
                      <button onClick={() => onDetail(item.id)} className="hover:underline font-medium text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded">Detail</button>
                      <button onClick={() => onEdit(item.id)} className="hover:underline font-medium text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded">Edit</button>
                      <button onClick={() => handleDelete(item.id, item.name)} className="text-red-600 hover:underline font-medium text-xs bg-red-50 px-2.5 py-1 rounded">Hapus</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}