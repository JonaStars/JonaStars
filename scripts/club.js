import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, get, child, set, update, push, remove, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const auth = getAuth();
const database = getDatabase();

document.getElementById('clubButton').addEventListener('click', () => {
    const user = auth.currentUser;
    if (user) {
        checkUserClub(user.uid);
    } else {
        alert('Please log in to access the Club.');
    }
});

document.getElementById('closeClubButton').addEventListener('click', () => {
    document.getElementById('club-fullscreen').style.display = 'none';
});

document.getElementById('searchClubButton').addEventListener('click', () => {
    const searchQuery = document.getElementById('clubSearchInput').value;
    searchClubs(searchQuery);
});

document.getElementById('createClubButton').addEventListener('click', () => {
    document.getElementById('create-club-fullscreen').style.display = 'flex';
});

document.getElementById('closeCreateClubButton').addEventListener('click', () => {
    document.getElementById('create-club-fullscreen').style.display = 'none';
});

document.getElementById('confirmCreateClubButton').addEventListener('click', () => {
    const clubName = document.getElementById('newClubNameInput').value;
    createClub(clubName);
});

document.getElementById('closeClubChatButton').addEventListener('click', () => {
    document.getElementById('club-chat-fullscreen').style.display = 'none';
});

document.getElementById('sendChatMessageButton').addEventListener('click', () => {
    const message = document.getElementById('clubChatInput').value;
    sendChatMessage(message);
});

document.getElementById('editDescriptionButton').addEventListener('click', () => {
    document.getElementById('editDescriptionTextarea').style.display = 'block';
    document.getElementById('saveDescriptionButton').style.display = 'block';
    document.getElementById('editDescriptionButton').style.display = 'none';
});

document.getElementById('saveDescriptionButton').addEventListener('click', () => {
    const newDescription = document.getElementById('editDescriptionTextarea').value;
    if (newDescription.length > 50) {
        alert('La descripción no puede tener más de 50 caracteres.');
        return;
    }
    saveClubDescription(newDescription);
});

document.getElementById('leaveClubButton').addEventListener('click', () => {
    document.getElementById('confirm-leave-club').style.display = 'flex';
});

document.getElementById('confirmLeaveButton').addEventListener('click', () => {
    leaveClub();
    document.getElementById('confirm-leave-club').style.display = 'none';
});

document.getElementById('cancelLeaveButton').addEventListener('click', () => {
    document.getElementById('confirm-leave-club').style.display = 'none';
});

document.getElementById('closeClubProfileButton').addEventListener('click', () => {
    document.getElementById('club-profile-fullscreen').style.display = 'none';
});

document.getElementById('joinClubButton').addEventListener('click', () => {
    joinClub();
});

document.getElementById('viewMembersButton').addEventListener('click', () => {
    document.getElementById('clubMembersListFullscreen').style.display = 'flex';
});

document.getElementById('closeMembersListButton').addEventListener('click', () => {
    document.getElementById('clubMembersListFullscreen').style.display = 'none';
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
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
});

function checkUserClub(uid) {
    const dbRef = ref(database);
    get(child(dbRef, `users/${uid}/club`)).then((snapshot) => {
        if (snapshot.exists()) {
            const clubId = snapshot.val();
            loadClubChat({ id: clubId });
        } else {
            loadClubList();
            document.getElementById('club-fullscreen').style.display = 'flex';
        }
    }).catch((error) => {
        console.error(error);
    });
}

