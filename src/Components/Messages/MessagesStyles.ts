export const messagesList = (isMobileScreen: boolean, background: ArrayBuffer | File | string | null | undefined, color: string | undefined) => {

    return ({
        px: 2,
        pb: 3,
        maxHeight: '100vh',
        minHeight: '70vh',
        overflowY: 'auto',
        background: background ? `url(${background})` : color ? color : '#363636',
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start'
    })
}

export const avatarWrapper = {
    mr: 1,
    cursor: 'pointer'
}

export const messageWrapper = (isMessageBeforeIsMine: boolean, isMessageAfterThisMine: boolean, isMobileType: boolean, borderRadius?: string | number) => {

    return ({
        flexGrow: 1,
        backgroundColor: '#121212',
        pl: 2,
        pr: isMobileType ? 2 : 4,
        pt: 2,
        pb: 3,
        borderRadius: isMessageAfterThisMine ? borderRadius ? `${borderRadius}px` : 1 : `${borderRadius}px ${borderRadius}px ${borderRadius}px 0`
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
    wordBreak: 'keep-all'
}

export const messageListItem = (isMobileType: boolean) => {

    return ({
        padding: 0,
        width: 'auto',
        pr: isMobileType ? 1 : 5,
        mt: 1,
        borderRadius: 3,
        display: 'inline-flex',
        alignItems: 'end',
    })
}

export const messageStyles = {
    wordBreak: 'keep-all'
}

export const messageLeftLine = {
    width: '2px',
    backgroundColor: 'white',
    mr: 1
}

export const dateMessage = {
    fontSize: '12px',
    position: 'absolute',
    bottom: '5px',
    right: '10px'
}