import React, {Dispatch, FC, SetStateAction, useContext, useEffect, useState} from "react";
import shortid from 'shortid';
import {useParams} from "react-router-dom";
import {arrayUnion, doc, setDoc, updateDoc} from "firebase/firestore";
import {Context} from "../..";
import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Button,
    Container,
    FormLabel, ImageList, ImageListItem,
    Snackbar,
    TextField,
    Typography
} from "@mui/material"
import ReplyIcon from '@mui/icons-material/Reply';
import SendIcon from '@mui/icons-material/Send';
import '../../App.css';
import ChatInfo from "../ChatInfo";
import {
    messagesExemplar,
    messagesType,
    messagesWhichOnProgressType,
    messageType,
    replyMessageType
} from '../../types/messages';
import CloseIcon from "@mui/icons-material/Close";
import EllipsisText from "react-ellipsis-text";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import {emojiType, showRepliedMessageActionTypes} from "../Chat/Chat";
import {ThemeContext} from "../../App";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import Modal from "../Modal";
import ImageGallery from 'react-image-gallery';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

type EntryFieldPT = {
    chatId: string,
    users: any,
    isReplying: boolean,
    setIsReplying: React.Dispatch<React.SetStateAction<boolean>>
    replyMessageInfo: any,
    showRepliedMessage: (message: messageType | replyMessageType, actionType: showRepliedMessageActionTypes) => void,
    emoji: emojiType | null,
    inputRef: React.MutableRefObject<HTMLInputElement | null>,
    setMessagesWhichOnProgress: React.Dispatch<React.SetStateAction<null | messagesWhichOnProgressType[]>>,
    setShowMedia: Dispatch<SetStateAction<boolean>>,
}

