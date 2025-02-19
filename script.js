import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('User registered:', user);
            // Save the username to the user's profile or database
            set(ref(database, 'users/' + user.uid), {
                username: username,
                email: email,
                clicks: 0
            });
        })
        .catch((error) => {
            console.error('Error registering user:', error);
        });
});

document.getElementById('login-button').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('User logged in:', user);
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            loadUserClicks(user.uid);
        })
        .catch((error) => {
            console.error('Error logging in user:', error);
        });
});

document.getElementById('logoutButton').addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('User signed out');
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('game-container').style.display = 'none';
    }).catch((error) => {
        console.error('Error signing out:', error);
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

let count = 0;

document.getElementById('clickButton').addEventListener('click', () => {
    count++;
    document.getElementById('clickCount').textContent = count;
    const user = auth.currentUser;
    if (user) {
        update(ref(database, 'users/' + user.uid), {
            clicks: count
        });
    }
});

document.getElementById('leaderboardButton').addEventListener('click', () => {
    const dbRef = ref(database);
    get(child(dbRef, 'users')).then((snapshot) => {
        if (snapshot.exists()) {
            const users = snapshot.val();
            const leaderboard = Object.values(users)
                .filter(user => user.clicks > 1)
                .sort((a, b) => b.clicks - a.clicks)
                .slice(0, 100);
            
            const leaderboardList = document.getElementById('leaderboardList');
            leaderboardList.innerHTML = '';
            leaderboard.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.username}: ${user.clicks} clicks`;
                leaderboardList.appendChild(li);
            });

            document.getElementById('leaderboard-fullscreen').style.display = 'flex';
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
});

document.getElementById('closeLeaderboardButton').addEventListener('click', () => {
    document.getElementById('leaderboard-fullscreen').style.display = 'none';
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
