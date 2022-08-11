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

const r: HTMLInputElement = document.querySelector(':root')!;

export type userStylesType = {backgroundColor: string, secondBackgroundColor: string, theme: 'light' | 'dark' | '', messagesBorderRadius: string, backgroundImage: ArrayBuffer | File | string }

export const ThemeContext = createContext<{
    userStyles: userStylesType,
    changeColor: (color: string) => void,
    changeBorderRadius: (br: string) => void,
    changeBackground: (bg: string | File | ArrayBuffer) => void,
    changeTheme: (theme : 'light' | 'dark') => void,
    changeSecondColor: (color: string) => void
} | null>(null)

const App: FC<AppPropTypes> = ({auth, app, firestore}) => {

    const [googleUser, isUserLoading] = useAuthState(auth)
    const [user, isLoading] = useDocumentData<any>(doc(firestore, 'users', `${googleUser?.uid}`))

    const [userStyles, setUserStyles] = useState<userStylesType>({backgroundColor: '', secondBackgroundColor: '', theme: '', messagesBorderRadius: '', backgroundImage: ''});

    console.log(userStyles)


    const darkTheme = createTheme({
        palette: {
            mode: userStyles.theme || 'dark',
            primary: {
                main: userStyles.backgroundColor || '#484848',
            },
        },
    });

    useEffect(() => {
        if (userStyles) {
            // @ts-ignore
            r.style.setProperty('--nicknameColor', userStyles.backgroundColor);
            r.style.setProperty('--secondBackgroundColor', userStyles.secondBackgroundColor);

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
                changeColor: (color) => setUserStyles(prev => {return {...prev, backgroundColor: color}}),
                changeSecondColor: (color) => setUserStyles(prev => {return {...prev, secondBackgroundColor: color}}),
                changeBorderRadius: (br) => setUserStyles(prev => {return {...prev, messagesBorderRadius: br}}),
                changeBackground: (bg) => setUserStyles(prev => {return {...prev, backgroundImage: bg}}),
                changeTheme: (theme) => setUserStyles(prev => {return {...prev, theme}}),
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
