import {collection, getDoc, onSnapshot, orderBy, query, doc} from 'firebase/firestore';
import React, {FC, useContext, useEffect, useMemo, useState} from 'react';
import {NavLink, useParams} from 'react-router-dom';
import {Context} from '../..';
import {Container, Box, Typography, Button} from "@mui/material";
import EntryField from '../EntryField';
import Messages from '../Messages';
import {useCollection, useDocumentData} from "react-firebase-hooks/firestore";
import { messagesType } from '../../types/messages';



const Chat: FC = () => {

    const {id} = useParams<{ id: string }>()

    const {firestore} = useContext(Context)!

    const [messages, setMessages] = useState<messagesType | null>(null);
    const [users, setUsers] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // const [value] = useCollection(query(collection(firestore, 'chat', 'public', `${id}`), orderBy('createdAt', 'asc')))
    const [documentValue] = useDocumentData(doc(firestore, 'chats',  `${id}`))

    useEffect(() => {
        console.log(documentValue)
        if (documentValue) {
            setMessages(documentValue.messages)
        }
    }, [documentValue]);


    const getUsers = async (arr: (any | string)[]) => {
        console.log(arr)
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

        console.log(usersData)
    }

    useEffect(() => {
        if (documentValue) {
            console.log()
            getUsers(documentValue.users)
        }
    }, [documentValue]);


    if (isLoading) return (
        <Box sx={{backgroundColor: '#0d47a1', py: 3}}>
            <Container sx={{backgroundColor: '#121212', borderRadius: 1, py: 2, boxShadow: 6}}>
                <Messages users={users} chatId={id} messages={messages} firestore={firestore}/>
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
        <Box sx={{backgroundColor: '#0d47a1', py: 3}}>
            <Container sx={{backgroundColor: '#121212', borderRadius: 1, py: 2, boxShadow: 6}}>
                <Messages chatId={id} users={users} messages={messages} firestore={firestore}/>
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