function loadClubList() {
    const dbRef = ref(database);
    get(child(dbRef, 'clubs')).then((snapshot) => {
        if (snapshot.exists()) {
            const clubs = snapshot.val();
            const clubList = document.getElementById('clubList');
            clubList.innerHTML = '';
            Object.values(clubs).forEach(club => {
                const li = document.createElement('li');
                li.textContent = club.name;
                li.addEventListener('click', () => {
                    loadClubProfile(club);
                });
                clubList.appendChild(li);
            });
        } else {
            console.log("No clubs available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

function searchClubs(query) {
    const dbRef = ref(database);
    get(child(dbRef, 'clubs')).then((snapshot) => {
        if (snapshot.exists()) {
            const clubs = snapshot.val();
            const clubList = document.getElementById('clubList');
            clubList.innerHTML = '';
            Object.values(clubs).filter(club => club.name.includes(query)).forEach(club => {
                const li = document.createElement('li');
                li.textContent = club.name;
                li.addEventListener('click', () => {
                    loadClubProfile(club);
                });
                clubList.appendChild(li);
            });
        } else {
            console.log("No clubs available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

function createClub(name) {
    const user = auth.currentUser;
    if (user) {
        const clubId = push(ref(database, 'clubs')).key;
        set(ref(database, 'clubs/' + clubId), {
            name: name,
            owner: user.uid,
            description: 'No hay descripción',
            members: {
                [user.uid]: true
            }
        }).then(() => {
            update(ref(database, 'users/' + user.uid), {
                club: clubId
            });
            alert('Club created successfully');
            document.getElementById('create-club-fullscreen').style.display = 'none';
            loadClubChat({ id: clubId });
        }).catch((error) => {
            console.error('Error creating club:', error);
        });
    } else {
        alert('Please log in to create a club.');
    }
}

function loadClubChat(club) {
    document.getElementById('clubName').textContent = club.name;
    document.getElementById('clubDescription').textContent = club.description || 'No hay descripción';
    document.getElementById('club-chat-fullscreen').style.display = 'flex';

    const user = auth.currentUser;
    if (user && user.uid === club.owner) {
        document.getElementById('editDescriptionButton').style.display = 'block';
    } else {
        document.getElementById('editDescriptionButton').style.display = 'none';
    }

    const dbRef = ref(database, 'clubs/' + club.id + '/chat');
    onChildAdded(dbRef, (data) => {
        const message = data.val();
        const chatList = document.getElementById('clubChatList');
        const li = document.createElement('li');
        li.classList.add('chat-bubble');
        li.innerHTML = `<strong>${message.username}:</strong> ${message.text}`;
        if (message.type === 'welcome') {
            li.classList.add('welcome-message');
        }
        chatList.appendChild(li);
    });

    loadClubMembers(club.id);
}

function loadClubProfile(club) {
    document.getElementById('clubProfileName').textContent = club.name;
    document.getElementById('clubProfileDescription').textContent = club.description || 'No hay descripción';
    document.getElementById('clubProfileMembers').textContent = `Miembros: ${Object.keys(club.members).length}`;
    get(child(ref(database), `users/${club.owner}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const ownerData = snapshot.val();
            document.getElementById('clubProfilePresident').textContent = `Presidente: ${ownerData.username}`;
        }
    }).catch((error) => {
        console.error(error);
    });
    document.getElementById('club-profile-fullscreen').style.display = 'flex';
    document.getElementById('joinClubButton').dataset.clubId = club.id;

    loadClubProfileMembers(club);
}

function loadClubProfileMembers(club) {
    const dbRef = ref(database, 'clubs/' + club.id + '/members');
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const members = snapshot.val();
            const membersList = document.getElementById('clubProfileMembersList');
            membersList.innerHTML = '';
            Object.keys(members).forEach(memberId => {
                get(child(ref(database), `users/${memberId}`)).then((userSnapshot) => {
                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.val();
                        const li = document.createElement('li');
                        li.textContent = userData.username;
                        const role = memberId === club.owner ? 'Presidente' : 'Miembro';
                        const roleSpan = document.createElement('span');
                        roleSpan.textContent = ` (${role})`;
                        li.appendChild(roleSpan);
                        membersList.appendChild(li);
                    }
                }).catch((error) => {
                    console.error(error);
                });
            });
        } else {
            console.log("No members available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

function sendChatMessage(message) {
    const user = auth.currentUser;
    if (user) {
        const clubId = document.getElementById('clubName').dataset.clubId;
        const dbRef = ref(database, 'clubs/' + clubId + '/chat');
        push(dbRef, {
            username: user.displayName,
            text: message
        }).then(() => {
            document.getElementById('clubChatInput').value = '';
        }).catch((error) => {
            console.error('Error sending chat message:', error);
        });
    } else {
        alert('Please log in to send a message.');
    }
}

function saveClubDescription(description) {
    const user = auth.currentUser;
    if (user) {
        const clubId = document.getElementById('clubName').dataset.clubId;
        update(ref(database, 'clubs/' + clubId), {
            description: description || 'No hay descripción'
        }).then(() => {
            document.getElementById('clubDescription').textContent = description || 'No hay descripción';
            document.getElementById('editDescriptionTextarea').style.display = 'none';
            document.getElementById('saveDescriptionButton').style.display = 'none';
            document.getElementById('editDescriptionButton').style.display = 'block';
        }).catch((error) => {
            console.error('Error saving club description:', error);
        });
    } else {
        alert('Please log in to save the description.');
    }
}

function loadClubMembers(clubId) {
    const dbRef = ref(database, 'clubs/' + clubId + '/members');
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const members = snapshot.val();
            const membersList = document.getElementById('clubMembersList');
            const membersListFullscreen = document.getElementById('clubMembersListFullscreen');
            membersList.innerHTML = '';
            membersListFullscreen.innerHTML = '';
            Object.keys(members).forEach(memberId => {
                get(child(ref(database), `users/${memberId}`)).then((userSnapshot) => {
                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.val();
                        const li = document.createElement('li');
                        li.textContent = userData.username;
                        const liFullscreen = document.createElement('li');
                        liFullscreen.textContent = userData.username;
                        if (auth.currentUser.uid === club.owner && memberId !== club.owner) {
                            const expelButton = document.createElement('button');
                            expelButton.textContent = 'Expulsar';
                            expelButton.addEventListener('click', () => {
                                expelMember(clubId, memberId);
                            });
                            li.appendChild(expelButton);
                        }
                        membersList.appendChild(li);
                        membersListFullscreen.appendChild(liFullscreen);
                    }
                }).catch((error) => {
                    console.error(error);
                });
            });
        } else {
            console.log("No members available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

function expelMember(clubId, memberId) {
    const dbRef = ref(database, 'clubs/' + clubId + '/members/' + memberId);
    remove(dbRef).then(() => {
        alert('Member expelled successfully');
        loadClubMembers(clubId);
    }).catch((error) => {
        console.error('Error expelling member:', error);
    });
}

function leaveClub() {
    const user = auth.currentUser;
    if (user) {
        const clubId = document.getElementById('clubName').dataset.clubId;
        update(ref(database, 'users/' + user.uid), {
            club: null
        }).then(() => {
            remove(ref(database, 'clubs/' + clubId + '/members/' + user.uid)).then(() => {
                document.getElementById('club-fullscreen').style.display = 'none';
                document.getElementById('club-chat-fullscreen').style.display = 'none';
            }).catch((error) => {
                console.error('Error leaving club:', error);
            });
        }).catch((error) => {
            console.error('Error updating user:', error);
        });
    } else {
        alert('Please log in to leave the club.');
    }
}

function joinClub() {
    const user = auth.currentUser;
    if (user) {
        const clubId = document.getElementById('joinClubButton').dataset.clubId;
        update(ref(database, 'users/' + user.uid), {
            club: clubId
        }).then(() => {
            update(ref(database, 'clubs/' + clubId + '/members'), {
                [user.uid]: true
            }).then(() => {
                const welcomeMessage = `Bienvenido ${user.displayName}`;
                push(ref(database, 'clubs/' + clubId + '/chat'), {
                    username: 'System',
                    text: welcomeMessage,
                    type: 'welcome'
                });
                document.getElementById('club-profile-fullscreen').style.display = 'none';
                loadClubChat({ id: clubId });
            }).catch((error) => {
                console.error('Error joining club:', error);
            });
        }).catch((error) => {
            console.error('Error updating user:', error);
        });
    } else {
        alert('Please log in to join the club.');
    }
}
