import {screenTypes} from "../../hooks/useGetTypeOfScreen";


export const searchSection = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    pt: '20%'
}

export const searchContainer = (type: screenTypes) => {


    return ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: type === screenTypes.smallType ? '90%' : '50%',
    })
}

export const searchExample = {
    mb: 5,
}

export const createChatInput = {
    width: '100%',
    input: {textAlign: 'center'},
    textarea: {textAlign: 'center'},
    fieldset: {borderRadius: '20px'}
}

export const createChatLabel = {
    color: '#1976d2',
    mt: 2,
    mb: 1
}