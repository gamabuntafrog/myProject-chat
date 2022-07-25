import {Box, Grid, Link, Typography} from "@mui/material"
import React, {useState, useEffect, FC} from "react"
import Avatar from "@mui/material/Avatar";
import {NavLink} from "react-router-dom";

type UserModalInfoPT = {
    modalInfo: {
        user: {
            bio: string,
            createdAt: string,
            email: string,
            nickname: string,
            phoneNumber: string | null,
            photoURL: string,
            userId: string,
        }
        pageY: number,
        pageX: number
    },
}

const UserModalInfo: FC<UserModalInfoPT> = ({modalInfo}) => {

    console.log(modalInfo)

    return (
        <Box display='flex' textAlign='center' flexDirection='column' justifyContent='center'
             position='absolute' sx={{top: `${modalInfo.pageY + 20}px`, left: `${modalInfo.pageX + 20}px`, padding: '20px', backgroundColor: '#0d47a1', zIndex: 101, borderRadius: '5px'}}>
            <Avatar sx={{width: 200, height: 200, mx: 'auto'}} src={`${modalInfo.user.photoURL}`} alt="avatar"/>
            <NavLink style={{color: 'white'}} to={`/user/${modalInfo.user.userId}`}>
                <Typography sx={{mt: 1}} variant={'h5'}>{modalInfo.user.nickname}</Typography>
            </NavLink>
            <Typography  variant={'subtitle1'}>{modalInfo.user.bio}</Typography>
        </Box>
    )
}

export default UserModalInfo