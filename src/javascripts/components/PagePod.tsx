import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import ResponseModel from 'src/javascripts/models/ResponseModel';
import NumberOfPointsInTasksCompletedOverTimeVisualizationModel from 'src/javascripts/models/NumberOfPointsInTasksCompletedOverTimeVisualizationModel';
import Constants from 'src/javascripts/Constants';
import PlaceholderImagePod from 'src/assets/PlaceholderImagePod.png';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';
import { slicePagePodActions } from 'src/javascripts/store/SlicePagePod';
import { sliceVisualizationActions } from 'src/javascripts/store/SliceVisualization';
import { sliceStampCardsAssociatedWithPodActions } from 'src/javascripts/store/SliceStampCardsAssociatedWithPod';
import { slicePaginationPageNumberActions } from 'src/javascripts/store/SlicePaginationPageNumber';

import type { IRootState } from 'src/javascripts/store';
const tabIdxToDisplayMap: any = {
    0: 'task',
    1: 'stamp',
    2: 'progress',
};

export interface IPodPageState {
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
    const dispatch = useDispatch();
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    const slicePagePodState = useSelector((state: IRootState) => state.pagePod);
    const slicePagePodStateData = new PodPageModel(slicePagePodState.data);
    const slicePagePodStateResponse = new ResponseModel(slicePagePodState.response);
    const sliceVisualizationState = useSelector((state: IRootState) => state.visualization);
    const sliceVisualizationStateData = new NumberOfPointsInTasksCompletedOverTimeVisualizationModel(
        sliceVisualizationState.data,
    );
    const sliceVisualizationStateResponse = new ResponseModel(sliceVisualizationState.response);
    const sliceStampCardsAssociatedWithPodState = useSelector((state: IRootState) => state.stampCardsAssociatedWithPod);
    const sliceStampCardsAssociatedWithPodStateData = sliceStampCardsAssociatedWithPodState.data.map(
        (d: any) => new StampCardModel(d),
    );
    const sliceStampCardsAssociatedWithPodStateResponse = new ResponseModel(
        sliceStampCardsAssociatedWithPodState.response,
    );
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

    const setPodPageStateData = async (): Promise<any> => {
        try {
            dispatch(slicePagePodActions.setStateResponseLoading());
            const response = await ResourceClient.postResource(
                'api/app/GetPodPage',
                { id: String(idPod) },
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(slicePagePodActions.setStateData(response.data));
            setPodPageState((prevState: IPodPageState) => {
                const podPageModel = new PodPageModel(response.data);
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
                };
            });
        } catch (e: any) {
            dispatch(slicePagePodActions.setStateResponseError(e?.response?.data?.message));
        }
    };
    const handleGetTasksAssociatedWithPod = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetTasksAssociatedWithPod',
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
                        ...prevState.response,
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

