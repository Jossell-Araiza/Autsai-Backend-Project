import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';

const app = initializeApp(window.firebaseConfig);
const auth = getAuth(app);

function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (!email || !password) return alert('Missing email or password');
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      document.getElementById(
        'auth-status'
      ).innerText = `Registered! UID: ${userCredential.user.uid}`;
      showMessaging();
    })
    .catch((error) => {
      document.getElementById(
        'auth-status'
      ).innerText = `Error: ${error.message}`;
    });
}

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (!email || !password) return alert('Missing email or password');
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      document.getElementById(
        'auth-status'
      ).innerText = `Logged in! UID: ${userCredential.user.uid}`;
      showMessaging();
      displayCurrentName(); // Fetch and show current displayName
    })
    .catch((error) => {
      document.getElementById(
        'auth-status'
      ).innerText = `Error: ${error.message}`;
    });
}

function displayCurrentName() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    console.log('Current user displayName:', currentUser.displayName); // Debug
    document.getElementById(
      'current-display-name'
    ).innerText = `Current Name: ${currentUser.displayName || 'None set'}`;
  }
}

function logout() {
  signOut(auth)
    .then(() => {
      document.getElementById('auth-status').innerText = 'Logged out';
      document.getElementById('auth-section').style.display = 'block';
      document.getElementById('messaging-section').style.display = 'none';
      document.getElementById('profile-section').style.display = 'none';
      document.getElementById('group-section').style.display = 'none';
      clearFields();
    })
    .catch((error) => {
      document.getElementById(
        'auth-status'
      ).innerText = `Error: ${error.message}`;
    });
}

function clearFields() {
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  document.getElementById('message').value = '';
  document.getElementById('receiverId').value = '';
  document.getElementById('displayName').value = '';
  document.getElementById('messages').innerHTML = '';
  document.getElementById('profile-status').innerText = '';
  document.getElementById('groupName').value = '';
  document.getElementById('groupUserIds').value = '';
  document.getElementById('groupId').value = '';
  document.getElementById('groupMessage').value = '';
  document.getElementById('group-messages').innerHTML = '';
  document.getElementById('group-status').innerText = '';
  document.getElementById('addUserId').value = '';
  document.getElementById('removeUserId').value = '';
  document.getElementById('replyToId').value = '';
  document.getElementById('groupReplyToId').value = '';
}

function showMessaging() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('messaging-section').style.display = 'block';
  document.getElementById('profile-section').style.display = 'block';
  document.getElementById('group-section').style.display = 'block';
}

async function sendMessage() {
  const senderId = auth.currentUser.uid;
  const receiverId = document.getElementById('receiverId').value;
  const content = document.getElementById('message').value;
  const replyToId = document.getElementById('replyToId').value || null;
  if (!receiverId || !content) return alert('Missing receiver or message');
  try {
    const response = await fetch('/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, receiverId, content, replyToId }),
    });
    const result = await response.json();
    if (response.ok) {
      document.getElementById('message').value = '';
      document.getElementById('replyToId').value = '';
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
    console.log('Fetching messages for:', senderId, receiverId);
    const response = await fetch(
      `/messages/conversations/${senderId}/${receiverId}`
    );
    console.log('Fetch response status:', response.status);
    const result = await response.json();
    console.log('Fetch result:', result);
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = result.messages
      .map(
        (msg) =>
          `<p>ID: ${msg.id} <strong>${msg.senderId}:</strong> ${msg.content} ${
            msg.replyToId ? `(Reply to: ${msg.replyToId})` : ''
          } <em>(${new Date(msg.timestamp).toLocaleString()})</em></p>`
      )
      .join('');
  } catch (error) {
    console.error('Fetch error:', error);
    alert(`Error fetching messages: ${error.message}`);
  }
}

