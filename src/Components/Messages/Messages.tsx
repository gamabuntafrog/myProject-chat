import React, {FC, useContext, useEffect, useRef, useState,} from "react";
import {Context} from "../..";
import {arrayRemove, arrayUnion, doc, updateDoc} from "firebase/firestore";
import {Avatar, Box, Button, Input, List, ListItem, TextField, Typography} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from "../Loader";
import {MessagesPropTypes} from "../../types/MessagesPT";
import UserModalInfo from "../UserModalInfo";
import './Messages.css';
import {messagesExemplar} from "../Search/Search";
import MessageContextMenu from "../MessageContextMenu";
// @ts-ignore
import EllipsisText from "react-ellipsis-text";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {messageType} from "../../types/messages";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

const Messages: FC<MessagesPropTypes> = ({chatId, messages, firestore, subscribedUsers, setReplyMessageInfo, setIsReplying}) => {

    const {auth, user: me} = useContext(Context)!
    const [userModalInfo, setUserModalInfo] = useState<null | any>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const listRef = useRef<null | HTMLUListElement>(null);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [contextMenuInfo, setContextMenuInfo] = useState<any>(null);
    const [updateState, setUpdateState] = useState(false);
    const [changeMessageInputValue, setChangeMessageInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // console.log(messages)
    useEffect(() => {
        const body = document.querySelector('body')

        scrollToBottom(body)
    }, [messages])

    const onDelete = async (message: any) => {
        console.log(message)
        // await deleteDoc(doc(firestore, 'chat', 'public', `${chatId}`, `${message.docId}`))
        const {createdAt} = message
        await updateDoc(doc(firestore, 'chats', `${chatId}`), {
            messages: arrayRemove(message)
        })
    }

    const scrollToBottom = (body: any) => {
        window.scrollTo({top: body.offsetHeight, behavior: "smooth"})
    }
    console.log()


    useEffect(() => {
        if (isUserModalOpen) {
            // @ts-ignore
            listRef?.current?.addEventListener('click', () => {
                setIsUserModalOpen(false)

            })
        }
        if (isContextMenuOpen) {
            // @ts-ignore
            listRef?.current?.addEventListener('click', () => {
                setIsContextMenuOpen(false)
            })
        }
        // @ts-ignore
        return listRef?.current?.removeEventListener('click', () => {
            setIsUserModalOpen(false)
            setIsContextMenuOpen(false)
        })
    }, [isUserModalOpen, isContextMenuOpen]);

    useEffect(() => {
        if (listRef.current) {
            //
            // console.log(listRef.current.children[0].getBoundingClientRect())
            // const child = listRef.current.children[0].getBoundingClientRect()
            // setTimeout(() => {
            //     window.scrollTo({top: child.height, behavior: "smooth"})
            // }, 3000)

        }

    }, [listRef]);

    if (!messages && !subscribedUsers) {
        return <List sx={{minHeight: '90vh'}}>
            <Loader/>
        </List>
    }

    const openContextMenu = (event: React.MouseEvent<HTMLButtonElement>, data: any, subscribedUser: any) => {
        const {pageX, pageY} = event
        const isMe = subscribedUser.userId === me?.userId

        if (subscribedUser && isMe) {
            console.log('subs and isMe')
            setContextMenuInfo({data, pageX, pageY, isMe: true})
        } else {
            setContextMenuInfo({data, pageX, pageY, isMe: false})

        }
        setIsContextMenuOpen(true)
        // console.log('rightClick')
    }

    const showUserInfo = (e: React.MouseEvent<HTMLSpanElement>, user: any) => {
        const {pageX, pageY} = e
        if (user) {
            setIsUserModalOpen(true)
            setUserModalInfo({user, pageX, pageY})
        }
    }

    const changeMessage = async (el: messageType) => {

        if (el.isChanging) {
            delete el.isChanging
        }

        const newMessage = {...el, message: changeMessageInputValue, changedAt: Date.now()}
        const oldMessage = el

        console.log(oldMessage)
        console.log(newMessage)

        try {
            await updateDoc(doc(firestore, 'chats', `${chatId}`), {
                messages: arrayRemove(oldMessage)
            })
            await updateDoc(doc(firestore, 'chats', `${chatId}`), {
                messages: arrayUnion(newMessage)
            })
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {isLoading && <Loader/>}
            {isContextMenuOpen && <MessageContextMenu
              modalInfo={contextMenuInfo}
              setReplyMessageInfo={setReplyMessageInfo}
              setIsReplying={setIsReplying}
              chatId={chatId}
              setIsContextMenuOpen={setIsContextMenuOpen}
              myId={me?.userId}
            />}
            {isUserModalOpen && <UserModalInfo modalInfo={userModalInfo}/>}
        <List className={'messagesList'} ref={listRef} sx={{minHeight: '80vh', zIndex: '100'}}>
            {subscribedUsers && messages?.map((el: any, i: any) => {
                if (el.messageType === messagesExemplar.startMessage) return <ListItem sx={{justifyContent: 'center'}} key={el.createdAt}>
                    <Typography variant={'subtitle1'}>{el.startMessage}</Typography></ListItem> //это просто сообщение "начало чата"
                // console.log(el)
                const id = el.userId
                const subscribedUser = subscribedUsers[id]
                const currentUser = el.userId === me?.userId;

                if (el.messageType === messagesExemplar.replyMessage) {
                    const replyer = subscribedUsers[el.replyer.userId]

                    // console.log(subscribedUsers, el.replyer)

                    if (currentUser) {
                        // console.log(replyer.userId === me?.userId)
                        return (
                            <ListItem sx={{paddingLeft: 0, paddingRight: 0}} key={el.createdAt}>
                                <Box onClick={(e) => showUserInfo(e, subscribedUser)}  sx={{mr: 3, cursor: 'pointer'}}>
                                    <Avatar sx={{width: 50, height: 50}} src={`${subscribedUser?.photoURL}`} alt="avatar"/>
                                </Box>
                                <Box sx={{flexGrow: 1, }}>

                                    {!el.isChanging ?
                                            <>
                                                <Box sx={{alignItems: 'center', display: 'flex'}}>
                                                    <Typography onClick={(e) => showUserInfo(e, subscribedUser)} sx={{color: '#2196f3', cursor: 'pointer', display: 'inline-block'}} variant={'subtitle1'}>
                                                        {subscribedUser ? subscribedUser.nickname : id}
                                                    </Typography>
                                                    {subscribedUser?.isAdmin &&
                                                        <Typography variant={'subtitle1'} sx={{display: 'inline-block', ml: 1, fontSize: '12px', cursor: 'default'}}>
                                                            Админ
                                                        </Typography>
                                                    }
                                                </Box>
                                                <Box sx={{display: 'flex', wordBreak: 'break-all'}}>
                                                    <Box sx={{height: '45px', width: '2px', backgroundColor: 'white', mr: 1}}></Box>
                                                    <Box>
                                                        <Typography onClick={(e) => showUserInfo(e, replyer)} sx={{color: replyer?.userId === me?.userId ? '#2196f3' : '', cursor: 'pointer' }}>{replyer?.nickname}</Typography>
                                                        <EllipsisText sx={{wordBreak: 'break-all'}} text={el.replyer.message} length={30}/>
                                                    </Box>
                                                    <Button onClick={() => {
                                                        console.log()
                                                        const indexOfReplyerMessage = messages?.findIndex((message: any, i) => {
                                                            return el.replyer.createdAt === message.createdAt

                                                        })
                                                        console.log(el)
                                                        console.log(messages?.filter((message: any, i) => {
                                                                console.log(message)
                                                                return el.replyer.createdAt === message.createdAt

                                                        }))
                                                        console.log(indexOfReplyerMessage)
                                                        const list = listRef.current!.getBoundingClientRect()
                                                        // console.log(list)
                                                        const child = listRef.current!.children[indexOfReplyerMessage].getBoundingClientRect()
                                                        console.log(child)
                                                        window.scrollTo({top: child.top + window.pageYOffset - 64, behavior: "smooth"})
                                                        console.log(window.outerHeight)
                                                    }}>Ссылка</Button>
                                                </Box>
                                                <Typography>{el.message}</Typography>
                                            </>
                                        :
                                            <Box>
                                                <Box sx={{display: 'flex', wordBreak: 'break-all'}}>
                                                    <Box sx={{height: '45px', width: '2px', backgroundColor: 'white', mr: 1}}></Box>
                                                    <Box>
                                                        <Typography onClick={(e) => showUserInfo(e, replyer)} sx={{color: replyer?.userId === me?.userId ? '#2196f3' : '', cursor: 'pointer' }}>{replyer?.nickname}</Typography>
                                                        <EllipsisText sx={{wordBreak: 'break-all'}} text={el.replyer.message} length={30}/>
                                                    </Box>
                                                </Box>
                                                <TextField fullWidth sx={{div: {px: 1, mb: 1}}} variant={'standard'}
                                                           onChange={(e) => setChangeMessageInputValue(e.target.value)}
                                                           multiline defaultValue={el.message}
                                                />
                                                <Button sx={{mx: 1}} color={'success'} onClick={() => {
                                                    setIsLoading(true)
                                                    changeMessage(el)
                                                }}>
                                                    <DoneIcon/>
                                                </Button>
                                                <Button color={'error'} onClick={() => {
                                                    el.isChanging = false
                                                    setUpdateState(!updateState)
                                                }}>
                                                    <CloseIcon/>
                                                </Button>

                                            </Box>
                                    }

                                </Box>
                                <Button sx={{minWidth: '36px'}} onClick={(e: React.MouseEvent<HTMLButtonElement>) => openContextMenu(e, el, subscribedUser)}>
                                    <MoreVertIcon/>
                                </Button>
                            </ListItem>
                        )
                    } else {
                        return (
                            <ListItem sx={{paddingLeft: 0, paddingRight: 0}} key={el.createdAt}>
                                <Box onClick={(e) => showUserInfo(e, subscribedUser)} sx={{mr: 3, cursor: 'pointer'}}>
                                    <Avatar sx={{width: 50, height: 50}} src={`${subscribedUser?.photoURL}`} alt="avatar"/>
                                </Box>
                                <Box sx={{flexGrow: 1, }}>
                                    <Box sx={{alignItems: 'center', display: 'flex'}}>
                                        <Typography onClick={(e) => showUserInfo(e, subscribedUser)} sx={{cursor: 'pointer', display: 'inline-block'}} variant={'subtitle1'}>
                                            {subscribedUser ? subscribedUser.nickname : id}
                                        </Typography>
                                        {subscribedUser?.isAdmin &&
                                            <Typography variant={'subtitle1'} sx={{display: 'inline-block', ml: 1, fontSize: '12px', cursor: 'default'}}>
                                                Админ
                                            </Typography>
                                        }
                                    </Box>
                                    <Box sx={{display: 'flex',}}>
                                        <Box sx={{height: '45px', width: '2px', backgroundColor: 'white', mr: 1}}></Box>
                                        <Box sx={{wordBreak: 'break-all'}}>
                                            <Typography>{replyer.nickname}</Typography>
                                            <EllipsisText sx={{wordBreak: 'break-all'}} text={el.replyer.message} length={30}/>
                                        </Box>
                                    </Box>
                                    <Typography>{el.message}</Typography>

                                </Box>
                                <Button sx={{minWidth: '36px'}} onClick={(e: React.MouseEvent<HTMLButtonElement>) => openContextMenu(e, el, subscribedUser)}>
                                    <MoreVertIcon/>
                                </Button>
                            </ListItem>
                        )
                    }

                }

                // const id = el.userId
                const user = subscribedUsers[id]
                // const currentUser = el.userId === me?.userId;
                // console.log(me)
                switch (currentUser) {
                    case true:
                        return (<ListItem sx={{px: el.isChanging ? 1 : 0, backgroundColor: el.isChanging ? '#262626' : '', borderRadius: 3}} key={el.createdAt}>
                            <Box onClick={(e) => {
                                const {pageX, pageY} = e
                                if (user) {
                                    setIsUserModalOpen(true)
                                    setUserModalInfo({user, pageX, pageY})
                                }
                            }} sx={{mr: 3, cursor: 'pointer'}}>
                                <Avatar sx={{width: 50, height: 50}} src={`${user?.photoURL}`} alt="avatar"/>
                            </Box>
                            <Box sx={{flexGrow: 1, }}>
                                {!el.isChanging ?
                                    <>
                                    <Box sx={{alignItems: 'center', display: 'flex'}}>
                                        <Typography onClick={(e) => {
                                            const {pageX, pageY} = e
                                            if (user) {
                                                setIsUserModalOpen(true)
                                                setUserModalInfo({user, pageX, pageY})
                                            }
                                        }} sx={{color: '#2196f3', cursor: 'pointer', display: 'inline-block'}} variant={'subtitle1'}>
                                            {user ? user.nickname : id}
                                        </Typography>
                                        {user?.isAdmin &&
				                                <Typography variant={'subtitle1'} sx={{display: 'inline-block', ml: 1, fontSize: '12px', cursor: 'default'}}>
					                                Админ
				                                </Typography>
                                        }
                                    </Box>
                                    <Typography sx={{wordBreak: 'break-all'}} variant={'body1'}>
                                        {el.message}
                                    </Typography>
                                    </>
                                    :
                                    <Box>
                                        <TextField fullWidth sx={{div: {px: 1, mb: 1}}} variant={'standard'}
                                           onChange={(e) => setChangeMessageInputValue(e.target.value)}
                                           multiline defaultValue={el.message}
                                        />
                                        <Button sx={{mx: 1}} color={'success'} onClick={() => {
                                            setIsLoading(true)
                                            changeMessage(el)
                                        }}>
                                            <DoneIcon/>
                                        </Button>
                                        <Button color={'error'} onClick={() => {
                                            el.isChanging = false
                                            setUpdateState(!updateState)
                                        }}>
                                            <CloseIcon/>
                                        </Button>

                                    </Box>
                                }
                            </Box>
                            <Button sx={{minWidth: '36px'}} onClick={(e: React.MouseEvent<HTMLButtonElement>) => openContextMenu(e, el, subscribedUser)}>
                                <MoreVertIcon/>
                            </Button>
                        </ListItem>)


                    case false:

                        return (<ListItem  sx={{paddingLeft: 0, paddingRight: 0}} key={el.createdAt}>
                            <Box onClick={(e) => {
                                const {pageX, pageY} = e
                                if (user) {
                                    setIsUserModalOpen(true)
                                    setUserModalInfo({user, pageX, pageY})
                                }
                            }} sx={{mr: 3, cursor: 'pointer'}}>
                                <Avatar sx={{width: 50, height: 50}} src={`${user ? user.photoURL : el.photoURL}`} alt="avatar"/>
                            </Box>
                            <Box sx={{flexGrow: 1}}>
                                <Box sx={{alignItems: 'center', display: 'flex'}}>
                                    <Typography onClick={(e) => {
                                        const {pageX, pageY} = e
                                        if (user) {
                                            setIsUserModalOpen(true)
                                            setUserModalInfo({user, pageX, pageY})
                                        }
                                    }} sx={{cursor: 'pointer', display: 'inline-block'}} variant={'subtitle1'}>
                                        {user ? user.nickname : id}
                                    </Typography>
                                    {user?.isAdmin &&
                                        <Typography variant={'subtitle1'} sx={{display: 'inline-block', ml: 1, fontSize: '12px', cursor: 'default'}}>
                                           Админ
                                        </Typography>
                                    }
                                </Box>
                                <Typography sx={{wordBreak: 'break-all'}} variant={'body1'}>
                                    {el.message}
                                </Typography>
                            </Box>
                            <Button sx={{minWidth: '36px'}} onClick={(e: React.MouseEvent<HTMLButtonElement>) => openContextMenu(e, el, subscribedUser)}>
                                <MoreVertIcon/>
                            </Button>
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