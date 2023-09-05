import { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import { MOCK_TASKS } from 'src/javascripts/mocks/MockTasks';
import MyStats from 'src/javascripts/components/MyStats';
// import PointsGrid from 'src/javascripts/components/PointsGrid';

const PageMe: React.FC = () => {
    const [tasks, setTasks] = useState(MOCK_TASKS);
    const mockTasks = MOCK_TASKS.slice();
    const handleToggleTaskComplete = (taskId: string): void => {
        const toggledTask = mockTasks.filter((t: any) => t.id === taskId)[0];
        if (toggledTask.isComplete === true) {
            toggledTask.isComplete = false;
        } else {
            toggledTask.isComplete = true;
        }
        setTasks(mockTasks);
    };
    return (
        <Box
            style={{
                height: '100vh',
                paddingLeft: '24px',
                paddingRight: '24px',
                background: THEME.palette.gradient,
            }}
        >
            <Grid container direction="row">
                <Grid item sx={{ marginRight: '24px' }}>
                    <TaskCardList tasks={tasks} handleToggleTaskComplete={handleToggleTaskComplete} />
                </Grid>
                <Grid item>
                    <MyStats id="temp_id" />
                </Grid>
            </Grid>
        </Box>
    );
};

export default PageMe;
