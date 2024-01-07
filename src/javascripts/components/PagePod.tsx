import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { Box, Divider, Grid, Typography, Tab, Tabs, TextField } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import FilterTasks from 'src/javascripts/components/FilterTasks';
import FilterStamps from 'src/javascripts/components/FilterStamps';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import StampCardList from 'src/javascripts/components/StampCardList';
import AvatarImageEditor from 'src/javascripts/components/AvatarImageEditor';
import { MOCK_MY_USER_ID } from 'src/javascripts/mocks/Mocks';
import UserListButton from 'src/javascripts/components/UserListButton';
import JoinPodButton from 'src/javascripts/components/JoinPodButton';
import CreateStampModal from 'src/javascripts/components/CreateStampModal';
import CreateTaskModal from 'src/javascripts/components/CreateTaskModal';
import { getInputText } from 'src/javascripts/utilities';
import NumberOfPointsInTasksCompletedOverTimeVisualization from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualization';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import TaskModel from 'src/javascripts/models/TaskModel';
import StampCardModel from 'src/javascripts/models/StampCardModel';
import { PAGE_SIZE_STAMP, PAGE_SIZE_TASK } from 'src/javascripts/clients/ResourceClientConfig';
import PodPageModel from 'src/javascripts/models/PodPageModel';
import Constants from 'src/javascripts/Constants';
const tabIdxToDisplayMap: any = {
    0: 'task',
    1: 'stamp',
    2: 'progress',
};

