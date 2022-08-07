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
import {createChatInput, createChatLabel, searchContainer, searchExample, searchSection} from "./SearchStyles";
import RecomendedChatList from "../RecomendedChatList";
import {justifyColumnCenter} from "../GeneralStyles";
import {useGetTypeOfScreen, screenTypes} from "../../hooks/useGetTypeOfScreen";


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
    const type = useGetTypeOfScreen()

    // console.log(value)
    const createChat = async () => {
        const {newChatName, newChatDescription, newChatImage} = newChatData

        if (newChatName.length < 3) {
            console.log('слишком короткое название')
            return
        }
        try {
            if (user) {
                const newChatId = `${shortid.generate()}${shortid.generate()}$${Date.now()}`
                const newMessageId = `${user.userId}${shortid.generate()}${shortid.generate()}${Date.now()}`

                await updateDoc(doc(firestore, 'users', `${user.userId}`), {
                    subscribedChats: arrayUnion(newChatId)
                })

                await setDoc(doc(firestore, 'chats', `${newChatId}`), {
                    createdAt: Date.now(),
                    users: [
                        user.userId,
                    ],
                    chatName: newChatName,
                    chatDescription: newChatDescription,
                    chatImage: newChatImage,
                    chatId: newChatId,
                    lastMessage: {
                        messageType: messagesExemplar.startMessage,
                        userId: user?.userId,
                        message: 'Начало чата',
                        createdAt: Date.now(),
                        messageId: newMessageId,
                        chatId: newChatId
                    }
                })


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
            <Box sx={searchContainer(type)}>
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
            <Modal height={'auto'} isPadding={true} isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <FormControl fullWidth sx={{...justifyColumnCenter, alignItems: 'center'}}>
                    <FormLabel htmlFor={'input1'} sx={createChatLabel}>Название беседы</FormLabel>
                    <TextField id={'input1'} onChange={(e) => setNewChatData(prev => {
                        return {...prev, newChatName: e.target.value}
                    })} sx={createChatInput} placeholder={'Например: Очень крутой чат'}/>

                    <FormLabel htmlFor={'input2'} sx={createChatLabel}>Описание (необязательно)</FormLabel>
                    <TextField id={'input2'} multiline onChange={(e) => setNewChatData(prev => {
                        return {...prev, newChatDescription: e.target.value}
                    })} sx={createChatInput} placeholder={'(необязательно)'}/>

                    <FormLabel htmlFor={'input3'} sx={createChatLabel}>Картинка беседы</FormLabel>
                    <TextField id={'input3'} onChange={(e) => setNewChatData(prev => {
                        return {...prev, newChatImage: e.target.value}
                    })} sx={createChatInput} placeholder={'(необязательно)'}/>

                    <Typography sx={{mt: 2}} variant={'subtitle1'}>В дальнейшем вы сможете всё отредактировать</Typography>
                    <Button variant={'contained'} fullWidth size={'large'} onClick={createChat} sx={{mt: 3, borderRadius: '20px'}}>Создать чат</Button>
                </FormControl>
            </Modal>
        </Box>
    );
}

export default Search;
