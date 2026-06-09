async function simulate() {
  console.log("Mengirim data simulasi ke localhost:3000/api/readings...");
  
  const randomKw = Math.floor(Math.random() * 50) + 10; // Random kw between 10 and 60
  const payload = {
    meterId: "M-001",
    kwh: 100 + randomKw / 100, // Just a dummy cumulative kwh
    voltage: 220,
    current: 4.5,
    kw: randomKw
  };

  try {
    const response = await fetch("http://localhost:3000/api/readings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer bms-nodered-secret-key-2026"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Status HTTP:", response.status);
    console.log("Response:", data);
  } catch (error) {
    console.error("Gagal mengirim simulasi:", error);
  }
}

simulate();
