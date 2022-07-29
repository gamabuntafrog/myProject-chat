import { TailSpin } from 'react-loader-spinner';


import React, {FC} from 'react';
import { Box } from '@mui/system';

const Loader: FC = () => {
    return (
        <Box position='fixed' sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(18, 18, 18, 0.5)' ,top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 400}}>
            <TailSpin color="#00BFFF" height={200} width={200} />
        </Box>
    );
}

export default Loader;
