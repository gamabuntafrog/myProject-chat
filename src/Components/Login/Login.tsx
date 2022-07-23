import { Box, Button, Typography } from "@mui/material";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { setDoc , doc, getDoc} from "firebase/firestore";
import React, {useContext} from "react";
import {FC} from "react";
import {Context} from "../../index";



const Login: FC = () => {

    const {firestore} = useContext(Context)!

    const onAuth = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();

        signInWithPopup(auth, provider)
        .then(async (result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log(result)
            const getUser = await getDoc(doc(firestore, 'users', `${user.uid}`))
            if (!getUser.exists()) {
                const createUser = setDoc(doc(firestore, 'users', `${user.uid}`), {
                    nickname: user.displayName,
                    photoURL: user.photoURL,
                    bio: '',
                    userId: user.uid,
                    email: user.email,
                    createdAt: user.metadata.creationTime,
                    phoneNumber: user.phoneNumber ? user.phoneNumber : null
                })
            }


        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });

    }

    return (
        <Box position='absolute' sx={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            <Typography variant='h1' fontWeight='600' >
                ВХОД
            </Typography>
            <Button sx={{mx: 'auto', width: '100%', mt: 5}} size='large' variant="contained" onClick={onAuth}>
                Войти через Google
            </Button>
        </Box>
    );
}

export default Login;
