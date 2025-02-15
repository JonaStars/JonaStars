:root {
  --cmd-bg: #1e1e1e;
  --cmd-text: #00ff00;
  --cmd-border: #363636;
  --cmd-accent: #4d4d4d;
  --admin-gradient: linear-gradient(90deg, #ff0000, #00ff00, #0000ff);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Consolas", monospace;
}

body {
  background-color: var(--cmd-bg);
  color: var(--cmd-text);
  min-height: 100vh;
  overflow-x: hidden;
}

/* Barra de título con formato UTC */
.cmd-title-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  border-bottom: 1px solid var(--cmd-border);
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 255, 0, 0.1);
}

.cmd-title {
  font-family: "Consolas", monospace;
  font-size: 14px;
  color: var(--cmd-text);
  white-space: pre-line;
  line-height: 1.4;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
}

.cmd-controls {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
}

.cmd-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.cmd-button:hover {
  transform: scale(1.2);
}

.cmd-minimize {
  background-color: #ffb900;
}
.cmd-maximize {
  background-color: #00ca4e;
}
.cmd-close {
  background-color: #ff605c;
}

/* Layout principal */
.app {
  max-width: 1200px;
  margin: 80px auto 20px;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* Contenedor de autenticación */
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.auth-form {
  background: rgba(40, 40, 40, 0.95);
  border: 1px solid var(--cmd-text);
  border-radius: 8px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.1);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-form h2 {
  color: var(--cmd-text);
  text-align: center;
  margin-bottom: 25px;
  font-size: 24px;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.auth-form input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid var(--cmd-border);
  border-radius: 4px;
  color: var(--cmd-text);
  transition: all 0.3s ease;
}

.auth-form input:focus {
  outline: none;
  border-color: var(--cmd-text);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
  background: rgba(0, 255, 0, 0.1);
}

.auth-form button {
  width: 100%;
  padding: 12px;
  background: var(--cmd-text);
  color: var(--cmd-bg);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.auth-form button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.4);
}

.auth-form .error-message {
  color: #ff4444;
  margin-bottom: 15px;
  text-align: center;
}

.switch-form {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--cmd-border);
}

.switch-form p {
  color: var(--cmd-text);
  margin-bottom: 10px;
}

.switch-form button {
  background: transparent;
  color: var(--cmd-text);
  border: 1px solid var(--cmd-text);
  padding: 8px 20px;
  margin: 0;
  font-size: 14px;
}

.switch-form button:hover {
  background: rgba(0, 255, 0, 0.1);
}

/* Secciones */
.section-container {
  background: rgba(40, 40, 40, 0.95);
  border: 1px solid var(--cmd-border);
  border-radius: 8px;
  padding: 20px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 6px rgba(0, 255, 0, 0.1);
  transition: transform 0.3s ease;
}

.section-container:hover {
  transform: translateY(-2px);
}

/* Sección del juego */
.game-section {
  text-align: center;
}

.user-info {
  margin: 15px 0;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.clicks-display {
  font-size: 2em;
  margin: 20px 0;
  text-shadow: 0 0 10px var(--cmd-text);
}

.click-button {
  padding: 15px 30px;
  font-size: 1.2rem;
  background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
  color: var(--cmd-text);
  border: 1px solid var(--cmd-text);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px var(--cmd-text);
}

.click-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px var(--cmd-text);
}

/* Leaderboard */
.leaderboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-full-leaderboard {
  background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
  color: var(--cmd-text);
  border: 1px solid var(--cmd-text);
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px var(--cmd-text);
}

.view-full-leaderboard:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.2);
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: rgba(0, 255, 0, 0.05);
  margin: 5px 0;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.leaderboard-item:hover {
  transform: translateX(5px);
  background: rgba(0, 255, 0, 0.1);
}

/* Chat */
.chat-section {
  grid-column: 1 / -1;
}

.chat-messages {
  height: 400px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid var(--cmd-border);
  border-radius: 8px;
  margin: 10px 0;
}

.message {
  padding: 10px;
  margin: 5px 0;
  background: rgba(0, 255, 0, 0.05);
  border-radius: 6px;
  position: relative;
  transition: background 0.2s ease;
}

.message:hover {
  background: rgba(0, 255, 0, 0.1);
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.chat-input-form {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.chat-input {
  flex: 1;
  padding: 10px;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid var(--cmd-border);
  border-radius: 4px;
  color: var(--cmd-text);
  transition: all 0.3s ease;
}

.chat-input:focus {
  outline: none;
  border-color: var(--cmd-text);
  box-shadow: 0 0 5px var(--cmd-text);
}

.send-button {
  padding: 10px 20px;
  background: var(--cmd-text);
  color: var(--cmd-bg);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-button:hover {
  transform: translateX(2px);
  box-shadow: 0 0 10px var(--cmd-text);
}

/* Efectos especiales */
.rainbow-name {
  background: linear-gradient(
    to right,
    red,
    orange,
    yellow,
    green,
    blue,
    indigo,
    violet
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: rainbow 5s linear infinite;
}

@keyframes rainbow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

/* Admin Panel */
.admin-controls {
  padding: 15px;
  border: 1px solid var(--cmd-text);
}

.admin-color-controls {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.color-picker {
  width: 50px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.admin-buttons {
  display: flex;
  gap: 10px;
}

.admin-button {
  padding: 8px 15px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid var(--cmd-text);
  color: var(--cmd-text);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.danger-button {
  border-color: #ff0000;
  color: #ff0000;
}

/* Responsive */
@media (max-width: 768px) {
  .app {
    grid-template-columns: 1fr;
    padding: 10px;
    margin-top: 100px;
  }

  .cmd-title {
    font-size: 12px;
  }

  .admin-buttons {
    flex-direction: column;
  }

  .cmd-title-bar {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }

  .cmd-controls {
    position: static;
    transform: none;
    margin-top: 10px;
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--cmd-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--cmd-text);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #00cc00;
}
