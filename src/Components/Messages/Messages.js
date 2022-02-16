import { useContext, useEffect, } from "react";
import { Context } from "../..";
import { doc,  deleteDoc } from "firebase/firestore"; 
import { useAuthState } from "react-firebase-hooks/auth";
import {Box, Avatar, Typography, Button, List, ListItem} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';

const Messages = ({chatId, messages, firestore}) => {

    const { auth } = useContext(Context)
    const [user, isLoading, error] = useAuthState(auth)

    useEffect(() => {
        const body = document.querySelector('body')

        scrollToBottom(body)
    }, [messages])
    
    const onDelete = async (message) => {
        const segmentsLength = message._document.key.path.segments.length - 1;
        const documentId = message._document.key.path.segments[segmentsLength];

        await deleteDoc(doc(firestore, `${chatId}`, `${documentId}`))
    }

    const scrollToBottom = (body) => {
        window.scrollTo({top: body.offsetHeight, behavior: "smooth"})
    }


    if (messages) {


        return <>
        <List sx={{minHeight: '80vh'}}>
            {messages && messages.map((el, i) => {

                const currentUser = el.data().userId == user.uid;

                switch (currentUser) {
                    case true:
                    return (<ListItem sx={{paddingLeft: 0, paddingRight: 0}} key={el.data().createdAt}>
                        <Box sx={{mr: 3}}>
                            <Avatar sx={{width: 50, height: 50}} src={`${el.data().photoURL}`} alt="avatar" />
                        </Box>
                        <Box sx={{flexGrow: 1}}>
                            <Typography sx={{color: '#2196f3'}} variant={'subtitle1'}>
                                {el.data().userName}
                            </Typography>
                            <Typography variant={'body1'}>
                                {el.data().message}
                            </Typography>
                        </Box>
                        <Button color={'error'} onClick={() => onDelete(el)} sx={{minWidth: 30, padding: 0}} >
                            <DeleteIcon  />
                        </Button>

                    </ListItem>)


                    case false:
                        if (el.data().startMessage) return <ListItem sx={{justifyContent: 'center'}} key={el.data().createdAt}>
                            <Typography variant={'subtitle1'}>{el.data().startMessage}</Typography></ListItem> //это просто сообщение "начало чата"

                        return (<ListItem sx={{paddingLeft: 0, paddingRight: 0}} key={el.data().createdAt}>
                            <Box sx={{mr: 3}}>
                                <Avatar sx={{width: 50, height: 50}} src={`${el.data().photoURL}`} alt="avatar" />
                            </Box>
                            <Box sx={{flexGrow: 1}}>
                                <Typography variant={'subtitle1'}>
                                    {el.data().userName}
                                </Typography>
                                <Typography variant={'body1'}>
                                    {el.data().message}
                                </Typography>
                            </Box>

                        </ListItem>)

                    default:
                        break

                }
            })}

        </List>
    </>
    }
    
  
}

export default Messages;