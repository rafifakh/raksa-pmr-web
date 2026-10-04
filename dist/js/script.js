document.addEventListener("DOMContentLoaded", () => {
    // ================= 1. PENCARIAN & FILTER OBAT =================
    const searchInput = document.getElementById("medSearch");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const tableRows = document.querySelectorAll("#medTableBody tr");
  
    function filterMedicine() {
      const query = searchInput.value.toLowerCase().trim();
      const activeBtn = document.querySelector(".filter-btn.active");
      const activeCategory = activeBtn ? activeBtn.dataset.category : "all";
  
      tableRows.forEach((row) => {
        const text = row.innerText.toLowerCase();
        const rowCat = row.dataset.cat;
  
        const matchesSearch = text.includes(query);
        const matchesCategory =
          activeCategory === "all" || rowCat === activeCategory;
  
        if (matchesSearch && matchesCategory) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    }
  
    if (searchInput) {
      searchInput.addEventListener("input", filterMedicine);
    }
  
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        filterMedicine();
      });
    });
  
    // ================= 2. KALKULATOR BMI =================
    const bmiForm = document.getElementById("bmiForm");
    const bmiResultBox = document.getElementById("bmiResultBox");
    const bmiValue = document.getElementById("bmiValue");
    const bmiStatus = document.getElementById("bmiStatus");
    const bmiDesc = document.getElementById("bmiDesc");
  
    if (bmiForm) {
      bmiForm.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const weight = parseFloat(document.getElementById("bmiWeight").value);
        const heightCm = parseFloat(document.getElementById("bmiHeight").value);
  
        if (!weight || !heightCm) return;
  
        const heightM = heightCm / 100;
        const bmi = (weight / (heightM * heightM)).toFixed(1);
  
        let status = "";
        let desc = "";
        let color = "";
  
        if (bmi < 18.5) {
          status = "Berat Badan Kurang";
          desc =
            "Status nutrisi kurang. Dianjurkan meningkatkan asupan kalori bergizi seimbang.";
          color = "#3b82f6";
        } else if (bmi <= 24.9) {
          status = "Berat Badan Normal (Ideal)";
          desc =
            "Hebat! Berat badanmu proporsional. Pertahankan kebiasaan makan sehat dan aktif bergerak.";
          color = "#10b981";
        } else if (bmi <= 29.9) {
          status = "Kelebihan Berat Badan";
          desc =
            "Waspadai kelebihan berat badan. Atur porsi kalori dan perbanyak olahraga teratur.";
          color = "#f59e0b";
        } else {
          status = "Obesitas";
          desc =
            "Disarankan untuk konsultasi gizi atau pemeriksaan lebih lanjut guna menjaga kesehatan tubuh.";
          color = "#ef4444";
        }
  
        bmiValue.textContent = bmi;
        bmiValue.style.color = color;
        bmiStatus.textContent = status;
        bmiDesc.textContent = desc;
        bmiResultBox.style.display = "block";
      });
    }
  });

  // Link Google Sheets yang sudah disesuaikan dengan ID milikmu
