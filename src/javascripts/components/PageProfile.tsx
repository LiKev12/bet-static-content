import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Divider, Grid, Typography, Tab, Tabs, TextField } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import AvatarImageEditor from 'src/javascripts/components/AvatarImageEditor';
import {
    MOCK_USERS,
    MOCK_TASKS,
    MOCK_PODS,
    MOCK_STAMPS,
    MOCK_JUNCTION_TABLE_TASK_USER_TASK_COMPLETED_BY_USER,
    MOCK_JUNCTION_TABLE_TASK_USER_TASK_STARRED_BY_USER,
    MOCK_JUNCTION_TABLE_TASK_USER_TASK_PINNED_BY_USER,
    MOCK_JUNCTION_TABLE_POD_USER_USER_IS_POD_MEMBER,
    MOCK_JUNCTION_TABLE_STAMP_USER_USER_COLLECTED_STAMP,
    MOCK_JUNCTION_TABLE_POD_USER_USER_IS_POD_MODERATOR,
} from 'src/javascripts/mocks/Mocks';
import PodCardList from 'src/javascripts/components/PodCardList';
import FilterTasks from 'src/javascripts/components/FilterTasks';
import FilterStamps from 'src/javascripts/components/FilterStamps';
import FilterPods from 'src/javascripts/components/FilterPods';
import FollowUserButton from 'src/javascripts/components/FollowUserButton';
import UserListButton from 'src/javascripts/components/UserListButton';
import TaskCardList from 'src/javascripts/components/TaskCardList';
import StampCardList from 'src/javascripts/components/StampCardList';
import { getFilteredPods, getFilteredTasks, getFilteredStamps } from 'src/javascripts/utilities';

const tabIdxToDisplayMap: any = {
    0: 'pod',
    1: 'stamp',
    2: 'task',
};

const getPinnedTasks = (
    userId: any,
    tasks: any,
    users: any,
    junctionTableTaskUserCompletedByUser: any,
    junctionTableTaskUserTaskStarredByUser: any,
    junctionTableTaskUserTaskPinnedByUser: any,
): any => {
    const pinnedTasksRaw: any = [];
    const taskIdToTaskMap = new Map();
    tasks.forEach((entry: any) => {
        taskIdToTaskMap.set(entry.id, entry);
    });
    junctionTableTaskUserTaskPinnedByUser.forEach((entry: any) => {
        if (entry.id__user === userId) {
            pinnedTasksRaw.push(taskIdToTaskMap.get(entry.id__task));
        }
    });
    const userIdToUserMap = new Map();
    users.forEach((entry: any) => {
        userIdToUserMap.set(entry.id, entry);
    });
    const pinnedTasks: any = [];
    pinnedTasksRaw.forEach((task: any) => {
        const usersCompleted: any = [];
        junctionTableTaskUserCompletedByUser.forEach((entry: any) => {
            if (entry.id__task === task.id) {
                usersCompleted.push({
                    ...userIdToUserMap.get(entry.id__user),
                    date_completed: entry.date_completed,
                });
            }
        });
        const usersStarred: any = [];
        junctionTableTaskUserTaskStarredByUser.forEach((entry: any) => {
            if (entry.id__task === task.id) {
                usersStarred.push(userIdToUserMap.get(entry.id__user));
            }
        });
        const usersPinned: any = [];
        junctionTableTaskUserTaskPinnedByUser.forEach((entry: any) => {
            if (entry.id__task === task.id) {
                usersPinned.push(userIdToUserMap.get(entry.id__user));
            }
        });
        pinnedTasks.push({
            id: task.id,
            name: task.name,
            description: task.description,
            numberOfPoints: task.numberOfPoints,
            image: task.image,
            isDisplayUserBubblesComplete: true,
            userListButtonBubblesTop3TaskComplete: usersCompleted
                .sort((user1: any, user2: any) => user1.date_completed - user2.date_completed)
                .slice(0, 3)
                .map((user: any) => ({ id: user.id, image: user.image_path })),
            isComplete: usersCompleted.filter((user: any) => user.id === userId).length > 0,
            isStar: usersStarred.filter((user: any) => user.id === userId).length > 0,
            isDisplayOptionPin: true,
            isPin: usersPinned.filter((user: any) => user.id === userId).length > 0,
            isDisplayViewPodLink: true,
            idPod: task.id__pod,
            datetimeCreate: task.date_created,
            datetimeUpdate: task.date_updated,
            datetimeTarget: task.date_targeted,
            datetimeComplete:
                usersCompleted.filter((user: any) => user.id === userId).length > 0
                    ? usersCompleted.filter((user: any) => user.id === userId)[0].date_completed
                    : null,
        });
    });
    return pinnedTasks;
};

