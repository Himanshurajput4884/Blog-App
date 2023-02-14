import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDV69GoDbyPA8iYhpeD3tB18osF3vMmQLQ",
  authDomain: "my-blog-6f993.firebaseapp.com",
  projectId: "my-blog-6f993",
  storageBucket: "my-blog-6f993.appspot.com",
  messagingSenderId: "920601534529",
  appId: "1:920601534529:web:a893266de5d2a4ddfaa6c0"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider  = new GoogleAuthProvider();
