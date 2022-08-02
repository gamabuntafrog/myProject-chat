import React, {FC, useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {arrayRemove, collection, doc, getDoc, limit, orderBy, query, updateDoc} from "firebase/firestore";
import {Avatar, Box, Button, ListItem, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
// @ts-ignore
import EllipsisText from "react-ellipsis-text";
import { TailSpin } from 'react-loader-spinner';

const MyChatsItem: FC<{chatId: string, filterValue: string, setIsChatListOpen: any}> = ({chatId, filterValue,setIsChatListOpen}) => {

    const {user: me, firestore} = useContext(Context)!
    const [user, setUser] = useState<null | any>(null);
    const [chat, isLoading] = useDocumentData(doc(firestore, 'chats',`${chatId}`))
    const [messages, isMessagesLoading] = useCollectionData(query(collection(firestore, 'chats',`${chatId}`, 'messages'),
        orderBy('createdAt', 'desc'), limit(1)
    ))
    const [isUserLoading, setIsUserLoading] = useState(true);

    const getUser = async (userId: string) => {
        try {
            const userData = await getDoc(doc(firestore, 'users', userId))
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

    if  (isUserLoading && isMessagesLoading && isLoading) {
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
            <NavLink className={isActive => isActive ? 'activeChat' : 'chatLink'} style={{
                color: 'white',
                padding: '0 10px',
                marginBottom: '5px',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
            }} onClick={() => setIsChatListOpen(false)} to={`/chat/${chat.chatId}`} key={chat.chatId} >
                <ListItem sx={{justifyContent: 'start', px: 0}} >
                    <Avatar sx={{mr: 2}} src={chat.chatImage ? chat.chatImage : blackBackground}/>
                    <Box sx={{overflow: 'hidden'}}>
                        <Typography sx={{fontWeight: '800'}}>
                            {chat.chatName}
                        </Typography>
                        <Box display={'flex'} alignItems={'baseline'} sx={{whiteSpace: 'nowrap'}}>
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
            <ListItem sx={{display: 'none'}}>

            </ListItem>
        )
    } else {
        return (
            <ListItem sx={{justifyContent: 'center', display: 'flex', flexDirection: 'column'}} >
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