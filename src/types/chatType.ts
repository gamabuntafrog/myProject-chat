export type userInChat = {
    isAdmin: boolean,
    userId: string
}

export type chatType = {
    chatDescription: string,
    chatId: string,
    chatImage: string,
    chatName: string,
    createdAt: string,
    users: userInChat[]
}