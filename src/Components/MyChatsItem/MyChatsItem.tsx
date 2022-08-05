import React, {FC, useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {arrayRemove, collection, doc, getDoc, limit, orderBy, query, updateDoc} from "firebase/firestore";
import {Avatar, Box, Button, ListItem, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import { TailSpin } from 'react-loader-spinner';
import EllipsisText from "react-ellipsis-text";
import {item, itemMessagesWrapper, itemWrapper, listIfNoContent} from "./MyChatsItemStyles";
import '../../App.css';
import './MyChatsItem.css';

type MyChatsItemPT = {
    chatId: string,
    filterValue: string,
    setIsChatListOpen: React.Dispatch<React.SetStateAction<boolean>>
}


const MyChatsItem: FC<MyChatsItemPT> = ({chatId, filterValue, setIsChatListOpen}) => {

    const {user: me, firestore} = useContext(Context)!
    const [user, setUser] = useState<null | any>(null);
    const [isUserLoading, setIsUserLoading] = useState(true);

    const chatRef = doc(firestore, 'chats',`${chatId}`)
    const [chat, isLoading] = useDocumentData(chatRef)

    const messagesRef = collection(firestore, 'chats',`${chatId}`, 'messages')
    const [messages, isMessagesLoading] = useCollectionData(query(messagesRef,
        orderBy('createdAt', 'desc'), limit(1)
    ))




    const getUser = async (userId: string) => {
        try {
            const userRef = doc(firestore, 'users', userId)
            const userData = await getDoc(userRef)
            if (userData) {
                setUser(userData.data())
            }
        } catch (e) {
            console.log(e)
        } finally {
            setIsUserLoading(false)
        }
    }

    const isFilteredSuccess = chat?.chatName.toLowerCase().includes(filterValue.toLowerCase())

    const unsubscribeFromChat = async (chatId: string) => {
        await updateDoc(doc(firestore, 'users', `${me?.userId}`), {
            subscribedChats: arrayRemove(chatId)
        })
    }

    useEffect( () => {
        try {
            if (messages && messages.length > 0) {
                const lastMessage = messages[0]
                getUser(lastMessage.userId)
            }
        } catch (e) {
            console.log(e)
            setIsUserLoading(false)
        }
    }, [messages]);

    if (isUserLoading && isMessagesLoading && isLoading) {
        return (
            <ListItem>
                <TailSpin color="#00BFFF" height={50} width={50} />
            </ListItem>
        )
    }

    const blackBackground = 'https://www.tynker.com/minecraft/api/block?id=5993332e76f2936e3f8b4586&w=400&h=400&width=400&height=400&mode=contain&format=jpg&quality=75&cache=max&v=1502819118'

    if (chat && messages && user && isFilteredSuccess) {
        const lastMessage = messages[0].message
        // console.log(chat)
        // console.log(user)
        // console.log(messages)
        return (
            <NavLink
                className={isActive => isActive ? 'activeChat' : 'chatLink'}
                style={itemWrapper} onClick={() => setIsChatListOpen(false)}
                to={`/chat/${chat.chatId}`}
                key={chat.chatId}
            >
                <ListItem sx={item} >
                    <Avatar sx={{mr: 2}} src={chat.chatImage ? chat.chatImage : blackBackground}/>
                    <Box sx={{overflow: 'hidden'}}>
                        <Typography sx={{fontWeight: '800'}}>
                            {chat.chatName}
                        </Typography>
                        <Box sx={itemMessagesWrapper}>
                            <Typography variant={'subtitle2'} sx={{mr: 1}}>
                                <EllipsisText text={`${user.nickname}:`} length={30}/>
                            </Typography>
                            <Typography variant={'body2'} sx={{mr: 1}}>
                                <EllipsisText text={lastMessage} length={30}/>
                            </Typography>
                        </Box>
                    </Box>
                </ListItem>
            </NavLink>
        )
    } else if (chat && messages && user) {
        return (
            <ListItem sx={{display: 'none'}} />
        )
    } else {
        return (
            <ListItem sx={listIfNoContent} >
                <Typography >
                    Ошибка
                </Typography>
                <Button variant={'outlined'} color={'error'} sx={{ml: 1}} onClick={() => {
                    unsubscribeFromChat(chatId)
                }}>Отписаться</Button>
            </ListItem>
        )
    }
}

export default MyChatsItem