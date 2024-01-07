import TaskCard from 'src/javascripts/components/TaskCard';
import { Box, Grid, Typography } from '@mui/material';

import type { ITaskCardProps } from 'src/javascripts/components/TaskCard';

export interface ITaskCardListProps {
    tasks: ITaskCardProps[];
}

const TaskCardList: React.FC<ITaskCardListProps> = (props: ITaskCardListProps) => {
    const { tasks } = props;

    return tasks.length > 0 ? (
        <Box
            sx={{
                height: '800px',
                marginBottom: '48px',
                overflowY: 'auto',
            }}
        >
            <Grid container direction="column" sx={{ alignItems: 'center' }}>
                {tasks.map((task, idx) => (
                    <Grid item key={task.id} sx={{ justifyContent: 'center' }}>
                        <TaskCard
                            key={`${idx}_${task.id}`}
                            id={task.id}
                            name={task.name}
                            description={task.description}
                            numberOfPoints={task.numberOfPoints}
                            imageLink={task.imageLink}
                            isDisplayUserBubblesComplete={task.isDisplayUserBubblesComplete}
                            userListButtonBubblesTop3TaskComplete={task.userListButtonBubblesTop3TaskComplete}
                            isComplete={task.isComplete}
                            isStar={task.isStar}
                            isDisplayOptionPin={task.isDisplayOptionPin}
                            isPin={task.isPin}
                            isDisplayViewPodLink={task.isDisplayViewPodLink}
                            idPod={task.idPod}
                            noteText={task.noteText}
                            noteImage={task.noteImage}
                            datetimeCreate={task.datetimeCreate}
                            datetimeUpdate={task.datetimeUpdate}
                            datetimeTarget={task.datetimeTarget}
                            datetimeComplete={task.datetimeComplete}
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
