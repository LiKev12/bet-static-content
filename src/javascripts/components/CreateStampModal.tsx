import React, { useState } from 'react';
import {
    Alert,
    Box,
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { MOCK_PODS, MOCK_TASKS } from 'src/javascripts/mocks/Mocks';
import { THEME } from 'src/javascripts/Theme';
import {
    MIN_LEN_CHARS_STAMP_NAME,
    MAX_LEN_CHARS_STAMP_NAME,
    MAX_LEN_CHARS_STAMP_DESCRIPTION,
    STAMP_INPUT_NAME_HELPER_TEXT,
    STAMP_INPUT_DESCRIPTION_HELPER_TEXT,
} from 'src/javascripts/Constants';
import { getInputText } from 'src/javascripts/utilities';

export interface ICreateStampModalProps {
    idPod: string | null;
}

const getTasks = (tasks: any, selectedPodId: any): any => {
    const podIdToTasksMap = new Map();
    const taskIdToTaskMap = new Map();
    tasks.forEach((entry: any) => {
        taskIdToTaskMap.set(entry.id, entry);
    });
    tasks.forEach((task: any) => {
        if (task.id__pod !== null) {
            if (podIdToTasksMap.has(task.id__pod)) {
                podIdToTasksMap.get(task.id__pod).push(taskIdToTaskMap.get(task.id));
            } else {
                podIdToTasksMap.set(task.id__pod, [taskIdToTaskMap.get(task.id)]);
            }
        }
    });
    return podIdToTasksMap.get(selectedPodId) !== undefined ? podIdToTasksMap.get(selectedPodId) : [];
};

const CreateStampModal: React.FC<ICreateStampModalProps> = (props: ICreateStampModalProps) => {
    const { idPod } = props;

    const [open, setOpen] = useState(false);
    const [selectedPodId, setSelectedPodId] = useState(idPod);

    const [tasksInSelectedPod, setTasksInSelectedPod] = useState(getTasks(MOCK_TASKS, selectedPodId));
    // create stamp
    const [isBlurredStampName, setBlurredStampName] = useState(false); // don't show error for stampName on initial load
    const [isBlurredStampDescription, setBlurredStampDescription] = useState(false); // don't show error for stampDescription on initial load
    const [stampName, setStampName] = useState('');
    const [stampDescription, setStampDescription] = useState('');
    const [stampTaskIds, setStampTaskIds] = useState(new Set());

    const handleClickOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const isErrorStampName = stampName.length < MIN_LEN_CHARS_STAMP_NAME || stampName.length > MAX_LEN_CHARS_STAMP_NAME;
    const isErrorStampDescription = stampDescription.length > MAX_LEN_CHARS_STAMP_DESCRIPTION;
    const isErrorCreateOrUpdateStamp = isErrorStampName || isErrorStampDescription;

    return (
        <React.Fragment>
            <Button variant="contained" sx={{ width: '100%' }} onClick={handleClickOpen}>
                {'Create a Stamp'}
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Create a Stamp</DialogTitle>
                <DialogContent>
                    <Grid container direction="row">
                        <Grid item>
                            <DialogContentText sx={{ marginBottom: '12px' }}>
                                {`Enter name of Stamp:`}
                            </DialogContentText>
                        </Grid>
                        <Grid item>
                            <Tooltip title={'required, can modify after creation'} placement="right">
                                <InfoOutlinedIcon
                                    sx={{
                                        paddingLeft: '4px',
                                    }}
                                    fontSize="small"
                                />
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <TextField
                        id="create-stamp-enter-name"
                        label="name"
                        sx={{ width: '100%', marginBottom: '12px' }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setStampName(event.target.value);
                        }}
                        value={stampName}
                        onBlur={() => {
                            setBlurredStampName(true);
                        }}
                        error={isErrorStampName && isBlurredStampName}
                        helperText={STAMP_INPUT_NAME_HELPER_TEXT(getInputText(stampName).length)}
                    />
                    <Grid container direction="row">
                        <Grid item>
                            <DialogContentText sx={{ marginBottom: '12px' }}>
                                {`Enter description of Stamp:`}
                            </DialogContentText>
                        </Grid>
                        <Grid item>
                            <Tooltip title={'not required, can modify after creation'} placement="right">
                                <InfoOutlinedIcon
                                    sx={{
                                        paddingLeft: '4px',
                                    }}
                                    fontSize="small"
                                />
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <TextField
                        id="create-stamp-enter-description"
                        label="description"
                        multiline
                        minRows={4}
                        maxRows={4}
                        sx={{ width: '100%', marginBottom: '12px' }}
                        value={stampDescription}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setStampDescription(event.target.value);
                        }}
                        onBlur={() => {
                            setBlurredStampDescription(true);
                        }}
                        error={isErrorStampDescription && isBlurredStampDescription}
                        helperText={STAMP_INPUT_DESCRIPTION_HELPER_TEXT(getInputText(stampDescription).length)}
                    />
                    <Grid container direction="row">
                        <Grid item>
                            <DialogContentText sx={{ marginBottom: '12px' }}>
                                {`Select Tasks to include for this Stamp (max 1000):`}
                            </DialogContentText>
                        </Grid>
                        <Grid item>
                            <Tooltip
                                title={
                                    <React.Fragment>
                                        You may include tasks from multiple Pods. However, Stamps with Tasks from
                                        multiple Pods have limited discoverability.
                                        <br />
                                        <br />
                                        Specifically, such Stamps may only be discovered by users who have access to all
                                        of the Pods associated with the Stamp. Access for a private Pod is defined as
                                        being a member of the private Pod. All users have access to public Pods.
                                    </React.Fragment>
                                }
                                placement="right"
                            >
                                <InfoOutlinedIcon
                                    sx={{
                                        paddingLeft: '4px',
                                    }}
                                    fontSize="small"
                                />
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <FormControl fullWidth sx={{ marginBottom: '8px' }}>
                        <InputLabel id="input-label-id-choose-pod">Choose Pod</InputLabel>
                        <Select
                            labelId="select-label-id-choose-pod"
                            id="select-id-choose-pod"
                            value={selectedPodId}
                            label="Choose Pod"
                            onChange={(event: any) => {
                                const selectedPodId = event.target.value;
                                setSelectedPodId(selectedPodId);
                                setTasksInSelectedPod(getTasks(MOCK_TASKS, selectedPodId));
                            }}
                        >
                            {MOCK_PODS.sort((pod: any) => pod.name).map((pod: any) => (
                                <MenuItem key={pod.id} value={pod.id}>
                                    {pod.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box
                        sx={{
                            border: `1px solid`,
                            borderColor: THEME.palette.grey.A400,
                            borderRadius: '4px',
                            height: '200px',
                            overflowY: 'auto',
                            marginBottom: '8px',
                        }}
                    >
                        {tasksInSelectedPod.length > 0 ? (
                            <List sx={{ bgcolor: 'background.paper' }}>
                                {tasksInSelectedPod.map((task: any, idx: number) => {
                                    const { id: taskId, name: taskName } = task;
                                    const labelId = `checkbox-list-label-${String(taskId)}`;
                                    return (
                                        <ListItem key={taskId} disablePadding>
                                            <ListItemButton
                                                role={undefined}
                                                onClick={() => {
                                                    setStampTaskIds((prevStampTaskIds) => {
                                                        if (prevStampTaskIds.has(taskId)) {
                                                            prevStampTaskIds.delete(taskId);
                                                        } else {
                                                            prevStampTaskIds.add(taskId);
                                                        }
                                                        // create new to refresh state
                                                        const currStampTaskIds = new Set();
                                                        prevStampTaskIds.forEach((prevTaskId) => {
                                                            currStampTaskIds.add(prevTaskId);
                                                        });
                                                        return currStampTaskIds;
                                                    });
                                                }}
                                                dense
                                            >
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={stampTaskIds.has(taskId)}
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
                        ) : (
                            <Alert severity="info">No Tasks for chosen Pod</Alert>
                        )}
                    </Box>
                    {tasksInSelectedPod.size > 0 ? (
                        <Alert severity="info">{tasksInSelectedPod.size} Tasks selected</Alert>
                    ) : (
                        <Alert severity="info">Please select at least 1 Task</Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} disabled={isErrorCreateOrUpdateStamp}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

// https://www.npmjs.com/package/react-avatar-editor
export default CreateStampModal;
