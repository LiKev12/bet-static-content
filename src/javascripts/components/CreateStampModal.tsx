import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import { getInputText } from 'src/javascripts/utilities';
import TaskModel from 'src/javascripts/models/TaskModel';
import PlaceholderImagePod from 'src/assets/PlaceholderImagePod.png';
import { Link } from 'react-router-dom';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';

import type { IRootState } from 'src/javascripts/store';

export interface ICreateStampModalProps {
    idPod: string | null;
    handleClose: any;
    sideEffect: any;
}

export interface ICreateStampModalState {
    data: {
        id: string | null;
        name: string;
        description: string;
        selectedTaskIds: Set<string>;
    };
    isBlurredInputName: boolean;
    isBlurredInputDescription: boolean;
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

const CreateStampModal: React.FC<ICreateStampModalProps> = (props: ICreateStampModalProps) => {
    const { idPod, handleClose, sideEffect } = props;
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    const [createStampModalState, setCreateStampModalState] = useState<ICreateStampModalState>({
        data: {
            id: null,
            name: '',
            description: '',
            selectedTaskIds: new Set(),
        },
        isBlurredInputName: false,
        isBlurredInputDescription: false,
        selectedPodId: idPod,
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
            state: idPod !== null ? Constants.RESPONSE_STATE_LOADING : Constants.RESPONSE_STATE_SUCCESS,
            errorMessage: null,
        },
    });

