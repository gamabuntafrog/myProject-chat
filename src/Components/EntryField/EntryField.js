import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../..";
import Loader from "../Loader/Loader";
import {TextField, Box, Button, Typography, Snackbar, Alert, AlertTitle} from "@mui/material"
import SendIcon from '@mui/icons-material/Send';




const EntryField = () => {
    const {auth, firestore} = useContext(Context)

    const [user, isLoading, error] = useAuthState(auth)

    const { id } = useParams()
    

    const [message, setMessage] = useState('');



    const submitPost = async () => {

        if (message.trim() == '') {
            setOpen(true)
            // alert('Введите сообщение ёпт')
            return
        }

        await addDoc(collection(firestore, `${id}`), {
            userId: user.uid,
            userName: user.displayName,
            message,
            createdAt: Date.now(),
            photoURL: user.photoURL
        })

        setMessage('')
    }

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') { //если кликнул по других элементах
            return;
        }

        setOpen(false);
    };


    if (isLoading) {
        return <Loader/>
    }

    return <Box >
        <Typography sx={{my: 1}} variant={'body1'} >{id}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
                id="outlined-name"
                label="Сообщение"
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
                xs={{}}
                fullWidth
                onKeyPress={(e) => {
                    if (e.key === "Enter") return submitPost() //submit
                }}
            />
            <Button sx={{ml: 1}} variant="outlined" onClick={submitPost}>
                <SendIcon/>
            </Button>
        </Box>

        <Snackbar
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            open={open}
            autoHideDuration={6000}
            onClose={() => setOpen(false)}
        >
            <Alert sx={{}} variant={'filled'}  severity="error">
                <AlertTitle sx={{mt: -0.5, flexGrow: 1}}>Введите сообщение </AlertTitle>
                <Button sx={{ml: 9}} variant={'error'} size="small" onClick={handleClose}>
                    Закрыть
                </Button>
            </Alert>
        </Snackbar>
   </Box>
}


export default EntryField;