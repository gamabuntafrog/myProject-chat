import {screenTypes} from "../../hooks/useGetTypeOfScreen";


export const meContainer = {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
    mt: 10,
    py: 2,
    px: 1
}

export const avatar = {
    width: 200,
    height: 200
}

export const form = (type: screenTypes) => {

    return {
        maxWidth: type === screenTypes.smallType ? '90%' : '50%',
        my: 1
    }
}

export const formInput = (color?: string) => {


    return ({
        fontWeight: 500,
        mt: 4,
        mb: 1,
        input: {
            color: color ? color : ''
        }
    })
}



export const userInfoWrapper = {
    my: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex'
}