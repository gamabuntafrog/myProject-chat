import { signOut } from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import {Typography, Grid, Button, Link} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import {FC, useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import React from 'react';
import {headerMenuContainer, navLink, userInfo, userInfoAvatar} from "./HeaderMenuStyles";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import TelegramIcon from '@mui/icons-material/Telegram';
import SearchIcon from '@mui/icons-material/Search';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SettingsIcon from '@mui/icons-material/Settings';
import {useCollectionData} from "react-firebase-hooks/firestore";
import {collection, query, where} from "firebase/firestore";
import {chatType} from "../../types/chatType";

type HeaderMenuPropTypes = {
    toggleModal: () => void
}

const HeaderMenu: FC<HeaderMenuPropTypes> = ({toggleModal}) => {
    const {user, firestore, auth} = useContext(Context)!


    const outFromAccount = () => {
        signOut(auth).then(res => res)
        toggleModal()
    }


    if (user) {
        return (
        <Grid sx={headerMenuContainer} spacing={2} container >
            <Grid item xs={12} sx={userInfo} >
                <Avatar sx={userInfoAvatar} src={user.photoURL} alt="avatar" />
                <Typography sx={{fontWeight: 600}} variant='h5'>
                    {user.nickname}
                </Typography>
            </Grid>
            <Grid item xs={12} >
                <NavLink onClick={outFromAccount} className={'nav-link'} to={'/login'}>
                    <Button startIcon={<LogoutIcon/>} size='large' color={'error'} variant={'outlined'}>
                        Выйти с аккаунта
                    </Button>
                </NavLink>
            </Grid>
            <Grid item xs={12} >
                <NavLink style={navLink} onClick={toggleModal} className={'nav-link'} to={'/me'}>
                    <PersonIcon sx={{mr: 1}}/>
                    <Typography variant='h5'>
                        Мой аккаунт
                    </Typography>
                </NavLink>
            </Grid>
            <Grid item xs={12} >
                <NavLink style={navLink} onClick={toggleModal} className={'nav-link'} to={'/settings'}>
                    <SettingsIcon sx={{mr: 1}}/>
                    <Typography variant={'h5'}>
                        Настройки
                    </Typography>
                </NavLink>
            </Grid>
            <Grid item xs={12} >
                <NavLink style={navLink} onClick={toggleModal} className={'nav-link'} to={'/about'}>
                    <InfoIcon sx={{mr: 1}}/>
                    <Typography variant='h5'>
                        Про сайт
                    </Typography>
                </NavLink>
            </Grid>
                <Grid item xs={12} >
                    <NavLink style={navLink} onClick={toggleModal} className={'nav-link'} to={`/chat`}>
                        <TelegramIcon sx={{mr: 1}}/>
                        <Typography variant={'h5'}>
                            Мои чаты
                        </Typography>
                    </NavLink>
                </Grid>

            <Grid item xs={12} >
                <NavLink style={navLink} onClick={toggleModal} className={'nav-link'} to={'/search'}>
                    <SearchIcon sx={{mr: 1}}/>
                    <Typography variant={'h5'}>
                        Поиск
                    </Typography>
                </NavLink>
            </Grid>
            <Grid item xs={12} >
                <IconButton color={'error'} onClick={toggleModal} >
                    <CloseIcon fontSize={'large'} />
                </IconButton>
            </Grid>
        </Grid >
        )
    } else {
        return (
            <Grid sx={headerMenuContainer} spacing={2} container >
                <Grid item xs={12} >
                    <NavLink style={navLink} className={'nav-link'} to={'/login'} onClick={toggleModal}>
                        <VpnKeyIcon sx={{mr: 1}}/>
                        <Typography variant={'h5'}>
                            Войти
                        </Typography>
                    </NavLink>
                </Grid>
                <Grid item xs={12} >
                    <NavLink style={navLink} onClick={toggleModal} className={'nav-link'} to={'/about'}>
                        <InfoIcon sx={{mr: 1}}/>
                        <Typography variant='h5'>
                            Про сайт
                        </Typography>
                    </NavLink>
                </Grid>
                <Grid item xs={12} >
                    <IconButton color={'error'} onClick={toggleModal} >
                        <CloseIcon fontSize={'large'} />
                    </IconButton>
                </Grid>
            </Grid >
        );
    }

}


export default HeaderMenu;