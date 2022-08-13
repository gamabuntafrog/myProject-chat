export enum messagesExemplar {
    startMessage,
    message,
    dateMessage,
    replyMessage,
    forwardMessages
}

export type startMessageType = {
    createdAt: number,
    messageId: string,
    message: string,
    chatId: string,
    messageType: messagesExemplar.startMessage,
    userId: string
}

export type messageType = {
    messageId: string,
    createdAt: number,
    changedAt?: number
    message: string,
    userId: string,
    messageType: messagesExemplar.message,
    images?: string[]
}

export type replyMessageType = {
    messageId: string,
    createdAt: number,
    changedAt?: number
    message: string,
    userId: string,
    isChanging?: boolean,
    messageType: messagesExemplar.replyMessage,
    replyer: messageType | replyMessageType,
    images?: string[]

}

export type messagesType = (messageType | startMessageType | replyMessageType)


