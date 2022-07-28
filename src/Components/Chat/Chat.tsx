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


const Chat: FC = () => {

    const {id} = useParams<{ id: string }>()

    const {firestore, user} = useContext(Context)!

    const [messages, setMessages] = useState<messagesType | null>(null);
    const [users, setUsers] = useState<null | any>(null);
    const [admins, setAdmins] = useState<null | any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isChatListOpen, setIsChatListOpen] = useState(false);
    const [replyMessageInfo, setReplyMessageInfo] = useState(null);
    const [isReplying, setIsReplying] = useState(false);

    // console.log(user)
    // console.log(users)

    const [documentValue] = useDocumentData(doc(firestore, 'chats',  `${id}`))
    const [testValue] = useCollectionData(collection(firestore, 'chats',  `${id}`, 'messages'))
    // console.log(testValue)
    useEffect(() => {
        // console.log(documentValue)
        if (documentValue) {
            setMessages(documentValue.messages)
            console.log(documentValue.messages.sort((a:any, b: any) => {
                return a.createdAt - b.createdAt
            }))
            getUsers(documentValue.users)
        }
    }, [documentValue, id]);

    const testDelete = async () => {

        await updateDoc(doc(firestore, 'chats', `${id}`), {
            messages: arrayRemove(
                // {
                // createdAt: 1658862202928,
                // message: "Hello",
                // userId: "w09cAjEAt6OS0pU1P8eKc2X3DWa2"
                // },
                // {
                //     createdAt: 1658862192113,
                //     message: "Здарова ",
                //     userId: "a8rognCR4tZOvHzJMrlU7HAkKpJ3"
                // },
            )
        })
    }

    const getUsers = async (arr: {userId: string, isAdmin: boolean}[]) => {
        console.log(arr)
        const adminsInfo = {}
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

        setUsers(usersData)
        setIsLoading(false)
        // console.log(usersData)
    }


    if (isLoading) return (
        <Box sx={{backgroundColor: '#0d47a1', py: 3,  height: '100vh', pt: '56px'}}>
            <Container sx={{backgroundColor: '#121212', borderRadius: 1, py: 2, boxShadow: 6}}>
                <Messages
                    chatId={id}
                    subscribedUsers={users}
                    messages={messages}
                    firestore={firestore}
                    setIsReplying={setIsReplying}
                    setReplyMessageInfo={setReplyMessageInfo}
                />            </Container>
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

    const test = () => {
        updateDoc(doc(firestore, 'chats', `${id}`), {
           users: {
               [id]: {
                   isAdmin: false,
                   userId: id
               }
           }
        })
    }

    return (
        <Box className={'chat'} sx={{backgroundColor: '#0d47a1', overflowY: 'none', minHeight: '100vh', display: 'flex'}}>
            <MyChats messages={messages} setIsChatListOpen={setIsChatListOpen} isChatListOpen={isChatListOpen} />
            {!isChatListOpen &&
                <Button className={'open-chat-button'}  onClick={() => setIsChatListOpen(true)} variant={'contained'} sx={{position: 'fixed', zIndex: '101', top: '80px', left: '10px'}}>Чаты</Button>
            }
            {/*<Button onClick={() => testDelete()}>Кнопка</Button>*/}
            <Container className={'chat__container'} sx={{backgroundColor: '#121212', py: 2, pb: 0, boxShadow: 6, maxWidth: '100% !important', zIndex: '100'}}>
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
                />
            </Container>
        </Box>

    );
}

export default Chat;
