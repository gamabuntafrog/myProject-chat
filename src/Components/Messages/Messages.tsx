import React, {FC, useContext, useEffect, useRef, useState,} from "react";
import {Context} from "../..";
import {doc, setDoc} from "firebase/firestore";
import {Avatar, Box, Button, IconButton, List, ListItem, TextField, Typography} from '@mui/material'
import Loader from "../Loader";
import UserModalInfo from "../UserModalInfo";
import {messagesExemplar, messagesType, replyMessageType} from '../../types/messages';
import MessageContextMenu from "../MessageContextMenu";
import EllipsisText from "react-ellipsis-text";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import {user} from "../../types/user";
import {
    activeUsername,
    avatarWrapper, dateMessage,
    messageContainer, messageLeftLine, messageListItem,
    messagesList, messageStyles,
    messageWrapper,
    userRole,
    userWrapper
} from "./MessagesStyles";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import './Messages.css';
import ReplyIcon from "@mui/icons-material/Reply";
import {useHistory} from "react-router-dom";
import {chatType} from "../../types/chatType";
import {format} from 'date-fns'
import {ThemeContext} from "../../App";

type MessagesPropTypes = {
    chatId: string,
    messages: messagesType[],
    subscribedUsers: any,
    setIsReplying: React.Dispatch<React.SetStateAction<boolean>>
    setReplyMessageInfo: React.Dispatch<React.SetStateAction<any>>,
    isChatChanging: boolean,
    showRepliedMessage: (message: replyMessageType) => void,
    listRef: React.MutableRefObject<HTMLUListElement | null>,
    chatInfo: chatType | undefined
}

