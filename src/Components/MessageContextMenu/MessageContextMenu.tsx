import React, {useState, useEffect, FC, useContext} from "react"
import {Box, Button, ListItem, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {arrayRemove, doc, updateDoc} from "firebase/firestore";
import {Context} from "../../index";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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
        isMe: boolean,
    },
    setIsReplying: React.Dispatch<React.SetStateAction<boolean>>,
    setReplyMessageInfo: any,
    chatId: string,
    setIsContextMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
    myId: string
}
const MessageContextMenu: FC<MessageContextMenuPT> = ({modalInfo,setIsReplying, setReplyMessageInfo, chatId, setIsContextMenuOpen, myId}) => {


    const copyText = (text: string) => {
        const data = [new ClipboardItem({ "text/plain": new Blob([text], { type: "text/plain" }) })];
        navigator.clipboard.write(data)

        setIsContextMenuOpen(false)
    }

    const {firestore} = useContext(Context)!;

    console.log(modalInfo)

    const onDelete = async (message: any) => {
        delete message.isChanging
        console.log(message)
        const {createdAt} = message
        await updateDoc(doc(firestore, 'chats', `${chatId}`), {
            messages: arrayRemove(message)
        })
        setIsContextMenuOpen(false)
    }

    return (
        <Box display='flex' textAlign='center' flexDirection='column' justifyContent='center'
             position='absolute' sx={{top: `${modalInfo.pageY + 30}px`, left: `${modalInfo.pageX + - 180}px`, padding: '10px', backgroundColor: '#0d47a1', zIndex: 101, borderRadius: '5px', wordBreak: 'normal'}}>
            <Button onClick={() => {
                setIsReplying(true)
                setReplyMessageInfo(modalInfo.data)
                setIsContextMenuOpen(false)
            }} startIcon={<ReplyIcon/>} sx={{color:'white'}} >
                <Typography>Ответить</Typography>
            </Button>
            {modalInfo.isMe &&
                <Button startIcon={<EditIcon/>} sx={{color:'white', my: 1}} onClick={() => {
                    modalInfo.data.isChanging = true
                    setIsContextMenuOpen(false)
                }}>
                    <Typography>Редактировать</Typography>
                </Button>
            }
            {modalInfo.isMe &&
		        <Button color={'error'}  onClick={() => onDelete(modalInfo.data)} startIcon={<DeleteIcon/>} sx={{minWidth: '30px'}}>
                    <Typography>Удалить</Typography>
                </Button>
            }
            <Button startIcon={<ContentCopyIcon/>} sx={{color: 'white'}} onClick={() => copyText(modalInfo.data.message)}>
                Копировать текст
            </Button>
        </Box>
    )
}

export default MessageContextMenu