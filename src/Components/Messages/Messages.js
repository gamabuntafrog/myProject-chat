import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../..";
import { doc,  deleteDoc } from "firebase/firestore"; 
import { useAuthState } from "react-firebase-hooks/auth";




const Messages = ({messages, firestore}) => {

    const { auth } = useContext(Context)
    
    const [user, isLoading, error] = useAuthState(auth)


    const chatRef = useRef(null)

    useEffect(() => {
        scrollToBottomInChat()
    }, [messages])
    
    const onDelete = async (message) => {
        const documentId = message._document.key.path.segments.pop();

        await deleteDoc(doc(firestore, 'messages', `${documentId}`))
            
    }

    const scrollToBottomInChat = () => {
        chatRef?.current?.scrollTo({top: chatRef?.current.scrollHeight, behavior: "smooth"})
        console.log(chatRef?.current?.scrollHeight);
    }

    if (messages.length === 0) {
        return <h1>Чат не существует</h1>
    }

    if (messages) {
        return <>
        <ul className="messages__list" ref={chatRef}>
            {messages && messages.map((el, i) => {
                
                const currentUser = el.data().userId == user.uid;

                switch (currentUser) {
                    case true: 
                        return <li className={'message__item-left'} key={el.data().createdAt}>
                            <div className="message__item-text-wrapper">
                                <img src={`${el.data().photoURL}`} alt="avatar" className="message__avatar"/>
                                <h3>{el.data().userName}</h3>
                            </div>
                            <p>{el.data().message}</p>
                            <button onClick={() => onDelete(el)}>Удалить</button>
                        </li>
                    
                    case false: 
                        if (el.data().startMessage) return <li key={el.data().createdAt}><p>{el.data().startMessage}</p></li> //это просто сообщение "начало чата"

                        return <li className={'message__item-right'} key={el.data().createdAt}>
                            <div className="message__item-text-wrapper">
                                <h3>{el.data().userName}</h3>
                                <img src={`${el.data().photoURL}`} alt="avatar" className="message__avatar"/>                            
                            </div>                            
                            <p>{el.data().message}</p>
                        </li>                        
                    
                    default:
                        break    

                }
            })}

        </ul>
    </>
    }
    
  
}

export default Messages;