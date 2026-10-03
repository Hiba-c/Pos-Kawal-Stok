// src/App.jsx
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import ItemManager from "./pages/ItemManager"; 
import OrderForm from "./pages/OrderForm";
import OrderManager from "./pages/OrderManager";

function App() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  // Kumpulan Ikon SVG
  const IconCube = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
    </svg>
  );
  const IconGrid = () => (
    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
    </svg>
  );
  const IconBox = () => (
    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
    </svg>
  );
  const IconCart = () => (
    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
    </svg>
  );
  const IconList = () => (
    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
    </svg>
  );

  // Helper untuk styling tombol menu agar lebih rapi dan DRY
  const menuClass = (menu) => 
    `w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      activeMenu === menu ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      {/* Kontainer Utama */}
      <div className="w-full max-w-6xl bg-white border border-gray-200 rounded-2xl shadow-sm flex overflow-hidden min-h-[650px]">
        
        {/* Sidebar Kiri */}
        <aside className="w-64 border-r border-gray-100 flex flex-col">
          {/* Logo Brand */}
          <div className="h-16 flex items-center px-6 border-b border-transparent">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg mr-3">
              <IconCube />
            </div>
            <h1 className="font-bold text-gray-900 text-lg">Pos Kawal Stok</h1>
          </div>

          {/* Navigasi Menu */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <button onClick={() => setActiveMenu("dashboard")} className={menuClass("dashboard")}>
              <IconGrid />Dashboard
            </button>
            <button onClick={() => setActiveMenu("barang")} className={menuClass("barang")}>
              <IconBox />Data Barang
            </button>
            <button onClick={() => setActiveMenu("pos")} className={menuClass("pos")}>
              <IconCart />POS (Buat Pesanan)
            </button>
            <button onClick={() => setActiveMenu("pesanan")} className={menuClass("pesanan")}>
              <IconList />Daftar Pesanan
            </button>
          </nav>
        </aside>

        {/* Konten Utama Kanan */}
        <main className="flex-1 bg-gray-50/30 overflow-y-auto flex">
          <div className="w-full">
            {activeMenu === "dashboard" && <Dashboard />}
            {activeMenu === "barang" && <ItemManager />}
            {activeMenu === "pos" && <OrderForm />}
            {activeMenu === "pesanan" && <OrderManager />}
          </div>
        </main>

      </div>
    </div>
  );
}

export default App;