import React, { useState } from 'react';
import _ from 'lodash';
import {
    Box,
    Button,
    Card,
    CardContent,
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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import UserListButton from 'src/javascripts/components/UserListButton';
import { MOCK_MY_USER_ID } from 'src/javascripts/mocks/Mocks';
import { getInputText, getInputInteger } from 'src/javascripts/utilities';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Constants from 'src/javascripts/Constants';
import type { Dayjs } from 'dayjs';
import TaskModel from 'src/javascripts/models/TaskModel';

export interface ITaskCardProps {
    id: string;
    name: string;
    description: string | null;
    imageLink: string | null;
    numberOfPoints: number;
    isComplete: boolean;
    isStar: boolean;
    isPin: boolean;
    noteText: string | null;
    noteImage: string | null;
    datetimeCreate: string;
    datetimeUpdate: string | null;
    datetimeTarget: string | null;
    datetimeComplete: string | null;

    isDisplayOptionPin: boolean;
    isDisplayViewPodLink: boolean;
    idPod: string | null;
    isDisplayUserBubblesComplete: boolean; // for pod tasks, from db should return true/false, and if false, the "usersCompletedBy" should be null
    userListButtonBubblesTop3TaskComplete: any;
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
    editMode: {
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
    };
    data: {
        id: string;
        name: string;
        description: string | null;
        numberOfPoints: number;
        isComplete: boolean;
        isStar: boolean;
        isPin: boolean;
        noteText: string | null;
        noteImage: string | null;
        datetimeCreate: string;
        datetimeUpdate: string | null;
        datetimeTarget: string | null;
        datetimeComplete: string | null;
        // isDisplayViewPodLink: string;
        // idPod: string;
    };
}
const TaskCard: React.FC<ITaskCardProps> = (props: ITaskCardProps) => {
    const {
        id,
        isDisplayUserBubblesComplete,
        isDisplayOptionPin,
        // isDisplayViewPodLink,
        // idPod,
    } = props;
    const [taskCardState, setTaskCardState] = useState<ITaskCardState>({
        isShowDetails: false,
        editMode: {
            description: {
                isEditMode: false,
                editModeValue: props.description !== null ? props.description : '',
            },
            numberOfPoints: {
                isEditMode: false,
                editModeValue: props.numberOfPoints,
            },
            datetimeTarget: {
                isEditMode: false,
                editModeValue: props.datetimeTarget === null ? null : dayjs(props.datetimeTarget),
            },
        },

        data: {
            id: props.id,
            name: props.name,
            description: props.description,
            numberOfPoints: props.numberOfPoints,
            isComplete: props.isComplete,
            isStar: props.isStar,
            isPin: props.isPin,
            noteText: props.noteText,
            noteImage: props.noteImage,
            datetimeCreate: props.datetimeCreate,
            datetimeUpdate: props.datetimeUpdate,
            datetimeTarget: props.datetimeTarget,
            datetimeComplete: props.datetimeComplete,
        },
    });

    const dateDescription = getDateDescription(
        taskCardState.data.datetimeCreate,
        taskCardState.data.datetimeUpdate,
        // taskCardState.editMode.datetimeTarget.editModeValue === null ? null : dayjs(datetimeTarget).format(),
        taskCardState.data.datetimeTarget,
        taskCardState.data.datetimeComplete,
    );

    const handleUpdateTask = (responseJson: any): void => {
        const taskModel = new TaskModel(responseJson);
        setTaskCardState((prevState: any) => {
            return {
                ...prevState,
                data: {
                    id: taskModel.getId(),
                    name: taskModel.getName(),
                    description: taskModel.getDescription(),
                    imageLink: taskModel.getImageLink(),
                    numberOfPoints: taskModel.getNumberOfPoints(),
                    idPod: taskModel.getIdPod(),
                    noteText: taskModel.getNoteText(),
                    noteImage: taskModel.getNoteImage(),
                    isComplete: taskModel.getIsComplete(),
                    isStar: taskModel.getIsStar(),
                    isPin: taskModel.getIsPin(),
                    datetimeCreate: taskModel.getDatetimeCreate(),
                    datetimeUpdate: taskModel.getDatetimeUpdate(),
                    datetimeTarget: taskModel.getDatetimeTarget(),
                    datetimeComplete: taskModel.getDatetimeComplete(),
                },
            };
        });
    };

    const handleOnChangeDatetimeTarget = (editModeValue: any): void => {
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
        ResourceClient.postResource(
            'api/task/update/task',
            { idUser: MOCK_MY_USER_ID },
            {
                id,
                timestampTarget: editModeValue === undefined || editModeValue === null ? null : editModeValue.unix(),
            },
        )
            .then((responseJson: any) => {
                handleUpdateTask(responseJson);
            })
            .catch(() => {});
    };

    const debouncedOnChangeDatetimeTarget = _.debounce(handleOnChangeDatetimeTarget, 2000);

    const isErrorEditModeValueNumberOfPoints =
        getInputInteger(String(taskCardState.editMode.numberOfPoints.editModeValue)) <
            Constants.TASK_NUMBER_OF_POINTS_MIN ||
        getInputInteger(String(taskCardState.editMode.numberOfPoints.editModeValue)) >
            Constants.TASK_NUMBER_OF_POINTS_MAX;
    const isErrorEditModeValueDescription =
        getInputText(taskCardState.editMode.description.editModeValue).length >
        Constants.TASK_DESCRIPTION_MAX_LENGTH_CHARACTERS;

    return (
        <Card
            sx={{
                fontFamily: 'Raleway',
                color: THEME.palette.grey.A700,
                marginBottom: '16px',
                width: '650px',
                position: 'relative',
            }}
        >
            <CardContent>
                <Grid container direction="row">
                    <Grid item sx={{ paddingRight: '8px', paddingTop: '8px' }}>
                        <IconButton
                            onClick={() => {
                                ResourceClient.postResource(
                                    'api/task/update/task',
                                    { idUser: MOCK_MY_USER_ID },
                                    {
                                        id,
                                        isComplete: true,
                                    },
                                )
                                    .then((responseJson: any) => {
                                        handleUpdateTask(responseJson);
                                    })
                                    .catch(() => {});
                            }}
                        >
                            {taskCardState.data.isComplete ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                        </IconButton>
                    </Grid>
                    <Grid item sx={{ marginRight: 'auto', maxWidth: '500px' }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Typography variant="body1">{taskCardState.data.name}</Typography>
                            </Grid>
                            {taskCardState.editMode.description.isEditMode ? (
                                <Grid item>
                                    <TextField
                                        id="task-description-edit"
                                        multiline
                                        maxRows={12}
                                        defaultValue={taskCardState.editMode.description.editModeValue}
                                        fullWidth
                                        value={taskCardState.editMode.description.editModeValue}
                                        onBlur={() => {
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
                                                ResourceClient.postResource(
                                                    'api/task/update/task',
                                                    { idUser: MOCK_MY_USER_ID },
                                                    {
                                                        id,
                                                        description: getInputText(
                                                            taskCardState.editMode.description.editModeValue,
                                                        ),
                                                    },
                                                )
                                                    .then((responseJson: any) => {
                                                        handleUpdateTask(responseJson);
                                                    })
                                                    .catch(() => {});
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
                                        onKeyDown={(event: React.KeyboardEvent) => {
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
                                                    ResourceClient.postResource(
                                                        'api/task/update/task',
                                                        { idUser: MOCK_MY_USER_ID },
                                                        {
                                                            id,
                                                            description: getInputText(
                                                                taskCardState.editMode.description.editModeValue,
                                                            ),
                                                        },
                                                    )
                                                        .then((responseJson: any) => {
                                                            handleUpdateTask(responseJson);
                                                        })
                                                        .catch(() => {});
                                                }
                                            }
                                        }}
                                        helperText={Constants.TASK_INPUT_DESCRIPTION_HELPER_TEXT(
                                            getInputText(taskCardState.editMode.description.editModeValue).length,
                                        )}
                                        error={isErrorEditModeValueDescription}
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
                                                    description: {
                                                        ...prevState.editMode.description,
                                                        isEditMode: true,
                                                    },
                                                },
                                            };
                                        });
                                    }}
                                >
                                    <Typography variant="body2" sx={{ paddingBottom: '8px', fontStyle: 'oblique' }}>
                                        {taskCardState.data.description}
                                    </Typography>
                                </Grid>
                            )}
                            {taskCardState.isShowDetails ? (
                                <React.Fragment>
                                    {isDisplayUserBubblesComplete ? (
                                        <React.Fragment>
                                            <Grid item>
                                                <Typography variant="caption">Completed by:</Typography>
                                            </Grid>
                                            <Grid item sx={{ marginBottom: '8px' }}>
                                                <UserListButton />
                                            </Grid>
                                        </React.Fragment>
                                    ) : null}
                                    <Grid item>
                                        <Box sx={{ display: 'flex', marginBottom: '4px' }}>
                                            <React.Fragment>
                                                <IconButton
                                                    onClick={() => {
                                                        ResourceClient.postResource(
                                                            'api/task/update/task',
                                                            { idUser: MOCK_MY_USER_ID },
                                                            {
                                                                id,
                                                                isStar: !taskCardState.data.isStar,
                                                            },
                                                        )
                                                            .then((responseJson: any) => {
                                                                handleUpdateTask(responseJson);
                                                            })
                                                            .catch(() => {});
                                                    }}
                                                >
                                                    {taskCardState.data.isStar ? <StarIcon /> : <StarOutlineIcon />}
                                                </IconButton>
                                                <Tooltip
                                                    title={'Starring a task can assist with filtering and organizing'}
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
                                                <Divider orientation="vertical" flexItem />{' '}
                                            </React.Fragment>
                                            {isDisplayOptionPin ? (
                                                <React.Fragment>
                                                    <IconButton
                                                        onClick={() => {
                                                            ResourceClient.postResource(
                                                                'api/task/update/task',
                                                                { idUser: MOCK_MY_USER_ID },
                                                                {
                                                                    id,
                                                                    isPin: !taskCardState.data.isPin,
                                                                },
                                                            )
                                                                .then((responseJson: any) => {
                                                                    handleUpdateTask(responseJson);
                                                                })
                                                                .catch(() => {});
                                                        }}
                                                    >
                                                        {taskCardState.data.isPin ? (
                                                            <PushPinIcon />
                                                        ) : (
                                                            <PushPinOutlinedIcon />
                                                        )}
                                                    </IconButton>
                                                    <Tooltip
                                                        title={
                                                            'Pinning a task displays the task on your public profile'
                                                        }
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
                                                </React.Fragment>
                                            ) : null}
                                        </Box>
                                    </Grid>
                                    <Grid item sx={{ marginBottom: '12px' }}>
                                        <Typography variant="caption">{dateDescription}</Typography>
                                    </Grid>
                                    {taskCardState.data.description === null ||
                                    taskCardState.data.description.length === 0 ? (
                                        <Grid item sx={{ marginBottom: '24px' }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    setTaskCardState((prevState: any) => {
                                                        return {
                                                            ...prevState,
                                                            editMode: {
                                                                ...prevState.editMode,
                                                                description: {
                                                                    ...prevState.editMode.description,
                                                                    isEditMode: true,
                                                                },
                                                            },
                                                        };
                                                    });
                                                }}
                                            >
                                                Add description
                                            </Button>
                                        </Grid>
                                    ) : null}
                                    <Grid item sx={{ marginBottom: '24px' }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label={'Target completion date'}
                                                value={taskCardState.editMode.datetimeTarget.editModeValue}
                                                slotProps={{
                                                    field: { clearable: true },
                                                }}
                                                onChange={debouncedOnChangeDatetimeTarget}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    {taskCardState.editMode.numberOfPoints.isEditMode ? (
                                        <Grid item>
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
                                                onBlur={() => {
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
                                                                              editModeValue:
                                                                                  prevState.data.numberOfPoints,
                                                                          }
                                                                        : {}),
                                                                },
                                                            },
                                                        };
                                                    });
                                                    if (!isErrorEditModeValueNumberOfPoints) {
                                                        ResourceClient.postResource(
                                                            'api/task/update/task',
                                                            { idUser: MOCK_MY_USER_ID },
                                                            {
                                                                id,
                                                                numberOfPoints: getInputInteger(
                                                                    String(
                                                                        taskCardState.editMode.numberOfPoints
                                                                            .editModeValue,
                                                                    ),
                                                                ),
                                                            },
                                                        )
                                                            .then((responseJson: any) => {
                                                                handleUpdateTask(responseJson);
                                                            })
                                                            .catch(() => {});
                                                    }
                                                }}
                                                onKeyDown={(event: React.KeyboardEvent) => {
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
                                                                                  editModeValue:
                                                                                      prevState.data.numberOfPoints,
                                                                              }
                                                                            : {}),
                                                                    },
                                                                },
                                                            };
                                                        });
                                                        if (!isErrorEditModeValueNumberOfPoints) {
                                                            ResourceClient.postResource(
                                                                'api/task/update/task',
                                                                { idUser: MOCK_MY_USER_ID },
                                                                {
                                                                    id,
                                                                    numberOfPoints: getInputInteger(
                                                                        String(
                                                                            taskCardState.editMode.numberOfPoints
                                                                                .editModeValue,
                                                                        ),
                                                                    ),
                                                                },
                                                            )
                                                                .then((responseJson: any) => {
                                                                    handleUpdateTask(responseJson);
                                                                })
                                                                .catch(() => {});
                                                        }
                                                    }
                                                }}
                                                error={isErrorEditModeValueNumberOfPoints}
                                                helperText={Constants.INPUT_NUMBER_OF_POINTS_HELPER_TEXT}
                                            />
                                        </Grid>
                                    ) : null}
                                    <Grid item>
                                        <Button
                                            sx={{ padding: '0px', textTransform: 'none' }}
                                            variant="text"
                                            onClick={() => {
                                                setTaskCardState((prevState: any) => {
                                                    return { ...prevState, isShowDetails: false };
                                                });
                                            }}
                                        >
                                            hide details
                                        </Button>
                                    </Grid>
                                </React.Fragment>
                            ) : (
                                <Grid item>
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
                                </Grid>
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
                            }}
                            onClick={() => {
                                if (taskCardState.data.isComplete) {
                                    return;
                                }
                                setTaskCardState((prevState: any) => {
                                    return {
                                        ...prevState,
                                        isShowDetails: true,
                                        editMode: {
                                            ...prevState.editMode,
                                            numberOfPoints: {
                                                ...prevState.editMode.numberOfPoints,
                                                isEditMode: true,
                                            },
                                        },
                                    };
                                });
                            }}
                        >
                            <Typography sx={{ fontSize: '1.5rem' }}>{taskCardState.data.numberOfPoints}</Typography>
                        </Grid>
                    ) : null}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
