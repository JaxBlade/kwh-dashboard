async function simulate() {
  console.log("Mengirim data simulasi ke localhost:3000/api/readings...");
  
  const payload = {
    meterId: "M-001",
    kwh: 100,
    voltage: 220,
    current: 4.5,
    power: 990
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
