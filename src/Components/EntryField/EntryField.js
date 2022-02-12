import { useContext, useState } from "react";
import { collection } from "firebase/firestore";
import Loader from "../Loader/Loader";
import { addDoc } from "firebase/firestore"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import { Context } from "../..";




const EntryField = () => {
    const {auth, firestore} = useContext(Context)

    const [user, isLoading, error] = useAuthState(auth)

    const { id } = useParams()
    

    const [message, setMessage] = useState('');



    const submitPost = async (e) => {
        e.preventDefault()

        if (message.trim() == '') {
            alert('Введите сообщение ёпт')
            return
        }

        await addDoc(collection(firestore, `${id}`), {
            userId: user.uid,
            userName: user.displayName,
            message,
            createdAt: Date.now(),
            photoURL: user.photoURL
        })

        setMessage('')
    }



    if (isLoading) {
        return <Loader/>
    }

    return <section className="entry-field">
        <p className="entry-field__chatid">{id}</p>
        <form className="entry-field__form">

            <textarea className="entry-field__input" placeholder='Сообщение' value={message} onChange={(e) => setMessage(e.currentTarget.value)} />

            <button className="entry-field__button" type="submit" onClick={submitPost}>Отправить</button>

        </form>
    </section>
}


export default EntryField;