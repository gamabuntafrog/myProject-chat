import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import context from "./types/context";


const firebaseConfig = {
  apiKey: "AIzaSyBvNxoUQWQehZKeaU_uaQ6Rxq4BFpODRxc",
  authDomain: "gamabunta-chat.firebaseapp.com",
  projectId: "gamabunta-chat",
  storageBucket: "gamabunta-chat.appspot.com",
  messagingSenderId: "348555320114",
  appId: "1:348555320114:web:c877b2222d8213bcc7d52b",
  measurementId: "G-3832YNV6K3"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const firestore = getFirestore()




export const Context = createContext<context | null>(null)

ReactDOM.render(
  <React.StrictMode>

        <App auth={auth} app={app} firestore={firestore} />

  </React.StrictMode>,
  document.getElementById('root')
);

