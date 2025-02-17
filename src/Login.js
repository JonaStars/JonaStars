import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login({ setShowLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>
        ¿No tienes cuenta?{" "}
        <button onClick={() => setShowLogin(false)} className="link-button">
          Regístrate
        </button>
      </p>
    </div>
  );
}

export default Login;
