import {screenTypes} from "../../hooks/useGetTypeOfScreen";


export const appBar = (type: screenTypes) => {

    return ({
        flexGrow: 1,
        background: '#0d47a1',
        boxShadow: 3,
        borderRadius: (type === screenTypes.mediumType || type === screenTypes.smallType) ? '' : '0 0 40px 40px',
        maxWidth: '1280px',
        mx: 'auto',
        left: '50%',
        transform: 'translateX(-50%)'
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

export const headerMenuWrapper = {
    paddingTop: 5,
    paddingBottom: 3,
    boxShadow: 3,
    backgroundColor: '#121212',
    borderRadius: 1,
    maxWidth: '90%'
}