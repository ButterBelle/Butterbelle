// URL Deployment Apps Script milikmu
const API_URL = "https://script.google.com/macros/s/AKfycbz7wmmB5svAHWmZobwzHmC_R-dgTc6StDt-a8Z2g9moERLLccLRxoNzqG1xVAU5cEZw/exec";

// Fungsi untuk format Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
}

// Fungsi menarik data katalog dari Google Sheets
async function muatKatalog() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        const grid = document.getElementById('katalog-grid');
        document.getElementById('loader').style.display = 'none';

        data.forEach(kue => {
            const card = document.createElement('div');
            card.className = 'card';
            // Buka modal saat card diklik
            card.onclick = () => bukaModal(kue.nama);
            
            card.innerHTML = `
                <img src="${kue.gambar}" alt="${kue.nama}">
                <h3>${kue.nama}</h3>
                <p class="harga">${formatRupiah(kue.harga)}</p>
                <button class="btn-pesan">Pesan</button>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        document.getElementById('loader').innerText = "Gagal memuat katalog. Pastikan URL Apps Script benar dan Google Sheets sudah diisi.";
    }
}

// Fungsi untuk membuka dan menutup popup form
function bukaModal(namaKue) {
    document.getElementById('inputPesanan').value = namaKue;
    document.getElementById('modal').style.display = 'flex';
}

function tutupModal() {
    document.getElementById('modal').style.display = 'none';
}

// Fungsi mengirim data pesanan ke Google Sheets
async function kirimPesanan(event) {
    event.preventDefault();
    
    const btn = document.getElementById('btnSubmit');
    btn.innerText = "Mengirim...";
    btn.style.background = "#95a5a6";
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
        
        alert("Pesanan berhasil dikirim! Kami akan segera menghubungi Anda.");
        document.getElementById('formPesanan').reset();
        tutupModal();
    } catch (error) {
        alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
        btn.innerText = "Kirim Pesanan";
        btn.style.background = "#27ae60";
        btn.disabled = false;
    }
}

// Menjalankan fungsi muat katalog otomatis saat halaman dibuka
muatKatalog();
