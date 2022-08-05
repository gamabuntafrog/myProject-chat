export const myChatsSection = (mediumOfSmallType: boolean, isChatListOpen: boolean, color: string | undefined): any => {

    if (mediumOfSmallType) {
        if (isChatListOpen) {
            return {
                position: 'absolute',
                width: '100%',
                zIndex: 1000,
                backgroundColor: '#121212',
                overflowY: 'auto'
            }
        } else {
            return {
                display: 'none'
            }
        }
    } else {
        return {
            position: 'relative',
            width: '25%',
            zIndex: 1000,
            backgroundColor: '#121212',
            overflowY: 'auto',
            pt: 3
        }
    }
}

export const chatList = {
    mx: 'auto',
    width: '90%'
}

export const myChatBar = {
    mx: 'auto',
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
}

export const myChatBarInput = {
    input: {textAlign: 'center'},
    my: 1
}

export const myChatBarChats = {
    textAlign: 'center',
    my: 1
}

export const closeButton = {
    mt: 3,
    ml: 1
}