    const handleGetStampCardsAssociatedWithPod = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            dispatch(slicePaginationPageNumberActions.setStateData(1));
            const response = await ResourceClient.postResource(
                'api/app/GetStampCardsAssociatedWithPod',
                requestBodyObject,
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(sliceStampCardsAssociatedWithPodActions.setStateData(response.data));
        } catch (e: any) {
            dispatch(sliceStampCardsAssociatedWithPodActions.setStateResponseError(e?.response?.data?.message));
        }
    };

    const setVisualizationStateData = async (): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetNumberOfPointsInTasksCompletedOverTimeVisualizationAssociatedWithPod',
                { id: String(idPod) },
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(sliceVisualizationActions.setStateData(response.data));
        } catch (e: any) {
            dispatch(sliceVisualizationActions.setStateResponseError(e?.response?.data?.message));
        }
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
        void setPodPageStateData();
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        void handleGetTasksAssociatedWithPod({
            id: String(idPod),
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
        void handleGetStampCardsAssociatedWithPod({
            id: String(idPod),
            filterNameOrDescription: stampCardState.filter.filterNameOrDescription,
            filterIsCollect: stampCardState.filter.filterIsCollect,
            filterIsNotCollect: stampCardState.filter.filterIsNotCollect,
            filterIsPublic: true,
            filterIsNotPublic: true,
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
            {/* {podPageState.response.state === Constants.RESPONSE_STATE_ERROR &&
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
            ) : null} */}
            <Box>
                <Grid container direction="row">
                    <Grid item sx={{ padding: '24px' }}>
                        <AvatarImageEditor
                            imageUploadHandler={async (imageAsBase64String: string) => {
                                try {
                                    const response = await ResourceClient.postResource(
                                        'api/app/UpdatePod',
                                        {
                                            id: idPod,
                                            imageAsBase64String: getInputText(imageAsBase64String),
                                        },
                                        sliceAuthenticationStateData.getJwtToken(),
                                    );
                                    dispatch(slicePagePodActions.setStateData(response.data));
                                } catch (e: any) {}
                            }}
                            imageLink={slicePagePodStateData.getImageLink()}
                            placeholderImage={PlaceholderImagePod}
                            isReadOnly={!slicePagePodStateData.getIsPodModerator()}
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
                            {!slicePagePodStateData.getIsPodMember() ? (
                                <IconButtonJoinPod
                                    handleJoinPod={async () => {
                                        try {
                                            await ResourceClient.postResource(
                                                'api/app/JoinPod',
                                                {
                                                    id: String(idPod),
                                                },
                                                sliceAuthenticationStateData.getJwtToken(),
                                            );
                                            void setPodPageStateData();
                                        } catch (e: any) {}
                                    }}
                                />
                            ) : null}
                            {slicePagePodStateData.getIsPodMember() && !slicePagePodStateData.getIsPodModerator() ? (
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
                            {slicePagePodStateData.getIsPodModerator() ? (
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
                            {slicePagePodStateData.getIsPodMember() ? (
                                <React.Fragment>
                                    <IconButtonInviteUsersJoinPodModal idPod={idPod ?? ''} />
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ marginLeft: '8px', marginRight: '8px' }}
                                    />
                                </React.Fragment>
                            ) : null}
                            {slicePagePodStateData.getIsPodModerator() ? (
                                <React.Fragment>
                                    <IconButtonAddPodModeratorsModal idPod={idPod ?? ''} />
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ marginLeft: '8px', marginRight: '8px' }}
                                    />
                                </React.Fragment>
                            ) : null}
                            {slicePagePodStateData.getIsPodMember() && !slicePagePodStateData.getIsPodModerator() ? (
                                <React.Fragment>
                                    <IconButtonSendBecomePodModeratorRequest
                                        isSentBecomePodModeratorRequest={slicePagePodStateData.getIsSentBecomePodModeratorRequest()}
                                        handleSendBecomePodModeratorRequest={async () => {
                                            try {
                                                await ResourceClient.postResource(
                                                    'api/app/SendBecomePodModeratorRequest',
                                                    {
                                                        id: String(idPod),
                                                    },
                                                    sliceAuthenticationStateData.getJwtToken(),
                                                );
                                                void setPodPageStateData();
                                            } catch (e: any) {}
                                        }}
                                    />
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ marginLeft: '8px', marginRight: '8px' }}
                                    />
                                </React.Fragment>
                            ) : null}
                            {slicePagePodStateData.getIsPodModerator() ? (
                                <React.Fragment>
                                    <IconButtonManagePendingBecomePodModeratorRequestsModal
                                        idPod={idPod ?? ''}
                                        numberOfPendingBecomeModeratorRequests={slicePagePodStateData.getNumberOfPendingBecomeModeratorRequests()}
                                        handleUpdatePodPage={() => {
                                            void setPodPageStateData();
                                        }}
                                    />
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ marginLeft: '8px', marginRight: '8px' }}
                                    />
                                </React.Fragment>
                            ) : null}
                            {slicePagePodStateData.getIsPodMember() ? (
                                <IconButtonLeavePod
                                    handleLeavePod={async () => {
                                        try {
                                            await ResourceClient.postResource(
                                                'api/app/LeavePod',
                                                {
                                                    id: String(idPod),
                                                },
                                                sliceAuthenticationStateData.getJwtToken(),
                                            );
                                            void setPodPageStateData();
                                        } catch (e: any) {}
                                    }}
                                />
                            ) : null}
                        </Box>
                        {!slicePagePodStateResponse.getIsLoading() ? (
                            <React.Fragment>
                                <Box sx={{ display: 'flex', width: '100%', marginBottom: '12px' }}>
                                    <UserListButton
                                        labelText={getUserListButtonText(
                                            slicePagePodStateData.getUserBubblesPodMemberTotalNumber(),
                                            'member',
                                            'members',
                                        )}
                                        userBubbles={slicePagePodStateData.getUserBubblesPodMember()}
                                        sortByTimestampLabel="time become member"
                                        apiPath={'api/app/GetUserBubblesPodMember'}
                                        apiPayload={{ id: String(idPod) }}
                                        modalTitle="Pod Members"
                                        isUseDateTimeDateAndTime={false}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', width: '100%', marginBottom: '12px' }}>
                                    <UserListButton
                                        labelText={getUserListButtonText(
                                            slicePagePodStateData.getUserBubblesPodModeratorTotalNumber(),
                                            'moderator',
                                            'moderators',
                                        )}
                                        userBubbles={slicePagePodStateData.getUserBubblesPodModerator()}
                                        sortByTimestampLabel="time become moderator"
                                        apiPath={'api/app/GetUserBubblesPodModerator'}
                                        apiPayload={{ id: String(idPod) }}
                                        modalTitle="Pod Moderators"
                                        isUseDateTimeDateAndTime={false}
                                    />
                                </Box>
                            </React.Fragment>
                        ) : null}
                        {/* {!slicePagePodStateResponse.getIsLoading() &&
                        slicePagePodStateData.getUserBubblesPodModerator() !== null ? (
                            <Grid container direction="row" sx={{ marginBottom: '12px' }}>
                                <Grid item sx={{ display: 'flex', width: '100%' }}>
                                    <UserListButton
                                        labelText={getUserListButtonText(
                                            slicePagePodStateData.getUserBubblesPodModeratorTotalNumber(),
                                            'moderator',
                                            'moderators',
                                        )}
                                        userBubbles={slicePagePodStateData.getUserBubblesPodModerator()}
                                        sortByTimestampLabel="time become moderator"
                                        apiPath={'api/app/GetUserBubblesPodModerator'}
                                        apiPayload={{ id: String(idPod) }}
                                        modalTitle="Pod Moderators"
                                        isUseDateTimeDateAndTime={false}
                                    />
                                </Grid>
                            </Grid>
                        ) : null} */}
                        {slicePagePodStateData.getIsPodMember() ? (
                            <Box sx={{ marginBottom: '12px' }}>
                                <CreateStampModalButton idPod={idPod === undefined || idPod === null ? null : idPod} />
                            </Box>
                        ) : null}
                        {slicePagePodStateData.getIsPodModerator() ? (
                            <Box sx={{ marginBottom: '12px' }}>
                                <CreateTaskModalButton
                                    idPod={idPod ?? null}
                                    handleUpdate={() => {
                                        void handleGetTasksAssociatedWithPod({
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
                                        defaultValue={slicePagePodStateData.getName()}
                                        fullWidth
                                        value={podPageState.editMode.name.editModeValue}
                                        /* eslint-disable @typescript-eslint/no-misused-promises */
                                        onBlur={async () => {
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
                                                                      editModeValue: slicePagePodStateData.getName(),
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValuePodName) {
                                                try {
                                                    const response = await ResourceClient.postResource(
                                                        'api/app/UpdatePod',
                                                        {
                                                            id: idPod,
                                                            name: getInputText(
                                                                podPageState.editMode.name.editModeValue,
                                                            ),
                                                        },
                                                        sliceAuthenticationStateData.getJwtToken(),
                                                    );
                                                    dispatch(slicePagePodActions.setStateData(response.data));
                                                } catch (e: any) {
                                                    dispatch(
                                                        slicePagePodActions.setStateResponseError(
                                                            e?.response?.data?.message,
                                                        ),
                                                    );
                                                }
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
                                        onKeyDown={async (event: React.KeyboardEvent) => {
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
                                                                          editModeValue:
                                                                              slicePagePodStateData.getName(),
                                                                      }
                                                                    : {}),
                                                            },
                                                        },
                                                    };
                                                });
                                                if (!isErrorEditModeValuePodName) {
                                                    try {
                                                        const response = await ResourceClient.postResource(
                                                            'api/app/UpdatePod',
                                                            {
                                                                id: idPod,
                                                                name: getInputText(
                                                                    podPageState.editMode.name.editModeValue,
                                                                ),
                                                            },
                                                            sliceAuthenticationStateData.getJwtToken(),
                                                        );
                                                        dispatch(slicePagePodActions.setStateData(response.data));
                                                    } catch (e: any) {
                                                        dispatch(
                                                            slicePagePodActions.setStateResponseError(
                                                                e?.response?.data?.message,
                                                            ),
                                                        );
                                                    }
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
                                                            isEditMode: slicePagePodStateData.getIsPodModerator(),
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ height: '60px', overflowY: 'auto' }}
                                    >
                                        {slicePagePodStateData.getName()}
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
                                        defaultValue={slicePagePodStateData.getDescription()}
                                        fullWidth
                                        value={podPageState.editMode.description.editModeValue}
                                        onBlur={async () => {
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
                                                                          slicePagePodStateData.getDescription() ?? '',
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValuePodDescription) {
                                                try {
                                                    const response = await ResourceClient.postResource(
                                                        'api/app/UpdatePod',
                                                        {
                                                            id: idPod,
                                                            description:
                                                                getInputText(
                                                                    podPageState.editMode.description.editModeValue,
                                                                ).length === 0
                                                                    ? null
                                                                    : getInputText(
                                                                          podPageState.editMode.description
                                                                              .editModeValue,
                                                                      ),
                                                        },
                                                        sliceAuthenticationStateData.getJwtToken(),
                                                    );
                                                    dispatch(slicePagePodActions.setStateData(response.data));
                                                } catch (e: any) {}
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
                                        onKeyDown={async (event: React.KeyboardEvent) => {
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
                                                                              slicePagePodStateData.getDescription() ??
                                                                              '',
                                                                      }
                                                                    : {}),
                                                            },
                                                        },
                                                    };
                                                });
                                                if (!isErrorEditModeValuePodDescription) {
                                                    try {
                                                        const response = await ResourceClient.postResource(
                                                            'api/app/UpdatePod',
                                                            {
                                                                id: idPod,
                                                                description:
                                                                    getInputText(
                                                                        podPageState.editMode.description.editModeValue,
                                                                    ).length === 0
                                                                        ? null
                                                                        : getInputText(
                                                                              podPageState.editMode.description
                                                                                  .editModeValue,
                                                                          ),
                                                            },
                                                            sliceAuthenticationStateData.getJwtToken(),
                                                        );
                                                        dispatch(slicePagePodActions.setStateData(response.data));
                                                    } catch (e: any) {}
                                                }
                                            }
                                        }}
                                        helperText={Constants.POD_INPUT_DESCRIPTION_HELPER_TEXT(
                                            getInputText(podPageState.editMode.description.editModeValue).length,
                                        )}
                                        error={isErrorEditModeValuePodDescription}
                                        InputProps={{ style: { fontFamily: 'monospace' } }}
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
                                                            isEditMode: slicePagePodStateData.getIsPodModerator(),
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {slicePagePodStateData.getDescription() !== null
                                            ? slicePagePodStateData.getDescription()
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
                            isAuthorizedToComplete={slicePagePodStateData.getIsPodMember()}
                            isReadOnlyTaskBody={!slicePagePodStateData.getIsPodModerator()}
                            isReadOnlyTaskNotes={!slicePagePodStateData.getIsPodMember()}
                            isDisplayViewPodLink={false}
                            isDisplayOptionsStarPinDelete={slicePagePodStateData.getIsPodMember()}
                            isAuthorizedToDelete={slicePagePodStateData.getIsPodModerator()}
                            handleSideEffectToggleTaskComplete={() => {
                                void setPodPageStateData();
                                void setVisualizationStateData();
                            }}
                            handleSideEffectChangeNumberOfPoints={() => {
                                void setPodPageStateData();
                                void setVisualizationStateData();
                            }}
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
                            stampCards={sliceStampCardsAssociatedWithPodStateData}
                            isShowCreateStampModal={true}
                            isLoading={sliceStampCardsAssociatedWithPodStateResponse.getIsLoading()}
                            pageSize={Constants.PAGE_SIZE_ASSOCIATED_STAMP_CARDS_ASSOCIATED_WITH_POD}
                        />
                    </Box>
                </React.Fragment>
            ) : null}
            {tabIdxToDisplayMap[tabIdx] === 'progress' ? (
                <NumberOfPointsInTasksCompletedOverTimeVisualization
                    data={sliceVisualizationStateData}
                    response={sliceVisualizationStateResponse}
                />
            ) : null}
        </Box>
    );
};

export default PagePod;
