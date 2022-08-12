import {screenTypes} from "../../hooks/useGetTypeOfScreen";


export const appBar = (type: screenTypes, color: string | undefined) => {

    return ({
        flexGrow: 1,
        background: color ? color : '#0d47a1',
        boxShadow: 3,
        borderRadius: 0,
        // (type === screenTypes.mediumType || type === screenTypes.smallType) ? '' : '0 0 40px 40px',
        // maxWidth: '1280px',
        mx: 'auto',
        left: '50%',
        transform: 'translateX(-50%)',
        header: {
            px: 0

        }
    })
}

export const logo = {
    fontWeight: 600,
    textDecoration: 'none',
    color: 'white'
}

export const slideMenu = {
    '.MuiPaper-root': {
        background: 'rgba(255, 255, 255, 0)',
        boxShadow: 0,
        marginTop: 5
    },
    '.MuiBox-root': {
        borderRadius: 1
    }
}

export const headerMenuWrapper = (color: string) => {

    return ({
        paddingTop: 5,
        paddingBottom: 3,
        boxShadow: 3,
        backgroundColor: color,
        borderRadius: 1,
        maxWidth: '90%'
    })
}

export const chatInfoStyles = {
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    padding: '0 5px'
}

export const linkToUserInfo = {
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px'
}

export const userAvatar = {
    width: 40,
    height: 40,
    mr: 2
}

export const userNickname = {
    fontWeight: 600,
    mr: 1,
    textAlign: 'center'
}