const SPREADSHEET_ID = "1J99AsubHuN5AyVVcOnWeZaWrABl-Z07ESE0R-h-_NzY";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=Sheet1`;

// Database kamus ringkas untuk menentukan Kategori & Khasiat secara otomatis
const medDictionary = {
  "oksigen": { cat: "khusus", desc: "Bantuan pernapasan darurat / sesak napas" },
  "kasa": { cat: "p3k", desc: "Penutup steril luka pendarahan dan luka terbuka" },
  "plester": { cat: "p3k", desc: "Pelekat penutup luka gores atau lecet" },
  "hansaplast": { cat: "p3k", desc: "Perlindungan luka lecet dan sayat dari debu" },
  "salonpas": { cat: "umum", desc: "Pereda nyeri sendi, pegal linu, dan kram otot" },
  "betadine": { cat: "p3k", desc: "Antiseptik pencegah kuman dan infeksi luka luar" },
  "rohto": { cat: "umum", desc: "Meredakan mata merah dan iritasi ringan" },
  "insto": { cat: "umum", desc: "Meredakan iritasi mata akibat debu atau asap" },
  "bioplacenton": { cat: "p3k", desc: "Salep antiseptik untuk luka bakar dan lecet" },
  "trombophop": { cat: "khusus", desc: "Pereda lebam memar dan pembengkakan urat" },
  "sarung tangan": { cat: "p3k", desc: "Perlindungan higienis penolong medis" },
  "masker": { cat: "umum", desc: "Pencegahan penularan droplet dan debu" },
  "pembalut": { cat: "khusus", desc: "Logistik sanitasi darurat siswi" },
  "promag": { cat: "umum", desc: "Meredakan sakit maag, mual, dan nyeri lambung" },
  "feminax": { cat: "khusus", desc: "Meredakan nyeri haid dan kram perut siswi" },
  "bodrex": { cat: "umum", desc: "Meredakan demam, sakit kepala, dan sakit gigi" },
  "paracetamol": { cat: "umum", desc: "Penurun panas demam dan pereda nyeri tubuh" },
  "enstrostop": { cat: "umum", desc: "Mengatasi diare dan mengurangi frekuensi buang air" },
  "panadol": { cat: "umum", desc: "Meredakan flu, sakit kepala, batuk, dan demam" },
  "ambroxol": { cat: "umum", desc: "Pengencer dahak batuk" },
  "diapet": { cat: "umum", desc: "Mengurangi mulas dan diare secara alami" },
  "termometer": { cat: "khusus", desc: "Pengukur suhu tubuh digital / manual" },
  "antangin": { cat: "umum", desc: "Meredakan masuk angin, perut kembung, dan pusing" },
  "neuralgin": { cat: "khusus", desc: "Pereda nyeri saraf, sakit gigi, dan migrain" },
  "rivanol": { cat: "p3k", desc: "Cairan kompres pembersih luka dan borok" },
  "demacolin": { cat: "umum", desc: "Meringankan gejala flu, hidung tersumbat, dan bersin" }
};

// Fungsi Mengambil & Menampilkan Data ke Tabel
async function fetchSheetData() {
  const tableBody = document.getElementById("medTableBody");
  if (!tableBody) return;

  try {
    const response = await fetch(CSV_URL);
    const csvText = await response.text();

    const rows = csvText.split("\n").map(r => r.trim()).filter(r => r.length > 0);
    const dataRows = rows.slice(1); // Lewati baris header

    if (dataRows.length === 0) return;

    let html = "";
    dataRows.forEach(rowStr => {
      // Parsing CSV sederhana
      const cols = rowStr.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || rowStr.split(",");
      const cleanCols = cols.map(c => c.replace(/^["']|["']$/g, '').trim());

      const nama = cleanCols[1] || "-";
      const stok = cleanCols[2] || "-";

      // 1. Tentukan Kategori & Khasiat Otomatis
      let category = "umum";
      let khasiat = "Kebutuhan medis dan pertolongan pertama UKS";
      const lowerName = nama.toLowerCase();

      for (const [key, value] of Object.entries(medDictionary)) {
        if (lowerName.includes(key)) {
          category = value.cat;
          khasiat = value.desc;
          break;
        }
      }

      // Label tampilan kategori
      let labelKategori = "Obat Umum";
      if (category === "p3k") labelKategori = "P3K & Luka";
      if (category === "khusus") labelKategori = "Khusus";

      // 2. Tentukan Status & Warna Badge Otomatis
      const stokClean = stok.replace(/^["']|["']$/g, '').trim();

      // Ambil angka dan ubah koma menjadi titik (misal: "1,5 Pcs" -> 1.5)
      const matchNum = stokClean.replace(',', '.').match(/(\d+(?:\.\d+)?)/);
      const numOnly = matchNum ? parseFloat(matchNum[1]) : NaN;
      
      let status = "Tersedia";
      let badgeClass = "status-available";
      
      if (stokClean === "-" || stokClean === "0" || numOnly === 0) {
        status = "Habis";
        badgeClass = "status-danger";
      } else if (!isNaN(numOnly) && numOnly <= 3) {
        status = "Menipis";
        badgeClass = "status-warning";
      } else {
        status = "Tersedia";
        badgeClass = "status-available";
      }

      html += `
        <tr data-cat="${category}">
          <td><strong>${nama}</strong></td>
          <td><span class="tag-cat">${labelKategori}</span></td>
          <td>${khasiat}</td>
          <td>${stok}</td>
          <td><span class="badge-status ${badgeClass}">${status}</span></td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
    initFilterAndSearch();

  } catch (error) {
    console.error("Gagal memuat data dari Google Sheets:", error);
  }
}

function initFilterAndSearch() {
  const searchInput = document.getElementById("medSearch");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const rows = document.querySelectorAll("#medTableBody tr");

  function filterTable() {
    const searchVal = searchInput ? searchInput.value.toLowerCase() : "";
    const activeBtn = document.querySelector(".filter-btn.active");
    const activeCategory = activeBtn ? activeBtn.getAttribute("data-category") : "all";

    rows.forEach(row => {
      const name = row.children[0].textContent.toLowerCase();
      const rowCat = row.getAttribute("data-cat");

      const matchSearch = name.includes(searchVal);
      const matchCat = (activeCategory === "all" || rowCat === activeCategory);

      if (matchSearch && matchCat) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterTable);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filterTable();
    });
  });
}

document.addEventListener("DOMContentLoaded", fetchSheetData);

// ... fungsi fetchSheetData() dan kode di atasnya tetap sama ...

function initFilterAndSearch() {
  const searchInput = document.getElementById("medSearch");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const rows = document.querySelectorAll("#medTableBody tr");

  function filterTable() {
    const searchVal = searchInput ? searchInput.value.toLowerCase() : "";
    const activeBtn = document.querySelector(".filter-btn.active");
    const activeCategory = activeBtn ? activeBtn.getAttribute("data-category") : "all";

    rows.forEach(row => {
      const name = row.children[0].textContent.toLowerCase();
      const rowCat = row.getAttribute("data-cat");

      const matchSearch = name.includes(searchVal);
      const matchCat = (activeCategory === "all" || rowCat === activeCategory);

      if (matchSearch && matchCat) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterTable);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filterTable();
    });
  });
}

// 1. Jalankan fetchSheetData saat web dimuat
document.addEventListener("DOMContentLoaded", fetchSheetData);

// 2. TAMBAHKAN DI BAWAHNYA: Deteksi scroll untuk menu navbar aktif
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 120;
    const sectionId = current.getAttribute("id");
    const navLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink.classList.add("active");
      } else {
        navLink.classList.remove("active");
      }
    }
  });
});

const hamburgerBtn = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-links");

if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // Tutup menu otomatis setelah salah satu tautan diklik
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });
}

if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}

window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});

window.addEventListener("DOMContentLoaded", () => {
  if(window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
  }

  window.scrollTo(0, 0);
});