import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  remove,
  update,
  get,
} from "firebase/database";
import Login from "./Login";
import Register from "./Register";
import "./styles.css";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const formatUTCDateTime = () => {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getUTCDate()).padStart(2, "0")} ${String(
    now.getUTCHours()
  ).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}:${String(
    now.getUTCSeconds()
  ).padStart(2, "0")}`;
};

function App() {
  const [user, setUser] = useState(null);
  const [clicks, setClicks] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLogin, setShowLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminColors, setAdminColors] = useState([
    "#FF0000",
    "#00FF00",
    "#0000FF",
  ]);
  const [isRainbowName, setIsRainbowName] = useState(false);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const [clickHistory, setClickHistory] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(formatUTCDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(formatUTCDateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = ref(database, `users/${currentUser.uid}`);
          const snapshot = await get(userRef);
          const userData = snapshot.val() || {};

          const userProfile = {
            ...currentUser,
            username: userData.username || "JonaStars",
            isAdmin: userData.isAdmin || false,
            adminColors: userData.adminColors || [
              "#FF0000",
              "#00FF00",
              "#0000FF",
            ],
            isRainbowName: userData.isRainbowName || false,
          };

          setUser(userProfile);
          setIsAdmin(userData.isAdmin || false);
          setAdminColors(
            userData.adminColors || ["#FF0000", "#00FF00", "#0000FF"]
          );
          setIsRainbowName(userData.isRainbowName || false);

          await update(userRef, {
            lastLoginDate: currentDateTime,
            lastLoginTimestamp: Date.now(),
          });

          const clicksRef = ref(database, `clicks/${currentUser.uid}`);
          const clicksSnapshot = await get(clicksRef);
          setClicks(clicksSnapshot.val() || 0);
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      } else {
        setUser(null);
        setClicks(0);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const messagesRef = ref(database, "messages");
    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data)
          .map(([id, msg]) => ({
            ...msg,
            id,
          }))
          .sort((a, b) => b.sentAt - a.sentAt);
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });

    const leaderboardRef = ref(database, "clicks");
    const unsubscribeLeaderboard = onValue(leaderboardRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        try {
          const scores = await Promise.all(
            Object.entries(data).map(async ([uid, score]) => {
              const userRef = ref(database, `users/${uid}`);
              const userSnapshot = await get(userRef);
              const userData = userSnapshot.val() || {};
              return {
                uid,
                username: userData.username || "JonaStars",
                score,
                isAdmin: userData.isAdmin || false,
                isRainbowName: userData.isRainbowName || false,
                adminColors: userData.adminColors || [
                  "#FF0000",
                  "#00FF00",
                  "#0000FF",
                ],
              };
            })
          );
          setLeaderboard(scores.sort((a, b) => b.score - a.score));
        } catch (error) {
          console.error("Error loading leaderboard:", error);
        }
      } else {
        setLeaderboard([]);
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeLeaderboard();
    };
  }, [user]);

  const handleClick = async () => {
    if (!user) return;
    try {
      const newClicks = clicks + 1;
      setClicks(newClicks);
      await set(ref(database, `clicks/${user.uid}`), newClicks);
    } catch (error) {
      console.error("Error updating clicks:", error);
    }
  };

  const handleAdminActions = {
    toggleRainbowName: async () => {
      if (!isAdmin || !user) return;
      try {
        const newValue = !isRainbowName;
        setIsRainbowName(newValue);
        await update(ref(database, `users/${user.uid}`), {
          isRainbowName: newValue,
        });
      } catch (error) {
        console.error("Error toggling rainbow name:", error);
      }
    },

    updateAdminColor: async (index, color) => {
      if (!isAdmin || !user) return;
      try {
        const newColors = [...adminColors];
        newColors[index] = color;
        setAdminColors(newColors);
        await update(ref(database, `users/${user.uid}`), {
          adminColors: newColors,
        });
      } catch (error) {
        console.error("Error updating admin colors:", error);
      }
    },

    addClicks: async (amount) => {
      if (!isAdmin || !user) return;
      try {
        const newClicks = clicks + amount;
        setClicks(newClicks);
        await set(ref(database, `clicks/${user.uid}`), newClicks);
      } catch (error) {
        console.error("Error adding clicks:", error);
      }
    },

    resetAllClicks: async () => {
      if (!isAdmin) return;
      try {
        await push(ref(database, "clickHistory"), {
          timestamp: currentDateTime,
          scores: leaderboard.map((player) => ({
            username: player.username,
            score: player.score,
          })),
        });
        await set(ref(database, "clicks"), null);
      } catch (error) {
        console.error("Error resetting clicks:", error);
      }
    },

    viewClickHistory: async () => {
      try {
        const historyRef = ref(database, "clickHistory");
        const snapshot = await get(historyRef);
        if (snapshot.exists()) {
          setClickHistory(Object.values(snapshot.val()));
        }
      } catch (error) {
        console.error("Error loading click history:", error);
      }
    },

    clearChat: async () => {
      if (!isAdmin) return;
      try {
        await set(ref(database, "messages"), null);
      } catch (error) {
        console.error("Error clearing chat:", error);
      }
    },

    deleteMessage: async (messageId) => {
      if (!isAdmin) return;
      try {
        await remove(ref(database, `messages/${messageId}`));
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    },
  };

  const toggleAdmin = async (command) => {
    if (!user) return;
    try {
      if (command === "/admin07") {
        setIsAdmin(true);
        await update(ref(database, `users/${user.uid}`), {
          isAdmin: true,
          adminColors,
          isRainbowName: false,
        });
      } else if (command === "/admin07off") {
        setIsAdmin(false);
        await update(ref(database, `users/${user.uid}`), {
          isAdmin: false,
          isRainbowName: false,
        });
      }
      setMessage("");
    } catch (error) {
      console.error("Error toggling admin:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    if (message === "/admin07" || message === "/admin07off") {
      await toggleAdmin(message);
      return;
    }

    try {
      const messagesRef = ref(database, "messages");
      await push(messagesRef, {
        text: message,
        username: user.username,
        uid: user.uid,
        timestamp: currentDateTime,
        sentAt: Date.now(),
        isAdmin,
        isRainbowName,
        adminColors,
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        {showLogin ? (
          <Login setShowLogin={setShowLogin} />
        ) : (
          <Register setShowLogin={setShowLogin} />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="cmd-title-bar">
        <span className="cmd-title">
          Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted):{" "}
          {currentDateTime}
          <br />
          Current User's Login: {user.username}
        </span>
        <div className="cmd-controls">
          <button className="cmd-button cmd-minimize"></button>
          <button className="cmd-button cmd-maximize"></button>
          <button
            className="cmd-button cmd-close"
            onClick={() => auth.signOut()}
          ></button>
        </div>
      </div>

      <div className="app">
        <div className="game-section section-container">
          <h1>Contador de Clicks</h1>
          <p className="user-info">
            {isRainbowName ? (
              <span className="rainbow-name">{user.username}</span>
            ) : (
              <span
                style={
                  isAdmin
                    ? {
                        background: `linear-gradient(90deg, ${adminColors.join(
                          ", "
                        )})`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }
                    : undefined
                }
              >
                {user.username}
              </span>
            )}
            {isAdmin && " 👑"}
          </p>
          <p className="clicks-display">Clicks: {clicks.toLocaleString()}</p>
          <button onClick={handleClick} className="click-button">
            ¡Click!
          </button>
        </div>

        {isAdmin && (
          <div className="admin-controls section-container">
            <h3>Panel de Admin</h3>
            <div className="admin-color-controls">
              <div className="color-picker-container">
                {adminColors.map((color, index) => (
                  <input
                    key={index}
                    type="color"
                    value={color}
                    onChange={(e) =>
                      handleAdminActions.updateAdminColor(index, e.target.value)
                    }
                    className="color-picker"
                  />
                ))}
              </div>
              <button
                className="rainbow-name-toggle"
                onClick={handleAdminActions.toggleRainbowName}
              >
                {isRainbowName ? "Desactivar" : "Activar"} Rainbow
              </button>
            </div>
            <div className="admin-buttons">
              <button onClick={() => handleAdminActions.addClicks(100)}>
                +100 Clicks
              </button>
              <button onClick={handleAdminActions.clearChat}>
                Limpiar Chat
              </button>
              <button
                className="danger-button"
                onClick={() => {
                  if (
                    window.confirm(
                      "¿Estás seguro de que quieres resetear todos los clicks?"
                    )
                  ) {
                    handleAdminActions.resetAllClicks();
                  }
                }}
              >
                Resetear Clicks
              </button>
              <button onClick={handleAdminActions.viewClickHistory}>
                Ver Historial
              </button>
            </div>
          </div>
        )}

        <div className="leaderboard-section section-container">
          <div className="leaderboard-header">
            <h2>Top Jugadores</h2>
            <button
              onClick={() => setShowFullLeaderboard(!showFullLeaderboard)}
            >
              {showFullLeaderboard ? "Volver" : "Ver Top 500"}
            </button>
          </div>

          {!showFullLeaderboard ? (
            <div className="leaderboard-list">
              {leaderboard.slice(0, 10).map((player, index) => (
                <div key={player.uid} className="leaderboard-item">
                  <span className="rank">#{index + 1}</span>
                  <span
                    className={`username ${
                      player.isRainbowName ? "rainbow-name" : ""
                    }`}
                    style={
                      player.isAdmin && !player.isRainbowName
                        ? {
                            background: `linear-gradient(90deg, ${player.adminColors.join(
                              ", "
                            )})`,
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                          }
                        : null
                    }
                  >
                    {player.username}
                    {player.isAdmin && " 👑"}
                  </span>
                  <span className="score">{player.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="full-leaderboard">
              <div className="leaderboard-grid">
                {leaderboard.slice(0, 500).map((player, index) => (
                  <div key={player.uid} className="leaderboard-grid-item">
                    <span className="rank">#{index + 1}</span>
                    <span
                      className={`username ${
                        player.isRainbowName ? "rainbow-name" : ""
                      }`}
                      style={
                        player.isAdmin && !player.isRainbowName
                          ? {
                              background: `linear-gradient(90deg, ${player.adminColors.join(
                                ", "
                              )})`,
                              WebkitBackgroundClip: "text",
                              backgroundClip: "text",
                              color: "transparent",
                            }
                          : null
                      }
                    >
                      {player.username}
                      {player.isAdmin && " 👑"}
                    </span>
                    <span className="score">
                      {player.score.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {clickHistory.length > 0 && (
          <div className="history-modal">
            <div className="history-content">
              <h3>Historial de Records</h3>
              <button
                className="close-button"
                onClick={() => setClickHistory([])}
              >
                ×
              </button>
              <div className="history-list">
                {clickHistory
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((record, index) => (
                    <div key={index} className="history-entry">
                      <div className="history-date">{record.timestamp}</div>
                      <div className="history-scores">
                        {record.scores
                          .sort((a, b) => b.score - a.score)
                          .slice(0, 10)
                          .map((score, idx) => (
                            <div key={idx} className="history-score">
                              #{idx + 1} {score.username}:{" "}
                              {score.score.toLocaleString()}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        <div className="chat-section section-container">
          <h2>Chat Global</h2>
          <div className="chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.isAdmin ? "admin-message" : ""}`}
              >
                <div className="message-header">
                  <strong
                    className={msg.isRainbowName ? "rainbow-name" : ""}
                    style={
                      msg.isAdmin && !msg.isRainbowName
                        ? {
                            background: `linear-gradient(90deg, ${msg.adminColors.join(
                              ", "
                            )})`,
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                          }
                        : null
                    }
                  >
                    {msg.username}
                    {msg.isAdmin && " 👑"}:
                  </strong>
                  <span className="message-timestamp">{msg.timestamp}</span>
                </div>
                <span className="message-text">{msg.text}</span>
                {isAdmin && (
                  <button
                    className="delete-message-button"
                    onClick={() => handleAdminActions.deleteMessage(msg.id)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="chat-input-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="chat-input"
            />
            <button type="submit" className="send-button">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
