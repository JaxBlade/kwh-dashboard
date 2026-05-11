const http = require('http');

console.log("=========================================");
console.log("   🔌 MODBUS GATEWAY SIMULATOR START   ");
console.log("=========================================");
console.log("Simulasi ini akan mengirimkan data kWh baru");
console.log("ke server setiap 5 detik untuk didemonstrasikan.");
console.log("Tekan Ctrl+C untuk menghentikan.");
console.log("-----------------------------------------");

// Array of meter IDs
const meters = Array.from({ length: 52 }).map((_, i) => `M-${String(i + 1).padStart(3, '0')}`);

// Keep track of current readings
const currentReadings = {};
meters.forEach(m => {
  currentReadings[m] = 1000 + Math.random() * 500; // Starting baseline
});

function sendData() {
  // Pick a random meter
  const randomMeter = meters[Math.floor(Math.random() * meters.length)];
  
  // Add 0.5 to 2.5 kWh to current reading
  currentReadings[randomMeter] += (Math.random() * 2) + 0.5;
  const newValue = parseFloat(currentReadings[randomMeter].toFixed(2));

  const payload = JSON.stringify({
    meter_id: randomMeter,
    kwh_total: newValue
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/ingest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(`✅ [SUCCESS] Sent to ${randomMeter}: ${newValue} kWh`);
      } else {
        console.log(`❌ [ERROR] Failed sending to ${randomMeter}: ${res.statusCode} - ${data}`);
      }
    });
  });

  req.on('error', (error) => {
    console.log(`⚠️ [SERVER OFFLINE] Gagal mengirim data. Pastikan 'npm run dev' sudah berjalan.`);
  });

  req.write(payload);
  req.end();
}

// Send data every 5 seconds
setInterval(sendData, 5000);

// Send one immediately
sendData();
