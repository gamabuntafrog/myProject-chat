import React, {useState, useEffect, useContext, FC} from "react"
import {Context} from "../../index";
import {doc, getDoc} from "firebase/firestore";
import {Avatar, Box, Button, List, ListItem, TextField, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
// @ts-ignore
import EllipsisText from "react-ellipsis-text";
import './MyChats.css';

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
    messages: messageType[]
}

const MyChats: FC<{isChatListOpen: any, setIsChatListOpen: any, messages: any}> = ({isChatListOpen, setIsChatListOpen, messages}) => {
    const {user, firestore} = useContext(Context)!

    const [chats, setChats] = useState<chatType[] | null>(null);
    const [users, setUsers] = useState<any | null>(null);
    const [filteredChats, setFilteredChats] = useState<chatType[] | null>(null);
    const [filterValue, setFilterValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // console.log(user)

    const getChats = async () => {
        if (user?.subscribedChats.length > 0) {
            const promiseChatsArray = user?.subscribedChats.map( async (el: any) => {
                // console.log(el)
                return await getDoc(doc(firestore, 'chats',`${el}`))
            })

            const chatsArray: chatType[] = []
            const usersIdArray: any = []

            const getChatsAndUsersId = await Promise.all(promiseChatsArray).then(el => {
                el.forEach(obj => {
                    const chat = obj.data()

                    if (chat) {
                        chatsArray.push(chat)
                        const lastMessageIndex = chat.messages.length - 1
                        // console.log(chat)
                        const userId = chat.messages[lastMessageIndex].userId
                        usersIdArray.push(userId)

                    }
                })
            })

            setChats(chatsArray)
            // console.log(usersIdArray)

            const promiseUsersArray = usersIdArray?.map( async (userId: any) => {
                // console.log(el)
                return await getDoc(doc(firestore, 'users',`${userId}`))
            })
            const usersData: any = {}
            const getUsers = await Promise.all(promiseUsersArray).then(el => {
                el.forEach(obj => {
                    // console.log(obj)
                    const user = obj.data()
                    // console.log(user)
                    if (user) {
                        usersData[user.userId] = user
                    }
                })
            })

            setUsers(usersData)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            getChats()
        }
    }, [user, messages]);

    useEffect(() => {
        if (chats) {
            const filteredChats = chats.filter(chat => {
                return chat.chatName.toLowerCase().includes(filterValue.toLowerCase());
            })
            setFilteredChats(filteredChats)
        }
    }, [filterValue, chats]);

    if (isLoading) {
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

    if (!chats) {
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

    const blackBackground = 'https://www.tynker.com/minecraft/api/block?id=5993332e76f2936e3f8b4586&w=400&h=400&width=400&height=400&mode=contain&format=jpg&quality=75&cache=max&v=1502819118'

    return (
        <Box className={isChatListOpen ? 'myChatsOpen' : 'myChats'} sx={{ position: 'relative'}}>
            <Box className={'chatListWrapper'} sx={{px: 1,position: 'fixed', top: '56px', left: 0, pt: 2}}>
                {isChatListOpen &&
		            <Button className={'open-chat-button'}  onClick={() => setIsChatListOpen(false)} variant={'contained'} color={'error'} sx={{mt: 1, ml: 1}}>Закрыть</Button>
                }
                <Box sx={{mx: 'auto', width: '90%', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>

                    <TextField fullWidth placeholder={'Поиск'} sx={{ input: {textAlign: 'center'}, my: 1}} variant={'standard'} onChange={(e) => setFilterValue(e.target.value)}/>
                    <Typography sx={{textAlign: 'center', my: 1}}>Ваши чаты ({filteredChats?.length}):</Typography>

                </Box>
            <List sx={{mx: 'auto', width: '90%'}} className={'chatList'} >

                {filteredChats && users && filteredChats?.map((chat: any) => {
                    // console.log(chat)
                    const userSender = users[chat?.messages[chat.messages.length - 1].userId]
                    const message = chat.messages[chat.messages.length - 1]
                    // console.log(message)
                    // console.log(userSender)
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
                                            {/*{userSender?.nickname ? userSender.nickname + ':' : ''}*/}
                                            <EllipsisText text={userSender?.nickname ? userSender.nickname + ':' : ''} length={30}/>

                                        </Typography>
                                        <Typography variant={'body2'} sx={{mr: 1}}>
                                            <EllipsisText text={message.message ? message.message : message.startMessage} length={30}/>
                                        </Typography>
                                    </Box>
                                </Box>
                                </ListItem>
                            </NavLink>
                    )
                })}
            </List>
            </Box>

        </Box>
    )
}

export default MyChats