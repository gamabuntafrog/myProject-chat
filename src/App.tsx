import './App.css';
import {BrowserRouter, useHistory, useLocation, useParams} from 'react-router-dom';
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
import {chatType} from "./types/chatType";

type AppPropTypes = {
    auth: Auth, app: FirebaseApp, firestore: Firestore
}

const r: HTMLInputElement = document.querySelector(':root')!;

export type userStylesType = {backgroundColor: string, secondBackgroundColor: string, theme: 'light' | 'dark' | '', messagesBorderRadius: string, backgroundImage: ArrayBuffer | File | string }

export const ChatInfoContext = createContext<{
    chatInfo: chatType | null,
    changeChatInfo: (chatInfo: chatType | null) => void,
    handleChatInfoIsOpen: (isOpen: boolean) => void ,
    isChatInfoOpen: boolean
} | null>(null)

export const ChatListContext = createContext<{
    isChatListOpen: boolean,
    handleIsChatListOpen: (isOpen: boolean) => void
} | null>(null)

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
    // console.log(user)
    const [userStyles, setUserStyles] = useState<userStylesType>({backgroundColor: '', secondBackgroundColor: '', theme: '', messagesBorderRadius: '', backgroundImage: ''});

    const [chatInfo, setChatInfo] = useState<chatType | null>(null);
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);
    const [isChatListOpen, setIsChatListOpen] = useState(true);

    const location = useLocation()
    const isLocationIsChat = location.pathname.includes('chat/')
    // console.log(isLocationIsChat)



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
            r.style.setProperty('--nicknameColor', userStyles.backgroundColor);
            r.style.setProperty('--secondBackgroundColor', userStyles.secondBackgroundColor);
        }
    }, [userStyles]);

    useEffect(() => {
        if (user) {
            const localStorageUserInfo = localStorage.getItem(user.userId)
            if (!localStorageUserInfo) {
                const startedStyles: userStylesType = {
                    backgroundColor: '#404FBF',
                    secondBackgroundColor: '#191919',
                    theme: 'dark',
                    messagesBorderRadius: '10',
                    backgroundImage: '',
                }
                localStorage.setItem(user.userId, JSON.stringify(startedStyles))
                setUserStyles(startedStyles)
            } else {
                const parsedLocalStorUserInfo = JSON.parse(localStorageUserInfo);
                setUserStyles(parsedLocalStorUserInfo)
            }
        }
    }, [user]);

    useEffect(() => {
        if (!isLocationIsChat) {
            setChatInfo(null) // cleaning header
        }
    }, [isLocationIsChat]);

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
                <ChatInfoContext.Provider value={{
                    chatInfo: chatInfo,
                    changeChatInfo: (chatInfo => setChatInfo(chatInfo)),
                    isChatInfoOpen,
                    handleChatInfoIsOpen: (isOpen => setIsChatInfoOpen(!isOpen))
                }}>
                    <ChatListContext.Provider value={{
                        isChatListOpen,
                        handleIsChatListOpen: (isOpen => setIsChatListOpen(!isOpen))
                    }}>
                        <ThemeProvider theme={darkTheme}>
                            <CssBaseline />
                            <div className="App">
                                    <Navbar/>
                                    <AppRouter/>
                            </div>
                        </ThemeProvider>
                    </ChatListContext.Provider>
                </ChatInfoContext.Provider>
            </ThemeContext.Provider>

        </Context.Provider>

    );
}

export default App;
