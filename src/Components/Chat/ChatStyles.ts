


export const chatContainer = (mediumOrSmallType: boolean): object => {


    if (mediumOrSmallType) {
        return {
            maxHeight: '100vh',
            overflowY: 'auto',
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
            maxHeight: '100vh',
            overflowY: 'auto',
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