import {user} from "./user";

export enum messagesExemplar {
    startMessage,
    message,
    dateMessage,
    replyMessage,
    forwardMessages,
    gifMessage
}

export type startMessageType = {
    createdAt: number,
    messageId: string,
    message: string,
    chatId: string,
    messageType: messagesExemplar.startMessage,
    userId: string,

}

export type messageType = {
    messageId: string,
    createdAt: number,
    changedAt?: number
    message: string,
    userId: string,
    messageType: messagesExemplar.message,
    images?: {url: string, imageRef: string}[],
    seen: { userId: string, date: number }[],
    replyer: messageType ,
}


export type gifMessageType = {
    messageId: string,
    createdAt: number,
    changedAt?: number,
    message: 'GIF',
    userId: string,
    gifInfo: any,
    messageType: messagesExemplar.gifMessage,
    replyer: messageType | gifMessageType,
    seen: { userId: string, date: number }[],
}

export type messagesType = (messageType | startMessageType | gifMessageType)

export type messagesWhichOnProgressType = {
    messageId: string,
    createdAt: number,
    changedAt?: number
    message: string,
    userId: string,
    messageType: messagesExemplar.replyMessage | messagesExemplar.message,
    replyer?: messageType ,
    images?: string[]
}
