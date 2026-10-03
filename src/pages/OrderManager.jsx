// src/pages/OrderManager.jsx
import { useState, useEffect } from "react";
import { getOrders, getOrderById, fetchItems, updateOrderStatus } from "../services/mockApi";
import OrderForm from "./OrderForm";
import { formatRP } from "../utils/formatters";

export default function OrderManager() {
  const [view, setView] = useState("list"); // 'list', 'detail', 'edit'
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Data State
  const [orders, setOrders] = useState([]);
  const [itemsMap, setItemsMap] = useState({});
  const [activeOrder, setActiveOrder] = useState(null);

  const loadData = async () => {
    const data = await getOrders();
    setOrders(data);
    
    // Tarik data barang untuk keperluan tampilan nama & harga satuan di detail pesanan
    const items = await fetchItems();
    const map = {};
    items.forEach(i => map[i.id] = i);
    setItemsMap(map);
  };

  useEffect(() => {
    if (view === "list") loadData();
    if (view === "detail" && selectedOrderId) {
      getOrderById(selectedOrderId).then(data => setActiveOrder(data));
    }
  }, [view, selectedOrderId]);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    loadData();
    if (view === "detail") {
      const updated = await getOrderById(orderId);
      setActiveOrder(updated);
    }
  };

  if (view === "edit") {
    return <OrderForm orderId={selectedOrderId} onBack={() => setView("list")} onSuccess={() => setView("list")} />;
  }

  if (view === "detail" && activeOrder) {
    return (
      <div className="p-8 max-w-3xl w-full">
        <button onClick={() => setView("list")} className="text-gray-500 text-sm mb-4 hover:underline">← Kembali ke daftar</button>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">ID Pesanan: {activeOrder.id}</p>
              <h2 className="text-xl font-bold">Reseller: {activeOrder.reseller}</h2>
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
              activeOrder.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
              activeOrder.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
              activeOrder.status === 'fulfilled' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {activeOrder.status}
            </span>
          </div>

          <table className="w-full text-sm text-left mb-6">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Barang</th>
                <th className="px-4 py-2 text-center">Qty</th>
                <th className="px-4 py-2 text-right">Harga Satuan</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-b border-gray-100">
              {activeOrder.lines.map((line, i) => {
                const unitPrice = line.unit_price || itemsMap[line.itemId]?.price || 0;
                const subtotal = unitPrice * line.qty;
                return (
                  <tr key={i}>
                    <td className="px-4 py-3">{itemsMap[line.itemId]?.name || "Barang Dihapus"}</td>
                    <td className="px-4 py-3 text-center">{line.qty}</td>
                    <td className="px-4 py-3 text-right">{formatRP(unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatRP(subtotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
            <span className="text-gray-600 font-medium">Total Harga:</span>
            <span className="text-xl font-bold text-green-600">{formatRP(activeOrder.total)}</span>
          </div>

          {/* Tombol Aksi Berdasarkan Status */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            {activeOrder.status === "draft" && (
              <>
                <button onClick={() => setView("edit")} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">Ubah Isi Draft</button>
                <button onClick={() => handleStatusChange(activeOrder.id, "submitted")} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Submit Pesanan</button>
                <button onClick={() => handleStatusChange(activeOrder.id, "cancelled")} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100">Batalkan</button>
              </>
            )}

            {activeOrder.status === "submitted" && (
              <>
                <button onClick={() => handleStatusChange(activeOrder.id, "fulfilled")} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Konfirmasi (Fulfilled / Kurangi Stok)</button>
                <button onClick={() => handleStatusChange(activeOrder.id, "cancelled")} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100">Batalkan</button>
              </>
            )}

            {activeOrder.status === "fulfilled" && (
              <button onClick={() => handleStatusChange(activeOrder.id, "cancelled")} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100">Batalkan & Kembalikan Stok</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => filterStatus === "all" || o.status === filterStatus);

  // Tampilan LIST
  return (
    <div className="p-8 w-full max-w-5xl">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold">Daftar Pesanan</h2>
          
          {/* Filter Status */}
          <div className="flex flex-wrap gap-2">
            {["all", "draft", "submitted", "fulfilled", "cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium capitalize transition-colors ${
                  filterStatus === st ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
        
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Tidak ada pesanan dengan status ini.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map((o) => (
              <div key={o.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{o.reseller}</h4>
                  <p className="text-sm text-gray-500">{o.id} • {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">Total: {formatRP(o.total)}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full uppercase font-bold ${
                    o.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    o.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    o.status === 'fulfilled' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {o.status}
                  </span>
                  <button onClick={() => { setSelectedOrderId(o.id); setView("detail"); }} className="text-blue-600 text-sm hover:underline font-medium">Lihat Rincian</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}