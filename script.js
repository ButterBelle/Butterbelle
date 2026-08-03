const API_URL = "https://script.google.com/macros/s/AKfycbyiYKChHs4zbpldFygYwM52i5z3UhJv-6byNDHTYY6HVg4toeP8cIp1cx6teKwXWhJE/exec";

let semuaKue = [];

const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
}

async function muatKatalog() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Membaca data secara fleksibel dari kolom mana pun di Google Sheets
        semuaKue = data.map(item => {
            const keys = Object.keys(item);
            
            // Mencari kolom yang kira-kira berisi Nama, Harga, dan Gambar
            let namaKey = keys.find(k => k.toLowerCase().includes('nama') || k.toLowerCase().includes('menu')) || keys[0];
            let hargaKey = keys.find(k => k.toLowerCase().includes('harga')) || keys[1];
            let gambarKey = keys.find(k => k.toLowerCase().includes('gambar') || k.toLowerCase().includes('link') || k.toLowerCase().includes('foto')) || keys[2];

            return {
                nama: item[namaKey] || "Menu Kue",
                harga: item[hargaKey] || 0,
                gambar: item[gambarKey] || ""
            };
        });
        
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
        card.className = 'card card-skeleton';
        
        card.innerHTML = `
            <img src="${kue.gambar}" alt="${kue.nama}" onload="this.classList.remove('card-skeleton')" onerror="this.src='https://via.placeholder.com/200?text=Foto+Kue'">
            <div class="card-body">
                <h3>${kue.nama}</h3>
                <p class="harga">${formatRupiah(kue.harga)}</p>
                <button class="btn-pesan" onclick="bukaModal('${String(kue.nama).replace(/'/g, "\\'")}')">Pesan Sekarang</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterKatalog() {
    const keyword = document.getElementById('searchInput').value.toLowerCase().trim();
    const hasilFilter = semuaKue.filter(kue => 
        String(kue.nama).toLowerCase().includes(keyword)
    );
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
