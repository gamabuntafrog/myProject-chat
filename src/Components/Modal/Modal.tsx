import React, {useState, useEffect, FC} from "react"
import {createPortal} from "react-dom";
import {Box, Button, Modal as MUIModal} from "@mui/material";

const modalRoot = document.querySelector('#modal-root')!;

type ModalPT = {
    isModalOpen: boolean,
    children: any,
    onClose: any
}

const Modal: FC<ModalPT> = ({isModalOpen, children, onClose}) => {

    return (
        <MUIModal onClose={onClose} open={isModalOpen} sx={{width: '100%', height: '100%', backgroundColor: 'RGBA(0,0,0, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', wordBreak: 'break-word',
        }}
                  >
            <Box sx={{
                my: 2,
                backgroundColor: '#121212',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                padding: '50px 30px',
                borderRadius: '10px',
                overflowY: 'auto',
                minWidth: '50%'
            }}>
                <Button sx={{marginLeft: 'auto'}} onClick={onClose}>
                    Закрыть
                </Button>
                {children}
            </Box>
        </MUIModal>
    )
}

export default Modal