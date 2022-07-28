import React from "react";

export type MessagesPropTypes = {
    chatId: string,
    messages: any[] | null,
    firestore: any,
    subscribedUsers: any,
    setIsReplying: React.Dispatch<React.SetStateAction<boolean>>
    setReplyMessageInfo: React.Dispatch<React.SetStateAction<any>>
}