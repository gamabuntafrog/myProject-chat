import { useState } from "react";
import shortid from 'shortid';
import { chatApi } from "../../Redux/chatApi";


const EntryField = () => {


  const [message, setMessage] = useState('');
  const [name, setName] = useState('Рандомный Челик');

  const [postMessage, {}] = chatApi.usePostMessageMutation()

    const submitPost = async (e) => {
        e.preventDefault()
        if (name.trim() == '') {
            setName('Рандомный чел')
            alert('Введите имя')
            return
        } 
        if (message.trim() == '') {
            alert('Введите сообщение ёпт')
            return
        }
        await postMessage({createdAt: Date.now(), name, id: shortid.generate(), message,})
    }



    return <div className="entry-field">
        <form className="entry-field__form">

            <input className="entry-field__input" placeholder='Имя' onChange={(e) => setName(e.currentTarget.value)}/>

            <input className="entry-field__input" placeholder='Сообщение' onChange={(e) => setMessage(e.currentTarget.value)} />

            <button className="entry-field__button" type="submit" onClick={submitPost}>Отправить</button>

        </form>
    </div>
}


export default EntryField;