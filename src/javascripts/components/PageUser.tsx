import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Grid,
    Typography,
    Tab,
    Tabs,
    TextField,
} from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import AvatarImageEditor from 'src/javascripts/components/AvatarImageEditor';
import PodCardList from 'src/javascripts/components/PodCardList';
import FilterTasks from 'src/javascripts/components/FilterTasks';
import FilterStamps from 'src/javascripts/components/FilterStamps';
import FilterPods from 'src/javascripts/components/FilterPods';
import UserListButton from 'src/javascripts/components/UserListButton';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import StampCardList from 'src/javascripts/components/StampCardList';
import { getInputText, getUserListButtonText, getPaginationIdxStart, getPaginationN } from 'src/javascripts/utilities';
import { PAGE_SIZE_STAMP, PAGE_SIZE_TASK } from 'src/javascripts/clients/ResourceClientConfig';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import UserPageModel from 'src/javascripts/models/UserPageModel';
import TaskModel from 'src/javascripts/models/TaskModel';
import StampCardModel from 'src/javascripts/models/StampCardModel';
import PodCardModel from 'src/javascripts/models/PodCardModel';
import ResponseModel from 'src/javascripts/models/ResponseModel';
import Constants from 'src/javascripts/Constants';
import PlaceholderImageUser from 'src/assets/PlaceholderImageUser.png';
import IconButtonFollowUser from 'src/javascripts/components/IconButtonFollowUser';
import IconButtonManagePendingFollowUserRequestsModal from 'src/javascripts/components/IconButtonManagePendingFollowUserRequestsModal';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';
import { slicePageUserActions } from 'src/javascripts/store/SlicePageUser';
import { slicePodCardsAssociatedWithUserActions } from 'src/javascripts/store/SlicePodCardsAssociatedWithUser';
import { sliceStampCardsAssociatedWithUserActions } from 'src/javascripts/store/SliceStampCardsAssociatedWithUser';
import { sliceHeaderActiveTabActions } from 'src/javascripts/store/SliceHeaderActiveTab';

