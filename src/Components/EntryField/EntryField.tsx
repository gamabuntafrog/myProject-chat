import React, {FC, useContext, useEffect, useRef, useState} from "react";
import shortid from 'shortid';
import {useParams} from "react-router-dom";
import {arrayUnion, doc, setDoc, updateDoc} from "firebase/firestore";
import {Context} from "../..";
import {Alert, AlertTitle, Box, Button, Container, Snackbar, TextField, Typography} from "@mui/material"
import ReplyIcon from '@mui/icons-material/Reply';
import SendIcon from '@mui/icons-material/Send';
import '../../App.css';
import ChatInfo from "../ChatInfo";
import {messagesExemplar, messagesType, messageType, replyMessageType} from '../../types/messages';
import CloseIcon from "@mui/icons-material/Close";
import EllipsisText from "react-ellipsis-text";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import { emojiType } from "../Chat/Chat";

type EntryFieldPT = {
    chatName: string,
    chatId: string,
    chatDescription: string,
    chatImage: string,
    users: any,
    isReplying: boolean,
    setIsReplying: React.Dispatch<React.SetStateAction<boolean>>
    replyMessageInfo: any,
    setIsChatListOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isChatListOpen: boolean,
    showMessageOnReply: (message: messagesType) => void,
    listRef: React.MutableRefObject<HTMLUListElement | null>,
    emoji: emojiType | null
}

const EntryField: FC<EntryFieldPT> = ({
    chatName,
    users,
    chatId,
    chatDescription,
    chatImage,
    isReplying,
    replyMessageInfo,
    setIsReplying,
    setIsChatListOpen,
    isChatListOpen,
    showMessageOnReply,
    emoji
}) => {

    const { firestore, user, isUserLoading} = useContext(Context)!

    const {id} = useParams<{ id: string }>()

    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);

    const inputRef = useRef<null | HTMLInputElement>(null);

    const type = useGetTypeOfScreen()

    useEffect(() => {
        if (isReplying) {
            inputRef.current!.focus()
            console.log(inputRef)
        }

    }, [isReplying]);


    useEffect(() => {
        setIsReplying(false)
        setMessage('')
    }, [id]);

    useEffect(() => {
        if (emoji) {
            console.log(emoji)
            setMessage(prev => {
                return prev + emoji.emoji
            })
        }

    }, [emoji]);


    const subscribeUser = async () => {
        await setDoc(doc(firestore, 'chats', `${id}`, 'users', `${user?.userId}`), {
            userId: user?.userId,
            isAdmin: false
        })
        await updateDoc(doc(firestore, 'users', `${user?.userId}`), {
            subscribedChats: arrayUnion(chatId)
        })
        await updateDoc(doc(firestore, 'chats', `${id}`), {
            users: arrayUnion(user?.userId)
        })
    }

    const submitPost = async () => {

        const messageOnSubmit = message
        setMessage('')

        if (messageOnSubmit.trim() === '') {
            setOpen(true)
            return
        }

        if (user) {
            const newMessageId = `${user.userId}${shortid.generate()}${shortid.generate()}${Date.now()}`

            if (isReplying) {
                const docRef = await setDoc(doc(firestore, 'chats', `${id}`, 'messages', `${newMessageId}`), {
                    messageType: messagesExemplar.replyMessage,
                    userId: user.userId,
                    message: messageOnSubmit,
                    createdAt: Date.now(),
                    replyer: replyMessageInfo,
                    messageId: newMessageId,
                    chatId: id

                })
                await setDoc(doc(firestore, 'chats', `${id}`), {
                    lastMessage: {
                        messageType: messagesExemplar.replyMessage,
                        userId: user.userId,
                        message: messageOnSubmit,
                        createdAt: Date.now(),
                        replyer: replyMessageInfo,
                        messageId: newMessageId,
                        chatId: id
                    }
                }, {merge: true})
                setIsReplying(false)
            } else {
                const docRef = await setDoc(doc(firestore, 'chats', `${id}`, 'messages', `${newMessageId}`), {
                    messageType: messagesExemplar.message,
                    userId: user?.userId,
                    message: messageOnSubmit,
                    createdAt: Date.now(),
                    messageId: newMessageId,
                    chatId: id
                })
                await setDoc(doc(firestore, 'chats', `${id}`), {
                    lastMessage: {
                        messageType: messagesExemplar.message,
                        userId: user.userId,
                        message: messageOnSubmit,
                        createdAt: Date.now(),
                        messageId: newMessageId,
                        chatId: id
                    }
                }, {merge: true})
                // console.log(docRef)

            }
        }

    }

    const handleClose = (_: any, reason: string) => {
        if (reason === 'clickaway') { //если кликнул по других элементах
            return;
        }

        setOpen(false);
    };

    if (user && !users[user.userId]) {
        return <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', pb: 3}}>
            <Button size={'large'} variant={'contained'} sx={{width: '90%'}} onClick={subscribeUser}>Присоединится</Button>
        </Container>
    }

    return <Box sx={{position: 'sticky', bottom: '0px', mt: -1, pt: 1, pb: 2, px: 2, backgroundColor: '#121212', zIndex: 100, borderRadius: '8px 8px 0 0'}}>
        <Box>
            <ChatInfo
                id={id}
                chatName={chatName}
                users={users}
                chatImage={chatImage}
                chatDescription={chatDescription}
                setIsChatListOpen={setIsChatListOpen}
            />
            {isReplying &&
		        <Box sx={{display: 'flex', mb: 1, alignItems: 'center', cursor: 'pointer'}}>
                    <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}} onClick={() => showMessageOnReply(replyMessageInfo)}>
	                    <ReplyIcon sx={{width: '30px', height: '30px', mr: 1}}/>
	                    <Box>
		                    <Typography>{users[replyMessageInfo.userId].nickname}</Typography>
		                    <Typography >
			                    <EllipsisText text={replyMessageInfo.message} length={150}/>
		                    </Typography>
	                    </Box>
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
                    sx={{fieldset: {borderRadius: type === screenTypes.largeType ? '30px 0 0 30px' : '50px'}}}
                    maxRows={10}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") return submitPost() //submit
                    }}
                    ref={inputRef}
                />
                <Button sx={{ml: 1, borderRadius: type === screenTypes.largeType ? '4px' : '50px'}} variant="outlined" onClick={submitPost}>
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
                <Button sx={{ml: 9}} color={'error'} size="small" onClick={handleClose}>
                    Закрыть
                </Button>
            </Alert>
        </Snackbar>

    </Box>


}


export default EntryField;