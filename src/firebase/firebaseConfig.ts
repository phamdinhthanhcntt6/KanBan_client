import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCt2LehsZlKc3RsNQNJuExHtOqNhZL9Fnw",
  authDomain: "kanban-714f0.firebaseapp.com",
  projectId: "kanban-714f0",
  storageBucket: "kanban-714f0.appspot.com",
  messagingSenderId: "722578696429",
  appId: "1:722578696429:web:e613f1996c6b09c70384e4",

  // apiKey: process.env.REACT_APP_apiKey,
  // authDomain: process.env.REACT_APP_authDomain,
  // projectId: process.env.REACT_APP_projectId,
  // storageBucket: process.env.REACT_APP_storageBucket,
  // messagingSenderId: process.env.REACT_APP_messagingSenderId,
  // appId: process.env.REACT_APP_appId,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export const storage = getStorage();

auth.languageCode = "vn";
