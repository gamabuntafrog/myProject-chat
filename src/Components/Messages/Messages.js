import { chatApi } from "../../Redux/chatApi";




const Messages = () => {

    const {data, isLoading} = chatApi.useGetMessagesQuery('', {pollingInterval: 3000})
    const [deleteMessage, {isLoading: isLoadingOnDelete}] = chatApi.useDeleteMessageMutation()
    
    if (isLoading) {
        return <h1>ЗАГРУЗКА............</h1>
    } 
    if (isLoadingOnDelete) {
        return <h1>ЗАГРУЗКА............</h1>
    } 
    const onDelete = (message) => {

        console.log(message.id);
        deleteMessage(message.id)
    }

    return <ul className="messages__list">
        {data && data.map(el => {

            const options = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
            };

            const date = new Date(el.createdAt).toLocaleDateString("ru", options)
            return <li className="message__item" key={el.id}>
                <div>
                    <h1 className="message__name">{ el.name }</h1> <p className="message__date">{`${date}`}</p>
                </div>
                <h2 className="message__message">{el.message}</h2>
                <button type='button' className="message__delete" onClick={() => onDelete(el)}>Удалить</button>  
            </li>
        })}
    </ul>
}

export default Messages;