fetch("data.csv")
  .then((response) => response.text())
  .then((csvData) => {
    const parsed = Papa.parse(csvData, { header: true });
    const data = parsed.data;

    const labels = [];
    const menang = [];
    const kalah = [];

    data.forEach((row) => {
      if (!row.c_name || !row.msec_duration || !row.win) return;

      const durasi = parseFloat(row.msec_duration) / 1000;
      const win = row.win.trim();

      labels.push(`Sesi ${labels.length + 1}`);

      if (win === "1") {
        menang.push(durasi);
        kalah.push(null);
      } else if (win === "-1") {
        menang.push(null);
        kalah.push(durasi);
      } else {
        menang.push(null);
        kalah.push(null);
      }
    });

    new Chart(document.getElementById("myChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Menang (detik)",
            data: menang,
            backgroundColor: "rgba(34, 197, 94, 0.7)",
            borderRadius: 6,
          },
          {
            label: "Kalah (detik)",
            data: kalah,
            backgroundColor: "rgba(239, 68, 68, 0.7)",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.dataset.label}: ${context.parsed.y?.toFixed(2)} detik`,
            },
          },
          legend: {
            position: "top",
            labels: {
              font: {
                size: 14,
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Sesi Game",
              font: {
                size: 14,
                weight: "bold",
              },
            },
            ticks: {
              font: {
                size: 12,
              },
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45,
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Durasi Game (detik)",
              font: {
                size: 14,
                weight: "bold",
              },
            },
            ticks: {
              font: {
                size: 12,
              },
            },
          },
        },
      },
    });
  })
  .catch((err) => {
    console.error("CSV error:", err);
    document.getElementById("error").textContent = "Gagal memuat data CSV.";
    document.getElementById("error").classList.remove("hidden");
  });