const Messages: FC<MessagesPropTypes> = ({
    chatId,
    messages,
    subscribedUsers,
    setReplyMessageInfo,
    setIsReplying,
    isChatChanging,
    showRepliedMessage,
    listRef,
    chatInfo
}) => {

    const {user: me, firestore} = useContext(Context)!
    const [userModalInfo, setUserModalInfo] = useState<null | any>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [contextMenuInfo, setContextMenuInfo] = useState<any>(null);
    const [changeMessageInputValue, setChangeMessageInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [changingMessageId, setChangingMessageId] = useState('');
    const [replyMessages, setReplyMessages] = useState(null);

    const type = useGetTypeOfScreen()
    const isMobileOrMediumScreen = (type === screenTypes.smallType || type === screenTypes.mediumType)
    const isMobile = type === screenTypes.smallType

    const history = useHistory()

    useEffect(() => {
        if (listRef.current) {
            scrollToBottom()
        }
    }, [messages, replyMessages, listRef])

    const scrollToBottom = () => {
        listRef.current!.scrollTo({top: listRef.current!.scrollHeight})
    }


    useEffect(() => {
        if (isUserModalOpen) {
            listRef?.current?.addEventListener('click', () => {
                setIsUserModalOpen(false)
            })
        }
        if (isContextMenuOpen) {
            listRef?.current?.addEventListener('click', () => {
                setIsContextMenuOpen(false)
            })
        }

        return listRef?.current?.removeEventListener('click', () => {
            setIsUserModalOpen(false)
            setIsContextMenuOpen(false)
        })
    }, [isUserModalOpen, isContextMenuOpen]);

    useEffect(() => {
        const messagesObj: any = {}
        const messagesList = messages.forEach((message: messagesType) => {
                messagesObj[message.messageId] = message
        })
        setReplyMessages(messagesObj)
    }, [messages]);



    const onOpenContextMenu = (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLLIElement, MouseEvent> , message: messagesType, subscribedUser: user) => {
        console.log(e)

        const openContextMenu = () => {
            const {pageX, pageY} = e
            const isMe = subscribedUser.userId === me?.userId

            if (subscribedUser && isMe) {
                setContextMenuInfo({message, pageX, pageY, isMe: true})
            } else {
                setContextMenuInfo({message, pageX, pageY, isMe: false})
            }

            setIsContextMenuOpen(true)
        }

        console.log(e.type)

        switch (e.type) {
            case 'contextmenu':
                e.preventDefault()
                openContextMenu()
                break
            case 'click':
                if (type === screenTypes.smallType || type === screenTypes.mediumType) {
                    openContextMenu()
                }
                break
            default:
                return
        }

    }

    const showUserInfo = (e: React.MouseEvent<HTMLSpanElement>, user: user | undefined) => {
        const {pageX, pageY} = e

        if (user) {
            setIsUserModalOpen(true)
            setUserModalInfo({user, pageX, pageY})
        }
    }

    const changeMessage = async (message: messagesType) => {
        console.log(chatInfo)

        const newMessage = {...message, message: changeMessageInputValue, changedAt: Date.now()}
        console.log(newMessage)

        try {
            const messageRef = doc(firestore, 'chats', `${chatId}`, 'messages', `${message.messageId}`)
            await setDoc(messageRef, newMessage)


            if (chatInfo && chatInfo.lastMessage.messageId === message.messageId) {
                const chatRef = doc(firestore, 'chats', `${chatId}`)
                await setDoc(chatRef, {
                    lastMessage: newMessage
                }, {merge: true})

            }
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false)
            setChangingMessageId('')
            setChangeMessageInputValue('')
        }
    }
    const {userStyles, changeColor, changeBorderRadius} = useContext(ThemeContext)!



    if (!messages && !subscribedUsers && !me) {
        return <List sx={{minHeight: '90vh'}}>
            <Loader/>
        </List>
    }

    const blackBackground = 'https://www.tynker.com/minecraft/api/block?id=5993332e76f2936e3f8b4586&w=400&h=400&width=400&height=400&mode=contain&format=jpg&quality=75&cache=max&v=1502819118'

    const secondLastMessage = messages?.slice(messages?.length - 2, messages?.length - 1)

    return (
        <>
            {isChatChanging && <Loader spinColor={me?.nicknameColor}/>}
            {(me && isContextMenuOpen) && <MessageContextMenu
              modalInfo={contextMenuInfo}
              setReplyMessageInfo={setReplyMessageInfo}
              setIsReplying={setIsReplying}
              chatId={chatId}
              setIsContextMenuOpen={setIsContextMenuOpen}
              myId={me.userId}
              setChangingMessageId={setChangingMessageId}
              chatInfo={chatInfo}
              secondLastMessage={secondLastMessage}
              setChangeMessageInputValue={setChangeMessageInputValue}
            />}
            {isUserModalOpen && <UserModalInfo
              modalInfo={userModalInfo}
              setIsUserModalOpen={setIsUserModalOpen}
            />}
        <List ref={listRef} sx={messagesList(isMobileOrMediumScreen, me?.messagesBackground, userStyles?.backgroundColor)}>
            {subscribedUsers && replyMessages && messages?.map((message: messagesType, i: number) => {
                const createdAtFormatted = format(message.createdAt, 'HH mm').split(' ').join(':')

                if (message.messageType === messagesExemplar.startMessage) {
                    return (
                        <ListItem sx={{justifyContent: 'center', alignItems: 'baseline'}} key={message.createdAt}>
                            <Typography variant={'subtitle1'}>{message.message}</Typography>
                            <Typography sx={{fontSize: '12px', ml: 1}}>
                                {createdAtFormatted}
                            </Typography>
                        </ListItem>
                    )
                }

                const changedAtFormatted = message?.changedAt ? format(message.changedAt, 'HH mm').split(' ').join(':') : null

                const {userId, messageId, messageType} = message
                const subscribedUser = subscribedUsers[userId]
                const isMessageBeforeIsMine = messages[i - 1].userId === message.userId
                const isMessageAfterThisMine = messages[i + 1]?.userId === message.userId
                const isMessageChanging = message.messageId === changingMessageId

                if (messageType === messagesExemplar.replyMessage) {
                    const subscribedReplyerUser = subscribedUsers[message.replyer.userId]
                    const replyMessage: replyMessageType = replyMessages[message.replyer.messageId]
                        return (
                            <ListItem
                                className={'messageItem'}
                                onContextMenu={(e) => onOpenContextMenu(e, message, subscribedUser)}
                                sx={messageListItem(isMobile)}
                                key={messageId}
                            >
                                <Box onClick={(e) => showUserInfo(e, subscribedUser)} sx={avatarWrapper}>
                                    {!isMessageAfterThisMine ? <Avatar sx={{width: 50, height: 50}} src={subscribedUser?.photoURL} alt="avatar"/> : <Box sx={{width: 50}}/>}
                                </Box>
                                <Box  className='message' sx={messageWrapper(isMessageBeforeIsMine, isMessageAfterThisMine, isMobile, userStyles?.messagesBorderRadius)}>
                                    {!isMessageChanging ?
                                            <>
                                                <Box sx={userWrapper}>
                                                    {!isMessageBeforeIsMine &&
                                                        <>
	                                                        <Typography onClick={(e) => showUserInfo(e, subscribedUser)} sx={activeUsername(subscribedUser ? subscribedUser?.nicknameColor : '')} variant='subtitle1'>
                                                              {subscribedUser ? subscribedUser.nickname : userId}
	                                                        </Typography>
                                                            {subscribedUser?.isAdmin &&
		                                                        <Typography variant='subtitle1' sx={userRole}>
			                                                        Админ
		                                                        </Typography>
                                                            }
                                                        </>
                                                    }
                                                    <IconButton className='miniContextmenu' onClick={() => {
                                                        setIsReplying(true)
                                                        setReplyMessageInfo(message)
                                                    }} sx={{color: subscribedUser?.nicknameColor || ''}}>
                                                        <ReplyIcon/>
                                                    </IconButton>
                                                </Box>
                                                <Box sx={messageContainer}>
                                                    <Box sx={messageLeftLine} />
                                                    <Box onClick={() => showRepliedMessage(message)} sx={{cursor: 'pointer'}}>
                                                        <Typography sx={{color: subscribedReplyerUser?.userId === me?.userId ? me?.nicknameColor || '' : subscribedReplyerUser?.nicknameColor || '', cursor: 'pointer' }}>{subscribedReplyerUser?.nickname}</Typography>
                                                        {replyMessage ?
                                                            <EllipsisText sx={messageStyles} text={replyMessage.message} length={30}/>
                                                            :
                                                            <Typography color='error' sx={{}}>Сообщение удалено</Typography>
                                                        }
                                                    </Box>
                                                </Box>
                                                <Typography sx={messageStyles}>
                                                    {message.message}
                                                </Typography>
                                                {changedAtFormatted ?
                                                    <Typography sx={dateMessage}>
                                                        изменено в {changedAtFormatted}
                                                    </Typography>
                                                :
                                                    <Typography sx={dateMessage}>
                                                        {createdAtFormatted}
                                                    </Typography>
                                                }
                                            </>
                                        :
                                            <Box>
                                                <Box onClick={() => showRepliedMessage(message)} sx={{display: 'flex', wordBreak: 'break-all', cursor: 'pointer' }}>
                                                    <Box sx={messageLeftLine}/>
                                                    <Box >
                                                        <Typography  sx={{color: subscribedReplyerUser?.userId === me?.userId ? me!.nicknameColor : '', wordBreak: 'break-all' }}>
                                                            {subscribedReplyerUser?.nickname}
                                                        </Typography>
                                                        <Typography color={replyMessage?.message ? '' :  'error'}>
                                                            <EllipsisText sx={{wordBreak: 'break-all'}}  text={replyMessage?.message || 'Сообщение удалено'} length={30}/>
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <TextField fullWidth sx={{div: {px: 1, mb: 1}}} variant={'standard'}
                                                           onChange={(e) => setChangeMessageInputValue(e.target.value)}
                                                           multiline defaultValue={message.message}
                                                />
                                                <Button sx={{mx: 1}} color={'success'} onClick={() => {
                                                    setIsLoading(true)
                                                    changeMessage(message)
                                                }}>
                                                    <DoneIcon/>
                                                </Button>
                                                <Button color={'error'} onClick={() => {
                                                    setChangingMessageId('')
                                                    setChangeMessageInputValue('')
                                                }}>
                                                    <CloseIcon/>
                                                </Button>

                                            </Box>
                                    }
                                </Box>
                            </ListItem>
                        )
                    }

                return (
                    <ListItem
                        onContextMenu={(e) => onOpenContextMenu(e, message, subscribedUser)}
                        sx={messageListItem(isMobile)}
                        key={message.createdAt}
                        className={'messageItem'}
                        id={message.messageId}
                    >
                        <Box onClick={(e) => {
                            const {pageX, pageY} = e
                            if (subscribedUser) {
                                setIsUserModalOpen(true)
                                setUserModalInfo({user: subscribedUser, pageX, pageY})
                            }
                            setIsContextMenuOpen(false)
                        }} sx={avatarWrapper}>
                            {!isMessageAfterThisMine ? <Avatar sx={{width: 50, height: 50}} src={subscribedUser?.photoURL} alt="avatar"/> : <Box sx={{width: 50}}/>}
                        </Box>
                        <Box className='message' sx={messageWrapper(isMessageBeforeIsMine, isMessageAfterThisMine, isMobile, userStyles?.messagesBorderRadius)}>
                            {!isMessageChanging ?
                                <>
                                    <Box sx={{alignItems: 'center', display: 'flex'}}>
                                        {!isMessageBeforeIsMine && <>
                                            <Typography onClick={(e) => {
                                              const {pageX, pageY} = e
                                              if (subscribedUser) {
                                                  setIsUserModalOpen(true)
                                                  setUserModalInfo({user: subscribedUser, pageX, pageY})
                                              }
                                          }} sx={{color: subscribedUser ? subscribedUser?.nicknameColor : '', cursor: 'pointer', display: 'inline-block', wordBreak: 'break-all'}} variant={'subtitle1'}>
                                              {subscribedUser?.nickname || userId}
                                        </Typography>
                                            {subscribedUser?.isAdmin &&
                                                <Typography variant={'subtitle1'} sx={{display: 'inline-block', ml: 1, fontSize: '12px', cursor: 'default'}}>
                                                    Админ
                                                </Typography>
                                            }
                                                </>
                                        }

                                        <IconButton className='miniContextmenu' onClick={() => {
                                            setIsReplying(true)
                                            setReplyMessageInfo(message)
                                        }} sx={{color: subscribedUser?.nicknameColor || ''}}>
                                            <ReplyIcon/>
                                        </IconButton>
                                    </Box>
                                    <Typography sx={messageStyles} variant={'body1'}>
                                        {message.message}
                                    </Typography>
                                    {changedAtFormatted ?
                                        <Typography sx={dateMessage}>
                                            изменено в {changedAtFormatted}
                                        </Typography>
                                        :
                                        <Typography sx={dateMessage}>
                                            {createdAtFormatted}
                                        </Typography>
                                    }
                                </>
                                :
                                <Box>
                                    <TextField fullWidth sx={{div: {px: 1, mb: 1}}} variant={'standard'}
                                               onChange={(e) => setChangeMessageInputValue(e.target.value)}
                                               multiline defaultValue={message.message}
                                    />
                                    <Button sx={{mx: 1}} color={'success'} onClick={() => {
                                        setIsLoading(true)
                                        changeMessage(message)
                                    }}>
                                        <DoneIcon/>
                                    </Button>
                                    <Button color={'error'} onClick={() => {
                                        setChangingMessageId('')
                                        setChangeMessageInputValue('')
                                    }}>
                                        <CloseIcon/>
                                    </Button>

                                </Box>
                            }
                        </Box>

                    </ListItem>)

            })}

        </List>
        </>
    )

}


export default Messages;