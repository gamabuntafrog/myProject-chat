import React, {FC, useContext, useEffect, useState} from "react"
import {Context} from "../../index";
import {Avatar, Box, Button, List, ListItem, TextField, Typography} from "@mui/material";
import '../../App.css';
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import {
    chatList,
    closeButton,
    item,
    itemMessagesWrapper,
    itemWrapper,
    myChatBar,
    myChatBarChats,
    myChatBarInput,
    myChatsSection
} from "./MyChatsStyles";
import {collection, doc, getDoc, query, where} from "firebase/firestore";
import {chatType} from "../../types/chatType";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {NavLink} from "react-router-dom";
import EllipsisText from "react-ellipsis-text";
import {ThemeContext} from "../../App";
import {format} from "date-fns";
import {messagesExemplar} from "../../types/messages";

type MyChatsPT = {
    isChatListOpen: boolean,
    handleIsChatListOpen: (isOpen: boolean) => void,
    id?: string | undefined
}

const MyChats: FC<MyChatsPT> = ({isChatListOpen, handleIsChatListOpen, id}) => {


    const {user, isUserLoading, firestore} = useContext(Context)!
    const {userStyles} = useContext(ThemeContext)!

    const [chats, isChatsLoading] = useCollectionData<any>(query(collection(firestore, 'chats'), where('users', 'array-contains', user?.userId)))
    const [filteredChats, setFilteredChats] = useState<null | chatType[]>(null);
    const [filterValue, setFilterValue] = useState('');
    const [users, setUsers] = useState<null | any>(null);

    const type = useGetTypeOfScreen()
    const mediumOfSmallType = (type === screenTypes.mediumType || type === screenTypes.smallType);

    // const {isChatListOpen, handleIsChatListOpen} = useContext(ChatListContext)!


    const fetchUsers = async (chatsCollection: chatType[]) => {
        const usersPromiseArray = chatsCollection.map(async (el: chatType) => {
            return await getDoc(doc(firestore, 'users', el.lastMessage.userId))
        })
        const usersObject: any = {}
        const waitForUsers = Promise.all(usersPromiseArray).then((users) => {
            users.forEach((user) => {
                if (user) {
                    usersObject[user.data()?.userId] = user.data()
                }
            })
            // console.log(usersObject)
            setUsers(usersObject)
        })
    }

    useEffect(() => {
        if (chats) {
            // console.log(chats)
            fetchUsers(chats)
        }
    }, [chats]);

    useEffect(() => {
        if (chats) {
            const filtered = chats.filter((chat) => {
                return chat.chatName.toLowerCase().includes(filterValue.toLowerCase())
            }).sort((a, b) => {
                return b.lastMessage.createdAt - a.lastMessage.createdAt
            })
            setFilteredChats(filtered)
        }

    }, [filterValue, chats]);

    useEffect(() => {
        console.log(id)
        if (!id) {
            handleIsChatListOpen(false)

        }

    }, [id]);



    if (isUserLoading) {
        return (
            <Box sx={{...myChatsSection(mediumOfSmallType, isChatListOpen, userStyles.secondBackgroundColor)}}>
                <List sx={chatList}>
                    <Box sx={{textAlign: 'center'}}>
                        Loading.....
                    </Box>
                </List>
            </Box>
        )
    }

    const blackBackground = 'https://www.tynker.com/minecraft/api/block?id=5993332e76f2936e3f8b4586&w=400&h=400&width=400&height=400&mode=contain&format=jpg&quality=75&cache=max&v=1502819118'

    return (
        <Box component='section' sx={{...myChatsSection(mediumOfSmallType, isChatListOpen, userStyles.secondBackgroundColor)}}>
            {/*{isChatListOpen &&*/}
            {/*            <Button onClick={() => handleIsChatListOpen(true)} variant='contained' color='error' sx={closeButton}>Закрыть</Button>*/}
            {/*}*/}
            <Box sx={myChatBar}>
                {chats && chats?.length > 0 ?
                    <>
                        <TextField fullWidth placeholder='Поиск' sx={myChatBarInput} variant='standard' onChange={(e) => setFilterValue(e.target.value)}/>
                        <Typography sx={myChatBarChats}>Ваши чаты ({chats?.length}):</Typography>
                    </>
                    :
                    <Typography sx={{textAlign: 'center', mt: 5}}>Ваш список пустой</Typography>
                }
            </Box>
                <List sx={chatList} >
                    {users && filteredChats?.map((chat: chatType) => {
                        // console.log(chat)
                        const {lastMessage, chatId, chatImage, chatName} = chat
                        // console.log(lastMessage)
                        const user = users[lastMessage.userId]
                        const createdAtFormatted = format(lastMessage.createdAt, 'HH mm').split(' ').join(':')
                        const changedAtFormatted = lastMessage.messageType !== messagesExemplar.startMessage &&
                        lastMessage?.changedAt ? format(lastMessage.changedAt, 'HH mm').split(' ').join(':') : null

                        return (
                            <NavLink
                                className={isActive => isActive ? 'activeChat' : 'chatLink'}
                                style={itemWrapper(userStyles.theme)}
                                onClick={() => handleIsChatListOpen(true)}
                                to={`/chat/${chat?.chatId}`}
                                key={chat?.chatId}
                            >
                                <ListItem sx={item} >
                                    <Avatar sx={{mr: 1.5}} src={chat?.chatImage ? chat.chatImage : blackBackground}/>
                                    <Box sx={{overflow: 'hidden'}}>
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <Typography sx={{fontWeight: '800', display: 'inline-flex'}}>
                                                    <EllipsisText text={chat?.chatName || ''} length={30}/>
                                                </Typography>
                                                <Box sx={{ml: 1, display: 'inline-flex'}}>
                                                    <Typography variant={'body2'}>
                                                        |
                                                    </Typography>
                                                    <Typography variant={'body2'} sx={{ml: 0.5, wordBreak: 'normal'}}>
                                                        {createdAtFormatted}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        <Box sx={itemMessagesWrapper}>
                                            <Typography variant={'subtitle2'} sx={{mr: 1}}>
                                                <EllipsisText text={`${user?.nickname}:`} length={30}/>
                                            </Typography>
                                            <Typography variant={'body2'} sx={{mr: 1, color: 'whitesmoke'}}>
                                                <EllipsisText text={lastMessage?.message} length={30}/>
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