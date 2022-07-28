import React, {useState, useEffect, FC, useContext} from "react"
import {Box, Button, ListItem, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {arrayRemove, doc, updateDoc} from "firebase/firestore";
import {Context} from "../../index";
import ReplyIcon from "@mui/icons-material/Reply";

type MessageContextMenuPT = {
    modalInfo: {
        data: any
        //     {
        //     bio: string,
        //     createdAt: string,
        //     email: string,
        //     nickname: string,
        //     phoneNumber: string | null,
        //     photoURL: string,
        //     userId: string,
        // }
        pageY: number,
        pageX: number,
        isSubscribed: boolean,
    },
    setIsReplying: React.Dispatch<React.SetStateAction<boolean>>,
    setReplyMessageInfo: any,
    chatId: string,
    setIsContextMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
}
const MessageContextMenu: FC<MessageContextMenuPT> = ({modalInfo,setIsReplying, setReplyMessageInfo, chatId, setIsContextMenuOpen}) => {


    const {firestore} = useContext(Context)!;

    console.log(modalInfo)

    const onDelete = async (message: any) => {
        console.log(message)
        // await deleteDoc(doc(firestore, 'chat', 'public', `${chatId}`, `${message.docId}`))
        const {createdAt} = message
        await updateDoc(doc(firestore, 'chats', `${chatId}`), {
            messages: arrayRemove(message)
        })
        setIsContextMenuOpen(false)
    }

    return (
        <Box display='flex' textAlign='center' flexDirection='column' justifyContent='center'
             position='absolute' sx={{top: `${modalInfo.pageY + 30}px`, left: `${modalInfo.pageX + - 150}px`, padding: '10px', backgroundColor: '#0d47a1', zIndex: 101, borderRadius: '5px', wordBreak: 'normal'}}>
            <Button onClick={() => {
                setIsReplying(true)
                setReplyMessageInfo(modalInfo.data)
                setIsContextMenuOpen(false)
            }} startIcon={<ReplyIcon/>} sx={{color:'white'}} >
                <Typography>Ответить</Typography>
            </Button>


            {modalInfo.isSubscribed &&
		        <Button color={'error'}  onClick={() => onDelete(modalInfo.data)} startIcon={<DeleteIcon/>} sx={{minWidth: 30, padding: 1, mt: 1}}>
                    <Typography>Удалить</Typography>
                </Button>
            }
        </Box>
    )
}

export default MessageContextMenu