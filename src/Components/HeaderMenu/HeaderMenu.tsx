import { signOut } from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import { Typography, Grid, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import {FC, useContext} from "react";
import {Context} from "../../index";
import React from 'react';
import {HeaderMenuPropTypes} from "../../types/HeaderMenuPT";



const HeaderMenu: FC<HeaderMenuPropTypes> = ({toggleModal}) => {

    const {user, auth} = useContext(Context)!
    console.log(user)
    const outFromAccount = () => {
        signOut(auth).then(res => res)
        toggleModal()
    }

    if (user) {
        return (
        <Grid sx={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', wordBreak: 'break-word'}} spacing={2} container >
            <Grid item xs={12}  sx={{display: 'flex', alignItems: 'center', flexDirection: 'row'}} >
                <Avatar sx={{width: 80, height: 80, mr: 2}} src={`${user.photoURL}`} alt="avatar" />
                <Typography sx={{fontWeight: 500}} variant='h5'>
                    {user.nickname}
                </Typography>
            </Grid>
            <Grid item xs={12} >
                <NavLink onClick={outFromAccount} className={'nav-link'} to={'/login'}>
                    <Button size='large' color={'error'} variant={'outlined'}>
                        Выйти с аккаунта
                    </Button>
                </NavLink>
            </Grid>
            <Grid item xs={12} >
                <NavLink onClick={toggleModal} className={'nav-link'} to={'/me'}>
                    <Typography variant='h5'>
                        Мой аккаунт
                    </Typography>
                </NavLink>
            </Grid>
            <Grid item xs={12} >
                <NavLink onClick={toggleModal} className={'nav-link'} to={'/about'}>
                    <Typography variant='h5'>
                        Про сайт
                    </Typography>
                </NavLink>
            </Grid>
            <Grid item xs={12} >
                <NavLink onClick={toggleModal} className={'nav-link'} to={`/chat/${user.subscribedChats[0]}`}>
                    <Typography variant={'h5'}>
                        Мои чаты
                    </Typography>
                </NavLink>
            </Grid>
            <Grid item xs={12} >
                <NavLink onClick={toggleModal} className={'nav-link'} to={'/search'}>
                    <Typography variant={'h5'}>
                        Поиск
                    </Typography>
                </NavLink>
            </Grid>
            <Grid item xs={12} >
                <IconButton color={'error'} onClick={toggleModal} >
                    <CloseIcon />
                </IconButton>
            </Grid>
        </Grid >
        )
    } else {
        return (
            <Grid sx={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}  spacing={2} container >
                <Grid item xs={12} >
                    <NavLink className={'nav-link'} to={'/login'} onClick={toggleModal}>
                        <Typography variant={'h5'}>
                            Войти
                        </Typography>
                    </NavLink>
                </Grid>
                <Grid item xs={12} >
                    <NavLink className={'nav-link'} to={'/about'} onClick={toggleModal}>
                        <Typography variant={'h5'}>
                            Про сайт
                        </Typography>
                    </NavLink>
                </Grid>
                <Grid item xs={12} >
                    <IconButton color={'error'} onClick={toggleModal} >
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid >
        );
    }

}


export default HeaderMenu;