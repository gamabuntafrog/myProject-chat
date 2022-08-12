

export const headerMenuContainer = (color: string) => {

    return ({
        backgroundColor: color,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        wordBreak: 'break-word',

    })
}

export const userInfo = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
}

export const userInfoAvatar = {
    width: 80,
    height: 80,
    mr: 2
}

export const navLink = (theme: 'dark' | 'light' | '') => {
    console.log(theme)
    return ({
        display: 'flex',
        alignItems: 'center',
        color: theme === "dark" ? 'white' : 'black',
    })
}