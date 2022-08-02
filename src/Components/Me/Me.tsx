import React, {FC, useContext, useState} from "react"
import {doc, setDoc} from "firebase/firestore";
import {Context} from "../../index";
import Avatar from "@mui/material/Avatar";
import {Box, Button, FormControl, Grid, TextField, Typography} from "@mui/material";
import Loader from "../Loader";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import {avatar, form, formInput, meContainer, userInfoWrapper} from "./MeStyles";

const Me: FC = () => {

    const {user, firestore, isUserLoading} = useContext(Context)!

    const [isClicked, setIsClicked] = useState(false);
    const [newUserInfo, setNewUserInfo] = useState(user!);

    const type = useGetTypeOfScreen()

    const changeInfo = async () => {
        setIsClicked(false)
        console.log(newUserInfo)
        await setDoc(doc(firestore, 'users', `${user!.userId}`), newUserInfo)
    }

    if (isUserLoading) {
        return <Loader/>
    }

    if (user) {
        return (<Grid sx={meContainer} spacing={2} container component={'section'}>
            <Avatar sx={avatar} src={user.photoURL} alt="avatar"/>
            {isClicked ?
                <FormControl fullWidth sx={form(type)} >
                    <TextField variant={'standard'} value={newUserInfo.nickname} onChange={(e) => setNewUserInfo(prev => {
                        return {...prev, nickname: e.target.value}
                    })} placeholder={'Никнейм'} sx={formInput}/>

                    <TextField value={newUserInfo.bio} onChange={(e) => setNewUserInfo(prev => {
                        return {...prev, bio: e.target.value}
                    })} placeholder={'Био'} sx={formInput}/>

                    <TextField onChange={(e) => setNewUserInfo(prev => {
                        return {...prev, photoURL: e.target.value}
                    })} placeholder={'Ссылка картинки'} sx={formInput}/>
                    <Box sx={{mt: 2}}>
                        <Button sx={{mr: 1}} onClick={changeInfo}>Зберегти</Button>
                        <Button color={'error'} onClick={() => setIsClicked(false)}>Закрити</Button>
                    </Box>
                </FormControl>
                :
                <Box sx={userInfoWrapper}>
                    <Typography onClick={() => setIsClicked(true)} sx={{fontWeight: 500}} variant='h3'>
                        {user.nickname}
                    </Typography>
                    <Typography sx={{fontWeight: 500}} variant='h6'>
                        {user.bio}
                    </Typography>
                    <Typography sx={{fontWeight: 500}} variant='h6'>
                        Created at {user?.createdAt}
                    </Typography>
                    <Button sx={{mt: 2}} onClick={() => setIsClicked(true)}>Змінити інформацію</Button>

                </Box>
            }
        </Grid>)
    } else {
        return <Box></Box>
    }


}

export default Me