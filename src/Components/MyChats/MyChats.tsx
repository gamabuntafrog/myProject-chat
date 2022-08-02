import React, {FC, useContext, useState} from "react"
import {Context} from "../../index";
import {Box, Button, List, TextField, Typography} from "@mui/material";
import './MyChats.css';
import MyChatsItem from "../MyChatsItem";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import {chatList, closeButton, myChatBar, myChatBarChats, myChatBarInput, myChatsSection} from "./MyChatsStyles";


const MyChats: FC<{isChatListOpen: boolean, setIsChatListOpen: any}> = ({isChatListOpen, setIsChatListOpen}) => {

    const {user, isUserLoading} = useContext(Context)!
    const [filterValue, setFilterValue] = useState('');
    const type = useGetTypeOfScreen()
    const mediumOfSmallType = (type === screenTypes.mediumType || type === screenTypes.smallType);

    if (isUserLoading && !user) {
        return (
            <Box sx={{...myChatsSection(mediumOfSmallType, isChatListOpen)}}>
                <List sx={chatList}>
                    <Box sx={{textAlign: 'center'}}>
                        Loading.....
                    </Box>
                </List>
            </Box>
        )
    }


    return (
        <Box component='section' sx={{...myChatsSection(mediumOfSmallType, isChatListOpen)}}>
            {isChatListOpen &&
                        <Button onClick={() => setIsChatListOpen(false)} variant='contained' color='error' sx={closeButton}>Закрыть</Button>
            }
            <Box sx={myChatBar}>
                {user!.subscribedChats.length > 0 ?
                    <>
                        <TextField fullWidth placeholder='Поиск' sx={myChatBarInput} variant='standard' onChange={(e) => setFilterValue(e.target.value)}/>
                        <Typography sx={myChatBarChats}>Ваши чаты ({user?.subscribedChats.length}):</Typography>
                    </>
                    :
                    <Typography sx={{textAlign: 'center', mt: 5}}>Ваш список пустой</Typography>
                }
            </Box>
            {user &&
                <List sx={chatList} >
                    {user.subscribedChats.map((chatId: string) => {
                        return (
                            <MyChatsItem setIsChatListOpen={setIsChatListOpen} key={chatId} chatId={chatId} filterValue={filterValue} />
                        )
                    })}
                </List>
            }
        </Box>
    )


}

export default MyChats