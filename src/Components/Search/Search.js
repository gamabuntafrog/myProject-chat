import shortid from 'shortid';
import React, { useContext, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { Context } from '../..';



const Search = () => {

    const { firestore } = useContext(Context);

    const [ref, setRef] = useState('');

    const history = useHistory();

    const createChat = async () => {
        const newChatId = shortid.generate()

        const unSub = await addDoc(collection(firestore, `${newChatId}`), {startMessage: 'Начало чата', createdAt: Date.now()})
        
        history.push(`/chat/${newChatId}`)
        return unSub
    }

    const findChat = () => {
        if (ref.trim().length < 9) return alert('неправильный id')
        if (ref.trim().length > 9) return alert('неправильный id')

        history.push(`/chat/${ref}`)
    }

    return (
        <section className='search'>
            <div className='search__container'>
                <form className='search__form'>
                    <label>
                    <input value={ref} onChange={(e) => setRef(e.currentTarget.value)} className='search__form-input' placeholder='поиск'/>                        
                    </label>
                    <button onClick={findChat} className='seatch__form-button' type='button'>Найти</button>
                </form>
                <p>или</p>
                <button onClick={createChat} className='search__create-chat'>Создать чат</button>                   
            </div>
        </section>
    );
}

export default Search;
