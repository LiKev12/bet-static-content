import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Divider,
    Grid,
    IconButton,
    TextField,
    Typography,
    Tooltip,
} from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { THEME } from 'src/javascripts/Theme';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import UserListButton from 'src/javascripts/components/UserListButton';
import TaskCommentList from 'src/javascripts/components/TaskCommentList';
import { getInputText, getInputInteger, getUserListButtonText } from 'src/javascripts/utilities';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Constants from 'src/javascripts/Constants';
import type { Dayjs } from 'dayjs';
import TaskModel from 'src/javascripts/models/TaskModel';
import TaskCommentModel from 'src/javascripts/models/TaskCommentModel';
import ReactionsModel from 'src/javascripts/models/ReactionsModel';
import UserBubbleReactionListModalButton from 'src/javascripts/components/UserBubbleReactionListModalButton';
import ReactionSelector from 'src/javascripts/components/ReactionSelector';
import PlaceholderImagePod from 'src/assets/PlaceholderImagePod.png';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';

import type { IRootState } from 'src/javascripts/store';

export interface ITaskCardProps {
    task: TaskModel;
    isAuthorizedToComplete: boolean;
    isReadOnlyTaskBody: boolean;
    isReadOnlyTaskNotes: boolean;
    isDisplayViewPodLink: boolean;
    isDisplayOptionsStarPinDelete: boolean;
    isAuthorizedToDelete: boolean;
    handleSideEffectToggleTaskComplete: any;
    handleSideEffectChangeNumberOfPoints: any;
}

const getDateDescription = (
    datetimeCreate: string,
    datetimeUpdate: string | null,
    datetimeTarget: string | null,
    datetimeComplete: string | null,
): string => {
    let dateDescription = `Created ${datetimeCreate}`;
    if (datetimeUpdate !== null) {
        dateDescription += ` · Updated ${datetimeUpdate}`;
    }
    if (datetimeTarget !== null) {
        dateDescription += ` · Target ${datetimeTarget}`;
    }
    if (datetimeComplete !== null) {
        dateDescription += ` · Completed ${datetimeComplete}`;
    }
    return dateDescription;
};
export interface ITaskCardState {
    isShowDetails: boolean;
    isShowDeleteTaskConfirmationModal: boolean;
    isShowPinTaskConfirmationModal: boolean;
    editMode: {
        name: {
            isEditMode: boolean;
            editModeValue: string;
        };
        description: {
            isEditMode: boolean;
            editModeValue: string;
        };
        numberOfPoints: {
            isEditMode: boolean;
            editModeValue: number;
        };
        datetimeTarget: {
            isEditMode: boolean;
            editModeValue: Dayjs | null;
        };
        noteText: {
            isEditMode: boolean;
            editModeValue: string;
        };
    };
    data: TaskModel;
}

export interface ITaskCommentsState {
    data: TaskCommentModel[];
    isShowTaskComments: boolean;
    response: {
        state: string;
        errorMessage: string | null;
    };
}