const getPodsMemberOf = (
    userId: any,
    pods: any,
    junctionTablePodUserUserIsPodMember: any,
    junctionTablePodUserUserIsPodModerator: any,
): any => {
    const podIdToPodMap = new Map();
    pods.forEach((entry: any) => {
        podIdToPodMap.set(entry.id, { ...entry, isMember: false, isModerator: false });
    });
    junctionTablePodUserUserIsPodMember.forEach((entry: any) => {
        if (entry.id__user === userId) {
            podIdToPodMap.set(entry.id__pod, { ...podIdToPodMap.get(entry.id__pod), isMember: true });
        }
    });
    junctionTablePodUserUserIsPodModerator.forEach((entry: any) => {
        if (entry.id__user === userId) {
            podIdToPodMap.set(entry.id__pod, { ...podIdToPodMap.get(entry.id__pod), isModerator: true });
        }
    });

    return Array.from(podIdToPodMap.values()).filter((entry: any) => entry.isMember === true);
};

const getStampsCollected = (userId: any, stamps: any, junctionTableStampuserUserCollectedStamp: any): any => {
    const stampsCollected: any = [];
    const stampIdToStampMap = new Map();
    stamps.forEach((entry: any) => {
        stampIdToStampMap.set(entry.id, entry);
    });
    junctionTableStampuserUserCollectedStamp.forEach((entry: any) => {
        if (entry.id__user === userId) {
            stampsCollected.push(stampIdToStampMap.get(entry.id__stamp));
        }
    });
    return stampsCollected;
};

