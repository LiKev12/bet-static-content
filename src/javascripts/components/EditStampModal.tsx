import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
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
    Divider,
    Radio,
    ListItemAvatar,
    Avatar,
} from '@mui/material';
import PodCardModel from 'src/javascripts/models/PodCardModel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { THEME } from 'src/javascripts/Theme';
import Constants from 'src/javascripts/Constants';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import TaskModel from 'src/javascripts/models/TaskModel';
import PlaceholderImagePod from 'src/assets/PlaceholderImagePod.png';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';
import { sliceTasksAssociatedWithStampActions } from 'src/javascripts/store/SliceTasksAssociatedWithStamp';

import type { IRootState } from 'src/javascripts/store';
export interface IEditStampModalProps {
    idStamp: string;
    handleClose: any;
}

export interface IEditStampModalState {
    data: {
        selectedTaskIds: Set<string>;
    };
    selectedPodId: string | null;
    filterPodText: string;
    filterTaskText: string;
    response: {
        state: string;
        errorMessage: string | null;
    };
}

export interface IPodCardState {
    data: PodCardModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
}

export interface ITaskState {
    data: TaskModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const getPodCardsFilteredByName = (filterTextRaw: string, podCards: PodCardModel[]): PodCardModel[] => {
    const filterText = filterTextRaw.trim().toLowerCase();
    return podCards.filter((podCard: PodCardModel) => {
        return podCard.getName().toLowerCase().includes(filterText);
    });
};

const getTasksFilteredByName = (filterTextRaw: string, tasks: TaskModel[]): TaskModel[] => {
    const filterText = filterTextRaw.trim().toLowerCase();
    return tasks.filter((task: TaskModel) => {
        return task.getName().toLowerCase().includes(filterText);
    });
};

const EditStampModal: React.FC<IEditStampModalProps> = (props: IEditStampModalProps) => {
    const { idStamp, handleClose } = props;
    const dispatch = useDispatch();
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);

    const [editStampModalState, setEditStampModalState] = useState<IEditStampModalState>({
        data: {
            selectedTaskIds: new Set(),
        },
        selectedPodId: null,
        filterPodText: '',
        filterTaskText: '',
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    });

