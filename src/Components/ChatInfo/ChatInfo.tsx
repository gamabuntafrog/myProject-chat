import React, {FC, useContext, useEffect, useState} from "react"
import {Avatar, Box, Button, IconButton, List, ListItem, TextField, Typography} from "@mui/material";
import Modal from "../Modal";
import {NavLink, useHistory} from "react-router-dom";
import {arrayRemove, deleteDoc, doc, setDoc, updateDoc} from "firebase/firestore";
import {Context} from "../../index";
import {entryFieldInfo} from "./chatInfoStyles";
import InfoIcon from "@mui/icons-material/Info";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import {justifyColumnCenter} from "../GeneralStyles";

type ChatInfoPT = {
    id: string,
    chatName: string,
    chatImage: string,
    chatDescription: string,
    users: any,
    setIsChatListOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const ChatInfo: FC<ChatInfoPT> = ({
        id,
        chatName,
        users,
        chatImage,
        chatDescription,
        setIsChatListOpen
    }) => {

    const {firestore, user: me} = useContext(Context)!
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usersArray, setUsersArray] = useState<any | null>(null);
    const [userModalInfo, setUserModalInfo] = useState<null | any>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isMeAdmin, setIsMeAdmin] = useState<boolean>(false);
    const [isChangingChatInfo, setIsChangingChatInfo] = useState(false);
    const [newChatInfo, setNewChatInfo] = useState({chatName, chatImage, chatDescription});

    const type = useGetTypeOfScreen()
    const isMobile = type === screenTypes.smallType
    const history = useHistory()

    useEffect(() => {
        if (users && me) {
            setIsMeAdmin(users[me.userId].isAdmin)
            setUsersArray(Object.entries(users))
        }
    }, [users]);

    const unsubscribeFromChat = async () => {
        if (me) {
            await updateDoc(doc(firestore, 'users', `${me.userId}`), {
                subscribedChats: arrayRemove(id)
            })
            await deleteDoc(doc(firestore, 'chats', `${id}`, 'users', `${me.userId}`))
            history.push('/search')
        }
    }

    const removeAdmin = async (userId: string) => {
        await setDoc(doc(firestore, 'chats', `${id}`, 'users', `${userId}`), {
            isAdmin: false
        }, {merge: true})
        setIsUserModalOpen(false)

    }

    const addAdmin = async (userId: string) => {
        await setDoc(doc(firestore, 'chats', `${id}`, 'users', `${userId}`), {
            isAdmin: true
        }, {merge: true})
        setIsUserModalOpen(false)

    }

    const submitChatInfo = async () => {
        console.log(newChatInfo)
        const {chatImage, chatName, chatDescription} = newChatInfo
        await setDoc(doc(firestore, 'chats', `${id}`), {
            chatName: chatName,
            chatDescription,
            chatImage
        }, {merge: true})
        setIsChangingChatInfo(false)

    }

    const isUserAdmin = (me && users[me.userId].isAdmin)

    return (
        <Box>
            <Box sx={entryFieldInfo} >
                {type !== screenTypes.largeType &&
                    <Button sx={{mr: 2}} onClick={() => setIsChatListOpen(true)}>
                        Ваши чаты
                    </Button>
                }
                <Typography variant={'body1'}>{chatName}</Typography>
                <IconButton sx={{ml: 1}}  color="primary" onClick={() => setIsModalOpen(true)}>
                    <InfoIcon/>
                </IconButton>
            </Box>
            {isModalOpen &&
		        <Modal br={'10px 0 0 10px'} buttonPosition={'absolute'} isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
			        <Box sx={{textAlign: 'center', width: isChangingChatInfo ? '95%' : 'auto'}}>
                        {isChangingChatInfo ?
                            <Box sx={{display: 'flex',flexDirection: 'column', my: 1 }}>
                                <TextField fullWidth onChange={(e) => {
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
                                <Avatar sx={{width: '100%', mb: 3, mx: 'auto',
                                borderRadius: '0 0 30px 30px', height: 'auto'}} src={chatImage}/>
                                <Typography variant={'h2'} sx={{fontWeight: '800'}}>{chatName}</Typography>
                                <Typography variant={'subtitle1'} sx={{my: 3}}>{chatDescription}</Typography>
                            </>
                        }
                        <Box sx={{display: 'flex', flexDirection: 'column', my: 1}}>
                            {(isUserAdmin && !isChangingChatInfo) &&
		                        <Button onClick={() => setIsChangingChatInfo(true)}>
			                        Изменить информацию
		                        </Button>
                            }
	                        <Button onClick={unsubscribeFromChat} size='large' color='error'>Выйти с чата</Button>
                        </Box>
                        <Typography variant='h5'>Пользователи ({usersArray.length}):</Typography>
                        <List sx={{width: '90%', mx: 'auto'}}>
                          {usersArray?.map((el: any, i: number) => {
                              const [docId, user] = el
                              const {nickname, photoURL} = user

                              return (
                                  <ListItem className={'typography'} onClick={() => {
                                      setUserModalInfo(user)
                                      setIsUserModalOpen(true)
                                  }} sx={{display: 'flex',  justifyContent: 'center'}} key={i}>
                                      <Avatar sx={{width: '50px', height: '50px'}} src={photoURL}/>
                                      <Typography sx={{ml: 1}} >
                                          {nickname}
                                      </Typography>
                                  </ListItem>
                              )
                          })}
                        </List>
                    </Box>
		        </Modal>
            }
            {isUserModalOpen &&
		        <Modal isPadding height={'auto'} isModalOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
			        <Avatar sx={{width: 200, height: 200}} src={`${userModalInfo.photoURL}`} alt="avatar"/>
			        <NavLink style={{color: 'white'}} to={`/user/${userModalInfo.userId}`}>
				        <Typography sx={{mt: 1}} variant={'h5'}>{userModalInfo.nickname}</Typography>
			        </NavLink>
			        <Typography variant={'subtitle1'}>{userModalInfo.bio}</Typography>
                    {isMeAdmin ? // Есть ли я админ
                        userModalInfo?.isAdmin ? // Есть ли пользователь в модальном окне админ
                            me?.userId === userModalInfo?.userId ? '' // Является ли тот пользователь мной
                                : <Button onClick={() => removeAdmin(userModalInfo.userId)}>Удалить роль администратора</Button>
                            : <Button onClick={() => addAdmin(userModalInfo.userId)}>Сделать админом</Button>
                        : ''
                    }
		        </Modal>
            }
        </Box>
    )
}

export default ChatInfo