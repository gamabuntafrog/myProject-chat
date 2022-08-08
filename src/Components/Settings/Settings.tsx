import React, {useState, useEffect, FC, useContext} from "react"
import {Box, Button, TextField, Typography} from "@mui/material";
import {Context} from "../../index";
import { setDoc, doc} from "firebase/firestore";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";

const Settings: FC = () => {

    const {firestore, user} = useContext(Context)!

    const [backgroundRef, setBackgroundRef] = useState<null | string>(null);

    const type = useGetTypeOfScreen()
    const isMobileScreen = type === screenTypes.smallType

    const submitSettings = async () => {
        await setDoc(doc(firestore, 'users', user!.userId), {
            messagesBackground: backgroundRef
        }, {merge: true})
    }

    return (
        <Box sx={{
            pt: 15,
            width: isMobileScreen ? '90%' : '50%',
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography>Фон в чате</Typography>
            <TextField placeholder='Ссылка' onChange={(e) => setBackgroundRef(e.target.value)} />
            <Button sx={{mt: 1}} onClick={submitSettings} >Сохранить</Button>
        </Box>
    )
}

export default Settings