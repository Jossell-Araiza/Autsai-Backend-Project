import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';

const app = initializeApp(window.firebaseConfig);
const auth = getAuth(app);

function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      document.getElementById('auth-status').innerText = `Registered! UID: ${userCredential.user.uid}`;
      showMessaging();
    })
    .catch(error => {
      document.getElementById('auth-status').innerText = `Error: ${error.message}`;
    });
}

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      document.getElementById('auth-status').innerText = `Logged in! UID: ${userCredential.user.uid}`;
      showMessaging();
    })
    .catch(error => {
      document.getElementById('auth-status').innerText = `Error: ${error.message}`;
    });
}

function logout() {
  signOut(auth)
    .then(() => {
      document.getElementById('auth-status').innerText = 'Logged out';
      document.getElementById('auth-section').style.display = 'block';
      document.getElementById('messaging-section').style.display = 'none';
      document.getElementById('profile-section').style.display = 'none';
      document.getElementById('message').value = '';
      document.getElementById('receiverId').value = '';
      document.getElementById('displayName').value = '';
      document.getElementById('messages').innerHTML = '';
      document.getElementById('profile-status').innerText = '';
    })
    .catch(error => {
      document.getElementById('auth-status').innerText = `Error: ${error.message}`;
    });
}

function showMessaging() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('messaging-section').style.display = 'block';
  document.getElementById('profile-section').style.display = 'block';
}

async function sendMessage() {
  const senderId = auth.currentUser.uid;
  const receiverId = document.getElementById('receiverId').value;
  const content = document.getElementById('message').value;
  try {
    const response = await fetch('/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, receiverId, content })
    });
    const result = await response.json();
    if (response.ok) {
      document.getElementById('message').value = '';
      fetchMessages(senderId, receiverId);
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function fetchMessages(senderId, receiverId) {
  try {
    const response = await fetch(`/messages/conversations/${senderId}/${receiverId}`);
    const result = await response.json();
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = result.messages.map(msg => 
      `<p><strong>${msg.senderId}:</strong> ${msg.content} <em>(${new Date(msg.timestamp).toLocaleString()})</em></p>`
    ).join('');
  } catch (error) {
    alert(`Error fetching messages: ${error.message}`);
  }
}

async function updateProfile() {
  const displayName = document.getElementById('displayName').value;
  try {
    const response = await fetch('/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: auth.currentUser.uid, displayName })
    });
    const result = await response.json();
    if (response.ok) {
      document.getElementById('profile-status').innerText = 'Profile updated!';
    } else {
      document.getElementById('profile-status').innerText = `Error: ${result.error}`;
    }
  } catch (error) {
    document.getElementById('profile-status').innerText = `Error: ${error.message}`;
  }
}

async function deleteAccount() {
  if (confirm('Are you sure you want to delete your account?')) {
    try {
      const response = await fetch('/auth/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: auth.currentUser.uid })
      });
      const result = await response.json();
      if (response.ok) {
        document.getElementById('auth-status').innerText = 'Account deleted!';
        document.getElementById('profile-status').innerText = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('messaging-section').style.display = 'none';
        document.getElementById('profile-section').style.display = 'none';
      } else {
        document.getElementById('profile-status').innerText = `Error: ${result.error}`;
      }
    } catch (error) {
      document.getElementById('profile-status').innerText = `Error: ${error.message}`;
    }
  }
}

window.register = register;
window.login = login;
window.logout = logout;
window.sendMessage = sendMessage;
window.updateProfile = updateProfile;
window.deleteAccount = deleteAccount;