export interface IPodPageState {
    data: any;
    isLoading: boolean;
    responseError: any;
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
    isLoading: boolean;
    responseError: any;
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
    data: any;
    isLoading: boolean;
    responseError: any;
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
        data: {
            name: '',
            description: '',
            imageLink: '',
        },
        isLoading: true,
        responseError: null,
    });

    // filter tasks
    const [taskState, setTaskState] = useState<ITaskState>({
        data: [],
        isLoading: true,
        responseError: null,
        filter: {
            filterNameOrDescription: '',
            filterIsComplete: false,
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
        isLoading: true,
        responseError: null,
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

    const handleGetResourcePodPage = (pathApi: string, queryParamsObject: Record<string, unknown>): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
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
                        data: {
                            id: podPageModel.getId(),
                            name: podPageModel.getName(),
                            description: podPageModel.getDescription(),
                            imageLink: podPageModel.getImageLink(),
                        },
                        isLoading: false,
                    };
                });
            })
            .catch((responseError: any) => {
                setPodPageState((prevState: IPodPageState) => {
                    return {
                        ...prevState,
                        isLoading: false,
                        responseError,
                    };
                });
            });
    };
    const handleGetResourceTasksAssociatedWithPod = (
        pathApi: string,
        queryParamsObject: Record<string, unknown>,
    ): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                setTaskState((prevState: ITaskState) => {
                    return {
                        ...prevState,
                        data: responseJson.content.map((datapoint: any) => {
                            const taskModel = new TaskModel(datapoint);
                            return {
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

                                handleToggleStar: () => {},
                                handleTogglePin: () => {},
                                handleToggleComplete: () => {},

                                isDisplayOptionPin: true,
                                isDisplayViewPodLink: false,
                                isDisplayUserBubblesComplete: false,
                                userListButtonBubblesTop3TaskComplete: null,
                            };
                        }),
                        isLoading: false,
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
                        isLoading: false,
                        responseError,
                    };
                });
            });
    };

    const handleGetResourceStampsAssociatedWithPod = (
        pathApi: string,
        queryParamsObject: Record<string, unknown>,
    ): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                setStampCardState((prevState: IStampCardState) => {
                    return {
                        ...prevState,
                        data: responseJson.content.map((datapoint: any) => {
                            const stampCardModel = new StampCardModel(datapoint);
                            return {
                                id: stampCardModel.getId(),
                                name: stampCardModel.getName(),
                                description: stampCardModel.getDescription(),
                                imageLink: stampCardModel.getImageLink(),
                            };
                        }),
                        isLoading: false,
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
                        isLoading: false,
                        responseError,
                    };
                });
            });
    };

    const handleUpdatePodPage = (responseJson: any): void => {
        const podPageModel = new PodPageModel(responseJson);
        setPodPageState((prevState: any) => {
            return {
                ...prevState,
                data: {
                    id: podPageModel.getId(),
                    name: podPageModel.getName(),
                    description: podPageModel.getDescription(),
                    imageLink: podPageModel.getImageLink(),
                },
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
        handleGetResourcePodPage(`api/pod/read/pods/${String(idPod)}/page`, {
            idUser: MOCK_MY_USER_ID,
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        handleGetResourceTasksAssociatedWithPod(`api/pod/read/pods/${String(idPod)}/tasks`, {
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
        handleGetResourceStampsAssociatedWithPod(`api/pod/read/pods/${String(idPod)}/stamps`, {
            idUser: MOCK_MY_USER_ID,
            filterNameOrDescription: stampCardState.filter.filterNameOrDescription,
            filterIsCollect: stampCardState.filter.filterIsCollect,
            filterIsNotCollect: stampCardState.filter.filterIsNotCollect,
        });
        // eslint-disable-next-line
    }, [stampCardState.filter]);

    const isErrorEditModeValuePodName =
        getInputText(podPageState.editMode.name.editModeValue).length < Constants.POD_NAME_MIN_LENGTH_CHARACTERS ||
        getInputText(podPageState.editMode.name.editModeValue).length > Constants.POD_NAME_MAX_LENGTH_CHARACTERS;
    const isErrorEditModeValuePodDescription =
        getInputText(podPageState.editMode.description.editModeValue).length >
        Constants.POD_DESCRIPTION_MAX_LENGTH_CHARACTERS;

    return (
        <Box sx={{ minHeight: '100vh', background: THEME.palette.gradient }}>
            <Box>
                <Grid container direction="row">
                    <Grid item sx={{ padding: '24px' }}>
                        <AvatarImageEditor
                            imageUploadHandler={(imageAsBase64String: string) => {
                                ResourceClient.postResource(
                                    'api/pod/update/pod',
                                    { idUser: MOCK_MY_USER_ID },
                                    {
                                        id: idPod,
                                        imageAsBase64String: getInputText(imageAsBase64String),
                                    },
                                )
                                    .then((responseJson: any) => {
                                        handleUpdatePodPage(responseJson);
                                    })
                                    .catch(() => {});
                            }}
                            imageLink={podPageState.data.imageLink}
                        />
                        <Box sx={{ paddingTop: '24px', paddingBottom: '12px' }}>
                            <Grid container direction="row" sx={{ marginBottom: '8px' }}>
                                <Grid item>
                                    <Box sx={{ padding: '8px 8px 8px 0px', width: '100px' }}>
                                        <Typography>Members:</Typography>
                                    </Box>
                                </Grid>
                                <Grid item sx={{ display: 'flex' }}>
                                    <UserListButton />
                                </Grid>
                            </Grid>
                            <Grid container direction="row" sx={{ marginBottom: '8px' }}>
                                <Grid item>
                                    <Box sx={{ padding: '8px 8px 8px 0px', width: '100px' }}>
                                        <Typography>Moderators:</Typography>
                                    </Box>
                                </Grid>
                                <Grid item sx={{ display: 'flex' }}>
                                    <UserListButton />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{ paddingBottom: '12px' }}>
                            <JoinPodButton isMember={true} />
                        </Box>
                        <Box sx={{ paddingBottom: '12px' }}>
                            <CreateStampModal idPod={idPod ?? ''} />
                        </Box>
                        <Box sx={{ paddingBottom: '12px' }}>
                            <CreateTaskModal idPod={idPod ?? ''} />
                        </Box>
                    </Grid>
                    <Grid item sx={{ width: '1000px', padding: '24px' }}>
                        <Grid container direction="column">
                            <Grid item sx={{ width: '100%' }}>
                                {podPageState.editMode.name.isEditMode ? (
                                    <TextField
                                        id="pod-edit-name"
                                        defaultValue={podPageState.data.name}
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
                                                ResourceClient.postResource(
                                                    'api/pod/update/pod',
                                                    {
                                                        idUser: MOCK_MY_USER_ID,
                                                    },
                                                    {
                                                        id: idPod,
                                                        name: getInputText(podPageState.editMode.name.editModeValue),
                                                    },
                                                )
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
                                                    ResourceClient.postResource(
                                                        'api/pod/update/pod',
                                                        {
                                                            idUser: MOCK_MY_USER_ID,
                                                        },
                                                        {
                                                            id: idPod,
                                                            name: getInputText(
                                                                podPageState.editMode.name.editModeValue,
                                                            ),
                                                        },
                                                    )
                                                        .then((responseJson: any) => {
                                                            handleUpdatePodPage(responseJson);
                                                        })
                                                        .catch(() => {});
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
                                                            isEditMode: true,
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ height: '60px', overflowY: 'auto' }}
                                    >
                                        {podPageState.data.name}
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
                                        defaultValue={podPageState.data.description}
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
                                                                      editModeValue: prevState.data.description,
                                                                  }
                                                                : {}),
                                                        },
                                                    },
                                                };
                                            });
                                            if (!isErrorEditModeValuePodDescription) {
                                                ResourceClient.postResource(
                                                    'api/pod/update/pod',
                                                    {
                                                        idUser: MOCK_MY_USER_ID,
                                                    },
                                                    {
                                                        id: idPod,
                                                        description: getInputText(
                                                            podPageState.editMode.description.editModeValue,
                                                        ),
                                                    },
                                                )
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
                                                                          editModeValue: prevState.data.description,
                                                                      }
                                                                    : {}),
                                                            },
                                                        },
                                                    };
                                                });
                                                if (!isErrorEditModeValuePodDescription) {
                                                    ResourceClient.postResource(
                                                        'api/pod/update/pod',
                                                        {
                                                            idUser: MOCK_MY_USER_ID,
                                                        },
                                                        {
                                                            id: idPod,
                                                            description: getInputText(
                                                                podPageState.editMode.description.editModeValue,
                                                            ),
                                                        },
                                                    )
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
                                                            isEditMode: true,
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {podPageState.data.description !== null ? podPageState.data.description : ' '}
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
                        <TaskCardList tasks={taskState.data} />
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
                            isLoading={stampCardState.isLoading}
                            handleChangePaginationPageNumber={() => {}}
                            paginationTotalPages={0}
                        />
                    </Box>
                </React.Fragment>
            ) : null}
            {tabIdxToDisplayMap[tabIdx] === 'progress' ? (
                <NumberOfPointsInTasksCompletedOverTimeVisualization
                    apiPath={`api/pod/read/pods/${String(idPod)}/numberOfPointsInTasksCompletedOverTimeVisualization`}
                />
            ) : null}
        </Box>
    );
};

export default PagePod;