export interface ITaskReactionsState {
    data: ReactionsModel;
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const TaskCard: React.FC<ITaskCardProps> = (props: ITaskCardProps) => {
    const {
        task,
        isAuthorizedToComplete,
        isReadOnlyTaskBody,
        isReadOnlyTaskNotes,
        isDisplayViewPodLink,
        isDisplayOptionsStarPinDelete,
        isAuthorizedToDelete,
        handleSideEffectToggleTaskComplete,
        handleSideEffectChangeNumberOfPoints,
    } = props;
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    const [taskCardState, setTaskCardState] = useState<ITaskCardState>({
        isShowDetails: false,
        isShowDeleteTaskConfirmationModal: false,
        isShowPinTaskConfirmationModal: false,
        editMode: {
            name: {
                isEditMode: false,
                editModeValue: task.getName(),
            },
            description: {
                isEditMode: false,
                editModeValue: task.getDescription() ?? '',
            },
            numberOfPoints: {
                isEditMode: false,
                editModeValue: task.getNumberOfPoints(),
            },
            noteText: {
                isEditMode: false,
                editModeValue: task.getNoteText() ?? '',
            },
            datetimeTarget: {
                isEditMode: false,
                editModeValue: task.getDatetimeTarget() === null ? null : dayjs(task.getDatetimeTarget()),
            },
        },
        data: task,
    });

    const [taskReactionsState, setTaskReactionsState] = useState<ITaskReactionsState>({
        data: new ReactionsModel(null),
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    });

    const [taskCommentsState, setTaskCommentsState] = useState<ITaskCommentsState>({
        data: [],
        isShowTaskComments: false,
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    });

    const dateDescription = getDateDescription(
        taskCardState.data.getDatetimeCreate(),
        taskCardState.data.getDatetimeUpdate(),
        taskCardState.data.getDatetimeTarget(),
        taskCardState.data.getDatetimeComplete(),
    );

    const handleUpdateTask = (responseJson: any): void => {
        setTaskCardState((prevState: any) => {
            return {
                ...prevState,
                data: new TaskModel(responseJson),
            };
        });
    };

    const handleOnChangeDatetimeTarget = async (editModeValue: any): Promise<any> => {
        try {
            setTaskCardState((prevState: any) => {
                return {
                    ...prevState,
                    editMode: {
                        ...prevState.editMode,
                        datetimeTarget: {
                            ...prevState.editMode.datetimeTarget,
                            editModeValue,
                        },
                    },
                };
            });
            const response = await ResourceClient.postResource(
                'api/app/UpdateTask',
                {
                    id: task.getId(),
                    datetimeTarget:
                        editModeValue === undefined || editModeValue === null
                            ? null
                            : editModeValue.format('YYYY/MM/DD'),
                },
                sliceAuthenticationStateData.getJwtToken(),
            );
            handleUpdateTask(response.data);
            setTaskCardState((prevState: any) => {
                return {
                    ...prevState,
                    editMode: {
                        ...prevState.editMode,
                        datetimeTarget: {
                            ...prevState.editMode.datetimeTarget,
                            isEditMode: false,
                        },
                    },
                };
            });
        } catch (e: any) {}
    };

    const handleGetTaskComments = async (): Promise<any> => {
        try {
            setTaskCommentsState((prevState: ITaskCommentsState) => {
                return {
                    ...prevState,
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_LOADING,
                        errorMessage: null,
                    },
                };
            });
            const response = await ResourceClient.postResource(
                'api/app/GetTaskComments',
                {
                    id: task.getId(),
                },
                sliceAuthenticationStateData.getJwtToken(),
            );
            setTaskCommentsState((prevState: ITaskCommentsState) => {
                return {
                    ...prevState,
                    data: response.data.map((datapoint: any) => new TaskCommentModel(datapoint)),
                    isShowTaskComments: true,
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_SUCCESS,
                        errorMessage: null,
                    },
                };
            });
        } catch (e: any) {
            setTaskCommentsState((prevState: ITaskCommentsState) => {
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

    const handleGetTaskReactions = async (): Promise<any> => {
        try {
            setTaskReactionsState((prevState: ITaskReactionsState) => {
                return {
                    ...prevState,
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_LOADING,
                        errorMessage: null,
                    },
                };
            });
            const response = await ResourceClient.postResource(
                'api/app/GetTaskReactionsSample',
                { id: task.getId() },
                sliceAuthenticationStateData.getJwtToken(),
            );
            setTaskReactionsState((prevState: ITaskReactionsState) => {
                return {
                    ...prevState,
                    data: new ReactionsModel(response.data),
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_SUCCESS,
                        errorMessage: null,
                    },
                };
            });
        } catch (e: any) {
            setTaskReactionsState((prevState: ITaskReactionsState) => {
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
    const debouncedOnChangeDatetimeTarget = _.debounce(handleOnChangeDatetimeTarget, 1000);

    const isErrorEditModeValueName =
        getInputText(taskCardState.editMode.name.editModeValue).length < Constants.TASK_NAME_MIN_LENGTH_CHARACTERS ||
        getInputText(taskCardState.editMode.name.editModeValue).length > Constants.TASK_NAME_MAX_LENGTH_CHARACTERS;
    const isErrorEditModeValueDescription =
        getInputText(taskCardState.editMode.description.editModeValue).length >
        Constants.TASK_DESCRIPTION_MAX_LENGTH_CHARACTERS;
    const isErrorEditModeValueNumberOfPoints =
        getInputInteger(String(taskCardState.editMode.numberOfPoints.editModeValue)) <
            Constants.TASK_NUMBER_OF_POINTS_MIN ||
        getInputInteger(String(taskCardState.editMode.numberOfPoints.editModeValue)) >
            Constants.TASK_NUMBER_OF_POINTS_MAX;
    const isErrorEditModeValueNoteText =
        getInputText(taskCardState.editMode.noteText.editModeValue).length >
        Constants.TASK_NOTE_TEXT_MAX_LENGTH_CHARACTERS;

    return (
        <Card
            sx={{
                fontFamily: 'Raleway',
                color: THEME.palette.grey.A700,
                marginBottom: '16px',
                width: '680px',
                position: 'relative',
            }}
        >
            <CardContent>
                <Grid container direction="column">
                    <Grid item>
                        <Grid container direction="row">
                            <Grid item sx={{ paddingRight: '8px', paddingTop: '8px' }}>
                                <IconButton
                                    /* eslint-disable @typescript-eslint/no-misused-promises */
                                    onClick={async () => {
                                        try {
                                            const response = await ResourceClient.postResource(
                                                'api/app/UpdateTask',
                                                {
                                                    id: task.getId(),
                                                    isComplete: !taskCardState.data.getIsComplete(),
                                                },
                                                sliceAuthenticationStateData.getJwtToken(),
                                            );
                                            handleUpdateTask(response.data);
                                            handleSideEffectToggleTaskComplete();
                                        } catch (e: any) {}
                                    }}
                                    disabled={
                                        !isAuthorizedToComplete || !taskCardState.data.getIsMemberOfTaskPod() // disabled if either unauthorized or if not a member
                                    }
                                >
                                    {taskCardState.data.getIsComplete() ? (
                                        <CheckCircleIcon />
                                    ) : (
                                        <RadioButtonUncheckedIcon />
                                    )}
                                </IconButton>
                            </Grid>
                            <Grid item sx={{ marginRight: 'auto', width: '500px' }}>
                                <Grid container direction="column">
                                    {taskCardState.editMode.name.isEditMode ? (
                                        <Grid item>
                                            <TextField
                                                id="task-name-edit"
                                                defaultValue={taskCardState.editMode.name.editModeValue}
                                                fullWidth
                                                value={taskCardState.editMode.name.editModeValue}
                                                onBlur={async () => {
                                                    setTaskCardState((prevState: ITaskCardState) => {
                                                        return {
                                                            ...prevState,
                                                            editMode: {
                                                                ...prevState.editMode,
                                                                name: {
                                                                    ...prevState.editMode.name,
                                                                    isEditMode: false,
                                                                    ...(isErrorEditModeValueName
                                                                        ? {
                                                                              editModeValue:
                                                                                  prevState.data.name !== null
                                                                                      ? prevState.data.name
                                                                                      : '',
                                                                          }
                                                                        : {}),
                                                                },
                                                            },
                                                        };
                                                    });
                                                    if (!isErrorEditModeValueName) {
                                                        try {
                                                            const response = await ResourceClient.postResource(
                                                                'api/app/UpdateTask',
                                                                {
                                                                    id: task.getId(),
                                                                    name:
                                                                        getInputText(
                                                                            taskCardState.editMode.name.editModeValue,
                                                                        ).length === 0
                                                                            ? null
                                                                            : getInputText(
                                                                                  taskCardState.editMode.name
                                                                                      .editModeValue,
                                                                              ),
                                                                },
                                                                sliceAuthenticationStateData.getJwtToken(),
                                                            );
                                                            handleUpdateTask(response.data);
                                                        } catch (e: any) {}
                                                    }
                                                }}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setTaskCardState((prevState: any) => {
                                                        const editModeValue = event.target.value;
                                                        return {
                                                            ...prevState,
                                                            editMode: {
                                                                ...prevState.editMode,
                                                                name: {
                                                                    ...prevState.editMode.name,
                                                                    editModeValue,
                                                                },
                                                            },
                                                        };
                                                    });
                                                }}
                                                onKeyDown={async (event: React.KeyboardEvent) => {
                                                    if (event.key === 'Enter' && !event.shiftKey) {
                                                        setTaskCardState((prevState: ITaskCardState) => {
                                                            return {
                                                                ...prevState,
                                                                editMode: {
                                                                    ...prevState.editMode,
                                                                    name: {
                                                                        ...prevState.editMode.name,
                                                                        isEditMode: false,
                                                                        ...(isErrorEditModeValueName
                                                                            ? {
                                                                                  editModeValue:
                                                                                      prevState.data.name !== null
                                                                                          ? prevState.data.name
                                                                                          : '',
                                                                              }
                                                                            : {}),
                                                                    },
                                                                },
                                                            };
                                                        });
                                                        if (!isErrorEditModeValueName) {
                                                            try {
                                                                const response = await ResourceClient.postResource(
                                                                    'api/app/UpdateTask',
                                                                    {
                                                                        id: task.getId(),
                                                                        name:
                                                                            getInputText(
                                                                                taskCardState.editMode.name
                                                                                    .editModeValue,
                                                                            ).length === 0
                                                                                ? null
                                                                                : getInputText(
                                                                                      taskCardState.editMode.name
                                                                                          .editModeValue,
                                                                                  ),
                                                                    },
                                                                    sliceAuthenticationStateData.getJwtToken(),
                                                                );
                                                                handleUpdateTask(response.data);
                                                            } catch (e: any) {}
                                                        }
                                                    }
                                                }}
                                                helperText={Constants.TASK_INPUT_NAME_HELPER_TEXT(
                                                    getInputText(taskCardState.editMode.name.editModeValue).length,
                                                )}
                                                error={isErrorEditModeValueName}
                                            />
                                        </Grid>
                                    ) : (
                                        <Grid
                                            item
                                            onClick={() => {
                                                setTaskCardState((prevState: any) => {
                                                    return {
                                                        ...prevState,
                                                        editMode: {
                                                            ...prevState.editMode,
                                                            name: {
                                                                ...prevState.editMode.name,
                                                                isEditMode: !isReadOnlyTaskBody,
                                                            },
                                                        },
                                                    };
                                                });
                                            }}
                                        >
                                            <Typography variant="body1">{taskCardState.data.getName()}</Typography>
                                        </Grid>
                                    )}
                                    {taskCardState.editMode.description.isEditMode ? (
                                        <Grid item sx={{ marginBottom: '12px' }}>
                                            <TextField
                                                id="task-description-edit"
                                                multiline
                                                maxRows={12}
                                                defaultValue={taskCardState.editMode.description.editModeValue}
                                                fullWidth
                                                value={taskCardState.editMode.description.editModeValue}
                                                onBlur={async () => {
                                                    setTaskCardState((prevState: ITaskCardState) => {
                                                        return {
                                                            ...prevState,
                                                            editMode: {
                                                                ...prevState.editMode,
                                                                description: {
                                                                    ...prevState.editMode.description,
                                                                    isEditMode: false,
                                                                    ...(isErrorEditModeValueDescription
                                                                        ? {
                                                                              editModeValue:
                                                                                  prevState.data.description !== null
                                                                                      ? prevState.data.description
                                                                                      : '',
                                                                          }
                                                                        : {}),
                                                                },
                                                            },
                                                        };
                                                    });
                                                    if (!isErrorEditModeValueDescription) {
                                                        try {
                                                            const response = await ResourceClient.postResource(
                                                                'api/app/UpdateTask',

                                                                {
                                                                    id: task.getId(),
                                                                    description:
                                                                        getInputText(
                                                                            taskCardState.editMode.description
                                                                                .editModeValue,
                                                                        ).length === 0
                                                                            ? null
                                                                            : getInputText(
                                                                                  taskCardState.editMode.description
                                                                                      .editModeValue,
                                                                              ),
                                                                },
                                                                sliceAuthenticationStateData.getJwtToken(),
                                                            );
                                                            handleUpdateTask(response.data);
                                                        } catch (e: any) {}
                                                    }
                                                }}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setTaskCardState((prevState: any) => {
                                                        const editModeValue = event.target.value;
                                                        return {
                                                            ...prevState,
                                                            editMode: {
                                                                ...prevState.editMode,
                                                                description: {
                                                                    ...prevState.editMode.description,
                                                                    editModeValue,
                                                                },
                                                            },
                                                        };
                                                    });
                                                }}
                                                onKeyDown={async (event: React.KeyboardEvent) => {
                                                    if (event.key === 'Enter' && !event.shiftKey) {
                                                        setTaskCardState((prevState: ITaskCardState) => {
                                                            return {
                                                                ...prevState,
                                                                editMode: {
                                                                    ...prevState.editMode,
                                                                    description: {
                                                                        ...prevState.editMode.description,
                                                                        isEditMode: false,
                                                                        ...(isErrorEditModeValueDescription
                                                                            ? {
                                                                                  editModeValue:
                                                                                      prevState.data.description !==
                                                                                      null
                                                                                          ? prevState.data.description
                                                                                          : '',
                                                                              }
                                                                            : {}),
                                                                    },
                                                                },
                                                            };
                                                        });
                                                        if (!isErrorEditModeValueDescription) {
                                                            try {
                                                                const response = await ResourceClient.postResource(
                                                                    'api/app/UpdateTask',
                                                                    {
                                                                        id: task.getId(),
                                                                        description:
                                                                            getInputText(
                                                                                taskCardState.editMode.description
                                                                                    .editModeValue,
                                                                            ).length === 0
                                                                                ? null
                                                                                : getInputText(
                                                                                      taskCardState.editMode.description
                                                                                          .editModeValue,
                                                                                  ),
                                                                    },
                                                                    sliceAuthenticationStateData.getJwtToken(),
                                                                );
                                                                handleUpdateTask(response.data);
                                                            } catch (e: any) {}
                                                        }
                                                    }
                                                }}
                                                helperText={Constants.TASK_INPUT_DESCRIPTION_HELPER_TEXT(
                                                    getInputText(taskCardState.editMode.description.editModeValue)
                                                        .length,
                                                )}
                                                error={isErrorEditModeValueDescription}
                                            />
                                        </Grid>
                                    ) : taskCardState.data.getDescription() !== null ? (
                                        <Grid
                                            item
                                            onClick={() => {
                                                setTaskCardState((prevState: any) => {
                                                    return {
                                                        ...prevState,
                                                        editMode: {
                                                            ...prevState.editMode,
                                                            description: {
                                                                ...prevState.editMode.description,
                                                                isEditMode: !isReadOnlyTaskBody,
                                                            },
                                                        },
                                                    };
                                                });
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{ paddingBottom: '8px', fontStyle: 'oblique' }}
                                            >
                                                {taskCardState.data.getDescription()}
                                            </Typography>
                                        </Grid>
                                    ) : (
                                        <Grid item sx={{ marginBottom: '32px' }}></Grid>
                                    )}
                                </Grid>
                            </Grid>
                            {!taskCardState.editMode.numberOfPoints.isEditMode ? (
                                <Grid
                                    item
                                    sx={{
                                        padding: '8px',
                                        borderRadius: '50%',
                                        width: '54px',
                                        textAlign: 'center',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        maxHeight: '60px',
                                        height: '54px',
                                    }}
                                    onClick={() => {
                                        setTaskCardState((prevState: any) => {
                                            return {
                                                ...prevState,
                                                editMode: {
                                                    ...prevState.editMode,
                                                    numberOfPoints: {
                                                        ...prevState.editMode.numberOfPoints,
                                                        isEditMode: !isReadOnlyTaskBody,
                                                    },
                                                },
                                            };
                                        });
                                    }}
                                >
                                    <Typography sx={{ fontSize: '1.5rem' }}>
                                        {taskCardState.data.getNumberOfPoints()}
                                    </Typography>
                                </Grid>
                            ) : (
                                <Grid item sx={{ width: '100px', height: '54px' }}>
                                    <TextField
                                        id="edit-task-num-points"
                                        label="Points"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={taskCardState.editMode.numberOfPoints.editModeValue}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setTaskCardState((prevState: any) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        numberOfPoints: {
                                                            ...prevState.editMode.numberOfPoints,
                                                            editModeValue: event.target.value,
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        onBlur={async () => {
                                            setTaskCardState((prevState: ITaskCardState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        numberOfPoints: {
                                                            ...prevState.editMode.numberOfPoints,
                                                            isEditMode: false,
                                                            ...(isErrorEditModeValueNumberOfPoints
                                                                ? {
                                                                      editModeValue: prevState.data.numberOfPoints,
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValueNumberOfPoints) {
                                                try {
                                                    const response = await ResourceClient.postResource(
                                                        'api/app/UpdateTask',

                                                        {
                                                            id: task.getId(),
                                                            numberOfPoints: getInputInteger(
                                                                String(
                                                                    taskCardState.editMode.numberOfPoints.editModeValue,
                                                                ),
                                                            ),
                                                        },
                                                        sliceAuthenticationStateData.getJwtToken(),
                                                    );
                                                    handleUpdateTask(response.data);
                                                    handleSideEffectChangeNumberOfPoints();
                                                } catch (e: any) {}
                                            }
                                        }}
                                        onKeyDown={async (event: React.KeyboardEvent) => {
                                            if (event.key === 'Enter' && !event.shiftKey) {
                                                setTaskCardState((prevState: ITaskCardState) => {
                                                    return {
                                                        ...prevState,
                                                        editMode: {
                                                            ...prevState.editMode,
                                                            numberOfPoints: {
                                                                ...prevState.editMode.numberOfPoints,
                                                                isEditMode: false,
                                                                ...(isErrorEditModeValueNumberOfPoints
                                                                    ? {
                                                                          editModeValue: prevState.data.numberOfPoints,
                                                                      }
                                                                    : {}),
                                                            },
                                                        },
                                                    };
                                                });
                                                if (!isErrorEditModeValueNumberOfPoints) {
                                                    try {
                                                        const response = await ResourceClient.postResource(
                                                            'api/app/UpdateTask',

                                                            {
                                                                id: task.getId(),
                                                                numberOfPoints: getInputInteger(
                                                                    String(
                                                                        taskCardState.editMode.numberOfPoints
                                                                            .editModeValue,
                                                                    ),
                                                                ),
                                                            },
                                                            sliceAuthenticationStateData.getJwtToken(),
                                                        );
                                                        handleUpdateTask(response.data);
                                                        handleSideEffectChangeNumberOfPoints();
                                                    } catch (e: any) {}
                                                }
                                            }
                                        }}
                                        error={isErrorEditModeValueNumberOfPoints}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    {taskCardState.data.getImageLink() !== null ? (
                        <Grid
                            item
                            sx={{
                                paddingBottom: '12px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                component="img"
                                sx={{
                                    maxHeight: 512,
                                    maxWidth: 512,
                                }}
                                alt="task image"
                                // src="https://bet-app-io-alpha.s3.us-west-2.amazonaws.com/user-image/574bd532-8b74-467f-9828-68beb58d7a1c?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240204T100410Z&X-Amz-SignedHeaders=host&X-Amz-Credential=AKIAXCSRXEVRKDS4NPHR%2F20240204%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Expires=3600&X-Amz-Signature=c4d7f89dc995960ce2e3b8a68b747886238d64aa19cc004c26cce6d28b7c9b41"
                                src={taskCardState.data.getImageLink() ?? PlaceholderImagePod}
                            />
                        </Grid>
                    ) : null}
                    {taskCardState.isShowDetails ? (
                        <React.Fragment>
                            {!isReadOnlyTaskBody &&
                            taskCardState.data.getDescription() === null &&
                            !taskCardState.editMode.description.isEditMode ? (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '12px',
                                        marginBottom: '12px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Button
                                        variant="text"
                                        sx={{ textTransform: 'none', padding: '0px' }}
                                        onClick={() => {
                                            setTaskCardState((prevState: any) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        description: {
                                                            ...prevState.editMode.description,
                                                            isEditMode: !isReadOnlyTaskBody,
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                    >
                                        {'Add description'}
                                    </Button>
                                </Grid>
                            ) : null}
                            {!isReadOnlyTaskBody ? (
                                <Grid item sx={{ paddingBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        variant="text"
                                        sx={{ textTransform: 'none', padding: '0px' }}
                                        component="label"
                                    >
                                        {taskCardState.data.getImageLink() === null ? 'Attach image' : 'Edit image'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e: any) => {
                                                const file = e.target.files[0];
                                                const fileReader = new FileReader();
                                                fileReader.onload = (function (file) {
                                                    return async function (e) {
                                                        if (this.result !== null && String(this.result).length > 0) {
                                                            try {
                                                                const response = await ResourceClient.postResource(
                                                                    'api/app/UpdateTask',

                                                                    {
                                                                        id: task.getId(),
                                                                        imageAsBase64String: getInputText(
                                                                            String(this.result),
                                                                        ),
                                                                    },
                                                                    sliceAuthenticationStateData.getJwtToken(),
                                                                );
                                                                handleUpdateTask(response.data);
                                                            } catch (e: any) {}
                                                        }
                                                    };
                                                })(file);
                                                fileReader.readAsDataURL(file);
                                            }}
                                        />
                                    </Button>
                                    {taskCardState.data.getImageLink() !== null ? (
                                        <React.Fragment>
                                            <Divider
                                                orientation="vertical"
                                                flexItem
                                                sx={{ marginLeft: '8px', marginRight: '8px' }}
                                            />
                                            <Button
                                                variant="text"
                                                color="error"
                                                sx={{ textTransform: 'none', padding: '0px' }}
                                                onClick={async () => {
                                                    try {
                                                        const response = await ResourceClient.postResource(
                                                            'api/app/UpdateTask',

                                                            {
                                                                id: task.getId(),
                                                                imageAsBase64String: null,
                                                            },
                                                            sliceAuthenticationStateData.getJwtToken(),
                                                        );
                                                        handleUpdateTask(response.data);
                                                    } catch (e: any) {}
                                                }}
                                            >
                                                {'Delete image'}
                                            </Button>
                                        </React.Fragment>
                                    ) : null}
                                </Grid>
                            ) : null}

                            {isDisplayOptionsStarPinDelete ? (
                                <Grid item>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            marginBottom: '4px',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <IconButton
                                            onClick={async () => {
                                                try {
                                                    const response = await ResourceClient.postResource(
                                                        'api/app/UpdateTask',

                                                        {
                                                            id: task.getId(),
                                                            isStar: !taskCardState.data.getIsStar(),
                                                        },
                                                        sliceAuthenticationStateData.getJwtToken(),
                                                    );
                                                    handleUpdateTask(response.data);
                                                } catch (e: any) {}
                                            }}
                                        >
                                            {taskCardState.data.getIsStar() ? <StarIcon /> : <StarOutlineIcon />}
                                        </IconButton>
                                        <Tooltip
                                            title={'Starring a Task can assist with filtering and organizing'}
                                            placement="right"
                                        >
                                            <InfoOutlinedIcon
                                                sx={{
                                                    paddingLeft: '4px',
                                                    paddingRight: '8px',
                                                    paddingTop: '10px',
                                                    paddingBottom: '10px',
                                                }}
                                                fontSize="small"
                                            />
                                        </Tooltip>
                                        <Divider orientation="vertical" flexItem />
                                        <IconButton
                                            // onClick={async () => {
                                            //     try {
                                            //         const response = await ResourceClient.postResource(
                                            //             'api/app/UpdateTask',

                                            //             {
                                            //                 id: task.getId(),
                                            //                 isPin: !taskCardState.data.getIsPin(),
                                            //             },
                                            //             sliceAuthenticationStateData.getJwtToken(),
                                            //         );
                                            //         handleUpdateTask(response.data);
                                            //     } catch (e: any) {}
                                            // }}
                                            onClick={async () => {
                                                if (taskCardState.data.getIsPin()) {
                                                    const response = await ResourceClient.postResource(
                                                        'api/app/UpdateTask',

                                                        {
                                                            id: task.getId(),
                                                            isPin: !taskCardState.data.getIsPin(),
                                                        },
                                                        sliceAuthenticationStateData.getJwtToken(),
                                                    );
                                                    handleUpdateTask(response.data);
                                                } else {
                                                    setTaskCardState((prevState: ITaskCardState) => {
                                                        return {
                                                            ...prevState,
                                                            isShowPinTaskConfirmationModal: true,
                                                        };
                                                    });
                                                }
                                            }}
                                        >
                                            {taskCardState.data.getIsPin() ? <PushPinIcon /> : <PushPinOutlinedIcon />}
                                        </IconButton>
                                        <Tooltip
                                            title={'Pinning a Task displays the task on your public profile'}
                                            placement="right"
                                        >
                                            <InfoOutlinedIcon
                                                sx={{
                                                    paddingLeft: '4px',
                                                    paddingRight: '8px',
                                                    paddingTop: '10px',
                                                    paddingBottom: '10px',
                                                }}
                                                fontSize="small"
                                            />
                                        </Tooltip>
                                        {isAuthorizedToDelete ? (
                                            <React.Fragment>
                                                <Divider orientation="vertical" flexItem />
                                                <IconButton
                                                    onClick={() => {
                                                        setTaskCardState((prevState: any) => {
                                                            return {
                                                                ...prevState,
                                                                isShowDeleteTaskConfirmationModal: true,
                                                            };
                                                        });
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                <Tooltip title={'Delete Task'} placement="right">
                                                    <InfoOutlinedIcon
                                                        sx={{
                                                            paddingLeft: '4px',
                                                            paddingRight: '8px',
                                                            paddingTop: '10px',
                                                            paddingBottom: '10px',
                                                        }}
                                                        fontSize="small"
                                                    />
                                                </Tooltip>
                                            </React.Fragment>
                                        ) : null}
                                    </Box>
                                </Grid>
                            ) : null}
                            <Grid
                                item
                                sx={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}
                                onClick={() => {
                                    setTaskCardState((prevState: any) => {
                                        return {
                                            ...prevState,
                                            editMode: {
                                                ...prevState.editMode,
                                                datetimeTarget: {
                                                    ...prevState.editMode.datetimeTarget,
                                                    isEditMode: !isReadOnlyTaskBody,
                                                },
                                            },
                                        };
                                    });
                                }}
                            >
                                <Typography variant="caption">{dateDescription}</Typography>
                            </Grid>
                            {taskCardState.editMode.datetimeTarget.isEditMode ? (
                                <Grid item sx={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label={'Set target completion date'}
                                            format="YYYY/MM/DD"
                                            value={taskCardState.editMode.datetimeTarget.editModeValue}
                                            slotProps={{
                                                field: { clearable: true },
                                            }}
                                            onChange={debouncedOnChangeDatetimeTarget}
                                            sx={{ width: '250px' }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            ) : null}
                            {isDisplayViewPodLink && taskCardState.data.getIdPod() !== null ? (
                                <Grid
                                    item
                                    sx={{
                                        marginBottom: '12px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        // width: '250px',
                                    }}
                                >
                                    <Box sx={{ width: '250px' }}>
                                        <Button
                                            variant="contained"
                                            href={`/pods/${String(taskCardState.data.getIdPod())}`}
                                            sx={{ width: '100%' }}
                                        >
                                            View Pod
                                        </Button>
                                    </Box>
                                </Grid>
                            ) : null}
                            {taskCardState.data.getIdPod() !== null &&
                            taskCardState.data.getUserBubblesTaskComplete() !== null ? (
                                <Grid
                                    item
                                    sx={{
                                        marginBottom: '12px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Box sx={{ width: '250px' }}>
                                        <UserListButton
                                            labelText={getUserListButtonText(
                                                taskCardState.data.getUserBubblesTaskCompleteTotalNumber(),
                                                'completed',
                                                'completed',
                                            )}
                                            userBubbles={taskCardState.data.getUserBubblesTaskComplete() ?? []}
                                            sortByTimestampLabel="time completed"
                                            apiPath={'api/app/GetUserBubblesTaskComplete'}
                                            apiPayload={{ id: taskCardState.data.getId() }}
                                            modalTitle="Users Completed Task"
                                            isUseDateTimeDateAndTime={true}
                                        />
                                    </Box>
                                </Grid>
                            ) : null}
                            <Grid item sx={{ paddingBottom: '12px' }}>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <Typography variant="button">My Notes</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {!isReadOnlyTaskNotes ? (
                                            <Grid container direction="column">
                                                {taskCardState.data.getNoteText() === null &&
                                                !taskCardState.editMode.noteText.isEditMode ? (
                                                    <Grid
                                                        item
                                                        sx={{
                                                            marginBottom: '12px',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Button
                                                            variant="text"
                                                            sx={{ textTransform: 'none', padding: '0px' }}
                                                            onClick={() => {
                                                                setTaskCardState((prevState: any) => {
                                                                    return {
                                                                        ...prevState,
                                                                        editMode: {
                                                                            ...prevState.editMode,
                                                                            noteText: {
                                                                                ...prevState.editMode.noteText,
                                                                                isEditMode: !isReadOnlyTaskNotes,
                                                                            },
                                                                        },
                                                                    };
                                                                });
                                                            }}
                                                        >
                                                            {'Add text'}
                                                        </Button>
                                                    </Grid>
                                                ) : null}
                                                {taskCardState.editMode.noteText.isEditMode ? (
                                                    <Grid item sx={{ marginBottom: '12px' }}>
                                                        <TextField
                                                            id="task-noteText-edit"
                                                            multiline
                                                            maxRows={12}
                                                            defaultValue={taskCardState.editMode.noteText.editModeValue}
                                                            fullWidth
                                                            value={taskCardState.editMode.noteText.editModeValue}
                                                            onBlur={async () => {
                                                                setTaskCardState((prevState: ITaskCardState) => {
                                                                    return {
                                                                        ...prevState,
                                                                        editMode: {
                                                                            ...prevState.editMode,
                                                                            noteText: {
                                                                                ...prevState.editMode.noteText,
                                                                                isEditMode: false,
                                                                                ...(isErrorEditModeValueDescription
                                                                                    ? {
                                                                                          editModeValue:
                                                                                              prevState.data
                                                                                                  .noteText !== null
                                                                                                  ? prevState.data
                                                                                                        .noteText
                                                                                                  : '',
                                                                                      }
                                                                                    : {}),
                                                                            },
                                                                        },
                                                                    };
                                                                });
                                                                if (!isErrorEditModeValueNoteText) {
                                                                    try {
                                                                        const response =
                                                                            await ResourceClient.postResource(
                                                                                'api/app/UpdateTask',

                                                                                {
                                                                                    id: task.getId(),
                                                                                    noteText:
                                                                                        getInputText(
                                                                                            taskCardState.editMode
                                                                                                .noteText.editModeValue,
                                                                                        ).length === 0
                                                                                            ? null
                                                                                            : getInputText(
                                                                                                  taskCardState.editMode
                                                                                                      .noteText
                                                                                                      .editModeValue,
                                                                                              ),
                                                                                },
                                                                                sliceAuthenticationStateData.getJwtToken(),
                                                                            );
                                                                        handleUpdateTask(response.data);
                                                                    } catch (e: any) {}
                                                                }
                                                            }}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                setTaskCardState((prevState: any) => {
                                                                    const editModeValue = event.target.value;
                                                                    return {
                                                                        ...prevState,
                                                                        editMode: {
                                                                            ...prevState.editMode,
                                                                            noteText: {
                                                                                ...prevState.editMode.noteText,
                                                                                editModeValue,
                                                                            },
                                                                        },
                                                                    };
                                                                });
                                                            }}
                                                            onKeyDown={async (event: React.KeyboardEvent) => {
                                                                if (event.key === 'Enter' && !event.shiftKey) {
                                                                    setTaskCardState((prevState: ITaskCardState) => {
                                                                        return {
                                                                            ...prevState,
                                                                            editMode: {
                                                                                ...prevState.editMode,
                                                                                noteText: {
                                                                                    ...prevState.editMode.noteText,
                                                                                    isEditMode: false,
                                                                                    ...(isErrorEditModeValueNoteText
                                                                                        ? {
                                                                                              editModeValue:
                                                                                                  prevState.data
                                                                                                      .noteText !== null
                                                                                                      ? prevState.data
                                                                                                            .noteText
                                                                                                      : '',
                                                                                          }
                                                                                        : {}),
                                                                                },
                                                                            },
                                                                        };
                                                                    });
                                                                    if (!isErrorEditModeValueNoteText) {
                                                                        try {
                                                                            const response =
                                                                                await ResourceClient.postResource(
                                                                                    'api/app/UpdateTask',

                                                                                    {
                                                                                        id: task.getId(),
                                                                                        noteText:
                                                                                            getInputText(
                                                                                                taskCardState.editMode
                                                                                                    .noteText
                                                                                                    .editModeValue,
                                                                                            ).length === 0
                                                                                                ? null
                                                                                                : getInputText(
                                                                                                      taskCardState
                                                                                                          .editMode
                                                                                                          .noteText
                                                                                                          .editModeValue,
                                                                                                  ),
                                                                                    },
                                                                                    sliceAuthenticationStateData.getJwtToken(),
                                                                                );
                                                                            handleUpdateTask(response.data);
                                                                        } catch (e: any) {}
                                                                    }
                                                                }
                                                            }}
                                                            helperText={Constants.TASK_INPUT_NOTE_TEXT_HELPER_TEXT(
                                                                getInputText(
                                                                    taskCardState.editMode.noteText.editModeValue,
                                                                ).length,
                                                            )}
                                                            error={isErrorEditModeValueNoteText}
                                                        />
                                                    </Grid>
                                                ) : (
                                                    <Grid
                                                        item
                                                        sx={{ marginBottom: '12px' }}
                                                        onClick={() => {
                                                            setTaskCardState((prevState: any) => {
                                                                return {
                                                                    ...prevState,
                                                                    editMode: {
                                                                        ...prevState.editMode,
                                                                        noteText: {
                                                                            ...prevState.editMode.noteText,
                                                                            isEditMode: !isReadOnlyTaskNotes,
                                                                        },
                                                                    },
                                                                };
                                                            });
                                                        }}
                                                    >
                                                        <Typography variant="body1">
                                                            {taskCardState.data.getNoteText()}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                                {taskCardState.data.getNoteImageLink() !== null ? (
                                                    <Grid
                                                        item
                                                        sx={{
                                                            paddingBottom: '12px',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Box
                                                            component="img"
                                                            sx={{
                                                                maxHeight: 512,
                                                                maxWidth: 512,
                                                            }}
                                                            alt="task-note-image"
                                                            src={
                                                                taskCardState.data.getNoteImageLink() ??
                                                                PlaceholderImagePod
                                                            }
                                                        />
                                                    </Grid>
                                                ) : null}
                                                <Grid
                                                    item
                                                    sx={{
                                                        paddingBottom: '12px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Button
                                                        variant="text"
                                                        sx={{ textTransform: 'none', padding: '0px' }}
                                                        component="label"
                                                    >
                                                        {taskCardState.data.getNoteImageLink() === null
                                                            ? 'Attach image'
                                                            : 'Edit image'}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            hidden
                                                            onChange={(e: any) => {
                                                                const file = e.target.files[0];
                                                                const fileReader = new FileReader();
                                                                fileReader.onload = (function (file) {
                                                                    return async function (e) {
                                                                        if (
                                                                            this.result !== null &&
                                                                            String(this.result).length > 0
                                                                        ) {
                                                                            try {
                                                                                const response =
                                                                                    await ResourceClient.postResource(
                                                                                        'api/app/UpdateTask',

                                                                                        {
                                                                                            id: task.getId(),
                                                                                            noteImageAsBase64String:
                                                                                                getInputText(
                                                                                                    String(this.result),
                                                                                                ),
                                                                                        },
                                                                                        sliceAuthenticationStateData.getJwtToken(),
                                                                                    );
                                                                                handleUpdateTask(response.data);
                                                                            } catch (e: any) {}
                                                                        }
                                                                    };
                                                                })(file);
                                                                fileReader.readAsDataURL(file);
                                                            }}
                                                        />
                                                    </Button>
                                                    {taskCardState.data.getNoteImageLink() !== null ? (
                                                        <React.Fragment>
                                                            <Divider
                                                                orientation="vertical"
                                                                flexItem
                                                                sx={{ marginLeft: '8px', marginRight: '8px' }}
                                                            />
                                                            <Button
                                                                variant="text"
                                                                color="error"
                                                                sx={{ textTransform: 'none', padding: '0px' }}
                                                                onClick={async () => {
                                                                    try {
                                                                        const response =
                                                                            await ResourceClient.postResource(
                                                                                'api/app/UpdateTask',

                                                                                {
                                                                                    id: task.getId(),
                                                                                    noteImageAsBase64String: null,
                                                                                },
                                                                                sliceAuthenticationStateData.getJwtToken(),
                                                                            );
                                                                        handleUpdateTask(response.data);
                                                                    } catch (e: any) {}
                                                                }}
                                                            >
                                                                {'Delete image'}
                                                            </Button>
                                                        </React.Fragment>
                                                    ) : null}
                                                </Grid>
                                            </Grid>
                                        ) : (
                                            <Grid container direction="column">
                                                {taskCardState.data.getNoteText() === null &&
                                                taskCardState.data.getNoteImageLink() === null ? (
                                                    <Typography>{'No notes posted yet.'}</Typography>
                                                ) : (
                                                    <React.Fragment>
                                                        {taskCardState.data.getNoteText() !== null ? (
                                                            <Grid
                                                                item
                                                                sx={{ marginBottom: '12px' }}
                                                                onClick={() => {
                                                                    setTaskCardState((prevState: any) => {
                                                                        return {
                                                                            ...prevState,
                                                                            editMode: {
                                                                                ...prevState.editMode,
                                                                                noteText: {
                                                                                    ...prevState.editMode.noteText,
                                                                                    isEditMode: true,
                                                                                },
                                                                            },
                                                                        };
                                                                    });
                                                                }}
                                                            >
                                                                <Typography variant="body1">
                                                                    {taskCardState.data.getNoteText()}
                                                                </Typography>
                                                            </Grid>
                                                        ) : null}
                                                        {taskCardState.data.getNoteImageLink() !== null ? (
                                                            <Grid
                                                                item
                                                                sx={{
                                                                    paddingBottom: '12px',
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <Box
                                                                    component="img"
                                                                    sx={{
                                                                        maxHeight: 512,
                                                                        maxWidth: 512,
                                                                    }}
                                                                    alt="task-note-image"
                                                                    src={
                                                                        taskCardState.data.getNoteImageLink() ??
                                                                        PlaceholderImagePod
                                                                    }
                                                                />
                                                            </Grid>
                                                        ) : null}
                                                    </React.Fragment>
                                                )}
                                            </Grid>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion
                                    onChange={(event: React.SyntheticEvent, expanded: boolean) => {
                                        if (expanded) {
                                            void handleGetTaskComments();
                                            void handleGetTaskReactions();
                                        } else {
                                            setTaskCommentsState((prevState: ITaskCommentsState) => {
                                                return {
                                                    ...prevState,
                                                    isShowTaskComments: false,
                                                };
                                            });
                                        }
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel2-content"
                                        id="panel2-header"
                                    >
                                        <Typography variant="button">Comments and Reactions</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Card
                                            variant="outlined"
                                            sx={{ marginBottom: '12px', backgroundColor: '#e3f2fd' }}
                                        >
                                            <CardContent>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Grid item>
                                                        <ReactionSelector
                                                            handleUpdateCallback={() => {
                                                                void handleGetTaskReactions();
                                                            }}
                                                            myReaction={taskReactionsState.data.getMyReactionType()}
                                                            apiPathSelectReaction={'api/app/UpdateTaskReaction'}
                                                            apiSelectReactionSourceEntityIdValue={task.getId()}
                                                        />
                                                    </Grid>
                                                    <Divider
                                                        orientation="vertical"
                                                        sx={{ marginLeft: '12px', marginRight: '12px' }}
                                                    />
                                                    <Grid item>
                                                        <UserBubbleReactionListModalButton
                                                            labelText={getUserListButtonText(
                                                                taskReactionsState.data.getUserBubblesReactionTotalNumber(),
                                                                'task reaction',
                                                                'task reactions',
                                                            )}
                                                            userBubbles={taskReactionsState.data.getUserBubblesReaction()}
                                                            sortByTimestampLabel="time of reaction"
                                                            apiPath={'api/app/GetTaskReactions'}
                                                            apiReactionSourceEntityIdValue={task.getId()}
                                                            modalTitle="Reactions"
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>

                                        {taskCommentsState.isShowTaskComments ? (
                                            <TaskCommentList
                                                taskComments={taskCommentsState.data}
                                                idTask={task.getId()}
                                            />
                                        ) : null}
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        </React.Fragment>
                    ) : null}
                    <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                        {taskCardState.isShowDetails ? (
                            <IconButton
                                sx={{ padding: '0px' }}
                                onClick={() => {
                                    setTaskCardState((prevState: any) => {
                                        return {
                                            ...prevState,
                                            isShowDetails: false,
                                            editMode: {
                                                ...prevState.editMode,
                                                name: {
                                                    ...prevState.editMode.name,
                                                    isEditMode: false,
                                                },
                                                description: {
                                                    ...prevState.editMode.description,
                                                    isEditMode: false,
                                                },
                                                numberOfPoints: {
                                                    ...prevState.editMode.numberOfPoints,
                                                    isEditMode: false,
                                                },
                                                datetimeTarget: {
                                                    ...prevState.editMode.datetimeTarget,
                                                    isEditMode: false,
                                                },
                                                noteText: {
                                                    ...prevState.editMode.noteText,
                                                    isEditMode: false,
                                                },
                                            },
                                        };
                                    });
                                }}
                            >
                                <ExpandLessIcon />
                            </IconButton>
                        ) : (
                            <IconButton
                                sx={{ padding: '0px' }}
                                onClick={() => {
                                    setTaskCardState((prevState: any) => {
                                        return { ...prevState, isShowDetails: true };
                                    });
                                }}
                            >
                                <MoreHorizIcon />
                            </IconButton>
                        )}
                    </Grid>
                </Grid>
                <React.Fragment>
                    <Dialog
                        open={taskCardState.isShowDeleteTaskConfirmationModal}
                        onClose={() => {
                            setTaskCardState((prevState: any) => {
                                return {
                                    ...prevState,
                                    isShowDeleteTaskConfirmationModal: false,
                                };
                            });
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">{`Are you sure you would like to delete this Task?${
                                taskCardState.data.getIdPod() !== null && taskCardState.data.getIdPod() !== undefined
                                    ? ' Deleting a Task from a Pod also removes the Task from any Stamp which references the Task.'
                                    : ''
                            }`}</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    setTaskCardState((prevState: any) => {
                                        return {
                                            ...prevState,
                                            isShowDeleteTaskConfirmationModal: false,
                                        };
                                    });
                                }}
                                autoFocus
                            >
                                Close
                            </Button>
                            <Button
                                onClick={async () => {
                                    try {
                                        await ResourceClient.postResource(
                                            'api/app/DeleteTask',

                                            {
                                                id: task.getId(),
                                            },
                                            sliceAuthenticationStateData.getJwtToken(),
                                        );
                                        setTaskCardState((prevState: any) => {
                                            return {
                                                ...prevState,
                                                isShowDeleteTaskConfirmationModal: false,
                                            };
                                        });
                                    } catch (e: any) {}
                                }}
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={taskCardState.isShowPinTaskConfirmationModal}
                        onClose={() => {
                            setTaskCardState((prevState: any) => {
                                return {
                                    ...prevState,
                                    isShowPinTaskConfirmationModal: false,
                                };
                            });
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">{`Are you sure you would like to pin this Task? Pinning a Task displays everything in the Task "My Notes" section for others to see.`}</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    setTaskCardState((prevState: any) => {
                                        return {
                                            ...prevState,
                                            isShowPinTaskConfirmationModal: false,
                                        };
                                    });
                                }}
                                autoFocus
                            >
                                Close
                            </Button>
                            <Button
                                onClick={async () => {
                                    try {
                                        setTaskCardState((prevState: any) => {
                                            return {
                                                ...prevState,
                                                isShowPinTaskConfirmationModal: false,
                                            };
                                        });
                                        const response = await ResourceClient.postResource(
                                            'api/app/UpdateTask',

                                            {
                                                id: task.getId(),
                                                isPin: !taskCardState.data.getIsPin(),
                                            },
                                            sliceAuthenticationStateData.getJwtToken(),
                                        );
                                        handleUpdateTask(response.data);
                                    } catch (e: any) {}
                                }}
                            >
                                Pin
                            </Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
