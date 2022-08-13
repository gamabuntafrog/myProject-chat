import {collection, doc, getDoc, orderBy, query,} from 'firebase/firestore';
import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import {NavLink, useParams} from 'react-router-dom';
import {Context} from '../..';
import {Box, Button, Typography} from "@mui/material";
import EntryField from '../EntryField';
import Messages from '../Messages';
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {messagesExemplar, messagesType, replyMessageType} from '../../types/messages';
import MyChats from "../MyChats";
import './Chat.css';
import {chatContainer, chatSection, logo} from "./ChatStyles";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import Loader from "../Loader";
import {justifyColumnCenter} from "../GeneralStyles";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Picker, {SKIN_TONE_MEDIUM_DARK} from 'emoji-picker-react';
import {ChatInfoContext, ChatListContext, ThemeContext} from "../../App";

export type emojiType = {
    activeSkinTone: string,
    emoji: string,
    names: string[]
    originalUnified: string,
    unified: string
}

const Chat: FC = () => {

    const {id} = useParams<{ id: string }>()
    const {firestore} = useContext(Context)!
    const {changeChatInfo} = useContext(ChatInfoContext)!
    const {handleIsChatListOpen, isChatListOpen} = useContext(ChatListContext)!
    const [messages, setMessages] = useState<messagesType[] | null>(null);
    const [users, setUsers] = useState<null | any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [isChatListOpen, setIsChatListOpen] = useState(false);
    const [replyMessageInfo, setReplyMessageInfo] = useState(null);
    const [isReplying, setIsReplying] = useState(false);
    const [isChatChanging, setIsChatChanging] = useState(false);

    const [chosenEmoji, setChosenEmoji] = useState<null | emojiType>(null);



    const type = useGetTypeOfScreen()
    const mediumOrSmallType = (type === screenTypes.mediumType || type === screenTypes.smallType);
    const smallType = type === screenTypes.smallType
    const mediumType = type === screenTypes.mediumType

    const chatRef = doc(firestore, 'chats',  `${id}`)
    const [chatData] = useDocumentData<any>(chatRef)

    const messagesRef = collection(firestore, 'chats',  `${id}`, 'messages')
    const [messagesCollection] = useCollectionData<any>(query(messagesRef, orderBy('createdAt')))

    const usersRef = collection(firestore, 'chats',  `${id}`, 'users')
    const [subscribedUsersCollection] = useCollectionData<any>(usersRef)


    const listRef = useRef<null | HTMLUListElement>(null);

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
        if (chatData) {
            changeChatInfo(chatData)
        }

    }, [chatData]);


    useEffect(() => {
        let unsubscribed = false

        if (subscribedUsersCollection) {
            const fetchUsersWrapperFunction = async () => {
                if (!unsubscribed) {
                    const users = await getUsers(subscribedUsersCollection)
                    setUsers(users)
                    setIsLoading(false)
                    setIsChatChanging(false)
                }
            }
            fetchUsersWrapperFunction()
        }

        return () => {
            unsubscribed = true
        }
    }, [subscribedUsersCollection]);

    useEffect(() => {
        setIsChatChanging(true)

    }, [id]);



    const onEmojiClick = (_: any, emojiObject: emojiType) => {
        console.log(emojiObject)
        setChosenEmoji(emojiObject);
    };

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


        return usersData
    }

    const showRepliedMessage = (repliedMessage: replyMessageType | messagesType) => {
        let indexOfReplyerMessage
        if (repliedMessage.messageType === messagesExemplar.replyMessage) {
            indexOfReplyerMessage = messages?.findIndex((message: messagesType, i) => {
                return repliedMessage.replyer.messageId === message.messageId
            })
        } else {
            indexOfReplyerMessage = messages?.findIndex((message: messagesType, i) => {
                return repliedMessage.messageId === message.messageId
            })
        }

        if (indexOfReplyerMessage && indexOfReplyerMessage >= 0) {
            const child = listRef.current!.children[indexOfReplyerMessage]
            child.scrollIntoView({block: 'center', behavior: "smooth"})
            const focusMessage = () => {
                if (isInViewport(child)) {
                    child.classList.add('focus')

                    setTimeout(() => {
                        child.classList.remove('focus')
                        listRef.current!.removeEventListener('scroll', focusMessage)
                    }, 1500)
                }
            }
            focusMessage()
            listRef.current!.addEventListener('scroll', focusMessage)
        }
        function isInViewport(element: any) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    }

    const showMessageOnReply = (repliedMessage: messagesType) => {
        const indexOfReplyerMessage = messages?.findIndex((message: messagesType, i) => {
            return repliedMessage.messageId === message.messageId
        })

        if (indexOfReplyerMessage && indexOfReplyerMessage >= 0) {
            const child = listRef.current!.children[indexOfReplyerMessage]
            child.scrollIntoView({block: 'center', behavior: "smooth"})
            const focusMessage = () => {
                if (isInViewport(child)) {
                    child.classList.add('focus')

                    setTimeout(() => {
                        child.classList.remove('focus')
                        listRef.current!.removeEventListener('scroll', focusMessage)
                    }, 1500)
                }
            }
            focusMessage()
            listRef.current!.addEventListener('scroll', focusMessage)
        }
        function isInViewport(element: any) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    }

    const {userStyles} = useContext(ThemeContext)!
    const inputRef = useRef<null | HTMLInputElement>(null);

    if (isLoading) return (
        <Box sx={chatSection(type)}>
            <Loader/>
        </Box>
    )

    if (id && users && messages) {
        return (
                <Box sx={chatSection(type)}>
                    <MyChats id={id} handleIsChatListOpen={handleIsChatListOpen} isChatListOpen={isChatListOpen} />
                    <Box sx={chatContainer(mediumOrSmallType, userStyles.backgroundImage ,  userStyles.backgroundColor)}>
                        <Messages
                            chatId={id}
                            subscribedUsers={users}
                            messages={messages}
                            setIsReplying={setIsReplying}
                            setReplyMessageInfo={setReplyMessageInfo}
                            isChatChanging={isChatChanging}
                            showRepliedMessage={showRepliedMessage}
                            listRef={listRef}
                            chatInfo={chatData}
                            inputRef={inputRef}
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
                            isChatListOpen={isChatListOpen}
                            showMessageOnReply={showMessageOnReply}
                            listRef={listRef}
                            inputRef={inputRef}
                            emoji={chosenEmoji}
                        />
                    </Box>
                    <Box sx={{width: smallType ? 0 : mediumType ? '35%' : '20%', borderLeft: '1px solid #363636'}}>
                        <Picker
                            onEmojiClick={onEmojiClick}
                            disableAutoFocus={true}
                            skinTone={SKIN_TONE_MEDIUM_DARK}
                            groupNames={{ smileys_people: 'PEOPLE' }}
                            native
                            pickerStyle={{width: '100%', height: '100%', overflowX: 'hidden', border: 'none', background: userStyles.secondBackgroundColor || '#121212', color: 'white', }}
                        />
                        {/*    <img src={'https://media0.giphy.com/media/UO5elnTqo4vSg/giphy.gif?cid=790b761149852ac594a94121e9ce7bca2c034d663fc5b726&rid=giphy.gif&ct=g'}/>*/}

                    </Box>
                </Box>
        );
    } else if (!id) {
        return (
            <Box sx={chatSection(type)}>
                <MyChats id={id} handleIsChatListOpen={handleIsChatListOpen} isChatListOpen={isChatListOpen} />
                <Box sx={chatContainer(mediumOrSmallType, userStyles.backgroundImage, userStyles.backgroundColor, true)}/>
            </Box>
        )
    } else {
        return (
            <Box sx={chatSection(type)}>
                <MyChats handleIsChatListOpen={handleIsChatListOpen} isChatListOpen={isChatListOpen} />
                <Box sx={chatContainer(mediumOrSmallType, userStyles.backgroundImage, userStyles.backgroundColor, true)}>
                    <Box sx={{maxWidth: '75%', mx: 'auto', ...justifyColumnCenter}}>
                        <Typography
                            sx={{mt: '20%'}}
                            variant={'h3'}>Чата по id: {id} не существует
                        </Typography>
                        {type !== screenTypes.largeType &&
                            <Button sx={{mt: 10}} size='large' variant={'contained'} onClick={() => handleIsChatListOpen(isChatListOpen)}>
                                Ваши чаты
                            </Button>
                        }
                        <Button size='large' sx={{mt: 1}} variant={'contained'}>
                            <NavLink className={'nav-link'} to={'/search'} style={{textDecoration: 'none', color: 'inherit',}}>
                                Поиск
                            </NavLink>
                        </Button>
                    </Box>
                </Box>
            </Box>
        )
    }
}

export default Chat;
