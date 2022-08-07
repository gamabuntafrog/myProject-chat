export const messagesList = {
    px: 2,
    maxHeight: '100vh',
    minHeight: '80%',
    overflowY: 'auto'
}

export const avatarWrapper = {
    mr: 3,
    cursor: 'pointer'
}

export const messageWrapper = {
    flexGrow: 1
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
