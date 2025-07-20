# Autsai Backend Assignment – Junior Backend Developer

## Overview

This project is a submission for the Junior Backend Developer position at **Autsai**, completed by **Jossell Araiza**. It implements a robust messaging system using Firebase Authentication and Firestore, fully meeting:

- ✅ All Tier 1 requirements (user authentication, one-on-one messaging with timestamps)
- ✅ Two Tier 2 features (edit user profile, group chat with add/remove users)
- ✅ One Tier 3 feature (reply to specific messages)

A clean, user-friendly frontend enhances the demo with input validation, current `displayName` display, and logout functionality. The codebase is modular, error-handled, and formatted with ESLint/Prettier for readability and maintainability.

---

## ✨ Features

### Tier 1 (Required)

- **User Authentication**: Register and login using Firebase Authentication (email/password).
- **One-on-One Messaging**: Send/receive messages stored in Firestore with timestamps.
- **Code Quality**: Modular Express.js backend, comprehensive error handling, and ESLint/Prettier formatting.

### Tier 2 (Optional)

- **Edit User Profile**: Update display name via backend API and UI, with current name shown after login.
- **Group Chat**: Create groups, manage members, and send/receive group messages.

### Tier 3 (Advanced)

- **Reply to Specific Messages**: Support replying to messages in 1-1 and group chats using `replyToId`.

### Additional Enhancements

- Logout functionality.
- Input validation with alerts for missing fields.
- Current user `displayName` shown after login/update.

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js, Firebase Admin SDK
- **Frontend**: HTML, CSS, JavaScript, Firebase Client SDK
- **Tools**: Postman, ESLint, Prettier, Git

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone [https://github.com/Jossell-Araiza/Autsai-Backend-Projectl]
cd Autsai-Assignment
```

### 2. Install Dependencies

```bash
npm install
```

Required packages:

- express
- body-parser
- firebase-admin
- firebase
- nodemon (dev)

### 3. Configure Firebase

- Create a project at [Firebase Console](https://console.firebase.google.com)
- Enable Email/Password Authentication and Firestore (test mode)
- Download the service account key JSON and place it in the root directory as `ServiceAccountKey.json` (excluded from Git)

### 4. Run the Application

```bash
npm start
```

- Server runs at: http://localhost:3000
- Frontend accessible at: http://localhost:3000

---

## 🔌 API Endpoints (Test with Postman)

### Auth Routes

- `POST /auth/register` → `{email, password}`
- `POST /auth/login` → `{email, password}`
- `PUT /auth/profile` → `{uid, displayName}`
- `DELETE /auth/delete` → `{uid}`

### One-on-One Messaging

- `POST /messages/send` → `{senderId, receiverId, content, replyToId (optional)}`
- `GET /messages/conversations/:senderId/:receiverId`

### Group Chat

- `POST /messages/groups/create` → `{creatorId, groupName, userIds: array}`
- `PUT /messages/groups/:groupId/add` → `{userId}`
- `PUT /messages/groups/:groupId/remove` → `{userId}`
- `POST /messages/groups/:groupId/send` → `{senderId, content, replyToId (optional)}`
- `GET /messages/groups/:groupId/messages`

---

## 🧪 Frontend Usage

Open `http://localhost:3000` in your browser. Features include:

- Register/login
- Send/reply to messages (1-1 and group)
- Create groups, add/remove users
- Update profile
- Delete account
- Logout

🔒 Validation alerts prevent missing fields.

---

## 🗂 Project Structure

```
Autsai-Assignment/
├── config/
│   └── firebase.js           # Firebase Admin SDK init
├── public/
│   ├── app.js                # Frontend logic (validation, reply, group features)
│   ├── index.html            # UI for auth, messages, groups
│   └── style.css             # Basic styling
├── routes/
│   ├── auth.js               # Auth endpoints (register, login, profile)
│   └── messages.js           # Messaging (1-1, group, replies)
├── .env                      # PORT and other env vars
├── .eslintrc.json            # ESLint config
├── .prettierrc.json          # Prettier config
├── index.js                  # Express app entry point
├── package.json              # Dependencies & scripts
├── README.md                 # This file
└── ServiceAccountKey.json    # Firebase credentials (gitignored)
```

---

## 💡 Technical Decisions

- **Firestore vs Realtime DB**: Firestore chosen for structured data, subcollections, and query support.
- **Data Paths**:
  - `conversations/[uid1_uid2]/messages`: One-on-one messages (UIDs sorted alphabetically)
  - `groups/[groupId]/messages`: Group messages
- **Backend Structure**: Modular routes (`auth.js`, `messages.js`) with consistent error handling.
- **Frontend Enhancements**: Display `displayName`, reply input, alerts for validation, and group chat controls.
- **Security**: `.gitignore` excludes service keys; Firestore in test mode (production rules required).
- **Code Style**: ESLint + Prettier with 2-space indent, single quotes, and clear error messages.

---

## 🔢 Firebase Data Structure

### Authentication

```json
{
  "uid": "unique_id",
  "email": "user@example.com",
  "displayName": "User Name"
}
```

### Firestore

```json
conversations/
  [uid1_uid2]/
    messages/
      {
        "senderId": "uid1",
        "content": "Hello!",
        "timestamp": "...",
        "replyToId": "msg123" // optional
      }

groups/
  [groupId]/
    {
      "name": "Group Name",
      "creatorId": "uid1",
      "members": ["uid1", "uid2", ...],
      "createdAt": "..."
    }
    messages/
      {
        "senderId": "uid2",
        "content": "Hi group!",
        "timestamp": "...",
        "replyToId": "msg456" // optional
      }
```

---

## ✅ Running & Testing

- **Backend**: Test all endpoints via Postman.
- **Frontend**: Full app available at `http://localhost:3000`.
- **Firebase Console**: Monitor users and data in Auth/Firestore tabs.

---

## 📌 Notes for Reviewers

Fully implemented:

- Tier 1 ✅ (auth, 1-1 messaging)
- Tier 2 ✅ (profile update, group chat)
- Tier 3 ✅ (message replies)

**Video demo included** (linked in submission) showing:

- API tests via Postman
- Functional frontend walkthrough
- Firebase data structure in use

Code is version-controlled in a **private GitHub repo** (available on request)

**Frontend polish includes**:

- Input validation
- Current user info
- Logout functionality

---

## ⚠️ Known Limitations

- **Replies**: Currently require manual input of message ID (could be enhanced with clickable UI).
- **Group Chat UI**: Minimal; could benefit from styling and real-time updates.
- **Firestore Rules**: App is in test mode. Secure rules needed for production deployment.
- **Delete Messages**: Currently not able to delete messages or group chat messages.

---

Submitted for **Autsai Junior Backend Developer Assignment, July 2025**.
