// URL Deployment Apps Script milikmu
const API_URL = "https://script.google.com/macros/s/AKfycbzUqodnKnwh_skwbbGgOR4lWvVMeZDoUuEzLvO3NmtFPlWsAbLkE7uzGbJPzP9-9G5H/exec";
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
            card.onclick = () => bukaModal(kue.nama);
            
            card.innerHTML = `
                <img src="${kue.gambar}" alt="${kue.nama}">
                <div class="card-body">
                    <h3>${kue.nama}</h3>
                    <p class="harga">${formatRupiah(kue.harga)}</p>
                    <button class="btn-pesan">Pesan Sekarang</button>
                </div>
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

// Fungsi mengirim data pesanan ke Google Sheets dengan Notifikasi Modern
async function kirimPesanan(event) {
    event.preventDefault();
    
    const btn = document.getElementById('btnSubmit');
    const originalText = btn.innerText;
    btn.innerText = "Mengirim Pesanan...";
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
        
        tutupModal();
        document.getElementById('formPesanan').reset();
        
        // Tampilkan Notifikasi Modern
        tampilkanNotifikasi("Pesanan Berhasil! 🎉 Kami akan segera menghubungi Anda.");
        
    } catch (error) {
        alert("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
        btn.innerText = originalText;
        btn.style.background = "#d35400";
        btn.disabled = false;
    }
}

// Fungsi untuk menampilkan Toast Notifikasi Modern
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

// Menjalankan fungsi muat katalog otomatis saat halaman dibuka
muatKatalog();
