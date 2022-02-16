import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { createTheme, ThemeProvider,CssBaseline } from '@mui/material';




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

};

export const Context = createContext(null)

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth()
const firestore = getFirestore()

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Context.Provider value={{
      auth,
      app,
      firestore
    }}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />

      </ThemeProvider>

    </Context.Provider>


    
  </React.StrictMode>,
  document.getElementById('root')
);

