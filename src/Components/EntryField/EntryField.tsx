import React, {FC, useContext, useState} from "react";
import shortid from 'shortid';
import {NavLink, useParams} from "react-router-dom";
import {addDoc, collection, setDoc, doc, arrayUnion, updateDoc} from "firebase/firestore";
import {Context} from "../..";
import {TextField, Box, Button, Typography, Snackbar, Alert, AlertTitle, Avatar, List, ListItem} from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import Modal from "../Modal";
import UserModalInfo from "../UserModalInfo";
import '../../App.css';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usersArray, setUsersArray] = useState<any | null>(users ? Object.entries(users) : null);
    const [userModalInfo, setUserModalInfo] = useState<null | any>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const submitPost = async () => {

        if (message.trim() === '') {
            setOpen(true)
            return
        }

        if (user) {
            if (!users[user.userId]) {
                console.log(user.userId)
                await updateDoc(doc(firestore, 'chats', `${id}`), {
                    users: arrayUnion({
                        userId: user.userId
                    })
                })
            }
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

    return <Box>
        {isUserModalOpen &&
            <Modal isModalOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
	            <Avatar sx={{width: 200, height: 200}} src={`${userModalInfo.photoURL}`} alt="avatar"/>
                <NavLink style={{color: 'white'}} to={`/user/${userModalInfo.userId}`}>
		            <Typography sx={{mt: 1}} variant={'h5'}>{userModalInfo.nickname}</Typography>
	            </NavLink>
	            <Typography  variant={'subtitle1'}>{userModalInfo.bio}</Typography>
            </Modal>
        }
        <Box sx={{my: 1, mx: 1, display: 'flex'}} >
            <Typography sx={{my: 1, mx: 1}} variant={'body1'}>{id} | {chatName}</Typography>
            <Button onClick={() => setIsModalOpen(true)} sx={{ml: 1}}>Информация</Button>
        </Box>
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
        {isModalOpen &&
            <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
	            <Avatar sx={{width: '200px', height: '200px', mb: 3}} src={chatImage}/>
                <Typography variant={'h2'} sx={{fontWeight: '800'}}>{chatName}</Typography>
                <Typography variant={'subtitle1'} sx={{my: 3}}>{chatDescription}</Typography>
	            <Typography variant='h5'>Пользователи ({usersArray.length}):</Typography>
                <List sx={{width: '100%'}}>
                    {usersArray?.map((el: any, i: number) => {
                        const user = el[1]
                        const {bio, userId, nickname, photoURL} = user

                        return <ListItem className={'typography'} onClick={() => {
                            setUserModalInfo(user)
                            setIsUserModalOpen(true)
                        }} sx={{display: 'flex',  justifyContent: 'center'}} key={i}>
                            <Avatar sx={{width: '50px', height: '50px'}} src={user.photoURL}/>
                            <Typography sx={{ml: 1}} >
                                {nickname}
                            </Typography>

                        </ListItem>
                    })}
                </List>
            </Modal>
        }
    </Box>


}


export default EntryField;