import React, {FC, useContext, useState} from "react";
import shortid from 'shortid';
import {NavLink, useParams} from "react-router-dom";
import {addDoc, collection, setDoc, doc, arrayUnion, updateDoc} from "firebase/firestore";
import {Context} from "../..";
import {
    TextField,
    Box,
    Button,
    Typography,
    Snackbar,
    Alert,
    AlertTitle,
    Avatar,
    List,
    ListItem,
    Grid,
    Container
} from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import Modal from "../Modal";
import UserModalInfo from "../UserModalInfo";
import '../../App.css';
import ChatInfo from "../ChatInfo";

type EntryFieldPT = {
    chatName: string,
    chatId: string,
    chatDescription: string,
    chatImage: string,
    users: any
}

const EntryField: FC<EntryFieldPT> = ({chatName, users, chatId, chatDescription, chatImage}) => {
    const { firestore, user, isUserLoading} = useContext(Context)!

    const {id} = useParams<{ id: string }>()

    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);


    // console.log(users[user?.userId])

    const subscribeUser = async () => {
        await updateDoc(doc(firestore, 'chats', `${id}`), {
            users: arrayUnion({
                userId: user?.userId
            })
        })
        await updateDoc(doc(firestore, 'users', `${user?.userId}`), {
            subscribedChats: arrayUnion(chatId)
        })
    }

    const submitPost = async () => {

        if (message.trim() === '') {
            setOpen(true)
            return
        }

        if (user) {
            await updateDoc(doc(firestore, 'chats', `${id}`), {
                messages: arrayUnion({
                    userId: user.userId,
                    message,
                    createdAt: Date.now(),
                })
            })
        } else {
            const NewAnonimUserId = () => `${shortid.generate()}${shortid.generate()}`

            await updateDoc(doc(firestore, 'chats', `${id}`), {
                messages: arrayUnion({
                    userId: null,
                    nickname: 'Аноним Анонимович',
                    message,
                    createdAt: Date.now(),
                    photoURL: 'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg'
                })
            })
        }

        setMessage('')
    }

    const handleClose = (_: any, reason: string) => {
        if (reason === 'clickaway') { //если кликнул по других элементах
            return;
        }

        setOpen(false);
    };

    if (!users[user?.userId]) {
        return <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Button size={'large'} variant={'contained'} sx={{width: '90%'}} onClick={subscribeUser}>Присоединится</Button>
        </Container>
    }

    return <Box>

        <ChatInfo id={id} chatName={chatName} users={users} chatImage={chatImage} chatDescription={chatDescription} />
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
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
                <SendIcon/>
            </Button>
        </Box>

        <Snackbar
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            open={open}
            autoHideDuration={6000}
            onClose={() => setOpen(false)}
        >
            <Alert variant={'filled'} severity="error">
                <AlertTitle sx={{mt: -0.5, flexGrow: 1}}>Введите сообщение </AlertTitle>
                {/* @ts-ignore */}
                <Button sx={{ml: 9}} variant={'error'} size="small" onClick={handleClose}>
                    Закрыть
                </Button>
            </Alert>
        </Snackbar>

    </Box>


}


export default EntryField;