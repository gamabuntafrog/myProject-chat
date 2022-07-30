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
import ReplyIcon from '@mui/icons-material/Reply';
import SendIcon from '@mui/icons-material/Send';
import Modal from "../Modal";
import UserModalInfo from "../UserModalInfo";
import '../../App.css';
import ChatInfo from "../ChatInfo";
import { messagesExemplar } from '../../types/messages';
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
// @ts-ignore
import EllipsisText from "react-ellipsis-text";

type EntryFieldPT = {
    chatName: string,
    chatId: string,
    chatDescription: string,
    chatImage: string,
    users: any,
    isReplying: boolean,
    setIsReplying: React.Dispatch<React.SetStateAction<boolean>>
    replyMessageInfo: any
}

const EntryField: FC<EntryFieldPT> = ({
        chatName,
        users,
        chatId,
        chatDescription,
        chatImage,
        isReplying,
        replyMessageInfo,
        setIsReplying
    }) => {
    console.log(users)
    const { firestore, user, isUserLoading} = useContext(Context)!

    const {id} = useParams<{ id: string }>()

    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);

    console.log(isReplying, replyMessageInfo)

    const subscribeUser = async () => {
        await setDoc(doc(firestore, 'chats', `${id}`, 'users', `${user?.userId}`), {
            userId: user?.userId,
            isAdmin: false
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
            const newMessageId = `${user.userId}${shortid.generate()}${shortid.generate()}${Date.now()}`

            if (isReplying) {
                // const {userId} = user
                // console.log({
                //     userId,
                //     message,
                //     replier: replyMessageInfo
                //
                // })

                const docRef = await setDoc(doc(firestore, 'chats', `${id}`, 'messages', `${newMessageId}`), {
                    messageType: messagesExemplar.replyMessage,
                    userId: user.userId,
                    message,
                    createdAt: Date.now(),
                    replyer: replyMessageInfo,
                    messageId: newMessageId,
                    chatId: id

                })
                setIsReplying(false)
            } else {
                const docRef = await setDoc(doc(firestore, 'chats', `${id}`, 'messages', `${newMessageId}`), {
                    messageType: messagesExemplar.message,
                    userId: user?.userId,
                    message,
                    createdAt: Date.now(),
                    messageId: newMessageId,
                    chatId: id
                })

                // console.log(docRef)

            }
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

    return <Box sx={{position: 'sticky', bottom: '0px', pt: 1, pb: 2,  backgroundColor: '#121212', zIndex: 100, }}>
        <Box>
            <ChatInfo id={id} chatName={chatName} users={users} chatImage={chatImage} chatDescription={chatDescription} />
            {isReplying &&
		        <Box sx={{display: 'flex', mb: 1, alignItems: 'center'}}>
			        <ReplyIcon sx={{width: '30px', height: '30px', mr: 1}}/>
			        <Box>
				        <Typography>{users[replyMessageInfo.userId].nickname}</Typography>
				        <Typography >
                            <EllipsisText text={replyMessageInfo.message} length={150}/>
                        </Typography>

			        </Box>
			        <Button color={'error'} sx={{ml: 'auto'}} onClick={() => setIsReplying(false)}>
				        <CloseIcon />
			        </Button>
		        </Box>
            }
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <TextField
                    id="outlined-name"
                    label="Сообщение"
                    value={message}
                    onChange={(e) => setMessage(e.currentTarget.value)}
                    fullWidth
                    multiline
                    sx={{fieldset: {borderRadius: '30px 0 0 30px'}}}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") return submitPost() //submit
                    }}
                />
                <Button sx={{ml: 1}} variant="outlined" onClick={submitPost}>
                    <SendIcon/>
                </Button>
            </Box>
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