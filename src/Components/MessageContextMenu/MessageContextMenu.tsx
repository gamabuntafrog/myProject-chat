import React, {useState, useEffect, FC, useContext} from "react"
import {Box, Button, ListItem, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {addDoc, arrayRemove, collection, deleteDoc, doc, setDoc, updateDoc} from "firebase/firestore";
import {Context} from "../../index";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {messagesType} from "../../types/messages";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";

type MessageContextMenuPT = {
    modalInfo: {
        message: messagesType,
        pageY: number,
        pageX: number,
        isMe: boolean,
    },
    setIsReplying: React.Dispatch<React.SetStateAction<boolean>>,
    setReplyMessageInfo: any,
    chatId: string,
    setIsContextMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
    myId: string,
    setChangingMessageId: React.Dispatch<React.SetStateAction<string>>
}
const MessageContextMenu: FC<MessageContextMenuPT> = ({modalInfo,setIsReplying, setReplyMessageInfo, chatId, setIsContextMenuOpen, myId,setChangingMessageId}) => {

    const {firestore, user} = useContext(Context)!;

    const type = useGetTypeOfScreen()
    const isMobileScreen = (type === screenTypes.smallType)

    const copyText = (text: string) => {
        const data = [new ClipboardItem({ "text/plain": new Blob([text], { type: "text/plain" }) })];
        navigator.clipboard.write(data)

        setIsContextMenuOpen(false)
    }


    const onDelete = async (messageId: string) => {
        await deleteDoc(doc(firestore, 'chats', `${chatId}`, 'messages', `${messageId}`))
        setIsContextMenuOpen(false)
    }

    const staticTop = (window.innerHeight / 1.4)
    const mobileStaticLeft = (window.innerWidth / 2.4)

    return (
        <Box display='flex' textAlign='center' flexDirection='column' justifyContent='center'
             position='fixed'
             sx={{
                 top: modalInfo.pageY > staticTop ? staticTop : `${modalInfo.pageY + 10}px`,
                 left: isMobileScreen ? mobileStaticLeft : `${modalInfo.pageX + 10}px`,
                 padding: '10px',
                 backgroundColor: '#242424',
                 zIndex: 101,
                 borderRadius: '5px',
                 wordBreak: 'normal'
             }}>
            <Button color={'error'} onClick={() => {
                setIsContextMenuOpen(false)
            }}>
                Закрыть
            </Button>
            <Button onClick={() => {
                setIsReplying(true)
                setReplyMessageInfo(modalInfo.message)
                setIsContextMenuOpen(false)
            }} startIcon={<ReplyIcon/>}  >
                <Typography>Ответить</Typography>
            </Button>
            {modalInfo.isMe &&
                <Button startIcon={<EditIcon/>} sx={{ my: 1}} onClick={() => {
                    setChangingMessageId(modalInfo.message.messageId)
                    setIsContextMenuOpen(false)
                }}>
                    <Typography>Редактировать</Typography>
                </Button>
            }
            <Button startIcon={<ContentCopyIcon/>} onClick={() => copyText(modalInfo.message.message)}>
                Копировать текст
            </Button>
            {modalInfo.isMe &&
		        <Button color={'error'}  onClick={() => onDelete(modalInfo.message.messageId)} startIcon={<DeleteIcon/>} sx={{minWidth: '30px'}}>
                    <Typography>Удалить</Typography>
                </Button>
            }
        </Box>
    )
}

export default MessageContextMenu