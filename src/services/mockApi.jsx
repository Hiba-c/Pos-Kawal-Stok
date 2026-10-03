// src/services/mockApi.js

const DB_KEY = "POS_KAWAL_STOK_ITEMS_DB";
const ORDERS_DB_KEY = "POS_KAWAL_STOK_ORDERS_DB";

// --- PERSISTENSI ITEM ---
const getItemsDb = () => {
  const saved = localStorage.getItem(DB_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  // Data default awal jika localStorage kosong
  const initial = [
    { id: "ITM-001", name: "Beras", price: 15000, stock: 100, is_promo: false },
    { id: "ITM-002", name: "Gula", price: 18000, stock: 50, is_promo: false },
    { id: "ITM-003", name: "Mi Instan", price: 3500, stock: 200, is_promo: true },
  ];
  localStorage.setItem(DB_KEY, JSON.stringify(initial));
  return initial;
};

const saveItemsDb = (items) => {
  localStorage.setItem(DB_KEY, JSON.stringify(items));
};

export const fetchItems = async () => getItemsDb();

export const getItemById = async (id) => {
  return getItemsDb().find((i) => i.id === id);
};

export const createItem = async (data) => {
  const items = getItemsDb();
  const newItem = { id: `ITM-${Math.floor(Math.random() * 10000)}`, ...data };
  saveItemsDb([newItem, ...items]);
  return newItem;
};

export const updateItem = async (id, data) => {
  const items = getItemsDb();
  const updated = items.map((i) => (i.id === id ? { ...i, ...data } : i));
  saveItemsDb(updated);
  return true;
};

// Aturan: Item tidak boleh dihapus kalau sudah dipakai di pesanan submitted atau fulfilled
export const deleteItem = async (id) => {
  const orders = getOrdersDb();
  const isUsed = orders.some(
    (o) =>
      (o.status === "submitted" || o.status === "fulfilled") &&
      o.lines.some((l) => l.itemId === id)
  );

  if (isUsed) {
    throw new Error("Penolakan: Item tidak boleh dihapus karena sudah pernah dipakai di pesanan yang berstatus submitted atau fulfilled.");
  }

  const items = getItemsDb().filter((i) => i.id !== id);
  saveItemsDb(items);
  return true;
};


// --- PERSISTENSI PESANAN ---
const getOrdersDb = () => {
  const saved = localStorage.getItem(ORDERS_DB_KEY);
  return saved ? JSON.parse(saved) : [];
};

const saveOrdersDb = (orders) => {
  localStorage.setItem(ORDERS_DB_KEY, JSON.stringify(orders));
};

export const getOrders = async () => getOrdersDb();

export const getOrderById = async (id) => {
  return getOrdersDb().find((o) => o.id === id);
};

// Validasi saat membuat pesanan (Draft)
export const createOrder = async (payload) => {
  const items = getItemsDb();
  
  if (!payload.lines || payload.lines.length === 0) {
    throw new Error("Pesanan minimal harus memiliki 1 barang.");
  }

  const processedLines = payload.lines.map((l) => {
    if (l.qty <= 0) {
      throw new Error("Jumlah pesanan harus lebih besar dari 0.");
    }
    const item = items.find((i) => i.id === l.itemId);
    if (!item) {
      throw new Error("Barang yang dipilih tidak ditemukan di sistem.");
    }

    // Pesan ramah saat stok kurang di mode Draft
    if (l.qty > item.stock) {
      throw new Error(`Stok ${item.name} tinggal ${item.stock}, tidak bisa pesan ${l.qty}. Pemesanan dibatalkan.`);
    }

    return {
      itemId: l.itemId,
      qty: l.qty,
      unit_price: item.price, // Snapshot harga
    };
  });

  const orders = getOrdersDb();
  const newOrder = {
    id: `ORD-${Math.floor(Math.random() * 10000)}`,
    createdAt: new Date().toISOString(),
    status: "draft",
    reseller: payload.reseller,
    total: payload.total,
    lines: processedLines,
  };

  saveOrdersDb([newOrder, ...orders]);
  return newOrder;
};

// Validasi saat mengubah pesanan (Draft)
export const updateOrder = async (id, payload) => {
  const orders = getOrdersDb();
  const order = orders.find((o) => o.id === id);

  if (!order) throw new Error("Pesanan tidak ditemukan.");
  
  if (order.status !== "draft") {
    throw new Error("Pesanan ini sudah diproses dan tidak bisa diubah isinya.");
  }

  const items = getItemsDb();
  const processedLines = payload.lines.map((l) => {
    if (l.qty <= 0) throw new Error("Jumlah pesanan harus lebih besar dari 0.");
    const item = items.find((i) => i.id === l.itemId);
    if (!item) throw new Error("Barang tidak valid.");

    if (l.qty > item.stock) {
      throw new Error(`Stok ${item.name} tinggal ${item.stock}, tidak bisa pesan ${l.qty}. Perubahan dibatalkan.`);
    }

    return {
      itemId: l.itemId,
      qty: l.qty,
      unit_price: item.price,
    };
  });

  order.reseller = payload.reseller;
  order.total = payload.total;
  order.lines = processedLines;

  saveOrdersDb(orders);
  return true;
};

// Validasi saat mengubah status (Fulfilled / Cancelled)
export const updateOrderStatus = async (orderId, newStatus) => {
  const orders = getOrdersDb();
  const order = orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Pesanan tidak ditemukan.");

  const oldStatus = order.status;
  const items = getItemsDb();

  if (newStatus === "fulfilled") {
    if (oldStatus === "fulfilled") {
      throw new Error("Pesanan ini sudah berstatus selesai, stok tidak boleh dikurangi dua kali.");
    }

    // Pengecekan akhir stok saat dikonfirmasi
    for (const line of order.lines) {
      const item = items.find((i) => i.id === line.itemId);
      if (!item) {
        throw new Error(`Barang dengan ID ${line.itemId} sudah dihapus dari daftar barang.`);
      }
      if (line.qty > item.stock) {
        throw new Error(`Stok ${item.name} tinggal ${item.stock}, tidak bisa diselesaikan karena kurang dari pesanan (${line.qty}).`);
      }
    }

    // Kurangi stok secara persisten
    order.lines.forEach((line) => {
      const item = items.find((i) => i.id === line.itemId);
      if (item) {
        item.stock -= line.qty;
      }
    });
    saveItemsDb(items);
  } 
  else if (oldStatus === "fulfilled" && newStatus === "cancelled") {
    // Kembalikan stok jika dibatalkan dari fulfilled
    order.lines.forEach((line) => {
      const item = items.find((i) => i.id === line.itemId);
      if (item) {
        item.stock += line.qty;
      }
    });
    saveItemsDb(items);
  }

  order.status = newStatus;
  saveOrdersDb(orders);
  return true;
};