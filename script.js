// URL Deployment Apps Script milikmu
const API_URL = "https://script.google.com/macros/s/AKfycbyYT1kUQWsfXmksdK_mxfSvz98BYJtlIUod5yidmtGH148qHwZqqo5p-XdWHM3X7wdg/exec";
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
}

async function muatKatalog() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        const grid = document.getElementById('katalog-grid');
        document.getElementById('loader').style.display = 'none';

        data.forEach(kue => {
            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <img src="${kue.gambar}" alt="${kue.nama}" onerror="this.src='https://via.placeholder.com/200?text=Foto+Kue'">
                <div class="card-body">
                    <h3>${kue.nama}</h3>
                    <p class="harga">${formatRupiah(kue.harga)}</p>
                    <button class="btn-pesan" onclick="bukaModal('${kue.nama}')">Pesan Sekarang</button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        document.getElementById('loader').innerText = "Gagal memuat katalog. Periksa koneksi atau URL Apps Script.";
    }
}
// Fungsi Pencarian (Search Filter)
function filterKatalog() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const kueTerpilih = semuaKue.filter(kue => 
        kue.nama.toLowerCase().includes(keyword)
    );
    tampilkanKatalog(kueTerpilih);
}
function bukaModal(namaKue) {
    document.getElementById('inputPesanan').value = namaKue;
    document.getElementById('modal').style.display = 'flex';
}

function tutupModal() {
    document.getElementById('modal').style.display = 'none';
}

function bukaProposal() {
    document.getElementById('modalProposal').style.display = 'flex';
}

function tutupProposal() {
    document.getElementById('modalProposal').style.display = 'none';
}

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

muatKatalog();
