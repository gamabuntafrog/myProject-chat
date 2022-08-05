import {screenTypes} from "../../hooks/useGetTypeOfScreen";


export const chatContainer = (mediumOrSmallType: boolean): object => {


    if (mediumOrSmallType) {
        return {
            backgroundColor: '#121212',
            zIndex: '100',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
        }
    } else {
        return {
            backgroundColor: '#121212',
            maxWidth: '75%',
            zIndex: '100',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '75%',
            position: 'relative'

        }
    }


}

export const chatSection = (type: screenTypes) => {

    return ({
        overflowY: 'hidden',
        height: '100vh',
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#121212',
        pt: type === screenTypes.smallType ? '56px' : '64px'
    })
}

