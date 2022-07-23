import React, {useState, useEffect, FC, useContext} from "react"
import {doc, getDoc, setDoc} from "firebase/firestore";
import {Context} from "../../index";
import {useDocumentData} from "react-firebase-hooks/firestore";
import Avatar from "@mui/material/Avatar";
import {Box, Button, Grid, Input, Typography} from "@mui/material";
import Loader from "../Loader";

const Me: FC = () => {

    const {user, firestore} = useContext(Context)!

    const [isClicked, setIsClicked] = useState(false);
    const [newUserInfo, setNewUserInfo] = useState(user);
    const changeInfo = async () => {
        setIsClicked(false)
        console.log(newUserInfo)
        await setDoc(doc(firestore, 'users', `${user?.userId}`), newUserInfo)
    }

    return (<Grid sx={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: 10}} spacing={2}
                  container>
        <Avatar sx={{width: 200, height: 200}} src={`${user?.photoURL}`} alt="avatar"/>
        {!isClicked ?
            <Typography onClick={() => setIsClicked(true)} sx={{fontWeight: 500, mt: 5}} variant='h3'>
                {user?.nickname}
            </Typography>
            :
            <Input onChange={(e) => setNewUserInfo(prev => {
                return {...prev, nickname: e.target.value}
            })} placeholder={'Никнейм'} sx={{fontWeight: 500, mt: 5}}/>
        }
        {!isClicked ?
            <Typography sx={{fontWeight: 500}} variant='h6'>
                {user?.bio}
            </Typography>
            :
            <Input onChange={(e) => setNewUserInfo(prev => {
                return {...prev, bio: e.target.value}
            })} placeholder={'Био'} sx={{fontWeight: 500, mt: 5}}/>
        }
        {isClicked &&
        <Input onChange={(e) => setNewUserInfo(prev => {
            return {...prev, photoURL: e.target.value}
        })} placeholder={'Ссылка картинки'} sx={{fontWeight: 500, mt: 5}}/>
        }
        {!isClicked && <Typography sx={{fontWeight: 500}} variant='h6'>
            Created at {user?.createdAt}
        </Typography>}
        {!isClicked && <Button onClick={() => setIsClicked(true)}>Змінити інформацію</Button>}
        {isClicked && <Button onClick={changeInfo}>Зберегти</Button>}
        {isClicked && <Button onClick={() => setIsClicked(false)}>Закрити</Button>}
    </Grid>)


}

export default Me