import React, { useContext, useState } from "react";
import shortid from 'shortid';
import { useParams } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../..";
import Loader from "../Loader/Loader";
import {TextField, Box, Button, Typography, Snackbar, Alert, AlertTitle} from "@mui/material"
import SendIcon from '@mui/icons-material/Send';




const EntryField = () => {
    const { auth, firestore } = useContext(Context)

    const { id } = useParams()

    const [user, isLoading ] = useAuthState(auth)

    const [message, setMessage] = useState('');


    const submitPost = async () => {

        if (message.trim() === '') {
            setOpen(true)
            // alert('Введите сообщение ёпт')
            return
        }

        if (user) {
            await addDoc(collection(firestore, `${id}`), {
                userId: user.uid,
                userName: user.displayName,
                message,
                createdAt: Date.now(),
                photoURL: user.photoURL
            })
        } else {
            const NewAnonimUserId = () => `${shortid.generate()}${shortid.generate()}`

            await addDoc(collection(firestore, `${id}`), {
                userId: NewAnonimUserId(),
                userName: 'Аноним Анонимович',
                message,
                createdAt: Date.now(),
                photoURL: 'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg'
            })
        }

        setMessage('')
    }

    const [open, setOpen] = useState(false);


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
                    fullWidth
                    onKeyPress={(e) => {
                        if (e.key === "Enter") return submitPost() //submit
                    }}
                />
                <Button sx={{ml: 1}} variant="outlined" onClick={submitPost}>
                    <SendIcon />
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