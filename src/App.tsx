import './App.css';
import {BrowserRouter} from 'react-router-dom';
import Navbar from './Components/Navbar';
import AppRouter from './Components/AppRouter';
import {useAuthState} from 'react-firebase-hooks/auth';
import Loader from './Components/Loader';
import {createContext, FC, useContext, useEffect, useState} from 'react';
import {Context} from '.';
import React from 'react';
import {Auth} from "firebase/auth";
import {FirebaseApp} from "firebase/app";
import {doc, Firestore} from "firebase/firestore";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import context from "./types/context";

type AppPropTypes = {
    auth: Auth, app: FirebaseApp, firestore: Firestore
}

const r = document.querySelector(':root')!;

export const ThemeContext = createContext<{
    userStyles: {backgroundColor: string, theme: '', messagesBorderRadius: string},
    changeColor: (color: string) => void
    changeBorderRadius: (br: string) => void

} | null>(null)

const App: FC<AppPropTypes> = ({auth, app, firestore}) => {

    const [googleUser, isUserLoading] = useAuthState(auth)
    const [user, isLoading] = useDocumentData<any>(doc(firestore, 'users', `${googleUser?.uid}`))

    const [userStyles, setUserStyles] = useState
    <{backgroundColor: string, theme: '', messagesBorderRadius: string}>
    ({backgroundColor: '', theme: '', messagesBorderRadius: ''});

    console.log(userStyles)


    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: userStyles.backgroundColor || '#484848',
            },
        },
    });

    useEffect(() => {
        if (userStyles) {
            // @ts-ignore
            r.style.setProperty('--nicknameColor', userStyles.backgroundColor);
        }
    }, [userStyles]);

    useEffect(() => {
        if (user) {
            const localStorageUserInfo = localStorage.getItem(user.userId)
            const parsedLocalStorUserInfo = localStorageUserInfo ? JSON.parse(localStorageUserInfo) : null;
            console.log(parsedLocalStorUserInfo)
            if (parsedLocalStorUserInfo) {
                setUserStyles(parsedLocalStorUserInfo)
            }
        }
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
            <ThemeContext.Provider value={{
                userStyles,
                changeColor: (color: string) => setUserStyles(prev => {return {...prev, backgroundColor: color}}),
                changeBorderRadius: (br: string) => setUserStyles(prev => {return {...prev, messagesBorderRadius: br}})
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
            </ThemeContext.Provider>

        </Context.Provider>

    );
}

export default App;
