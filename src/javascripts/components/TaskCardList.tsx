import type { ITaskCardProps } from 'src/javascripts/components/TaskCard';
import TaskCard from 'src/javascripts/components/TaskCard';
import { Box, Grid } from '@mui/material';

export interface ITaskCardListProps {
    tasks: ITaskCardProps[];
    handleToggleTaskComplete: any;
}

const TaskCardList: React.FC<ITaskCardListProps> = (props: ITaskCardListProps) => {
    const { tasks, handleToggleTaskComplete } = props;

    return (
        <Box sx={{ height: '800px', overflowY: 'auto' }}>
            <Grid container direction="column">
                {tasks.map((task, idx) => (
                    <Grid item key={task.id}>
                        <TaskCard
                            key={`${idx}_${task.id}`}
                            id={task.id}
                            name={task.name}
                            description={task.description}
                            numPoints={task.numPoints}
                            imagePath={task.imagePath}
                            isComplete={task.isComplete}
                            dateCreated={task.dateCreated}
                            dateUpdated={task.dateUpdated}
                            dateTargeted={task.dateTargeted}
                            dateCompleted={task.dateCompleted}
                            handleToggleTaskComplete={handleToggleTaskComplete}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TaskCardList;
