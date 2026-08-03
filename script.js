// GANTI DENGAN URL DEPLOYMENT APPS SCRIPT ANDA YANG BARU
const API_URL = "https://script.google.com/macros/s/AKfycbxTfKkNsLHhpHFkCNSa2mhuc3P7meuCXQZ9XTO8C9nuluZK1ZhTFYvaL2kpHZ4t6evV/exec";

let semuaKue = [];

const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
}

async function muatKatalog() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Normalisasi data agar tahan banting terhadap perbedaan huruf besar/kecil
        semuaKue = data.map(item => {
            const normalized = {};
            for (let key in item) {
                if (item.hasOwnProperty(key)) {
                    normalized[key.toLowerCase().trim()] = item[key];
                }
            }
            return {
                nama: normalized['nama'] || normalized['namakue'] || 'Menu ButterBelle',
                harga: normalized['harga'] || 0,
                gambar: normalized['gambar'] || normalized['linkgambar'] || ''
            };
        });
        
        document.getElementById('loader').style.display = 'none';
