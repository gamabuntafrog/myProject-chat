import {collection, getDoc, onSnapshot, orderBy, query, doc} from 'firebase/firestore';
import React, {FC, useContext, useEffect, useMemo, useState} from 'react';
import {NavLink, useParams} from 'react-router-dom';
import {Context} from '../..';
import {Container, Box, Typography, Button} from "@mui/material";
import EntryField from '../EntryField';
import Messages from '../Messages';
import {useCollection, useDocumentData} from "react-firebase-hooks/firestore";
import { messagesType } from '../../types/messages';
import MyChats from "../MyChats";
import './Chat.css';


const Chat: FC = () => {

    const {id} = useParams<{ id: string }>()

    const {firestore, user} = useContext(Context)!

    const [messages, setMessages] = useState<messagesType | null>(null);
    const [users, setUsers] = useState<null | any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isChatListOpen, setIsChatListOpen] = useState(false);
    // console.log(user)
    console.log(users)

    const [documentValue] = useDocumentData(doc(firestore, 'chats',  `${id}`))

    useEffect(() => {
        // console.log(documentValue)
        if (documentValue) {
            setMessages(documentValue.messages)
            // console.log(documentValue.users)
            getUsers(documentValue.users)
        }
    }, [documentValue, id]);


    const getUsers = async (arr: {userId: string}[]) => {
        const promiseArray = arr.map( async (el) => {
            return await getDoc(doc(firestore, 'users',`${el.userId}`))
        })

        const usersData: any = {}
        await Promise.all(promiseArray).then(el => {
            el.forEach(obj => {
                usersData[obj.id] = obj.data()
            })
        })

        setUsers(usersData)
        setIsLoading(false)

        // console.log(usersData)
    }


    if (isLoading) return (
        <Box sx={{backgroundColor: '#0d47a1', py: 3,  height: '100vh', pt: '56px'}}>
            <Container sx={{backgroundColor: '#121212', borderRadius: 1, py: 2, boxShadow: 6}}>
                <Messages getUsers={getUsers}  subscribedUsers={users} chatId={id} messages={messages} firestore={firestore}/>
            </Container>
        </Box>
    )

    if (!messages) return (
        <Container sx={{textAlign: 'center'}}>
            <Typography
                sx={{mt: '20%'}}
                variant={'h3'}>Чата по id: {id} не существует
            </Typography>
            <Button size='large' sx={{mt: '15%'}} variant={'outlined'}>
                <NavLink className={'nav-link'} to={'/search'} style={{textDecoration: 'none', color: 'inherit',}}>
                    Поиск
                </NavLink>
            </Button>
        </Container>
    )


    return (
        <Box sx={{backgroundColor: '#0d47a1', overflowY: 'none', pt: '56px', minHeight: '100vh', display: 'flex'}}>
            <MyChats messages={messages} setIsChatListOpen={setIsChatListOpen} isChatListOpen={isChatListOpen} users={users} />
            {!isChatListOpen &&
                <Button className={'open-chat-button'}  onClick={() => setIsChatListOpen(true)} variant={'contained'} sx={{position: 'fixed', zIndex: '101', top: '80px', left: '10px'}}>Чаты</Button>
            }
            <Container sx={{backgroundColor: '#121212', borderRadius: 1, py: 2, boxShadow: 6, maxWidth: '100% !important', margin: 0, zIndex: '100'}}>
                <Messages getUsers={getUsers} chatId={id} subscribedUsers={users} messages={messages} firestore={firestore}/>
                <EntryField
                    users={users}
                    chatName={documentValue?.chatName}
                    chatDescription={documentValue?.chatDescription}
                    chatId={id}
                    chatImage={documentValue?.chatImage}
                />
            </Container>
        </Box>

    );
}

export default Chat;
