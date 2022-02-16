import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import {NavLink, useParams} from 'react-router-dom';
import { Context } from '../..';
import EntryField from '../EntryField';
import Loader from '../Loader';
import Messages from '../Messages';
import {Container} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";



const Chat = () => {

    const { id } = useParams()    
    
    const { firestore } = useContext(Context)
    
    const [messages, setMessages] = useState(null);


    useEffect(() => {

        return onSnapshot(query(collection(firestore, `${id}`), orderBy('createdAt', 'asc')), snapshot => {
            setMessages(snapshot.docs)
        })
    }, [id]);

    if (!messages) return <Loader />
    //пока setMessages в снапшоте и не вернет пустой или массив с сообщениями будет Loader
    
    if (messages.length === 0) return <Container sx={{textAlign: 'center'}}>
        <Typography
                    variant={'h3'}>Чата по id: {id} не существует
        </Typography>
        <Button size='large' sx={{mt: '35%'}} variant={'outlined'}>

        <NavLink className={'nav-link'} to={'/search'} style={{textDecoration: 'none', color: 'inherit',}}>
                Поиск
        </NavLink>
        </Button>

    </Container>

    return (
        <Box sx={{backgroundColor: '#0d47a1', py: 3, }}>
            <Container  sx={{backgroundColor: '#121212', borderRadius: 1, py: 2, boxShadow: 6}}>
                <Messages chatId={id} messages={messages} firestore={firestore}/>
                {messages.length !== 0 && <EntryField />}
            </Container>
        </Box>


    );
}

export default Chat;
