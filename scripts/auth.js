import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFOS6A1Vax6kj_1rIUigaPy9a3OItcEb8",
  authDomain: "chatglobal-and-juegos.firebaseapp.com",
  databaseURL: "https://chatglobal-and-juegos-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chatglobal-and-juegos",
  storageBucket: "chatglobal-and-juegos.firebasestorage.app",
  messagingSenderId: "33316741269",
  appId: "1:33316741269:web:6c1f292fd369d74a6afb9c",
  measurementId: "G-2RSSDJ9DK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const database = getDatabase(app);

document.getElementById('register-button').addEventListener('click', () => {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (username.length > 12) {
        showMessage('El nombre de usuario no puede tener más de 12 caracteres.');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User registered:', user);
            set(ref(database, 'users/' + user.uid), {
                username: username,
                email: email,
                clicks: 0
            });
            showMessage('Te has registrado exitosamente.');
        })
        .catch((error) => {
            console.error('Error registering user:', error);
            showMessage('Error al registrar: ' + error.message);
        });
});

document.getElementById('login-button').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User logged in:', user);
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            loadUserClicks(user.uid);
            showMessage('Te has conectado exitosamente.');
        })
        .catch((error) => {
            console.error('Error logging in user:', error);
            showMessage('Error al iniciar sesión: ' + error.message);
        });
});

document.getElementById('settingsButton').addEventListener('click', () => {
    document.getElementById('settings-fullscreen').style.display = 'flex';
});

document.getElementById('closeSettingsButton').addEventListener('click', () => {
    document.getElementById('settings-fullscreen').style.display = 'none';
});

document.getElementById('logoutButton').addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('User signed out');
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('settings-fullscreen').style.display = 'none';
        showMessage('Te has desconectado exitosamente.');
    }).catch((error) => {
        console.error('Error signing out:', error);
        showMessage('Error al desconectarse: ' + error.message);
    });
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        loadUserClicks(user.uid);
    } else {
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('game-container').style.display = 'none';
    }
});

function loadUserClicks(uid) {
    const dbRef = ref(database);
    get(child(dbRef, `users/${uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            count = userData.clicks || 0;
            document.getElementById('clickCount').textContent = count;
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

function showMessage(message) {
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageContainer.style.display = 'block';
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 3000);
}
