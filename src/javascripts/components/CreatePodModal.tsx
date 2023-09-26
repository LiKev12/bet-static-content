import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    FormControlLabel,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    FormGroup,
    Checkbox,
} from '@mui/material';
// import { THEME } from 'src/javascripts/Theme';

export interface ICreatePodModalProps {
    id: string;
}

const CreatePodModal: React.FC<ICreatePodModalProps> = (props: ICreatePodModalProps) => {
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
                Create a Pod
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ width: '1000px' }}>Create a Pod</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ paddingBottom: '12px' }}>
                        {`Enter name for your pod (< 50 chars):`}
                    </DialogContentText>
                    <TextField id="create-pod-enter-name" label="name" sx={{ width: '100%', paddingBottom: '12px' }} />
                    <DialogContentText sx={{ paddingBottom: '12px' }}>
                        {`Enter description for your pod (< 300 chars):`}
                    </DialogContentText>
                    <TextField
                        id="create-pod-enter-description"
                        label="description"
                        multiline
                        minRows={4}
                        maxRows={4}
                        sx={{ width: '100%', paddingBottom: '12px' }}
                        // onChange={props.handleChangeText}
                    />
                    <FormControl>
                        <FormLabel id="public-or-private-pod-setting">Public or Private:</FormLabel>
                        <RadioGroup
                            aria-labelledby="public-or-private-pod-setting"
                            defaultValue="public"
                            name="radio-buttons-group"
                        >
                            <FormControlLabel
                                value="public"
                                control={<Radio />}
                                label="Public (allow pod to be discovered)"
                            />
                            <FormControlLabel value="private" control={<Radio />} label="Private" />
                        </RadioGroup>
                    </FormControl>
                    <FormGroup>
                        <FormLabel id="other-pod-setting">Other:</FormLabel>
                        <FormControlLabel control={<Checkbox />} label="Require moderator approval to join" />
                        <FormControlLabel control={<Checkbox />} label="Allow non-members to view pod tasks" />
                    </FormGroup>
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

// https://www.npmjs.com/package/react-avatar-editor
export default CreatePodModal;
