import React, {useState, useEffect, useContext} from "react"
import {Context} from "../../index";
import {doc, getDoc} from "firebase/firestore";
import {Avatar, Box, List, ListItem, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
// @ts-ignore
import EllipsisText from "react-ellipsis-text";
import './MyChats.css';

const MyChat = ({users, isChatListOpen}: any) => {
    const {user, firestore} = useContext(Context)!

    const [chats, setChats] = useState<any>(null);
    // console.log(user)

    const getChats = async () => {
        const promiseArray = user?.subscribedChats.map( async (el: any) => {

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

    useEffect(() => {
        if (user) {
            getChats()
        }

    }, [user]);

    if (!chats) {
        return (
            <Box>
                <Typography>
                    У вас пустой список
                </Typography>
            </Box>
        )
    }

    const blackBackground = 'https://www.tynker.com/minecraft/api/block?id=5993332e76f2936e3f8b4586&w=400&h=400&width=400&height=400&mode=contain&format=jpg&quality=75&cache=max&v=1502819118'

    return (
        <Box className={'myChats'} sx={{mt: 2, width: '25%', position: 'relative'}}>
            <List sx={{px: 1,position: 'fixed', top: '64px', left: 0}}>
                {chats && chats?.map((chat: any) => {
                    // console.log(chat)
                    return (
                            <NavLink className={isActive => isActive ? 'activeChat' : 'chatLink'} style={{color: 'white',
                                padding: '0 10px',
                                marginBottom: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none'}} to={`/chat/${chat.chatId}`} key={chat.chatId} >
                                <ListItem sx={{justifyContent: 'start', px: 0}} >
                                <Avatar sx={{mr: 2}} src={chat.chatImage ? chat.chatImage : blackBackground}/>
                                <Box>
                                    <Typography>
                                        {chat.chatName}
                                    </Typography>
                                    <Box>
                                        <Typography>
                                            <EllipsisText text={chat.messages[chat.messages.length - 1].message ? chat.messages[chat.messages.length - 1].message : chat.messages[chat.messages.length - 1].startMessage} length={40}/>
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

export default MyChat