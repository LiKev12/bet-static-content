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
    IconButton,
    Tooltip,
} from '@mui/material';
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
import { getInputText, getUserListButtonText, getPaginationIdxStart, getPaginationN } from 'src/javascripts/utilities';
import NumberOfPointsInTasksCompletedOverTimeVisualization from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualization';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import TaskModel from 'src/javascripts/models/TaskModel';
import StampCardModel from 'src/javascripts/models/StampCardModel';
import PodPageModel from 'src/javascripts/models/PodPageModel';
import ResponseModel from 'src/javascripts/models/ResponseModel';
import Constants from 'src/javascripts/Constants';
import PlaceholderImagePod from 'src/assets/PlaceholderImagePod.png';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';
import { slicePagePodActions } from 'src/javascripts/store/SlicePagePod';
import { sliceVisualizationActions } from 'src/javascripts/store/SliceVisualization';
import { sliceStampCardsAssociatedWithPodActions } from 'src/javascripts/store/SliceStampCardsAssociatedWithPod';
import { sliceHeaderActiveTabActions } from 'src/javascripts/store/SliceHeaderActiveTab';
import { sliceTasksAssociatedWithPodActions } from 'src/javascripts/store/SliceTasksAssociatedWithPod';

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
    filter: {
        filterByName: string;
        filterIsComplete: boolean;
        filterIsNotComplete: boolean;
        filterIsStar: boolean;
        filterIsNotStar: boolean;
        filterIsPin: boolean;
        filterIsNotPin: boolean;
    };
}
export interface IStampCardState {
    filter: {
        filterByName: string;
        filterIsPublic: boolean;
        filterIsNotPublic: boolean;
        filterIsCollect: boolean;
        filterIsNotCollect: boolean;
    };
}
export interface IImageSizeWarningModalState {
    isOpen: boolean;
}
const PagePod: React.FC = () => {
    const { id: idPod } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    const slicePagePodState = useSelector((state: IRootState) => state.pagePod);
    const slicePagePodStateData = new PodPageModel(slicePagePodState.data);
    const slicePagePodStateResponse = new ResponseModel(slicePagePodState.response);
    const sliceStampCardsAssociatedWithPodState = useSelector((state: IRootState) => state.stampCardsAssociatedWithPod);
    const sliceStampCardsAssociatedWithPodStateData = sliceStampCardsAssociatedWithPodState.data.map(
        (d: any) => new StampCardModel(d),
    );
    const sliceStampCardsAssociatedWithPodStateResponse = new ResponseModel(
        sliceStampCardsAssociatedWithPodState.response,
    );
    const sliceTasksAssociatedWithPodState = useSelector((state: IRootState) => state.tasksAssociatedWithPod);
    const sliceTasksAssociatedWithPodStateData = sliceTasksAssociatedWithPodState.data.map(
        (d: any) => new TaskModel(d),
    );
    const sliceTasksAssociatedWithPodResponse = new ResponseModel(sliceTasksAssociatedWithPodState.response);
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
        filter: {
            filterByName: '',
            filterIsComplete: true,
            filterIsNotComplete: true,
            filterIsStar: true,
            filterIsNotStar: true,
            filterIsPin: true,
            filterIsNotPin: true,
        },
    });

    // filter stamps
    const [stampCardState, setStampCardState] = useState<IStampCardState>({
        filter: {
            filterByName: '',
            filterIsPublic: true,
            filterIsNotPublic: true,
            filterIsCollect: true,
            filterIsNotCollect: true,
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
            if (e?.response?.data?.message === Constants.ERROR_CODE__UNAUTHORIZED_ACCESS) {
                navigate('/page-not-found');
            }
        }
    };
    const handleGetTasksAssociatedWithPod = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            dispatch(sliceTasksAssociatedWithPodActions.setStateResponseLoading());
            const response = await ResourceClient.postResource(
                'api/app/GetTasksAssociatedWithPod',
                requestBodyObject,
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(sliceTasksAssociatedWithPodActions.setStateData(response.data));
        } catch (e: any) {
            dispatch(sliceTasksAssociatedWithPodActions.setStateResponseError(e?.response?.data?.message));
        }
    };

    const handleGetStampCardsAssociatedWithPod = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            dispatch(sliceStampCardsAssociatedWithPodActions.setStateResponseLoading());
            const response = await ResourceClient.postResource(
                'api/app/GetStampCardsAssociatedWithPod',
                requestBodyObject,
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(
                sliceStampCardsAssociatedWithPodActions.setStateData({
                    data: response.data.data,
                    totalN: response.data.totalN,
                }),
            );
        } catch (e: any) {
            dispatch(sliceStampCardsAssociatedWithPodActions.setStateResponseError(e?.response?.data?.message));
        }
    };

    const setVisualizationStateData = async (): Promise<any> => {
        try {
            dispatch(sliceVisualizationActions.setStateResponseLoading());
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

    const debouncedHandleChangefilterByName = _.debounce((event: React.ChangeEvent<HTMLInputElement>): void => {
        if (tabIdxToDisplayMap[tabIdx] === 'task') {
            setTaskState((prevState: ITaskState) => {
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
    const REQUEST_PARAMS_STAMP_CARDS = (currentPageIdx: number): any => {
        return {
            id: String(idPod),
            filterByName: stampCardState.filter.filterByName,
            filterIsCollect: stampCardState.filter.filterIsCollect,
            filterIsNotCollect: stampCardState.filter.filterIsNotCollect,
            filterIsPublic: stampCardState.filter.filterIsPublic,
            filterIsNotPublic: stampCardState.filter.filterIsNotPublic,
            paginationIdxStart: getPaginationIdxStart(
                currentPageIdx,
                Constants.PAGINATION_BATCH_N,
                Constants.PAGE_SIZE_STAMP_CARDS_ASSOCIATED_WITH_POD,
            ),
            paginationN: getPaginationN(
                Constants.PAGE_SIZE_STAMP_CARDS_ASSOCIATED_WITH_POD,
                Constants.PAGINATION_BATCH_N,
            ),
        };
    };
    useEffect(() => {
        void dispatch(sliceHeaderActiveTabActions.setStateData(Constants.HEADER_ACTIVE_TAB_IDX__NO_ACTIVE_TAB));
        void setPodPageStateData();
        void setVisualizationStateData();
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        void handleGetTasksAssociatedWithPod({
            id: String(idPod),
            filterByName: taskState.filter.filterByName,
            filterIsComplete: taskState.filter.filterIsComplete,
            filterIsNotComplete: taskState.filter.filterIsNotComplete,
            filterIsStar: taskState.filter.filterIsStar,
            filterIsNotStar: taskState.filter.filterIsNotStar,
            filterIsPin: taskState.filter.filterIsPin,
            filterIsNotPin: taskState.filter.filterIsNotPin,
        });
        // eslint-disable-next-line
    }, [taskState.filter, tabIdx, idPod]);
    useEffect(() => {
        void handleGetStampCardsAssociatedWithPod(REQUEST_PARAMS_STAMP_CARDS(0));
        // eslint-disable-next-line
    }, [stampCardState.filter, tabIdx, idPod]);

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
                                } catch (e: any) {
                                    handleToggleImageSizeWarningModal(true);
                                }
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
                                            void handleGetTasksAssociatedWithPod({
                                                id: String(idPod),
                                                filterByName: taskState.filter.filterByName,
                                                filterIsComplete: taskState.filter.filterIsComplete,
                                                filterIsNotComplete: taskState.filter.filterIsNotComplete,
                                                filterIsStar: taskState.filter.filterIsStar,
                                                filterIsNotStar: taskState.filter.filterIsNotStar,
                                                filterIsPin: taskState.filter.filterIsPin,
                                                filterIsNotPin: taskState.filter.filterIsNotPin,
                                            });
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
                                            if (!slicePagePodStateData.getIsPublic()) {
                                                navigate('/discover'); // because you cannot view a private pod as a non-member
                                            } else {
                                                void setPodPageStateData();
                                                void handleGetTasksAssociatedWithPod({
                                                    id: String(idPod),
                                                    filterByName: taskState.filter.filterByName,
                                                    filterIsComplete: taskState.filter.filterIsComplete,
                                                    filterIsNotComplete: taskState.filter.filterIsNotComplete,
                                                    filterIsStar: taskState.filter.filterIsStar,
                                                    filterIsNotStar: taskState.filter.filterIsNotStar,
                                                    filterIsPin: taskState.filter.filterIsPin,
                                                    filterIsNotPin: taskState.filter.filterIsNotPin,
                                                });
                                            }
                                        } catch (e: any) {}
                                    }}
                                    isDisabledOnlyModerator={
                                        slicePagePodStateData.getIsPodModerator() &&
                                        slicePagePodStateData.getUserBubblesPodModeratorTotalNumber() === 1
                                    }
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
                                            100,
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
                                            100,
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

                        {slicePagePodStateData.getIsPodMember() ? (
                            <Box sx={{ marginBottom: '12px' }}>
                                <CreateStampModalButton
                                    idPod={idPod === undefined || idPod === null ? null : idPod}
                                    sideEffect={() => {}}
                                />
                            </Box>
                        ) : null}
                        {slicePagePodStateData.getIsPodModerator() ? (
                            <Box sx={{ marginBottom: '12px' }}>
                                <CreateTaskModalButton
                                    idPod={idPod ?? null}
                                    handleUpdate={() => {
                                        void setPodPageStateData();
                                        void handleGetTasksAssociatedWithPod({
                                            id: String(idPod),
                                            filterByName: taskState.filter.filterByName,
                                            filterIsComplete: taskState.filter.filterIsComplete,
                                            filterIsNotComplete: taskState.filter.filterIsNotComplete,
                                            filterIsStar: taskState.filter.filterIsStar,
                                            filterIsNotStar: taskState.filter.filterIsNotStar,
                                            filterIsPin: taskState.filter.filterIsPin,
                                            filterIsNotPin: taskState.filter.filterIsNotPin,
                                        });
                                    }}
                                    isDisabled={slicePagePodStateData.getIsReachedNumberOfTasksLimit()}
                                    disabledTooltipMessage={`You may only have up to ${String(
                                        Constants.LIMIT_NUMBER_OF_TOTAL_TASKS_POD,
                                    )} Tasks total in a Pod.`}
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
                            handleChangeText={debouncedHandleChangefilterByName}
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
                        {sliceTasksAssociatedWithPodResponse.getIsSuccess() ? (
                            <TaskCardList
                                tasks={sliceTasksAssociatedWithPodStateData}
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
                                handleSideEffectDeleteTask={() => {
                                    void handleGetTasksAssociatedWithPod({
                                        id: String(idPod),
                                        filterByName: taskState.filter.filterByName,
                                        filterIsComplete: taskState.filter.filterIsComplete,
                                        filterIsNotComplete: taskState.filter.filterIsNotComplete,
                                        filterIsStar: taskState.filter.filterIsStar,
                                        filterIsNotStar: taskState.filter.filterIsNotStar,
                                        filterIsPin: taskState.filter.filterIsPin,
                                        filterIsNotPin: taskState.filter.filterIsNotPin,
                                    });
                                    void setPodPageStateData();
                                    void setVisualizationStateData();
                                }}
                            />
                        ) : sliceTasksAssociatedWithPodResponse.getIsLoading() ? (
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
                        ) : sliceTasksAssociatedWithPodResponse.getIsError() ? (
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
                            stampCards={sliceStampCardsAssociatedWithPodStateData}
                            isShowCreateStampModal={true}
                            isLoading={sliceStampCardsAssociatedWithPodStateResponse.getIsLoading()}
                            paginationPageSize={Constants.PAGE_SIZE_STAMP_CARDS_ASSOCIATED_WITH_POD}
                            paginationBatchN={Constants.PAGINATION_BATCH_N}
                            paginationTotalN={sliceStampCardsAssociatedWithPodState.pagination.totalN}
                            paginationPageIdx={sliceStampCardsAssociatedWithPodState.pagination.currentPageIdx}
                            handleUpdatePaginationPageIdx={(newPaginationPageIdx: number) => {
                                const isRequireRequestNewBatch =
                                    Math.floor(newPaginationPageIdx / Constants.PAGINATION_BATCH_N) !==
                                    Math.floor(
                                        sliceStampCardsAssociatedWithPodState.pagination.currentPageIdx /
                                            Constants.PAGINATION_BATCH_N,
                                    );
                                dispatch(
                                    sliceStampCardsAssociatedWithPodActions.setPaginationCurrentPageIdx(
                                        newPaginationPageIdx,
                                    ),
                                );
                                if (isRequireRequestNewBatch) {
                                    void handleGetStampCardsAssociatedWithPod(
                                        REQUEST_PARAMS_STAMP_CARDS(newPaginationPageIdx),
                                    );
                                }
                            }}
                            sideEffect={() => {}}
                        />
                    </Box>
                </React.Fragment>
            ) : null}
            {tabIdxToDisplayMap[tabIdx] === 'progress' ? <NumberOfPointsInTasksCompletedOverTimeVisualization /> : null}
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

export default PagePod;
