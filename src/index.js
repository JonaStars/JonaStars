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
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

// Elemento raíz para React 18
const container = document.getElementById("root");
const root = createRoot(container);

// Función para formatear la fecha UTC con el formato específico requerido
const formatUTCDateTime = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");

  return `Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): ${year}-${month}-${day} ${hours}:${minutes}:${seconds}\nCurrent User's Login: JonaStars\n`;
};

// Remover la pantalla de carga con animación
const removeLoadingScreen = () => {
  const loadingScreen = document.querySelector(".loading-screen");
  if (loadingScreen) {
    loadingScreen.style.opacity = "0";
    loadingScreen.style.transition = "opacity 0.5s ease";
    setTimeout(() => loadingScreen.remove(), 500);
  }
};

// Configuración del tema oscuro
const setDarkTheme = (isDark) => {
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

// Inicializar tema basado en preferencias del sistema
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setDarkTheme(savedTheme === "dark");
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setDarkTheme(true);
  }
};

// Observador de cambios en el tema del sistema
const setupThemeObserver = () => {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      setDarkTheme(event.matches);
    });
};

// Manejo de errores global mejorado
const setupErrorHandling = () => {
  window.onerror = function (message, source, lineno, colno, error) {
    console.error("Error Global:", {
      message,
      source,
      lineno,
      colno,
      error,
      timestamp: new Date().toISOString(),
    });
    return false;
  };

  window.addEventListener("unhandledrejection", function (event) {
    console.error("Promesa no manejada:", {
      reason: event.reason,
      timestamp: new Date().toISOString(),
    });
  });
};

// Actualizar el título con la hora UTC
const updateTitle = () => {
  document.title = `Click Counter & Chat | ${formatUTCDateTime()}`;
};

// Configurar temporizador para actualizar el título
let titleInterval;

// Prevenir el zoom en dispositivos móviles
const preventZoom = () => {
  document.addEventListener("gesturestart", (e) => e.preventDefault());
  document.addEventListener("touchmove", (e) => {
    if (e.scale !== 1) e.preventDefault();
  }, { passive: false });
};

// Configuración del Service Worker para PWA
const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL || ""}/JonaStars/service-worker.js`;
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log("SW registrado:", registration);
          
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                if (window.confirm("Hay una nueva versión disponible. ¿Deseas actualizar?")) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((error) => {
          console.error("Error al registrar el SW:", error);
        });
    });
  }
};

// Configuración de la detección de conexión
const setupConnectivityDetection = () => {
  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine;
    document.body.classList.toggle("offline", !isOnline);
    console.log(isOnline ? "Conexión restaurada." : "Conexión perdida. Trabajando en modo offline.");
  };

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
};

// Inicializar la aplicación
const startApp = () => {
  // Configurar tema
  initializeTheme();
  setupThemeObserver();

  // Configurar manejo de errores
  setupErrorHandling();

  // Iniciar actualización del título
  titleInterval = setInterval(updateTitle, 1000);

  // Configurar prevención de zoom
  preventZoom();

  // Configurar Service Worker
  registerServiceWorker();

  // Configurar detección de conexión
  setupConnectivityDetection();

  // Configurar prevención de cierre accidental
  window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    event.returnValue = "¿Estás seguro de que quieres salir?";
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

  // Remover la pantalla de carga
  removeLoadingScreen();
};

// Limpiar recursos al cerrar
window.addEventListener("beforeunload", () => {
  if (titleInterval) clearInterval(titleInterval);
});

// Iniciar la aplicación
startApp();

// Exportar variables y funciones útiles
export { auth, database, formatUTCDateTime };
