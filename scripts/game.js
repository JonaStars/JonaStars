import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, update, get, child } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const auth = getAuth();
const database = getDatabase();

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

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserClicks(user.uid);
    }
});
