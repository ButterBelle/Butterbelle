const API_URL = "https://script.google.com/macros/s/AKfycbxTfKkNsLHhpHFkCNSa2mhuc3P7meuCXQZ9XTO8C9nuluZK1ZhTFYvaL2kpHZ4t6evV/exec";

let semuaKue = [];

const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
}

async function muatKatalog() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        semuaKue = data;
        document.getElementById('loader').style.display = 'none';
        tampilkanKatalog(semuaKue);
    } catch (error) {
        document.getElementById('loader').innerText = "Gagal memuat katalog. Periksa koneksi atau URL Apps Script.";
    }
}

function tampilkanKatalog(dataKue) {
    const grid = document.getElementById('katalog-grid');
    grid.innerHTML = "";

    if (!dataKue || dataKue.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 30px;">Menu kue tidak ditemukan.</p>`;
        return;
    }

    dataKue.forEach(kue => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Mengambil data langsung sesuai nama kolom umum di Sheets: nama, harga, gambar
        const namaKue = kue.nama || kue.Nama || kue.MENU || "Menu Kue";
        const hargaKue = kue.harga || kue.Harga || 0;
        const gambarKue = kue.gambar || kue.Gambar || kue.LINK || "";

        card.innerHTML = `
            <img src="${gambarKue}" alt="${namaKue}" onerror="this.src='https://via.placeholder.com/200?text=Foto+Kue'">
            <div class="card-body">
                <h3>${namaKue}</h3>
                <p class="harga">${formatRupiah(hargaKue)}</p>
                <button class="btn-pesan" onclick="bukaModal('${namaKue.replace(/'/g, "\\'")}')">Pesan Sekarang</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterKatalog() {
    const keyword = document.getElementById('searchInput').value.toLowerCase().trim();
    const hasilFilter = semuaKue.filter(kue => {
        const nama = kue.nama || kue.Nama || kue.MENU || "";
        return nama.toLowerCase().includes(keyword);
    });
    tampilkanKatalog(hasilFilter);
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
        pesanan: document.getElementById('inputPesanan').value,
        keterangan: document.getElementById('inputKeterangan').value
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