async function updateProfile() {
  const displayName = document.getElementById('displayName').value;
  if (!displayName) return alert('Missing display name');
  try {
    const response = await fetch('/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: auth.currentUser.uid, displayName }),
    });
    const result = await response.json();
    if (response.ok) {
      await auth.currentUser.reload(); // Refresh user data
      document.getElementById('profile-status').innerText = 'Profile updated!';
      displayCurrentName(); // Update UI with new name
    } else {
      document.getElementById(
        'profile-status'
      ).innerText = `Error: ${result.error}`;
    }
  } catch (error) {
    document.getElementById(
      'profile-status'
    ).innerText = `Error: ${error.message}`;
  }
}

async function deleteAccount() {
  if (confirm('Are you sure you want to delete your account?')) {
    try {
      const response = await fetch('/auth/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: auth.currentUser.uid }),
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
        document.getElementById('group-section').style.display = 'none';
      } else {
        document.getElementById(
          'profile-status'
        ).innerText = `Error: ${result.error}`;
      }
    } catch (error) {
      document.getElementById(
        'profile-status'
      ).innerText = `Error: ${error.message}`;
    }
  }
}

async function createGroup() {
  const creatorId = auth.currentUser.uid;
  const groupName = document.getElementById('groupName').value;
  const userIds = document
    .getElementById('groupUserIds')
    .value.split(',')
    .map((id) => id.trim());
  if (!groupName || !userIds.length)
    return alert('Missing group name or users');
  try {
    const response = await fetch('/messages/groups/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creatorId, groupName, userIds }),
    });
    const result = await response.json();
    if (response.ok) {
      document.getElementById(
        'group-status'
      ).innerText = `Group created! ID: ${result.groupId}`;
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function addToGroup() {
  const groupId = document.getElementById('groupId').value;
  const userId = document.getElementById('addUserId').value;
  if (!groupId || !userId) return alert('Missing group ID or user ID');
  try {
    const response = await fetch(`/messages/groups/${groupId}/add`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const result = await response.json();
    if (response.ok) {
      document.getElementById('group-status').innerText = 'User added!';
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function removeFromGroup() {
  const groupId = document.getElementById('groupId').value;
  const userId = document.getElementById('removeUserId').value;
  if (!groupId || !userId) return alert('Missing group ID or user ID');
  try {
    const response = await fetch(`/messages/groups/${groupId}/remove`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const result = await response.json();
    if (response.ok) {
      document.getElementById('group-status').innerText = 'User removed!';
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function sendGroupMessage() {
  const senderId = auth.currentUser.uid;
  const groupId = document.getElementById('groupId').value;
  const content = document.getElementById('groupMessage').value;
  const replyToId = document.getElementById('groupReplyToId').value || null;
  if (!groupId || !content) return alert('Missing group ID or message');
  try {
    const response = await fetch(`/messages/groups/${groupId}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, content, replyToId }),
    });
    const result = await response.json();
    if (response.ok) {
      document.getElementById('groupMessage').value = '';
      document.getElementById('groupReplyToId').value = '';
      getGroupMessages();
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function getGroupMessages() {
  const groupId = document.getElementById('groupId').value;
  if (!groupId) return alert('Missing group ID');
  try {
    const response = await fetch(`/messages/groups/${groupId}/messages`);
    const result = await response.json();
    const groupMessagesDiv = document.getElementById('group-messages');
    groupMessagesDiv.innerHTML = result.messages
      .map(
        (msg) =>
          `<p>ID: ${msg.id} <strong>${msg.senderId}:</strong> ${msg.content} ${
            msg.replyToId ? `(Reply to: ${msg.replyToId})` : ''
          } <em>(${new Date(msg.timestamp).toLocaleString()})</em></p>`
      )
      .join('');
  } catch (error) {
    alert(`Error fetching group messages: ${error.message}`);
  }
}

window.register = register;
window.login = login;
window.logout = logout;
window.sendMessage = sendMessage;
window.updateProfile = updateProfile;
window.deleteAccount = deleteAccount;
window.createGroup = createGroup;
window.addToGroup = addToGroup;
window.removeFromGroup = removeFromGroup;
window.sendGroupMessage = sendGroupMessage;
window.getGroupMessages = getGroupMessages;
