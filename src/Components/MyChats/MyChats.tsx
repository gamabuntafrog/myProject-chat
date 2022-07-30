import React, {useState, useEffect, useContext, FC} from "react"
import {Context} from "../../index";
import {
    doc,
    getDoc,
    getDocs,
    collection,
    orderBy,
    query,
    limit,
    onSnapshot,
    updateDoc,
    arrayRemove
} from "firebase/firestore";
import {Avatar, Box, Button, List, ListItem, TextField, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
// @ts-ignore
import EllipsisText from "react-ellipsis-text";
import './MyChats.css';
import {useCollectionData, useDocumentData, useDocumentDataOnce} from "react-firebase-hooks/firestore";

type messageType = {
    startMessage: string,
    createdAt: number,
    message: string,
    userId: string
}

type chatType = {
    chatId: string,
    chatDescription: string,
    chatImage: string,
    chatName: string,
    createdAt: number,
}


const TestItem: FC<{chatId: string, chatNames: any, filterValue: string}> = ({chatId, chatNames, filterValue}) => {
    const {user: me, firestore} = useContext(Context)!

    const [user, setUser] = useState<null | any>(null);
    const [chat, isLoading] = useDocumentData(doc(firestore, 'chats',`${chatId}`))
    const [messages, isMessagesLoading] = useCollectionData(query(collection(firestore, 'chats',`${chatId}`, 'messages'),
        orderBy('createdAt', 'desc'), limit(1)
    ))
    const [isUserLoading, setIsUserLoading] = useState(true);
    const getUser = async (userId: string) => {
        try {
            const userData = await getDoc(doc(firestore, 'users', userId))
            if (userData) {
                setUser(userData.data())
            }
        } catch (e) {
            console.log(e)
        } finally {
            setIsUserLoading(false)
        }
    }

    const isFilteredSuccess = chat?.chatName.toLowerCase().includes(filterValue.toLowerCase())
    console.log(isFilteredSuccess)

    const unsubscribeFromChat = async (chatId: string) => {
        await updateDoc(doc(firestore, 'users', `${me?.userId}`), {
            subscribedChats: arrayRemove(chatId)
        })
    }

    useEffect( () => {
        try {
            if (messages && messages.length > 0) {
                const lastMessage = messages[0]
                getUser(lastMessage.userId)
            }
        } catch (e) {
            console.log(e)
            setIsUserLoading(false)
        }
    }, [messages]);

    if (isLoading && isMessagesLoading && isUserLoading) {
        return (
            <ListItem>
                Загрузка...
            </ListItem>
        )
    }

    const blackBackground = 'https://www.tynker.com/minecraft/api/block?id=5993332e76f2936e3f8b4586&w=400&h=400&width=400&height=400&mode=contain&format=jpg&quality=75&cache=max&v=1502819118'

    if (chat && messages && user && isFilteredSuccess) {
        const lastMessage = messages[0].message
        // console.log(chat)
        // console.log(user)
        // console.log(messages)
        return (
            <NavLink className={isActive => isActive ? 'activeChat' : 'chatLink'} style={{
                color: 'white',
                padding: '0 10px',
                marginBottom: '5px',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
            }} to={`/chat/${chat.chatId}`} key={chat.chatId} >
                <ListItem sx={{justifyContent: 'start', px: 0}} >
                    <Avatar sx={{mr: 2}} src={chat.chatImage ? chat.chatImage : blackBackground}/>
                    <Box sx={{overflow: 'hidden'}}>
                        <Typography sx={{fontWeight: '800'}}>
                            {chat.chatName}
                        </Typography>
                        <Box display={'flex'} alignItems={'baseline'} sx={{whiteSpace: 'nowrap'}}>
                            <Typography variant={'subtitle2'} sx={{mr: 1}}>
                                <EllipsisText text={`${user.nickname}:`} length={30}/>
                            </Typography>
                            <Typography variant={'body2'} sx={{mr: 1}}>
                                <EllipsisText text={lastMessage} length={30}/>
                            </Typography>
                        </Box>
                    </Box>
                </ListItem>
            </NavLink>
        )
    } else if (chat && messages && user) {
       return (
           <ListItem sx={{display: 'none'}}>

           </ListItem>
       )
    } else {
        return (
            <ListItem sx={{justifyContent: 'center', display: 'flex', flexDirection: 'column'}} >
                <Typography >
                    Ошибка
                </Typography>
                <Button variant={'outlined'} color={'error'} sx={{ml: 1}} onClick={() => {
                    unsubscribeFromChat(chatId)
                }}>Отписаться</Button>
            </ListItem>
        )
    }
}


const MyChats: FC<{isChatListOpen: any, setIsChatListOpen: any}> = ({isChatListOpen, setIsChatListOpen}) => {
    const {user, firestore} = useContext(Context)!

    const [chats, setChats] = useState<chatType[] | null>(null);
    const [users, setUsers] = useState<any | null>(null);
    const [filteredChats, setFilteredChats] = useState<chatType[] | null>(null);
    const [filterValue, setFilterValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const chatNames = {}

    console.log(chatNames)

    const getChats = async () => {
        try {
            if (user?.subscribedChats.length > 0) {
            }
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false)

        }
    }

    useEffect(() => {
        if (user) {
            getChats()
        }
    }, [user]);

    useEffect(() => {
        if (chatNames) {
            console.log(chatNames)
            // const filteredChats = chats.filter(chat => {
            //     return chat.chatName.toLowerCase().includes(filterValue.toLowerCase());
            // })
            // setFilteredChats(filteredChats)
            setFilteredChats(chats)
        }
    }, [filterValue, chatNames]);

    if (isLoading && !user) {
        return (
            <Box className={isChatListOpen ? 'myChatsOpen' : 'myChats'} sx={{ position: 'relative'}}>
                <List className={'chatList'} sx={{px: 1, py: 2, position: 'fixed', top: '56px', left: 0}}>
                    <Typography className={'chatLink'} sx={{textAlign: 'center'}}>
                        Loading.....
                    </Typography>
                </List>
            </Box>
        )
    }

    const blackBackground = 'https://www.tynker.com/minecraft/api/block?id=5993332e76f2936e3f8b4586&w=400&h=400&width=400&height=400&mode=contain&format=jpg&quality=75&cache=max&v=1502819118'

    console.log(chats, users)

    if (user?.subscribedChats) {
        return (
            <Box className={isChatListOpen ? 'myChatsOpen' : 'myChats'} sx={{ position: 'relative'}}>
                <Box className={'chatListWrapper'} sx={{px: 1,position: 'fixed', top: '56px', left: 0, pt: 2}}>
                    {isChatListOpen &&
						        <Button className={'open-chat-button'}  onClick={() => setIsChatListOpen(false)} variant={'contained'} color={'error'} sx={{mt: 1, ml: 1}}>Закрыть</Button>
                    }
                    <Box sx={{mx: 'auto', width: '90%', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>

                        <TextField fullWidth placeholder={'Поиск'} sx={{ input: {textAlign: 'center'}, my: 1}} variant={'standard'} onChange={(e) => setFilterValue(e.target.value)}/>
                        <Typography sx={{textAlign: 'center', my: 1}}>Ваши чаты ({user?.subscribedChats.length}):</Typography>

                    </Box>
                    <List sx={{mx: 'auto', width: '90%'}} className={'chatList'} >
                        {user.subscribedChats.map((chatId: string) => {
                            return (
                                <TestItem key={chatId} chatId={chatId} chatNames={chatNames} filterValue={filterValue} />
                            )
                        })}
                    </List>
                </Box>
            </Box>
        )
    } else {
        return (
            <Box className={isChatListOpen ? 'myChatsOpen' : 'myChats'} sx={{ position: 'relative'}}>
                <List className={'chatList'} sx={{px: 1, py: 2, position: 'fixed', top: '56px', left: 0}}>
                    {isChatListOpen &&
								    <Button className={'open-chat-button'}  onClick={() => setIsChatListOpen(false)} variant={'contained'} color={'error'} sx={{mb: 2}}>Закрыть</Button>
                    }
                    <Typography className={'chatLink'} sx={{textAlign: 'center'}}>
                        У вас пустой список чатов
                    </Typography>

                </List>

            </Box>
        )
    }


}

export default MyChats