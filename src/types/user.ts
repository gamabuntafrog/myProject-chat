export type user = {
    bio: string,
    nickname: string,
    nicknameColor: string,
    messagesBackground?: string,
    photoURL: string,
    userId: string,
    subscribedChats: string[],
    createdAt: number,
    phoneNumber: string | null,
    email: string,
}