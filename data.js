/* =========================================================
   DATA SITUS — EDIT FILE INI SAJA untuk mengelola konten.
   Gambar: taruh di folder , lalu tulis path-nya.
   Kalau gambar belum ada, tampil latar gelap otomatis.
   ========================================================= */
const SITE = {
  title: "The Lawang Sewu",
  tagline: "Seribu pintu. Satu jalan keluar.",
  banner: "banner.jpg",

  links: {
    play:    "https://www.roblox.com/id/games/129140533377074/The-Lawang-Sewu",
    discord: "https://discord.gg/AprrV63gn",
    group:   "https://www.roblox.com/id/communities/35707507/Sewu-Studio"
  },

  about: [
    "The Lawang Sewu adalah game horror Roblox yang terinspirasi dari gedung bersejarah Lawang Sewu di Semarang. Kamu bermain sebagai Rama, mahasiswa yang suatu malam terbangun di tempat yang bukan rumahnya.",
    "Berbekal senter dan sedikit petunjuk, telusuri lorong gelap, kumpulkan item, dan ikuti jejak berkas rahasia yang hilang sejak 1942, sebelum penghuni gedung menemukanmu."
  ],

  /* ---------- CHAPTER ----------
     status: "live" = sudah rilis | "soon" = Coming Soon
     images: bisa lebih dari 2 foto, tinggal tambah path baru di dalam [ ]
  */
  chapters: [
    {
      no: 1, status: "live", title: "Lorong Seribu Pintu",
      images: [
        "chapter1.jpg",
        "chapter2.jpg"
        // , "chapter1-foto3.jpg"   <- contoh nambah foto
      ],
      synopsis: "Sepulang dari kampus, Rama mendengar kisah masa lalu Bapak tentang Om Nugroho dan berkas rahasia Lawang Sewu. Malam itu, ia terbangun dan sadar bahwa dirinya tidak lagi berada di rumah.",
      cast: [
        { name: "Rama",        role: "Tokoh utama" },
        { name: "Sekar",       role: "Adik Rama" },
        { name: "Bapak",       role: "Penutur kisah masa lalu" },
        { name: "Om Nugroho",  role: "Penjaga berkas rahasia" }
      ],
      story: [
        "Di malam yang dingin, kabut tebal menyelimuti jalan. Rama berjalan pelan menuju rumah sepulang dari kampus. Setibanya di depan rumah, ia menyadari pintu rumah sudah terbuka sejak tadi. Rama bisa menebak: adiknya yang imut, Sekar, pasti menunggu di balik pintu. Rama melangkah masuk dengan pelan, dan tak lama Sekar menyadari kedatangan sang kakak. Dengan gembira dan tak sabar, Sekar mengajak Rama mendengarkan cerita masa lalu Bapak yang sudah dijanjikan sejak tadi.",
        "Bapak bercerita tentang masa lalunya yang penuh misteri dan kejanggalan, tentang hilangnya teman kerja beliau, Om Nugroho. Om Nugroho menyimpan berkas penting titipan atasannya, pemilik Lawang Sewu terdahulu, seorang pria dari negeri jauh, Belanda. Selama 20 tahun, Om Nugroho bekerja di bawah pimpinan orang Belanda itu di bidang perkeretaapian, hingga kepercayaan sang atasan kepadanya semakin besar. Suatu hari, sang pimpinan menyerahkan berkas rahasia berisi dokumen-dokumen penting yang tidak boleh diketahui orang di luar perusahaan.",
        "Hari demi hari berlalu hingga tahun 1942, ketika Jepang menjajah dan hendak mengambil alih perusahaan perkeretaapian ini. Orang-orang perusahaan panik dan tak mampu melawan. Saat itu Om Nugroho masih memegang dokumen rahasia yang tidak boleh jatuh ke tangan Jepang. Atasannya memerintahkan Om Nugroho kabur sebisa mungkin dan membakar dokumen itu agar tidak direbut. Om Nugroho berhasil lolos dari banyaknya tentara Jepang, karena ia pergi lebih awal sebelum tentara Jepang menguasai perusahaan sepenuhnya.",
        "Bapak mengakhiri ceritanya, tetapi Rama dan Sekar masih bingung dan penasaran dengan kelanjutannya. “Sudah larut malam, ayo kita tidur. Bapak juga mau tidur, besok bekerja,” ucap beliau. Rama dan Sekar pun menuju kamar, tetapi Rama masih merasa janggal: apa yang terjadi pada Om Nugroho setelah itu? Di atas kasur, berselimut, ia menghela napas dan bergumam, “Kasihan Bapak, penyesalannya begitu dalam. Om Nugroho, berkas penting, Lawang Sewu...”",
        "Rama terbangun dan hendak ke kamar mandi. Suara langkah kaki menggema, dan ia merasa janggal: rumahnya, juga lingkungan sekitarnya, tidak pernah sesunyi ini. Dengan pelan ia membuka pintu kamar, lalu terkejut dan bingung. Rama sadar bahwa ia tidak sedang berada di rumah…"
      ]
    },
    {
      no: 2, status: "soon", title: "Segera Hadir",
      teaser: "banner.jpg",
      text: "Perjalanan Rama belum berakhir. Chapter berikutnya sedang disiapkan."
    }
  ],

  /* ---------- ITEM ----------
     tag: kategori untuk filter (Alat / Kunci / Petunjuk / Bantuan)
     where: opsional, isi kalau mau menampilkan lokasi item */
  items: [
    { name: "Flashlight",  tag: "Alat",     image: "item-senter.png",     where: "",
      desc: "Penerang utama Rama di gedung yang gelap gulita. Sorot lorong sebelum melangkah, tapi jangan menyorot sesuatu terlalu lama." },
    { name: "Paper",       tag: "Petunjuk", image: "item-kertas.png",     where: "",
      desc: "Lembaran tua bertulisan tangan yang mulai pudar. Baca baik-baik, isinya bisa menjadi petunjuk untuk membuka jalan." },
    { name: "Book",        tag: "Petunjuk", image: "item-buku.png",       where: "",
      desc: "Buku lusuh peninggalan penghuni lama gedung. Catatan di dalamnya menyimpan potongan cerita dan petunjuk teka-teki." },
    { name: "Iron",        tag: "Alat",     image: "item-besi.png",       where: "",
      desc: "Batang besi tua yang dingin dan berat. Simpan, karena benda seperti ini sering dibutuhkan di tempat yang tak terduga." },
    { name: "Crowbar",     tag: "Alat",     image: "item-crowsbar.png",   where: "",
      desc: "Linggis untuk mencongkel pintu, peti, atau penghalang yang terkunci rapat." },
    { name: "Scissors",    tag: "Alat",     image: "item-gunting.png",    where: "",
      desc: "Gunting tajam untuk memotong tali, kain, atau segel yang menghalangi jalan." },
    { name: "Key Manager", tag: "Kunci",    image: "item-managerkey.png", where: "",
      desc: "Kunci hijau bermotif milik pengurus gedung. Membuka ruangan khusus yang tidak bisa dimasuki sembarang orang." },
    { name: "ExitKey",     tag: "Kunci",    image: "item-exitkey.png",    where: "",
      desc: "Kunci menuju pintu keluar. Kunci terakhir yang paling berharga, jangan sampai hilang." },
    { name: "Medkit",      tag: "Bantuan",  image: "item-madkit.png",     where: "",
      desc: "Tas P3K untuk memulihkan kondisi Rama setelah terluka. Gunakan di saat yang tepat." }
  ],

  steps: [
    { title: "Terbangun di tempat asing", text: "Kamu berperan sebagai Rama. Telusuri gedung pelan-pelan dan perhatikan sekelilingmu." },
    { title: "Kumpulkan item",            text: "Ambil Flashlight, kunci, dan item lain. Semua tersimpan di hotbar (tombol 1–5)." },
    { title: "Baca petunjuk",             text: "Paper dan Book menyimpan petunjuk untuk menemukan jalan yang benar." },
    { title: "Hindari bahaya",            text: "Sembunyi saat ada ancaman dan jangan berlari tanpa tujuan. Pakai Medkit untuk memulihkan diri." },
    { title: "Temukan jalan keluar",      text: "Kumpulkan kunci, buka pintu keluar, dan selesaikan chapter." }
  ],

  controls: [
    { key: "W A S D", action: "Bergerak" },
    { key: "Shift",   action: "Lari" },
    { key: "E",       action: "Interaksi / buka pintu" },
    { key: "1 – 5",   action: "Pilih item di hotbar" },
    { key: "C",       action: "Jongkok / sembunyi" }
  ],

  /* ---------- KREDIT (bentuk silsilah) ----------
     lead         = paling atas
     contributors = cabang di bawah lead
     voice        = dipisah, bukan bagian tim pengembang
     photo: team- | bio: tampil saat kartu diklik */
  credits: {
    developers: [
      { name: "Matthew", role: "Lead Developer & Scripter", photo: "team-matthew.jpg",
        link: "https://www.roblox.com/id/users/1758093858/profile",
        bio: "Memimpin pengembangan The Lawang Sewu dan menulis sistem utama game, mulai dari gameplay hingga interaksi item." },
      { name: "Kuncoromil", role: "Contributor & Pengembang", photo: "team-kuncoromil.jpg",
        link: "https://www.roblox.com/users/4225760496/profile",
        bio: "Ikut mengembangkan fitur dan menyempurnakan pengalaman bermain di dalam gedung." },
      { name: "MuloNR", role: "Contributor & Pengembang", photo: "team-mulonr.jpg",
        link: "https://www.roblox.com/id/users/8985537182/profile",
        bio: "Membantu pengembangan game dan memastikan setiap chapter berjalan lancar." }
    ],
    voice: [
      { name: "Suripto", role: "VoiceOver - Rama", photo: "team-suripto.jpg",
        link: "https://www.roblox.com/id/users/7884958679/profile",
        bio: "Pengisi suara karakter Rama yang menghidupkan cerita dan suasana mencekam di Lawang Sewu." }
    ]
  },

  /* ---------- ARSIP BERKAS ----------
     Tulis [[teks rahasia]] untuk bagian yang disamarkan. Pengunjung klik untuk membuka. */
  archive: {
    intro: "Selembar berkas peninggalan Om Nugroho. Beberapa bagiannya sengaja dihitamkan. Klik untuk membukanya, kalau kamu berani.",
    header: ["NEDERLANDSCH-INDISCHE SPOORWEG MAATSCHAPPIJ", "SEMARANG · BERKAS RAHASIA No. 1942/17"],
    to: "Kepada: Sdr. Nugroho, Juru Tulis Kepala",
    lines: [
      "Berkas ini hanya boleh dibuka oleh pihak yang berwenang. Simpan di tempat [[yang tidak akan dicari siapa pun]].",
      "Bila tentara datang, bawa berkas ini keluar dari gedung. Jangan lewat pintu depan. Lewatilah [[lorong di bawah tangga, tempat pintu-pintu itu berbisik]].",
      "Bakar seluruh isinya sebelum jatuh ke tangan mereka. Bila kau gagal, [[jangan pernah kembali ke dalam gedung. Ia tidak akan membiarkanmu pergi lagi]].",
      "Catatan di pinggir kertas, dengan tulisan tangan lain: [[Aku masih mendengar langkah mereka di lantai atas.]]",
      "Satu hal lagi. Bila malam tiba dan kau mendengar namamu dipanggil dari balik pintu, [[jangan dijawab]]."
    ],
    sign: "— Pimpinan Perusahaan",
    final: "Kamu tidak sendirian di sini."
  },

  /* Bisikan acak yang muncul di layar */
  whispers: ["jangan menoleh...", "dia melihatmu", "Rama...", "keluar dari sini", "masih ada yang menunggu di lantai bawah", "kamu mendengarnya juga, kan?", "pintu itu baru saja terbuka"],

  footerNote: "Terinspirasi dari Lawang Sewu, Semarang. Situs penggemar, bukan situs resmi Roblox."
};
