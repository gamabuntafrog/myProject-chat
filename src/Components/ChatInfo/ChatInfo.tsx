import React, {FC, memo, useContext, useEffect, useState} from "react"
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
} from "@mui/material";
import Modal from "../Modal";
import {NavLink, useHistory} from "react-router-dom";
import {arrayRemove, collection, deleteDoc, doc, orderBy, query, setDoc, updateDoc, where} from "firebase/firestore";
import {Context} from "../../index";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import {ChatInfoContext} from "../../App";
import {gifMessageType, messagesExemplar, messageType, replyMessageType} from "../../types/messages";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {gifType, showRepliedMessageActionTypes} from "../Chat/Chat";
import {chatType} from "../../types/chatType";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import CloseIcon from "@mui/icons-material/Close";

type ChatInfoPT = {
    chatData: chatType
    users: any,
    showRepliedMessage: (message: messageType | replyMessageType, actionType: showRepliedMessageActionTypes) => void,
}

const ChatInfo: FC<ChatInfoPT> = memo(({
        users,
        chatData,
        showRepliedMessage
    }) => {

    const {chatName, chatImage, chatId, chatDescription} = chatData

    const {firestore, user: me} = useContext(Context)!
    const {isChatInfoOpen, handleChatInfoIsOpen} = useContext(ChatInfoContext)!

    const messagesRef = collection(firestore, 'chats',  `${chatId}`, 'messages') // , orderBy('createdAt')
    const [messagesCollection] = useCollectionData<any>(query(messagesRef, where('images', '!=', null)))

    const gifsRef = collection(firestore, 'chats',  `${chatId}`, 'messages') // , orderBy('createdAt')
    const [gifsCollection] = useCollectionData<any>(query(gifsRef, orderBy('gifInfo')))

    const [usersArray, setUsersArray] = useState<any | null>(null);
    const [userModalInfo, setUserModalInfo] = useState<null | any>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isMeAdmin, setIsMeAdmin] = useState<boolean>(false);
    const [isChangingChatInfo, setIsChangingChatInfo] = useState(false);
    const [newChatInfo, setNewChatInfo] = useState({chatName, chatImage, chatDescription});

    const [messagesWithImages, setMessagesWithImages] = useState<null | (messageType | replyMessageType)[]>(null);
    const [imagesAmount, setImagesAmount] = useState(0);
    const [messagesWithGifs, setMessagesWithGifs] = useState<null | gifMessageType[]>(null);

    const {isMobile} = useGetTypeOfScreen()
    const history = useHistory()

    useEffect(() => {
        if (users && me) {
            setIsMeAdmin(users[me.userId].isAdmin)
            setUsersArray(Object.entries(users))
        }
    }, [users]);

    useEffect(() => {
        if (gifsCollection) {
            const gifs = gifsCollection.sort((a: any, b: any) => {
                return b.createdAt - a.createdAt
            })
            setMessagesWithGifs(gifs)
        }

    }, [gifsCollection]);


    useEffect(() => {
        if (messagesCollection) {
            let imagesAmount = 0
            const messagesWithImages = messagesCollection.reduce((prevMsg: any, currentMsg, i, array) => {
                if (currentMsg.messageType === messagesExemplar.startMessage) {
                    return prevMsg
                } else {
                    if (currentMsg.images) {
                        imagesAmount += currentMsg.images.length
                        return [...prevMsg, currentMsg]
                    } else {
                        return prevMsg
                    }
                }
            }, []).sort((a: any, b: any) => {
                return b.createdAt - a.createdAt
            })
            setImagesAmount(imagesAmount)
            setMessagesWithImages(messagesWithImages)
        }

    }, [messagesCollection?.length]);

    const unsubscribeFromChat = async () => {
        if (me) {
            await updateDoc(doc(firestore, 'users', `${me.userId}`), {
                subscribedChats: arrayRemove(chatId)
            })
            await deleteDoc(doc(firestore, 'chats', `${chatId}`, 'users', `${me.userId}`))
            await updateDoc(doc(firestore, 'chats', `${chatId}`), {
                users: arrayRemove(me.userId)
            })

            history.push('/search')
        }
    }

    const removeAdmin = async (userId: string) => {
        await setDoc(doc(firestore, 'chats', `${chatId}`, 'users', `${userId}`), {
            isAdmin: false
        }, {merge: true})
        setIsUserModalOpen(false)

    }

    const addAdmin = async (userId: string) => {
        await setDoc(doc(firestore, 'chats', `${chatId}`, 'users', `${userId}`), {
            isAdmin: true
        }, {merge: true})
        setIsUserModalOpen(false)

    }

    const submitChatInfo = async () => {
        console.log(newChatInfo)
        const {chatImage, chatName, chatDescription} = newChatInfo
        await setDoc(doc(firestore, 'chats', `${chatId}`), {
            chatName: chatName,
            chatDescription,
            chatImage
        }, {merge: true})
        setIsChangingChatInfo(false)

    }

    const deleteChat = async () => {
        await deleteDoc(doc(firestore, 'chats', `${chatId}`))
        setIsUserModalOpen(false)

        history.push('/search')
    }

    const isUserAdmin = (me && users[me.userId].isAdmin)


    const seeAMessage = (message: replyMessageType | messageType) => {
        handleChatInfoIsOpen(isChatInfoOpen)
        showRepliedMessage(message, showRepliedMessageActionTypes.showMessage)
    }


    return (
        <Box>
            <Modal jc={'start'} br={'10px 0 0 10px'} buttonPosition={'absolute'} isModalOpen={isChatInfoOpen} onClose={() => handleChatInfoIsOpen(isChatInfoOpen)}>
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
                            <Typography variant={isMobile ? 'h4' : 'h2'} sx={{fontWeight: '800', px:1}}>{chatName}</Typography>
                            <Typography variant={'subtitle1'} sx={{my: 3}}>{chatDescription}</Typography>
                        </>
                    }
                        <Box sx={{display: 'flex', flexDirection: 'column', my: 1}}>
                            {(isUserAdmin && !isChangingChatInfo) &&
                                <>
                                    <Button onClick={() => setIsChangingChatInfo(true)}>
                                        Изменить информацию
                                    </Button>
                                    <Button color='error' onClick={deleteChat} >
                                        Удалить чат
                                    </Button>
                                </>
                            }
                            <Button onClick={unsubscribeFromChat} size='large' color='error'>Выйти с чата</Button>
                        </Box>
                        {messagesWithImages && messagesWithImages.length > 0 &&
                            <Box sx={{my: 2}}>
                                <Typography sx={{mb: 1}} variant='h5'>Картинки ({imagesAmount}):</Typography>
                                <ImageList sx={isMobile ? { width: '100%', maxHeight: '400px', overflowY: 'auto' } : {px: 1, maxHeight: '400px', overflowY: 'auto'}} cols={isMobile ? 2 : 4} >
                                  {messagesWithImages.map((message: messageType | replyMessageType, i: number) => {
                                      const {images} = message

                                      return (
                                          images!.map((image: any, i: number) => {
                                              if (image.url) {
                                                  return (
                                                      <ImageListItem
                                                          onClick={() => seeAMessage(message)}
                                                          key={image.url}
                                                          sx={{borderRadius: 2, overflow: 'hidden', mt: 1, mx: 0.5, maxWidth: '400px', height: '200px !important', cursor: 'pointer'}}
                                                      >
                                                          <img src={image.url}/>
                                                      </ImageListItem>
                                                  )
                                              } else {
                                                  return <div style={{display: 'none'}} key={i}/>
                                              }
                                          })
                                      )
                                  })}
                                </ImageList>
                            </Box>
                        }
                        {messagesWithGifs && messagesWithGifs.length > 0 &&
                            <Box sx={{my: 2}}>
	                            <Typography sx={{mb: 1}} variant='h5'>Gifs ({messagesWithGifs.length}):</Typography>
	                            <ImageList
                                  sx={isMobile ? { width: '100%', maxHeight: '400px', overflowY: 'auto' } : {px: 1, maxHeight: '400px', overflowY: 'auto'}}
                                  cols={isMobile ? 2 : 4}
                                  gap={6}
                                >
                                  {messagesWithGifs.map((message) => {
                                      const {gifInfo: gif} = message
                                      return (
                                          <ImageListItem sx={{overflow: 'hidden', borderRadius: 1, cursor: 'pointer'}} key={message.messageId}>
                                              <img src={gif.media_formats.nanogif.url}/>

                                          </ImageListItem>
                                      )
                                  })}
	                            </ImageList>
                            </Box>
                        }
                        <Typography variant='h5'>Пользователи ({usersArray?.length}):</Typography>
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
            {isUserModalOpen &&
                <Modal width={isMobile ? '100%' : '30%'} isPadding height={'auto'} isModalOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
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
})

export default ChatInfo