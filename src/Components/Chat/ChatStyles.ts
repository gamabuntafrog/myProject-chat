import {screenTypes} from "../../hooks/useGetTypeOfScreen";


export const chatContainer = (mediumOrSmallType: boolean, background: string | File | ArrayBuffer, backgroundColor: string, chatNoExisting?: boolean): object => {


    if (mediumOrSmallType) {
        return {
            background: background ? `url(${background})` : backgroundColor,
            zIndex: '100',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            backgroundPositionX: 'center',
            backgroundSize: 'cover',
        }
    } else {
        return {
            background: background ? `url(${background})` : backgroundColor,
            backgroundPositionX: 'center',
            backgroundSize: 'cover',
            maxWidth: chatNoExisting ? '80%' : '60%',
            zIndex: '100',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: chatNoExisting ? '80%' : '75%',
            position: 'relative',
            margin: '0 auto',
        }
    }


}

export const chatSection = (type: screenTypes) => {

    return ({
        overflowY: 'hidden',
        height: '100vh',
        display: 'flex',
        justifyContent: 'space-between',
        // backgroundColor: '#121212',
        pt: type === screenTypes.smallType ? '56px' : '64px'
    })
}

export const logo = {
    fontWeight: 600,
    fontSize: 100,
    textDecoration: 'none',
}