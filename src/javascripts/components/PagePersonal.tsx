import { useState, useEffect } from 'react';
import _ from 'lodash';
import { Box, Card, Grid, Typography } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import CreateTaskModalButton from 'src/javascripts/components/CreateTaskModalButton';
import { MOCK_MY_USER_ID } from 'src/javascripts/mocks/Mocks';
import NumberOfPointsInTasksCompletedOverTimeVisualization from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualization';
import FilterTasks from 'src/javascripts/components/FilterTasks';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import TaskModel from 'src/javascripts/models/TaskModel';
import { PAGE_SIZE_TASK } from 'src/javascripts/clients/ResourceClientConfig';
import PersonalPageModel from 'src/javascripts/models/PersonalPageModel';
import Constants from 'src/javascripts/Constants';
import PlaceholderImageUser from 'src/assets/PlaceholderImageUser.png';

export interface IPagePersonalState {
    data: PersonalPageModel;
    refreshVisualizationSwitchValue: boolean;
    response: {
        state: string;
        errorMessage: string | null;
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
const PagePersonal: React.FC = () => {
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

    const [pagePersonalState, setPagePersonalState] = useState<IPagePersonalState>({
        data: new PersonalPageModel(null),
        refreshVisualizationSwitchValue: true,
        response: {
            state: Constants.RESPONSE_STATE_LOADING,
            errorMessage: null,
        },
    });

    const handleChangeFilterNameOrDescription = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setTaskState((prevState: ITaskState) => {
            return { ...prevState, filter: { ...prevState.filter, filterNameOrDescription: event.target.value } };
        });
    };
    const debouncedHandleChangeFilterNameOrDescription = _.debounce(handleChangeFilterNameOrDescription, 500);

    const handleGetResourcePagePersonal = (pathApi: string, queryParamsObject: Record<string, unknown>): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                setPagePersonalState((prevState: IPagePersonalState) => {
                    return {
                        ...prevState,
                        data: new PersonalPageModel(responseJson),
                    };
                });
            })
            .catch((responseError: any) => {
                setPagePersonalState((prevState: IPagePersonalState) => {
                    return {
                        ...prevState,
                        response: {
                            ...prevState.response,
                            state: Constants.RESPONSE_STATE_ERROR,
                            errorMessage: Constants.RESPONSE_GET_ERROR_MESSAGE(responseError?.response?.data?.message),
                        },
                    };
                });
            });
    };

    const handleGetResourceTasksPersonal = (pathApi: string, queryParamsObject: Record<string, unknown>): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                setTaskState((prevState: ITaskState) => {
                    return {
                        ...prevState,
                        data: responseJson.content.map((datapoint: any) => {
                            return new TaskModel(datapoint);
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
                        response: {
                            ...prevState.response,
                            state: Constants.RESPONSE_STATE_ERROR,
                            errorMessage: Constants.RESPONSE_GET_ERROR_MESSAGE(responseError?.response?.data?.message),
                        },
                    };
                });
            });
    };

    useEffect(() => {
        handleGetResourceTasksPersonal('api/task/read/personal/tasks', {
            idUser: MOCK_MY_USER_ID,
            filterNameOrDescription: taskState.filter.filterNameOrDescription,
            filterIsComplete: taskState.filter.filterIsComplete,
            filterIsNotComplete: taskState.filter.filterIsNotComplete,
            filterIsStar: taskState.filter.filterIsStar,
            filterIsNotStar: taskState.filter.filterIsNotStar,
            filterIsPin: taskState.filter.filterIsPin,
            filterIsNotPin: taskState.filter.filterIsNotPin,
        });
    }, [taskState.filter]);

    useEffect(() => {
        handleGetResourcePagePersonal('api/user/read/personal/personalPage', {
            idUser: MOCK_MY_USER_ID,
        });
        // eslint-disable-next-line
    }, []);

    return (
        <Box
            style={{
                minHeight: '100vh',
                paddingLeft: '24px',
                paddingRight: '24px',
                background: THEME.palette.other.gradient,
            }}
        >
            <Grid container direction="row">
                <Grid item>
                    <Box sx={{ marginBottom: '24px', width: '100%' }}>
                        <Card
                            sx={{
                                fontFamily: 'Raleway',
                                color: THEME.palette.grey.A700,
                                padding: '12px',
                            }}
                        >
                            <Grid container direction="column">
                                <Grid item>
                                    <Grid container direction="row">
                                        <Grid item>
                                            <Box
                                                component="img"
                                                sx={{
                                                    borderRadius: '50%',
                                                    width: '180px',
                                                    height: '180px',
                                                    cursor: 'pointer',
                                                    border: '2px solid',
                                                    borderColor: THEME.palette.other.formBorderColor,
                                                }}
                                                alt="user-image"
                                                src={pagePersonalState.data.getImageLink() ?? PlaceholderImageUser}
                                            />
                                        </Grid>
                                        <Grid item sx={{ display: 'flex', alignItems: 'center', margin: 'auto' }}>
                                            <Grid container direction="column">
                                                <Grid
                                                    item
                                                    sx={{
                                                        paddingBottom: '12px',
                                                        width: '500px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h3"
                                                        sx={{
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >{`@${pagePersonalState.data.getUsername()}`}</Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h5">{`Today's Total: ${pagePersonalState.data.getNumberOfPointsTaskCompleteToday()}`}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    sx={
                                        // ad-hoc consideration for spacing concerns (center short names but not longer names, allow all names to be fully shown)
                                        pagePersonalState.data.getName().length > 13
                                            ? {
                                                  width: '400px',
                                              }
                                            : {
                                                  display: 'flex',
                                                  justifyContent: 'center',
                                                  width: '180px',
                                              }
                                    }
                                >
                                    <Typography
                                        fontFamily="monospace"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                        variant="h6"
                                    >
                                        {`${pagePersonalState.data.getName()}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Card>
                    </Box>
                    <Box sx={{ marginBottom: '16px' }}>
                        <CreateTaskModalButton
                            idPod={null}
                            handleUpdate={() => {
                                handleGetResourceTasksPersonal('api/task/read/personal/tasks', {
                                    idUser: MOCK_MY_USER_ID,
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
                    <TaskCardList
                        tasks={taskState.data}
                        isAuthorizedToComplete={true}
                        isReadOnlyTaskBody={false}
                        isReadOnlyTaskNotes={false}
                        isDisplayViewPodLink={false}
                        isDisplayOptionsStarPinDelete={true}
                        isAuthorizedToDelete={true}
                        handleUpdateUponToggleTaskComplete={() => {
                            handleGetResourcePagePersonal('api/user/read/personal/personalPage', {
                                idUser: MOCK_MY_USER_ID,
                            });
                            setPagePersonalState((prevState: IPagePersonalState) => {
                                return {
                                    ...prevState,
                                    refreshVisualizationSwitchValue: !prevState.refreshVisualizationSwitchValue,
                                };
                            });
                        }}
                    />
                </Grid>
                <Grid item sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <NumberOfPointsInTasksCompletedOverTimeVisualization
                        apiPath={'api/task/read/personal/numberOfPointsInTasksCompletedOverTimeVisualization'}
                        refreshSwitchValue={pagePersonalState.refreshVisualizationSwitchValue}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default PagePersonal;
