# Panduan Edit — The Lawang Sewu

Hampir semua isi situs diedit di satu file: **data.js**. Buka dengan Notepad / VS Code, ubah tulisan di dalam tanda kutip `" "`, simpan, lalu upload ulang ke GitHub.

## Struktur file
| File | Fungsi |
|---|---|
| `index.html` | Kerangka halaman (jarang perlu diubah) |
| `style.css` | Tampilan dan animasi |
| `data.js` | **Semua konten** (teks, tanggal, link, badge, suara) |
| `main.js` / `sound.js` | Logika situs dan efek suara (jangan diubah kalau tidak perlu) |
| `*.jpg` / `*.png` / `*.mp3` | Gambar dan suara, **taruh sejajar dengan index.html** (tanpa folder) |

## 0. Layar pembuka (logo bergoyang + tombol Masuk)
Saat pengunjung membuka situs, muncul layar pembuka: logo Lawang Sewu yang bergoyang, pesan pembuka, dan tombol **Masuk**. Begitu **Masuk** diklik, **musik ambient langsung menyala** dan layar terangkat. Ini sengaja: browser tidak mengizinkan musik bunyi sebelum ada klik, jadi tombol Masuk jadi pemicunya.
- Selagi layar pembuka tampil, musik ambient dan suara aktor dimuat di belakang layar (ada bar "Menyiapkan suara…"), jadi saat diklik langsung bunyi.
- Diedit di `data.js` bagian `gate`: `kicker`, `title`, `tagline`, `message` (daftar paragraf), `enterText`, `loadingText`, `note`.
- `cooldownMinutes: 0` = muncul di setiap kunjungan. Isi angka (menit) kalau mau tidak muncul lagi setelah masuk.
- Mau matikan? `enabled: false`.
- Tes: `index.html?gate=on` (paksa tampil) atau `?gate=off` (sembunyikan).
- Logo adalah SVG di `index.html` (blok `<svg class="g-logo">`). Mau ganti dengan gambar logo sendiri? Taruh `logo.png` sejajar index.html lalu ganti blok `<svg>` itu dengan `<img class="g-logo" src="logo.png" alt="">`.

## 0b. Info & Lapor Bug
Dibuka lewat menu **Lainnya > Info & Lapor Bug** (tidak muncul otomatis). Diedit di `data.js` bagian `welcome` (tab: `label`, `title`, `text`, `actions`). `link` pada tombol: `"play"`, `"discord"`, `"group"` atau URL lengkap.

## 1. Tanggal rilis dan hitung mundur
Di `data.js`, cari `chapters`. Pada Chapter 1:
```js
release: "2026-10-31T00:00:00+07:00",
```
Format: `TAHUN-BULAN-TANGGAL` + `T` + `JAM:MENIT:DETIK` + `+07:00` (WIB). Contoh jam 7 malam: `2026-10-31T19:00:00+07:00`.
- Setelah waktunya lewat, Chapter 1 terbuka otomatis (ada animasi pintu).
- Chapter 2 saat ini "Coming soon". Kalau tanggalnya sudah ada, tambahkan satu baris `release: "..."` di Chapter 2, otomatis jadi hitung mundur.
- Tidak mau hitung mundur? Hapus baris `release`.
- `gatePlayUntilRelease: true` (paling atas data.js) = sebelum rilis, tombol utama ke Discord. Ubah ke `false` kalau mau tombol "Main di Roblox" selalu tampil.
- **Tes tanpa menunggu:** buka `index.html?rilis=demo` (hitung mundur 11 detik) atau `?rilis=live` (tampilan setelah rilis).

## 2. Suara aktor
1. Siapkan file suara (disarankan **mp3**, di bawah 1 MB), misalnya `rama-1.mp3`.
2. Upload ke GitHub **di tempat yang sama dengan index.html**.
3. Di `data.js` bagian `credits` > `voice`:
```js
samples: [
  { label: "Suara Rama", src: "rama-1.mp3", quote: "teks ucapan (boleh kosong)" },
  { label: "Rama ketakutan", src: "rama-2.mp3", quote: "" }   // cuplikan kedua (opsional)
],
```
**Tambah aktor lain (contoh: Anna):**
1. Upload `team-anna.jpg` (foto) dan `anna-1.mp3` (suara) sejajar dengan index.html.
2. Di `data.js`, di dalam `voice: [ ... ]`, salin satu blok `{ name: "Suripto", ... }` dan taruh setelahnya dengan **koma di antaranya**.
3. Ganti `name`, `role`, `character`, `photo`, `samples`, `link`, `bio`. `link: ""` = tombol profil Roblox tidak muncul. Tanpa `samples`, pemutar tidak muncul.
- Kartu aktor baru otomatis berjajar rapi di tengah.

