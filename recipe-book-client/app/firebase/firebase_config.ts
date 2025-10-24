// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAgfuaBtEGyy8-bpPsf99aN-_AmQD0tx44",
    authDomain: "recipe-book-fabf2.firebaseapp.com",
    projectId: "recipe-book-fabf2",
    storageBucket: "recipe-book-fabf2.firebasestorage.app",
    messagingSenderId: "917383292640",
    appId: "1:917383292640:web:c23933b73e0dad9ebd9285"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);