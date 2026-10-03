// src/pages/ItemList.jsx
import { useState, useEffect } from "react";
import { fetchItems, deleteItem } from "../services/mockApi";
import { formatRupiah } from "../utils/calculator";

export default function ItemList({ onCreate, onEdit, onDetail }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    const data = await fetchItems();
    setItems(data);
    setLoading(false);
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

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Daftar Barang</h2>
          <button 
            onClick={onCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Tambah Barang
          </button>
        </div>

        <div className="p-6">
          <div className="mb-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Cari nama barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 text-sm text-gray-700 focus:outline-none bg-transparent"
            />
          </div>

          <div className="divide-y divide-gray-100">
            {filteredItems.length === 0 ? (
              <p className="py-8 text-center text-gray-400 text-sm">Tidak ada barang.</p>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="py-5 flex justify-between items-center group">
                  <div 
                    className="flex items-center gap-4 cursor-pointer hover:opacity-80"
                    onClick={() => onDetail(item.id)}
                  >
                    <div className="w-14 h-14 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">{formatRupiah(item.price)} / unit</p>
                      <p className="text-sm text-gray-500 mt-0.5">Stok: {item.stock}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {item.is_promo ? (
                      <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Promo</span>
                    ) : (
                      <span className="text-teal-700 text-sm font-medium">Reguler</span>
                    )}
                    <div className="text-sm text-blue-600 flex gap-2 mt-1">
                      <button onClick={() => onEdit(item.id)} className="hover:underline">Edit</button>
                      <span className="text-gray-300">|</span>
                      <button onClick={() => handleDelete(item.id, item.name)} className="text-red-600 hover:underline">Hapus</button>
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