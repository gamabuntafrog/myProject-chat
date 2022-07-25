import React, {FC, useContext, useState} from "react";
import { Context } from "../..";
import HeaderMenu from "../HeaderMenu";
import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, Box, Toolbar, Typography, IconButton, Drawer, Container, Grid} from '@mui/material';
import {useCollection, useDocumentData} from "react-firebase-hooks/firestore";
import {collection, orderBy, query, doc, getDoc} from "firebase/firestore";
import Avatar from "@mui/material/Avatar";



const Navbar: FC = () => {


    const {user, firestore} = useContext(Context)!
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        return setIsOpen(!isOpen)
    }
    const test = async () => {
        const getUser = await getDoc(doc(firestore, 'users', `tUrctpZmpMc1QAlvEvkompEITHu1`))
        console.log(getUser.exists())
    }
    // @ts-ignore
    return (
        <AppBar enableColorOnDark sx={{flexGrow: 1, background: '#0d47a1', boxShadow: 3}} >
            <Box sx={{boxShadow: 3}}>
            <Toolbar>
                <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600, mr: 1}}>
                    Чат
                </Typography>
                {/*{user && <Typography variant="h6" sx={{ fontWeight: 600, mr: 3, textAlign: 'center'}}>{user.nickname}</Typography>}*/}
                {user && <Avatar sx={{width: 40, height: 40, mr: 2}} src={`${user.photoURL}`} alt="avatar" />}
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
                    sx={{'.MuiPaper-root': {
                            background: 'rgba(255, 255, 255, 0)',
                            boxShadow: 0,
                            marginTop: 5
                        }}}
                >
                    <Container>
                        <Box sx={{paddingTop: 5, paddingBottom: 3, boxShadow: 3, backgroundColor: '#121212'}}>
                            <HeaderMenu toggleModal={toggleModal} />
                        </Box>
                    </Container>
                </Drawer>
            </Toolbar>
            </Box>
        </AppBar>
    );
}

export default Navbar;
