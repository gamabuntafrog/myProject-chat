import React, {useState, useEffect, useContext, FC} from "react"
import {Context} from "../../index";
import {doc, getDoc} from "firebase/firestore";
import {Avatar, Box, Button, List, ListItem, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
// @ts-ignore
import EllipsisText from "react-ellipsis-text";
import './MyChats.css';

const MyChats: FC<{users: any, isChatListOpen: any, setIsChatListOpen: any, messages: any}> = ({users, isChatListOpen, setIsChatListOpen, messages}) => {
    const {user, firestore} = useContext(Context)!

    const [chats, setChats] = useState<any>(null);
    // console.log(user)

    const getChats = async () => {
        if (user?.subscribedChats.length > 0) {
            const promiseArray = user?.subscribedChats.map( async (el: any) => {
                console.log(el)
                return await getDoc(doc(firestore, 'chats',`${el}`))
            })

            const chatsArray: any[] = []
            await Promise.all(promiseArray).then(el => {
                el.forEach(obj => {
                    // console.log(obj)
                    chatsArray.push(obj.data())
                })
            })

            setChats(chatsArray)
            console.log(chatsArray)

        }
    }

    useEffect(() => {
        if (user) {
            getChats()
        }

    }, [user, messages]);

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
        <Box  className={isChatListOpen ? 'myChatsOpen' : 'myChats'} sx={{ position: 'relative'}}>

            <List className={'chatList'} sx={{px: 1,position: 'fixed', top: '56px', left: 0, pt: 2}}>
                {isChatListOpen &&
		            <Button className={'open-chat-button'}  onClick={() => setIsChatListOpen(false)} variant={'contained'} color={'error'} sx={{mb: 2}}>Закрыть</Button>
                }
                <Typography sx={{textAlign: 'center'}}>Ваши чаты ({chats?.length}):</Typography>
                {chats && chats?.map((chat: any) => {

                    const userSender = users[chat.messages[chat.messages.length - 1].userId]
                    console.log(userSender)
                    return (
                            <NavLink className={isActive => isActive ? 'activeChat' : 'chatLink'} style={{color: 'white',
                                padding: '0 10px',
                                marginBottom: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none'}} to={`/chat/${chat.chatId}`} key={chat.chatId} >
                                <ListItem sx={{justifyContent: 'start', px: 0}} >
                                <Avatar sx={{mr: 2}} src={chat.chatImage ? chat.chatImage : blackBackground}/>
                                <Box sx={{overflow: 'hidden'}}>
                                    <Typography sx={{fontWeight: '800'}}>
                                        {chat.chatName}
                                    </Typography>
                                    <Box display={'flex'} alignItems={'baseline'}>
                                        <Typography variant={'subtitle2'} sx={{mr: 1}}>
                                            {userSender.nickname}:
                                        </Typography>
                                        <Typography variant={'subtitle1'}>
                                            <EllipsisText text={chat.messages[chat.messages.length - 1].message ? chat.messages[chat.messages.length - 1].message : chat.messages[chat.messages.length - 1].startMessage} length={10}/>
                                        </Typography>
                                    </Box>
                                </Box>
                                </ListItem>
                            </NavLink>
                    )
                })}
            </List>
        </Box>
    )
}

export default MyChats