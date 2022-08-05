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
    avatarWrapper,
    messageContainer,
    messagesList,
    messageWrapper,
    userRole,
    userWrapper
} from "./MessagesStyles";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import './Messages.css';
import ReplyIcon from "@mui/icons-material/Reply";
import {useHistory} from "react-router-dom";

type MessagesPropTypes = {
    chatId: string,
    messages: messagesType[],
    subscribedUsers: any,
    setIsReplying: React.Dispatch<React.SetStateAction<boolean>>
    setReplyMessageInfo: React.Dispatch<React.SetStateAction<any>>,
    isChatChanging: boolean
}

const Messages: FC<MessagesPropTypes> = ({
    chatId,
    messages,
    subscribedUsers,
    setReplyMessageInfo,
    setIsReplying,
    isChatChanging
}) => {

    const {user: me, firestore} = useContext(Context)!
    const [userModalInfo, setUserModalInfo] = useState<null | any>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const listRef = useRef<null | HTMLUListElement>(null);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [contextMenuInfo, setContextMenuInfo] = useState<any>(null);
    const [changeMessageInputValue, setChangeMessageInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [changingMessageId, setChangingMessageId] = useState('');
    const [replyMessages, setReplyMessages] = useState(null);

    const type = useGetTypeOfScreen()

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

        const newMessage = {...message, message: changeMessageInputValue, changedAt: Date.now()}
        console.log(newMessage)

        try {
            const messageRef = doc(firestore, 'chats', `${chatId}`, 'messages', `${message.messageId}`)
            await setDoc(messageRef, newMessage)
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false)
            setChangingMessageId('')
        }
    }

    const showRepliedMessage = (repliedMessage: replyMessageType) => {
        const indexOfReplyerMessage = messages?.findIndex((message: messagesType, i) => {
            return repliedMessage.replyer.messageId === message.messageId
        })
        if (indexOfReplyerMessage >= 0) {
            const child = listRef.current!.children[indexOfReplyerMessage].getBoundingClientRect()
            listRef.current!.scrollTo({top: child.top + window.pageYOffset - (window.innerHeight / 2), behavior: "smooth"})

        }

    }

    if (!messages && !subscribedUsers && !me) {
        return <List sx={{minHeight: '90vh'}}>
            <Loader/>
        </List>
    }

    const blackBackground = 'https://www.tynker.com/minecraft/api/block?id=5993332e76f2936e3f8b4586&w=400&h=400&width=400&height=400&mode=contain&format=jpg&quality=75&cache=max&v=1502819118'



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
            />}
            {isUserModalOpen && <UserModalInfo
              modalInfo={userModalInfo}
              setIsUserModalOpen={setIsUserModalOpen}
            />}
        <List ref={listRef} sx={messagesList}>
            {subscribedUsers && replyMessages && messages?.map((message: messagesType, i: number) => {
                if (message.messageType === messagesExemplar.startMessage) {
                    return (
                        <ListItem sx={{justifyContent: 'center'}} key={message.createdAt}>
                            <Typography variant={'subtitle1'}>{message.message}</Typography>
                        </ListItem>
                    )
                }

                const {userId, messageId, messageType} = message
                const subscribedUser = subscribedUsers[userId]
                const isMyMessage = userId === me!.userId;

                if (messageType === messagesExemplar.replyMessage) {
                    const subscribedReplyerUser = subscribedUsers[message.replyer.userId]
                    // console.log(replyMessages[messageId])
                    const replyMessage: replyMessageType = (replyMessages[message.replyer.messageId])
                    console.log(replyMessage)
                    if (isMyMessage) {
                        const isMessageChanging = messageId === changingMessageId

                        return (
                            <ListItem
                                className={'messageItem'}
                                onContextMenu={(e) => onOpenContextMenu(e, message, subscribedUser)}
                                sx={{px: 0, width: '100%'}}
                                key={messageId}
                            >
                                <Box onClick={(e) => showUserInfo(e, subscribedUser)} sx={avatarWrapper}>
                                    <Avatar sx={{width: 50, height: 50}} src={subscribedUser?.photoURL} alt="avatar"/>
                                </Box>
                                <Box sx={messageWrapper}>
                                    {!isMessageChanging ?
                                            <>
                                                <Box sx={userWrapper}>
                                                    <Typography onClick={(e) => showUserInfo(e, subscribedUser)} sx={activeUsername(me!.nicknameColor)} variant='subtitle1'>
                                                        {subscribedUser ? subscribedUser.nickname : userId}
                                                    </Typography>
                                                    {subscribedUser?.isAdmin &&
                                                        <Typography variant='subtitle1' sx={userRole}>
                                                            Админ
                                                        </Typography>
                                                    }
                                                    <IconButton className='miniContextmenu' onClick={() => {
                                                        setIsReplying(true)
                                                        setReplyMessageInfo(message)
                                                    }} sx={{color: subscribedUser.nicknameColor || ''}}>
                                                        <ReplyIcon/>
                                                    </IconButton>
                                                </Box>
                                                <Box sx={messageContainer}>
                                                    <Box sx={{height: '45px', width: '2px', backgroundColor: 'white', mr: 1}} />
                                                    <Box onClick={() => showRepliedMessage(message)} sx={{cursor: 'pointer'}}>
                                                        <Typography sx={{color: subscribedReplyerUser?.userId === me?.userId ? me?.nicknameColor || '' : subscribedReplyerUser?.nicknameColor || '', cursor: 'pointer' }}>{subscribedReplyerUser?.nickname}</Typography>
                                                        {replyMessage ?
                                                            <EllipsisText sx={{wordBreak: 'break-all'}} text={replyMessage.message} length={30}/>
                                                            :
                                                            <Typography color='error' sx={{}}>Сообщение удалено</Typography>
                                                        }                                                    </Box>
                                                </Box>
                                                <Typography>{message.message}</Typography>
                                            </>
                                        :
                                            <Box>
                                                <Box sx={{display: 'flex', wordBreak: 'break-all'}}>
                                                    <Box sx={{height: '45px', width: '2px', backgroundColor: 'white', mr: 1}}/>
                                                    <Box>
                                                        <Typography onClick={(e) => showUserInfo(e, subscribedReplyerUser)} sx={{color: subscribedReplyerUser?.userId === me?.userId ? '#2196f3' : '', cursor: 'pointer', wordBreak: 'break-all' }}>{subscribedReplyerUser?.nickname}</Typography>
                                                        <EllipsisText sx={{wordBreak: 'break-all'}} text={message.replyer.message} length={30}/>
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
                                                }}>
                                                    <CloseIcon/>
                                                </Button>

                                            </Box>
                                    }
                                </Box>
                            </ListItem>
                        )
                    } else {
                        return (
                            <ListItem
                                onContextMenu={(e) => onOpenContextMenu(e, message, subscribedUser)}
                                sx={{paddingLeft: 0, paddingRight: 0}}
                                key={message.createdAt}
                                className={'messageItem'}
                            >
                                <Box onClick={(e) => showUserInfo(e, subscribedUser)} sx={{mr: 3, cursor: 'pointer'}}>
                                    <Avatar sx={{width: 50, height: 50}} src={`${subscribedUser?.photoURL}`} alt="avatar"/>
                                </Box>
                                <Box sx={{flexGrow: 1, }}>
                                    <Box sx={{alignItems: 'center', display: 'flex'}}>
                                        <Typography onClick={(e) => showUserInfo(e, subscribedUser)} sx={{cursor: 'pointer', display: 'inline-block', wordBreak: 'break-all', color: subscribedUser?.nicknameColor || ''}} variant={'subtitle1'}>
                                            {subscribedUser ? subscribedUser.nickname : userId}
                                        </Typography>
                                        {subscribedUser?.isAdmin &&
                                            <Typography variant={'subtitle1'} sx={{display: 'inline-block', ml: 1, fontSize: '12px', cursor: 'default'}}>
                                                Админ
                                            </Typography>
                                        }
                                        <IconButton className='miniContextmenu' onClick={() => {
                                            setIsReplying(true)
                                            setReplyMessageInfo(message)
                                        }} sx={{color: subscribedUser?.nicknameColor || ''}}>
                                            <ReplyIcon/>
                                        </IconButton>
                                    </Box>
                                    <Box sx={{display: 'flex',}}>
                                        <Box sx={{height: '45px', width: '2px', backgroundColor: 'white', mr: 1}}></Box>
                                        <Box onClick={() => showRepliedMessage(message)} sx={{cursor: 'pointer'}}>
                                            <Typography sx={{color: subscribedReplyerUser?.userId === me?.userId ? me?.nicknameColor : subscribedReplyerUser?.nicknameColor || '', cursor: 'pointer' , wordBreak: 'break-all'}}>{subscribedReplyerUser?.nickname}</Typography>
                                            {replyMessage ?
                                                <EllipsisText sx={{wordBreak: 'break-all'}} text={replyMessage.message} length={30}/>
                                                :
                                                <Typography color='error' sx={{}}>Сообщение удалено</Typography>
                                            }
                                        </Box>
                                    </Box>
                                    <Typography>{message.message}</Typography>

                                </Box>
                            </ListItem>
                        )
                    }

                }

                // const id = el.userId
                // const user = subscribedUsers[userId]
                // const isMyMessage = el.userId === me?.userId;
                // console.log(me)
                switch (isMyMessage) {
                    case true:
                        const isMessageChanging = message.messageId === changingMessageId

                        return (
                            <ListItem
                                onContextMenu={(e) => onOpenContextMenu(e, message, subscribedUser)}
                                sx={{px: isMessageChanging ? 1 : 0, borderRadius: 3}}
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
                            }} sx={{mr: 3, cursor: 'pointer'}}>
                                <Avatar sx={{width: 50, height: 50}} src={`${subscribedUser?.photoURL}`} alt="avatar"/>
                            </Box>
                            <Box sx={{flexGrow: 1, }}>
                                {!isMessageChanging ?
                                    <>
                                    <Box sx={{alignItems: 'center', display: 'flex'}}>
                                        <Typography onClick={(e) => {
                                            const {pageX, pageY} = e
                                            if (subscribedUser) {
                                                setIsUserModalOpen(true)
                                                setUserModalInfo({user: subscribedUser, pageX, pageY})
                                            }
                                        }} sx={{color: me?.nicknameColor ? me.nicknameColor : '', cursor: 'pointer', display: 'inline-block', wordBreak: 'break-all'}} variant={'subtitle1'}>
                                            {subscribedUser.nickname || userId}
                                        </Typography>
                                        {subscribedUser?.isAdmin &&
				                                <Typography variant={'subtitle1'} sx={{display: 'inline-block', ml: 1, fontSize: '12px', cursor: 'default'}}>
					                                Админ
				                                </Typography>
                                        }
                                        <IconButton className='miniContextmenu' onClick={() => {
                                            setIsReplying(true)
                                            setReplyMessageInfo(message)
                                        }} sx={{color: subscribedUser.nicknameColor || ''}}>
                                            <ReplyIcon/>
                                        </IconButton>
                                    </Box>
                                    <Typography sx={{wordBreak: 'break-all'}} variant={'body1'}>
                                        {message.message}
                                    </Typography>
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
                                        }}>
                                            <CloseIcon/>
                                        </Button>

                                    </Box>
                                }
                            </Box>

                        </ListItem>)


                    case false:

                        return (
                            <ListItem
                            className={'messageItem'}
                            onContextMenu={(e) => onOpenContextMenu(e, message, subscribedUser)}
                            sx={{paddingLeft: 0, paddingRight: 0}}
                            key={message.createdAt}
                        >
                            <Box onClick={(e) => {
                                const {pageX, pageY} = e
                                if (subscribedUser) {
                                    setIsUserModalOpen(true)
                                    setUserModalInfo({user: subscribedUser, pageX, pageY})
                                }
                            }} sx={{mr: 3, cursor: 'pointer'}}>
                                <Avatar sx={{width: 50, height: 50}} src={`${subscribedUser?.photoURL || blackBackground}`} alt="avatar"/>
                            </Box>
                            <Box sx={{flexGrow: 1}}>
                                <Box sx={{alignItems: 'center', display: 'flex'}}>
                                    <Typography onClick={(e) => {
                                        const {pageX, pageY} = e
                                        if (subscribedUser) {
                                            setIsUserModalOpen(true)
                                            setUserModalInfo({user: subscribedUser, pageX, pageY})
                                        }
                                    }} sx={{color: subscribedUser?.nicknameColor || '', cursor: 'pointer', display: 'inline-block', wordBreak: 'break-all'}} variant={'subtitle1'}>
                                        {subscribedUser?.nickname || userId}
                                    </Typography>
                                    {subscribedUser?.isAdmin &&
                                        <Typography variant={'subtitle1'} sx={{display: 'inline-block', ml: 1, fontSize: '12px', cursor: 'default'}}>
                                           Админ
                                        </Typography>
                                    }
                                    <IconButton className='miniContextmenu' onClick={() => {
                                        setIsReplying(true)
                                        setReplyMessageInfo(message)
                                    }} sx={{color: subscribedUser?.nicknameColor || ''}}>
                                        <ReplyIcon/>
                                    </IconButton>
                                </Box>
                                <Typography sx={{wordBreak: 'break-all'}} variant={'body1'}>
                                    {message.message}
                                </Typography>
                            </Box>

                        </ListItem>)

                    default:
                        return <h1>s</h1>
                        break

                }
            })}

        </List>
        </>
    )

}


export default Messages;