## 2b. Suara Ambient (tombol "Ambient")
1. Siapkan file mp3 ambient buatanmu (disarankan 1 sampai 3 MB, bisa dibuat looping mulus), misalnya `ambient-1.mp3`.
2. Upload sejajar dengan index.html, lalu di `data.js` bagian `ambient`:
```js
ambient: {
  volume: 0.4,                       // 0 sampai 1
  tracks: [
    { label: "Lorong Sunyi", src: "ambient-1.mp3" },
    { label: "Hujan di Gedung", src: "ambient-2.mp3" }   // opsional, diputar bergantian
  ]
},
```
- Satu track = diulang terus. Beberapa track = bergantian lalu mengulang dari awal.
- Fade in/out otomatis, dan volumenya mengecil sendiri saat suara aktor diputar.
- File belum ada atau gagal dimuat = otomatis pakai dengung bawaan, jadi aman.
- Musik berhenti saat tab disembunyikan dan lanjut saat dibuka lagi (hemat baterai HP).
- Arahkan kursor ke tombol Ambient untuk melihat judul track yang sedang diputar.

## 3. Badge dan Title
1. Siapkan gambar PNG transparan, persegi (mis. 512x512), upload sejajar dengan index.html.
2. Di `data.js` bagian `badges`:
```js
{ name: "Nama Badge", type: "Badge", image: "badge-pertama.png",
  desc: "Penjelasan singkat.", how: "Cara mendapatkannya (opsional)" },
```
- `type` bisa `"Badge"` atau `"Title"` (filter muncul otomatis).
- `image` kosong (`""`) = tampil siluet kunci.
- Mau tambah? Salin satu baris, beri koma. Mau hapus? Hapus barisnya.

## 3b. Kelangkaan badge Kelangkaan badge
Warna cincin badge mengikuti `type`: `Biasa` (abu), `Langka` (biru), `Juara` (emas), `Legenda` (merah, berdenyut). Nama lain tetap tampil dengan warna emas default.

## Menu atas
Link menu ada di `index.html` (cari `<nav id="menu">`). Menu utama dibuat ringkas, sisanya ada di dropdown "Lainnya". Di HP, semua link tampil di menu layar penuh.

## 4. Konten lain
- **Link game / Discord / grup:** `links` di bagian atas data.js.
- **Item:** array `items` (nama, tag, gambar, deskripsi, `where` opsional).
- **Foto chapter:** `images` di tiap chapter, tambah path baru di dalam `[ ]`.
- **Tim / kredit:** `credits.developers`. Foto = file `team-xxx.jpg`.
- **Arsip berkas:** tulis `[[teks rahasia]]` untuk bagian yang disamarkan.

## 5. Upload ke GitHub
- Cara paling aman: buka repo, klik **Add file > Upload files**, lalu **seret (drag) file-nya dari komputer** ke halaman. Tombol "choose your files" tidak bisa memilih folder.
- Karena itu proyek ini sengaja dibuat **tanpa folder**: semua file sejajar, jadi cukup pilih semua file lalu seret.
- Maksimal 100 file per upload dan 25 MB per file. Setelah upload, klik **Commit changes**.
- Kalau upload dengan nama file yang sama, GitHub otomatis menimpa file lama.
- Perubahan biasanya muncul di GitHub Pages dalam 1 sampai 2 menit. Kalau belum berubah, tekan **Ctrl + F5**.

## Kalau ada yang rusak
- Halaman kosong atau tidak berubah setelah edit data.js biasanya karena **kurang koma** atau **kurang tanda kutip**. Cek baris yang baru kamu ubah.
- Tombol suara menampilkan "Rekaman belum tersedia" = nama file di `src` tidak sama dengan nama file yang diupload (huruf besar/kecil berpengaruh).
- Gambar badge tidak muncul = nama file di `image` tidak cocok, atau filenya belum terupload.