    const handleGetPodCardsAssociatedWithUser = async (): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetPodCardsAssociatedWithUser',
                {
                    id: sliceAuthenticationStateData.getIdUser(),
                    filterByName: createStampModalState.filterPodText,
                    filterIsPublic: true,
                    filterIsNotPublic: true,
                    filterIsMember: true,
                    filterIsNotMember: true,
                    filterIsModerator: true,
                    filterIsNotModerator: true,
                    paginationIdxStart: 0,
                    paginationN: Constants.NUMBER_OF_PODS_DISPLAYED_IN_STAMP_MODAL,
                },
                sliceAuthenticationStateData.getJwtToken(),
            );

            setPodCardState((prevState: IPodCardState) => {
                return {
                    ...prevState,
                    data: response.data.data.map((datapoint: any) => {
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
                    id: createStampModalState.selectedPodId,
                    filterByName: createStampModalState.filterTaskText,
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
    useEffect(() => {
        void handleGetPodCardsAssociatedWithUser();
        // eslint-disable-next-line
    }, [createStampModalState.filterPodText]);

    useEffect(() => {
        if (createStampModalState.selectedPodId === null) {
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
    }, [createStampModalState.selectedPodId]);

    const debouncedHandleChangeFilterPodText = _.debounce((event: React.ChangeEvent<HTMLInputElement>): void => {
        setCreateStampModalState((prevState: ICreateStampModalState) => {
            return {
                ...prevState,
                filterPodText: event.target.value,
            };
        });
    }, 500);
    const debouncedHandleChangeFilterTaskText = _.debounce((event: React.ChangeEvent<HTMLInputElement>): void => {
        setCreateStampModalState((prevState: ICreateStampModalState) => {
            return {
                ...prevState,
                filterTaskText: event.target.value,
            };
        });
    }, 500);

    const podCardsFilteredByName: PodCardModel[] = getPodCardsFilteredByName(
        createStampModalState.filterPodText,
        podCardState.data,
    );

    const tasksFilteredByName: TaskModel[] = getTasksFilteredByName(
        createStampModalState.filterTaskText,
        taskState.data,
    );

    const isErrorStampName =
        getInputText(createStampModalState.data.name).length < Constants.STAMP_NAME_MIN_LENGTH_CHARACTERS ||
        getInputText(createStampModalState.data.name).length > Constants.STAMP_NAME_MAX_LENGTH_CHARACTERS;
    const isErrorStampDescription =
        getInputText(createStampModalState.data.description).length > Constants.STAMP_DESCRIPTION_MAX_LENGTH_CHARACTERS;
    const isErrorCreateStamp =
        isErrorStampName || isErrorStampDescription || createStampModalState.data.selectedTaskIds.size === 0;

    return (
        <React.Fragment>
            <Dialog open={true} onClose={handleClose} fullWidth maxWidth="xl">
                <DialogTitle>Create a Stamp</DialogTitle>
                <DialogContent>
                    <Grid container direction="row">
                        <Grid item sx={{ width: '400px' }}>
                            <Grid container direction="row">
                                <Grid item>
                                    <DialogContentText sx={{ marginBottom: '12px' }}>
                                        {`Enter name of Stamp:`}
                                    </DialogContentText>
                                </Grid>
                                <Grid item>
                                    <Tooltip title={'Required, can modify after creation'} placement="right">
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
                                label="Name"
                                sx={{ width: '100%', marginBottom: '12px' }}
                                value={createStampModalState.data.name}
                                required
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setCreateStampModalState((prevState: any) => {
                                        return {
                                            ...prevState,
                                            data: {
                                                ...prevState.data,
                                                name: event.target.value,
                                            },
                                            response: {
                                                ...prevState.response,
                                                state: Constants.RESPONSE_STATE_UNSTARTED,
                                                errorMessage: null,
                                            },
                                        };
                                    });
                                }}
                                onBlur={() => {
                                    setCreateStampModalState((prevState: any) => {
                                        return {
                                            ...prevState,
                                            isBlurredInputName: true,
                                        };
                                    });
                                }}
                                error={isErrorStampName && createStampModalState.isBlurredInputName}
                                helperText={Constants.STAMP_INPUT_NAME_HELPER_TEXT(
                                    getInputText(createStampModalState.data.name).length,
                                )}
                            />
                            <Grid container direction="row">
                                <Grid item>
                                    <DialogContentText sx={{ marginBottom: '12px' }}>
                                        {`Enter description of Stamp:`}
                                    </DialogContentText>
                                </Grid>
                                <Grid item>
                                    <Tooltip title={'Not required, can modify after creation'} placement="right">
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
                                label="Description"
                                multiline
                                minRows={10}
                                maxRows={10}
                                sx={{ width: '100%', marginBottom: '12px' }}
                                value={createStampModalState.data.description}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setCreateStampModalState((prevState: any) => {
                                        return {
                                            ...prevState,
                                            data: {
                                                ...prevState.data,
                                                description: event.target.value,
                                            },
                                        };
                                    });
                                }}
                                onBlur={() => {
                                    setCreateStampModalState((prevState: any) => {
                                        return {
                                            ...prevState,
                                            isBlurredInputDescription: true,
                                        };
                                    });
                                }}
                                error={isErrorStampDescription && createStampModalState.isBlurredInputDescription}
                                helperText={Constants.STAMP_INPUT_DESCRIPTION_HELPER_TEXT(
                                    getInputText(createStampModalState.data.description).length,
                                )}
                            />
                            {createStampModalState.response.state === Constants.RESPONSE_STATE_SUCCESS ? (
                                <Alert severity="success">
                                    {'Stamp successfully created. Click '}
                                    <Link to={`/stamps/${String(createStampModalState.data.id)}`}>{'here'}</Link>
                                    {' to view.'}
                                </Alert>
                            ) : null}
                            {createStampModalState.response.state === Constants.RESPONSE_STATE_ERROR ? (
                                <Alert severity="error">
                                    {Constants.RESPONSE_GET_ERROR_MESSAGE(createStampModalState.response.errorMessage)}
                                </Alert>
                            ) : null}
                        </Grid>
                        <Divider orientation="vertical" flexItem sx={{ marginLeft: '16px', marginRight: '16px' }} />
                        <Grid sx={{ width: '400px' }}>
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
                                                {/* <br />
                                        <br />
                                        Specifically, such Stamps may only be discovered by users who have access to all
                                        of the Pods associated with the Stamp. Access for a private Pod is defined as
                                        being a member of the private Pod. All users have access to public Pods. */}
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
                                                                setCreateStampModalState(
                                                                    (prevState: ICreateStampModalState) => {
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
                                                                        createStampModalState.selectedPodId ===
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
                                ) : createStampModalState.selectedPodId === null ? (
                                    <Alert severity="warning">Please select a Pod to choose Tasks from</Alert>
                                ) : tasksFilteredByName.length > 0 ? (
                                    <List dense={false}>
                                        {tasksFilteredByName.map((task: TaskModel, idx: number) => {
                                            const isReachedNumberOfTasksLimit =
                                                createStampModalState.data.selectedTaskIds.size >=
                                                Constants.LIMIT_NUMBER_OF_TOTAL_TASKS_STAMP;
                                            const isTaskSelected = createStampModalState.data.selectedTaskIds.has(
                                                task.getId(),
                                            );
                                            return (
                                                <React.Fragment key={`${idx}_${String(task.getId())}`}>
                                                    <ListItem
                                                        key={`checkbox-key-${String(task.getId())}`}
                                                        disablePadding
                                                    >
                                                        <ListItemButton
                                                            onClick={() => {
                                                                setCreateStampModalState(
                                                                    (prevState: ICreateStampModalState) => {
                                                                        const selectedTaskIds =
                                                                            prevState.data.selectedTaskIds;
                                                                        if (selectedTaskIds.has(task.getId())) {
                                                                            selectedTaskIds.delete(task.getId());
                                                                        } else {
                                                                            if (!isReachedNumberOfTasksLimit) {
                                                                                selectedTaskIds.add(task.getId());
                                                                            }
                                                                        }
                                                                        return {
                                                                            ...prevState,
                                                                            data: {
                                                                                ...prevState.data,
                                                                                selectedTaskIds,
                                                                            },
                                                                            response: {
                                                                                ...prevState.response,
                                                                                state: Constants.RESPONSE_STATE_UNSTARTED,
                                                                                errorMessage: null,
                                                                            },
                                                                        };
                                                                    },
                                                                );
                                                            }}
                                                        >
                                                            <ListItemIcon>
                                                                <Checkbox
                                                                    edge="start"
                                                                    checked={isTaskSelected}
                                                                    disableRipple
                                                                    disabled={
                                                                        isReachedNumberOfTasksLimit && !isTaskSelected
                                                                    }
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
                                {createStampModalState.data.selectedTaskIds.size} Tasks selected
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
                                const response = await ResourceClient.postResource(
                                    'api/app/CreateStamp',
                                    {
                                        name: getInputText(createStampModalState.data.name),
                                        idTasks: Array.from(createStampModalState.data.selectedTaskIds),
                                        ...(getInputText(createStampModalState.data.description).length === 0
                                            ? {}
                                            : { description: getInputText(createStampModalState.data.description) }),
                                    },
                                    sliceAuthenticationStateData.getJwtToken(),
                                );
                                setCreateStampModalState((prevState: any) => {
                                    return {
                                        ...prevState,
                                        data: {
                                            ...prevState.data,
                                            id: response.data.id,
                                        },
                                        response: {
                                            state: Constants.RESPONSE_STATE_SUCCESS,
                                            errorMessage: null,
                                        },
                                    };
                                });
                                sideEffect();
                            } catch (e: any) {
                                setCreateStampModalState((prevState: any) => {
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
                        disabled={
                            isErrorCreateStamp ||
                            createStampModalState.response.state === Constants.RESPONSE_STATE_SUCCESS ||
                            createStampModalState.response.state === Constants.RESPONSE_STATE_ERROR
                        }
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

// https://www.npmjs.com/package/react-avatar-editor
export default CreateStampModal;
