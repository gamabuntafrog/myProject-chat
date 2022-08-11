import React, {useState, useEffect, FC, useContext} from "react"
import {
    Alert,
    Avatar,
    Box,
    Button,
    FormControl, FormLabel,
    IconButton,
    Input,
    List,
    ListItem, Snackbar,
    TextField,
    Typography
} from "@mui/material";
import {Context} from "../../index";
import { setDoc, doc} from "firebase/firestore";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import {
    activeUsername,
    avatarWrapper, dateMessage, messageContainer, messageLeftLine,
    messageListItem,
     messageStyles,
     userRole,
    userWrapper
} from "../Messages/MessagesStyles";
import {messagesExemplar, messagesType, replyMessageType} from "../../types/messages";
import {format} from "date-fns";
import ReplyIcon from "@mui/icons-material/Reply";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import '../../App.css';
import '../Messages/Messages.css';
import {ChromePicker, ColorChangeHandler, SliderPicker} from "react-color";
import {ThemeContext} from "../../App";
import '../../App.css'
const messageWrapper = (isMessageBeforeIsMine: boolean, isMessageAfterThisMine: boolean, isMobileType: boolean, borderRadius?: string | number) => {

    return ({
        flexGrow: 1,
        backgroundColor: '#121212',
        pl: 2,
        pr: isMobileType ? 2 : 4,
        pt: 2,
        pb: 3,
        borderRadius: isMessageAfterThisMine ? borderRadius ? `${borderRadius}px` : 1 : `${borderRadius}px ${borderRadius}px ${borderRadius}px 0`
    })
}
export const messagesList = (isMobileScreen: boolean, background: ArrayBuffer | File | string | null, color: string | undefined) => {

    return ({
        px: 2,
        pb: 3,
        maxHeight: '100vh',
        minHeight: '70vh',
        overflowY: 'auto',
        background: background ? `url(${background})` : color ? color : '#363636',
        backgroundSize: 'cover',
        borderRadius: isMobileScreen ? 0 : 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start'
    })
}
const Settings: FC = () => {

    const {firestore, user} = useContext(Context)!

    const [backgroundRef, setBackgroundRef] = useState<null | string>(user?.messagesBackground || null);

    const type = useGetTypeOfScreen()
    const isMobileScreen = type === screenTypes.smallType
    const isMobileOrMediumScreen = (type === screenTypes.smallType || type === screenTypes.mediumType)
    const isMobile = type === screenTypes.smallType

    const messagesArray = [
        {
            chatId: "75ef_EJI735YJjdurau$1659897203518",
            createdAt: Date.now() - 100000,
            message: "Начало чата",
            messageId: "a8rognCR4tZOvHzJMrlU7HAkKpJ3ROKyqM9T-xQZArhOCSN1659897204085",
            messageType: 0,
            userId: "a8rognCR4tZOvHzJMrlU7HkKpJ3"
        },
        {
            chatId: "75ef_EJI735YJjdurau$1659897203518",
            createdAt: Date.now()+1,
            message: "Hi",
            messageId: "a8rognCR4tZOvHzJMrlU7HAkKpJ3ROKyqM9T-xQZArhOCSN1659897204085",
            messageType: 1,
            userId: user?.userId
        },
        {
            chatId: "75ef_EJI735YJjdurau$1659897203518",
            createdAt: Date.now()+2,
            message: "This is preview message",
            messageId: "a8rognCR4tZOvHzJMrlU7HAkKpJ3ROKyqM9T-xQZArhOCSN16598972040",
            messageType: 1,
            userId: user?.userId
        },
        {
            chatId: "75ef_EJI735YJjdurau$1659897203518",
            createdAt: Date.now()+3,
            message: "lmao",
            messageId: "a8rognCR4tZOvHzJMrlU7HAkKpJ3ROKyqM9T-xQZArhO897204085",
            messageType: 1,
            userId: 'oojuDXMKd0cm4taDA2mVmZLwrBO2'
        },
        {
            chatId: "75ef_EJI735YJjdurau$1659897203518",
            createdAt: Date.now()+4,
            message: "Слава Україні",
            messageId: "a8rognCR4tZOvHzJMrlU7HAkKpJ3ROKyqM9T-xQZArhO897204085",
            messageType: 1,
            userId: 'oojuDXMKd0cm4taDA2mVmZLwrBO2'
        }
    ]
    const [messages, setMessages] = useState<any>(messagesArray);

    const subscribedUsers: any = {
        [user!.userId]: user,
        oojuDXMKd0cm4taDA2mVmZLwrBO2: {
            bio: "Штом фосий",
            createdAt: "Mon, 25 Jul 2022 11:17:09 GMT",
            email: "7arik.lol@gmail.com",
            messagesBackground: "https://i.pinimg.com/originals/b5/95/b9/b595b90fbfff2189c0e973e5617ffe76.jpg",
            photoURL: 'https://i.pinimg.com/736x/02/b5/2f/02b52f80e63404a03945e0ff7d92940e.jpg',
            nickname: "Yarylo.mp4",
            nicknameColor: "#bf4045",
            phoneNumber: null,
            userId: 'oojuDXMKd0cm4taDA2mVmZLwrBO2'
        }
    }

    const {userStyles, changeColor, changeBorderRadius, changeBackground, changeTheme, changeSecondColor} = useContext(ThemeContext)!

    const submitSettings = async () => {
        localStorage.setItem(user!.userId, JSON.stringify({
            backgroundColor: userStyles.backgroundColor,
            secondBackgroundColor: userStyles.secondBackgroundColor,
            theme: 'dark',
            messagesBorderRadius: userStyles.messagesBorderRadius,
            backgroundImage: previewBackground
        }))

        changeBorderRadius(userStyles.messagesBorderRadius)
        changeColor(userStyles.backgroundColor)
        changeBackground(previewBackground)

        setSnackBarOpen(true)
    }

    useEffect(() => {
        if (userStyles) {
            setPreviewBackground(userStyles.backgroundImage)
        }

    }, [userStyles]);


    const handleColor: ColorChangeHandler = (color, event) => {
        // console.log(color.hex)
        changeColor(color.hex)
    }
    const handleSecondColor: ColorChangeHandler = (color, event) => {
        // console.log(color.hex)
        changeSecondColor(color.hex)
    }
    const [newUserAvatarFile, setNewUserAvatarFile] = useState<null | File>(null);
    const [previewBackground, setPreviewBackground] = useState<any>(userStyles.backgroundImage || null);


    const imageHandler = (file: File) => {
        const reader = new FileReader()
        reader.onload = () => {
            if (reader.readyState === 2) {
                if (reader.result) {
                    changeBackground(reader.result)
                }
            }
        }
        reader.readAsDataURL(file)
    }

    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const handleClick = () => {
        setSnackBarOpen(!snackBarOpen)
    }
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBarOpen(false);
    };


    return (
        <Box sx={{
            pt: 15,
            pb: 3,
            width: isMobileScreen ? '90%' : '60%',
            minHeight: '80%',
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{minHeight: '80%', mt: 5}}>
                <Snackbar
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                    open={snackBarOpen}
                    autoHideDuration={5000}
                    onClose={handleClose}
                    message="Сохранено"
                    sx={{}}
                >
                    <Box sx={{width: '100%', background: userStyles.secondBackgroundColor, display: 'flex',
                        padding: 3, borderRadius: 1, alignItems: 'center'
                    }}>
                        <Typography color='green'>Сохранено</Typography>
                        <Button sx={{ml: 2}} variant='outlined' onClick={handleClick}>Закрыть</Button>
                    </Box>
                </Snackbar>
                <Button sx={{mb: 1}} onClick={() => {
                    if (userStyles.theme === 'dark') {
                        changeTheme('light')
                    } else {
                        changeTheme('dark')
                    }
                }}>{userStyles.theme || 'dark'}</Button>
                <Box sx={{mb: 2}}>
                    <SliderPicker color={userStyles.backgroundColor} onChange={handleColor} onChangeComplete={handleColor}/>
                </Box>
                <ChromePicker disableAlpha={true} color={userStyles.secondBackgroundColor} onChange={handleSecondColor} onChangeComplete={handleSecondColor}/>
                <Box sx={{width: '90%',display: 'flex', flexDirection: 'column', mx: 'auto'}}>
                    <FormLabel sx={{color: newUserAvatarFile ? 'green' : '', mt: 2, mb: 1}} className='custom-file-upload' htmlFor='fileInput'>
                        {newUserAvatarFile ?
                            newUserAvatarFile.name
                            :
                            'Загрузите картинку'
                        }
                    </FormLabel>
                    <input id='fileInput'  type='file' accept=".jpg, .jpeg, .png" onChange={(e) => {
                        if (e.target.files) {
                            setNewUserAvatarFile(e.target.files[0])
                            imageHandler(e.target.files[0])
                        }
                    }}/>
                    <Button variant='outlined' color='error' onClick={() => changeBackground('')}>Удалить картинку</Button>
                    <Typography sx={{mt: 2}}>Border Radius: {userStyles.messagesBorderRadius}</Typography>
                </Box>
                <Input onChange={(e) => {
                    console.log(e.target.value)
                    changeBorderRadius(e.target.value)
                }} fullWidth value={userStyles.messagesBorderRadius} componentsProps={{input: {max: '50'}}} sx={{mb: 2}} type='range'/>
                <List sx={messagesList(isMobileOrMediumScreen, userStyles.backgroundImage, userStyles.backgroundColor)}>

                {messages && messages.map((message: messagesType, i: number) => {
                    const createdAtFormatted = format(message.createdAt, 'HH mm').split(' ').join(':')

                    if (message.messageType === messagesExemplar.startMessage) {
                        return (
                            <ListItem sx={{justifyContent: 'center', alignItems: 'baseline'}} key={message.createdAt}>
                                <Typography variant={'subtitle1'}>{message.message}</Typography>
                                <Typography sx={{fontSize: '12px', ml: 1}}>
                                    {createdAtFormatted}
                                </Typography>
                            </ListItem>
                        )
                    }

                    const changedAtFormatted = message?.changedAt ? format(message.changedAt, 'HH mm').split(' ').join(':') : null

                    const {userId, messageId, messageType} = message
                    const isMessageBeforeIsMine = messages[i - 1].userId === message.userId
                    const isMessageAfterThisMine = messages[i + 1]?.userId === message.userId
                    const subscribedUser = subscribedUsers[userId]
                    // console.log(message)

                    return (<ListItem
                        sx={messageListItem(isMobile)}
                        key={message.createdAt}
                        className={'messageItem'}
                        id={message.messageId}
                    >
                        <Box sx={avatarWrapper}>
                            {!isMessageAfterThisMine ? <Avatar sx={{width: 50, height: 50}} src={subscribedUser?.photoURL} alt="avatar"/> : <Box sx={{width: 50}}/>}
                        </Box>
                        <Box className='message' sx={messageWrapper(isMessageBeforeIsMine, isMessageAfterThisMine, isMobile, userStyles.messagesBorderRadius)}>
                            <Box sx={{alignItems: 'center', display: 'flex'}}>
                                {!isMessageBeforeIsMine && <>
                                    <Typography sx={{color: subscribedUser ? subscribedUser?.nicknameColor : '', cursor: 'pointer', display: 'inline-block', wordBreak: 'break-all'}} variant={'subtitle1'}>
                                      {subscribedUser?.nickname || userId}
                                    </Typography>
                                    {subscribedUser?.isAdmin &&
                                        <Typography variant={'subtitle1'} sx={{display: 'inline-block', ml: 1, fontSize: '12px', cursor: 'default'}}>
                                            Админ
                                        </Typography>
                                    }
                                </>}

                                <IconButton className='miniContextmenu' sx={{color: subscribedUser?.nicknameColor || ''}}>
                                    <ReplyIcon/>
                                </IconButton>
                            </Box>
                            <Typography sx={messageStyles} variant={'body1'}>
                                {message.message}
                            </Typography>
                            {changedAtFormatted ?
                                <Typography sx={dateMessage}>
                                    изменено в {changedAtFormatted}
                                </Typography>
                                :
                                <Typography sx={dateMessage}>
                                    {createdAtFormatted}
                                </Typography>
                            }
                        </Box>

                    </ListItem>)
                })}
                </List>

            </Box>
            <Button sx={{mt: 1}} onClick={submitSettings} >Сохранить</Button>

        </Box>
    )
}

export default Settings