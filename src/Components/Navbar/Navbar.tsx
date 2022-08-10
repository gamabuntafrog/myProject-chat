import React, {FC, useContext, useState} from "react";
import {Context} from "../..";
import HeaderMenu from "../HeaderMenu";
import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, Box, Container, Drawer, IconButton, Toolbar, Typography} from '@mui/material';
import Avatar from "@mui/material/Avatar";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import EllipsisText from "react-ellipsis-text";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import {appBar, headerMenuWrapper, linkToUserInfo, logo, slideMenu, userAvatar, userNickname} from "./NavbarStyles";
import {NavLink} from "react-router-dom";
import {ThemeContext} from "../../App";

const Navbar: FC = () => {

    const type = useGetTypeOfScreen()
    const {user} = useContext(Context)!
    const {userStyles} = useContext(ThemeContext)!

    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        return setIsOpen(!isOpen)
    }

    return (
        <AppBar sx={appBar(type, userStyles.backgroundColor)} >
            <Toolbar>
                <NavLink style={logo} to={'/search'}>
                    <Typography variant="h4" sx={logo}>
                        Чат
                        <ChatBubbleOutlineIcon/>
                    </Typography>
                </NavLink>
                {user &&
                    <Box sx={{mx: 'auto'}}>
                        <NavLink style={linkToUserInfo} to={`/me`}>
                            <Avatar sx={userAvatar} src={`${user.photoURL}`} alt="avatar" />
                            {type !== screenTypes.smallType &&
                                <Typography variant="h6" sx={userNickname}>
                                    <EllipsisText text={user.nickname} length={30}/>
                                </Typography>
                            }
                        </NavLink>
                    </Box>
                }
                <IconButton
                    onClick={toggleModal}
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{padding: 1, ml: user ? 0 : 'auto'}}
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
