export const messagesList = (isMobileScreen: boolean, background: string | undefined) => {

    return ({
        px: 2,
        pb: 3,
        maxHeight: '100vh',
        minHeight: '80%',
        overflowY: 'auto',
        background: background ? `url(${background})` : '#121212',
        backgroundSize: 'cover',
        borderRadius: isMobileScreen ? 0 : 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start'
    })
}

export const avatarWrapper = {
    mr: 3,
    cursor: 'pointer'
}

export const messageWrapper = (isMessageBeforeIsMine: boolean) => {

    return ({
        flexGrow: 1,
        backgroundColor: '#121212',
        pl: 2, pr: 4, py: 2,
        borderRadius: isMessageBeforeIsMine ? 2 : '16px 16px 16px 0'
    })
}

export const userWrapper = {
    alignItems: 'center',
    display: 'flex'
}

export const activeUsername = (color: string | undefined) => {

    return ({
        color: color ? color : '',
        cursor: 'pointer',
        display: 'inline-block',
        wordBreak: 'break-all',
    })
}

export const userRole = {
    display: 'inline-block',
    ml: 1,
    fontSize: '12px',
    cursor: 'default'
}

export const messageContainer = {
    display: 'flex',
    wordBreak: 'break-all'
}
