import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDFOS6A1Vax6kj_1rIUigaPy9a3OItcEb8",
  authDomain: "chatglobal-and-juegos.firebaseapp.com",
  databaseURL:
    "https://chatglobal-and-juegos-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chatglobal-and-juegos",
  storageBucket: "chatglobal-and-juegos.firebasestorage.app",
  messagingSenderId: "33316741269",
  appId: "1:33316741269:web:6c1f292fd369d74a6afb9c",
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Elemento raíz para React 18
const container = document.getElementById("root");
const root = createRoot(container);

// Función para formatear la fecha UTC con el formato específico requerido
const formatUTCDateTime = () => {
  const now = new Date();
  const formatted = `Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): ${now.getUTCFullYear()}-${String(
    now.getUTCMonth() + 1
  ).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")} ${String(
    now.getUTCHours()
  ).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}:${String(
    now.getUTCSeconds()
  ).padStart(2, "0")}\nCurrent User's Login: JonaStars\n`;

  return formatted;
};

// Remover la pantalla de carga
const loadingScreen = document.querySelector(".loading-screen");
if (loadingScreen) {
  loadingScreen.style.opacity = "0";
  setTimeout(() => loadingScreen.remove(), 500);
}

// Configuración del tema oscuro
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  document.documentElement.setAttribute("data-theme", "dark");
}

// Observador de cambios en el tema del sistema
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    document.documentElement.setAttribute(
      "data-theme",
      event.matches ? "dark" : "light"
    );
  });

// Manejo de errores global
window.onerror = function (message, source, lineno, colno, error) {
  console.error("Error Global:", { message, source, lineno, colno, error });
  return false;
};

// Actualizar el título con la hora UTC
const updateTitle = () => {
  document.title = `Click Counter & Chat | ${formatUTCDateTime()}`;
};

// Actualizar el título cada segundo
const titleInterval = setInterval(updateTitle, 1000);

// Prevenir el zoom en dispositivos móviles
document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

// Renderizar la aplicación
root.render(
  <React.StrictMode>
    <App
      auth={auth}
      database={database}
      formatUTCDateTime={formatUTCDateTime}
    />
  </React.StrictMode>
);

// Service Worker para PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registrado:", registration);
      })
      .catch((registrationError) => {
        console.log("SW registro fallido:", registrationError);
      });
  });
}

// Función de limpieza para evitar memory leaks
window.addEventListener("beforeunload", () => {
  clearInterval(titleInterval);
});

// Detección de conexión
window.addEventListener("online", function () {
  document.body.classList.remove("offline");
});

window.addEventListener("offline", function () {
  document.body.classList.add("offline");
});

// Prevenir el cierre accidental
window.addEventListener("beforeunload", (event) => {
  event.preventDefault();
  event.returnValue = "¿Estás seguro de que quieres salir?";
});

// Manejo de actualizaciones de la PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (
      window.confirm("Hay una nueva versión disponible. ¿Deseas actualizar?")
    ) {
      window.location.reload();
    }
  });
}

// Exportar variables y funciones útiles
export { auth, database, formatUTCDateTime };
