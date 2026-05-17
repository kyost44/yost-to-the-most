import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey:            "AIzaSyCDbFDobkgsf1Wg_rYqQYaZv9vNaCp-9CQ",
  authDomain:        "yost-disney-destiny.firebaseapp.com",
  databaseURL:       "https://yost-disney-destiny-default-rtdb.firebaseio.com",
  projectId:         "yost-disney-destiny",
  storageBucket:     "yost-disney-destiny.firebasestorage.app",
  messagingSenderId: "808741588372",
  appId:             "1:808741588372:web:a619ebcb8ce6d783521381",
};

let db = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (err) {
  console.warn('Firebase failed to initialize — falling back to localStorage.', err);
}

export { db };
export default db;
