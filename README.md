# Pos Kawal Stok — <track frontend>

## Ringkasan
Pos-Kawal-Stok adalah web frontend untuk pengelolaan barang, stok, dan pesanan dengan menerapkan aturan perhitungan diskon serta alur status pesanan.

Aplikasi ini dikembangkan menggunakan React, Vite, dan Tailwind CSS.

## Cara menjalankan
Prasyarat: Node.js 22.12+ dan npm.

git clone https://github.com/Hiba-c/Pos-Kawal-Stok.git
cd Pos-Kawal-Stok
npm install
npm run dev

Buka dengan URL lokal Vite di terminal, http://localhost:5173.

## Endpoint / Layar utama
Ini berfokus pada frontend

Method | Endpoint             | Keterangan
GET    | /items	              | Mengambil daftar barang
POST   | /items	              | Menambahkan barang
GET	   | /items/{id}	      | Melihat detail barang
PUT	   | /items/{id}	      | Memperbarui barang
DELETE | /items/{id}	      | Menghapus barang
GET	   | /orders	          | Mengambil daftar pesanan
POST   | /orders	          | Membuat pesanan
GET    | /orders/{id}	      | Melihat detail pesanan
PATCH  | /orders/{id}/submit  | Mengajukan pesanan
PATCH  | /orders/{id}/fulfill | Menyelesaikan pesanan
PATCH  | /orders/{id}/cancel  | Membatalkan pesanan

Layar utama:
Daftar Barang: menampilkan informasi barang, harga, dan stok.
Form Barang: menambahkan atau mengubah data barang.
Form Pesanan: memilih barang, menentukan kuantitas, dan melihat perhitungan harga.
Daftar Pesanan: menampilkan pesanan beserta statusnya.
Detail Pesanan: menampilkan item, kuantitas, harga, diskon, dan total pesanan.

## Tafsiran aturan
1. Status awal pesanan:
Belum dijelaskan apakah pesanan baru otomatis berstatus draft atau harus ditentukan oleh pengguna.
Perlu ditetapkan bahwa setiap pesanan baru memiliki status awal draft.
2. Pesanan draft tanpa item:
Belum dijelaskan apakah pesanan draft boleh dibuat tanpa item.
Perlu ditentukan minimal satu item wajib ada saat pesanan dibuat.

## Keputusan teknis dan trade-off
1. React: digunakan untuk membangun antarmuka.
2. Vite: digunakan sebagai development server.
3. Tailwind CSS: digunakan untuk styling antarmuka.
4. Diskon per baris: perhitungan dilakukan berdasarkan kuantitas tiap barang agar sesuai dengan ketentuan spesifikasi,risiko kesalahan dapat muncul jika frontend dan backend menerapkan aturan perhitungan yang berbeda.
5. Snapshot harga: harga transaksi disimpan pada detail pesanan agar perubahan harga katalog tidak memengaruhi transaksi yang telah dibuat, resiko data harga pada pesanan perlu dibedakan dari harga barang terkini.

## Yang belum sempat saya kerjakan
1. Integrasi API: Belum mengintegrasikan dengan kontrak OpenAPI dan mock API yang disediakan.
2. Penanganan respons API: Penanganan status loading, error, data kosong, sukses, serta respons error 4xx belum diimplementasikan.
3. Penegakan aturan pesanan: Pembatasan perubahan status dan ketersediaan stok, masih perlu dikembangkan.
4. Persistensi data: Penyimpanan data agar tetap tersedia setelah aplikasi dijalankan ulang belum diimplementasikan melalui API dan masih belom maksimal.
5. Fitur lanjutan: Laporan penjualan harian, serta penyortiran pesanan berdasarkan total belum dikerjakan.
6. Fitur bonus: Pencegahan duplikasi pengiriman, serta pencarian, filter, dan pagination belum diimplementasikan.
7. Pengujian: Pengujian manual minimal lima skenario atau pengujian komponen yang dapat dijalankan belum diterlaksana.
8. Video demo: Belum membuat video demonstrasi yang menampilkan tampilan, fitur, dan alur penggunaan aplikasi.

## Pengujian
belum melakukan test

# Pos-Kawal-Stok
Tes Teknikal Developer Di Geek Garden
