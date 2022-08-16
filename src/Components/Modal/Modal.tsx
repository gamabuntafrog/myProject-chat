import React, {FC, useContext} from "react"
import {Box, Button, Modal as MUIModal} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'
import {modalBackdrop, modalCloseButton, modalContainer} from "./ModalStyles";
import {justifyColumnCenter} from "../GeneralStyles";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import {ThemeContext} from "../../App";

type ModalPT = {
    isModalOpen: boolean,
    children: any,
    onClose: any,
    isPadding?: boolean,
    buttonPosition?: 'relative' | 'absolute',
    br?: string,
    height?: string,
    jc?: 'center' | 'start',
    width?: string
}


const Modal: FC<ModalPT> = ({
    isModalOpen,
    children,
    onClose,
    isPadding,
    buttonPosition,
    br,
    height,
    jc,
    width
}) => {
    const {userStyles} = useContext(ThemeContext)!


    const type = useGetTypeOfScreen()
    const isMobile = type === screenTypes.smallType;

    return (
        <MUIModal onClose={onClose} open={isModalOpen} sx={{...modalBackdrop, ...justifyColumnCenter}}>
            <Box sx={modalContainer({isMobile, isPadding: isPadding, br, height, jc, backgroundColor: userStyles.secondBackgroundColor, width})}>
                <Button color={'error'} sx={modalCloseButton(buttonPosition)} onClick={onClose}>
                    <CloseIcon/>
                </Button>
                {children}
            </Box>
        </MUIModal>
    )
}

export default Modal