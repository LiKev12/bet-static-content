import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { Box, Divider, Grid, Typography, Tab, Tabs, TextField } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import AvatarImageEditor from 'src/javascripts/components/AvatarImageEditor';
import PodCardList from 'src/javascripts/components/PodCardList';
import FilterTasks from 'src/javascripts/components/FilterTasks';
import FilterStamps from 'src/javascripts/components/FilterStamps';
import FilterPods from 'src/javascripts/components/FilterPods';
import UserListButton from 'src/javascripts/components/UserListButton';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import StampCardList from 'src/javascripts/components/StampCardList';
import { getInputText, getUserListButtonText } from 'src/javascripts/utilities';
import { PAGE_SIZE_POD, PAGE_SIZE_STAMP, PAGE_SIZE_TASK } from 'src/javascripts/clients/ResourceClientConfig';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import UserPageModel from 'src/javascripts/models/UserPageModel';
import TaskModel from 'src/javascripts/models/TaskModel';
import StampCardModel from 'src/javascripts/models/StampCardModel';
import PodCardModel from 'src/javascripts/models/PodCardModel';
import Constants from 'src/javascripts/Constants';
import { MOCK_MY_USER_ID } from 'src/javascripts/mocks/Mocks';
import PlaceholderImageUser from 'src/assets/PlaceholderImageUser.png';
import AlertDialog from 'src/javascripts/components/AlertDialog';
import IconButtonFollowUser from 'src/javascripts/components/IconButtonFollowUser';
import IconButtonManagePendingFollowUserRequestsModal from 'src/javascripts/components/IconButtonManagePendingFollowUserRequestsModal';

