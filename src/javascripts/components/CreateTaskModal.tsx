import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
// import { THEME } from 'src/javascripts/Theme';

export interface ICreateTaskModalProps {
    id: string;
}

const CreateTaskModal: React.FC<ICreateTaskModalProps> = (props: ICreateTaskModalProps) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button variant="contained" sx={{ width: '100%' }} onClick={handleClickOpen}>
                Create New Task
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ width: '1000px' }}>Create new task</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ paddingBottom: '12px' }}>
                        {`Enter name of task (< 50 chars, cannot change after creation):`}
                    </DialogContentText>
                    <TextField id="create-task-enter-name" label="name" sx={{ width: '100%', paddingBottom: '12px' }} />
                    <DialogContentText sx={{ paddingBottom: '12px' }}>
                        {`Enter description of task (< 300 chars, not required, can change later):`}
                    </DialogContentText>
                    <TextField
                        id="create-task-enter-description"
                        label="description"
                        multiline
                        minRows={4}
                        maxRows={4}
                        sx={{ width: '100%', paddingBottom: '12px' }}
                        // onChange={props.handleChangeText}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleClose}>Create</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default CreateTaskModal;
