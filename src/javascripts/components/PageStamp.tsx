import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { Link, useParams } from 'react-router-dom';
import { Box, Divider, Grid, Typography, Tab, Tabs, TextField, IconButton, Tooltip } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import FilterTasks from 'src/javascripts/components/FilterTasks';
import FilterPods from 'src/javascripts/components/FilterPods';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import PodCardList from 'src/javascripts/components/PodCardList';
import AvatarImageEditor from 'src/javascripts/components/AvatarImageEditor';
import UserListButton from 'src/javascripts/components/UserListButton';
import EditStampModalButton from 'src/javascripts/components/EditStampModalButton';
import { getInputText, getUserListButtonText } from 'src/javascripts/utilities';
import NumberOfPointsInTasksCompletedOverTimeVisualization from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualization';
import { PAGE_SIZE_TASK } from 'src/javascripts/clients/ResourceClientConfig';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import TaskModel from 'src/javascripts/models/TaskModel';
import PodCardModel from 'src/javascripts/models/PodCardModel';
import StampPageModel from 'src/javascripts/models/StampPageModel';
import Constants from 'src/javascripts/Constants';
import PlaceholderImageStamp from 'src/assets/PlaceholderImageStamp.png';
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded';
import AddIcon from '@mui/icons-material/Add';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';
import ResponseModel from 'src/javascripts/models/ResponseModel';
import NumberOfPointsInTasksCompletedOverTimeVisualizationModel from 'src/javascripts/models/NumberOfPointsInTasksCompletedOverTimeVisualizationModel';
import { slicePageStampActions } from 'src/javascripts/store/SlicePageStamp';
import { sliceVisualizationActions } from 'src/javascripts/store/SliceVisualization';
import { slicePodCardsAssociatedWithStampActions } from 'src/javascripts/store/SlicePodCardsAssociatedWithStamp';
import { slicePaginationPageNumberActions } from 'src/javascripts/store/SlicePaginationPageNumber';