const EntryField: FC<EntryFieldPT> = ({
    users,
    chatId,
    isReplying,
    replyMessageInfo,
    setIsReplying,
    showRepliedMessage,
    emoji,
    inputRef,
    setMessagesWhichOnProgress,
    setShowMedia
}) => {

    const { firestore, user, isUserLoading} = useContext(Context)!
    const {userStyles} = useContext(ThemeContext)!
    const storage = getStorage()

    const {id} = useParams<{ id: string }>()

    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);


    const type = useGetTypeOfScreen()
    const isMobile = type === screenTypes.smallType

    useEffect(() => {
        setIsReplying(false)
        setMessage('')
    }, [id]);

    useEffect(() => {
        if (emoji) {
            setMessage(prev => {
                return prev + emoji.emoji
            })
        }
    }, [emoji]);


    const subscribeUser = async () => {
        await setDoc(doc(firestore, 'chats', `${id}`, 'users', `${user?.userId}`), {
            userId: user?.userId,
            isAdmin: false
        })
        await updateDoc(doc(firestore, 'users', `${user?.userId}`), {
            subscribedChats: arrayUnion(chatId)
        })
        await updateDoc(doc(firestore, 'chats', `${id}`), {
            users: arrayUnion(user?.userId)
        })
    }

    const sendMessagesWhenUrlsDone = async (urls: {url: string, imageRef: string}[] | null, message: string, newMessageId: string) => {
        // const newMessageId = `${user!.userId}${shortid.generate()}${shortid.generate()}${Date.now()}`

        if (isReplying) {
            const docRef = await setDoc(doc(firestore, 'chats', `${id}`, 'messages', `${newMessageId}`), {
                messageType: messagesExemplar.replyMessage,
                userId: user!.userId,
                message: message,
                createdAt: Date.now(),
                replyer: replyMessageInfo,
                messageId: newMessageId,
                chatId: id,
                images: urls

            })
            await setDoc(doc(firestore, 'chats', `${id}`), {
                lastMessage: {
                    messageType: messagesExemplar.replyMessage,
                    userId: user!.userId,
                    message: message,
                    createdAt: Date.now(),
                    replyer: replyMessageInfo,
                    messageId: newMessageId,
                    chatId: id,
                    images: urls

                }
            }, {merge: true})
            setIsReplying(false)
        } else {
            const docRef = await setDoc(doc(firestore, 'chats', `${id}`, 'messages', `${newMessageId}`), {
                messageType: messagesExemplar.message,
                userId: user!.userId,
                message: message,
                createdAt: Date.now(),
                messageId: newMessageId,
                chatId: id,
                images: urls
            })
            await setDoc(doc(firestore, 'chats', `${id}`), {
                lastMessage: {
                    messageType: messagesExemplar.message,
                    userId: user!.userId,
                    message: message,
                    createdAt: Date.now(),
                    messageId: newMessageId,
                    chatId: id,
                    images: urls

                }
            }, {merge: true})
        }

        // console.log(messagesWhichOnProgress)
        // console.log(newMessageId)
    }


    const submitPost = async () => {

        const messageOnSubmit = message
        setMessage('')
        // setMessageOnSubmit(message)
        if (previewImages?.length < 1 && messageOnSubmit.trim() === '') {
            setOpen(true)
            return
        }

        if (user) {
            const newMessageId = `${user.userId}${shortid.generate()}${shortid.generate()}${Date.now()}`


            const now = Date.now()

            const changeInfo = async (messageOnSubmit: string) => {

                if (previewImages) {
                    const message = isReplying ? {
                        messageType: messagesExemplar.replyMessage,
                        replyer: replyMessageInfo,
                        userId: user?.userId,
                        message: messageOnSubmit,
                        createdAt: Date.now(),
                        messageId: newMessageId,
                        chatId: id,
                        images: previewImages
                    } : {
                        messageType: messagesExemplar.message,
                        userId: user?.userId,
                        message: messageOnSubmit,
                        createdAt: Date.now(),
                        messageId: newMessageId,
                        chatId: id,
                        images: previewImages
                    }
                    setMessagesWhichOnProgress((prev: any) => {
                        if (prev !== null) {
                            return [...prev, message]
                        } else {
                            return [message]
                        }
                    })

                    const promisesWithImagesUrlWhenTheseDone = previewImages.map( async (image: any, i: number) => {
                        return await new Promise((resolve, err) => {
                            const imageRef = `/${chatId}/${now}${fileImages![i].name}`
                            const storageRef = ref(storage, imageRef)
                            const uploadTask = uploadBytesResumable(storageRef, fileImages![i])


                            uploadTask.on('state_changed', (snapshot => {
                            }), (err) => {
                                console.log(err)
                            }, async () => {
                                await getDownloadURL(uploadTask.snapshot.ref)
                                    .then(url => {
                                        resolve({url, imageRef})
                                    })
                            })
                        })
                    })
                    setPreviewImages(null)

                    Promise.all(promisesWithImagesUrlWhenTheseDone).then((imagesRef) => {
                        console.log(imagesRef)
                        setMessagesWhichOnProgress(null)
                        sendMessagesWhenUrlsDone(imagesRef, messageOnSubmit, newMessageId)
                    })
                } else {
                    sendMessagesWhenUrlsDone(null, messageOnSubmit, newMessageId)
                }

            }
            changeInfo(messageOnSubmit)

            // console.log(docRef)






        }

    }

    const handleClose = (_: any, reason: string) => {
        if (reason === 'clickaway') { //если кликнул по других элементах
            return;
        }

        setOpen(false);
    };
    const [previewImages, setPreviewImages] = useState<null | any>(null);
    const [fileImages, setFileImages] = useState<null | FileList>(null);

    const imageHandler = (file: any) => {
        console.log(file)
        const reader = new FileReader()

        reader.onload = () => {
            if (reader.readyState === 2) {
                // console.log(reader.result)
                setPreviewImages((prev: any) => {
                    if (prev === null) {
                        return [reader.result]
                    }
                    return [...prev, reader.result]
                })
            }

        }
        reader.readAsDataURL(file)
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImageIndex, setPreviewImageIndex] = useState(0);

    if (user && !users[user.userId]) {
        return <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', pb: 3}}>
            <Button size={'large'} variant={'contained'} sx={{width: '90%'}} onClick={subscribeUser}>Присоединится</Button>
        </Container>
    }


    return (
        <>
            <Modal width='70%' height='90%' buttonPosition='absolute' isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box sx={{
                    width: '100%',
                    // height: '95vh'
                }}>
                    <ImageGallery
                        showPlayButton={false} startIndex={previewImageIndex} showFullscreenButton={false} fullscreen thumbnailPosition='left' sizes='100px' infinite={false} thumbnailWidth='100%' thumbnailHeight='600px' originalWidth='100%' items={previewImages?.map((img: File) => {
                        return {original: img, thumbnail: img}
                    }) || []}/>
                </Box>
            </Modal>
            <Box sx={{position: 'sticky', bottom: '0px', mt: -1, pt: 2, pb: 2, px: isMobile ? 1 : 2, backgroundColor: userStyles.secondBackgroundColor || '#121212', zIndex: 100, borderRadius: '8px 8px 0 0', borderTop: '1px solid #363636'}}>
                <Box>
                    {isReplying &&
                        <Box sx={{display: 'flex', mb: 1, alignItems: 'center', cursor: 'pointer'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}} onClick={() => showRepliedMessage(replyMessageInfo, showRepliedMessageActionTypes.showMessage)}>
                                <ReplyIcon sx={{width: '30px', height: '30px', mr: 1}}/>
                                <Box>
                                    <Typography>{users[replyMessageInfo.userId].nickname}</Typography>
                                    <Typography >
                                        <EllipsisText text={replyMessageInfo.message} length={150}/>
                                    </Typography>
                                </Box>
                            </Box>

                            <Button color={'error'} sx={{ml: 'auto'}} onClick={() => setIsReplying(false)}>
                                <CloseIcon />
                            </Button>
                        </Box>
                    }
                    {previewImages?.length > 0 &&
                        <Box sx={{display: 'flex', flexWrap: 'wrap', mb: 1, alignItems: 'center'}}>
                            {previewImages.map((image: File, i:number) => {
                                return <Avatar
                                    sx={{width: '60px', height: '60px', ml: 1, cursor: 'pointer', borderRadius: 3, border: `2px solid ${userStyles.backgroundColor}`}}
                                    key={i}
                                    // @ts-ignore
                                    src={image}
                                    onClick={() => {
                                        setPreviewImageIndex(i)
                                        setIsModalOpen(true)
                                    }}
                                />
                            })}
                            <Button color={'error'} onClick={() => setPreviewImages(null)} sx={{ml: 'auto',minWidth: '40px'}}>
                                <CloseIcon />
                            </Button>
                        </Box>
                    }
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <Button
                            variant='outlined'
                            sx={{padding: 0, mr: 0.5, borderRadius: type === screenTypes.largeType ? '4px' : '50px', minWidth: '40px'}}
                            onClick={() => setShowMedia(true)}
                        >
                            <InsertEmoticonIcon/>
                        </Button>
                        <TextField
                            id="outlined-name"
                            label="Сообщение"
                            value={message}
                            onChange={(e) => setMessage(e.currentTarget.value)}
                            fullWidth
                            multiline
                            maxRows={10}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    return submitPost()
                                } //submit
                            }}
                            inputRef={inputRef}
                        />
                        <Button variant='outlined' sx={{padding: 0, ml: 0.5, borderRadius: type === screenTypes.largeType ? '4px' : '50px', minWidth: '40px'}}>
                            <FormLabel sx={{color: 'inherit', height: '100%', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}} htmlFor='fileInput'>
                                <AttachFileIcon/>
                            </FormLabel>
                        </Button>
                        <input id='fileInput' multiple type='file' accept=".jpg, .jpeg, .png" onChange={(e) => {
                            setFileImages(e.target.files)
                            if (e.target.files) {
                                setPreviewImages([])
                                const files = [...e.target.files]
                                files.map((file) => {
                                    imageHandler(file)
                                })
                            }
                        }}/>
                        <Button sx={{ml: 0.5, borderRadius: type === screenTypes.largeType ? '4px' : '50px', minWidth: '30px'}} variant="outlined" onClick={submitPost}>
                            <SendIcon/>
                        </Button>
                    </Box>
                </Box>

                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    open={open}
                    autoHideDuration={6000}
                    onClose={() => setOpen(false)}
                >
                    <Alert variant={'filled'} severity="error">
                        <AlertTitle sx={{mt: -0.5, flexGrow: 1}}>Введите сообщение </AlertTitle>
                        {/* @ts-ignore */}
                        <Button sx={{ml: 9}} color={'error'} size="small" onClick={handleClose}>
                            Закрыть
                        </Button>
                    </Alert>
                </Snackbar>

            </Box>
        </>
    )


}


export default EntryField;