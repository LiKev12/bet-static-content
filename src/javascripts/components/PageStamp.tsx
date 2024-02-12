import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Link, useParams } from 'react-router-dom';
import { Box, Divider, Grid, Typography, Tab, Tabs, TextField, IconButton, Tooltip } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import FilterTasks from 'src/javascripts/components/FilterTasks';
import FilterPods from 'src/javascripts/components/FilterPods';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import PodCardList from 'src/javascripts/components/PodCardList';
import AvatarImageEditor from 'src/javascripts/components/AvatarImageEditor';
import { MOCK_MY_USER_ID } from 'src/javascripts/mocks/Mocks';
import UserListButton from 'src/javascripts/components/UserListButton';
import EditStampModalButton from 'src/javascripts/components/EditStampModalButton';
import { getInputText, getUserListButtonText } from 'src/javascripts/utilities';
import NumberOfPointsInTasksCompletedOverTimeVisualization from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualization';
import { PAGE_SIZE_POD, PAGE_SIZE_TASK } from 'src/javascripts/clients/ResourceClientConfig';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import TaskModel from 'src/javascripts/models/TaskModel';
import PodCardModel from 'src/javascripts/models/PodCardModel';
import StampPageModel from 'src/javascripts/models/StampPageModel';
import Constants from 'src/javascripts/Constants';
import PlaceholderImageStamp from 'src/assets/PlaceholderImageStamp.png';
import AlertDialog from 'src/javascripts/components/AlertDialog';
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded';
import AddIcon from '@mui/icons-material/Add';

