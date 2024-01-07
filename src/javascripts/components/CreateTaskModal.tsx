import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Grid,
    TextField,
    Tooltip,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MOCK_MY_USER_ID } from 'src/javascripts/mocks/Mocks';

import Constants from 'src/javascripts/Constants';
import { getInputText, getInputInteger } from 'src/javascripts/utilities';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import type { Dayjs } from 'dayjs';
export interface ICreateTaskModalProps {
    idPod: string | null;
}

export interface ICreateTaskModalState {
    data: {
        name: {
            value: string;
            isBlurredInput: boolean;
        };
        numberOfPoints: {
            value: number;
        };
        description: {
            value: string;
            isBlurredInput: boolean;
        };
        datetimeTarget: {
            value: Dayjs | null;
        };
    };
    isModalOpen: boolean;
    response: {
        isLoading: boolean;
        isSuccess: boolean;
        isError: boolean;
        errorMessage: string | null;
    };
}
const CreateTaskModal: React.FC<ICreateTaskModalProps> = (props: ICreateTaskModalProps) => {
    const { idPod } = props;
    const [createTaskModalState, setCreateTaskModalState] = useState<ICreateTaskModalState>({
        data: {
            name: {
                value: '',
                isBlurredInput: false,
            },
            numberOfPoints: {
                value: 1,
            },
            description: {
                value: '',
                isBlurredInput: false,
            },
            datetimeTarget: {
                value: null,
            },
        },
        isModalOpen: false,
        response: {
            isLoading: false,
            isSuccess: false,
            isError: false,
            errorMessage: null,
        },
    });

    const handleClickOpen = (): void => {
        setCreateTaskModalState((prevState: ICreateTaskModalState) => {
            return { ...prevState, isModalOpen: true };
        });
    };
    const handleClose = (): void => {
        setCreateTaskModalState((prevState: ICreateTaskModalState) => {
            return { ...prevState, isModalOpen: false };
        });
    };

    const isErrorTaskName =
        getInputText(createTaskModalState.data.name.value).length < Constants.TASK_NAME_MIN_LENGTH_CHARACTERS ||
        getInputText(createTaskModalState.data.name.value).length > Constants.TASK_NAME_MAX_LENGTH_CHARACTERS;
    const isErrorTaskNumberOfPoints =
        getInputInteger(String(createTaskModalState.data.numberOfPoints.value)) < Constants.TASK_NUMBER_OF_POINTS_MIN ||
        getInputInteger(String(createTaskModalState.data.numberOfPoints.value)) > Constants.TASK_NUMBER_OF_POINTS_MAX;
    const isErrorTaskDescription =
        getInputText(createTaskModalState.data.description.value).length >
        Constants.TASK_DESCRIPTION_MAX_LENGTH_CHARACTERS;
    return (
        <React.Fragment>
            <Button variant="contained" sx={{ width: '100%' }} onClick={handleClickOpen}>
                Create New Task
            </Button>
            <Dialog open={createTaskModalState.isModalOpen} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Create New Task</DialogTitle>
                <DialogContent>
                    <Grid container direction="row">
                        <Grid item>
                            <DialogContentText
                                sx={{ marginBottom: '12px' }}
                            >{`Enter name (required):`}</DialogContentText>
                        </Grid>
                        <Grid item>
                            <Tooltip title={'cannot modify after creation'} placement="right">
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
                        id="create-task-enter-name"
                        required
                        label="name"
                        sx={{ width: '100%', marginBottom: '24px' }}
                        value={createTaskModalState.data.name.value}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setCreateTaskModalState((prevState: ICreateTaskModalState) => {
                                return {
                                    ...prevState,
                                    data: {
                                        ...prevState.data,
                                        name: {
                                            ...prevState.data.name,
                                            value: event.target.value,
                                            isError:
                                                getInputText(event.target.value).length <
                                                    Constants.TASK_NAME_MIN_LENGTH_CHARACTERS ||
                                                getInputText(event.target.value).length >
                                                    Constants.TASK_NAME_MAX_LENGTH_CHARACTERS,
                                        },
                                    },
                                };
                            });
                        }}
                        onBlur={() => {
                            setCreateTaskModalState((prevState: ICreateTaskModalState) => {
                                return {
                                    ...prevState,
                                    data: { ...prevState.data, name: { ...prevState.data.name, isBlurredInput: true } },
                                };
                            });
                        }}
                        error={isErrorTaskName && createTaskModalState.data.name.isBlurredInput}
                        helperText={Constants.TASK_INPUT_NAME_HELPER_TEXT(
                            getInputText(createTaskModalState.data.name.value).length,
                        )}
                    />
                    <Grid container direction="row">
                        <Grid item>
                            <DialogContentText
                                sx={{ marginBottom: '12px' }}
                            >{`Enter number of points earned for Task completion (required):`}</DialogContentText>
                        </Grid>
                        <Grid item>
                            <Tooltip title={'can modify after creation'} placement="right">
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
                        id="create-task-num-points"
                        label="Points"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ marginBottom: '24px' }}
                        value={createTaskModalState.data.numberOfPoints.value}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setCreateTaskModalState((prevState: ICreateTaskModalState) => {
                                return {
                                    ...prevState,
                                    data: {
                                        ...prevState.data,
                                        numberOfPoints: {
                                            ...prevState.data.numberOfPoints,
                                            value: getInputInteger(event.target.value),
                                        },
                                    },
                                };
                            });
                        }}
                        error={isErrorTaskNumberOfPoints}
                        helperText={Constants.INPUT_NUMBER_OF_POINTS_HELPER_TEXT}
                    />
                    <Grid container direction="row">
                        <Grid item>
                            <DialogContentText
                                sx={{ marginBottom: '12px' }}
                            >{`Enter description (optional):`}</DialogContentText>
                        </Grid>
                        <Grid item>
                            <Tooltip title={'can modify after creation'} placement="right">
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
                        id="create-task-enter-description"
                        label="description"
                        multiline
                        minRows={4}
                        maxRows={4}
                        sx={{ width: '100%', marginBottom: '24px' }}
                        value={createTaskModalState.data.description.value}
                        error={isErrorTaskDescription && createTaskModalState.data.description.isBlurredInput}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setCreateTaskModalState((prevState: ICreateTaskModalState) => {
                                return {
                                    ...prevState,
                                    data: {
                                        ...prevState.data,
                                        description: {
                                            ...prevState.data.description,
                                            value: event.target.value,
                                        },
                                    },
                                };
                            });
                        }}
                        onBlur={() => {
                            setCreateTaskModalState((prevState: ICreateTaskModalState) => {
                                return {
                                    ...prevState,
                                    data: {
                                        ...prevState.data,
                                        description: { ...prevState.data.description, isBlurredInput: true },
                                    },
                                };
                            });
                        }}
                        helperText={Constants.TASK_INPUT_DESCRIPTION_HELPER_TEXT(
                            getInputText(createTaskModalState.data.description.value).length,
                        )}
                    />
                    <Grid container direction="row">
                        <Grid item>
                            <DialogContentText
                                sx={{ marginBottom: '12px' }}
                            >{`Enter target date for Task completion (optional):`}</DialogContentText>
                        </Grid>
                        <Grid item>
                            <Tooltip title={'can modify after creation'} placement="right">
                                <InfoOutlinedIcon
                                    sx={{
                                        paddingLeft: '4px',
                                    }}
                                    fontSize="small"
                                />
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Box sx={{ marginBottom: '24px' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={createTaskModalState.data.datetimeTarget.value}
                                onChange={(newValue) => {
                                    setCreateTaskModalState((prevState: ICreateTaskModalState) => {
                                        return {
                                            ...prevState,
                                            data: {
                                                ...prevState.data,
                                                datetimeTarget: {
                                                    ...prevState.data.datetimeTarget,
                                                    value: newValue,
                                                },
                                            },
                                        };
                                    });
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                    {createTaskModalState.response.isSuccess ? (
                        <Alert severity="success">Task successfully created</Alert>
                    ) : null}
                    {createTaskModalState.response.isError ? (
                        <Alert severity="error">{createTaskModalState.response.errorMessage}</Alert>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setCreateTaskModalState((prevState: ICreateTaskModalState) => {
                                return {
                                    ...prevState,
                                    response: {
                                        ...prevState.response,
                                        isLoading: true,
                                    },
                                };
                            });
                            ResourceClient.postResource(
                                'api/task/create/task',
                                { idUser: MOCK_MY_USER_ID },
                                {
                                    name: getInputText(createTaskModalState.data.name.value),
                                    numberOfPoints: getInputInteger(
                                        String(createTaskModalState.data.numberOfPoints.value),
                                    ),
                                    ...(createTaskModalState.data.description.value.length > 0
                                        ? { description: getInputText(createTaskModalState.data.description.value) }
                                        : {}),
                                    ...(createTaskModalState.data.datetimeTarget.value !== null
                                        ? { timestampTarget: createTaskModalState.data.datetimeTarget.value.unix() }
                                        : {}),
                                    ...(idPod !== null ? { idPod } : {}),
                                },
                            )
                                .then(() => {
                                    setCreateTaskModalState((prevState: ICreateTaskModalState) => {
                                        return {
                                            ...prevState,
                                            response: {
                                                isLoading: false,
                                                isSuccess: true,
                                                isError: false,
                                                errorMessage: null,
                                            },
                                            data: {
                                                name: {
                                                    value: '',
                                                    isBlurredInput: false,
                                                },
                                                numberOfPoints: {
                                                    value: 1,
                                                },
                                                datetimeTarget: {
                                                    value: null,
                                                },
                                                description: {
                                                    value: '',
                                                    isBlurredInput: false,
                                                },
                                            },
                                        };
                                    });
                                })
                                .catch((errorMessage: any) => {
                                    setCreateTaskModalState((prevState: ICreateTaskModalState) => {
                                        return {
                                            ...prevState,
                                            response: {
                                                isLoading: false,
                                                isSuccess: false,
                                                isError: true,
                                                errorMessage,
                                            },
                                        };
                                    });
                                });
                        }}
                        disabled={isErrorTaskName || isErrorTaskNumberOfPoints || isErrorTaskDescription}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default CreateTaskModal;
