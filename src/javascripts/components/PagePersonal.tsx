import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { Box, Card, Grid, Typography } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import CreateTaskModalButton from 'src/javascripts/components/CreateTaskModalButton';

import NumberOfPointsInTasksCompletedOverTimeVisualization from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualization';
import FilterTasks from 'src/javascripts/components/FilterTasks';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import TaskModel from 'src/javascripts/models/TaskModel';
import { PAGE_SIZE_TASK } from 'src/javascripts/clients/ResourceClientConfig';
import PersonalPageModel from 'src/javascripts/models/PersonalPageModel';
import NumberOfPointsInTasksCompletedOverTimeVisualizationModel from 'src/javascripts/models/NumberOfPointsInTasksCompletedOverTimeVisualizationModel';
import Constants from 'src/javascripts/Constants';
import PlaceholderImageUser from 'src/assets/PlaceholderImageUser.png';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';
import ResponseModel from 'src/javascripts/models/ResponseModel';
import { sliceVisualizationActions } from 'src/javascripts/store/SliceVisualization';
import { sliceHeaderActiveTabActions } from 'src/javascripts/store/SliceHeaderActiveTab';

import type { IRootState } from 'src/javascripts/store';
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
    const dispatch = useDispatch();
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    const sliceVisualizationState = useSelector((state: IRootState) => state.visualization);
    const sliceVisualizationStateData = new NumberOfPointsInTasksCompletedOverTimeVisualizationModel(
        sliceVisualizationState.data,
    );
    const sliceVisualizationStateResponse = new ResponseModel(sliceVisualizationState.response);
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

    const setPersonalPageStateData = async (): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetPersonalPage',
                {},
                sliceAuthenticationStateData.getJwtToken(),
            );
            setPagePersonalState((prevState: IPagePersonalState) => {
                return {
                    ...prevState,
                    data: new PersonalPageModel(response.data),
                };
            });
        } catch (e: any) {
            setPagePersonalState((prevState: IPagePersonalState) => {
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

    const handleGetTasksPersonal = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetTasksPersonal',
                requestBodyObject,
                sliceAuthenticationStateData.getJwtToken(),
            );
            setTaskState((prevState: ITaskState) => {
                return {
                    ...prevState,
                    data: response.data.map((datapoint: any) => {
                        return new TaskModel(datapoint);
                    }),
                    isLoading: false,
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
                        errorMessage: Constants.RESPONSE_GET_ERROR_MESSAGE(e?.response?.data?.message),
                    },
                };
            });
        }
    };

    const setVisualizationStateData = async (): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetNumberOfPointsInTasksCompletedOverTimeVisualizationPersonal',
                {},
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(sliceVisualizationActions.setStateData(response.data));
        } catch (e: any) {
            dispatch(sliceVisualizationActions.setStateResponseError(e?.response?.data?.message));
        }
    };

    useEffect(() => {
        void handleGetTasksPersonal({
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
        void dispatch(sliceHeaderActiveTabActions.setStateData(Constants.HEADER_ACTIVE_TAB_IDX__PAGE_PERSONAL));
        void setPersonalPageStateData();
        void setVisualizationStateData();
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
                                void handleGetTasksPersonal({
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
                        handleSideEffectToggleTaskComplete={() => {
                            void setPersonalPageStateData();
                            void setVisualizationStateData();
                        }}
                        handleSideEffectChangeNumberOfPoints={() => {
                            void setPersonalPageStateData();
                            void setVisualizationStateData();
                        }}
                    />
                </Grid>
                <Grid item sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <NumberOfPointsInTasksCompletedOverTimeVisualization
                        data={sliceVisualizationStateData}
                        response={sliceVisualizationStateResponse}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default PagePersonal;
