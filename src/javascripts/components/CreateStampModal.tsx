import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Grid,
    Tooltip,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    Checkbox,
    ListItemText,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { MOCK_PODS } from 'src/javascripts/mocks/MockPods';
// import { THEME } from 'src/javascripts/Theme';

export interface ICreateStampModalProps {
    id: string;
}

const CreateStampModal: React.FC<ICreateStampModalProps> = (props: ICreateStampModalProps) => {
    const [open, setOpen] = useState(false);
    const [tasksSelected, setTasksSelected] = useState(new Set());
    const [tasksInSelectedPod, setTasksInSelectedPod] = useState([]);
    // const [selectedPod, setSelectedPod] = useState('');
    const selectedPodId = '8a4ae019-f46b-41c8-bb14-5a230f5cd935';
    const mockTasks = MOCK_PODS.filter((pod: any) => pod.id === selectedPodId)[0].tasks;
    setTasksInSelectedPod(mockTasks);

    const handleSetTaskSelected = (selectedTaskId: string): void => {
        setTasksSelected((prevTasksSelected) => {
            if (prevTasksSelected.has(selectedTaskId)) {
                prevTasksSelected.delete(selectedTaskId);
            } else {
                prevTasksSelected.add(selectedTaskId);
            }
            return prevTasksSelected;
        });
    };

    const handleClickOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button variant="contained" sx={{ width: '100%' }} onClick={handleClickOpen}>
                Create a Stamp
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ width: '1000px' }}>Create a Stamp</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ paddingBottom: '12px' }}>
                        {`Enter name for your Stamp (< 50 chars):`}
                    </DialogContentText>
                    <TextField
                        id="create-stamp-enter-name"
                        label="name"
                        sx={{ width: '100%', paddingBottom: '12px' }}
                    />
                    <DialogContentText sx={{ paddingBottom: '12px' }}>
                        {`Enter description for this Stamp (< 300 chars):`}
                    </DialogContentText>
                    <TextField
                        id="create-stamp-enter-description"
                        label="description"
                        multiline
                        minRows={4}
                        maxRows={4}
                        sx={{ width: '100%', paddingBottom: '12px' }}
                        // onChange={props.handleChangeText}
                    />
                    <Grid container direction="row">
                        <Grid item>
                            <DialogContentText sx={{ paddingBottom: '12px' }}>
                                {`Select tasks to include for this Stamp (max 1000):`}
                            </DialogContentText>
                        </Grid>
                        <Grid item>
                            <Tooltip
                                title={
                                    'You may include tasks from multiple Pods. However, stamps with tasks from multiple Pods have limited discoverability. Specifically, such stamps may only be discovered by users who have access to all the Pods associated with the stamp. In this case, access for private Pods is defined as being a member. Note that all users have access to public Pods.'
                                }
                                placement="right"
                            >
                                <InfoOutlinedIcon
                                    sx={{
                                        paddingLeft: '4px',
                                        paddingTop: '2px',
                                    }}
                                    fontSize="small"
                                />
                            </Tooltip>
                        </Grid>
                        <Grid item></Grid>
                        <Grid item>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                {tasksInSelectedPod.map((task: any, idx: number) => {
                                    const { id: taskId, name: taskName } = task;
                                    const labelId = `checkbox-list-label-${String(taskId)}`;
                                    return (
                                        <ListItem key={taskId} disablePadding>
                                            <ListItemButton
                                                role={undefined}
                                                onClick={handleSetTaskSelected.bind(taskId)}
                                                dense
                                            >
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={tasksSelected.has(taskId)}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText id={labelId} primary={taskName} />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Grid>
                    </Grid>
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
export default CreateStampModal;
