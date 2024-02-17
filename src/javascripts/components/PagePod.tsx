import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { Box, Divider, Grid, Typography, Tab, Tabs, TextField, IconButton, Tooltip } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import FilterTasks from 'src/javascripts/components/FilterTasks';
import FilterStamps from 'src/javascripts/components/FilterStamps';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import StampCardList from 'src/javascripts/components/StampCardList';
import AvatarImageEditor from 'src/javascripts/components/AvatarImageEditor';

import UserListButton from 'src/javascripts/components/UserListButton';
import IconButtonJoinPod from 'src/javascripts/components/IconButtonJoinPod';
import CreateStampModalButton from 'src/javascripts/components/CreateStampModalButton';
import IconButtonInviteUsersJoinPodModal from 'src/javascripts/components/IconButtonInviteUsersJoinPodModal';
import IconButtonAddPodModeratorsModal from 'src/javascripts/components/IconButtonAddPodModeratorsModal';
import IconButtonManagePendingBecomePodModeratorRequestsModal from 'src/javascripts/components/IconButtonManagePendingBecomePodModeratorRequestsModal';
import IconButtonSendBecomePodModeratorRequest from 'src/javascripts/components/IconButtonSendBecomePodModeratorRequest';
import IconButtonLeavePod from 'src/javascripts/components/IconButtonLeavePod';
import CreateTaskModalButton from 'src/javascripts/components/CreateTaskModalButton';
import { getInputText, getUserListButtonText } from 'src/javascripts/utilities';
import NumberOfPointsInTasksCompletedOverTimeVisualization from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualization';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import TaskModel from 'src/javascripts/models/TaskModel';
import StampCardModel from 'src/javascripts/models/StampCardModel';
import { PAGE_SIZE_STAMP, PAGE_SIZE_TASK } from 'src/javascripts/clients/ResourceClientConfig';
import PodPageModel from 'src/javascripts/models/PodPageModel';
import Constants from 'src/javascripts/Constants';
import PlaceholderImagePod from 'src/assets/PlaceholderImagePod.png';
import AlertDialog from 'src/javascripts/components/AlertDialog';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const tabIdxToDisplayMap: any = {
    0: 'task',
    1: 'stamp',
    2: 'progress',
};

