import shortid from 'shortid';
import React, {FC, useContext, useState} from 'react';
import {addDoc, arrayUnion, collection, doc, orderBy, query, setDoc, updateDoc, where} from 'firebase/firestore';
import {NavLink, useHistory} from 'react-router-dom';
import {Context} from '../..';
import {
    Box,
    Input,
    Button,
    FormControl,
    FormLabel,
    Typography,
    Snackbar,
    Alert,
    AlertTitle,
    List,
    ListItem,
    TextField,

} from '@mui/material';
import {useCollection, useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import Modal from '../Modal';
import {DocumentData} from 'firebase/firestore'

const Search: FC = () => {

    const {firestore, user} = useContext(Context)!;

    const [text, setText] = useState<string>('');
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newChatData, setNewChatData] = useState({
        newChatName: '',
        newChatDescription: '',
        newChatImage: ''
    });
    const history = useHistory();

    const [value, isLoading] = useCollectionData(query(collection(firestore, 'chats')))
    // const [value, isLoading] = useDocumentData(doc(firestore, 'chat', `chatList`))

    console.log(value)
    const createChat = async () => {
        const newChatId = shortid.generate()
        console.log(newChatData)
        const {newChatName, newChatDescription, newChatImage} = newChatData
        if (user) {
            await updateDoc(doc(firestore, 'users', `${user.userId}`), {
                subscribedChats: arrayUnion(newChatId)
            })
            await setDoc(doc(firestore, 'chats', `${newChatId}`), {
                createdAt: Date.now(),
                messages: [{startMessage: 'Начало чата', createdAt: Date.now()}],
                users: user ? [
                    {userId: user.userId}
                ] : [],
                chatName: newChatName,
                chatDescription: newChatDescription,
                chatImage: newChatImage,
                chatId: newChatId
            })
            history.push(`/chat/${newChatId}`)

        }


    }

    const findChat = () => {
        if (text.trim().length < 9) {
            setIsAlertOpen(true)
            return
        }
        if (text.trim().length > 9) return setIsAlertOpen(true)

        history.push(`/chat/${text}`)
    }

    return (
        <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' sx={{}}>
            <Box width='50%' display='flex' textAlign='center' flexDirection='column' justifyContent='center'
                sx={{mt: 30}}>
                <Typography sx={{mb: 5, color: '#1976d2'}} variant={'subtitle1'}>Например: o76iyZ1tU</Typography>
                <FormControl>
                    <FormLabel>
                        <Input sx={{width: '100%'}} value={text} onKeyPress={(e) => {
                            if (e.key === "Enter") return findChat() //submit
                        }} onChange={(e) => setText(e.currentTarget.value)} placeholder='поиск'/>
                    </FormLabel>
                    <Button size='large' onClick={findChat}>Найти</Button>
                </FormControl>
                <Typography variant='h6'>
                    или
                </Typography>
                <Button size='large' onClick={() => setIsModalOpen(true)
                }>Создать чат</Button>
                {value && <>
                    <Typography variant={'h6'}>Список чатов:</Typography>
                        <List >
                            {value.map((data: DocumentData, i: number) => {
                                const {chatId, chatName, chatDescription} = data;

                                return (
                                    <ListItem sx={{justifyContent: 'center'}} key={i}>
                                        <NavLink style={{color: 'white'}} to={`/chat/${chatId}`}>
                                            <Typography sx={{color: 'white'}} variant={'subtitle1'}>
                                                {chatName}
                                            </Typography>
                                        </NavLink>
                                        {chatDescription &&
		                                    <Typography sx={{color: 'white', ml: 1}} variant={'subtitle1'}>
                                                {chatDescription}
		                                    </Typography>
                                        }
                                    </ListItem>
                                )
                            })}
                        </List>
                </>}

            </Box>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={isAlertOpen}
                autoHideDuration={6000}
                onClose={() => setIsAlertOpen(false)}
            >
                <Alert sx={{}} variant={'filled'} severity="error">
                    <AlertTitle sx={{mt: -0.5, flexGrow: 1}}>ID всегда длиною в 9 символов</AlertTitle>
                    {/* @ts-ignore */}
                    <Button sx={{ml: 9}} variant={'error'} size="small" onClick={() => setIsAlertOpen(false)}>
                        Закрыть
                    </Button>
                </Alert>
            </Snackbar>
            <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
	            <TextField onChange={(e) => setNewChatData(prev => {
	                return {...prev, newChatName: e.target.value}
                })} sx={{width: '70%', input: {textAlign: 'center'}, mt: 5}} placeholder={'Название беседы'}/>
                <TextField onChange={(e) => setNewChatData(prev => {
                    return {...prev, newChatDescription: e.target.value}
                })} sx={{width: '70%', input: {textAlign: 'center'}, mt: 2}} placeholder={'Описание (необязательно)'}/>
                <TextField onChange={(e) => setNewChatData(prev => {
                    return {...prev, newChatImage: e.target.value}
                })} sx={{width: '70%', input: {textAlign: 'center'}, mt: 2}} placeholder={'Картинка беседы (необязательно)'}/>
                <Button onClick={createChat} sx={{mt: 5}}>Создать чат</Button>
            </Modal>

        </Box>);
}

export default Search;
