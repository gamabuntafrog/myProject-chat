import {screenTypes} from "../../hooks/useGetTypeOfScreen";


export const chatContainer = (mediumOrSmallType: boolean): object => {


    if (mediumOrSmallType) {
        return {
            // backgroundColor: '#121212',
            zIndex: '100',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
        }
    } else {
        return {
            // backgroundColor: '#121212',
            maxWidth: '60%',
            zIndex: '100',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '75%',
            position: 'relative',
            margin: '0 auto'
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
    color: 'white'
}