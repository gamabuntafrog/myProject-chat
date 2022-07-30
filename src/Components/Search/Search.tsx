import shortid from 'shortid';
import React, {FC, useContext, useState} from 'react';
import {arrayUnion,  doc, setDoc, updateDoc} from 'firebase/firestore';
import {useHistory} from 'react-router-dom';
import {Context} from '../..';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Typography,
    Snackbar,
    Alert,
    AlertTitle,
    TextField,
} from '@mui/material';
import Modal from '../Modal';
import {messagesExemplar} from '../../types/messages';
import {createChatInput, searchContainer, searchExample, searchSection} from "./SearchStyles";
import RecomendedChatList from "../RecomendedChatList";
import {justifyColumnCenter} from "../GeneralStyles";


const Search: FC = () => {

    const {firestore, user} = useContext(Context)!;

    const [text, setText] = useState<string>('');
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [newChatData, setNewChatData] = useState({
        newChatName: '',
        newChatDescription: '',
        newChatImage: ''
    });
    const history = useHistory();


    // console.log(value)
    const createChat = async () => {
        try {
            if (user) {
                const newChatId = `${shortid.generate()}${shortid.generate()}$${Date.now()}`

                const {newChatName, newChatDescription, newChatImage} = newChatData

                await updateDoc(doc(firestore, 'users', `${user.userId}`), {
                    subscribedChats: arrayUnion(newChatId)
                })
                await setDoc(doc(firestore, 'chats', `${newChatId}`), {
                    createdAt: Date.now(),
                    users: [
                        {
                            userId: user.userId,
                            isAdmin: true
                        }
                    ],
                    chatName: newChatName,
                    chatDescription: newChatDescription,
                    chatImage: newChatImage,
                    chatId: newChatId,
                })

                const newMessageId = `${user.userId}${shortid.generate()}${shortid.generate()}${Date.now()}`

                await setDoc(doc(firestore, 'chats', `${newChatId}`, 'messages', `${newMessageId}`), {
                    messageType: messagesExemplar.startMessage,
                    userId: user?.userId,
                    message: 'Начало чата',
                    createdAt: Date.now(),
                    messageId: newMessageId,
                    chatId: newChatId
                })
                await setDoc(doc(firestore, 'chats', `${newChatId}`, 'users', `${user.userId}`), {
                    userId: user?.userId,
                    isAdmin: true
                })

                history.push(`/chat/${newChatId}`)

            }

        } catch (e) {
            console.log(e)
            console.log('ошибка')
        }

    }

    const findChat = () => {
        if (text.trim() !== '') {
            history.push(`/chat/${text}`)
        }
    }

    return (
        <Box component={'section'} sx={searchSection}>
            <Box width='50%' sx={searchContainer}>
                <Typography sx={searchExample} variant={'subtitle1'}>Например: o76iyZ1tU</Typography>
                <FormControl fullWidth>
                    <FormLabel>
                        <TextField variant={'standard'} fullWidth value={text} onKeyPress={(e) => {
                            if (e.key === "Enter") return findChat() //submit
                        }} onChange={(e) => setText(e.currentTarget.value)} placeholder='поиск'/>
                    </FormLabel>
                    <Button size='large' onClick={findChat}>Найти</Button>
                </FormControl>
                <Typography variant='h6'>
                    или
                </Typography>
                <Button size='large' sx={{mb: 1}} onClick={() => setIsModalOpen(true)
                }>Создать чат</Button>
                <RecomendedChatList firestore={firestore} />
            </Box>
            <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <FormControl fullWidth sx={{...justifyColumnCenter, alignItems: 'center'}}>
                    <TextField onChange={(e) => setNewChatData(prev => {
                        return {...prev, newChatName: e.target.value}
                    })} sx={createChatInput(5)} placeholder={'Название беседы'}/>
                    <TextField onChange={(e) => setNewChatData(prev => {
                        return {...prev, newChatDescription: e.target.value}
                    })} sx={createChatInput(2)} placeholder={'Описание (необязательно)'}/>
                    <TextField onChange={(e) => setNewChatData(prev => {
                        return {...prev, newChatImage: e.target.value}
                    })} sx={createChatInput(2)} placeholder={'Картинка беседы (необязательно)'}/>
                    <Button onClick={createChat} sx={{mt: 5}}>Создать чат</Button>
                </FormControl>
            </Modal>
        </Box>
    );
}

export default Search;
