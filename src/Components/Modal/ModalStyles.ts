import {screenTypes} from "../../hooks/useGetTypeOfScreen";


export const modalBackdrop = {
    width: '100%',
    height: '100%',
    backgroundColor: 'RGBA(0,0,0, 0.3)',
    alignItems: 'center',
    wordBreak: 'break-word',
}

export const modalContainer = ({isMobile, isPadding, br, height}: { isMobile: boolean, isPadding?: boolean, br?: string, height?: string}): object => {


    if (isMobile) {
        return ({
            backgroundColor: '#121212',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: isPadding ? '15px' : 0,
            overflowY: 'auto',
            width: '100%',
            height: height || '100%',
            position: 'relative'
        })
    }

    return ({
        backgroundColor: '#121212',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        padding: isPadding ? '30px' : 0,
        borderRadius: br || '20px',
        overflowY: 'auto',
        width: '50%',
        height: height || '95%',
        position: 'relative'

    })
}

export const modalCloseButton = (buttonPosition: string | undefined) => {


    return ({
        marginLeft: 'auto',
        mr: 1,
        minWidth: '36px',
        borderRadius: '50%',
        padding: 1,
        position: buttonPosition || '',
        zIndex: 400,
        right: buttonPosition === 'absolute' ? '20px' : 0,
        top: buttonPosition === 'absolute' ? '20px' : 0
    })
}