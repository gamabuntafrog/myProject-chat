export const myChatsSection = (mediumOfSmallType: boolean, isChatListOpen: boolean, color: string | undefined): any => {

    if (mediumOfSmallType) {
        if (isChatListOpen) {
            return {
                position: 'absolute',
                width: '100%',
                zIndex: 1000,
                backgroundColor: '#121212',
                overflowY: 'auto',
                minHeight: '100%'
            }
        } else {
            return {
                display: 'none'
            }
        }
    } else {
        return {
            position: 'relative',
            width: '20%',
            zIndex: 1000,
            backgroundColor: '#121212',
            overflowY: 'auto',
            pt: 3
        }
    }
}

export const chatList = {
    mx: 'auto',
    width: '90%',
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

export const itemWrapper = {
    color: 'white',
    padding: '0 10px',
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none'
}

export const item = {
    justifyContent: 'start',
    px: 0
}

export const listIfNoContent = {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column'
}

export const itemMessagesWrapper = {
    display: 'flex',
    alignItems: 'baseline',
    whiteSpace: 'nowrap'
}