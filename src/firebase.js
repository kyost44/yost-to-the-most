import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// ─── PASTE YOUR FIREBASE CONFIG HERE ─────────────────────────────────────────
// Firebase Console → Project Settings → Your apps → Web app → SDK setup & config
const firebaseConfig = {
  apiKey:            "REPLACE_ME",
  authDomain:        "REPLACE_ME",
  databaseURL:       "REPLACE_ME",
  projectId:         "REPLACE_ME",
  storageBucket:     "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
  appId:             "REPLACE_ME",
};
// ─────────────────────────────────────────────────────────────────────────────

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