import type { IRootState } from 'src/javascripts/store';
const tabIdxToDisplayMap: any = {
    0: 'task',
    1: 'pod',
    2: 'progress',
};
export interface IStampPageState {
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
    response: {
        state: string;
        errorMessage: string | null;
    };
}
export interface IPodCardState {
    filter: {
        filterNameOrDescription: string;
        filterIsPublic: boolean;
        filterIsNotPublic: boolean;
        filterIsMember: boolean;
        filterIsNotMember: boolean;
        filterIsModerator: boolean;
        filterIsNotModerator: boolean;
    };
}
const PageStamp: React.FC = () => {
    const { id: idStamp } = useParams();
    const dispatch = useDispatch();
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    const slicePageStampState = useSelector((state: IRootState) => state.pageStamp);
    const slicePageStampStateData = new StampPageModel(slicePageStampState.data);
    const slicePageStampStateResponse = new ResponseModel(slicePageStampState.response);
    const sliceVisualizationState = useSelector((state: IRootState) => state.visualization);
    const sliceVisualizationStateData = new NumberOfPointsInTasksCompletedOverTimeVisualizationModel(
        sliceVisualizationState.data,
    );
    const sliceVisualizationStateResponse = new ResponseModel(sliceVisualizationState.response);
    const slicePodCardsAssociatedWithStampState = useSelector((state: IRootState) => state.podCardsAssociatedWithStamp);
    const slicePodCardsAssociatedWithStampStateData = slicePodCardsAssociatedWithStampState.data.map(
        (d: any) => new PodCardModel(d),
    );
    const slicePodCardsAssociatedWithStampStateResponse = new ResponseModel(
        slicePodCardsAssociatedWithStampState.response,
    );
    const [stampPageState, setStampPageState] = useState<IStampPageState>({
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
                editModeValue: '', // TODO what to show during loading? maybe blank image?
            },
        },
    });

    const [tabIdx, setTabIdx] = useState(0);
    // tasks
    const [taskState, setTaskState] = useState<ITaskState>({
        data: [],
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
        response: {
            state: Constants.RESPONSE_STATE_LOADING,
            errorMessage: null,
        },
    });

    // filter pods
    const [podCardState, setPodCardState] = useState<IPodCardState>({
        filter: {
            filterNameOrDescription: '',
            filterIsPublic: true,
            filterIsNotPublic: true,
            filterIsMember: true,
            filterIsNotMember: true,
            filterIsModerator: true,
            filterIsNotModerator: true,
        },
    });
    const setStampPageStateData = async (): Promise<any> => {
        try {
            dispatch(slicePageStampActions.setStateResponseLoading());
            const response = await ResourceClient.postResource(
                'api/app/GetStampPage',
                { id: String(idStamp) },
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(slicePageStampActions.setStateData(response.data));
            setStampPageState((prevState: IStampPageState) => {
                const stampPageModel = new StampPageModel(response.data);
                return {
                    ...prevState,
                    editMode: {
                        ...prevState.editMode,
                        name: {
                            ...prevState.editMode.name,
                            editModeValue: stampPageModel.getName(),
                        },
                        description: {
                            ...prevState.editMode.description,
                            editModeValue: String(
                                stampPageModel.getDescription() !== null ? stampPageModel.getDescription() : '',
                            ),
                        },
                        imageLink: {
                            ...prevState.editMode.imageLink,
                            editModeValue: stampPageModel.getImageLink(),
                        },
                    },
                };
            });
        } catch (e: any) {
            dispatch(slicePageStampActions.setStateResponseError(e?.response?.data?.message));
        }
    };
    const handleGetTasksAssociatedWithStamp = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetTasksAssociatedWithStamp',
                requestBodyObject,
                sliceAuthenticationStateData.getJwtToken(),
            );
            setTaskState((prevState) => {
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
            setTaskState((prevState) => {
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

    const handleGetPodCardsAssociatedWithStamp = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            dispatch(slicePaginationPageNumberActions.setStateData(1));
            const response = await ResourceClient.postResource(
                'api/app/GetPodCardsAssociatedWithStamp',
                requestBodyObject,
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(slicePodCardsAssociatedWithStampActions.setStateData(response.data));
        } catch (e: any) {
            dispatch(slicePodCardsAssociatedWithStampActions.setStateResponseError(e?.response?.data?.message));
        }
    };
    const setVisualizationStateData = async (): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetNumberOfPointsInTasksCompletedOverTimeVisualizationAssociatedWithStamp',
                { id: String(idStamp) },
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
            } else if (tabIdxToDisplayMap[tabIdx] === 'pod') {
                setPodCardState((prevState: IPodCardState) => {
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
        void setStampPageStateData();
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        void handleGetTasksAssociatedWithStamp({
            id: String(idStamp),
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
        void handleGetPodCardsAssociatedWithStamp({
            id: String(idStamp),
            filterNameOrDescription: podCardState.filter.filterNameOrDescription,
            filterIsPublic: podCardState.filter.filterIsPublic,
            filterIsNotPublic: podCardState.filter.filterIsNotPublic,
            filterIsMember: podCardState.filter.filterIsMember,
            filterIsNotMember: podCardState.filter.filterIsNotMember,
            filterIsModerator: podCardState.filter.filterIsModerator,
            filterIsNotModerator: podCardState.filter.filterIsNotModerator,
        });
        // eslint-disable-next-line
    }, [podCardState.filter, tabIdx]);

    const isErrorEditModeValueStampName =
        getInputText(stampPageState.editMode.name.editModeValue).length < Constants.STAMP_NAME_MIN_LENGTH_CHARACTERS ||
        getInputText(stampPageState.editMode.name.editModeValue).length > Constants.STAMP_NAME_MAX_LENGTH_CHARACTERS;
    const isErrorEditModeValueStampDescription =
        getInputText(stampPageState.editMode.description.editModeValue).length >
        Constants.STAMP_DESCRIPTION_MAX_LENGTH_CHARACTERS;

    return (
        <Box sx={{ background: THEME.palette.other.gradient, minHeight: '100vh' }}>
            <Box>
                <Grid container direction="row">
                    <Grid item sx={{ padding: '24px' }}>
                        <AvatarImageEditor
                            imageUploadHandler={async (imageAsBase64String: string) => {
                                try {
                                    const response = await ResourceClient.postResource(
                                        'api/app/UpdateStamp',
                                        {
                                            id: idStamp,
                                            imageAsBase64String: getInputText(imageAsBase64String),
                                        },
                                        sliceAuthenticationStateData.getJwtToken(),
                                    );
                                    dispatch(slicePageStampActions.setStateData(response.data));
                                } catch (e: any) {}
                            }}
                            imageLink={slicePageStampStateData.getImageLink()}
                            placeholderImage={PlaceholderImageStamp}
                            isReadOnly={!slicePageStampStateData.getIsCreatedByMe()}
                        />
                        <Box
                            sx={{
                                marginTop: '16px',
                                marginBottom: '8px',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="h6">
                                {`Created by: `}
                                <Link to={`/profiles/${String(slicePageStampStateData.getIdUserCreate())}`}>
                                    {`@${slicePageStampStateData.getUsernameUserCreate()}`}
                                </Link>
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {slicePageStampStateData.getIsCollectedByMe() ? (
                                <IconButton
                                    edge="end"
                                    aria-label="icon-button-is-collect-stamp"
                                    sx={{
                                        cursor: 'default',
                                        color: THEME.palette.info.main,
                                    }}
                                    disableRipple={true}
                                >
                                    <Tooltip title={'You have collected this stamp'} placement="bottom">
                                        <CollectionsBookmarkRoundedIcon />
                                    </Tooltip>
                                </IconButton>
                            ) : slicePageStampStateData.getIsEligibleToBeCollectedByMe() ? (
                                <Tooltip title={'Add this Stamp to your collection'} placement="bottom">
                                    <IconButton
                                        edge="end"
                                        aria-label="icon-button-collect-stamp-eligible"
                                        /* eslint-disable @typescript-eslint/no-misused-promises */
                                        onClick={async () => {
                                            try {
                                                await ResourceClient.postResource(
                                                    'api/app/CollectStamp',
                                                    {
                                                        id: String(idStamp),
                                                    },
                                                    sliceAuthenticationStateData.getJwtToken(),
                                                );
                                                void setStampPageStateData();
                                            } catch (e: any) {
                                                dispatch(
                                                    slicePageStampActions.setStateResponseError(
                                                        e?.response?.data?.message,
                                                    ),
                                                );
                                            }
                                        }}
                                    >
                                        <CollectionsBookmarkRoundedIcon />
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Tooltip
                                    title={
                                        'Add this Stamp to your collection (requires all Tasks to be completed first)'
                                    }
                                    placement="bottom"
                                >
                                    <IconButton
                                        edge="end"
                                        aria-label="icon-button-collect-stamp-ineligible"
                                        sx={{
                                            cursor: 'default',
                                            color: THEME.palette.other.disabledButtonColor,
                                        }}
                                        disableRipple={true}
                                    >
                                        <CollectionsBookmarkRoundedIcon />
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                        <Box sx={{ marginTop: '12px', marginBottom: '12px' }}>
                            {!slicePageStampStateResponse.getIsLoading() ? (
                                <Box sx={{ display: 'flex', width: '100%', marginBottom: '12px' }}>
                                    <UserListButton
                                        labelText={getUserListButtonText(
                                            slicePageStampStateData.getUserBubblesStampCollectTotalNumber(),
                                            'collected',
                                            'collected',
                                        )}
                                        userBubbles={slicePageStampStateData.getUserBubblesStampCollect()}
                                        sortByTimestampLabel="time collect stamp"
                                        apiPath={'api/app/GetUserBubblesStampCollect'}
                                        apiPayload={{ id: String(idStamp) }}
                                        modalTitle="Users Collected Stamp"
                                        isUseDateTimeDateAndTime={false}
                                    />
                                </Box>
                            ) : null}
                        </Box>
                        {slicePageStampStateData.getIsCreatedByMe() ? (
                            <Box sx={{ marginBottom: '12px' }}>
                                <EditStampModalButton idStamp={slicePageStampStateData.getId()} />
                            </Box>
                        ) : null}
                    </Grid>
                    <Grid item sx={{ width: '1000px', padding: '24px' }}>
                        <Grid container direction="column">
                            <Grid item sx={{ width: '100%' }}>
                                {stampPageState.editMode.name.isEditMode ? (
                                    <TextField
                                        id="pod-edit-name"
                                        defaultValue={slicePageStampStateData.getName()}
                                        fullWidth
                                        value={stampPageState.editMode.name.editModeValue}
                                        onBlur={async () => {
                                            setStampPageState((prevState: IStampPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        name: {
                                                            ...prevState.editMode.name,
                                                            isEditMode: false,
                                                            ...(isErrorEditModeValueStampName
                                                                ? {
                                                                      editModeValue: slicePageStampStateData.getName(),
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValueStampName) {
                                                try {
                                                    const response = await ResourceClient.postResource(
                                                        'api/app/UpdateStamp',
                                                        {
                                                            id: idStamp,
                                                            name: getInputText(
                                                                stampPageState.editMode.name.editModeValue,
                                                            ),
                                                        },
                                                        sliceAuthenticationStateData.getJwtToken(),
                                                    );
                                                    dispatch(slicePageStampActions.setStateData(response.data));
                                                } catch (e: any) {
                                                    dispatch(
                                                        slicePageStampActions.setStateResponseError(
                                                            e?.response?.data?.message,
                                                        ),
                                                    );
                                                }
                                            }
                                        }}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setStampPageState((prevState: IStampPageState) => {
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
                                                setStampPageState((prevState: IStampPageState) => {
                                                    return {
                                                        ...prevState,
                                                        editMode: {
                                                            ...prevState.editMode,
                                                            name: {
                                                                ...prevState.editMode.name,
                                                                isEditMode: false,
                                                                ...(isErrorEditModeValueStampName
                                                                    ? {
                                                                          editModeValue:
                                                                              slicePageStampStateData.getName(),
                                                                      }
                                                                    : {}),
                                                            },
                                                        },
                                                    };
                                                });
                                                if (!isErrorEditModeValueStampName) {
                                                    try {
                                                        const response = await ResourceClient.postResource(
                                                            'api/app/UpdateStamp',
                                                            {
                                                                id: idStamp,
                                                                name: getInputText(
                                                                    stampPageState.editMode.name.editModeValue,
                                                                ),
                                                            },
                                                            sliceAuthenticationStateData.getJwtToken(),
                                                        );
                                                        dispatch(slicePageStampActions.setStateData(response.data));
                                                    } catch (e: any) {
                                                        dispatch(
                                                            slicePageStampActions.setStateResponseError(
                                                                e?.response?.data?.message,
                                                            ),
                                                        );
                                                    }
                                                }
                                            }
                                        }}
                                        helperText={Constants.STAMP_INPUT_NAME_HELPER_TEXT(
                                            getInputText(stampPageState.editMode.name.editModeValue).length,
                                        )}
                                        error={isErrorEditModeValueStampName}
                                    />
                                ) : (
                                    <Typography
                                        variant="h3"
                                        onClick={() => {
                                            setStampPageState((prevState: IStampPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        name: {
                                                            ...prevState.editMode.name,
                                                            isEditMode: slicePageStampStateData.getIsCreatedByMe(),
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ height: '60px', overflowY: 'auto' }}
                                    >
                                        {slicePageStampStateData.getName()}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item sx={{ marginTop: '24px', marginBottom: '32px' }}>
                                <Divider variant="fullWidth" />
                            </Grid>
                            <Grid item sx={{ height: '400px', overflowY: 'auto', width: '100%' }}>
                                {stampPageState.editMode.description.isEditMode ? (
                                    <TextField
                                        id="user-edit-bio"
                                        multiline
                                        maxRows={12}
                                        defaultValue={slicePageStampStateData.getDescription()}
                                        fullWidth
                                        value={stampPageState.editMode.description.editModeValue}
                                        onBlur={async () => {
                                            setStampPageState((prevState: IStampPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        description: {
                                                            ...prevState.editMode.description,
                                                            isEditMode: false,
                                                            ...(isErrorEditModeValueStampDescription
                                                                ? {
                                                                      editModeValue:
                                                                          slicePageStampStateData.getDescription() ??
                                                                          '',
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValueStampDescription) {
                                                try {
                                                    const response = await ResourceClient.postResource(
                                                        'api/app/UpdateStamp',
                                                        {
                                                            id: idStamp,
                                                            description:
                                                                getInputText(
                                                                    stampPageState.editMode.description.editModeValue,
                                                                ).length === 0
                                                                    ? null
                                                                    : getInputText(
                                                                          stampPageState.editMode.description
                                                                              .editModeValue,
                                                                      ),
                                                        },
                                                        sliceAuthenticationStateData.getJwtToken(),
                                                    );
                                                    dispatch(slicePageStampActions.setStateData(response.data));
                                                } catch (e: any) {}
                                            }
                                        }}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setStampPageState((prevState: IStampPageState) => {
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
                                                setStampPageState((prevState: IStampPageState) => {
                                                    return {
                                                        ...prevState,
                                                        editMode: {
                                                            ...prevState.editMode,
                                                            description: {
                                                                ...prevState.editMode.description,
                                                                isEditMode: false,
                                                                ...(isErrorEditModeValueStampDescription
                                                                    ? {
                                                                          editModeValue:
                                                                              slicePageStampStateData.getName() ?? '',
                                                                      }
                                                                    : {}),
                                                            },
                                                        },
                                                    };
                                                });
                                                if (!isErrorEditModeValueStampDescription) {
                                                    try {
                                                        const response = await ResourceClient.postResource(
                                                            'api/app/UpdateStamp',
                                                            {
                                                                id: idStamp,
                                                                description:
                                                                    getInputText(
                                                                        stampPageState.editMode.description
                                                                            .editModeValue,
                                                                    ).length === 0
                                                                        ? null
                                                                        : getInputText(
                                                                              stampPageState.editMode.description
                                                                                  .editModeValue,
                                                                          ),
                                                            },
                                                            sliceAuthenticationStateData.getJwtToken(),
                                                        );
                                                        dispatch(slicePageStampActions.setStateData(response.data));
                                                    } catch (e: any) {}
                                                }
                                            }
                                        }}
                                        helperText={Constants.STAMP_INPUT_DESCRIPTION_HELPER_TEXT(
                                            getInputText(stampPageState.editMode.description.editModeValue).length,
                                        )}
                                        error={isErrorEditModeValueStampDescription}
                                        inputProps={{ style: { fontFamily: 'monospace' } }}
                                    />
                                ) : (
                                    <Typography
                                        variant="body1"
                                        fontFamily="monospace"
                                        onClick={() => {
                                            setStampPageState((prevState: IStampPageState) => {
                                                return {
                                                    ...prevState,
                                                    editMode: {
                                                        ...prevState.editMode,
                                                        description: {
                                                            ...prevState.editMode.description,
                                                            isEditMode: slicePageStampStateData.getIsCreatedByMe(),
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {slicePageStampStateData.getDescription() !== null
                                            ? slicePageStampStateData.getDescription()
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
                    <Tab sx={{ width: '150px' }} label="Pods" />
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
                            isAuthorizedToComplete={true}
                            isReadOnlyTaskBody={true}
                            isReadOnlyTaskNotes={false}
                            isDisplayViewPodLink={true}
                            isDisplayOptionsStarPinDelete={true}
                            isAuthorizedToDelete={false}
                            handleSideEffectToggleTaskComplete={() => {
                                void setStampPageStateData();
                                void setVisualizationStateData();
                            }}
                            handleSideEffectChangeNumberOfPoints={() => {
                                void setStampPageStateData();
                                void setVisualizationStateData();
                            }}
                        />
                    </Box>
                </React.Fragment>
            ) : null}
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
                            podCards={slicePodCardsAssociatedWithStampStateData}
                            isShowCreatePodModal={false}
                            isLoading={slicePodCardsAssociatedWithStampStateResponse.getIsLoading()}
                            pageSize={Constants.PAGE_SIZE_STAMP_PAGE_ASSOCIATED_POD_CARDS}
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

export default PageStamp;
