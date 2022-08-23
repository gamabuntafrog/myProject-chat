import {Box, IconButton, Typography} from "@mui/material"
import React, {FC, memo} from "react"
import Avatar from "@mui/material/Avatar";
import {NavLink} from "react-router-dom";
import {user} from "../../types/user";
import CloseIcon from '@mui/icons-material/Close';
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";

type UserModalInfoPT = {
    modalInfo: {
        user: user
        pageY: number,
        pageX: number,
    },
    setIsUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UserModalInfo: FC<UserModalInfoPT> = memo(({modalInfo, setIsUserModalOpen}) => {

    const {isMobile} = useGetTypeOfScreen()

    const maxTopOfModal = (window.innerHeight / 2)

    return (
        <Box display='flex' textAlign='center' flexDirection='column' justifyContent='center'
             position='fixed'
             sx={isMobile ?
                 {
                     bottom: 0,
                     left: 0,
                     width: '100%',
                     padding: '20px',
                     backgroundColor: modalInfo.user?.nicknameColor || '#121212',
                     zIndex: 101,
                     borderRadius: isMobile ? '40px 40px 0px 0px' : '5px'

                 }
                 :
                 {
                     top: modalInfo.pageY > maxTopOfModal ? maxTopOfModal : `${modalInfo.pageY - 20}px`,
                     left: `${modalInfo.pageX + 20}px`,
                     padding: '20px',
                     backgroundColor: modalInfo.user?.nicknameColor || '#121212',
                     zIndex: 101,
                     borderRadius: '5px'
                 }
             }>
            <IconButton onClick={() => setIsUserModalOpen(false)} color={'error'} sx={{ml: 'auto'}}>
                <CloseIcon/>
            </IconButton>
            <Avatar sx={{width: 200, height: 200, mx: 'auto'}} src={`${modalInfo.user?.photoURL}`} alt="avatar"/>
            <NavLink style={{color: 'white'}} to={`/user/${modalInfo.user?.userId}`}>
                <Typography sx={{mt: 1}} variant={'h5'}>{modalInfo.user?.nickname}</Typography>
            </NavLink>
            <Typography  variant={'subtitle1'}>{modalInfo.user?.bio}</Typography>
        </Box>
    )
})

export default UserModalInfo