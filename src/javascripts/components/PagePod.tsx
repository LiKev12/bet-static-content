import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import FilterEntities from 'src/javascripts/components/FilterEntities';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import { MOCK_TASKS } from 'src/javascripts/mocks/MockTasks';
import { MOCK_PODS } from 'src/javascripts/mocks/MockPods';
import type { ITaskCardProps } from './TaskCard';

export interface IPagePodProps {
    id: string;
}

const getFilteredTasks = (
    tasks: ITaskCardProps[],
    text: string,
    isComplete: boolean,
    isIncomplete: boolean,
): ITaskCardProps[] => {
    const isMatchName = (task: ITaskCardProps, text: string): boolean => {
        if (text === '') return true;
        const isMatch = task.name.toLowerCase().includes(text.toLowerCase());
        return isMatch;
    };
    const isMatchDescription = (task: ITaskCardProps, text: string): boolean => {
        if (text === '') return true;
        const isMatch = task.description.toLowerCase().includes(text.toLowerCase());
        return isMatch;
    };
    const isMatchComplete = (task: ITaskCardProps, isComplete: boolean, isIncomplete: boolean): boolean => {
        console.log({
            isComplete,
            isIncomplete,
        });
        if (!isComplete && !isIncomplete) return false;
        return task.isComplete === isComplete || task.isComplete === !isIncomplete;
    };
    const filteredTasks = tasks.filter(
        (task) =>
            (isMatchName(task, text) || isMatchDescription(task, text)) &&
            isMatchComplete(task, isComplete, isIncomplete),
    );
    return filteredTasks;
};

// const DebounceInput = () => {
//     const [inputValue, setInputValue] = React.useState('');
//     const [debouncedInputValue, setDebouncedInputValue] = React.useState('');

//     const handleInputChange = (event) => {
//         setInputValue(event.target.value);
//     };

//     React.useEffect(() => {
//         const timeoutId = setTimeout(() => {
//             setDebouncedValue(inputValue);
//         }, 500);
//         return () => clearTimeout(timeoutId);
//     }, [inputValue, 500]);

//     return <input type="text" value={inputValue} onChange={handleInputChange} />;
// };

const PagePod: React.FC<IPagePodProps> = (props: IPagePodProps) => {
    const params = useParams();
    const [
        podData,
        // setPodData
    ] = useState(MOCK_PODS.filter((pod: any) => pod.id === params.id)[0]);
    const [filterText, setFilterText] = useState('');
    const [debouncedFilterText, setDebouncedFilterText] = useState('');
    const [isToggleFilterComplete, setToggleFilterComplete] = useState(true);
    const [isToggleFilterIncomplete, setToggleFilterIncomplete] = useState(true);

    // without lodash: https://dev.to/manishkc104/debounce-input-in-react-3726
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedFilterText(filterText);
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [filterText]);
    return (
        <Box sx={{ background: THEME.palette.gradient }}>
            <Box
                sx={{
                    border: '1px solid orange',
                    backgroundColor: THEME.palette.background.default,
                }}
            >
                <Grid container direction="column" sx={{ padding: '12px' }}>
                    <Grid item>
                        <Grid container direction="row">
                            <Grid item>
                                <Box
                                    sx={{
                                        width: '200px',
                                        height: '200px',
                                        borderRadius: '50%',
                                        backgroundColor: 'black',
                                    }}
                                ></Box>
                            </Grid>
                            <Grid item sx={{ paddingLeft: '20px', border: '1px solid blue' }}>
                                <Typography variant="h3">{podData.name}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sx={{ padding: '20px', border: '1px solid red' }}>
                        <Typography variant="body1">{podData.description}</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ padding: '24px', justifyContent: 'center', display: 'flex' }}>
                <FilterEntities
                    id="temp_id"
                    handleChangeText={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFilterText(event.target.value);
                    }}
                    handleToggleFilterComplete={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setToggleFilterComplete(event.target.checked);
                    }}
                    handleToggleFilterIncomplete={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setToggleFilterIncomplete(event.target.checked);
                    }}
                    isToggleFilterComplete={isToggleFilterComplete}
                    isToggleFilterIncomplete={isToggleFilterIncomplete}
                    entity={'tasks'}
                />
            </Box>
            <Box sx={{ padding: '24px', justifyContent: 'center' }}>
                <TaskCardList
                    tasks={getFilteredTasks(
                        MOCK_TASKS,
                        debouncedFilterText,
                        isToggleFilterComplete,
                        isToggleFilterIncomplete,
                    )}
                    handleToggleTaskComplete={() => {}}
                />
            </Box>
        </Box>
    );
};

export default PagePod;
