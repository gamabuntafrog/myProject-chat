import './App.css';
import {BrowserRouter} from 'react-router-dom';
import Navbar from './Components/Navbar';
import AppRouter from './Components/AppRouter';
import {useAuthState} from 'react-firebase-hooks/auth';
import Loader from './Components/Loader';
import {FC, useContext, useEffect} from 'react';
import {Context} from '.';
import React from 'react';
import {Auth} from "firebase/auth";
import {FirebaseApp} from "firebase/app";
import {doc, Firestore} from "firebase/firestore";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

type AppPropTypes = {
    auth: Auth, app: FirebaseApp, firestore: Firestore
}

const r = document.querySelector(':root')!;

const App: FC<AppPropTypes> = ({auth, app, firestore}) => {

    const [googleUser, isUserLoading] = useAuthState(auth)
    const [user, isLoading] = useDocumentData<any>(doc(firestore, 'users', `${googleUser?.uid}`))
    console.log(user)

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: user?.nicknameColor ? user.nicknameColor : '#1976d2',
            },
        },
    });

    useEffect(() => {
        // @ts-ignore
        r.style.setProperty('--nicknameColor', user?.nicknameColor);


    }, [user]);

    if (isLoading) {
        return <Loader/>
    }

    return (
        <Context.Provider value={{
            auth,
            app,
            firestore,
            user,
            isUserLoading
        }}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <div className="App">

                <BrowserRouter>
                    <Navbar/>
                    <AppRouter/>
                </BrowserRouter>

            </div>
            </ThemeProvider>
        </Context.Provider>

    );
}

export default App;
