import React, {useContext, useEffect, FC, useState, useRef,} from "react";
import {Context} from "../..";
import {doc, deleteDoc, where, getDoc, query, collection, updateDoc, arrayRemove} from "firebase/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import {Box, Avatar, Typography, Button, List, ListItem} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from "../Loader";
import {MessagesPropTypes} from "../../types/MessagesPT";
import {messageType} from "../../types/messages";
import UserModalInfo from "../UserModalInfo";


const Messages: FC<MessagesPropTypes> = ({chatId, messages, firestore, users}) => {

    const {auth, user: me} = useContext(Context)!
    const [userModalInfo, setUserModalInfo] = useState<null | any>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const boxRef = useRef(null);

    console.log(messages)
    useEffect(() => {
        const body = document.querySelector('body')

        scrollToBottom(body)
    }, [messages])

    const onDelete = async (message: any) => {
        console.log(message)
        // await deleteDoc(doc(firestore, 'chat', 'public', `${chatId}`, `${message.docId}`))
        const {createdAt} = message
        await updateDoc(doc(firestore, 'chats', `${chatId}`), {
            messages: arrayRemove(message)
        })
    }

    const scrollToBottom = (body: any) => {
        window.scrollTo({top: body.offsetHeight, behavior: "smooth"})
    }
    console.log()
    useEffect(() => {
        if (isUserModalOpen) {
            // @ts-ignore
            boxRef?.current?.addEventListener('click', () => {
                setIsUserModalOpen(false)
            })
        }
        // @ts-ignore
        return  boxRef?.current?.removeEventListener('click', () => {
            setIsUserModalOpen(false)
        })
    }, [isUserModalOpen]);

    if (!messages && !users) {
        return <List sx={{minHeight: '90vh'}}>
            <Loader/>
        </List>
    }
    if (me) {
        return (
            <>
                {isUserModalOpen && <UserModalInfo modalInfo={userModalInfo}/>}
            <List ref={boxRef} sx={{minHeight: '80vh'}}>
                {users && messages?.map((el: any, i: any) => {
                    if (el.startMessage) return <ListItem sx={{justifyContent: 'center'}} key={el.createdAt}>
                        <Typography variant={'subtitle1'}>{el.startMessage}</Typography></ListItem> //это просто сообщение "начало чата"
                    const id = el.userId
                    const user = users[id]
                    // console.log(user)
                    const currentUser = el.userId === me?.userId;
                    // console.log(currentUser)
                    switch (currentUser) {
                        case true:
                            return (<ListItem sx={{paddingLeft: 0, paddingRight: 0}} key={el.createdAt}>
                                <Box onClick={(e) => {
                                    const {pageX, pageY} = e
                                    if (user) {
                                        setIsUserModalOpen(true)
                                        setUserModalInfo({user, pageX, pageY})
                                    }
                                }} sx={{mr: 3, cursor: 'pointer'}}>
                                    <Avatar sx={{width: 50, height: 50}} src={`${user?.photoURL}`} alt="avatar"/>
                                </Box>
                                <Box sx={{flexGrow: 1}}>
                                    <Typography onClick={(e) => {
                                        const {pageX, pageY} = e
                                        if (user) {
                                            setIsUserModalOpen(true)
                                            setUserModalInfo({user, pageX, pageY})
                                        }
                                    }} sx={{color: '#2196f3', cursor: 'pointer', display: 'inline-block'}} variant={'subtitle1'}>
                                        {user?.nickname}
                                    </Typography>
                                    <Typography variant={'body1'}>
                                        {el.message}
                                    </Typography>
                                </Box>
                                <Button color={'error'} onClick={() => onDelete(el)} sx={{minWidth: 30, padding: 0}}>
                                    <DeleteIcon/>
                                </Button>

                            </ListItem>)


                        case false:


                            return (<ListItem sx={{paddingLeft: 0, paddingRight: 0}} key={el.createdAt}>
                                <Box onClick={(e) => {
                                    const {pageX, pageY} = e
                                    if (user) {
                                        setIsUserModalOpen(true)
                                        setUserModalInfo({user, pageX, pageY})
                                    }
                                }} sx={{mr: 3, cursor: 'pointer'}}>
                                    <Avatar sx={{width: 50, height: 50}} src={`${user ? user.photoURL : el.photoURL}`} alt="avatar"/>
                                </Box>
                                <Box sx={{flexGrow: 1}}>
                                    <Typography onClick={(e) => {
                                        const {pageX, pageY} = e
                                        if (user) {
                                            setIsUserModalOpen(true)
                                            setUserModalInfo({user, pageX, pageY})
                                        }
                                    }} sx={{cursor: 'pointer', display: 'inline-block'}} variant={'subtitle1'}>
                                        {user ? user.nickname : el.nickname}
                                    </Typography>
                                    <Typography variant={'body1'}>
                                        {el.message}
                                    </Typography>
                                </Box>

                            </ListItem>)

                        default:
                            return <h1>s</h1>
                            break

                    }
                })}

            </List>
            </>
        )
    } else {
        return (
            <List ref={boxRef} sx={{minHeight: '80vh'}}>
                {users && messages?.map((el: any, i: any) => {
                    const id = el.userId
                    const user = users[id]
                    console.log(me)
                    console.log(el)
                    if (el.startMessage) {
                        return <ListItem sx={{justifyContent: 'center'}} key={el.createdAt}>
                            <Typography variant={'subtitle1'}>{el.startMessage}</Typography>
                        </ListItem> //это просто сообщение "начало чата"
                    }
                    return (<ListItem sx={{paddingLeft: 0, paddingRight: 0}} key={el.createdAt}>
                        <Box onClick={(e) => {
                            console.log(e)
                            const {pageX, pageY} = e
                            if (user) {
                                setIsUserModalOpen(true)
                                setUserModalInfo({user, pageX, pageY})
                            }
                        }} sx={{mr: 3, cursor: 'pointer', display: 'inline-block'}}>
                            <Avatar sx={{width: 50, height: 50, cursor: 'pointer'}} src={`${user ? user.photoURL : el.photoURL}`} alt="avatar"/>
                        </Box>
                        <Box sx={{flexGrow: 1}}>
                            <Typography variant={'subtitle1'}>
                                {user ? user.nickname : el.nickname}
                            </Typography>
                            <Typography variant={'body1'}>
                                {el.message}
                            </Typography>
                        </Box>

                    </ListItem>)
                })}
            </List>
        )
    }
}


export default Messages;