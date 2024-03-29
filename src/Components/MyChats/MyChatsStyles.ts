export const myChatsSection = (mediumOfSmallType: boolean, isChatListOpen: boolean, color: string | undefined): any => {

    if (mediumOfSmallType) {
            return {
                position: 'absolute',
                width: '100%',
                zIndex: 1000,
                backgroundColor: color || '#121212',
                overflowY: 'hidden',
                minHeight: '100%',
                // minHeight: '0%',
                pt: 3,
                // transition: 'min-height: 100%; 2s'
            }


    } else {
        return {
            position: 'relative',
            minWidth: '20%',
            zIndex: 1000,
            backgroundColor: color || '#121212',
            overflowY: 'auto',
            pt: 3,
            borderRight: '1px solid #363636',

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

export const itemWrapper = (theme: 'dark' | 'light' | '') => {


    return ({
        color: theme === "dark" ? 'white' : 'black',
        padding: '0 10px',
        marginBottom: '5px',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none'
    })
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