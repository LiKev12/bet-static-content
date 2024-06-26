import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import CreateTaskModalButton from 'src/javascripts/components/CreateTaskModalButton';
import NumberOfPointsInTasksCompletedOverTimeVisualization from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualization';
import FilterTasks from 'src/javascripts/components/FilterTasks';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import TaskModel from 'src/javascripts/models/TaskModel';
import PersonalPageModel from 'src/javascripts/models/PersonalPageModel';
import Constants from 'src/javascripts/Constants';
// import PlaceholderImageUser from 'src/assets/PlaceholderImageUser.png';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';
import { sliceVisualizationActions } from 'src/javascripts/store/SliceVisualization';
import { slicePagePersonalActions } from 'src/javascripts/store/SlicePagePersonal';
import { sliceHeaderActiveTabActions } from 'src/javascripts/store/SliceHeaderActiveTab';

import type { IRootState } from 'src/javascripts/store';
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
}
const PagePersonal: React.FC = () => {
    const dispatch = useDispatch();
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    const slicePagePersonalState = useSelector((state: IRootState) => state.pagePersonal);
    const slicePagePersonalStateData = new PersonalPageModel(slicePagePersonalState.data);
    const [taskState, setTaskState] = useState<ITaskState>({
        data: [],
        filter: {
            filterByName: '',
            filterIsComplete: true,
            filterIsNotComplete: true,
            filterIsStar: true,
            filterIsNotStar: true,
            filterIsPin: true,
            filterIsNotPin: true,
        },
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    });

    const handleChangefilterByName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setTaskState((prevState: ITaskState) => {
            return { ...prevState, filter: { ...prevState.filter, filterByName: event.target.value } };
        });
    };
    const debouncedHandleChangefilterByName = _.debounce(handleChangefilterByName, 500);

    const handleGetTasksPersonal = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            setTaskState((prevState: ITaskState) => {
                return {
                    ...prevState,
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_LOADING,
                        errorMessage: null,
                    },
                };
            });
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
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_SUCCESS,
                        errorMessage: null,
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
            dispatch(sliceVisualizationActions.setStateResponseLoading());
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

    const setPersonalPageStateData = async (): Promise<any> => {
        try {
            dispatch(slicePagePersonalActions.setStateResponseLoading());
            const response = await ResourceClient.postResource(
                'api/app/GetPersonalPage',
                {},
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(slicePagePersonalActions.setStateData(response.data));
        } catch (e: any) {
            dispatch(slicePagePersonalActions.setStateResponseError(e?.response?.data?.message));
        }
    };

    useEffect(() => {
        void handleGetTasksPersonal({
            filterByName: taskState.filter.filterByName,
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
                    <Grid
                        container
                        direction="column"
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            paddingLeft: '48px',
                        }}
                    >
                        <Grid
                            item
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    marginBottom: '16px',
                                    width: '680px',
                                }}
                            >
                                <CreateTaskModalButton
                                    idPod={null}
                                    handleUpdate={() => {
                                        void setPersonalPageStateData();
                                        void handleGetTasksPersonal({
                                            filterByName: taskState.filter.filterByName,
                                            filterIsComplete: taskState.filter.filterIsComplete,
                                            filterIsNotComplete: taskState.filter.filterIsNotComplete,
                                            filterIsStar: taskState.filter.filterIsStar,
                                            filterIsNotStar: taskState.filter.filterIsNotStar,
                                            filterIsPin: taskState.filter.filterIsPin,
                                            filterIsNotPin: taskState.filter.filterIsNotPin,
                                        });
                                    }}
                                    isDisabled={slicePagePersonalStateData.getIsReachedNumberOfTasksLimit()}
                                    disabledTooltipMessage={`You may only have up to ${String(
                                        Constants.LIMIT_NUMBER_OF_INCOMPLETE_TASKS_PERSONAL,
                                    )} incomplete Tasks. Please complete your Tasks before creating any more.`}
                                />
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box
                                sx={{
                                    paddingBottom: '24px',
                                    paddingTop: '0px',
                                    display: 'flex',
                                    justifyContent: 'center',
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
                        </Grid>
                        <Grid item>
                            {taskState.response.state === Constants.RESPONSE_STATE_SUCCESS ? (
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
                                        void setVisualizationStateData();
                                    }}
                                    handleSideEffectDeleteTask={() => {
                                        void handleGetTasksPersonal({
                                            filterByName: taskState.filter.filterByName,
                                            filterIsComplete: taskState.filter.filterIsComplete,
                                            filterIsNotComplete: taskState.filter.filterIsNotComplete,
                                            filterIsStar: taskState.filter.filterIsStar,
                                            filterIsNotStar: taskState.filter.filterIsNotStar,
                                            filterIsPin: taskState.filter.filterIsPin,
                                            filterIsNotPin: taskState.filter.filterIsNotPin,
                                        });
                                        void setPersonalPageStateData();
                                        void setVisualizationStateData();
                                    }}
                                />
                            ) : taskState.response.state === Constants.RESPONSE_STATE_LOADING ? (
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
                            ) : taskState.response.state === Constants.RESPONSE_STATE_ERROR ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Box>
                                        <Grid
                                            container
                                            direction="column"
                                            sx={{ display: 'flex', alignItems: 'center' }}
                                        >
                                            <Grid item sx={{ marginTop: '24px', marginBottom: '24px' }}>
                                                <Typography variant="h5">
                                                    An error occurred during fetching Tasks. Please try again.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            ) : null}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <Grid container direction="column">
                        {/* <Grid item>
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
                                                            width: '100px',
                                                            height: '100px',
                                                            cursor: 'pointer',
                                                            border: '2px solid',
                                                            borderColor: THEME.palette.other.formBorderColor,
                                                        }}
                                                        alt="user-image"
                                                        src={
                                                            pagePersonalState.data.getImageLink() ??
                                                            PlaceholderImageUser
                                                        }
                                                    />
                                                </Grid>
                                                <Grid
                                                    item
                                                    sx={{ display: 'flex', alignItems: 'center', margin: 'auto' }}
                                                >
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
                                                                variant="h5"
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
                                                            <Typography variant="h6">{`Today's Total: ${pagePersonalState.data.getNumberOfPointsTaskCompleteToday()}`}</Typography>
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
                        </Grid> */}
                        <Grid item>
                            <NumberOfPointsInTasksCompletedOverTimeVisualization />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PagePersonal;
