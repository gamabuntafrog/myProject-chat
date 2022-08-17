import React, {FC, useContext, useState} from "react";
import {Context} from "../..";
import HeaderMenu from "../HeaderMenu";
import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, Box, Button, Container, Drawer, IconButton, Toolbar, Typography} from '@mui/material';
import Avatar from "@mui/material/Avatar";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import EllipsisText from "react-ellipsis-text";
import {
    appBar,
    chatInfoStyles,
    headerMenuWrapper,
    linkToUserInfo,
    logo,
    slideMenu,
    userAvatar,
    userNickname
} from "./NavbarStyles";
import {NavLink,useLocation} from "react-router-dom";
import {ChatInfoContext, ChatListContext, ThemeContext} from "../../App";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from '@mui/icons-material/Close';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
const Navbar: FC = () => {

    const type = useGetTypeOfScreen()
    const isMobileOrMedium = (type === screenTypes.smallType || type === screenTypes.mediumType)
    const {user} = useContext(Context)!
    const {userStyles} = useContext(ThemeContext)!
    const {handleIsChatListOpen, isChatListOpen} = useContext(ChatListContext)!

    const {chatInfo, handleChatInfoIsOpen, isChatInfoOpen} = useContext(ChatInfoContext)!
    // console.log(isChatInfoOpen)
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        return setIsOpen(!isOpen)
    }


    const location = useLocation()
    const isInChat = location.pathname.includes('/chat/')
    console.log()

    return (
        <AppBar sx={appBar(type, userStyles.backgroundColor)} >
            <Toolbar sx={{px: 1}}>
                {!isMobileOrMedium &&
                    <NavLink style={logo} to={'/search'}>
                        <Typography variant="h4" sx={logo}>
                            Чат
                            <ChatBubbleOutlineIcon/>
                        </Typography>
                    </NavLink>
                }
                {isMobileOrMedium && isInChat &&
                    <IconButton sx={{color: 'white', padding: '8px 8px 8px 8px'}} onClick={() => handleIsChatListOpen(isChatListOpen)}>
                        {isChatListOpen ?
                            <CloseIcon fontSize='large'/>
                            :
                            <KeyboardBackspaceIcon  fontSize='large'/>

                        }
                    </IconButton>
                }
                {chatInfo &&
                    <Box sx={{mx: 'auto', ...chatInfoStyles, cursor: 'pointer'}} onClick={() => handleChatInfoIsOpen(isChatInfoOpen)}>
                        <Avatar sx={isMobileOrMedium ? {width: '40px', height: '40px', mr: 1} : {width: '50px', height: '50px', mr: 2}} src={chatInfo.chatImage} alt="avatar" />
                        <Box sx={{textAlign: 'center'}}>
	                        <Typography sx={{mb: -0.5}} variant={isMobileOrMedium ? 'h6' : 'h5'} ><EllipsisText text={chatInfo.chatName} length={30}/></Typography>
                            <Typography variant='body2' >
                                {chatInfo.users.length} участников
                            </Typography>
                        </Box>
                    </Box>
                }
                {user && !chatInfo &&
                    <Box sx={{mx: 'auto'}}>
                        <NavLink style={linkToUserInfo} to={`/me`}>
                            <Avatar sx={userAvatar} src={user.photoURL} alt="avatar" />

                                <Typography variant="h6" sx={userNickname}>
                                    <EllipsisText text={user.nickname} length={30}/>
                                </Typography>

                        </NavLink>
                    </Box>
                }
                <IconButton
                    onClick={toggleModal}
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{padding: isMobileOrMedium ? 0 : 1, ml: user ? 0 : 'auto'}}
                >
                    <MenuIcon fontSize={'large'} />
                </IconButton>
                <Drawer
                    anchor="top"
                    open={isOpen}
                    onClose={toggleModal}
                    sx={slideMenu}
                >
                    <Container sx={headerMenuWrapper(userStyles.secondBackgroundColor)}>
                        <HeaderMenu toggleModal={toggleModal} />
                    </Container>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
