import {messagesType} from "./messages";

export type chatType = {
    chatId: string,
    chatDescription: string,
    chatImage: string,
    chatName: string,
    createdAt: number,
    lastMessage: messagesType,
    users: string[],
}