const PageProfile: React.FC = () => {
    const { id: userId } = useParams();
    const tasksInitial = getPinnedTasks(
        userId,
        MOCK_TASKS,
        MOCK_USERS,
        MOCK_JUNCTION_TABLE_TASK_USER_TASK_COMPLETED_BY_USER,
        MOCK_JUNCTION_TABLE_TASK_USER_TASK_STARRED_BY_USER,
        MOCK_JUNCTION_TABLE_TASK_USER_TASK_PINNED_BY_USER,
    );
    const [tasks] = useState(tasksInitial);
    const pods = getPodsMemberOf(
        userId,
        MOCK_PODS,
        MOCK_JUNCTION_TABLE_POD_USER_USER_IS_POD_MEMBER,
        MOCK_JUNCTION_TABLE_POD_USER_USER_IS_POD_MODERATOR,
    );
    const stamps = getStampsCollected(userId, MOCK_STAMPS, MOCK_JUNCTION_TABLE_STAMP_USER_USER_COLLECTED_STAMP);
    const [userData] = useState(MOCK_USERS.filter((user: any) => user.id === userId)[0]);
    const [tabIdx, setTabIdx] = useState(0);
    const [isEditModeName, setIsEditModeName] = useState(false);
    const [isEditModeBio, setIsEditModeBio] = useState(false);
    const [name, setName] = useState(userData.name);
    const [savedNameInBlankCase, setSavedNameInBlankCase] = useState(userData.name);
    const [bio, setBio] = useState(userData.bio);

    // filter tasks
    const [filterTaskText, setFilterTaskText] = useState('');
    const [debouncedFilterTaskText, setDebouncedFilterTaskText] = useState('');
    const [filterTaskState, setFilterTaskState] = useState({
        isComplete: true,
        isNotComplete: true,
        isStar: true,
        isNotStar: true,
        isPin: true,
        isNotPin: true,
        isUseFilterComplete: true,
        isUseFilterStar: false,
        isUseFilterPin: false,
    });
    // without lodash: https://dev.to/manishkc104/debounce-input-in-react-3726
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedFilterTaskText(filterTaskText);
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [filterTaskText]);

    // filter stamps
    const [filterStampText, setFilterStampText] = useState('');
    const [debouncedFilterStampText, setDebouncedFilterStampText] = useState('');
    const [filterStampState, setFilterStampState] = useState({
        isStampCollected: true,
        isStampNotCollected: true,
        isUseKeyStampCollected: true,
    });
    useEffect(() => {
        // without lodash: https://dev.to/manishkc104/debounce-input-in-react-3726
        const timeoutId = setTimeout(() => {
            setDebouncedFilterStampText(filterStampText);
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [filterStampText]);

    // filter pods
    const [filterPodText, setFilterPodText] = useState('');
    const [debouncedFilterPodText, setDebouncedFilterPodText] = useState('');
    const [filterPodState, setFilterPodState] = useState({
        isUseKeyPodMember: false,
        isPodMember: true,
        isPodNotMember: true,
        isUseKeyPodModerator: true,
        isPodModerator: true,
        isPodNotModerator: true,
    });
    useEffect(() => {
        // without lodash: https://dev.to/manishkc104/debounce-input-in-react-3726
        const timeoutId = setTimeout(() => {
            setDebouncedFilterPodText(filterPodText);
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [filterPodText]);
    return (
        <Box sx={{ minHeight: '100vh', background: THEME.palette.gradient }}>
            <Box>
                <Grid container direction="row">
                    <Grid item sx={{ padding: '24px' }}>
                        <AvatarImageEditor imageLink={null} imageUploadHandler={() => {}} />
                        <Box
                            sx={{
                                paddingTop: '24px',
                                paddingBottom: '12px',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="h5">{userData.username}</Typography>
                        </Box>
                        <Box sx={{ paddingTop: '24px', paddingBottom: '12px' }}>
                            <Grid container direction="row" sx={{ marginBottom: '8px' }}>
                                <Grid item>
                                    <Box sx={{ padding: '8px 8px 8px 0px', width: '100px' }}>
                                        <Typography>Following:</Typography>
                                    </Box>
                                </Grid>
                                <Grid item sx={{ display: 'flex' }}>
                                    <UserListButton />
                                </Grid>
                            </Grid>
                            <Grid container direction="row" sx={{ marginBottom: '8px' }}>
                                <Grid item>
                                    <Box sx={{ padding: '8px 8px 8px 0px', width: '100px' }}>
                                        <Typography>Followers:</Typography>
                                    </Box>
                                </Grid>
                                <Grid item sx={{ display: 'flex' }}>
                                    <UserListButton />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{ paddingBottom: '12px' }}>
                            <FollowUserButton isFollowing={true} />
                        </Box>
                    </Grid>
                    <Grid item sx={{ width: '1000px', padding: '24px' }}>
                        <Grid container direction="column">
                            <Grid item sx={{ paddingBottom: '12px', width: '100%' }}>
                                {isEditModeName ? (
                                    <TextField
                                        id="user-edit-name"
                                        defaultValue={name}
                                        fullWidth
                                        value={name}
                                        onBlur={() => {
                                            if (name === '') {
                                                setName(savedNameInBlankCase);
                                            }
                                            setIsEditModeName(false);
                                        }}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            if (event.target.value === '') {
                                                setSavedNameInBlankCase(name);
                                            }
                                            setName(event.target.value);
                                        }}
                                        onKeyDown={(event: React.KeyboardEvent) => {
                                            if (event.key === 'Enter' && !event.shiftKey) {
                                                if (name === '') {
                                                    setName(savedNameInBlankCase);
                                                }
                                                setIsEditModeName(false);
                                            }
                                        }}
                                    />
                                ) : (
                                    <Typography
                                        variant="h3"
                                        onClick={() => {
                                            setIsEditModeName(true);
                                            setIsEditModeBio(false);
                                        }}
                                        sx={{ height: '60px', overflowY: 'auto' }}
                                    >
                                        {name}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item sx={{ marginTop: '24px', marginBottom: '24px' }}>
                                <Divider variant="fullWidth" />
                            </Grid>
                            <Grid item sx={{ height: '400px', overflowY: 'auto', width: '100%' }}>
                                {isEditModeBio ? (
                                    <TextField
                                        id="user-edit-bio"
                                        multiline
                                        maxRows={12}
                                        defaultValue={bio}
                                        fullWidth
                                        value={bio}
                                        onBlur={() => {
                                            setIsEditModeBio(false);
                                        }}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setBio(event.target.value);
                                        }}
                                        onKeyDown={(event: React.KeyboardEvent) => {
                                            if (event.key === 'Enter' && !event.shiftKey) {
                                                setIsEditModeBio(false);
                                            }
                                        }}
                                        inputProps={{ style: { fontFamily: 'monospace' } }}
                                    />
                                ) : (
                                    <Typography
                                        variant="body1"
                                        fontFamily="monospace"
                                        onClick={() => {
                                            setIsEditModeName(false);
                                            setIsEditModeBio(true);
                                        }}
                                        sx={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {bio.length > 0 ? bio : ' '}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ marginBottom: '24px' }}>
                <Tabs
                    value={tabIdx}
                    onChange={(e, activeTabIdx: number) => {
                        setTabIdx(activeTabIdx);
                    }}
                    indicatorColor="primary"
                    centered
                >
                    <Tab sx={{ width: '150px' }} label="My Pods" />
                    <Tab sx={{ width: '150px' }} label="My Stamps" />
                    <Tab sx={{ width: '150px' }} label="My Pinned Tasks" />
                </Tabs>
            </Box>
            {tabIdxToDisplayMap[tabIdx] === 'pod' ? (
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
                        <FilterPods
                            handleChangeText={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setFilterPodText(event.target.value);
                            }}
                            handleUpdateFilterState={(
                                event: React.ChangeEvent<HTMLInputElement>,
                                filterPodStateUpdatedKey: string,
                            ) => {
                                setFilterPodState((prevState) => {
                                    return {
                                        ...prevState,
                                        ...{ [filterPodStateUpdatedKey]: event.target.checked },
                                    };
                                });
                            }}
                            isUseKeyPodMember={filterPodState.isUseKeyPodMember}
                            isPodMember={filterPodState.isPodMember}
                            isPodNotMember={filterPodState.isPodNotMember}
                            isUseKeyPodModerator={filterPodState.isUseKeyPodModerator}
                            isPodModerator={filterPodState.isPodModerator}
                            isPodNotModerator={filterPodState.isPodNotModerator}
                        />
                    </Box>
                    <Box sx={{ padding: '24px 96px 96px 96px', justifyContent: 'center', display: 'flex' }}>
                        <PodCardList
                            podCards={getFilteredPods(pods, debouncedFilterPodText, filterPodState)}
                            isShowCreatePodModal={false}
                            isLoading={false}
                            handleChangePaginationPageNumber={() => {}}
                            paginationTotalPages={0}
                        />
                    </Box>
                </React.Fragment>
            ) : null}
            {tabIdxToDisplayMap[tabIdx] === 'task' ? (
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
                            handleChangeText={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setFilterTaskText(event.target.value);
                            }}
                            handleUpdateFilterState={(
                                event: React.ChangeEvent<HTMLInputElement>,
                                filterTaskStateUpdatedKey: string,
                            ) => {
                                setFilterTaskState((prevState) => {
                                    return {
                                        ...prevState,
                                        ...{ [filterTaskStateUpdatedKey]: event.target.checked },
                                    };
                                });
                            }}
                            isComplete={filterTaskState.isComplete}
                            isNotComplete={filterTaskState.isNotComplete}
                            isStar={filterTaskState.isStar}
                            isNotStar={filterTaskState.isNotStar}
                            isPin={filterTaskState.isPin}
                            isNotPin={filterTaskState.isNotPin}
                            isUseFilterComplete={filterTaskState.isUseFilterComplete}
                            isUseFilterStar={filterTaskState.isUseFilterStar}
                            isUseFilterPin={filterTaskState.isUseFilterPin}
                        />
                    </Box>
                    <Box sx={{ padding: '24px 96px 96px 96px', justifyContent: 'center', display: 'flex' }}>
                        <TaskCardList tasks={getFilteredTasks(tasks, debouncedFilterTaskText, filterTaskState)} />
                    </Box>
                </React.Fragment>
            ) : null}
            {tabIdxToDisplayMap[tabIdx] === 'stamp' ? (
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
                        <FilterStamps
                            handleChangeText={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setFilterStampText(event.target.value);
                            }}
                            handleUpdateFilterState={(
                                event: React.ChangeEvent<HTMLInputElement>,
                                filterStampStateUpdatedKey: string,
                            ) => {
                                setFilterStampState((prevState) => {
                                    return {
                                        ...prevState,
                                        ...{ [filterStampStateUpdatedKey]: event.target.checked },
                                    };
                                });
                            }}
                            isStampCollected={filterStampState.isStampCollected}
                            isStampNotCollected={filterStampState.isStampNotCollected}
                            isUseKeyStampCollected={filterStampState.isUseKeyStampCollected}
                        />
                    </Box>
                    <Box sx={{ padding: '24px 96px 96px 96px', justifyContent: 'center', display: 'flex' }}>
                        <StampCardList
                            stampCards={getFilteredStamps(stamps, debouncedFilterStampText, filterStampState)}
                            isShowCreateStampModal={false}
                            isLoading={false}
                            handleChangePaginationPageNumber={() => {}}
                            paginationTotalPages={0}
                        />
                    </Box>
                </React.Fragment>
            ) : null}
        </Box>
    );
};

export default PageProfile;
