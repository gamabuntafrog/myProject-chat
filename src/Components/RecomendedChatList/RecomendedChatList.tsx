import React, {useState, useEffect, FC} from "react"
import {Avatar, Box, List, ListItem, Typography} from "@mui/material";
import {collection, DocumentData, query} from "firebase/firestore";
import {justifyColumnCenter} from "../GeneralStyles";
import {NavLink} from "react-router-dom";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {chatDescriptionStyle, chatLink} from "./RecomendedChatListStyles";
import {chatType} from "../../types/chatType";
import {FirestoreError} from 'firebase/firestore'

const RecomendedChatList: FC<{firestore: any}> = ({firestore}) => {

    const [chatsList, isLoading]: [(chatType[] | undefined), boolean, (FirestoreError | undefined), any] = useCollectionData<any>(query(collection(firestore, 'chats')))

    if (isLoading) {
        return (
            <Typography>
                Загрузка списка чатов......
            </Typography>
        )
    }

    if (chatsList && chatsList.length > 0) {
        return (
            <>
                <Typography variant={'h6'}>Список чатов ({chatsList.length}):</Typography>
                <List>
                    {chatsList.map((chatData, i: number) => {
                        const {chatId, chatName, chatDescription, chatImage} = chatData;

                        return (
                            <ListItem sx={justifyColumnCenter} key={i}>
                                <NavLink style={chatLink} to={`/chat/${chatId}`}>
                                    <Avatar src={chatImage} sx={{mr: 1}}/>
                                    <Box>
                                        <Typography sx={{color: 'white'}} variant={'subtitle1'}>
                                            {chatName}
                                        </Typography>
                                        {chatDescription &&
                                            <Typography sx={chatDescriptionStyle} variant={'subtitle1'}>
                                                {chatDescription}
                                            </Typography>
                                        }
                                    </Box>
                                </NavLink>
                            </ListItem>
                        )
                    })}
                </List>
            </>
        )
    } else {
        return (
            <Typography>
                Список чатов пуст
            </Typography>
        )
    }
}

export default RecomendedChatList