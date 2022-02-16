import { useAuthState } from 'react-firebase-hooks/auth';
import {useContext, useState} from "react";
import { Context } from "../..";
import HeaderMenu from "../HeaderMenu";
import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, Box, Toolbar, Typography, IconButton, Drawer, Container} from '@mui/material';



const Navbar = () => {


    const {auth} = useContext(Context)

    const [user] = useAuthState(auth)

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
