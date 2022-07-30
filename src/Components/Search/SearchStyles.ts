

export const searchSection = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'
}

export const searchContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
}

export const searchExample = {
    mb: 5,
    color: '#1976d2'
}

export const createChatInput = (mt: number) => {
    return {
        width: '70%',
        input: {textAlign: 'center'},
        mt
    }
}