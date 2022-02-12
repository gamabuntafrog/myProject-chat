import { TailSpin } from 'react-loader-spinner';


import React from 'react';

const Loader = () => {
    return (
        <div className='loader__wrapper'>
            <TailSpin color="#00BFFF" height={200} width={200} />
        </div>
    );
}

export default Loader;
