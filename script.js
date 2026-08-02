// URL Deployment Apps Script milikmu
const API_URL = "https://script.google.com/macros/s/AKfycbyYT1kUQWsfXmksdK_mxfSvz98BYJtlIUod5yidmtGH148qHwZqqo5p-XdWHM3X7wdg/exec";
// URL Deployment Apps Script milikmu
const API_URL = "https://script.google.com/macros/s/AKfycbwpDb67-YhdpWJ0S04TXbLMmop2r8Ii15hsSCdONz8uiZh17u7N9g-oIneoG6DnKQzH/exec";

let semuaKue = []; // Menyimpan data master katalog

// Fungsi format Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
}

// Fungsi utama mengambil data dari Google Sheets
async function muatKatalog() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        console.log("Data berhasil ditarik dari API:", data); // Cek di Inspect Console browser
        
        // Simpan data ke variabel global
        semuaKue = data;
        
        document.getElementById('loader').style.display = 'none';
        tampilkanKatalog(semuaKue);
    } catch (error) {
        console.error("Gagal memuat katalog:", error);
        document.getElementById('loader').innerText = "Gagal memuat katalog. Pastikan URL Apps Script benar.";
    }
}

// Fungsi untuk menampilkan kartu kue ke HTML
function tampilkanKatalog(dataKue) {
    const grid = document.getElementById('katalog-grid');
    grid.innerHTML = ""; // Bersihkan grid sebelum diisi ulang

    if (!dataKue || dataKue.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 30px;">Menu kue tidak ditemukan.</p>`;
        return;
    }

    dataKue.forEach(kue => {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <img src="${kue.gambar}" alt="${kue.nama}" onerror="this.src='https://via.placeholder.com/200?text=Foto+Kue'">
            <div class="card-body">
                <h3>${kue.nama}</h3>
                <p class="harga">${formatRupiah(kue.harga)}</p>
                <button class="btn-pesan" onclick="bukaModal('${kue.nama.replace(/'/g, "\\'")}')">Pesan Sekarang</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Fungsi Pencarian (Search Filter) - Otomatis jalan saat diketik
function filterKatalog() {
    const inputElement = document.getElementById('searchInput');
    if (!inputElement) return;

    const keyword = inputElement.value.toLowerCase().trim();
    console.log("Mencari keyword:", keyword); // Cek ketikan di Inspect Console

    const hasilFilter = semuaKue.filter(kue => {
        const namaKue = kue.nama ? kue.nama.toLowerCase() : "";
        return namaKue.includes(keyword);
    });

    tampilkanKatalog(hasilFilter);
}

// Fungsi Modal Form Pesanan
function bukaModal(namaKue) {
    document.getElementById('inputPesanan').value = namaKue;
    document.getElementById('modal').style.display = 'flex';
}

function tutupModal() {
    document.getElementById('modal').style.display = 'none';
}

// Fungsi Modal Proposal Kerjasama
function bukaProposal() {
    document.getElementById('modalProposal').style.display = 'flex';
}

function tutupProposal() {
    document.getElementById('modalProposal').style.display = 'none';
}

// Fungsi Kirim Pesanan ke Google Sheets
async function kirimPesanan(event) {
    event.preventDefault();
    
    const btn = document.getElementById('btnSubmit');
    const originalText = btn.innerText;
    btn.innerText = "Mengirim...";
    btn.disabled = true;

    const dataPesanan = {
        nama: document.getElementById('inputNama').value,
        nowa: document.getElementById('inputWA').value,
        pesanan: document.getElementById('inputPesanan').value
    };

    try {
        await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(dataPesanan)
        });
        
        tutupModal();
        document.getElementById('formPesanan').reset();
        tampilkanNotifikasi("Pesanan Berhasil! 🎉 Kami akan segera menghubungi Anda.");
        
    } catch (error) {
        alert("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// Fungsi Toast Notifikasi
function tampilkanNotifikasi(pesan) {
    let notif = document.getElementById('toast-notif');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'toast-notif';
        document.body.appendChild(notif);
    }
    
    notif.innerText = pesan;
    notif.className = 'toast-show';
    
    setTimeout(() => {
        notif.className = notif.className.replace('toast-show', '');
    }, 4000);
}

// Jalankan saat halaman siap
muatKatalog();
