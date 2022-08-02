import './App.css';
import {BrowserRouter} from 'react-router-dom';
import Navbar from './Components/Navbar';
import AppRouter from './Components/AppRouter';
import {useAuthState} from 'react-firebase-hooks/auth';
import Loader from './Components/Loader';
import {FC, useContext} from 'react';
import {Context} from '.';
import React from 'react';
import {Auth} from "firebase/auth";
import {FirebaseApp} from "firebase/app";
import {doc, Firestore} from "firebase/firestore";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {user} from "./types/user";

type AppPropTypes = {
    auth: Auth, app: FirebaseApp, firestore: Firestore
}

const App: FC<AppPropTypes> = ({auth, app, firestore}) => {

    const [googleUser, isUserLoading] = useAuthState(auth)
    const [user, isLoading] = useDocumentData<any>(doc(firestore, 'users', `${googleUser?.uid}`))
    console.log(user)
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
            <div className="App">

                <BrowserRouter>
                    <Navbar/>
                    <AppRouter/>
                </BrowserRouter>

            </div>
        </Context.Provider>

    );
}

export default App;
