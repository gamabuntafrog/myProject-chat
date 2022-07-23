import React, {useState, useEffect, useContext} from "react"
import {useDocumentData} from "react-firebase-hooks/firestore";
import {doc} from "firebase/firestore";
import Loader from "../Loader";
import {Context} from "../../index";
import {useParams} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import {Button, Grid, Input, Typography} from "@mui/material";

const User = () => {

    const {id} = useParams<{ id: string }>()
    const {user: me, firestore} = useContext(Context)!

    const [user, isLoading] = useDocumentData(doc(firestore, 'users', `${id}`))
    console.log(user)

    if (isLoading) {
        return <Loader/>
    }
    if (user) {
        return (
            <Grid sx={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: 10}} spacing={2}
                  container>
                <Avatar sx={{width: 200, height: 200}} src={`${user?.photoURL}`} alt="avatar"/>
                <Typography sx={{fontWeight: 500, mt: 5}} variant='h3'>
                    {user?.nickname}
                </Typography>
                <Typography sx={{fontWeight: 500}} variant='h6'>
                    {user?.bio}
                </Typography>
                <Button>
                    Написать
                </Button>
            </Grid>
        )
    } else {
        return (
            <Grid sx={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: 10}} spacing={2}
                  container>
                <Typography sx={{fontWeight: 500, mt: 5, wordBreak: 'break-all', width: '90%'}} variant='h4' component='h1'>
                    Пользователя с id: {id} не существует
                </Typography>
            </Grid>
        )
    }

}

export default User