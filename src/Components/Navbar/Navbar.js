import { NavLink } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Hearts } from "react-loader-spinner";
import {useContext, useEffect, useState} from "react";
import { Context } from "../..";
import HeaderMenu from "../HeaderMenu";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Drawer } from "@mui/material";
import Container from '@mui/material/Container';
import {color} from "@mui/system";



const Navbar = () => {


    const {auth} = useContext(Context)

    const [user, isLoading, error] = useAuthState(auth)

    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        return setIsOpen(!isOpen)
    }

    return (
        <AppBar enableColorOnDark sx={{flexGrow: 1, background: '#0d47a1', boxShadow: 3}} position="static">
            <Box sx={{boxShadow: 3}}>
            <Toolbar>
                <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600, mr: 1}}>
                    Чат
                </Typography>     
                {user && <Typography variant="h6" sx={{ fontWeight: 600, mr: 3, textAlign: 'center'}}>{user.displayName}</Typography>}
                <IconButton
                onClick={toggleModal}
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 0, padding: '2px' }}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    anchor="top"
                    open={isOpen}
                    classes={{test: 'test'}}
                >
                    <Container sx={{paddingTop: 5, paddingBottom: 3, }}>
                        <HeaderMenu toggleModal={toggleModal} user={user} auth={auth} />
                    </Container>
                </Drawer>
            </Toolbar>
            </Box>
        </AppBar>
    );
}

export default Navbar;