const tabIdxToDisplayMap: any = {
    0: 'task',
    1: 'pod',
    2: 'progress',
};
export interface IStampPageState {
    data: StampPageModel;
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
    response: {
        state: string;
        errorMessage: string | null;
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
    data: PodCardModel[];
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
    response: {
        state: string;
        errorMessage: string | null;
    };
}
const PageStamp: React.FC = () => {
    const { id: idStamp } = useParams();
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
        data: new StampPageModel(null, true),
        response: {
            state: Constants.RESPONSE_STATE_LOADING,
            errorMessage: null,
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
        data: [],
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
        response: {
            state: Constants.RESPONSE_STATE_LOADING,
            errorMessage: null,
        },
    });
    const handleGetResourceStampPage = (pathApi: string, queryParamsObject: Record<string, unknown>): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                setStampPageState((prevState: IStampPageState) => {
                    const stampPageModel = new StampPageModel(responseJson);
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
                        data: new StampPageModel(responseJson),
                        response: {
                            ...prevState.response,
                            state: Constants.RESPONSE_STATE_SUCCESS,
                            errorMessage: null,
                        },
                    };
                });
            })
            .catch((responseError: any) => {
                setStampPageState((prevState: IStampPageState) => {
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
    const handleGetResourceTasksAssociatedWithStamp = (
        pathApi: string,
        queryParamsObject: Record<string, unknown>,
    ): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                setTaskState((prevState) => {
                    return {
                        ...prevState,
                        data: responseJson.content.map((datapoint: any) => {
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
                setTaskState((prevState) => {
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

    const handleGetResourcePodsAssociatedWithStamp = (
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
    const handleUpdateStampPage = (responseJson: any): void => {
        setStampPageState((prevState: any) => {
            return {
                ...prevState,
                data: new StampPageModel(responseJson),
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
            }
        },
        500,
    );
    useEffect(() => {
        handleGetResourceStampPage(`api/stamp/read/stamps/${String(idStamp)}/page`, {
            idUser: MOCK_MY_USER_ID,
        });
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        handleGetResourceTasksAssociatedWithStamp(`api/stamp/read/stamps/${String(idStamp)}/tasks`, {
            idUser: MOCK_MY_USER_ID,
            filterNameOrDescription: taskState.filter.filterNameOrDescription,
            filterIsComplete: taskState.filter.filterIsComplete,
            filterIsNotComplete: taskState.filter.filterIsNotComplete,
            filterIsStar: taskState.filter.filterIsStar,
            filterIsNotStar: taskState.filter.filterIsNotStar,
            filterIsPin: taskState.filter.filterIsPin,
            filterIsNotPin: taskState.filter.filterIsNotPin,
            page: taskState.pagination.pageNumber,
            size: taskState.pagination.pageSize,
        });
        // eslint-disable-next-line
    }, [taskState.filter, tabIdx]);
    useEffect(() => {
        handleGetResourcePodsAssociatedWithStamp(`api/stamp/read/stamps/${String(idStamp)}/pods`, {
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
    }, [podCardState.filter, tabIdx]);

    const isErrorEditModeValueStampName =
        getInputText(stampPageState.editMode.name.editModeValue).length < Constants.STAMP_NAME_MIN_LENGTH_CHARACTERS ||
        getInputText(stampPageState.editMode.name.editModeValue).length > Constants.STAMP_NAME_MAX_LENGTH_CHARACTERS;
    const isErrorEditModeValueStampDescription =
        getInputText(stampPageState.editMode.description.editModeValue).length >
        Constants.STAMP_DESCRIPTION_MAX_LENGTH_CHARACTERS;

    return (
        <Box sx={{ background: THEME.palette.other.gradient, minHeight: '100vh' }}>
            {stampPageState.response.state === Constants.RESPONSE_STATE_ERROR &&
            stampPageState.response.errorMessage !== null ? (
                <AlertDialog
                    title="Error"
                    message={stampPageState.response.errorMessage}
                    isOpen={stampPageState.response.state === Constants.RESPONSE_STATE_ERROR}
                    handleClose={() => {
                        setStampPageState((prevState: IStampPageState) => {
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
                                    'api/stamp/update/stamp',
                                    { idUser: MOCK_MY_USER_ID },
                                    {
                                        id: idStamp,
                                        imageAsBase64String: getInputText(imageAsBase64String),
                                    },
                                )
                                    .then((responseJson: any) => {
                                        handleUpdateStampPage(responseJson);
                                    })
                                    .catch(() => {});
                            }}
                            imageLink={stampPageState.data.getImageLink()}
                            placeholderImage={PlaceholderImageStamp}
                            isReadOnly={!stampPageState.data.getIsCreatedByMe()}
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
                                <Link to={`/profiles/${String(stampPageState.data.getIdUserCreate())}`}>
                                    {`@${stampPageState.data.getUsernameUserCreate()}`}
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
                            {stampPageState.data.getIsCollectedByMe() ? (
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
                            ) : stampPageState.data.getIsEligibleToBeCollectedByMe() ? (
                                <Tooltip title={'Add this Stamp to your collection'} placement="bottom">
                                    <IconButton
                                        edge="end"
                                        aria-label="icon-button-collect-stamp-eligible"
                                        onClick={() => {
                                            ResourceClient.postResource(
                                                'api/stamp/update/collectStamp',
                                                {
                                                    idUser: MOCK_MY_USER_ID,
                                                },
                                                {
                                                    idStamp,
                                                },
                                            )
                                                .then(() => {
                                                    handleGetResourceStampPage(
                                                        `api/stamp/read/stamps/${String(idStamp)}/page`,
                                                        {
                                                            idUser: MOCK_MY_USER_ID,
                                                        },
                                                    );
                                                })
                                                .catch((responseError: any) => {
                                                    setStampPageState((prevState: IStampPageState) => {
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
                        <Box sx={{ marginTop: '12px', paddingBottom: '12px' }}>
                            {stampPageState.response.state !== Constants.RESPONSE_STATE_LOADING &&
                            stampPageState.data.getUserBubblesStampCollect() !== null ? (
                                <Grid container direction="row" sx={{ marginBottom: '8px' }}>
                                    <Grid item sx={{ display: 'flex', width: '100%' }}>
                                        <UserListButton
                                            labelText={getUserListButtonText(
                                                stampPageState.data.getUserBubblesStampCollectTotalNumber(),
                                                'collected',
                                                'collected',
                                            )}
                                            userBubbles={stampPageState.data.getUserBubblesStampCollect()}
                                            sortByTimestampLabel="time collect stamp"
                                            apiPath={`api/stamp/read/stamps/${String(idStamp)}/userBubblesStampCollect`}
                                            modalTitle="Users Collected Stamp"
                                            isUseDateTimeDateAndTime={false}
                                        />
                                    </Grid>
                                </Grid>
                            ) : null}
                        </Box>
                        {stampPageState.data.getIsCreatedByMe() ? (
                            <Box sx={{ marginBottom: '12px' }}>
                                <EditStampModalButton idStamp={stampPageState.data.getId()} />
                            </Box>
                        ) : null}
                    </Grid>
                    <Grid item sx={{ width: '1000px', padding: '24px' }}>
                        <Grid container direction="column">
                            <Grid item sx={{ width: '100%' }}>
                                {stampPageState.editMode.name.isEditMode ? (
                                    <TextField
                                        id="pod-edit-name"
                                        defaultValue={stampPageState.data.getName()}
                                        fullWidth
                                        value={stampPageState.editMode.name.editModeValue}
                                        onBlur={() => {
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
                                                                      editModeValue: prevState.data.name,
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValueStampName) {
                                                ResourceClient.postResource(
                                                    'api/stamp/update/stamp',
                                                    {
                                                        idUser: MOCK_MY_USER_ID,
                                                    },
                                                    {
                                                        id: idStamp,
                                                        name: getInputText(stampPageState.editMode.name.editModeValue),
                                                    },
                                                )
                                                    .then((responseJson: any) => {
                                                        handleUpdateStampPage(responseJson);
                                                    })
                                                    .catch((responseError: any) => {
                                                        setStampPageState((prevState: IStampPageState) => {
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
                                        onKeyDown={(event: React.KeyboardEvent) => {
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
                                                                          editModeValue: prevState.data.name,
                                                                      }
                                                                    : {}),
                                                            },
                                                        },
                                                    };
                                                });
                                                if (!isErrorEditModeValueStampName) {
                                                    ResourceClient.postResource(
                                                        'api/stamp/update/stamp',
                                                        {
                                                            idUser: MOCK_MY_USER_ID,
                                                        },
                                                        {
                                                            id: idStamp,
                                                            name: getInputText(
                                                                stampPageState.editMode.name.editModeValue,
                                                            ),
                                                        },
                                                    )
                                                        .then((responseJson: any) => {
                                                            handleUpdateStampPage(responseJson);
                                                        })
                                                        .catch((responseError: any) => {
                                                            setStampPageState((prevState: IStampPageState) => {
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
                                                            isEditMode: stampPageState.data.getIsCreatedByMe(),
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ height: '60px', overflowY: 'auto' }}
                                    >
                                        {stampPageState.data.getName()}
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
                                        defaultValue={stampPageState.data.getDescription()}
                                        fullWidth
                                        value={stampPageState.editMode.description.editModeValue}
                                        onBlur={() => {
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
                                                                      editModeValue: prevState.data.description ?? '',
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValueStampDescription) {
                                                ResourceClient.postResource(
                                                    'api/stamp/update/stamp',
                                                    {
                                                        idUser: MOCK_MY_USER_ID,
                                                    },
                                                    {
                                                        id: idStamp,
                                                        description:
                                                            getInputText(
                                                                stampPageState.editMode.description.editModeValue,
                                                            ).length === 0
                                                                ? null
                                                                : getInputText(
                                                                      stampPageState.editMode.description.editModeValue,
                                                                  ),
                                                    },
                                                )
                                                    .then((responseJson: any) => {
                                                        handleUpdateStampPage(responseJson);
                                                    })
                                                    .catch(() => {});
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
                                        onKeyDown={(event: React.KeyboardEvent) => {
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
                                                                              prevState.data.description ?? '',
                                                                      }
                                                                    : {}),
                                                            },
                                                        },
                                                    };
                                                });
                                                if (!isErrorEditModeValueStampDescription) {
                                                    ResourceClient.postResource(
                                                        'api/stamp/update/stamp',
                                                        {
                                                            idUser: MOCK_MY_USER_ID,
                                                        },
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
                                                    )
                                                        .then((responseJson: any) => {
                                                            handleUpdateStampPage(responseJson);
                                                        })
                                                        .catch(() => {});
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
                                                            isEditMode: stampPageState.data.getIsCreatedByMe(),
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {stampPageState.data.getDescription() !== null
                                            ? stampPageState.data.getDescription()
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
                            isReadOnlyTaskNotes={true}
                            isDisplayViewPodLink={true}
                            isDisplayOptionsStarPinDelete={false}
                            isAuthorizedToDelete={false}
                            handleUpdateUponToggleTaskComplete={() => {
                                handleGetResourceStampPage(`api/stamp/read/stamps/${String(idStamp)}/page`, {
                                    idUser: MOCK_MY_USER_ID,
                                });
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
                            podCards={podCardState.data}
                            isShowCreatePodModal={false}
                            isLoading={podCardState.response.state === Constants.RESPONSE_STATE_LOADING}
                            handleChangePaginationPageNumber={() => {}}
                            paginationTotalPages={0}
                        />
                    </Box>
                </React.Fragment>
            ) : null}
            {tabIdxToDisplayMap[tabIdx] === 'progress' ? (
                <NumberOfPointsInTasksCompletedOverTimeVisualization
                    apiPath={`api/stamp/read/stamps/${String(
                        idStamp,
                    )}/numberOfPointsInTasksCompletedOverTimeVisualization`}
                    refreshSwitchValue={true}
                />
            ) : null}
        </Box>
    );
};

export default PageStamp;
