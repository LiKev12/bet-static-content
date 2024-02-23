import TaskCard from 'src/javascripts/components/TaskCard';
import { Box, Grid, Typography } from '@mui/material';
import type TaskModel from 'src/javascripts/models/TaskModel';

export interface ITaskCardListProps {
    tasks: TaskModel[];
    isAuthorizedToComplete: boolean;
    isReadOnlyTaskBody: boolean;
    isReadOnlyTaskNotes: boolean;
    isDisplayViewPodLink: boolean;
    isDisplayOptionsStarPinDelete: boolean;
    isAuthorizedToDelete: boolean;
    handleSideEffectToggleTaskComplete: any;
    handleSideEffectChangeNumberOfPoints: any;
}

const TaskCardList: React.FC<ITaskCardListProps> = (props: ITaskCardListProps) => {
    const {
        tasks,
        isAuthorizedToComplete,
        isReadOnlyTaskBody,
        isReadOnlyTaskNotes,
        isDisplayViewPodLink,
        isDisplayOptionsStarPinDelete,
        isAuthorizedToDelete,
        handleSideEffectToggleTaskComplete,
        handleSideEffectChangeNumberOfPoints,
    } = props;

    console.log({ tasks });
    return tasks.length > 0 ? (
        <Box
            sx={{
                height: '800px',
                marginBottom: '48px',
                overflowY: 'auto',
            }}
        >
            <Grid container direction="column" sx={{ alignItems: 'center' }}>
                {tasks.map((task: TaskModel, idx: number) => (
                    <Grid item key={task.id} sx={{ justifyContent: 'center' }}>
                        <TaskCard
                            key={`${idx}_${String(task.getId())}`}
                            task={task}
                            isAuthorizedToComplete={isAuthorizedToComplete}
                            isReadOnlyTaskBody={isReadOnlyTaskBody}
                            isReadOnlyTaskNotes={isReadOnlyTaskNotes}
                            isDisplayViewPodLink={isDisplayViewPodLink}
                            isDisplayOptionsStarPinDelete={isDisplayOptionsStarPinDelete}
                            isAuthorizedToDelete={isAuthorizedToDelete}
                            handleSideEffectToggleTaskComplete={handleSideEffectToggleTaskComplete}
                            handleSideEffectChangeNumberOfPoints={handleSideEffectChangeNumberOfPoints}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box>
                <Grid container direction="column" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Grid item sx={{ marginTop: '24px', marginBottom: '24px' }}>
                        <Typography variant="h5">No Tasks found</Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default TaskCardList;