    const [podCardState, setPodCardState] = useState<IPodCardState>({
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_LOADING,
            errorMessage: null,
        },
    });

    const [taskState, setTaskState] = useState<ITaskState>({
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_SUCCESS,
            errorMessage: null,
        },
    });

    const handleGetPodCardsAssociatedWithUser = async (): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetPodCardsAssociatedWithUser',
                {
                    id: sliceAuthenticationStateData.getIdUser(),
                    filterNameOrDescription: '',
                    filterIsPublic: true,
                    filterIsNotPublic: true,
                    filterIsMember: true,
                    filterIsNotMember: true,
                    filterIsModerator: true,
                    filterIsNotModerator: true,
                },
                sliceAuthenticationStateData.getJwtToken(),
            );
            setPodCardState((prevState: IPodCardState) => {
                return {
                    ...prevState,
                    data: response.data.map((datapoint: any) => {
                        return new PodCardModel(datapoint);
                    }),
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_SUCCESS,
                        errorMessage: null,
                    },
                };
            });
        } catch (e: any) {
            setPodCardState((prevState: IPodCardState) => {
                return {
                    ...prevState,
                    data: [],
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_ERROR,
                        errorMessage: e?.response?.data?.message,
                    },
                };
            });
        }
    };

    const handleGetTasksAssociatedWithPod = async (): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetTasksAssociatedWithPod',
                {
                    id: editStampModalState.selectedPodId,
                    filterNameOrDescription: '',
                    filterIsComplete: true,
                    filterIsNotComplete: true,
                    filterIsStar: true,
                    filterIsNotStar: true,
                    filterIsPin: true,
                    filterIsNotPin: true,
                },
                sliceAuthenticationStateData.getJwtToken(),
            );
            setTaskState((prevState: ITaskState) => {
                return {
                    ...prevState,
                    data: response.data.map((datapoint: any) => {
                        return new TaskModel(datapoint);
                    }),
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_SUCCESS,
                        errorMessage: null,
                    },
                };
            });
        } catch (e: any) {
            setTaskState((prevState: ITaskState) => {
                return {
                    ...prevState,
                    data: [],
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_ERROR,
                        errorMessage: e?.response?.data?.message,
                    },
                };
            });
        }
    };

    const handleGetTasksAssociatedWithStamp = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetTasksAssociatedWithStamp',
                requestBodyObject,
                sliceAuthenticationStateData.getJwtToken(),
            );
            console.log({ response });
            setEditStampModalState((prevState) => {
                return {
                    ...prevState,
                    data: {
                        selectedTaskIds: new Set(
                            response.data.map((datapoint: any) => {
                                return new TaskModel(datapoint).getId();
                            }),
                        ),
                    },
                };
            });
        } catch (e: any) {
            setEditStampModalState((prevState) => {
                return {
                    ...prevState,
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_ERROR,
                        errorMessage: e?.response?.data?.message,
                    },
                };
            });
        }
    };
    useEffect(() => {
        void handleGetPodCardsAssociatedWithUser();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        void handleGetTasksAssociatedWithStamp({
            id: idStamp,
            filterNameOrDescription: '',
            filterIsComplete: true,
            filterIsNotComplete: true,
            filterIsStar: true,
            filterIsNotStar: true,
            filterIsPin: true,
            filterIsNotPin: true,
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (editStampModalState.selectedPodId === null) {
            setTaskState((prevState: ITaskState) => {
                return {
                    ...prevState,
                    data: [],
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_SUCCESS,
                        errorMessage: null,
                    },
                };
            });
        } else {
            setTaskState((prevState: ITaskState) => {
                return {
                    ...prevState,
                    data: [],
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_LOADING,
                        errorMessage: null,
                    },
                };
            });
            void handleGetTasksAssociatedWithPod();
        }
        // eslint-disable-next-line
    }, [editStampModalState.selectedPodId]);

    const debouncedHandleChangeFilterPodText = _.debounce((event: React.ChangeEvent<HTMLInputElement>): void => {
        setEditStampModalState((prevState: IEditStampModalState) => {
            return {
                ...prevState,
                filterPodText: event.target.value,
            };
        });
    }, 500);
    const debouncedHandleChangeFilterTaskText = _.debounce((event: React.ChangeEvent<HTMLInputElement>): void => {
        setEditStampModalState((prevState: IEditStampModalState) => {
            return {
                ...prevState,
                filterTaskText: event.target.value,
            };
        });
    }, 500);

    const podCardsFilteredByName: PodCardModel[] = getPodCardsFilteredByName(
        editStampModalState.filterPodText,
        podCardState.data,
    );

    const tasksFilteredByName: TaskModel[] = getTasksFilteredByName(editStampModalState.filterTaskText, taskState.data);

    const isErrorCreateStamp = editStampModalState.data.selectedTaskIds.size === 0;

    return (
        <React.Fragment>
            <Dialog open={true} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>Edit Stamp</DialogTitle>
                <DialogContent>
                    <Grid container direction="row">
                        <Grid item sx={{ width: '400px' }}>
                            <Grid container direction="row">
                                <Grid item>
                                    <DialogContentText sx={{ marginBottom: '12px' }}>
                                        {`Select Pod to choose Tasks from:`}
                                    </DialogContentText>
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        title={
                                            <React.Fragment>
                                                You may include tasks from multiple Pods. However, Stamps with Tasks
                                                from multiple Pods have limited discoverability.
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
                            <Box sx={{ marginBottom: '12px' }}>
                                <TextField
                                    id="filter-pod-text-field-id"
                                    label="Filter Pods by name"
                                    placeholder="Filter Pods by name"
                                    variant="outlined"
                                    fullWidth
                                    onChange={debouncedHandleChangeFilterPodText}
                                />
                            </Box>
                            <Box
                                sx={{
                                    border: `1px solid`,
                                    borderColor: THEME.palette.grey.A400,
                                    borderRadius: '4px',
                                    height: '340px',
                                    overflowY: 'auto',
                                    marginBottom: '12px',
                                }}
                            >
                                {podCardState.response.state === Constants.RESPONSE_STATE_LOADING ? (
                                    <Box
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            verticalAlign: 'middle',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <List dense={false}>
                                        {podCardsFilteredByName.map((podCard: PodCardModel, idx: number) => {
                                            return (
                                                <React.Fragment key={`${idx}_${String(podCard.getId())}`}>
                                                    <ListItem disablePadding>
                                                        <ListItemButton
                                                            onClick={() => {
                                                                setEditStampModalState(
                                                                    (prevState: IEditStampModalState) => {
                                                                        return {
                                                                            ...prevState,
                                                                            selectedPodId: podCard.getId(),
                                                                        };
                                                                    },
                                                                );
                                                            }}
                                                        >
                                                            <ListItemIcon>
                                                                <Radio
                                                                    edge="start"
                                                                    checked={
                                                                        editStampModalState.selectedPodId ===
                                                                        podCard.getId()
                                                                    }
                                                                    disableRipple
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemAvatar>
                                                                <Avatar
                                                                    sx={{
                                                                        border: `2px solid ${String(
                                                                            THEME.palette.other.formBorderColor,
                                                                        )}`,
                                                                    }}
                                                                    alt={podCard.getName()}
                                                                    src={podCard.getImageLink() ?? PlaceholderImagePod}
                                                                />
                                                            </ListItemAvatar>
                                                            <ListItemText primary={podCard.getName()} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <Divider variant="fullWidth" />
                                                </React.Fragment>
                                            );
                                        })}
                                    </List>
                                )}
                            </Box>
                        </Grid>
                        <Divider orientation="vertical" flexItem sx={{ marginLeft: '16px', marginRight: '16px' }} />
                        <Grid item sx={{ width: '400px' }}>
                            <Grid container direction="row">
                                <Grid item>
                                    <DialogContentText sx={{ marginBottom: '12px' }}>
                                        {`Select Tasks to include (max 1000):`}
                                    </DialogContentText>
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        title={
                                            <React.Fragment>
                                                At least 1 Task required, can modify after creation
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
                            <Box sx={{ marginBottom: '12px' }}>
                                <TextField
                                    id="filter-task-text-field-id"
                                    label="Filter Tasks by name"
                                    placeholder="Filter Tasks by name"
                                    fullWidth
                                    variant="outlined"
                                    onChange={debouncedHandleChangeFilterTaskText}
                                />
                            </Box>
                            <Box
                                sx={{
                                    border: `1px solid`,
                                    borderColor: THEME.palette.grey.A400,
                                    borderRadius: '4px',
                                    height: '340px',
                                    overflowY: 'auto',
                                    marginBottom: '8px',
                                }}
                            >
                                {taskState.response.state === Constants.RESPONSE_STATE_LOADING ? (
                                    <Box
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            verticalAlign: 'middle',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CircularProgress />
                                    </Box>
                                ) : editStampModalState.selectedPodId === null ? (
                                    <Alert severity="warning">Please select a Pod to choose Tasks from</Alert>
                                ) : tasksFilteredByName.length > 0 ? (
                                    <List dense={false}>
                                        {tasksFilteredByName.map((task: TaskModel, idx: number) => {
                                            return (
                                                <React.Fragment key={`${idx}_${String(task.getId())}`}>
                                                    <ListItem
                                                        key={`checkbox-key-${String(task.getId())}`}
                                                        disablePadding
                                                    >
                                                        <ListItemButton
                                                            onClick={() => {
                                                                setEditStampModalState(
                                                                    (prevState: IEditStampModalState) => {
                                                                        const selectedTaskIds =
                                                                            prevState.data.selectedTaskIds;
                                                                        if (selectedTaskIds.has(task.getId())) {
                                                                            selectedTaskIds.delete(task.getId());
                                                                        } else {
                                                                            selectedTaskIds.add(task.getId());
                                                                        }
                                                                        return {
                                                                            ...prevState,
                                                                            data: {
                                                                                ...prevState.data,
                                                                                selectedTaskIds,
                                                                            },
                                                                        };
                                                                    },
                                                                );
                                                            }}
                                                        >
                                                            <ListItemIcon>
                                                                <Checkbox
                                                                    edge="start"
                                                                    checked={editStampModalState.data.selectedTaskIds.has(
                                                                        task.getId(),
                                                                    )}
                                                                    disableRipple
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText primary={task.getName()} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <Divider variant="fullWidth" />
                                                </React.Fragment>
                                            );
                                        })}
                                    </List>
                                ) : (
                                    <Alert severity="warning">No Tasks found for selected Pod</Alert>
                                )}
                            </Box>
                            <Alert severity="info">
                                {editStampModalState.data.selectedTaskIds.size} Tasks selected
                            </Alert>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">
                        Cancel
                    </Button>
                    <Button
                        /* eslint-disable @typescript-eslint/no-misused-promises */
                        onClick={async () => {
                            try {
                                setEditStampModalState((prevState: any) => {
                                    return {
                                        ...prevState,
                                        response: {
                                            ...prevState.response,
                                            state: Constants.RESPONSE_STATE_LOADING,
                                        },
                                    };
                                });
                                await ResourceClient.postResource(
                                    'api/app/UpdateStamp',
                                    {
                                        id: idStamp,
                                        idTasks: Array.from(editStampModalState.data.selectedTaskIds),
                                    },
                                    sliceAuthenticationStateData.getJwtToken(),
                                );
                                setEditStampModalState((prevState: any) => {
                                    return {
                                        ...prevState,
                                        response: {
                                            state: Constants.RESPONSE_STATE_SUCCESS,
                                            errorMessage: null,
                                        },
                                    };
                                });
                                try {
                                    dispatch(sliceTasksAssociatedWithStampActions.setStateResponseLoading());
                                    const response = await ResourceClient.postResource(
                                        'api/app/GetTasksAssociatedWithStamp',
                                        {
                                            id: idStamp,
                                            filterNameOrDescription: '',
                                            filterIsComplete: true,
                                            filterIsNotComplete: true,
                                            filterIsStar: true,
                                            filterIsNotStar: true,
                                            filterIsPin: true,
                                            filterIsNotPin: true,
                                        },
                                        sliceAuthenticationStateData.getJwtToken(),
                                    );
                                    dispatch(sliceTasksAssociatedWithStampActions.setStateData(response.data));
                                } catch (e: any) {
                                    dispatch(
                                        sliceTasksAssociatedWithStampActions.setStateResponseError(
                                            e?.response?.data?.message,
                                        ),
                                    );
                                }
                                handleClose();
                            } catch (e: any) {
                                setEditStampModalState((prevState: any) => {
                                    return {
                                        ...prevState,
                                        response: {
                                            state: Constants.RESPONSE_STATE_ERROR,
                                            errorMessage: e?.response?.data?.message,
                                        },
                                    };
                                });
                            }
                        }}
                        disabled={isErrorCreateStamp}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            {/* {createStampModalState.response.state === Constants.RESPONSE_STATE_SUCCESS ? (
                <Alert severity="success">
                    {'Stamp successfully created. Click '}
                    <Link to={`/stamps/${String(createStampModalState.data.id)}`}>{'here'}</Link>
                    {' to view.'}
                </Alert>
            ) : null} */}
        </React.Fragment>
    );
};

// https://www.npmjs.com/package/react-avatar-editor
export default EditStampModal;
