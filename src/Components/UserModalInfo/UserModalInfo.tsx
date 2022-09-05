import {Box, IconButton, Typography} from "@mui/material"
import React, {FC, memo, useContext} from "react"
import Avatar from "@mui/material/Avatar";
import {NavLink} from "react-router-dom";
import {user} from "../../types/user";
import CloseIcon from '@mui/icons-material/Close';
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import {ThemeContext} from "../../App";

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
    const {userStyles} = useContext(ThemeContext)!

    const maxTopOfModal = (window.innerHeight / 2)

    return (
        <Box
            className='userModalInfo'
            display='flex'
            textAlign='center'
            flexDirection='column'
            justifyContent='center'
            position='fixed'
            sx={isMobile ?
                {
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    padding: '0 0 20px 0',
                    backgroundColor: userStyles.secondBackgroundColor,
                    zIndex: 101,
                    borderRadius: isMobile ? '20px 20px 0px 0px' : '5px',
                    overflow: 'hidden'

                }
            :
                {
                    top: modalInfo.pageY > maxTopOfModal ? maxTopOfModal : `${modalInfo.pageY - 20}px`,
                    left: `${modalInfo.pageX + 20}px`,
                    padding: '0 0 20px 0',
                    backgroundColor: userStyles.secondBackgroundColor,
                    zIndex: 101,
                    borderRadius: '5px',
                    overflow: 'hidden'
                }
            }
        >
            <IconButton
                onClick={() => setIsUserModalOpen(false)}
                color={'error'}
                sx={{position: 'absolute', right: 5, top: 5}}>
                <CloseIcon/>
            </IconButton>
            <Box sx={{backgroundColor: modalInfo.user?.nicknameColor || 'black', minWidth: isMobile ? '100%' : 240 , height: 200, mb: '-150px'}}/>
            <Avatar sx={{width: 200, height: 200, mx: 'auto', borderRadius: '10px 10px 10px 10px'}} src={`${modalInfo.user?.photoURL}`} alt="avatar"/>
            <Box sx={{px: 1}}>
                <NavLink style={{color: 'white'}} to={`/user/${modalInfo.user?.userId}`}>
                    <Typography sx={{mt: 1}} variant={'h5'}>{modalInfo.user?.nickname}</Typography>
                </NavLink>
                <Typography  variant={'subtitle1'}>{modalInfo.user?.bio}</Typography>
            </Box>
        </Box>
    )
})

export default UserModalInfo