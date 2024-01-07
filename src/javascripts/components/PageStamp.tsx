import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { Box, Divider, Grid, Typography, Tab, Tabs, TextField } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import FilterTasks from 'src/javascripts/components/FilterTasks';
import FilterPods from 'src/javascripts/components/FilterPods';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import PodCardList from 'src/javascripts/components/PodCardList';
import AvatarImageEditor from 'src/javascripts/components/AvatarImageEditor';
import { MOCK_MY_USER_ID } from 'src/javascripts/mocks/Mocks';
import UserListButton from 'src/javascripts/components/UserListButton';
import CollectStampButton from 'src/javascripts/components/CollectStampButton';
import { getInputText } from 'src/javascripts/utilities';
import NumberOfPointsInTasksCompletedOverTimeVisualization from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualization';
import { PAGE_SIZE_POD, PAGE_SIZE_TASK } from 'src/javascripts/clients/ResourceClientConfig';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import TaskModel from 'src/javascripts/models/TaskModel';
import PodCardModel from 'src/javascripts/models/PodCardModel';
import StampPageModel from 'src/javascripts/models/PodPageModel';
import Constants from 'src/javascripts/Constants';

const tabIdxToDisplayMap: any = {
    0: 'task',
    1: 'pod',
    2: 'progress',
};
export interface IStampPageState {
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
export interface IPodCardState {
    data: any;
    isLoading: boolean;
    responseError: any;
    filter: {
        filterNameOrDescription: string;
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
        data: {
            name: '',
            description: '',
            imageLink: '',
        },
        isLoading: true,
        responseError: null,
    });

    const [tabIdx, setTabIdx] = useState(0);
    // tasks
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

