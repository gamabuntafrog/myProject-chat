

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../..';
import EntryField from '../EntryField';
import Loader from '../Loader';
import Messages from '../Messages';

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
    
    if (messages.length === 0) return <h1>Чата по id: {id} не существует</h1>

    return (
        <section className='chat'>
            <Messages messages={messages} firestore={firestore}/>
            {messages.length !== 0 && <EntryField />}


        </section>
    );
}

export default Chat;
