import React, {useState, useEffect, FC} from "react"
import {Box, Button, Modal as MUIModal} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'
import {modalBackdrop, modalCloseButton, modalContainer} from "./ModalStyles";
import {justifyColumnCenter} from "../GeneralStyles";

type ModalPT = {
    isModalOpen: boolean,
    children: any,
    onClose: any
}


const Modal: FC<ModalPT> = ({isModalOpen, children, onClose}) => {

    return (
        <MUIModal onClose={onClose} open={isModalOpen} sx={{...modalBackdrop, ...justifyColumnCenter}}>
            <Box sx={modalContainer}>
                <Button color={'error'} sx={modalCloseButton} onClick={onClose}>
                    <CloseIcon />
                </Button>
                {children}
            </Box>
        </MUIModal>
    )
}

export default Modal