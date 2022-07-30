export type startMessageType = {
    createdAt: number,
    startMessage: string,
    docId: string,
}

export type messageType = {
    messageId: string,
    createdAt: number,
    message: string,
    photoURL: string,
    userId: string,
    userName: string,
    isChanging?: boolean
}

export type messagesType = (messageType | startMessageType)[]


export enum messagesExemplar {
    startMessage,
    message,
    dateMessage,
    replyMessage,
    forwardMessages
}
