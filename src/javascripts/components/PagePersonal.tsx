import { useState, useEffect } from 'react';
import _ from 'lodash';
import { Box, Card, Grid, Typography } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import CreateTaskModal from 'src/javascripts/components/CreateTaskModal';
import { MOCK_MY_USER_ID, MOCK_USERS } from 'src/javascripts/mocks/Mocks';
import NumberOfPointsInTasksCompletedOverTimeVisualization from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualization';
import FilterTasks from 'src/javascripts/components/FilterTasks';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import TaskModel from 'src/javascripts/models/TaskModel';
import { PAGE_SIZE_TASK } from 'src/javascripts/clients/ResourceClientConfig';

const MOCK_USERNAME = MOCK_USERS.filter((user: any) => user.id === MOCK_MY_USER_ID)[0].username;
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
const PagePersonal: React.FC = () => {
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

    const handleChangeFilterNameOrDescription = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setTaskState((prevState: ITaskState) => {
            return { ...prevState, filter: { ...prevState.filter, filterNameOrDescription: event.target.value } };
        });
    };
    const debouncedHandleChangeFilterNameOrDescription = _.debounce(handleChangeFilterNameOrDescription, 500);

    const handleGetResourceTasksPersonal = (pathApi: string, queryParamsObject: Record<string, unknown>): void => {
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
                                noteImageLink: taskModel.getNoteImage(),
                                isComplete: taskModel.getIsComplete(),
                                isStar: taskModel.getIsStar(),
                                isPin: taskModel.getIsPin(),
                                datetimeCreate: taskModel.getDatetimeCreate(),
                                datetimeUpdate: taskModel.getDatetimeUpdate(),
                                datetimeTarget: taskModel.getDatetimeTarget(),
                                datetimeComplete: taskModel.getDatetimeComplete(),
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

    return (
        <Box
            style={{
                minHeight: '100vh',
                paddingLeft: '24px',
                paddingRight: '24px',
                background: THEME.palette.gradient,
            }}
        >
            <Grid container direction="row">
                <Grid item>
                    <Box sx={{ marginBottom: '24px' }}>
                        <Grid container direction="row">
                            <Grid item>
                                <Card
                                    sx={{
                                        fontFamily: 'Raleway',
                                        color: THEME.palette.grey.A700,
                                        padding: '12px',
                                        width: '500px',
                                        marginRight: '12px',
                                    }}
                                >
                                    <Grid container direction="row">
                                        <Grid item>
                                            <Box
                                                component="img"
                                                sx={{
                                                    borderRadius: '50%',
                                                    width: '160px',
                                                    height: '160px',
                                                    cursor: 'pointer',
                                                    border: '2px solid',
                                                    borderColor: THEME.palette.grey.A400,
                                                }}
                                                alt="avatar-image"
                                                src={'https://www.signivis.com/img/custom/avatars/member-avatar-01.png'}
                                            />
                                        </Grid>
                                        <Grid item sx={{ display: 'flex', alignItems: 'center', margin: 'auto' }}>
                                            <Grid container direction="column">
                                                <Grid item sx={{ paddingBottom: '12px' }}>
                                                    <Typography variant="h4">{MOCK_USERNAME}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="h5">{"Today's Total: 46000000"}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid item sx={{ flexGrow: 1 }}>
                                {/* TODO fix this make it a square button, need height to be same as the card on the left... */}
                                <CreateTaskModal idPod={null} />
                            </Grid>
                        </Grid>
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
                    <TaskCardList tasks={taskState.data} />
                </Grid>
                <Grid item sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <NumberOfPointsInTasksCompletedOverTimeVisualization
                        apiPath={'api/task/read/personal/numberOfPointsInTasksCompletedOverTimeVisualization'}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default PagePersonal;