import type { IRootState } from 'src/javascripts/store';
const tabIdxToDisplayMap: any = {
    0: 'pod',
    1: 'stamp',
    2: 'task',
};
export interface IUserPageState {
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
        filterByName: string;
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
    filter: {
        filterByName: string;
        filterIsPublic: boolean;
        filterIsNotPublic: boolean;
        filterIsMember: boolean;
        filterIsNotMember: boolean;
        filterIsModerator: boolean;
        filterIsNotModerator: boolean;
    };
}
export interface IStampCardState {
    data: any;
    response: {
        state: string;
        errorMessage: string | null;
    };
    filter: {
        filterByName: string;
        filterIsPublic: boolean;
        filterIsNotPublic: boolean;
        filterIsCollect: boolean;
        filterIsNotCollect: boolean;
    };
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalNumberOfPages: number;
    };
}
export interface IImageSizeWarningModalState {
    isOpen: boolean;
}
const PageUser: React.FC = () => {
    const { id: idUser } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    const slicePageUserState = useSelector((state: IRootState) => state.pageUser);
    const slicePageUserStateData = new UserPageModel(slicePageUserState.data);
    const slicePageUserStateResponse = new ResponseModel(slicePageUserState.response);
    const slicePodCardsAssociatedWithUserState = useSelector((state: IRootState) => state.podCardsAssociatedWithUser);
    const slicePodCardsAssociatedWithUserStateData = slicePodCardsAssociatedWithUserState.data.map(
        (d: any) => new PodCardModel(d),
    );
    const slicePodCardsAssociatedWithUserStateResponse = new ResponseModel(
        slicePodCardsAssociatedWithUserState.response,
    );
    const sliceStampCardsAssociatedWithUserState = useSelector(
        (state: IRootState) => state.stampCardsAssociatedWithUser,
    );
    const sliceStampCardsAssociatedWithUserStateData = sliceStampCardsAssociatedWithUserState.data.map(
        (d: any) => new StampCardModel(d),
    );
    const sliceStampCardsAssociatedWithUserStateResponse = new ResponseModel(
        sliceStampCardsAssociatedWithUserState.response,
    );
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
    });

    // filter pods
    const [podCardState, setPodCardState] = useState<IPodCardState>({
        filter: {
            filterByName: '',
            filterIsPublic: true,
            filterIsNotPublic: true,
            filterIsMember: true,
            filterIsNotMember: true,
            filterIsModerator: true,
            filterIsNotModerator: true,
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
            filterByName: '',
            filterIsPublic: true,
            filterIsNotPublic: true,
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
            filterByName: '',
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
    const [imageSizeWarningModalState, setImageSizeWarningModalState] = useState<IImageSizeWarningModalState>({
        isOpen: false,
    });
    const handleToggleImageSizeWarningModal = (isOpen: boolean): void => {
        setImageSizeWarningModalState((prevState: IImageSizeWarningModalState) => {
            return {
                ...prevState,
                isOpen,
            };
        });
    };
    const taskResponse = new ResponseModel(taskState.response);
    const handleGetUserPage = async (): Promise<any> => {
        try {
            dispatch(slicePageUserActions.setStateResponseLoading());
            const response = await ResourceClient.postResource(
                'api/app/GetUserPage',
                { id: String(idUser) },
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(slicePageUserActions.setStateData(response.data));
            setUserPageState((prevState: IUserPageState) => {
                const userPageModel = new UserPageModel(response.data);
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
                };
            });
        } catch (e: any) {
            dispatch(slicePageUserActions.setStateResponseError(e?.response?.data?.message));
            if (e?.response?.data?.message === Constants.ERROR_CODE__UNAUTHORIZED_ACCESS) {
                navigate('/page-not-found');
            }
        }
    };
    const handleGetPinnedTasksAssociatedWithUser = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetPinnedTasksAssociatedWithUser',
                requestBodyObject,
                sliceAuthenticationStateData.getJwtToken(),
            );
            setTaskState((prevState: ITaskState) => {
                return {
                    ...prevState,
                    data: response.data.map((datapoint: any) => {
                        return new TaskModel(datapoint);
                    }),
                    response: {
                        state: Constants.RESPONSE_STATE_SUCCESS,
                        errorMessage: null,
                    },
                    pagination: {
                        ...prevState.pagination,
                        totalNumberOfPages: response.data.totalPages,
                    },
                };
            });
        } catch (e: any) {
            setTaskState((prevState: ITaskState) => {
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
    const handleGetPodCardsAssociatedWithUser = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            dispatch(slicePodCardsAssociatedWithUserActions.setStateResponseLoading());
            const response = await ResourceClient.postResource(
                'api/app/GetPodCardsAssociatedWithUser',
                requestBodyObject,
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(
                slicePodCardsAssociatedWithUserActions.setStateData({
                    data: response.data.data,
                    totalN: response.data.totalN,
                }),
            );
        } catch (e: any) {
            dispatch(slicePodCardsAssociatedWithUserActions.setStateResponseError(e?.response?.data?.message));
        }
    };
    const handleGetStampCardsAssociatedWithUser = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            dispatch(sliceStampCardsAssociatedWithUserActions.setStateResponseLoading());
            const response = await ResourceClient.postResource(
                'api/app/GetStampCardsAssociatedWithUser',
                requestBodyObject,
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(
                sliceStampCardsAssociatedWithUserActions.setStateData({
                    data: response.data.data,
                    totalN: response.data.totalN,
                }),
            );
        } catch (e: any) {
            dispatch(sliceStampCardsAssociatedWithUserActions.setStateResponseError(e?.response?.data?.message));
        }
    };
    const debouncedHandleChangefilterByName = _.debounce((event: React.ChangeEvent<HTMLInputElement>): void => {
        if (tabIdxToDisplayMap[tabIdx] === 'task') {
            setTaskState((prevState: ITaskState) => {
                return {
                    ...prevState,
                    filter: { ...prevState.filter, filterByName: event.target.value },
                };
            });
        } else if (tabIdxToDisplayMap[tabIdx] === 'pod') {
            setPodCardState((prevState: IPodCardState) => {
                return {
                    ...prevState,
                    filter: { ...prevState.filter, filterByName: event.target.value },
                };
            });
        } else if (tabIdxToDisplayMap[tabIdx] === 'stamp') {
            setStampCardState((prevState: IStampCardState) => {
                return {
                    ...prevState,
                    filter: { ...prevState.filter, filterByName: event.target.value },
                };
            });
        }
    }, 500);
    useEffect(() => {
        if (sliceAuthenticationStateData.getIdUser() === idUser) {
            void dispatch(sliceHeaderActiveTabActions.setStateData(Constants.HEADER_ACTIVE_TAB_IDX__PAGE_USER));
        } else {
            void dispatch(sliceHeaderActiveTabActions.setStateData(Constants.HEADER_ACTIVE_TAB_IDX__NO_ACTIVE_TAB));
        }
        void handleGetUserPage();
        // eslint-disable-next-line
    }, [idUser]);
    useEffect(() => {
        void handleGetPinnedTasksAssociatedWithUser({
            id: String(idUser),
            filterByName: taskState.filter.filterByName,
            filterIsComplete: taskState.filter.filterIsComplete,
            filterIsNotComplete: taskState.filter.filterIsNotComplete,
            filterIsStar: taskState.filter.filterIsStar,
            filterIsNotStar: taskState.filter.filterIsNotStar,
            filterIsPin: taskState.filter.filterIsPin,
            filterIsNotPin: taskState.filter.filterIsNotPin,
        });
        // eslint-disable-next-line
    }, [taskState.filter, idUser]);

    const REQUEST_PARAMS_POD_CARDS = (currentPageIdx: number): any => {
        return {
            id: String(idUser),
            filterByName: podCardState.filter.filterByName,
            filterIsPublic: podCardState.filter.filterIsPublic,
            filterIsNotPublic: podCardState.filter.filterIsNotPublic,
            filterIsMember: podCardState.filter.filterIsMember,
            filterIsNotMember: podCardState.filter.filterIsNotMember,
            filterIsModerator: podCardState.filter.filterIsModerator,
            filterIsNotModerator: podCardState.filter.filterIsNotModerator,
            paginationIdxStart: getPaginationIdxStart(
                currentPageIdx,
                Constants.PAGINATION_BATCH_N,
                Constants.PAGE_SIZE_POD_CARDS_ASSOCIATED_WITH_USER,
            ),
            paginationN: getPaginationN(
                Constants.PAGE_SIZE_POD_CARDS_ASSOCIATED_WITH_USER,
                Constants.PAGINATION_BATCH_N,
            ),
        };
    };
    const REQUEST_PARAMS_STAMP_CARDS = (currentPageIdx: number): any => {
        return {
            id: String(idUser),
            filterByName: stampCardState.filter.filterByName,
            filterIsCollect: stampCardState.filter.filterIsCollect,
            filterIsNotCollect: stampCardState.filter.filterIsNotCollect,
            filterIsPublic: true,
            filterIsNotPublic: true,
            paginationIdxStart: getPaginationIdxStart(
                currentPageIdx,
                Constants.PAGINATION_BATCH_N,
                Constants.PAGE_SIZE_STAMP_CARDS_ASSOCIATED_WITH_USER,
            ),
            paginationN: getPaginationN(
                Constants.PAGE_SIZE_STAMP_CARDS_ASSOCIATED_WITH_USER,
                Constants.PAGINATION_BATCH_N,
            ),
        };
    };
    useEffect(() => {
        dispatch(slicePodCardsAssociatedWithUserActions.setPaginationCurrentPageIdx(0));
        void handleGetPodCardsAssociatedWithUser(REQUEST_PARAMS_POD_CARDS(0));
        // eslint-disable-next-line
    }, [podCardState.filter, tabIdx, idUser]);
    useEffect(() => {
        dispatch(sliceStampCardsAssociatedWithUserActions.setPaginationCurrentPageIdx(0));
        void handleGetStampCardsAssociatedWithUser(REQUEST_PARAMS_STAMP_CARDS(0));
        // eslint-disable-next-line
    }, [stampCardState.filter, tabIdx, idUser]);

    const isErrorEditModeValueUserUsername =
        getInputText(userPageState.editMode.username.editModeValue).length <
            Constants.USER_USERNAME_MIN_LENGTH_CHARACTERS ||
        getInputText(userPageState.editMode.username.editModeValue).length >
            Constants.USER_USERNAME_MAX_LENGTH_CHARACTERS ||
        !Constants.REGEX_USER_USERNAME.test(userPageState.editMode.username.editModeValue);

    const isErrorEditModeValueUserName =
        getInputText(userPageState.editMode.name.editModeValue).length < Constants.USER_NAME_MIN_LENGTH_CHARACTERS ||
        getInputText(userPageState.editMode.name.editModeValue).length > Constants.USER_NAME_MAX_LENGTH_CHARACTERS;
    const isErrorEditModeValueUserBio =
        getInputText(userPageState.editMode.bio.editModeValue).length > Constants.POD_DESCRIPTION_MAX_LENGTH_CHARACTERS;

    return (
        <Box sx={{ minHeight: '100vh', background: THEME.palette.other.gradient }}>
            <Box>
                <Grid container direction="row">
                    <Grid item sx={{ padding: '24px' }}>
                        <AvatarImageEditor
                            imageUploadHandler={async (imageAsBase64String: string) => {
                                try {
                                    const response = await ResourceClient.postResource(
                                        'api/app/UpdateUserPage',
                                        {
                                            imageAsBase64String: getInputText(imageAsBase64String),
                                        },
                                        sliceAuthenticationStateData.getJwtToken(),
                                    );
                                    dispatch(slicePageUserActions.setStateData(response.data));
                                } catch (e: any) {
                                    handleToggleImageSizeWarningModal(true);
                                }
                            }}
                            imageLink={slicePageUserStateData.getImageLink()}
                            placeholderImage={PlaceholderImageUser}
                            isReadOnly={!slicePageUserStateData.getIsMe()}
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
                                    defaultValue={slicePageUserStateData.getName()}
                                    sx={{ maxWidth: '300px' }}
                                    value={userPageState.editMode.name.editModeValue}
                                    /* eslint-disable @typescript-eslint/no-misused-promises */
                                    onBlur={async () => {
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
                                                                  editModeValue: slicePageUserStateData.getName(),
                                                              }
                                                            : {}),
                                                    },
                                                },
                                            };
                                        });
                                        if (!isErrorEditModeValueUserName) {
                                            try {
                                                const response = await ResourceClient.postResource(
                                                    'api/app/UpdateUserPage',
                                                    {
                                                        name: getInputText(userPageState.editMode.name.editModeValue),
                                                    },
                                                    sliceAuthenticationStateData.getJwtToken(),
                                                );
                                                dispatch(slicePageUserActions.setStateData(response.data));
                                            } catch (e: any) {}
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
                                    onKeyDown={async (event: React.KeyboardEvent) => {
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
                                                                      editModeValue: slicePageUserStateData.getName(),
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValueUserName) {
                                                try {
                                                    const response = await ResourceClient.postResource(
                                                        'api/app/UpdateUserPage',
                                                        {
                                                            name: getInputText(
                                                                userPageState.editMode.name.editModeValue,
                                                            ),
                                                        },
                                                        sliceAuthenticationStateData.getJwtToken(),
                                                    );
                                                    dispatch(slicePageUserActions.setStateData(response.data));
                                                } catch (e: any) {}
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
                                                        isEditMode: slicePageUserStateData.getIsMe(),
                                                    },
                                                },
                                            };
                                        });
                                    }}
                                >
                                    {slicePageUserStateData.getName()}
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
                            {slicePageUserStateData.getIsMe() ? (
                                <React.Fragment>
                                    <IconButtonFollowUser
                                        isMe={slicePageUserStateData.getIsMe()}
                                        isFollowedByMe={slicePageUserStateData.getIsFollowedByMe()}
                                        isFollowRequestSentNotYetAccepted={slicePageUserStateData.getIsFollowRequestSentNotYetAccepted()}
                                        handleSendFollowRequest={async () => {
                                            try {
                                                await ResourceClient.postResource(
                                                    'api/app/SendFollowUserRequest',
                                                    {
                                                        id: idUser,
                                                    },
                                                    sliceAuthenticationStateData.getJwtToken(),
                                                );
                                                void handleGetUserPage();
                                            } catch (e: any) {}
                                        }}
                                        isAllowUnfollow={false}
                                        handleUnfollowUser={() => {}}
                                    />
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ marginLeft: '8px', marginRight: '8px' }}
                                    />
                                </React.Fragment>
                            ) : (
                                <IconButtonFollowUser
                                    isMe={slicePageUserStateData.getIsMe()}
                                    isFollowedByMe={slicePageUserStateData.getIsFollowedByMe()}
                                    isFollowRequestSentNotYetAccepted={slicePageUserStateData.getIsFollowRequestSentNotYetAccepted()}
                                    handleSendFollowRequest={async () => {
                                        try {
                                            await ResourceClient.postResource(
                                                'api/app/SendFollowUserRequest',
                                                {
                                                    id: idUser,
                                                },
                                                sliceAuthenticationStateData.getJwtToken(),
                                            );
                                            void handleGetUserPage();
                                        } catch (e: any) {}
                                    }}
                                    isAllowUnfollow={true}
                                    handleUnfollowUser={async () => {
                                        try {
                                            await ResourceClient.postResource(
                                                'api/app/UnfollowUser',
                                                {
                                                    id: idUser,
                                                },
                                                sliceAuthenticationStateData.getJwtToken(),
                                            );
                                            void handleGetUserPage();
                                        } catch (e: any) {}
                                    }}
                                />
                            )}
                            {slicePageUserStateData.getIsMe() ? (
                                <IconButtonManagePendingFollowUserRequestsModal
                                    numberOfPendingFollowUserRequests={slicePageUserStateData.getNumberOfPendingFollowUserRequests()}
                                    handleUpdateUserPage={() => {
                                        void handleGetUserPage();
                                    }}
                                />
                            ) : null}
                        </Box>
                        {!slicePageUserStateResponse.getIsLoading() ? (
                            <React.Fragment>
                                <Box sx={{ display: 'flex', width: '100%', marginBottom: '12px' }}>
                                    <UserListButton
                                        labelText={getUserListButtonText(
                                            slicePageUserStateData.getUserBubblesFollowerTotalNumber(),
                                            'follower',
                                            'followers',
                                            1000,
                                        )}
                                        userBubbles={slicePageUserStateData.getUserBubblesFollower()}
                                        sortByTimestampLabel="time of follow"
                                        apiPath={'api/app/GetUserBubblesFollower'}
                                        apiPayload={{ id: String(idUser) }}
                                        modalTitle="Followers"
                                        isUseDateTimeDateAndTime={false}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', width: '100%', marginBottom: '12px' }}>
                                    <UserListButton
                                        labelText={getUserListButtonText(
                                            slicePageUserStateData.getUserBubblesFollowerTotalNumber(),
                                            'following',
                                            'following',
                                            100,
                                        )}
                                        userBubbles={slicePageUserStateData.getUserBubblesFollowing()}
                                        sortByTimestampLabel="time of follow"
                                        apiPath={'api/app/GetUserBubblesFollowing'}
                                        apiPayload={{ id: String(idUser) }}
                                        modalTitle="Following"
                                        isUseDateTimeDateAndTime={false}
                                    />
                                </Box>
                            </React.Fragment>
                        ) : null}
                    </Grid>
                    <Grid item sx={{ width: '1000px', padding: '24px' }}>
                        <Grid container direction="column">
                            <Grid item sx={{ paddingBottom: '12px', width: '100%' }}>
                                {userPageState.editMode.username.isEditMode ? (
                                    <TextField
                                        id="user-edit-username"
                                        defaultValue={slicePageUserStateData.getUsername()}
                                        fullWidth
                                        value={userPageState.editMode.username.editModeValue}
                                        onBlur={async () => {
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
                                                                      editModeValue:
                                                                          slicePageUserStateData.getUsername(),
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValueUserUsername) {
                                                try {
                                                    const response = await ResourceClient.postResource(
                                                        'api/app/UpdateUserPage',
                                                        {
                                                            username: getInputText(
                                                                userPageState.editMode.username.editModeValue,
                                                            ),
                                                        },
                                                        sliceAuthenticationStateData.getJwtToken(),
                                                    );
                                                    dispatch(slicePageUserActions.setStateData(response.data));
                                                } catch (e: any) {
                                                    dispatch(
                                                        slicePageUserActions.setStateResponseError(
                                                            e?.response?.data?.message,
                                                        ),
                                                    );
                                                }
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
                                        onKeyDown={async (event: React.KeyboardEvent) => {
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
                                                                          editModeValue:
                                                                              slicePageUserStateData.getUsername(),
                                                                      }
                                                                    : {}),
                                                            },
                                                        },
                                                    };
                                                });
                                                if (!isErrorEditModeValueUserUsername) {
                                                    try {
                                                        const response = await ResourceClient.postResource(
                                                            'api/app/UpdateUserPage',
                                                            {
                                                                username: getInputText(
                                                                    userPageState.editMode.username.editModeValue,
                                                                ),
                                                            },
                                                            sliceAuthenticationStateData.getJwtToken(),
                                                        );
                                                        dispatch(slicePageUserActions.setStateData(response.data));
                                                    } catch (e: any) {
                                                        dispatch(
                                                            slicePageUserActions.setStateResponseError(
                                                                e?.response?.data?.message,
                                                            ),
                                                        );
                                                    }
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
                                                            isEditMode: slicePageUserStateData.getIsMe(),
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ height: '60px', overflowY: 'auto' }}
                                    >
                                        {`@${String(slicePageUserStateData.getUsername())}`}
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
                                        defaultValue={slicePageUserStateData.getBio()}
                                        fullWidth
                                        value={userPageState.editMode.bio.editModeValue}
                                        onBlur={async () => {
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
                                                                      editModeValue:
                                                                          slicePageUserStateData.getBio() ?? '',
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValueUserBio) {
                                                try {
                                                    const response = await ResourceClient.postResource(
                                                        'api/app/UpdateUserPage',
                                                        {
                                                            bio:
                                                                getInputText(userPageState.editMode.bio.editModeValue)
                                                                    .length === 0
                                                                    ? null
                                                                    : getInputText(
                                                                          userPageState.editMode.bio.editModeValue,
                                                                      ),
                                                        },
                                                        sliceAuthenticationStateData.getJwtToken(),
                                                    );
                                                    dispatch(slicePageUserActions.setStateData(response.data));
                                                } catch (e: any) {}
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
                                        onKeyDown={async (event: React.KeyboardEvent) => {
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
                                                                          editModeValue:
                                                                              slicePageUserStateData.getBio() ?? '',
                                                                      }
                                                                    : {}),
                                                            },
                                                        },
                                                    };
                                                });
                                                if (!isErrorEditModeValueUserBio) {
                                                    try {
                                                        const response = await ResourceClient.postResource(
                                                            'api/app/UpdateUserPage',
                                                            {
                                                                bio:
                                                                    getInputText(
                                                                        userPageState.editMode.bio.editModeValue,
                                                                    ).length === 0
                                                                        ? null
                                                                        : getInputText(
                                                                              userPageState.editMode.bio.editModeValue,
                                                                          ),
                                                            },
                                                            sliceAuthenticationStateData.getJwtToken(),
                                                        );
                                                        dispatch(slicePageUserActions.setStateData(response.data));
                                                    } catch (e: any) {}
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
                                                            isEditMode: slicePageUserStateData.getIsMe(),
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {slicePageUserStateData.getBio() !== null
                                            ? slicePageUserStateData.getBio()
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
                            handleChangeText={debouncedHandleChangefilterByName}
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
                            podCards={slicePodCardsAssociatedWithUserStateData}
                            isShowCreatePodModal={false}
                            isLoading={slicePodCardsAssociatedWithUserStateResponse.getIsLoading()}
                            paginationPageSize={Constants.PAGE_SIZE_POD_CARDS_ASSOCIATED_WITH_USER}
                            paginationBatchN={Constants.PAGINATION_BATCH_N}
                            paginationTotalN={slicePodCardsAssociatedWithUserState.pagination.totalN}
                            paginationPageIdx={slicePodCardsAssociatedWithUserState.pagination.currentPageIdx}
                            handleUpdatePaginationPageIdx={(newPaginationPageIdx: number) => {
                                const isRequireRequestNewBatch =
                                    Math.floor(newPaginationPageIdx / Constants.PAGINATION_BATCH_N) !==
                                    Math.floor(
                                        slicePodCardsAssociatedWithUserState.pagination.currentPageIdx /
                                            Constants.PAGINATION_BATCH_N,
                                    );
                                dispatch(
                                    slicePodCardsAssociatedWithUserActions.setPaginationCurrentPageIdx(
                                        newPaginationPageIdx,
                                    ),
                                );
                                if (isRequireRequestNewBatch) {
                                    void handleGetPodCardsAssociatedWithUser(
                                        REQUEST_PARAMS_POD_CARDS(newPaginationPageIdx),
                                    );
                                }
                            }}
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
                            handleChangeText={debouncedHandleChangefilterByName}
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
                        {taskResponse.getIsSuccess() ? (
                            <TaskCardList
                                tasks={taskState.data}
                                isAuthorizedToComplete={false}
                                isReadOnlyTaskBody={true}
                                isReadOnlyTaskNotes={true}
                                isDisplayViewPodLink={true}
                                isDisplayOptionsStarPinDelete={false}
                                isAuthorizedToDelete={false}
                                handleSideEffectToggleTaskComplete={() => {}}
                                handleSideEffectChangeNumberOfPoints={() => {}}
                                handleSideEffectDeleteTask={() => {}}
                            />
                        ) : taskResponse.getIsLoading() ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    verticalAlign: 'middle',
                                    alignItems: 'center',
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        ) : taskResponse.getIsError() ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box>
                                    <Grid container direction="column" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Grid item sx={{}}>
                                            <Typography variant="h5">
                                                An error occurred during fetching Tasks. Please try again.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        ) : null}
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
                            handleChangeText={debouncedHandleChangefilterByName}
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
                            isUseKeyStampPublic={true}
                            isStampPublic={stampCardState.filter.filterIsPublic}
                            isStampNotPublic={stampCardState.filter.filterIsNotPublic}
                            isUseKeyStampCollected={true}
                            isStampCollected={stampCardState.filter.filterIsCollect}
                            isStampNotCollected={stampCardState.filter.filterIsNotCollect}
                        />
                    </Box>
                    <Box sx={{ padding: '24px 96px 96px 96px', justifyContent: 'center', display: 'flex' }}>
                        <StampCardList
                            stampCards={sliceStampCardsAssociatedWithUserStateData}
                            isShowCreateStampModal={false}
                            isLoading={sliceStampCardsAssociatedWithUserStateResponse.getIsLoading()}
                            paginationPageSize={Constants.PAGE_SIZE_STAMP_CARDS_ASSOCIATED_WITH_USER}
                            paginationBatchN={Constants.PAGINATION_BATCH_N}
                            paginationTotalN={sliceStampCardsAssociatedWithUserState.pagination.totalN}
                            paginationPageIdx={sliceStampCardsAssociatedWithUserState.pagination.currentPageIdx}
                            handleUpdatePaginationPageIdx={(newPaginationPageIdx: number) => {
                                const isRequireRequestNewBatch =
                                    Math.floor(newPaginationPageIdx / Constants.PAGINATION_BATCH_N) !==
                                    Math.floor(
                                        sliceStampCardsAssociatedWithUserState.pagination.currentPageIdx /
                                            Constants.PAGINATION_BATCH_N,
                                    );
                                dispatch(
                                    sliceStampCardsAssociatedWithUserActions.setPaginationCurrentPageIdx(
                                        newPaginationPageIdx,
                                    ),
                                );
                                if (isRequireRequestNewBatch) {
                                    void handleGetStampCardsAssociatedWithUser(
                                        REQUEST_PARAMS_STAMP_CARDS(newPaginationPageIdx),
                                    );
                                }
                            }}
                        />
                    </Box>
                </React.Fragment>
            ) : null}
            <Dialog
                open={imageSizeWarningModalState.isOpen}
                onClose={() => {
                    handleToggleImageSizeWarningModal(false);
                }}
                fullWidth
            >
                <DialogTitle>{`Image Size Exceeded`}</DialogTitle>
                <DialogContent>
                    <Typography>
                        The file size for this image exceeds our storage limits. Please try cropping the image or use an
                        image with a smaller file size. Thank you.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            handleToggleImageSizeWarningModal(false);
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PageUser;
