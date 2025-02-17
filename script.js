document.addEventListener("DOMContentLoaded", () => {
  // Variables globales
  let clickCount = 0;
  const currentUser = "JonaStars";
  let topPlayers = [
    { user: currentUser, clicks: 0, lastUpdate: "2025-02-17 06:15:07" },
  ];

  // Elementos del DOM
  const clickButton = document.getElementById("clickButton");
  const clickCountDisplay = document.getElementById("clickCount");
  const topButton = document.getElementById("topButton");
  const modal = document.getElementById("topModal");
  const closeModal = document.getElementById("closeModal");
  const topTableBody = document.getElementById("topTableBody");
  const updateTimeDisplay = document.getElementById("updateTime");
  const clubButton = document.getElementById("clubButton");

  // Actualizar la hora
  function updateCurrentTime() {
    const now = new Date();
    return now.toISOString().replace("T", " ").split(".")[0];
  }

  // Contador de clicks
  clickButton.addEventListener("click", () => {
    clickCount++;
    clickCountDisplay.textContent = clickCount;
    updateTopPlayers();
  });

  // Función para actualizar top players
  function updateTopPlayers() {
    const currentTime = updateCurrentTime();
    const existingPlayer = topPlayers.find((p) => p.user === currentUser);
    if (existingPlayer) {
      existingPlayer.clicks = clickCount;
      existingPlayer.lastUpdate = currentTime;
    } else {
      topPlayers.push({
        user: currentUser,
        clicks: clickCount,
        lastUpdate: currentTime,
      });
    }

    // Ordenar por número de clicks
    topPlayers.sort((a, b) => b.clicks - a.clicks);
    updateTimeDisplay.textContent = currentTime;
  }

  // Función para mostrar la tabla de top players
  function displayTopPlayers() {
    topTableBody.innerHTML = "";
    topPlayers.forEach((player, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.user}</td>
                <td>${player.clicks}</td>
                <td>${player.lastUpdate}</td>
            `;
      topTableBody.appendChild(row);
    });
  }

  // Event listeners para el modal
  topButton.addEventListener("click", () => {
    displayTopPlayers();
    modal.classList.add("active");
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(`Error al intentar pantalla completa: ${err.message}`);
    });
  });

  closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  });

  // Event listener para el botón Club
  clubButton.addEventListener("click", () => {
    alert("¡Función del Club próximamente!");
  });

  // Inicializar la hora de actualización
  updateTimeDisplay.textContent = updateCurrentTime();
});
