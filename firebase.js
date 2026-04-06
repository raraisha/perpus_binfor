import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
// 1. Add the functions you need to this import line:
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc,
    Timestamp,
    orderBy,
    query,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDdKMrxPl9xXFG638Ged5W6TUXC8bLZ5sg",
    authDomain: "raisha-afiqah.firebaseapp.com",
    databaseURL: "https://raisha-afiqah-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "raisha-afiqah",
    storageBucket: "raisha-afiqah.firebasestorage.app",
    messagingSenderId: "178831789027",
    appId: "1:178831789027:web:acbaa2fd9edc8981032ed6",
    measurementId: "G-3H55HJFZMT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// 2. Now these exports will work because they refer to the imports above
export { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, orderBy, query, setDoc };