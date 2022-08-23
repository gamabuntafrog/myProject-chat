import React, {FC, useContext, useState} from "react"
import {doc, setDoc} from "firebase/firestore";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {Context} from "../../index";
import Avatar from "@mui/material/Avatar";
import {Box, Button, FormControl, FormLabel, Grid, Input, TextField, Typography} from "@mui/material";
import Loader from "../Loader";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import {avatar, form, formInput, meContainer, userInfoWrapper} from "./MeStyles";
import {ColorChangeHandler, SliderPicker } from 'react-color';
import {user} from "../../types/user";
import '../../App.css'

const fileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/pjpeg',
    'image/png'
]
function validFileType(file: File ) {
    for(let i = 0; i < fileTypes.length; i++) {
        if(file.type === fileTypes[i]) {
            return true;
        }
    }

    return false;
}
const Me: FC = () => {

    const {user, firestore, isUserLoading} = useContext(Context)!

    const [isClicked, setIsClicked] = useState(false);
    const [newUserInfo, setNewUserInfo] = useState<user>(user!);
    const [newUserAvatarFile, setNewUserAvatarFile] = useState<null | File>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | ArrayBuffer | null>(null);
    const [progress, setProgress] = useState<null | number>(null);
    console.log(newUserInfo)
    const [color, setColor] = useState('');

    const {screenType} = useGetTypeOfScreen()

    const storage = getStorage()

    const imageHandler = (file: File) => {
        const reader = new FileReader()
        reader.onload = () => {
            if (reader.readyState === 2) {
                setPreviewAvatar(reader.result)
            }
        }
        reader.readAsDataURL(file)
    }

    const changeInfo = async () => {

        if (newUserAvatarFile && validFileType(newUserAvatarFile)) {
            console.log(newUserAvatarFile)
            const storageRef = ref(storage, `/avatars/${user!.userId}`)
            const uploadTask = uploadBytesResumable(storageRef, newUserAvatarFile)
            console.log(newUserInfo)

            uploadTask.on('state_changed', (snapshot => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                setProgress(progress)
            }), (err) => {
                console.log(err)
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(url => {
                        setDoc(doc(firestore, 'users', user!.userId), {...newUserInfo, photoURL: url})
                    }).then(() => {
                        setProgress(null)
                        setIsClicked(false)
                        setNewUserAvatarFile(null)
                    })
            })
        } else {
            await setDoc(doc(firestore, 'users', user!.userId), newUserInfo)
            setIsClicked(false)
        }
    }

    const handleColor: ColorChangeHandler = (color, event) => {
        console.log(color)
        console.log(event)
        setColor(color.hex)
        setNewUserInfo(prev => {
            return {...prev, nicknameColor: color.hex}
        })
    }

    if (isUserLoading) {
        return <Loader/>
    }

    if (user) {
        return (
        <Box sx={meContainer} component={'section'}>
            {progress ? <Loader percent={progress}/> : ''}
            <Box sx={{width: '50vw'}}>
            </Box>
            {/*@ts-ignore*/}
            <Avatar sx={avatar} src={previewAvatar ? previewAvatar : user.photoURL} alt="avatar"/>
            {isClicked ?
                <FormControl onSubmit={changeInfo} fullWidth sx={form(screenType)} >
                    <TextField variant={'standard'} value={newUserInfo.nickname} onChange={(e) => setNewUserInfo(prev => {
                        return {...prev, nickname: e.target.value}
                    })} placeholder={'Никнейм'} sx={formInput(color)}/>
                    <SliderPicker color={color} onChange={handleColor} onChangeComplete={handleColor}/>
                    <TextField value={newUserInfo.bio} onChange={(e) => setNewUserInfo(prev => {
                        return {...prev, bio: e.target.value}
                    })} placeholder={'Био'} sx={formInput()}/>
                    <FormLabel sx={{color: newUserAvatarFile ? 'green' : ''}} className='custom-file-upload' htmlFor='fileInput'>
                        {newUserAvatarFile ?
                            newUserAvatarFile.name
                            :
                            'Загрузите картинку'
                        }
                    </FormLabel>
                    <input id='fileInput' type='file' accept=".jpg, .jpeg, .png" onChange={(e) => {
                        if (e.target.files) {
                            setNewUserAvatarFile(e.target.files[0])
                            imageHandler(e.target.files[0])
                        }
                    }}/>
                    <Box sx={{mt: 2}}>
                        <Button onClick={changeInfo} sx={{mr: 1}}>Зберегти</Button>
                        <Button color={'error'} onClick={() => setIsClicked(false)}>Закрити</Button>
                    </Box>
                </FormControl>
                :
                <Box sx={userInfoWrapper}>
                    <Typography sx={{fontWeight: 500}} variant='h3'>
                        {user.nickname}
                    </Typography>
                    <Typography sx={{fontWeight: 500}} variant='h6'>
                        {user.bio}
                    </Typography>
                    <Typography sx={{fontWeight: 500, textAlign: 'center'}} variant='h6'>
                        Created at {user?.createdAt}
                    </Typography>
                    <Button sx={{mt: 2}} onClick={() => setIsClicked(true)}>Змінити інформацію</Button>
                </Box>
            }
        </Box>
        )
    } else {
        return <Box></Box>
    }


}

export default Me