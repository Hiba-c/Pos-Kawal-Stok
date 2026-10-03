// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { fetchItems, getOrders } from "../services/mockApi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockCount: 0,
    totalOrders: 0,
    draftOrders: 0,
    submittedOrders: 0,
    fulfilledOrders: 0,
    cancelledOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const items = await fetchItems();
        const orders = await getOrders();

        // Hitung metrik berdasarkan data asli
        const totalItems = items.length;
        // Misal barang dengan stok di bawah 10 dianggap menipis
        const lowStockCount = items.filter((i) => i.stock <= 10).length;
        
        const totalOrders = orders.length;
        const draftOrders = orders.filter((o) => o.status === "draft").length;
        const submittedOrders = orders.filter((o) => o.status === "submitted").length;
        const fulfilledOrders = orders.filter((o) => o.status === "fulfilled").length;
        const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;

        setStats({
          totalItems,
          lowStockCount,
          totalOrders,
          draftOrders,
          submittedOrders,
          fulfilledOrders,
          cancelledOrders,
        });
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat data dashboard...</div>;
  }

  return (
    <div className="p-8 w-full max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Pos Kawal Stok</h2>
        <p className="text-sm text-gray-500">Ringkasan inventaris dan status pesanan secara real-time.</p>
      </div>

      {/* Kartu Statistik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Jenis Barang</p>
          <h3 className="text-3xl font-bold text-gray-900">{stats.totalItems}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Stok Menipis (≤ 10)</p>
          <h3 className="text-3xl font-bold text-orange-600">{stats.lowStockCount}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Semua Pesanan</p>
          <h3 className="text-3xl font-bold text-blue-600">{stats.totalOrders}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Pesanan Selesai (Fulfilled)</p>
          <h3 className="text-3xl font-bold text-green-600">{stats.fulfilledOrders}</h3>
        </div>
      </div>

      {/* Rincian Status Pesanan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Rincian Status Pesanan</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <span className="block text-xs font-bold text-yellow-800 uppercase mb-1">Draft</span>
            <span className="text-2xl font-bold text-yellow-900">{stats.draftOrders}</span>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <span className="block text-xs font-bold text-blue-800 uppercase mb-1">Submitted</span>
            <span className="text-2xl font-bold text-blue-900">{stats.submittedOrders}</span>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <span className="block text-xs font-bold text-green-800 uppercase mb-1">Fulfilled</span>
            <span className="text-2xl font-bold text-green-900">{stats.fulfilledOrders}</span>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <span className="block text-xs font-bold text-red-800 uppercase mb-1">Cancelled</span>
            <span className="text-2xl font-bold text-red-900">{stats.cancelledOrders}</span>
          </div>
        </div>
      </div>
    </div>
  );
}