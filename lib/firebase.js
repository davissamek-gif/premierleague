import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyBIFj-roAVHnNpUOHfw5qg0YhuCPL-nrSI",
  authDomain: "premier-league-60cde.firebaseapp.com",
  projectId: "premier-league-60cde",
  storageBucket: "premier-league-60cde.firebasestorage.app",
  messagingSenderId: "466066754012",
  appId: "1:466066754012:web:3def77f4be3be93b73a719"
}
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
