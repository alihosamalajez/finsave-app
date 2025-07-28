
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from 'firebase/firestore'



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGMEjP9oJuhSVnAdyuaOI5eZ0AXM5RPmM",
  authDomain: "finsave-cc848.firebaseapp.com",
  databaseURL: "https://finsave-cc848-default-rtdb.firebaseio.com",
  projectId: "finsave-cc848",
  storageBucket: "finsave-cc848.firebasestorage.app",
  messagingSenderId: "747931167992",
  appId: "1:747931167992:web:4eb712afedf3cab5fb1f0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)