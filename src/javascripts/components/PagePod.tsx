import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, Tab, Tabs } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import FilterTasks from 'src/javascripts/components/FilterTasks';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import AvatarImageEditor from 'src/javascripts/components/AvatarImageEditor';
import { MOCK_TASKS } from 'src/javascripts/mocks/MockTasks';
import { MOCK_PODS } from 'src/javascripts/mocks/MockPods';
import { MOCK_USERS } from 'src/javascripts/mocks/MockUsers';
import UserBubbleListButton from 'src/javascripts/components/UserBubbleListButton';
import CreateStampModal from 'src/javascripts/components/CreateStampModal';
import type { ITaskCardProps } from './TaskCard';

export interface IPagePodProps {
    id: string;
}

const entityTabIdxToEntityMap: any = {
    0: 'tasks',
    1: 'stamps',
};

const getFilteredTasks = (
    tasks: ITaskCardProps[],
    text: string,
    isComplete: boolean,
    isIncomplete: boolean,
    isStarred: boolean,
    isNotStarred: boolean,
    isPinned: boolean,
    isNotPinned: boolean,
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
        if (!isComplete && !isIncomplete) return false;
        return task.isComplete === isComplete || task.isComplete === !isIncomplete;
    };
    const isMatchStarred = (task: ITaskCardProps, isStarred: boolean, isNotStarred: boolean): boolean => {
        if (!isStarred && !isNotStarred) return false;
        return task.isStarred === isStarred || task.isStarred === !isNotStarred;
    };
    const isMatchPinned = (task: ITaskCardProps, isPinned: boolean, isNotPinned: boolean): boolean => {
        if (!isPinned && !isNotPinned) return false;
        return task.isPinned === isPinned || task.isPinned === !isNotPinned;
    };
    const filteredTasks = tasks.filter(
        (task) =>
            (isMatchName(task, text) || isMatchDescription(task, text)) &&
            isMatchComplete(task, isComplete, isIncomplete) &&
            isMatchStarred(task, isStarred, isNotStarred) &&
            isMatchPinned(task, isPinned, isNotPinned),
    );
    return filteredTasks;
};

const PagePod: React.FC<IPagePodProps> = (props: IPagePodProps) => {
    const params = useParams();
    const mockTasks = MOCK_TASKS.filter((task: any) => task.associatedPodId === params.id);
    const [
        podData,
        // setPodData
    ] = useState(MOCK_PODS.filter((pod: any) => pod.id === params.id)[0]);
    const [entityTabOnDisplayIdx, setEntityTabOnDisplayIdx] = useState(0);
    const [filterText, setFilterText] = useState('');
    const [debouncedFilterText, setDebouncedFilterText] = useState('');
    const [isToggleFilterComplete, setToggleFilterComplete] = useState(true);
    const [isToggleFilterIncomplete, setToggleFilterIncomplete] = useState(true);
    const [isToggleFilterIsStarred, setToggleFilterIsStarred] = useState(true);
    const [isToggleFilterIsNotStarred, setToggleFilterIsNotStarred] = useState(true);
    const [isToggleFilterIsPinned, setToggleFilterIsPinned] = useState(true);
    const [isToggleFilterIsNotPinned, setToggleFilterIsNotPinned] = useState(true);
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
                    backgroundColor: THEME.palette.background.default,
                }}
            >
                <Grid container direction="row">
                    <Grid item sx={{ padding: '24px' }}>
                        <AvatarImageEditor id="temp_id" />
                        <Box sx={{ paddingTop: '24px', paddingBottom: '12px' }}>
                            <Grid container direction="row" sx={{ marginBottom: '8px' }}>
                                <Grid item>
                                    <Box sx={{ padding: '8px 8px 8px 0px', width: '100px' }}>
                                        <Typography>Members:</Typography>
                                    </Box>
                                </Grid>
                                <Grid item sx={{ display: 'flex' }}>
                                    <UserBubbleListButton userBubbles={MOCK_USERS} />
                                </Grid>
                            </Grid>
                            <Grid container direction="row" sx={{ marginBottom: '8px' }}>
                                <Grid item>
                                    <Box sx={{ padding: '8px 8px 8px 0px', width: '100px' }}>
                                        <Typography>Moderators:</Typography>
                                    </Box>
                                </Grid>
                                <Grid item sx={{ display: 'flex' }}>
                                    <UserBubbleListButton userBubbles={MOCK_USERS} />
                                </Grid>
                            </Grid>
                        </Box>

                        <CreateStampModal id="temp_id" />
                    </Grid>
                    <Grid item sx={{ width: '800px', padding: '24px' }}>
                        <Grid container direction="column">
                            <Grid item sx={{ paddingBottom: '12px' }}>
                                <Typography variant="h3">{podData.name}</Typography>
                            </Grid>
                            <Grid item>
                                <Box sx={{ height: '300px' }}>
                                    <Typography variant="body1">{podData.description}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ marginBottom: '24px' }}>
                <Tabs
                    value={entityTabOnDisplayIdx}
                    onChange={(e, activeTabIdx: number) => {
                        setEntityTabOnDisplayIdx(activeTabIdx);
                    }}
                    indicatorColor="primary"
                    centered
                >
                    <Tab sx={{ width: '150px' }} label="Tasks" />
                    <Tab sx={{ width: '150px' }} label="Stamps" />
                </Tabs>
            </Box>

            {entityTabIdxToEntityMap[entityTabOnDisplayIdx] === 'tasks' ? (
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
                            handleToggleFilterIsStarred={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setToggleFilterIsStarred(event.target.checked);
                            }}
                            handleToggleFilterIsNotStarred={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setToggleFilterIsNotStarred(event.target.checked);
                            }}
                            handleToggleFilterIsPinned={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setToggleFilterIsPinned(event.target.checked);
                            }}
                            handleToggleFilterIsNotPinned={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setToggleFilterIsNotPinned(event.target.checked);
                            }}
                            isToggleFilterComplete={isToggleFilterComplete}
                            isToggleFilterIncomplete={isToggleFilterIncomplete}
                            isToggleFilterIsStarred={isToggleFilterIsStarred}
                            isToggleFilterIsNotStarred={isToggleFilterIsNotStarred}
                            isToggleFilterIsPinned={isToggleFilterIsPinned}
                            isToggleFilterIsNotPinned={isToggleFilterIsNotPinned}
                        />
                    </Box>
                    <Box sx={{ padding: '24px', justifyContent: 'center', display: 'flex' }}>
                        <TaskCardList
                            tasks={getFilteredTasks(
                                mockTasks,
                                debouncedFilterText,
                                isToggleFilterComplete,
                                isToggleFilterIncomplete,
                                isToggleFilterIsStarred,
                                isToggleFilterIsNotStarred,
                                isToggleFilterIsPinned,
                                isToggleFilterIsNotPinned,
                            )}
                            handleToggleTaskComplete={() => {}}
                        />
                    </Box>
                </React.Fragment>
            ) : null}
        </Box>
    );
};

export default PagePod;
