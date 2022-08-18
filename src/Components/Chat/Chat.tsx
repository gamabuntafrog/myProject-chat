import {collection, doc, getDoc, orderBy, query,} from 'firebase/firestore';
import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import {NavLink, useParams} from 'react-router-dom';
import {Context} from '../..';
import {Box, Button, ImageList, ImageListItem, Typography} from "@mui/material";
import EntryField from '../EntryField';
import Messages from '../Messages';
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {
    messagesExemplar,
    messagesType,
    messagesWhichOnProgressType,
    messageType,
    replyMessageType
} from '../../types/messages';
import MyChats from "../MyChats";
import './Chat.css';
import {chatContainer, chatSection} from "./ChatStyles";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import Loader from "../Loader";
import {justifyColumnCenter} from "../GeneralStyles";
import Picker, {SKIN_TONE_MEDIUM_DARK} from 'emoji-picker-react';
import {ChatInfoContext, ChatListContext, ThemeContext} from "../../App";
import ChatInfo from "../ChatInfo";

export type emojiType = {
    activeSkinTone: string,
    emoji: string,
    names: string[]
    originalUnified: string,
    unified: string
}

export enum showRepliedMessageActionTypes {
    showRepliedMessage,
    showMessage
}

const Chat: FC = () => {

    const {id} = useParams<{ id: string }>()
    const {firestore} = useContext(Context)!
    const {changeChatInfo} = useContext(ChatInfoContext)!
    const {handleIsChatListOpen, isChatListOpen} = useContext(ChatListContext)!
    const [messages, setMessages] = useState<messagesType[] | null>(null);
    const [users, setUsers] = useState<null | any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [replyMessageInfo, setReplyMessageInfo] = useState(null);
    const [isReplying, setIsReplying] = useState(false);
    const [isChatChanging, setIsChatChanging] = useState(false);

    const [chosenEmoji, setChosenEmoji] = useState<null | emojiType>(null);

    const [messagesWhichOnProgress, setMessagesWhichOnProgress] = useState<null | messagesWhichOnProgressType[]>(null);

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

    const {userStyles} = useContext(ThemeContext)!
    const inputRef = useRef<null | HTMLInputElement>(null);

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

    type gitType = {id: string, itemurl: string, media_formats: any, tags: string, title: string, url: string}
    const [gifs, setGifs] = useState<null | gitType[]>(null);




    const onEmojiClick = (_: any, emojiObject: emojiType) => {
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



    const showRepliedMessage = (repliedMessage: replyMessageType | messageType, actionType: showRepliedMessageActionTypes) => {
        let indexOfReplyerMessage
        if (actionType === showRepliedMessageActionTypes.showRepliedMessage && repliedMessage.messageType === messagesExemplar.replyMessage) {
            indexOfReplyerMessage = messages?.findIndex((message: messagesType, i) => {
                return repliedMessage!.replyer.messageId === message.messageId
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
        function isInViewport(element: Element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    }

    const focusOnInput = () => {
        inputRef?.current!.focus()
    }
    const {isChatInfoOpen, handleChatInfoIsOpen} = useContext(ChatInfoContext)!


    useEffect(() => {
        // AIzaSyBNi2GDdp3ksixybEfxpNQM-Y0cs-fI8Ds
        const fetchGifs = async () => {

            await fetch("https://tenor.googleapis.com/v2/search?q=excited&key=AIzaSyBNi2GDdp3ksixybEfxpNQM-Y0cs-fI8Ds&client_key=my_test_app&limit=14")
                .then(data => data.json())
                .then(data => {
                    console.log(data)
                    setGifs(data.results)
                })

        }
        fetchGifs()

    }, []);

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
                        {isChatInfoOpen &&
                            <ChatInfo
                                chatData={chatData}
                                users={users}
                                showRepliedMessage={showRepliedMessage}
                            />
                        }
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
                            focusOnInput={focusOnInput}
                            messagesWhichOnProgress={messagesWhichOnProgress}
                        />
                        <EntryField
                            users={users}
                            chatId={id}
                            isReplying={isReplying}
                            setIsReplying={setIsReplying}
                            replyMessageInfo={replyMessageInfo}
                            showRepliedMessage={showRepliedMessage}
                            inputRef={inputRef}
                            emoji={chosenEmoji}
                            setMessagesWhichOnProgress={setMessagesWhichOnProgress}
                        />
                    </Box>
                    <Box sx={{width: smallType ? 0 : mediumType ? '35%' : '20%', borderLeft: '1px solid #363636', height: 'auto', overflowY: 'auto'}}>
                        {/*
                            Зробити новий тип gifMessage
                            Щоб був одинокий як в телезі
                        */}

                        {gifs &&
                            <ImageList cols={2} gap={6} sx={{padding: 1, overflowY: 'auto'}}>
                                {gifs.map((gif) => {
                                    return (
                                        <ImageListItem sx={{overflow: 'hidden', borderRadius: 1}} key={gif.id}>
                                            <img src={gif.media_formats.gif.url}/>
                                        </ImageListItem>
                                    )
                                })}
                            </ImageList>
                        }
                        {/*<Picker*/}
                        {/*    onEmojiClick={onEmojiClick}*/}
                        {/*    disableAutoFocus={true}*/}
                        {/*    skinTone={SKIN_TONE_MEDIUM_DARK}*/}
                        {/*    groupNames={{ smileys_people: 'PEOPLE' }}*/}
                        {/*    native*/}
                        {/*    pickerStyle={{width: '100%', height: '100%', overflowX: 'hidden', border: 'none', background: userStyles.secondBackgroundColor || '#121212', color: 'white', }}*/}
                        {/*/>*/}
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