const tabIdxToDisplayMap: any = {
    0: 'pod',
    1: 'stamp',
    2: 'task',
};
export interface IUserPageState {
    data: UserPageModel;
    response: {
        state: string;
        errorMessage: string | null;
    };
    editMode: {
        username: {
            isEditMode: boolean;
            editModeValue: string;
        };
        name: {
            isEditMode: boolean;
            editModeValue: string;
        };
        bio: {
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
export interface IPodCardState {
    data: any;
    response: {
        state: string;
        errorMessage: string | null;
    };
    filter: {
        filterNameOrDescription: string;
        filterIsPublic: boolean;
        filterIsNotPublic: boolean;
        filterIsMember: boolean;
        filterIsNotMember: boolean;
        filterIsModerator: boolean;
        filterIsNotModerator: boolean;
    };
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalNumberOfPages: number;
    };
}
export interface IStampCardState {
    data: any;
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
const PageUser: React.FC = () => {
    const { id: idUser } = useParams();
    const [tabIdx, setTabIdx] = useState(0);
    const [userPageState, setUserPageState] = useState<IUserPageState>({
        editMode: {
            username: {
                isEditMode: false,
                editModeValue: '',
            },
            name: {
                isEditMode: false,
                editModeValue: '',
            },
            bio: {
                isEditMode: false,
                editModeValue: '',
            },
            imageLink: {
                isEditMode: false,
                editModeValue: '', // TODO what to show during loading? maybe blank imageLink?
            },
        },
        data: new UserPageModel(null, true),
        response: {
            state: Constants.RESPONSE_STATE_LOADING,
            errorMessage: null,
        },
    });

    // filter pods
    const [podCardState, setPodCardState] = useState<IPodCardState>({
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_LOADING,
            errorMessage: null,
        },
        filter: {
            filterNameOrDescription: '',
            filterIsPublic: true,
            filterIsNotPublic: true,
            filterIsMember: true,
            filterIsNotMember: true,
            filterIsModerator: true,
            filterIsNotModerator: true,
        },
        pagination: {
            pageNumber: 0,
            pageSize: Number(PAGE_SIZE_POD),
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
    const handleGetResourceUserPage = (pathApi: string, queryParamsObject: Record<string, unknown>): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                setUserPageState((prevState: IUserPageState) => {
                    const userPageModel = new UserPageModel(responseJson);
                    return {
                        ...prevState,
                        editMode: {
                            ...prevState.editMode,
                            username: {
                                ...prevState.editMode.username,
                                editModeValue: userPageModel.getUsername(),
                            },
                            name: {
                                ...prevState.editMode.name,
                                editModeValue: userPageModel.getName(),
                            },
                            bio: {
                                ...prevState.editMode.bio,
                                editModeValue: String(userPageModel.getBio() !== null ? userPageModel.getBio() : ''),
                            },
                            imageLink: {
                                ...prevState.editMode.imageLink,
                                editModeValue: userPageModel.getImageLink(),
                            },
                        },
                        data: userPageModel,
                        response: {
                            state: Constants.RESPONSE_STATE_SUCCESS,
                            errorMessage: null,
                        },
                    };
                });
            })
            .catch((responseError: any) => {
                setUserPageState((prevState: IUserPageState) => {
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
    const handleGetResourceTasksPinnedAssociatedWithUser = (
        pathApi: string,
        queryParamsObject: Record<string, unknown>,
    ): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                setTaskState((prevState: ITaskState) => {
                    return {
                        ...prevState,
                        data: responseJson.content.map((datapoint: any) => {
                            return new TaskModel(datapoint);
                        }),
                        response: {
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
    const handleGetResourcePodsAssociatedWithUser = (
        pathApi: string,
        queryParamsObject: Record<string, unknown>,
    ): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                setPodCardState((prevState) => {
                    return {
                        ...prevState,
                        data: responseJson.content.map((datapoint: any) => {
                            return new PodCardModel(datapoint);
                        }),
                        response: {
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
                setPodCardState((prevState) => {
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
    const handleGetResourceStampsAssociatedWithUser = (
        pathApi: string,
        queryParamsObject: Record<string, unknown>,
    ): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                setStampCardState((prevState: IStampCardState) => {
                    return {
                        ...prevState,
                        data: responseJson.content.map((datapoint: any) => {
                            return new StampCardModel(datapoint);
                        }),
                        response: {
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

    const handleUpdateUserPage = (responseJson: any): void => {
        setUserPageState((prevState: any) => {
            return {
                ...prevState,
                data: new UserPageModel(responseJson),
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
            } else if (tabIdxToDisplayMap[tabIdx] === 'pod') {
                setPodCardState((prevState: IPodCardState) => {
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
        handleGetResourceUserPage(`api/user/read/users/${String(idUser)}/userPage`, {
            idUser: MOCK_MY_USER_ID,
        });
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        handleGetResourceTasksPinnedAssociatedWithUser(`api/user/read/users/${String(idUser)}/tasksPinned`, {
            idUser: MOCK_MY_USER_ID,
            filterNameOrDescription: taskState.filter.filterNameOrDescription,
            filterIsComplete: taskState.filter.filterIsComplete,
            filterIsNotComplete: taskState.filter.filterIsNotComplete,
            filterIsStar: taskState.filter.filterIsStar,
            filterIsNotStar: taskState.filter.filterIsNotStar,
            filterIsPin: taskState.filter.filterIsPin,
            filterIsNotPin: taskState.filter.filterIsNotPin,
        });
        // eslint-disable-next-line
    }, [taskState.filter]);
    useEffect(() => {
        handleGetResourcePodsAssociatedWithUser(`api/user/read/users/${String(idUser)}/pods`, {
            idUser: MOCK_MY_USER_ID,
            filterNameOrDescription: podCardState.filter.filterNameOrDescription,
            filterIsPublic: podCardState.filter.filterIsPublic,
            filterIsNotPublic: podCardState.filter.filterIsNotPublic,
            filterIsMember: podCardState.filter.filterIsMember,
            filterIsNotMember: podCardState.filter.filterIsNotMember,
            filterIsModerator: podCardState.filter.filterIsModerator,
            filterIsNotModerator: podCardState.filter.filterIsNotModerator,
            page: podCardState.pagination.pageNumber,
            size: podCardState.pagination.pageSize,
        });
        // eslint-disable-next-line
    }, [podCardState.filter]);
    useEffect(() => {
        handleGetResourceStampsAssociatedWithUser(`api/user/read/users/${String(idUser)}/stamps`, {
            idUser: MOCK_MY_USER_ID,
            filterNameOrDescription: stampCardState.filter.filterNameOrDescription,
            filterIsCollect: stampCardState.filter.filterIsCollect,
            filterIsNotCollect: stampCardState.filter.filterIsNotCollect,
        });
        // eslint-disable-next-line
    }, [stampCardState.filter]);
    const isErrorEditModeValueUserUsername =
        getInputText(userPageState.editMode.username.editModeValue).length <
            Constants.USER_USERNAME_MIN_LENGTH_CHARACTERS ||
        getInputText(userPageState.editMode.username.editModeValue).length >
            Constants.USER_USERNAME_MAX_LENGTH_CHARACTERS;
    const isErrorEditModeValueUserName =
        getInputText(userPageState.editMode.name.editModeValue).length < Constants.USER_NAME_MIN_LENGTH_CHARACTERS ||
        getInputText(userPageState.editMode.name.editModeValue).length > Constants.USER_NAME_MAX_LENGTH_CHARACTERS;
    const isErrorEditModeValueUserBio =
        getInputText(userPageState.editMode.bio.editModeValue).length > Constants.POD_DESCRIPTION_MAX_LENGTH_CHARACTERS;

    return (
        <Box sx={{ minHeight: '100vh', background: THEME.palette.other.gradient }}>
            {userPageState.response.state === Constants.RESPONSE_STATE_ERROR &&
            userPageState.response.errorMessage !== null ? (
                <AlertDialog
                    title="Error"
                    message={userPageState.response.errorMessage}
                    isOpen={userPageState.response.state === Constants.RESPONSE_STATE_ERROR}
                    handleClose={() => {
                        setUserPageState((prevState: IUserPageState) => {
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
                                ResourceClient.postResource(
                                    'api/user/update/userPage',
                                    { idUser },
                                    {
                                        id: idUser,
                                        imageAsBase64String: getInputText(imageAsBase64String),
                                    },
                                )
                                    .then((responseJson: any) => {
                                        handleUpdateUserPage(responseJson);
                                    })
                                    .catch(() => {});
                            }}
                            imageLink={userPageState.data.getImageLink()}
                            placeholderImage={PlaceholderImageUser}
                            isReadOnly={!userPageState.data.getIsMe()}
                        />
                        <Box
                            sx={{
                                marginTop: '16px',
                                paddingBottom: '8px',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            {userPageState.editMode.name.isEditMode ? (
                                <TextField
                                    id="user-edit-name"
                                    defaultValue={userPageState.data.getName()}
                                    sx={{ maxWidth: '300px' }}
                                    value={userPageState.editMode.name.editModeValue}
                                    onBlur={() => {
                                        setUserPageState((prevState: IUserPageState) => {
                                            return {
                                                ...prevState,
                                                editMode: {
                                                    ...prevState.editMode,
                                                    name: {
                                                        ...prevState.editMode.name,
                                                        isEditMode: false,
                                                        ...(isErrorEditModeValueUserName
                                                            ? {
                                                                  editModeValue: prevState.data.name,
                                                              }
                                                            : {}),
                                                    },
                                                },
                                            };
                                        });
                                        if (!isErrorEditModeValueUserName) {
                                            ResourceClient.postResource(
                                                'api/user/update/userPage',
                                                {
                                                    idUser,
                                                },
                                                {
                                                    id: idUser,
                                                    name: getInputText(userPageState.editMode.name.editModeValue),
                                                },
                                            )
                                                .then((responseJson: any) => {
                                                    handleUpdateUserPage(responseJson);
                                                })
                                                .catch(() => {});
                                        }
                                    }}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setUserPageState((prevState: IUserPageState) => {
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
                                            setUserPageState((prevState: IUserPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        name: {
                                                            ...prevState.editMode.name,
                                                            isEditMode: false,
                                                            ...(isErrorEditModeValueUserName
                                                                ? {
                                                                      editModeValue: prevState.data.name,
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValueUserName) {
                                                ResourceClient.postResource(
                                                    'api/user/update/userPage',
                                                    {
                                                        idUser,
                                                    },
                                                    {
                                                        id: idUser,
                                                        name: getInputText(userPageState.editMode.name.editModeValue),
                                                    },
                                                )
                                                    .then((responseJson: any) => {
                                                        handleUpdateUserPage(responseJson);
                                                    })
                                                    .catch(() => {});
                                            }
                                        }
                                    }}
                                    helperText={Constants.USER_INPUT_NAME_HELPER_TEXT(
                                        getInputText(userPageState.editMode.name.editModeValue).length,
                                    )}
                                    error={isErrorEditModeValueUserName}
                                />
                            ) : (
                                <Typography
                                    variant="h5"
                                    onClick={() => {
                                        setUserPageState((prevState: IUserPageState) => {
                                            return {
                                                ...prevState,
                                                editMode: {
                                                    ...prevState.editMode,
                                                    name: {
                                                        ...prevState.editMode.name,
                                                        isEditMode: userPageState.data.getIsMe(),
                                                    },
                                                },
                                            };
                                        });
                                    }}
                                >
                                    {userPageState.data.getName()}
                                </Typography>
                            )}
                        </Box>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px',
                            }}
                        >
                            {userPageState.data.getIsMe() ? (
                                <React.Fragment>
                                    <IconButtonFollowUser
                                        isMe={userPageState.data.getIsMe()}
                                        isFollowedByMe={userPageState.data.getIsFollowedByMe()}
                                        isFollowRequestSentNotYetAccepted={userPageState.data.getIsFollowRequestSentNotYetAccepted()}
                                        handleSendFollowRequest={() => {
                                            ResourceClient.postResource(
                                                'api/user/update/sendFollowUserRequest',
                                                { idUser: MOCK_MY_USER_ID },
                                                {
                                                    idUserReceiveFollowRequest: idUser,
                                                },
                                            )
                                                .then(() => {
                                                    handleGetResourceUserPage(
                                                        `api/user/read/users/${String(idUser)}/userPage`,
                                                        {
                                                            idUser: MOCK_MY_USER_ID,
                                                        },
                                                    );
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
                            ) : (
                                <IconButtonFollowUser
                                    isMe={userPageState.data.getIsMe()}
                                    isFollowedByMe={userPageState.data.getIsFollowedByMe()}
                                    isFollowRequestSentNotYetAccepted={userPageState.data.getIsFollowRequestSentNotYetAccepted()}
                                    handleSendFollowRequest={() => {
                                        ResourceClient.postResource(
                                            'api/user/update/sendFollowUserRequest',
                                            { idUser: MOCK_MY_USER_ID },
                                            {
                                                idUserReceiveFollowRequest: idUser,
                                            },
                                        )
                                            .then(() => {
                                                handleGetResourceUserPage(
                                                    `api/user/read/users/${String(idUser)}/userPage`,
                                                    {
                                                        idUser: MOCK_MY_USER_ID,
                                                    },
                                                );
                                            })
                                            .catch(() => {});
                                    }}
                                />
                            )}
                            {userPageState.data.getIsMe() ? (
                                <IconButtonManagePendingFollowUserRequestsModal
                                    numberOfPendingFollowUserRequests={userPageState.data.getNumberOfPendingFollowUserRequests()}
                                    handleUpdateUserPage={() => {
                                        handleGetResourceUserPage(`api/user/read/users/${String(idUser)}/userPage`, {
                                            idUser: MOCK_MY_USER_ID,
                                        });
                                    }}
                                />
                            ) : null}
                        </Box>
                        <Box>
                            <Grid container direction="row" sx={{ marginBottom: '12px' }}>
                                <Grid item sx={{ display: 'flex', width: '100%' }}>
                                    <UserListButton
                                        labelText={getUserListButtonText(
                                            userPageState.data.getUserBubblesFollowerTotalNumber(),
                                            'follower',
                                            'followers',
                                        )}
                                        userBubbles={userPageState.data.getUserBubblesFollower()}
                                        sortByTimestampLabel="time of follow"
                                        apiPath={`api/user/read/users/${String(idUser)}/userBubblesFollower`}
                                        modalTitle="Followers"
                                        isUseDateTimeDateAndTime={false}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container direction="row">
                                <Grid item sx={{ display: 'flex', width: '100%' }}>
                                    <UserListButton
                                        labelText={getUserListButtonText(
                                            userPageState.data.getUserBubblesFollowingTotalNumber(),
                                            'following',
                                            'following',
                                        )}
                                        userBubbles={userPageState.data.getUserBubblesFollowing()}
                                        sortByTimestampLabel="time of follow"
                                        apiPath={`api/user/read/users/${String(idUser)}/userBubblesFollowing`}
                                        modalTitle="Following"
                                        isUseDateTimeDateAndTime={false}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item sx={{ width: '1000px', padding: '24px' }}>
                        <Grid container direction="column">
                            <Grid item sx={{ paddingBottom: '12px', width: '100%' }}>
                                {userPageState.editMode.username.isEditMode ? (
                                    <TextField
                                        id="user-edit-username"
                                        defaultValue={userPageState.data.getUsername()}
                                        fullWidth
                                        value={userPageState.editMode.username.editModeValue}
                                        onBlur={() => {
                                            setUserPageState((prevState: IUserPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        username: {
                                                            ...prevState.editMode.username,
                                                            isEditMode: false,
                                                            ...(isErrorEditModeValueUserUsername
                                                                ? {
                                                                      editModeValue: prevState.data.username,
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValueUserUsername) {
                                                ResourceClient.postResource(
                                                    'api/user/update/userPage',
                                                    {
                                                        idUser,
                                                    },
                                                    {
                                                        id: idUser,
                                                        username: getInputText(
                                                            userPageState.editMode.username.editModeValue,
                                                        ),
                                                    },
                                                )
                                                    .then((responseJson: any) => {
                                                        handleUpdateUserPage(responseJson);
                                                    })
                                                    .catch((responseError: any) => {
                                                        setUserPageState((prevState: IUserPageState) => {
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
                                            setUserPageState((prevState: IUserPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        username: {
                                                            ...prevState.editMode.username,
                                                            editModeValue: event.target.value,
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        onKeyDown={(event: React.KeyboardEvent) => {
                                            if (event.key === 'Enter' && !event.shiftKey) {
                                                setUserPageState((prevState: IUserPageState) => {
                                                    return {
                                                        ...prevState,
                                                        editMode: {
                                                            ...prevState.editMode,
                                                            username: {
                                                                ...prevState.editMode.username,
                                                                isEditMode: false,
                                                                ...(isErrorEditModeValueUserUsername
                                                                    ? {
                                                                          editModeValue: prevState.data.username,
                                                                      }
                                                                    : {}),
                                                            },
                                                        },
                                                    };
                                                });
                                                if (!isErrorEditModeValueUserUsername) {
                                                    ResourceClient.postResource(
                                                        'api/user/update/userPage',
                                                        {
                                                            idUser,
                                                        },
                                                        {
                                                            id: idUser,
                                                            username: getInputText(
                                                                userPageState.editMode.username.editModeValue,
                                                            ),
                                                        },
                                                    )
                                                        .then((responseJson: any) => {
                                                            handleUpdateUserPage(responseJson);
                                                        })
                                                        .catch((responseError: any) => {
                                                            setUserPageState((prevState: IUserPageState) => {
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
                                        helperText={Constants.USER_INPUT_USERNAME_HELPER_TEXT(
                                            getInputText(userPageState.editMode.username.editModeValue).length,
                                        )}
                                        error={isErrorEditModeValueUserUsername}
                                    />
                                ) : (
                                    <Typography
                                        variant="h3"
                                        onClick={() => {
                                            setUserPageState((prevState: IUserPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        username: {
                                                            ...prevState.editMode.username,
                                                            isEditMode: userPageState.data.getIsMe(),
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ height: '60px', overflowY: 'auto' }}
                                    >
                                        {`@${String(userPageState.data.getUsername())}`}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item sx={{ marginTop: '24px', marginBottom: '24px' }}>
                                <Divider variant="fullWidth" />
                            </Grid>
                            <Grid item sx={{ height: '400px', overflowY: 'auto', width: '100%' }}>
                                {userPageState.editMode.bio.isEditMode ? (
                                    <TextField
                                        id="user-edit-bio"
                                        multiline
                                        maxRows={12}
                                        defaultValue={userPageState.data.getBio()}
                                        fullWidth
                                        value={userPageState.editMode.bio.editModeValue}
                                        onBlur={() => {
                                            setUserPageState((prevState: IUserPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        bio: {
                                                            ...prevState.editMode.bio,
                                                            isEditMode: false,
                                                            ...(isErrorEditModeValueUserBio
                                                                ? {
                                                                      editModeValue: prevState.data.bio ?? '',
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValueUserBio) {
                                                ResourceClient.postResource(
                                                    'api/user/update/userPage',
                                                    {
                                                        idUser,
                                                    },
                                                    {
                                                        id: idUser,
                                                        bio:
                                                            getInputText(userPageState.editMode.bio.editModeValue)
                                                                .length === 0
                                                                ? null
                                                                : getInputText(
                                                                      userPageState.editMode.bio.editModeValue,
                                                                  ),
                                                    },
                                                )
                                                    .then((responseJson: any) => {
                                                        handleUpdateUserPage(responseJson);
                                                    })
                                                    .catch(() => {});
                                            }
                                        }}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setUserPageState((prevState: IUserPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        bio: {
                                                            ...prevState.editMode.bio,
                                                            editModeValue: event.target.value,
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        onKeyDown={(event: React.KeyboardEvent) => {
                                            if (event.key === 'Enter' && !event.shiftKey) {
                                                setUserPageState((prevState: IUserPageState) => {
                                                    return {
                                                        ...prevState,
                                                        editMode: {
                                                            ...prevState.editMode,
                                                            bio: {
                                                                ...prevState.editMode.bio,
                                                                isEditMode: false,
                                                                ...(isErrorEditModeValueUserBio
                                                                    ? {
                                                                          editModeValue: prevState.data.bio ?? '',
                                                                      }
                                                                    : {}),
                                                            },
                                                        },
                                                    };
                                                });
                                                if (!isErrorEditModeValueUserBio) {
                                                    ResourceClient.postResource(
                                                        'api/user/update/userPage',
                                                        {
                                                            idUser,
                                                        },
                                                        {
                                                            id: idUser,
                                                            bio:
                                                                getInputText(userPageState.editMode.bio.editModeValue)
                                                                    .length === 0
                                                                    ? null
                                                                    : getInputText(
                                                                          userPageState.editMode.bio.editModeValue,
                                                                      ),
                                                        },
                                                    )
                                                        .then((responseJson: any) => {
                                                            handleUpdateUserPage(responseJson);
                                                        })
                                                        .catch(() => {});
                                                }
                                            }
                                        }}
                                        helperText={Constants.USER_INPUT_BIO_HELPER_TEXT(
                                            getInputText(userPageState.editMode.bio.editModeValue).length,
                                        )}
                                        error={isErrorEditModeValueUserBio}
                                        inputProps={{ style: { fontFamily: 'monospace' } }}
                                    />
                                ) : (
                                    <Typography
                                        variant="body1"
                                        fontFamily="monospace"
                                        onClick={() => {
                                            setUserPageState((prevState: IUserPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        bio: {
                                                            ...prevState.editMode.bio,
                                                            isEditMode: userPageState.data.getIsMe(),
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {userPageState.data.getBio() !== null ? userPageState.data.getBio() : ' '}
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
                    <Tab sx={{ width: '150px' }} label="My Pods" />
                    <Tab sx={{ width: '150px' }} label="My Stamps" />
                    <Tab sx={{ width: '150px' }} label="My Pinned Tasks" />
                </Tabs>
            </Box>
            {tabIdxToDisplayMap[tabIdx] === 'pod' ? (
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
                        <FilterPods
                            handleChangeText={debouncedHandleChangeFilterNameOrDescription}
                            handleUpdateFilterState={(
                                event: React.ChangeEvent<HTMLInputElement>,
                                filterKey: string,
                            ) => {
                                setPodCardState((prevState) => {
                                    return {
                                        ...prevState,
                                        filter: {
                                            ...prevState.filter,
                                            [filterKey]: event.target.checked,
                                        },
                                    };
                                });
                            }}
                            isPodPublic={podCardState.filter.filterIsPublic}
                            isPodNotPublic={podCardState.filter.filterIsNotPublic}
                            isPodMember={podCardState.filter.filterIsMember}
                            isPodNotMember={podCardState.filter.filterIsNotMember}
                            isPodModerator={podCardState.filter.filterIsModerator}
                            isPodNotModerator={podCardState.filter.filterIsNotModerator}
                            isUseKeyPodPublic={true}
                            isUseKeyPodMember={true}
                            isUseKeyPodModerator={true}
                        />
                    </Box>
                    <Box sx={{ padding: '24px 96px 96px 96px', justifyContent: 'center', display: 'flex' }}>
                        <PodCardList
                            podCards={podCardState.data}
                            isShowCreatePodModal={false}
                            isLoading={podCardState.response.state === Constants.RESPONSE_STATE_LOADING}
                            handleChangePaginationPageNumber={() => {}}
                            paginationTotalPages={0}
                        />
                    </Box>
                </React.Fragment>
            ) : null}
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
                                setTaskState((prevState) => {
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
                            isAuthorizedToComplete={false}
                            isReadOnlyTaskBody={true}
                            isReadOnlyTaskNotes={true}
                            isDisplayViewPodLink={true}
                            isDisplayOptionsStarPinDelete={false}
                            isAuthorizedToDelete={false}
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
                            isShowCreateStampModal={false}
                            isLoading={stampCardState.response.state === Constants.RESPONSE_STATE_LOADING}
                            handleChangePaginationPageNumber={() => {}}
                            paginationTotalPages={0}
                        />
                    </Box>
                </React.Fragment>
            ) : null}
        </Box>
    );
};

export default PageUser;
