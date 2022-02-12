import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvNxoUQWQehZKeaU_uaQ6Rxq4BFpODRxc",
  authDomain: "gamabunta-chat.firebaseapp.com",
  projectId: "gamabunta-chat",
  storageBucket: "gamabunta-chat.appspot.com",
  messagingSenderId: "348555320114",
  appId: "1:348555320114:web:c877b2222d8213bcc7d52b",
  measurementId: "G-3832YNV6K3"
};

export const Context = createContext(null)

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth()
const firestore = getFirestore()



ReactDOM.render(
  <React.StrictMode>
    <Context.Provider value={{
      auth,
      app,
      firestore
    }}>
      <App />

    </Context.Provider>


    
  </React.StrictMode>,
  document.getElementById('root')
);

