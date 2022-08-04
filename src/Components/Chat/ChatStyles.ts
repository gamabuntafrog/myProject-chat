import {screenTypes} from "../../hooks/useGetTypeOfScreen";


export const chatContainer = (mediumOrSmallType: boolean): object => {


    if (mediumOrSmallType) {
        return {
            backgroundColor: '#121212',
            boxShadow: 6,
            zIndex: '100',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        }
    } else {
        return {
            backgroundColor: '#121212',
            my: 1,
            ml: 1,
            pb: 0,
            boxShadow: 6,
            maxWidth: '75%',
            zIndex: '100',
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '75%',
        }
    }


}

export const chatSection = (type: screenTypes) => {

    return ({
        overflowY: 'hidden',
        height: '100vh',
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#0d47a1',
        pt: type === screenTypes.smallType ? '56px' : '64px'
    })
}

