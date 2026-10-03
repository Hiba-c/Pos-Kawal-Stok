// src/pages/OrderForm.jsx
import { useState, useEffect } from "react";
import { fetchItems, createOrder, updateOrder, getOrderById } from "../services/mockApi";
import { calculateLineTotal } from "../utils/calculator";

export default function OrderForm({ orderId, onBack, onSuccess }) {
  const [availableItems, setAvailableItems] = useState([]);
  const [reseller, setReseller] = useState("");
  const [lines, setLines] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  
  // State untuk form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const items = await fetchItems();
        setAvailableItems(items);

        if (orderId) {
          // Mode Edit: Ambil data order berdasarkan ID
          const orderData = await getOrderById(orderId);
          if (orderData) {
            setReseller(orderData.reseller);
            setLines(orderData.lines);
          }
        } else {
          // Mode Baru (POS Biasa): Kosongkan atau gunakan data default jika diperlukan
          setReseller("");
          setLines([]);
        }
      } catch (err) {
        setErrorMsg("Gagal memuat data.");
      } finally {
        setLoadingItems(false);
      }
    };
    loadData();
  }, [orderId]);

  const updateQty = (index, newQty) => {
    const newLines = [...lines];
    if (newQty < 1) {
      newLines.splice(index, 1); // Hapus baris jika qty < 1
    } else {
      newLines[index].qty = newQty;
    }
    setLines(newLines);
  };

  // Kalkulasi Live untuk setiap baris pesanan
  let orderTotal = 0;
  const enrichedLines = lines.map((line) => {
    const itemDetail = availableItems.find((i) => i.id === line.itemId);
    if (!itemDetail) return { ...line, isValid: false };

    const { discountPercent, lineTotal } = calculateLineTotal(
      line.qty,
      itemDetail.price,
      itemDetail.is_promo
    );
    orderTotal += lineTotal;

    return { ...line, itemDetail, discountPercent, lineTotal, isValid: true };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!reseller.trim()) return setErrorMsg("Nama reseller wajib diisi.");
    if (lines.length === 0) return setErrorMsg("Pesanan minimal harus memiliki 1 item.");

    setIsSubmitting(true);
    try {
      const payload = {
        reseller,
        total: orderTotal,
        status: "draft",
        lines: lines.map((l) => ({ itemId: l.itemId, qty: l.qty })),
      };

      if (orderId) {
        await updateOrder(orderId, payload);
        if (onSuccess) onSuccess(); // Kembali ke daftar jika mode Edit selesai
      } else {
        await createOrder(payload);
        setSuccessMsg("Pesanan draft berhasil dibuat!");
        setReseller("");
        setLines([]);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan pesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingItems) return <div className="p-8 text-center text-gray-500">Memuat form pesanan...</div>;

  return (
    <div className="p-4 sm:p-8 flex justify-center w-full">
      <div className="w-full max-w-4xl bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {orderId && (
              <button onClick={onBack} className="text-gray-500 hover:text-gray-900 text-sm font-medium">
                ← Kembali
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-900">
              {orderId ? "Ubah Draft Pesanan" : "Point of Sale (Buat Pesanan)"}
            </h2>
          </div>
        </div>

        <div className="p-6">
          {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">{errorMsg}</div>}
          {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200">{successMsg}</div>}

          {/* Form Input Reseller & Tambah Barang */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Reseller</label>
              <input
                type="text"
                value={reseller}
                onChange={(e) => setReseller(e.target.value)}
                placeholder="Masukkan nama reseller..."
                className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">+ Tambah Barang</label>
              <select
                onChange={(e) => {
                  if (!e.target.value) return;
                  if (!lines.some((l) => l.itemId === e.target.value)) {
                    setLines([...lines, { itemId: e.target.value, qty: 1 }]);
                  }
                  e.target.value = "";
                }}
                className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                defaultValue=""
              >
                <option value="" disabled>Pilih barang...</option>
                {availableItems.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabel Detail Pesanan */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg mb-6">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Baris</th>
                  <th className="px-4 py-3 font-semibold text-center w-32">qty</th>
                  <th className="px-4 py-3 font-semibold text-right">unit_price</th>
                  <th className="px-4 py-3 font-semibold text-center">diskon</th>
                  <th className="px-4 py-3 font-semibold text-right">line_total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {enrichedLines.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                      Belum ada item ditambahkan. Silakan pilih barang di atas.
                    </td>
                  </tr>
                ) : (
                  enrichedLines.map((line, index) => (
                    <tr key={index} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-900 capitalize">
                        {line.itemDetail?.name || "Barang tidak ditemukan"} {line.itemDetail?.is_promo && "Promo"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            min="1"
                            value={line.qty}
                            onChange={(e) => updateQty(index, parseInt(e.target.value) || 0)}
                            className="w-16 text-center border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {line.itemDetail?.price?.toString() || 0}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {line.discountPercent}%
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {line.lineTotal?.toString() || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-gray-50 font-bold border-t border-gray-200 text-gray-900">
                <tr>
                  <td colSpan="3"></td>
                  <td className="px-4 py-4 text-center">total</td>
                  <td className="px-4 py-4 text-right">{orderTotal.toString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Tombol Aksi Simpan */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || lines.length === 0}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isSubmitting ? "Menyimpan..." : orderId ? "Simpan Perubahan Draft" : "Buat Draft Pesanan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}