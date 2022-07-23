export type startMessageType = {
    createdAt: number,
    startMessage: string,
    docId: string,
}

export type messageType = {
    docId: string,
    createdAt: number,
    message: string,
    photoURL: string,
    userId: string,
    userName: string
}

export type messagesType = (messageType | startMessageType)[]