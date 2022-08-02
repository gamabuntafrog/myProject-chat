import {collection, getDoc, onSnapshot, orderBy, query, doc, updateDoc, arrayRemove} from 'firebase/firestore';
import React, {FC, useContext, useEffect, useMemo, useState} from 'react';
import {NavLink, useParams} from 'react-router-dom';
import {Context} from '../..';
import {Container, Box, Typography, Button} from "@mui/material";
import EntryField from '../EntryField';
import Messages from '../Messages';
import {useCollection, useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import { messagesType } from '../../types/messages';

import MyChats from "../MyChats";
import './Chat.css';
import {chatContainer} from "./ChatStyles";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";


const Chat: FC = () => {

    const {id} = useParams<{ id: string }>()

    const {firestore, user} = useContext(Context)!

    const [messages, setMessages] = useState<messagesType | null>(null);
    const [users, setUsers] = useState<null | any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isChatListOpen, setIsChatListOpen] = useState(false);
    const [replyMessageInfo, setReplyMessageInfo] = useState(null);
    const [isReplying, setIsReplying] = useState(false);
    // console.log(user)
    // console.log(users)
    const type = useGetTypeOfScreen()
    const mediumOrSmallType = (type === screenTypes.mediumType || type === screenTypes.smallType);

    const [documentValue] = useDocumentData(doc(firestore, 'chats',  `${id}`))
    const [messagesCollection] = useCollectionData(query(collection(firestore, 'chats',  `${id}`, 'messages'), orderBy('createdAt')))
    const [subscribedUsersCollection] = useCollectionData(collection(firestore, 'chats',  `${id}`, 'users'))

    // console.log(documentValue)
    // console.log(messagesCollection)
    // console.log(subscribedUsersCollection)
    useEffect(() => {
        if (messagesCollection && documentValue) {
            try {
                // @ts-ignore
                setMessages(messagesCollection)
                // console.log(optionMessages)

            } catch (e) {
                console.log(e)
                setIsLoading(false)
            }
        }
    }, [documentValue, id, messagesCollection]);

    useEffect(() => {
        if (subscribedUsersCollection) {
            // @ts-ignore
            getUsers(subscribedUsersCollection)
        }

    }, [subscribedUsersCollection]);


    const getUsers = async (arr: {userId: string, isAdmin: boolean}[]) => {
        console.log(arr)

        const promiseArray = arr.map( async ({userId, isAdmin}) => {
            const document = await getDoc(doc(firestore, 'users',`${userId}`))
            return {document, isAdmin}
        })

        const usersData: any = {}
        await Promise.all(promiseArray).then((el) => {
            el.forEach(({document, isAdmin}) => {
                console.log(document)
                usersData[document.id] = {
                    ...document.data(),
                    isAdmin
                }
            })
        })


        // console.log(usersData)
            setUsers(usersData)
            setIsLoading(false)

    }


    if (isLoading) return (
        <Box sx={{ overflowY: 'hidden', height: '100vh', display: 'flex', justifyContent: 'space-between', backgroundColor: '#0d47a1', pt: '64px'}}>
            <Container sx={{backgroundColor: '#121212', borderRadius: 1, py: 2, boxShadow: 6}}>
                <Messages
                    chatId={id}
                    subscribedUsers={users}
                    messages={messages}
                    firestore={firestore}
                    setIsReplying={setIsReplying}
                    setReplyMessageInfo={setReplyMessageInfo}
                />
            </Container>
        </Box>
    )

    if (users && messages) {
        return (
            <Box className={''} sx={{ overflowY: 'hidden', height: '100vh', display: 'flex', justifyContent: 'space-between', backgroundColor: '#0d47a1', pt: '64px'}}>
                <MyChats setIsChatListOpen={setIsChatListOpen} isChatListOpen={isChatListOpen} />
                <Box className={''} sx={chatContainer(mediumOrSmallType)}>
                    <Messages
                        chatId={id}
                        subscribedUsers={users}
                        messages={messages}
                        firestore={firestore}
                        setIsReplying={setIsReplying}
                        setReplyMessageInfo={setReplyMessageInfo}
                    />
                    <EntryField
                        users={users}
                        chatName={documentValue?.chatName}
                        chatDescription={documentValue?.chatDescription}
                        chatId={id}
                        chatImage={documentValue?.chatImage}
                        isReplying={isReplying}
                        setIsReplying={setIsReplying}
                        replyMessageInfo={replyMessageInfo}
                        setIsChatListOpen={setIsChatListOpen}
                        isChatListOpen={isChatListOpen}
                    />
                </Box>
            </Box>

        );
    } else {
        return (
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
    }
}

export default Chat;
