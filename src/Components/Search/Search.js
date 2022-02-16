import shortid from 'shortid';
import React, { useContext, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { Context } from '../..';
import { Box, TextField,Input, Button, FormControl, FormLabel, Typography, Snackbar, Alert, AlertTitle } from '@mui/material';




const Search = () => {

    const { firestore } = useContext(Context);

    const [ref, setRef] = useState('');
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const history = useHistory();

    const createChat = async () => {
        const newChatId = shortid.generate()

        await addDoc(collection(firestore, `${newChatId}`), {startMessage: 'Начало чата', createdAt: Date.now()})
        
        history.push(`/chat/${newChatId}`)
    }

    const findChat = () => {
        if (ref.trim().length < 9) {
            setIsAlertOpen(true)
            return
        }
        if (ref.trim().length > 9) return alert('неправильный id')

        history.push(`/chat/${ref}`)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') { //если кликнул по других элементах
            return;
        }

        setIsAlertOpen(false)
    };


    return (
    <Box>
        <Box width='50%' display='flex' textAlign='center' flexDirection='column' justifyContent='center' position='absolute' sx={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            <Typography sx={{mb: 5,color: '#1976d2'}} variant={'subtitle1'}>Например: s7muKX23M</Typography>
            <FormControl >
                <FormLabel >
                    <Input sx={{width: '100%'}} value={ref} onKeyPress={(e) => {
                        if (e.key === "Enter") return findChat() //submit
                    }} onChange={(e) => setRef(e.currentTarget.value)} placeholder='поиск' />
                </FormLabel>
                <Button size='large' onClick={findChat} >Найти</Button>
            </FormControl>
            <Typography variant='h6'>
                или
            </Typography>
            <Button size='large' onClick={createChat}>Создать чат</Button>
        </Box>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={isAlertOpen}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert sx={{}} variant={'filled'}  severity="error">
                    <AlertTitle sx={{mt: -0.5, flexGrow: 1}}>ID всегда длиною в 9 символов</AlertTitle>
                    <Button sx={{ml: 9}} variant={'error'} size="small" onClick={handleClose}>
                        Закрыть
                    </Button>
                </Alert>
            </Snackbar>
    </Box>);
}

export default Search;
