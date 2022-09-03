import {collection, doc, getDoc, orderBy, query, setDoc,} from 'firebase/firestore';
import React, {FC, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {NavLink, useParams} from 'react-router-dom';
import {Context} from '../..';
import {Box, Button, ImageList, ImageListItem, TextField, Typography} from "@mui/material";
import EntryField from '../EntryField';
import Messages from '../Messages';
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {
    gifMessageType,
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
import shortid from "shortid";
// @ts-ignore
import {debounce} from 'lodash-es'
import Media from "../Media";
import {CSSTransition} from "react-transition-group";


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

export type gifType = {
    id: string,
    itemurl: string,
    media_formats: {
        gif: { url: string, dims: string[], duration: number, size: number},
        nanogif: { url: string, dims: string[], duration: number, size: number},
        mediumgif: { url: string, dims: string[], duration: number, size: number}
    },
    tags: string,
    title: string,
    url: string
}

export enum updateQueryActionTypes {
    makeNewQuery,
    getMoreGifs
}

const Chat: FC = () => {

    const {id} = useParams<{ id: string }>()
    const {firestore, user} = useContext(Context)!
    const {changeChatInfo} = useContext(ChatInfoContext)!
    const {handleIsChatListOpen, isChatListOpen} = useContext(ChatListContext)!
    const [messages, setMessages] = useState<[messagesType[]] | null>(null);
    const [users, setUsers] = useState<null | any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [replyMessageInfo, setReplyMessageInfo] = useState(null);
    const [isReplying, setIsReplying] = useState(false);
    const [isChatChanging, setIsChatChanging] = useState(false);
    const [showGifs, setShowGifs] = useState<boolean>(false);
    const {isChatInfoOpen, handleChatInfoIsOpen} = useContext(ChatInfoContext)!
    const [showMedia, setShowMedia] = useState(false);
    const [chosenEmoji, setChosenEmoji] = useState<null | emojiType>(null);

    const [messagesWhichOnProgress, setMessagesWhichOnProgress] = useState<null | messagesWhichOnProgressType[]>(null);
    const {screenType, isMobile, isMobileOrTablet} = useGetTypeOfScreen()

    const chatRef = doc(firestore, 'chats',  `${id}`)
    const [chatData] = useDocumentData<any>(chatRef)

    const messagesRef = collection(firestore, 'chats',  `${id}`, 'messages')
    const [messagesCollection] = useCollectionData<any>(query(messagesRef, orderBy('createdAt')))

    const usersRef = collection(firestore, 'chats',  `${id}`, 'users')
    const [subscribedUsersCollection] = useCollectionData<any>(usersRef)

    const chatReactRef = useRef<null | HTMLDivElement>(null);
    const listRef = useRef<null | HTMLUListElement>(null);

    const {userStyles} = useContext(ThemeContext)!
    const inputRef = useRef<null | HTMLInputElement>(null);

    useEffect(() => {
        if (messagesCollection && chatData) {
            try {
                // console.log(messagesCollection)
                const groupedMessages = messagesCollection.map((message, i) => {
                    const nextMessages: messagesType[] = [message]

                    const messageIndex = i

                    if (messagesCollection[i - 1]?.userId === message.userId) return

                    for (let i = messageIndex; i < messagesCollection.length; i++) {
                        const currentMessage = messagesCollection[i]
                        const prevMessage = messagesCollection[i - 1]
                        const nextMessage = messagesCollection[i + 1]
                        const isNextMessageMy = nextMessage?.userId === currentMessage.userId

                        if (isNextMessageMy) nextMessages.push(nextMessage)
                        if (!isNextMessageMy) break
                    }

                    return nextMessages
                })
                const filteredMessages = groupedMessages.filter((messages) => messages !== undefined)
                console.log(filteredMessages)
                // @ts-ignore
                setMessages(filteredMessages)
            } catch (e) {
                console.log(e)
                setIsLoading(false)
            }
        }
    }, [messagesCollection]);

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




    const onEmojiClick = useCallback(
        (_: any, emojiObject: emojiType) => {
            setChosenEmoji(emojiObject);
        }, []
    );


    const getUsers = async (subscribedUsersList: {userId: string, isAdmin: boolean}[]) => {

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

    const showRepliedMessage = useCallback(
        (repliedMessage: replyMessageType | messageType, actionType: showRepliedMessageActionTypes) => {
            console.log(messages);
            let indexOfMessagesGroup = -1
            let indexOfReplyerMessage = -1

            if (actionType === showRepliedMessageActionTypes.showRepliedMessage && repliedMessage.messageType === messagesExemplar.replyMessage) {
                messages?.forEach((messages: messagesType[], i) => {
                    const finding = messages.findIndex((message) => repliedMessage.replyer.messageId === message.messageId);
                    if (finding >= 0) {
                        indexOfReplyerMessage = finding
                        indexOfMessagesGroup = i
                    }
                })
            } else {
                messages?.forEach((messages: messagesType[], i) => {
                    const finding = messages.findIndex((message) => repliedMessage.messageId === message.messageId);
                    if (finding >= 0) {
                        indexOfReplyerMessage = finding
                        indexOfMessagesGroup = i
                    }
                })
            }

            if (indexOfMessagesGroup >= 0 && indexOfReplyerMessage >= 0) {
                const group = listRef.current!.children[indexOfMessagesGroup]
                const list = group.children[1]
                const child = list.children[indexOfReplyerMessage]

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
        },
        [id, messages],
    );



    const focusOnInput = useCallback(() => {
        inputRef?.current!.focus()
    }, [])



    if (isLoading) return (
        <Box sx={chatSection(screenType)}>
            <Loader/>
        </Box>
    )

    if (id && users && messages) {
        return (
                <Box ref={chatReactRef} sx={chatSection(screenType)}>
                    <MyChats id={id} handleIsChatListOpen={handleIsChatListOpen} isChatListOpen={isChatListOpen} />
                    <Box className='chat-container' sx={chatContainer(isMobileOrTablet, userStyles.backgroundImage ,  userStyles.backgroundColor)}>
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
                            messagesArray={messages}
                            setIsReplying={setIsReplying}
                            setReplyMessageInfo={setReplyMessageInfo}
                            isChatChanging={isChatChanging}
                            showRepliedMessage={showRepliedMessage}
                            listRef={listRef}
                            chatInfo={chatData}
                            focusOnInput={focusOnInput}
                            messagesWhichOnProgress={messagesWhichOnProgress}
                            chatReactRef={chatReactRef}
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
                            setShowMedia={setShowMedia}
                        />
                    </Box>
                    <Media
                        showGifs={showGifs}
                        setShowGifs={setShowGifs}
                        onEmojiClick={onEmojiClick}
                        userStyles={userStyles}
                        setShowMedia={setShowMedia}
                        showMedia={showMedia}
                        chatId={chatData?.chatId}
                    />
                </Box>

        );
    } else if (!id) {
        return (
            <Box sx={chatSection(screenType)}>
                <MyChats id={id} handleIsChatListOpen={handleIsChatListOpen} isChatListOpen={isChatListOpen} />
                <Box sx={chatContainer(isMobileOrTablet, userStyles.backgroundImage, userStyles.backgroundColor,)}/>
            </Box>
        )
    } else {
        return (
            <Box sx={chatSection(screenType)}>
                <MyChats handleIsChatListOpen={handleIsChatListOpen} isChatListOpen={isChatListOpen} />
                <Box sx={chatContainer(isMobileOrTablet, userStyles.backgroundImage, userStyles.backgroundColor)}>
                    <Box sx={{maxWidth: '75%', mx: 'auto', ...justifyColumnCenter}}>
                        <Typography
                            sx={{mt: '20%'}}
                            variant={'h3'}>Чата по id: {id} не существует
                        </Typography>
                        {screenType !== screenTypes.largeType &&
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
