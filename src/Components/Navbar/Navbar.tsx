import React, {FC, useContext, useState} from "react";
import { Context } from "../..";
import HeaderMenu from "../HeaderMenu";
import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, Box, Toolbar, Typography, IconButton, Drawer, Container, Grid} from '@mui/material';
import Avatar from "@mui/material/Avatar";
import {useGetTypeOfScreen, screenTypes} from "../../hooks/useGetTypeOfScreen";
// @ts-ignore
import EllipsisText from "react-ellipsis-text";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import {appBar, headerMenuWrapper, logo, slideMenu} from "./NavbarStyles";
import {NavLink} from "react-router-dom";

const Navbar: FC = () => {

    const type = useGetTypeOfScreen()
    const {user} = useContext(Context)!
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        return setIsOpen(!isOpen)
    }

    return (
        <AppBar sx={appBar(type)} >
            <Toolbar>
                <NavLink style={logo} to={'/search'}>
                    <Typography variant="h4" sx={logo}>
                        Чат
                        <ChatBubbleOutlineIcon/>
                    </Typography>
                </NavLink>
                {user &&
	                    <Box sx={{mx: 'auto'}}>
                            <NavLink style={{color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '0 20px'}} to={`/user/${user.userId}`}>
                                <Avatar sx={{width: 40, height: 40, mr: 2}} src={`${user.photoURL}`} alt="avatar" />
                                <Typography variant="h6" sx={{ fontWeight: 600, mr: 1, textAlign: 'center'}}>
                                    <EllipsisText text={user.nickname} length={type === screenTypes.smallType ? 10 : 30}/>
                                </Typography>
                            </NavLink>
                        </Box>
                }
                <IconButton
                    onClick={toggleModal}
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{padding: 1, ml: user ? 0 : 1}}
                >
                    <MenuIcon fontSize={'large'} />
                </IconButton>
                <Drawer
                    anchor="top"
                    open={isOpen}
                    onClose={toggleModal}
                    sx={slideMenu}
                >
                    <Container sx={headerMenuWrapper}>
                        <HeaderMenu toggleModal={toggleModal} />
                    </Container>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
