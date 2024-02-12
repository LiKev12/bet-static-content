import React from 'react';
import { Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@mui/material';

export interface IAlertDialogState {
    title: string;
    message: string;
    isOpen: boolean;
    handleClose: any;
}

const AlertDialog: React.FC<IAlertDialogState> = (props: IAlertDialogState) => {
    const { title, message, isOpen, handleClose } = props;

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default AlertDialog;
