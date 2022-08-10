import { TailSpin } from 'react-loader-spinner';


import React, {FC} from 'react';
import { Box } from '@mui/system';
import {Typography} from "@mui/material";

const Loader: FC<{spinColor?: string, percent?: number}> = ({spinColor, percent}) => {
    return (
        //rgba(18, 18, 18, 0.5)
        <Box position='absolute' sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#121212' ,top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 400}}>
            <TailSpin color={spinColor || 'white'} height={200} width={200} />
            {percent && <Typography variant='h2' sx={{mt: 5}}>{percent}%</Typography>}
        </Box>
    );
}

export default Loader;
