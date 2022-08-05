import {collection, getDoc,orderBy, query, doc, } from 'firebase/firestore';
import React, {FC, useContext, useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router-dom';
import {Context} from '../..';
import {Container, Box, Typography, Button} from "@mui/material";
import EntryField from '../EntryField';
import Messages from '../Messages';
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import { messagesType } from '../../types/messages';
import MyChats from "../MyChats";
import './Chat.css';
import {chatContainer, chatSection} from "./ChatStyles";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import Loader from "../Loader";


const Chat: FC = () => {

    const {id} = useParams<{ id: string }>()

    const {firestore} = useContext(Context)!

    const [messages, setMessages] = useState<messagesType[] | null>(null);
    const [users, setUsers] = useState<null | any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isChatListOpen, setIsChatListOpen] = useState(false);
    const [replyMessageInfo, setReplyMessageInfo] = useState(null);
    const [isReplying, setIsReplying] = useState(false);
    const [isChatChanging, setIsChatChanging] = useState(false);

    const type = useGetTypeOfScreen()
    const mediumOrSmallType = (type === screenTypes.mediumType || type === screenTypes.smallType);

    const chatRef = doc(firestore, 'chats',  `${id}`)
    const [chatData] = useDocumentData(chatRef)

    const messagesRef = collection(firestore, 'chats',  `${id}`, 'messages')
    const [messagesCollection] = useCollectionData<any>(query(messagesRef, orderBy('createdAt')))

    const usersRef = collection(firestore, 'chats',  `${id}`, 'users')
    const [subscribedUsersCollection] = useCollectionData<any>(usersRef)

    useEffect(() => {
        if (messagesCollection && chatData) {
            try {
                setMessages(messagesCollection)
            } catch (e) {
                console.log(e)
                setIsLoading(false)
            }
        }
    }, [chatData, id, messagesCollection]);

    useEffect(() => {
        if (subscribedUsersCollection) {
            getUsers(subscribedUsersCollection)
        }

    }, [subscribedUsersCollection]);

    useEffect(() => {
        setIsChatChanging(true)
    }, [id]);


    const getUsers = async (subscribedUsersList: {userId: string, isAdmin: boolean}[]) => {
        // console.log(subscribedUsersList)

        const fetchedUsers = subscribedUsersList.map( async ({userId, isAdmin}) => {
            const document = await getDoc(doc(firestore, 'users',`${userId}`))
            return {document, isAdmin}
        })

        const usersData: any = {}
        const users = await Promise.all(fetchedUsers).then((documents) => {
            documents.forEach(({document, isAdmin}) => {
                // console.log(document)
                usersData[document.id] = {
                    ...document.data(),
                    isAdmin
                }
            })
        })

        setUsers(usersData)
        setIsLoading(false)
        setIsChatChanging(false)
    }


    if (isLoading) return (
        <Box sx={chatSection(type)}>
            <Loader/>
        </Box>
    )

    if (users && messages) {
        return (
            <Box sx={chatSection(type)}>
                <MyChats setIsChatListOpen={setIsChatListOpen} isChatListOpen={isChatListOpen} />
                <Box sx={chatContainer(mediumOrSmallType)}>
                    <Messages
                        chatId={id}
                        subscribedUsers={users}
                        messages={messages}
                        setIsReplying={setIsReplying}
                        setReplyMessageInfo={setReplyMessageInfo}
                        isChatChanging={isChatChanging}
                    />
                    <EntryField
                        users={users}
                        chatName={chatData?.chatName}
                        chatDescription={chatData?.chatDescription}
                        chatId={id}
                        chatImage={chatData?.chatImage}
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
