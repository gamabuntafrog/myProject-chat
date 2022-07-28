import React, {useState, useEffect, FC, useContext} from "react"
import {Avatar, Box, Button, List, ListItem, TextField, Typography, useMediaQuery} from "@mui/material";
import Modal from "../Modal";
import {NavLink, useHistory} from "react-router-dom";
import {arrayRemove, arrayUnion, doc, setDoc, updateDoc} from "firebase/firestore";
import {Context} from "../../index";
import { entryFieldInfo } from "./chatInfoStyles";

type ChatInfoPT = {
    id: string,
    chatName: string,
    chatImage: string,
    chatDescription: string,
    users: any
}

const ChatInfo: FC<ChatInfoPT> = ({id, chatName, users, chatImage, chatDescription}) => {

    const {firestore, user} = useContext(Context)!
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usersArray, setUsersArray] = useState<any | null>(null);
    const [userModalInfo, setUserModalInfo] = useState<null | any>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isMeAdmin, setIsMeAdmin] = useState<boolean>(false);
    const [isChangingChatInfo, setIsChangingChatInfo] = useState(false);
    const [newChatInfo, setNewChatInfo] = useState({chatName, chatImage, chatDescription});

    const history = useHistory()

    useEffect(() => {
        if (users) {
            setIsMeAdmin(users[user?.userId].isAdmin)
            setUsersArray(Object.entries(users))
            // console.log((isMeAdmin && userModalInfo.isAdmin))
        }

    }, [users]);

    const unsubscribeFromChat = async () => {
        await updateDoc(doc(firestore, 'users', `${user?.userId}`), {
            subscribedChats: arrayRemove(id)
        })
        console.log(user?.userId, user?.isAdmin)
        await updateDoc(doc(firestore, 'chats', `${id}`), {
            users: arrayRemove({
                userId: user?.userId,
                isAdmin: isMeAdmin
            })
        })
        history.push('/search')
    }

    const removeAdmin = async (userId: string) => {
        await updateDoc(doc(firestore, 'chats', `${id}`), {
            users: arrayRemove({userId: userId, isAdmin: true})
        })
        await updateDoc(doc(firestore, 'chats', `${id}`), {
            users: arrayUnion({userId: userId, isAdmin: false})
        })
        setIsUserModalOpen(false)

    }

    const addAdmin = async (userId: string) => {
        setIsUserModalOpen(false)
        console.log(userId)
        await updateDoc(doc(firestore, 'chats', `${id}`), {
            users: arrayRemove({userId: userId, isAdmin: false})
        })
        await updateDoc(doc(firestore, 'chats', `${id}`), {
            users: arrayUnion({userId: userId, isAdmin: true})
        })
    }

    const submitChatInfo = async () => {
        console.log(newChatInfo)
        const {chatImage, chatName, chatDescription} = newChatInfo
        await updateDoc(doc(firestore, 'chats', `${id}`), {
            chatName,
            chatDescription,
            chatImage
        })
        setIsChangingChatInfo(false)
    }


    return (
        <Box>
            <Box sx={entryFieldInfo} >
                <Typography variant={'body1'}>{id} | {chatName}</Typography>
                <Button onClick={() => setIsModalOpen(true)} sx={{ml: 1}}>Информация</Button>
            </Box>
            {isModalOpen &&
		        <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
			        <Box sx={{textAlign: 'center'}}>
                        {isChangingChatInfo ?
                            <Box sx={{display: 'flex',flexDirection: 'column', my: 1 }}>
                                <TextField onChange={(e) => {
                                    setNewChatInfo(prev => {
                                        return {...prev, chatName: e.target.value}
                                    })
                                }} placeholder={'Название чата'} />
                                <TextField onChange={(e) => {
                                    setNewChatInfo(prev => {
                                        return {...prev, chatDescription: e.target.value}
                                    })
                                }} sx={{my: 2}} multiline placeholder={'Описание'} />
                                <TextField onChange={(e) => {
                                    setNewChatInfo(prev => {
                                        return {...prev, chatImage: e.target.value}
                                    })
                                }} placeholder={'Ссылка на картинку'} />
                                <Button sx={{mt: 1}} onClick={submitChatInfo} >Изменить</Button>
                                <Button sx={{mt: 1}} onClick={() => setIsChangingChatInfo(false)}>Отменить</Button>
                            </Box>
                            :
                            <>
                                <Avatar sx={{width: '300px', height: '300px', mb: 3, mx: 'auto'}} src={chatImage}/>
                                <Typography variant={'h2'} sx={{fontWeight: '800'}}>{chatName}</Typography>
                                <Typography variant={'subtitle1'} sx={{my: 3}}>{chatDescription}</Typography>
                            </>
                        }
                        <Box sx={{display: 'flex', flexDirection: 'column', my: 1}}>
                            {(users[user?.userId].isAdmin && !isChangingChatInfo) &&
		                        <Button onClick={() => setIsChangingChatInfo(true)}>
			                        Изменить информацию
		                        </Button>
                            }
	                        <Button onClick={unsubscribeFromChat} color={'error'}>Выйти с чата</Button>
                        </Box>
                        <Typography variant='h5'>Пользователи ({usersArray.length}):</Typography>
                        <List sx={{width: '100%'}}>
                          {usersArray?.map((el: any, i: number) => {
                              // const user = el[1]
                              const [docId, user] = el
                              const {bio, userId, nickname, photoURL} = user

                              return <ListItem className={'typography'} onClick={() => {
                                  setUserModalInfo(user)
                                  setIsUserModalOpen(true)
                              }} sx={{display: 'flex',  justifyContent: 'center'}} key={i}>
                                  <Avatar sx={{width: '50px', height: '50px'}} src={user.photoURL}/>
                                  <Typography sx={{ml: 1}} >
                                      {nickname}
                                  </Typography>

                              </ListItem>
                          })}
                        </List>
                    </Box>
		        </Modal>
            }
            {isUserModalOpen &&
		        <Modal isModalOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
			        <Avatar sx={{width: 200, height: 200}} src={`${userModalInfo.photoURL}`} alt="avatar"/>
			        <NavLink style={{color: 'white'}} to={`/user/${userModalInfo.userId}`}>
				        <Typography sx={{mt: 1}} variant={'h5'}>{userModalInfo.nickname}</Typography>
			        </NavLink>
			        <Typography variant={'subtitle1'}>{userModalInfo.bio}</Typography>
                    {isMeAdmin ?
                        userModalInfo?.isAdmin ?
                            user?.userId === userModalInfo?.userId ? ''
                                : <Button onClick={() => removeAdmin(userModalInfo.userId)}>Удалить роль администратора</Button>
                            : <Button onClick={() => addAdmin(userModalInfo.userId)}>Сделать админом</Button>
                        : ''}
		        </Modal>
            }
        </Box>
    )
}

export default ChatInfo