    // filter pods
    const [podCardState, setPodCardState] = useState<IPodCardState>({
        data: [],
        isLoading: true,
        responseError: null,
        filter: {
            filterNameOrDescription: '',
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
                        data: {
                            id: stampPageModel.getId(),
                            name: stampPageModel.getName(),
                            description: stampPageModel.getDescription(),
                            imageLink: stampPageModel.getImageLink(),
                        },
                        isLoading: false,
                    };
                });
            })
            .catch((responseError: any) => {
                setStampPageState((prevState: IStampPageState) => {
                    return {
                        ...prevState,
                        isLoading: false,
                        responseError,
                    };
                });
            });
    };
    const handleGetResouorceTasksAssociatedWithStamp = (
        pathApi: string,
        queryParamsObject: Record<string, unknown>,
    ): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                setTaskState((prevState) => {
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
                setTaskState((prevState) => {
                    return {
                        ...prevState,
                        isLoading: false,
                        responseError,
                    };
                });
            });
    };

    const handleGetResouorcePodsAssociatedWithStamp = (
        pathApi: string,
        queryParamsObject: Record<string, unknown>,
    ): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                setPodCardState((prevState) => {
                    return {
                        ...prevState,
                        data: responseJson.content.map((datapoint: any) => {
                            const podCardModel = new PodCardModel(datapoint);
                            return {
                                id: podCardModel.getId(),
                                name: podCardModel.getName(),
                                description: podCardModel.getDescription(),
                                imageLink: podCardModel.getImageLink(),
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
                setPodCardState((prevState) => {
                    return {
                        ...prevState,
                        isLoading: false,
                        responseError,
                    };
                });
            });
    };
    const handleUpdateStampPage = (responseJson: any): void => {
        const stampPageModel = new StampPageModel(responseJson);
        setStampPageState((prevState: any) => {
            return {
                ...prevState,
                data: {
                    id: stampPageModel.getId(),
                    name: stampPageModel.getName(),
                    description: stampPageModel.getDescription(),
                    imageLink: stampPageModel.getImageLink(),
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
        handleGetResouorceTasksAssociatedWithStamp(`api/stamp/read/stamps/${String(idStamp)}/tasks`, {
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
    }, [taskState.filter]);
    useEffect(() => {
        handleGetResouorcePodsAssociatedWithStamp(`api/stamp/read/stamps/${String(idStamp)}/pods`, {
            idUser: MOCK_MY_USER_ID,
            filterNameOrDescription: podCardState.filter.filterNameOrDescription,
            filterIsMember: podCardState.filter.filterIsMember,
            filterIsNotMember: podCardState.filter.filterIsNotMember,
            filterIsModerator: podCardState.filter.filterIsModerator,
            filterIsNotModerator: podCardState.filter.filterIsNotModerator,
            page: podCardState.pagination.pageNumber,
            size: podCardState.pagination.pageSize,
        });
        // eslint-disable-next-line
    }, [podCardState.filter]);

    const isErrorEditModeValueStampName =
        getInputText(stampPageState.editMode.name.editModeValue).length < Constants.STAMP_NAME_MIN_LENGTH_CHARACTERS ||
        getInputText(stampPageState.editMode.name.editModeValue).length > Constants.STAMP_NAME_MAX_LENGTH_CHARACTERS;
    const isErrorEditModeValueStampDescription =
        getInputText(stampPageState.editMode.description.editModeValue).length >
        Constants.STAMP_DESCRIPTION_MAX_LENGTH_CHARACTERS;
    return (
        <Box sx={{ background: THEME.palette.gradient, minHeight: '100vh' }}>
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
                            imageLink={stampPageState.data.imageLink}
                        />
                        <Box sx={{ paddingTop: '24px', paddingBottom: '12px' }}>
                            <Grid container direction="row" sx={{ marginBottom: '8px' }}>
                                <Grid item>
                                    <Box sx={{ padding: '8px 8px 8px 0px', width: '100px' }}>
                                        <Typography>Users Collected:</Typography>
                                    </Box>
                                </Grid>
                                <Grid item sx={{ display: 'flex' }}>
                                    <UserListButton />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{ paddingBottom: '12px' }}>
                            <CollectStampButton numTasksCompleted={6} numTasksTotal={6} isCollected={false} />
                        </Box>
                    </Grid>
                    <Grid item sx={{ width: '1000px', padding: '24px' }}>
                        <Grid container direction="column">
                            <Grid item sx={{ width: '100%' }}>
                                {stampPageState.editMode.name.isEditMode ? (
                                    <TextField
                                        id="pod-edit-name"
                                        defaultValue={stampPageState.data.name}
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
                                                    .catch(() => {});
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
                                                        .catch(() => {});
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
                                                            isEditMode: true,
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ height: '60px', overflowY: 'auto' }}
                                    >
                                        {stampPageState.data.name}
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
                                        defaultValue={stampPageState.data.description}
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
                                                                      editModeValue: prevState.data.description,
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
                                                        description: getInputText(
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
                                                                          editModeValue: prevState.data.description,
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
                                                            description: getInputText(
                                                                stampPageState.editMode.description.editModeValue,
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
                                                            isEditMode: true,
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        sx={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {stampPageState.data.description !== null
                                            ? stampPageState.data.description
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
                        <TaskCardList tasks={taskState.data} />
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
                            isPodMember={podCardState.filter.filterIsMember}
                            isPodNotMember={podCardState.filter.filterIsNotMember}
                            isPodModerator={podCardState.filter.filterIsModerator}
                            isPodNotModerator={podCardState.filter.filterIsNotModerator}
                            isUseKeyPodMember={true}
                            isUseKeyPodModerator={true}
                        />
                    </Box>
                    <Box sx={{ padding: '24px 96px 96px 96px', justifyContent: 'center', display: 'flex' }}>
                        <PodCardList
                            podCards={podCardState.data}
                            isShowCreatePodModal={false}
                            isLoading={podCardState.isLoading}
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
                />
            ) : null}
        </Box>
    );
};

export default PageStamp;
