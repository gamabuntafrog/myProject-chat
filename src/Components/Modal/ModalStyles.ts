import {screenTypes} from "../../hooks/useGetTypeOfScreen";


export const modalBackdrop = {
    width: '100%',
    height: '100%',
    backgroundColor: 'RGBA(0,0,0, 0.3)',
    alignItems: 'center',
    wordBreak: 'break-word',
}

type modalContainerPT = {
    isMobile: boolean,
    isPadding?: boolean,
    br?: string,
    height?: string,
    jc?: 'center' | 'start',
    backgroundColor?: string,
    width?: string
}

export const modalContainer = ({isMobile, isPadding, br, height, jc, backgroundColor, width}: modalContainerPT): object => {


    if (isMobile) {
        return ({
            backgroundColor: backgroundColor || '#121212',
            display: 'flex',
            alignItems: 'center',
            justifyContent: jc || "center",
            flexDirection: 'column',
            padding: isPadding ? '15px' : 0,
            overflowY: 'auto',
            width: '100%',
            height: height || '100%',
            position: 'relative'
        })
    }

    return ({
        backgroundColor: backgroundColor || '#121212',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        padding: isPadding ? '30px' : 0,
        borderRadius: br || '20px',
        overflowY: 'auto',
        width: width || '50%',
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