export interface IPodPageState {
    data: PodPageModel;
    response: {
        state: string;
        errorMessage: string | null;
    };
    editMode: {
        name: {
            isEditMode: boolean;
            editModeValue: string;
        };
        description: {
            isEditMode: boolean;
            editModeValue: string;
        };
        imageLink: {
            isEditMode: boolean;
            editModeValue: string | null;
        };
    };
}
export interface ITaskState {
    data: any;
    response: {
        state: string;
        errorMessage: string | null;
    };
    filter: {
        filterNameOrDescription: string;
        filterIsComplete: boolean;
        filterIsNotComplete: boolean;
        filterIsStar: boolean;
        filterIsNotStar: boolean;
        filterIsPin: boolean;
        filterIsNotPin: boolean;
    };
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalNumberOfPages: number;
    };
}
export interface IStampCardState {
    data: StampCardModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
    filter: {
        filterNameOrDescription: string;
        filterIsCollect: boolean;
        filterIsNotCollect: boolean;
    };
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalNumberOfPages: number;
    };
}
const PagePod: React.FC = () => {
    const { id: idPod } = useParams();
    const [tabIdx, setTabIdx] = useState(0);
    const [podPageState, setPodPageState] = useState<IPodPageState>({
        editMode: {
            name: {
                isEditMode: false,
                editModeValue: '',
            },
            description: {
                isEditMode: false,
                editModeValue: '',
            },
            imageLink: {
                isEditMode: false,
                editModeValue: '', // TODO what to show during loading? maybe blank imageLink?
            },
        },
        data: new PodPageModel(null, true),
        response: {
            state: Constants.RESPONSE_STATE_LOADING,
            errorMessage: null,
        },
    });

    // filter tasks
    const [taskState, setTaskState] = useState<ITaskState>({
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_LOADING,
            errorMessage: null,
        },
        filter: {
            filterNameOrDescription: '',
            filterIsComplete: true,
            filterIsNotComplete: true,
            filterIsStar: true,
            filterIsNotStar: true,
            filterIsPin: true,
            filterIsNotPin: true,
        },
        pagination: {
            pageNumber: 0,
            pageSize: Number(PAGE_SIZE_TASK),
            totalNumberOfPages: 1,
        },
    });

    // filter stamps
    const [stampCardState, setStampCardState] = useState<IStampCardState>({
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_LOADING,
            errorMessage: null,
        },
        filter: {
            filterNameOrDescription: '',
            filterIsCollect: true,
            filterIsNotCollect: true,
        },
        pagination: {
            pageNumber: 0,
            pageSize: Number(PAGE_SIZE_STAMP),
            totalNumberOfPages: 1,
        },
    });

    const handleGetPodPage = (): void => {
        ResourceClient.postResource('api/GetPodPage', { id: String(idPod) })
            .then((responseJson: any) => {
                setPodPageState((prevState: IPodPageState) => {
                    const podPageModel = new PodPageModel(responseJson);
                    return {
                        ...prevState,
                        editMode: {
                            ...prevState.editMode,
                            name: {
                                ...prevState.editMode.name,
                                editModeValue: podPageModel.getName(),
                            },
                            description: {
                                ...prevState.editMode.description,
                                editModeValue: String(
                                    podPageModel.getDescription() !== null ? podPageModel.getDescription() : '',
                                ),
                            },
                            imageLink: {
                                ...prevState.editMode.imageLink,
                                editModeValue: podPageModel.getImageLink(),
                            },
                        },
                        data: podPageModel,
                        response: {
                            ...prevState.response,
                            state: Constants.RESPONSE_STATE_SUCCESS,
                            errorMessage: null,
                        },
                    };
                });
            })
            .catch((responseError: any) => {
                setPodPageState((prevState: IPodPageState) => {
                    return {
                        ...prevState,
                        response: {
                            ...prevState.response,
                            state: Constants.RESPONSE_STATE_ERROR,
                            errorMessage: responseError,
                        },
                    };
                });
            });
    };
    const handleGetTasksAssociatedWithPod = (requestBodyObject: Record<string, unknown>): void => {
        ResourceClient.postResource('api/app/GetTasksAssociatedWithPod', requestBodyObject)
            .then((responseJson: any) => {
                setTaskState((prevState: ITaskState) => {
                    return {
                        ...prevState,
                        data: responseJson.map((datapoint: any) => {
                            return new TaskModel(datapoint);
                        }),
                        response: {
                            ...prevState.response,
                            state: Constants.RESPONSE_STATE_SUCCESS,
                            errorMessage: null,
                        },
                        pagination: {
                            ...prevState.pagination,
                            totalNumberOfPages: responseJson.totalPages,
                        },
                    };
                });
            })
            .catch((responseError: any) => {
                setTaskState((prevState: ITaskState) => {
                    return {
                        ...prevState,
                        response: {
                            ...prevState.response,
                            state: Constants.RESPONSE_STATE_ERROR,
                            errorMessage: responseError,
                        },
                    };
                });
            });
    };

    const handleGetStampCardsAssociatedWithPod = (requestBodyObject: Record<string, unknown>): void => {
        ResourceClient.postResource('api/app/GetStampCardsAssociatedWithPod', requestBodyObject)
            .then((responseJson: any) => {
                setStampCardState((prevState: IStampCardState) => {
                    return {
                        ...prevState,
                        data: responseJson.map((datapoint: any) => {
                            return new StampCardModel(datapoint);
                        }),
                        response: {
                            ...prevState.response,
                            state: Constants.RESPONSE_STATE_SUCCESS,
                            errorMessage: null,
                        },
                        pagination: {
                            ...prevState.pagination,
                            totalNumberOfPages: responseJson.totalPages,
                        },
                    };
                });
            })
            .catch((responseError: any) => {
                setStampCardState((prevState: IStampCardState) => {
                    return {
                        ...prevState,
                        response: {
                            ...prevState.response,
                            state: Constants.RESPONSE_STATE_ERROR,
                            errorMessage: responseError,
                        },
                    };
                });
            });
    };

    const handleUpdatePodPage = (responseJson: any): void => {
        setPodPageState((prevState: any) => {
            return {
                ...prevState,
                data: new PodPageModel(responseJson),
            };
        });
    };

    const debouncedHandleChangeFilterNameOrDescription = _.debounce(
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            if (tabIdxToDisplayMap[tabIdx] === 'task') {
                setTaskState((prevState: ITaskState) => {
                    return {
                        ...prevState,
                        filter: { ...prevState.filter, filterNameOrDescription: event.target.value },
                    };
                });
            } else if (tabIdxToDisplayMap[tabIdx] === 'stamp') {
                setStampCardState((prevState: IStampCardState) => {
                    return {
                        ...prevState,
                        filter: { ...prevState.filter, filterNameOrDescription: event.target.value },
                    };
                });
            }
        },
        500,
    );
    useEffect(() => {
        handleGetPodPage();
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        handleGetTasksAssociatedWithPod({
            filterNameOrDescription: taskState.filter.filterNameOrDescription,
            filterIsComplete: taskState.filter.filterIsComplete,
            filterIsNotComplete: taskState.filter.filterIsNotComplete,
            filterIsStar: taskState.filter.filterIsStar,
            filterIsNotStar: taskState.filter.filterIsNotStar,
            filterIsPin: taskState.filter.filterIsPin,
            filterIsNotPin: taskState.filter.filterIsNotPin,
        });
        // eslint-disable-next-line
    }, [taskState.filter, tabIdx]);
    useEffect(() => {
        handleGetStampCardsAssociatedWithPod({
            filterNameOrDescription: stampCardState.filter.filterNameOrDescription,
            filterIsCollect: stampCardState.filter.filterIsCollect,
            filterIsNotCollect: stampCardState.filter.filterIsNotCollect,
        });
        // eslint-disable-next-line
    }, [stampCardState.filter, tabIdx]);

    const isErrorEditModeValuePodName =
        getInputText(podPageState.editMode.name.editModeValue).length < Constants.POD_NAME_MIN_LENGTH_CHARACTERS ||
        getInputText(podPageState.editMode.name.editModeValue).length > Constants.POD_NAME_MAX_LENGTH_CHARACTERS;
    const isErrorEditModeValuePodDescription =
        getInputText(podPageState.editMode.description.editModeValue).length >
        Constants.POD_DESCRIPTION_MAX_LENGTH_CHARACTERS;

    return (
        <Box sx={{ minHeight: '100vh', background: THEME.palette.other.gradient }}>
            {podPageState.response.state === Constants.RESPONSE_STATE_ERROR &&
            podPageState.response.errorMessage !== null ? (
                <AlertDialog
                    title="Error"
                    message={podPageState.response.errorMessage}
                    isOpen={podPageState.response.state === Constants.RESPONSE_STATE_ERROR}
                    handleClose={() => {
                        setPodPageState((prevState: IPodPageState) => {
                            return {
                                ...prevState,
                                response: {
                                    ...prevState.response,
                                    state: Constants.RESPONSE_STATE_UNSTARTED,
                                    errorMessage: null,
                                },
                            };
                        });
                    }}
                />
            ) : null}
            <Box>
                <Grid container direction="row">
                    <Grid item sx={{ padding: '24px' }}>
                        <AvatarImageEditor
                            imageUploadHandler={(imageAsBase64String: string) => {
                                ResourceClient.postResource('api/app/UpdatePod', {
                                    id: idPod,
                                    imageAsBase64String: getInputText(imageAsBase64String),
                                })
                                    .then((responseJson: any) => {
                                        handleUpdatePodPage(responseJson);
                                    })
                                    .catch(() => {});
                            }}
                            imageLink={podPageState.data.getImageLink()}
                            placeholderImage={PlaceholderImagePod}
                            isReadOnly={!podPageState.data.getIsPodModerator()}
                        />
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '16px',
                                marginBottom: '12px',
                            }}
                        >
                            {!podPageState.data.getIsPodMember() ? (
                                <IconButtonJoinPod
                                    handleJoinPod={() => {
                                        ResourceClient.postResource('api/app/JoinPod', {
                                            id: String(idPod),
                                        })
                                            .then(() => {
                                                handleGetPodPage();
                                            })
                                            .catch(() => {});
                                    }}
                                />
                            ) : null}
                            {podPageState.data.getIsPodMember() && !podPageState.data.getIsPodModerator() ? (
                                <React.Fragment>
                                    <IconButton
                                        edge="end"
                                        aria-label="icon-button-is-member"
                                        sx={{
                                            cursor: 'default',
                                            color: THEME.palette.info.main,
                                        }}
                                        disableRipple={true}
                                    >
                                        <Tooltip title={'You are a member'} placement="bottom">
                                            <PersonIcon />
                                        </Tooltip>
                                    </IconButton>
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ marginLeft: '8px', marginRight: '8px' }}
                                    />
                                </React.Fragment>
                            ) : null}
                            {podPageState.data.getIsPodModerator() ? (
                                <React.Fragment>
                                    <IconButton
                                        edge="end"
                                        aria-label="icon-button-is-moderator"
                                        sx={{
                                            cursor: 'default',
                                            color: THEME.palette.info.main,
                                        }}
                                        disableRipple={true}
                                    >
                                        <Tooltip title={'You are a moderator'} placement="bottom">
                                            <ManageAccountsIcon />
                                        </Tooltip>
                                    </IconButton>
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ marginLeft: '8px', marginRight: '8px' }}
                                    />
                                </React.Fragment>
                            ) : null}
                            {podPageState.data.getIsPodMember() ? (
                                <React.Fragment>
                                    <IconButtonInviteUsersJoinPodModal idPod={idPod ?? ''} />
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ marginLeft: '8px', marginRight: '8px' }}
                                    />
                                </React.Fragment>
                            ) : null}
                            {podPageState.data.getIsPodModerator() ? (
                                <React.Fragment>
                                    <IconButtonAddPodModeratorsModal idPod={idPod ?? ''} />
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ marginLeft: '8px', marginRight: '8px' }}
                                    />
                                </React.Fragment>
                            ) : null}
                            {podPageState.data.getIsPodMember() && !podPageState.data.getIsPodModerator() ? (
                                <React.Fragment>
                                    <IconButtonSendBecomePodModeratorRequest
                                        isSentBecomePodModeratorRequest={podPageState.data.getIsSentBecomePodModeratorRequest()}
                                        handleSendBecomePodModeratorRequest={() => {
                                            ResourceClient.postResource('api/app/SendBecomePodModeratorRequest', {
                                                id: String(idPod),
                                            })
                                                .then(() => {
                                                    handleGetPodPage();
                                                })
                                                .catch(() => {});
                                        }}
                                    />
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ marginLeft: '8px', marginRight: '8px' }}
                                    />
                                </React.Fragment>
                            ) : null}
                            {podPageState.data.getIsPodModerator() ? (
                                <React.Fragment>
                                    <IconButtonManagePendingBecomePodModeratorRequestsModal
                                        idPod={idPod ?? ''}
                                        numberOfPendingBecomeModeratorRequests={podPageState.data.getNumberOfPendingBecomeModeratorRequests()}
                                        handleUpdatePodPage={() => {
                                            handleGetPodPage();
                                        }}
                                    />
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ marginLeft: '8px', marginRight: '8px' }}
                                    />
                                </React.Fragment>
                            ) : null}
                            {podPageState.data.getIsPodMember() ? (
                                <IconButtonLeavePod
                                    handleLeavePod={() => {
                                        ResourceClient.postResource('api/app/LeavePod', {
                                            id: String(idPod),
                                        })
                                            .then(() => {
                                                handleGetPodPage();
                                            })
                                            .catch(() => {});
                                    }}
                                />
                            ) : null}
                        </Box>
                        {podPageState.response.state !== Constants.RESPONSE_STATE_LOADING &&
                        podPageState.data.getUserBubblesPodMember() !== null ? (
                            <Grid container direction="row" sx={{ marginTop: '16px', marginBottom: '12px' }}>
                                <Grid item sx={{ display: 'flex', width: '100%' }}>
                                    <UserListButton
                                        labelText={getUserListButtonText(
                                            podPageState.data.getUserBubblesPodMemberTotalNumber(),
                                            'member',
                                            'members',
                                        )}
                                        userBubbles={podPageState.data.getUserBubblesPodMember()}
                                        sortByTimestampLabel="time become member"
                                        apiPath={'api/app/GetUserBubblesPodMember'}
                                        apiPayload={{ id: String(idPod) }}
                                        modalTitle="Pod Members"
                                        isUseDateTimeDateAndTime={false}
                                    />
                                </Grid>
                            </Grid>
                        ) : null}
                        {podPageState.response.state !== Constants.RESPONSE_STATE_LOADING &&
                        podPageState.data.getUserBubblesPodModerator() !== null ? (
                            <Grid container direction="row" sx={{ marginBottom: '12px' }}>
                                <Grid item sx={{ display: 'flex', width: '100%' }}>
                                    <UserListButton
                                        labelText={getUserListButtonText(
                                            podPageState.data.getUserBubblesPodModeratorTotalNumber(),
                                            'moderator',
                                            'moderators',
                                        )}
                                        userBubbles={podPageState.data.getUserBubblesPodModerator()}
                                        sortByTimestampLabel="time become moderator"
                                        apiPath={'api/app/GetUserBubblesPodModerator'}
                                        apiPayload={{ id: String(idPod) }}
                                        modalTitle="Pod Moderators"
                                        isUseDateTimeDateAndTime={false}
                                    />
                                </Grid>
                            </Grid>
                        ) : null}
                        {podPageState.data.getIsPodMember() ? (
                            <Box sx={{ marginBottom: '12px' }}>
                                <CreateStampModalButton idPod={idPod === undefined || idPod === null ? null : idPod} />
                            </Box>
                        ) : null}
                        {podPageState.data.getIsPodModerator() ? (
                            <Box sx={{ marginBottom: '12px' }}>
                                <CreateTaskModalButton
                                    idPod={idPod ?? null}
                                    handleUpdate={() => {
                                        handleGetTasksAssociatedWithPod({
                                            filterNameOrDescription: taskState.filter.filterNameOrDescription,
                                            filterIsComplete: taskState.filter.filterIsComplete,
                                            filterIsNotComplete: taskState.filter.filterIsNotComplete,
                                            filterIsStar: taskState.filter.filterIsStar,
                                            filterIsNotStar: taskState.filter.filterIsNotStar,
                                            filterIsPin: taskState.filter.filterIsPin,
                                            filterIsNotPin: taskState.filter.filterIsNotPin,
                                        });
                                    }}
                                />
                            </Box>
                        ) : null}
                    </Grid>
                    <Grid item sx={{ width: '1000px', padding: '24px' }}>
                        <Grid container direction="column">
                            <Grid item sx={{ width: '100%' }}>
                                {podPageState.editMode.name.isEditMode ? (
                                    <TextField
                                        id="pod-edit-name"
                                        defaultValue={podPageState.data.getName()}
                                        fullWidth
                                        value={podPageState.editMode.name.editModeValue}
                                        onBlur={() => {
                                            setPodPageState((prevState: IPodPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        name: {
                                                            ...prevState.editMode.name,
                                                            isEditMode: false,
                                                            ...(isErrorEditModeValuePodName
                                                                ? {
                                                                      editModeValue: prevState.data.name,
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValuePodName) {
                                                ResourceClient.postResource('api/app/UpdatePod', {
                                                    id: idPod,
                                                    name: getInputText(podPageState.editMode.name.editModeValue),
                                                })
                                                    .then((responseJson: any) => {
                                                        handleUpdatePodPage(responseJson);
                                                    })
                                                    .catch((responseError: any) => {
                                                        setPodPageState((prevState: IPodPageState) => {
                                                            return {
                                                                ...prevState,
                                                                response: {
                                                                    ...prevState.response,
                                                                    state: Constants.RESPONSE_STATE_ERROR,
                                                                    errorMessage: Constants.RESPONSE_GET_ERROR_MESSAGE(
                                                                        responseError?.response?.data?.message,
                                                                    ),
                                                                },
                                                            };
                                                        });
                                                    });
                                            }
                                        }}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setPodPageState((prevState: IPodPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        name: {
                                                            ...prevState.editMode.name,
                                                            editModeValue: event.target.value,
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        onKeyDown={(event: React.KeyboardEvent) => {
                                            if (event.key === 'Enter' && !event.shiftKey) {
                                                setPodPageState((prevState: IPodPageState) => {
                                                    return {
                                                        ...prevState,
                                                        editMode: {
                                                            ...prevState.editMode,
                                                            name: {
                                                                ...prevState.editMode.name,
                                                                isEditMode: false,
                                                                ...(isErrorEditModeValuePodName
                                                                    ? {
                                                                          editModeValue: prevState.data.name,
                                                                      }
                                                                    : {}),
                                                            },
                                                        },
                                                    };
                                                });
                                                if (!isErrorEditModeValuePodName) {
                                                    ResourceClient.postResource('api/app/UpdatePod', {
                                                        id: idPod,
                                                        name: getInputText(podPageState.editMode.name.editModeValue),
                                                    })
                                                        .then((responseJson: any) => {
                                                            handleUpdatePodPage(responseJson);
                                                        })
                                                        .catch((responseError: any) => {
                                                            setPodPageState((prevState: IPodPageState) => {
                                                                return {
                                                                    ...prevState,
                                                                    response: {
                                                                        ...prevState.response,
                                                                        state: Constants.RESPONSE_STATE_ERROR,
                                                                        errorMessage:
                                                                            Constants.RESPONSE_GET_ERROR_MESSAGE(
                                                                                responseError?.response?.data?.message,
                                                                            ),
                                                                    },
                                                                };
                                                            });
                                                        });
                                                }
                                            }
                                        }}
                                        helperText={Constants.POD_INPUT_NAME_HELPER_TEXT(
                                            getInputText(podPageState.editMode.name.editModeValue).length,
                                        )}
                                        error={isErrorEditModeValuePodName}
                                    />
                                ) : (
                                    <Typography
                                        variant="h3"
                                        onClick={() => {
                                            setPodPageState((prevState: IPodPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        name: {
                                                            ...prevState.editMode.name,
                                                            isEditMode: podPageState.data.getIsPodModerator(),
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ height: '60px', overflowY: 'auto' }}
                                    >
                                        {podPageState.data.getName()}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item sx={{ marginTop: '24px', marginBottom: '32px' }}>
                                <Divider variant="fullWidth" />
                            </Grid>
                            <Grid
                                item
                                sx={{
                                    height: '400px',
                                    overflowY: 'auto',
                                    width: '100%',
                                }}
                            >
                                {podPageState.editMode.description.isEditMode ? (
                                    <TextField
                                        id="user-edit-bio"
                                        multiline
                                        maxRows={12}
                                        defaultValue={podPageState.data.getDescription()}
                                        fullWidth
                                        value={podPageState.editMode.description.editModeValue}
                                        onBlur={() => {
                                            setPodPageState((prevState: IPodPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        description: {
                                                            ...prevState.editMode.description,
                                                            isEditMode: false,
                                                            ...(isErrorEditModeValuePodDescription
                                                                ? {
                                                                      editModeValue: prevState.data.description ?? '',
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValuePodDescription) {
                                                ResourceClient.postResource('api/app/UpdatePod', {
                                                    id: idPod,
                                                    description:
                                                        getInputText(podPageState.editMode.description.editModeValue)
                                                            .length === 0
                                                            ? null
                                                            : getInputText(
                                                                  podPageState.editMode.description.editModeValue,
                                                              ),
                                                })
                                                    .then((responseJson: any) => {
                                                        handleUpdatePodPage(responseJson);
                                                    })
                                                    .catch(() => {});
                                            }
                                        }}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setPodPageState((prevState: IPodPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        description: {
                                                            ...prevState.editMode.description,
                                                            editModeValue: event.target.value,
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        onKeyDown={(event: React.KeyboardEvent) => {
                                            if (event.key === 'Enter' && !event.shiftKey) {
                                                setPodPageState((prevState: IPodPageState) => {
                                                    return {
                                                        ...prevState,
                                                        editMode: {
                                                            ...prevState.editMode,
                                                            description: {
                                                                ...prevState.editMode.description,
                                                                isEditMode: false,
                                                                ...(isErrorEditModeValuePodDescription
                                                                    ? {
                                                                          editModeValue:
                                                                              prevState.data.description ?? '',
                                                                      }
                                                                    : {}),
                                                            },
                                                        },
                                                    };
                                                });
                                                if (!isErrorEditModeValuePodDescription) {
                                                    ResourceClient.postResource('api/app/UpdatePod', {
                                                        id: idPod,
                                                        description:
                                                            getInputText(
                                                                podPageState.editMode.description.editModeValue,
                                                            ).length === 0
                                                                ? null
                                                                : getInputText(
                                                                      podPageState.editMode.description.editModeValue,
                                                                  ),
                                                    })
                                                        .then((responseJson: any) => {
                                                            handleUpdatePodPage(responseJson);
                                                        })
                                                        .catch(() => {});
                                                }
                                            }
                                        }}
                                        helperText={Constants.POD_INPUT_DESCRIPTION_HELPER_TEXT(
                                            getInputText(podPageState.editMode.description.editModeValue).length,
                                        )}
                                        error={isErrorEditModeValuePodDescription}
                                        inputProps={{ style: { fontFamily: 'monospace' } }}
                                    />
                                ) : (
                                    <Typography
                                        variant="body1"
                                        fontFamily="monospace"
                                        onClick={() => {
                                            setPodPageState((prevState: IPodPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        description: {
                                                            ...prevState.editMode.description,
                                                            isEditMode: podPageState.data.getIsPodModerator(),
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {podPageState.data.getDescription() !== null
                                            ? podPageState.data.getDescription()
                                            : ' '}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ marginBottom: '24px' }}>
                <Tabs
                    value={tabIdx}
                    onChange={(e, activeTabIdx: number) => {
                        setTabIdx(activeTabIdx);
                    }}
                    indicatorColor="primary"
                    centered
                >
                    <Tab sx={{ width: '150px' }} label="Tasks" />
                    <Tab sx={{ width: '150px' }} label="Stamps" />
                    <Tab sx={{ width: '150px' }} label="Progress" />
                </Tabs>
            </Box>
            {tabIdxToDisplayMap[tabIdx] === 'task' ? (
                <React.Fragment>
                    <Box
                        sx={{
                            paddingLeft: '24px',
                            paddingRight: '24px',
                            paddingBottom: '24px',
                            paddingTop: '0px',
                            justifyContent: 'center',
                            display: 'flex',
                        }}
                    >
                        <FilterTasks
                            handleChangeText={debouncedHandleChangeFilterNameOrDescription}
                            handleUpdateFilterState={(
                                event: React.ChangeEvent<HTMLInputElement>,
                                filterKey: string,
                            ) => {
                                setTaskState((prevState: ITaskState) => {
                                    return {
                                        ...prevState,
                                        filter: {
                                            ...prevState.filter,
                                            [filterKey]: event.target.checked,
                                        },
                                    };
                                });
                            }}
                            isComplete={taskState.filter.filterIsComplete}
                            isNotComplete={taskState.filter.filterIsNotComplete}
                            isStar={taskState.filter.filterIsStar}
                            isNotStar={taskState.filter.filterIsNotStar}
                            isPin={taskState.filter.filterIsPin}
                            isNotPin={taskState.filter.filterIsNotPin}
                            isUseFilterComplete={true}
                            isUseFilterStar={true}
                            isUseFilterPin={true}
                        />
                    </Box>
                    <Box sx={{ padding: '24px 96px 96px 96px', justifyContent: 'center', display: 'flex' }}>
                        <TaskCardList
                            tasks={taskState.data}
                            isAuthorizedToComplete={podPageState.data.getIsPodMember()}
                            isReadOnlyTaskBody={!podPageState.data.getIsPodModerator()}
                            isReadOnlyTaskNotes={!podPageState.data.getIsPodMember()}
                            isDisplayViewPodLink={false}
                            isDisplayOptionsStarPinDelete={podPageState.data.getIsPodMember()}
                            isAuthorizedToDelete={podPageState.data.getIsPodModerator()}
                            handleUpdateUponToggleTaskComplete={() => {}}
                        />
                    </Box>
                </React.Fragment>
            ) : null}
            {tabIdxToDisplayMap[tabIdx] === 'stamp' ? (
                <React.Fragment>
                    <Box
                        sx={{
                            paddingLeft: '24px',
                            paddingRight: '24px',
                            paddingBottom: '24px',
                            paddingTop: '0px',
                            justifyContent: 'center',
                            display: 'flex',
                        }}
                    >
                        <FilterStamps
                            handleChangeText={debouncedHandleChangeFilterNameOrDescription}
                            handleUpdateFilterState={(
                                event: React.ChangeEvent<HTMLInputElement>,
                                filterKey: string,
                            ) => {
                                setStampCardState((prevState: IStampCardState) => {
                                    return {
                                        ...prevState,
                                        filter: {
                                            ...prevState.filter,
                                            [filterKey]: event.target.checked,
                                        },
                                    };
                                });
                            }}
                            isStampCollected={stampCardState.filter.filterIsCollect}
                            isStampNotCollected={stampCardState.filter.filterIsNotCollect}
                            isUseKeyStampCollected={true}
                        />
                    </Box>
                    <Box sx={{ padding: '24px 96px 96px 96px', justifyContent: 'center', display: 'flex' }}>
                        <StampCardList
                            stampCards={stampCardState.data}
                            isShowCreateStampModal={true}
                            isLoading={stampCardState.response.state === Constants.RESPONSE_STATE_LOADING}
                            handleChangePaginationPageNumber={() => {}}
                            paginationTotalPages={0}
                        />
                    </Box>
                </React.Fragment>
            ) : null}
            {tabIdxToDisplayMap[tabIdx] === 'progress' ? (
                <NumberOfPointsInTasksCompletedOverTimeVisualization
                    apiPath={'api/app/GetNumberOfPointsInTasksCompletedOverTimeVisualizationAssociatedWithPod'}
                    apiPayload={{ id: idPod }}
                    refreshSwitchValue={true}
                />
            ) : null}
        </Box>
    );
};

export default PagePod;
