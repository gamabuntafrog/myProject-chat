import { TailSpin } from 'react-loader-spinner';


import React, {FC} from 'react';
import { Box } from '@mui/system';

const Loader: FC = () => {
    return (
        <Box position='absolute' sx={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            <TailSpin color="#00BFFF" height={200} width={200} />
        </Box>
    );
}

export default Loader;
