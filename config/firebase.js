const admin = require('firebase-admin');
const serviceAccount = require('../ServiceAccountKey.json'); // Relative path: one level up from config/

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };