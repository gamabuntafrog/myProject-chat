import React, {FC, useContext, useEffect, useState,} from "react";
import {Context} from "../..";
import {doc, setDoc} from "firebase/firestore";
import {
    Avatar,
    Box,
    Button,
    IconButton,
    ImageList,
    ImageListItem,
    List,
    ListItem,
    TextField,
    Typography
} from '@mui/material'
import Loader from "../Loader";
import UserModalInfo from "../UserModalInfo";
import {
    gifMessageType,
    messagesExemplar,
    messagesType,
    messagesWhichOnProgressType,
    messageType,
    replyMessageType
} from '../../types/messages';
import MessageContextMenu from "../MessageContextMenu";
import EllipsisText from "react-ellipsis-text";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import {user} from "../../types/user";
import {
    activeUsername,
    avatarWrapper,
    dateMessage,
    messageContainer,
    messageLeftLine,
    messageListItem,
    messagesList,
    messageStyles,
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
import Modal from "../Modal";
import ImageGallery from 'react-image-gallery';
import {showRepliedMessageActionTypes} from "../Chat/Chat";


type MessagesPropTypes = {
    chatId: string,
    messages: messagesType[],
    subscribedUsers: any,
    setIsReplying: React.Dispatch<React.SetStateAction<boolean>>
    setReplyMessageInfo: React.Dispatch<React.SetStateAction<any>>,
    isChatChanging: boolean,
    showRepliedMessage: (message: replyMessageType | messageType, actionType: showRepliedMessageActionTypes) => void,
    listRef: React.MutableRefObject<HTMLUListElement | null>,
    chatInfo: chatType | undefined,
    focusOnInput: () => void,
    messagesWhichOnProgress: null | messagesWhichOnProgressType[],

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
    chatInfo,
    focusOnInput,
    messagesWhichOnProgress,
}) => {

    const {user: me, firestore} = useContext(Context)!
    const [userModalInfo, setUserModalInfo] = useState<null | any>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [contextMenuInfo, setContextMenuInfo] = useState<any>(null);
    const [messageInputValue, setMessageInputValue] = useState('');
    const [changingMessageId, setChangingMessageId] = useState('');
    const [replyMessages, setReplyMessages] = useState<any>(null);

    const type = useGetTypeOfScreen()
    const isMobileOrMediumScreen = (type === screenTypes.smallType || type === screenTypes.mediumType)
    const isMobile = type === screenTypes.smallType

    const history = useHistory()

    useEffect(() => {
        console.log(messages)
        if (listRef.current) {
            scrollToBottom()
        }
    }, [messages, replyMessages, listRef])

    const scrollToBottom = () => {
        listRef.current!.scrollTo({top: listRef.current!.scrollHeight})
    }

    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [galleryImages, setGalleryImages] = useState<{original: string, thumbnail: string}[] | null>(null);
    const [indexOfOpenedImage, setIndexOfOpenedImage] = useState(0);

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
        const newMessage = {...message, message: messageInputValue, changedAt: Date.now()}

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
            setChangingMessageId('')
            setMessageInputValue('')
        }
    }
    const {userStyles} = useContext(ThemeContext)!






    const secondLastMessage = messages?.slice(messages?.length - 2, messages?.length - 1)

    const replyOnMessage = (message: messageType | replyMessageType | gifMessageType) => {
        setIsReplying(true)
        setReplyMessageInfo(message)
        focusOnInput()
    }

    if (!messages && !subscribedUsers && !me) {
        return <List sx={{minHeight: '100vh'}}>
            <Loader/>
        </List>
    }

    return (
        <>
            <Modal width={isMobile ? '100%' : '70%'} jc='center' height={isMobile ? '100%' : '90%'} buttonPosition='absolute' isModalOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)}>
                <Box sx={{
                    width: '100%',
                    pr: isMobile ? 0 : 2
                }}>
                    <ImageGallery
                        showPlayButton={false}
                        showThumbnails={isMobile ? false : galleryImages && galleryImages?.length > 1}
                        startIndex={indexOfOpenedImage}
                        showFullscreenButton={false}
                        fullscreen
                        thumbnailPosition='left'
                        sizes='100px'
                        infinite={false}
                        thumbnailWidth='100%'
                        thumbnailHeight='600px'
                        originalWidth='100%'
                        items={galleryImages || []}
                    />
                </Box>
            </Modal>
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
              setMessageInputValue={setMessageInputValue}
              focusOnInput={focusOnInput}
            />}
            {isUserModalOpen && <UserModalInfo
              modalInfo={userModalInfo}
              setIsUserModalOpen={setIsUserModalOpen}
            />}
        <List ref={listRef} sx={messagesList(isMobileOrMediumScreen, userStyles?.backgroundImage, userStyles?.backgroundColor)}>
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
                const isMessageBeforeIsMine = messages[i - 1]?.userId === message.userId
                const isMessageAfterThisMine = messages[i + 1]?.userId === message.userId


                if (message.messageType === messagesExemplar.gifMessage) {


                    return (
                        <ListItem
                            sx={{padding: 0, }}
                            key={messageId}
                            onContextMenu={(e) => onOpenContextMenu(e, message, subscribedUser)}
                        >
                            <Box
                                className={'messageWrapper'}
                                sx={messageListItem(isMobile)}
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
                                <Box className='message' sx={messageWrapper(isMessageBeforeIsMine, isMessageAfterThisMine, isMobile, userStyles?.messagesBorderRadius, userStyles.secondBackgroundColor, userStyles.theme)}>
                                    <Box sx={{padding: 0}} onClick={() => {
                                        setGalleryImages([{original: message.gifInfo.media_formats.gif.url, thumbnail: message.gifInfo.media_formats.gif.url}])
                                        setIsGalleryOpen(true)
                                    }}>
                                        <img style={{borderRadius: `${userStyles.messagesBorderRadius}px`, cursor: 'pointer', minWidth: isMobile ? '100px' : '200px', maxWidth: isMobile ? '100%' : '300px'}} src={message.gifInfo.media_formats.mediumgif.url}/>
                                    </Box>
                                    <Typography sx={dateMessage}>
                                        {createdAtFormatted}
                                    </Typography>
                                    <IconButton className='miniContextmenu' onClick={() => {replyOnMessage(message)}} sx={{color: subscribedUser?.nicknameColor || ''}}>
                                        <ReplyIcon/>
                                    </IconButton>
                                </Box>

                            </Box>
                        </ListItem>
                    )

                }


                const isMessageChanging = message.messageId === changingMessageId

                if (messageType === messagesExemplar.replyMessage) {
                    const subscribedReplyerUser = subscribedUsers[message.replyer.userId]
                    const replyMessage: replyMessageType = replyMessages[message.replyer.messageId]
                        return (
                            <ListItem
                                sx={{padding: 0, }}
                                key={messageId}
                                onContextMenu={(e) => onOpenContextMenu(e, message, subscribedUser)}
                            >
                                <Box
                                    className={'messageWrapper'}
                                    sx={messageListItem(isMobile)}
                                >
                                    <Box onClick={(e) => showUserInfo(e, subscribedUser)} sx={avatarWrapper}>
                                        {!isMessageAfterThisMine ? <Avatar sx={{width: 50, height: 50}} src={subscribedUser?.photoURL} alt="avatar"/> : <Box sx={{width: 50}}/>}
                                    </Box>
                                    <Box  className='message' sx={messageWrapper(isMessageBeforeIsMine, isMessageAfterThisMine, isMobile, userStyles?.messagesBorderRadius, userStyles.secondBackgroundColor, userStyles.theme)}>
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
                                                    <IconButton className='miniContextmenu' onClick={() => {replyOnMessage(message)}} sx={{color: subscribedUser?.nicknameColor || ''}}>
                                                        <ReplyIcon/>
                                                    </IconButton>
                                                </Box>
                                                <Box sx={messageContainer}>
                                                    <Box sx={messageLeftLine} />
                                                    <Box onClick={() => showRepliedMessage(message, showRepliedMessageActionTypes.showRepliedMessage)} sx={{cursor: 'pointer'}}>
                                                        <Typography sx={{color: `${subscribedReplyerUser?.userId === me?.userId ? me?.nicknameColor || '' : subscribedReplyerUser?.nicknameColor || ''} !important`, cursor: 'pointer' }}>{subscribedReplyerUser?.nickname}</Typography>
                                                        {replyMessage ?
                                                            <EllipsisText sx={messageStyles} text={replyMessage.message} length={30}/>
                                                            :
                                                            <Typography color='error' sx={{}}>Сообщение удалено</Typography>
                                                        }
                                                    </Box>
                                                </Box>
                                                {message.images &&
                                                    <ImageList sx={isMobile ? { width: '100%' } : {}} cols={isMobile ? 1 : message.images.length > 2 ? 3 : message.images.length} >
                                                        {message.images.map(({imageRef, url}, i) => {
                                                            return <ImageListItem
                                                                onClick={() => {
                                                                    setIndexOfOpenedImage(i)
                                                                    setGalleryImages(message.images!.map(({url}) => {
                                                                        return {original: url, thumbnail: url}
                                                                    }))
                                                                    setIsGalleryOpen(true)
                                                                }}
                                                                key={url} sx={{borderRadius: 2, overflow: 'hidden', mt: 1, mx: 0.5, maxWidth: '400px', maxHeight: '100%', cursor: 'pointer'}}>
                                                                <img src={url}/>
                                                            </ImageListItem>
                                                        })}
                                                    </ImageList>
                                                }
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
                                                <Box onClick={() => showRepliedMessage(message, showRepliedMessageActionTypes.showRepliedMessage)} sx={{display: 'flex', wordBreak: 'break-all', cursor: 'pointer' }}>
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
                                                           onChange={(e) => setMessageInputValue(e.target.value)}
                                                           multiline defaultValue={message.message}
                                                />
                                                <Button sx={{mx: 1}} color={'success'} onClick={() => {
                                                    changeMessage(message)
                                                }}>
                                                    <DoneIcon/>
                                                </Button>
                                                <Button color={'error'} onClick={() => {
                                                    setChangingMessageId('')
                                                    setMessageInputValue('')
                                                }}>
                                                    <CloseIcon/>
                                                </Button>

                                            </Box>
                                        }
                                    </Box>
                                </Box>
                            </ListItem>
                        )
                    }

                return (
                    <ListItem
                        sx={{padding: 0, }}
                        key={messageId}
                        onContextMenu={(e) => onOpenContextMenu(e, message, subscribedUser)}
                    >
                        <Box
                            className={'messageWrapper'}
                            sx={messageListItem(isMobile)}
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
                            <Box className='message' sx={messageWrapper(isMessageBeforeIsMine, isMessageAfterThisMine, isMobile, userStyles?.messagesBorderRadius, userStyles.secondBackgroundColor, userStyles.theme)}>
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

                                            <IconButton className='miniContextmenu' onClick={() => replyOnMessage(message)} sx={{color: subscribedUser?.nicknameColor || ''}}>
                                                <ReplyIcon/>
                                            </IconButton>
                                        </Box>
                                        {message.images &&
                                            <ImageList sx={isMobile ? { width: '100%' } : {}} cols={isMobile ? 1 : message.images.length > 2 ? 3 : message.images.length} >
                                                {message.images.map(({imageRef, url}, i) => {
                                                    return <ImageListItem
                                                        onClick={() => {
                                                            setIndexOfOpenedImage(i)
                                                            setGalleryImages(message.images!.map(({url}) => {
                                                                return {original: url, thumbnail: url}
                                                            }))
                                                            setIsGalleryOpen(true)
                                                        }}
                                                        key={url} sx={{borderRadius: 2, overflow: 'hidden', mt: 1, mx: 0.5, maxWidth: '400px', maxHeight: '100%', cursor: 'pointer'}}>
                                                        <img src={url}/>
                                                    </ImageListItem>
                                                })}
                                            </ImageList>
                                        }
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
                                                   onChange={(e) => setMessageInputValue(e.target.value)}
                                                   multiline defaultValue={message.message}
                                        />
                                        <Button sx={{mx: 1}} color={'success'} onClick={() => {
                                            changeMessage(message)
                                        }}>
                                            <DoneIcon/>
                                        </Button>
                                        <Button color={'error'} onClick={() => {
                                            setChangingMessageId('')
                                            setMessageInputValue('')
                                        }}>
                                            <CloseIcon/>
                                        </Button>

                                    </Box>
                                }
                            </Box>
                        </Box>
                    </ListItem>)

            })}
            {replyMessages && messagesWhichOnProgress && messagesWhichOnProgress.map((message, i) => {
                console.log(message)
                const {userId, messageId, messageType} = message
                const subscribedUser = subscribedUsers[userId]
                const isMessageBeforeIsMine = messages[i - 1]?.userId === message.userId
                const isMessageAfterThisMine = messages[i + 1]?.userId === message.userId
                const isMessageChanging = message.messageId === changingMessageId

                const subscribedReplyerUser = message.messageType === messagesExemplar.replyMessage ? subscribedUsers[message.replyer!.userId] : null
                const replyMessage = message.messageType === messagesExemplar.replyMessage ? replyMessages[message.replyer!.messageId] : null

                return (
                    <ListItem
                        sx={{...messageListItem(isMobile), position: 'relative', py: 2}}
                        key={message.createdAt}
                        className={'messageItem'}
                    >
                        <Loader background='rgba(18, 18, 18, 0.5)'/>
                        <Box sx={avatarWrapper}>
                            {!isMessageAfterThisMine ? <Avatar sx={{width: 50, height: 50}} src={subscribedUser?.photoURL} alt="avatar"/> : <Box sx={{width: 50}}/>}
                        </Box>

                        <Box className='message' sx={messageWrapper(isMessageBeforeIsMine, isMessageAfterThisMine, isMobile, userStyles?.messagesBorderRadius, userStyles.secondBackgroundColor, userStyles.theme)}>
                            {replyMessage &&
		                        <Box sx={messageContainer}>
			                        <Box sx={messageLeftLine} />
			                        <Box sx={{cursor: 'pointer'}}>
				                        <Typography sx={{color: `${subscribedReplyerUser?.userId === me?.userId ? me?.nicknameColor || '' : subscribedReplyerUser?.nicknameColor || ''} !important`, cursor: 'pointer' }}>{subscribedReplyerUser?.nickname}</Typography>
                                  {replyMessage ?
                                      <EllipsisText sx={messageStyles} text={replyMessage.message} length={30}/>
                                      :
                                      <Typography color='error' sx={{}}>Сообщение удалено</Typography>
                                  }
			                        </Box>
		                        </Box>
                            }
                            <Typography sx={{color: subscribedUser ? subscribedUser?.nicknameColor : '', cursor: 'pointer', display: 'inline-block', wordBreak: 'break-all'}} variant={'subtitle1'}>
                                {subscribedUser?.nickname || userId}
                            </Typography>
                            {message.images &&
		                        <ImageList sx={{ width: '100%' }} cols={isMobile ? 1 : 3} >
                                {message.images.map((image) => {
                                    return <ImageListItem key={image} sx={{borderRadius: 2, overflow: 'hidden', mt: 1, mx: 0.5}}>
                                        <img src={image}/>
                                    </ImageListItem>
                                })}
		                        </ImageList>
                            }
                            <Typography sx={messageStyles} variant={'body1'}>
                                {message.message}
                            </Typography>
                        </Box>
                    </ListItem>
                )
            })}

        </List>
        </>
    )

}


export default Messages;