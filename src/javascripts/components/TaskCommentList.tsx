import React, { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
    Box,
    Button,
    Divider,
    Grid,
    List,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Avatar,
    TextField,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UserBubbleReactionListModalButton from 'src/javascripts/components/UserBubbleReactionListModalButton';
import ReactionSelector from 'src/javascripts/components/ReactionSelector';
import TaskCommentReplyList from 'src/javascripts/components/TaskCommentReplyList';
import { getUserListButtonText, getInputText } from 'src/javascripts/utilities';
import Constants from 'src/javascripts/Constants';
import { MOCK_MY_USER_ID } from 'src/javascripts/mocks/Mocks';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImageIcon from '@mui/icons-material/Image';
import TaskCommentModel from 'src/javascripts/models/TaskCommentModel';
import ReactionsModel from 'src/javascripts/models/ReactionsModel';
import TaskCommentReplyModel from 'src/javascripts/models/TaskCommentReplyModel';
import PlaceholderImageUser from 'src/assets/PlaceholderImageUser.png';
import { THEME } from 'src/javascripts/Theme';

export interface ITaskCommentListProps {
    taskComments: TaskCommentModel[];
    idTask: string;
}

export interface ITaskCommentListState {
    isShowTaskCommentRepliesSet: Set<string>;
    commentTextOrCommentTextReplyValue: string;
    selectedCommentId: string | null; // if null, then it means the comment is meant for the task, otherwise it is meant to reply to a comment thread
}

export interface ITaskCommentsState {
    data: TaskCommentModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
}

export interface ITaskCommentsReactionsState {
    data: any;
}

export interface ITaskCommentsNumberOfRepliesState {
    data: any;
}

export interface ITaskCommentRepliesState {
    data: TaskCommentReplyModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const getTaskCommentsReactionsInitialState = (taskComments: TaskCommentModel[]): any => {
    const initialState: any = {};
    taskComments.forEach((taskComment: TaskCommentModel) => {
        initialState[taskComment.getIdTaskComment()] = taskComment.getReactions();
    });
    return initialState;
};

const getTaskCommentsNumberOfRepliesState = (taskComments: TaskCommentModel[]): any => {
    const state: any = {};
    taskComments.forEach((taskComment: TaskCommentModel) => {
        state[taskComment.getIdTaskComment()] = taskComment.getNumberOfReplies();
    });
    return state;
};

const TaskCommentList: React.FC<ITaskCommentListProps> = (props: ITaskCommentListProps) => {
    const { taskComments, idTask } = props;
    const [taskCommentListState, setTaskCommentListState] = useState<ITaskCommentListState>({
        isShowTaskCommentRepliesSet: new Set(),
        commentTextOrCommentTextReplyValue: '',
        selectedCommentId: null,
    });
    const [taskCommentsState, setTaskCommentsState] = useState<ITaskCommentsState>({
        data: taskComments,
        response: {
            state: Constants.RESPONSE_STATE_SUCCESS,
            errorMessage: null,
        },
    });
    const [taskCommentsReactionsState, setTaskCommentsReactionsState] = useState<ITaskCommentsReactionsState>({
        data: getTaskCommentsReactionsInitialState(taskComments),
    });

    const [taskCommentsNumberOfRepliesState, setTaskCommentsNumberOfRepliesState] =
        useState<ITaskCommentsNumberOfRepliesState>({
            data: getTaskCommentsNumberOfRepliesState(taskComments),
        });
    const [taskCommentRepliesState, setTaskCommentRepliesState] = useState<ITaskCommentRepliesState>({
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_SUCCESS,
            errorMessage: null,
        },
    });
    const isErrorTaskCommentOrTaskCommentReply =
        getInputText(taskCommentListState.commentTextOrCommentTextReplyValue).length >
        Constants.TASK_COMMENT_TASK_REPLY_MAX_LENGTH_CHARACTERS;

    const handlePostResourceTaskCommentReplies = (
        pathApi: string,
        queryParamsObject: Record<string, unknown>,
        requestBodyObject: Record<string, unknown>,
        idTaskComment: string,
    ): void => {
        setTaskCommentRepliesState((prevState: ITaskCommentRepliesState) => {
            return {
                ...prevState,
                response: {
                    ...prevState.response,
                    state: Constants.RESPONSE_STATE_LOADING,
                    errorMessage: null,
                },
            };
        });
        ResourceClient.postResource(pathApi, queryParamsObject, requestBodyObject)
            .then((responseJson: any) => {
                setTaskCommentRepliesState((prevState: ITaskCommentRepliesState) => {
                    return {
                        ...prevState,
                        data: responseJson.map((datapoint: any) => new TaskCommentReplyModel(datapoint)),
                        response: {
                            ...prevState.response,
                            state: Constants.RESPONSE_STATE_SUCCESS,
                            errorMessage: null,
                        },
                    };
                });
                setTaskCommentListState((prevState: ITaskCommentListState) => {
                    const isShowTaskCommentRepliesSet = prevState.isShowTaskCommentRepliesSet;
                    isShowTaskCommentRepliesSet.add(idTaskComment);
                    return {
                        ...prevState,
                        isShowTaskCommentRepliesSet,
                    };
                });
            })
            .catch((responseError: any) => {
                setTaskCommentRepliesState((prevState: ITaskCommentRepliesState) => {
                    return {
                        ...prevState,
                        response: {
                            ...prevState.response,
                            state: Constants.RESPONSE_STATE_ERROR,
                            errorMessage: responseError,
                        },
                    };
                });
            });
    };

    const handlePostResourceTaskCommentReactions = (
        pathApi: string,
        queryParamsObject: Record<string, unknown>,
        requestBodyObject: Record<string, unknown>,
        idTaskComment: string,
    ): void => {
        ResourceClient.postResource(pathApi, queryParamsObject, requestBodyObject)
            .then((responseJson: any) => {
                setTaskCommentsReactionsState((prevState: ITaskCommentsReactionsState) => {
                    return {
                        ...prevState,
                        data: { ...prevState.data, [idTaskComment]: new ReactionsModel(responseJson) },
                    };
                });
            })
            .catch(() => {});
    };

    const handlePostResourceTaskComments = (
        pathApi: string,
        queryParamsObject: Record<string, unknown>,
        requestBodyObject: Record<string, unknown>,
    ): void => {
        ResourceClient.postResource(pathApi, queryParamsObject, requestBodyObject)
            .then((responseJson: any) => {
                setTaskCommentsState((prevState: ITaskCommentsState) => {
                    return {
                        ...prevState,
                        data: responseJson.map((datapoint: any) => new TaskCommentModel(datapoint)),
                        response: {
                            ...prevState.response,
                            state: Constants.RESPONSE_STATE_SUCCESS,
                            errorMessage: null,
                        },
                    };
                });
                setTaskCommentsNumberOfRepliesState({
                    data: getTaskCommentsNumberOfRepliesState(
                        responseJson.map((datapoint: any) => new TaskCommentModel(datapoint)),
                    ),
                });
            })
            .catch((responseError: any) => {
                setTaskCommentsState((prevState: ITaskCommentsState) => {
                    return {
                        ...prevState,
                        response: {
                            ...prevState.response,
                            state: Constants.RESPONSE_STATE_ERROR,
                            errorMessage: responseError,
                        },
                    };
                });
            });
    };
    return (
        <Box>
            <Grid container direction="column">
                {taskCommentsState.data.length > 0 ? (
                    <Grid item sx={{ marginBottom: '24px' }}>
                        <Box
                            sx={{
                                overflowY: 'auto',
                                height: '600px',
                                border: `1px solid`,
                                borderColor: THEME.palette.grey.A400,
                                borderRadius: '4px',
                            }}
                        >
                            <List dense={false}>
                                <Grid container direction="column">
                                    {taskCommentsState.data.map((taskCommentModel: TaskCommentModel, idx: number) => {
                                        return (
                                            <Grid item key={`comment_${idx}_${taskCommentModel.getIdTaskComment()}`}>
                                                <ListItemButton
                                                    selected={
                                                        taskCommentListState.selectedCommentId ===
                                                        taskCommentModel.getIdTaskComment()
                                                    }
                                                    onClick={() => {
                                                        setTaskCommentListState((prevState: ITaskCommentListState) => {
                                                            return {
                                                                ...prevState,
                                                                selectedCommentId:
                                                                    prevState.selectedCommentId ===
                                                                    taskCommentModel.getIdTaskComment()
                                                                        ? null
                                                                        : taskCommentModel.getIdTaskComment(),
                                                            };
                                                        });
                                                    }}
                                                >
                                                    <Grid container direction="column">
                                                        <Grid item>
                                                            <Grid container direction="row">
                                                                <Grid
                                                                    item
                                                                    sx={{ display: 'flex', alignItems: 'center' }}
                                                                >
                                                                    <ListItemAvatar>
                                                                        <Avatar
                                                                            sx={{
                                                                                border: `2px solid ${String(
                                                                                    THEME.palette.other.formBorderColor,
                                                                                )}`,
                                                                            }}
                                                                            alt={taskCommentModel.getUsername()}
                                                                            src={
                                                                                taskCommentModel.getUserImageLink() ??
                                                                                PlaceholderImageUser
                                                                            }
                                                                        />
                                                                    </ListItemAvatar>
                                                                </Grid>
                                                                <Grid item>
                                                                    <ListItemText
                                                                        primary={`@${String(
                                                                            taskCommentModel.getUsername(),
                                                                        )}`}
                                                                        secondary={taskCommentModel.getDatetimeDateAndTimeLabel()}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        {taskCommentModel.getIsText() ? (
                                                            <Grid item>
                                                                <ListItemText
                                                                    primary={taskCommentModel.getCommentText()}
                                                                />
                                                            </Grid>
                                                        ) : (
                                                            <Grid
                                                                item
                                                                sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <Box
                                                                    component="img"
                                                                    sx={{
                                                                        maxHeight: 512,
                                                                        maxWidth: 512,
                                                                    }}
                                                                    alt="task-comment-image"
                                                                    src={taskCommentModel.getCommentImageLink()}
                                                                />
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                </ListItemButton>
                                                <Divider
                                                    variant="fullWidth"
                                                    sx={{ marginTop: '12px', marginBottom: '12px' }}
                                                />
                                                <Grid
                                                    container
                                                    direction="row"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginBottom: '12px',
                                                    }}
                                                >
                                                    <Grid item>
                                                        <ReactionSelector
                                                            handleUpdateCallback={() => {
                                                                handlePostResourceTaskCommentReactions(
                                                                    'api/task/read/taskCommentReactions',
                                                                    {
                                                                        idUser: MOCK_MY_USER_ID,
                                                                    },
                                                                    {
                                                                        idTaskComment:
                                                                            taskCommentModel.getIdTaskComment(),
                                                                        numberOfReactionsLimit: 3,
                                                                    },
                                                                    taskCommentModel.getIdTaskComment(),
                                                                );
                                                            }}
                                                            myReaction={
                                                                taskCommentModel.getIdTaskComment() in
                                                                taskCommentsReactionsState.data
                                                                    ? taskCommentsReactionsState.data[
                                                                          taskCommentModel.getIdTaskComment()
                                                                      ].getMyReactionType()
                                                                    : null
                                                            }
                                                            apiPathSelectReaction={
                                                                'api/task/update/taskCommentReaction'
                                                            }
                                                            apiSelectReactionSourceEntityIdKey={'idTaskComment'}
                                                            apiSelectReactionSourceEntityIdValue={taskCommentModel.getIdTaskComment()}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Divider
                                                            orientation="vertical"
                                                            sx={{
                                                                marginLeft: '12px',
                                                                width: '100%',
                                                                marginRight: '12px',
                                                            }}
                                                            flexItem
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <UserBubbleReactionListModalButton
                                                            labelText={getUserListButtonText(
                                                                taskCommentModel.getIdTaskComment() in
                                                                    taskCommentsReactionsState.data
                                                                    ? taskCommentsReactionsState.data[
                                                                          taskCommentModel.getIdTaskComment()
                                                                      ].getUserBubblesReactionTotalNumber()
                                                                    : 0,
                                                                'reaction',
                                                                'reactions',
                                                            )}
                                                            userBubbles={
                                                                taskCommentModel.getIdTaskComment() in
                                                                taskCommentsReactionsState.data
                                                                    ? taskCommentsReactionsState.data[
                                                                          taskCommentModel.getIdTaskComment()
                                                                      ].getUserBubblesReaction()
                                                                    : []
                                                            }
                                                            sortByTimestampLabel="time of reaction"
                                                            apiPath={`api/task/read/taskCommentReactions`}
                                                            apiReactionSourceEntityIdKey={'idTaskComment'}
                                                            apiReactionSourceEntityIdValue={taskCommentModel.getIdTaskComment()}
                                                            modalTitle="Reactions"
                                                        />
                                                    </Grid>
                                                </Grid>
                                                {taskCommentsNumberOfRepliesState.data[
                                                    taskCommentModel.getIdTaskComment()
                                                ] > 0 ? (
                                                    <Accordion
                                                        onChange={(event: React.SyntheticEvent, expanded: boolean) => {
                                                            if (expanded) {
                                                                handlePostResourceTaskCommentReplies(
                                                                    'api/task/read/taskCommentReplies',
                                                                    {
                                                                        idUser: MOCK_MY_USER_ID,
                                                                    },
                                                                    {
                                                                        idTaskComment:
                                                                            taskCommentModel.getIdTaskComment(),
                                                                    },
                                                                    taskCommentModel.getIdTaskComment(),
                                                                );
                                                            } else {
                                                                setTaskCommentListState(
                                                                    (prevState: ITaskCommentListState) => {
                                                                        const isShowTaskCommentRepliesSet =
                                                                            prevState.isShowTaskCommentRepliesSet;
                                                                        isShowTaskCommentRepliesSet.delete(
                                                                            taskCommentModel.getIdTaskComment(),
                                                                        );
                                                                        return {
                                                                            ...prevState,
                                                                            isShowTaskCommentRepliesSet,
                                                                        };
                                                                    },
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="panel2-content"
                                                            id="panel2-header"
                                                        >
                                                            <Typography variant="button">{`Replies (${String(
                                                                taskCommentsNumberOfRepliesState.data[
                                                                    taskCommentModel.getIdTaskComment()
                                                                ],
                                                            )})`}</Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails
                                                            sx={{
                                                                backgroundColor:
                                                                    THEME.palette.other.commentSecondaryColor,
                                                            }}
                                                        >
                                                            {taskCommentListState.isShowTaskCommentRepliesSet.has(
                                                                taskCommentModel.getIdTaskComment(),
                                                            ) ? (
                                                                <TaskCommentReplyList
                                                                    taskCommentReplies={taskCommentRepliesState.data}
                                                                />
                                                            ) : null}
                                                        </AccordionDetails>
                                                    </Accordion>
                                                ) : null}
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </List>
                        </Box>
                    </Grid>
                ) : (
                    <Grid item sx={{ marginBottom: '24px' }}>
                        <Alert severity="info">
                            <Typography>{'No comments yet, start by posting one!'}</Typography>
                        </Alert>
                    </Grid>
                )}
                <Grid item sx={{ marginBottom: '24px' }}>
                    <TextField
                        id="task-comment-edit"
                        multiline
                        maxRows={4}
                        defaultValue={taskCommentListState.commentTextOrCommentTextReplyValue}
                        fullWidth
                        value={taskCommentListState.commentTextOrCommentTextReplyValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setTaskCommentListState((prevState: ITaskCommentListState) => {
                                return {
                                    ...prevState,
                                    commentTextOrCommentTextReplyValue: event.target.value,
                                };
                            });
                        }}
                        helperText={Constants.TASK_COMMENT_TEXT_HELPER_TEXT(
                            getInputText(taskCommentListState.commentTextOrCommentTextReplyValue).length,
                        )}
                        error={isErrorTaskCommentOrTaskCommentReply}
                    />
                </Grid>
                <Grid item>
                    {taskCommentListState.selectedCommentId === null ? (
                        <Grid container direction="row">
                            <Grid item sx={{ marginRight: 'auto' }}>
                                <Button
                                    onClick={() => {
                                        ResourceClient.postResource(
                                            'api/task/create/taskComment',
                                            { idUser: MOCK_MY_USER_ID },
                                            {
                                                idTask,
                                                commentText: taskCommentListState.commentTextOrCommentTextReplyValue,
                                            },
                                        )
                                            .then(() => {
                                                setTaskCommentListState((prevState: ITaskCommentListState) => {
                                                    return {
                                                        ...prevState,
                                                        commentTextOrCommentTextReplyValue: '',
                                                        isShowTaskCommentRepliesSet: new Set(),
                                                    };
                                                });
                                                handlePostResourceTaskComments(
                                                    'api/task/read/taskComments',
                                                    {
                                                        idUser: MOCK_MY_USER_ID,
                                                    },
                                                    {
                                                        idTask,
                                                    },
                                                );
                                            })
                                            .catch(() => {});
                                    }}
                                    disabled={
                                        isErrorTaskCommentOrTaskCommentReply ||
                                        getInputText(taskCommentListState.commentTextOrCommentTextReplyValue).length ===
                                            0
                                    }
                                    variant="contained"
                                >
                                    Post new comment
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button component="label" variant="contained" startIcon={<ImageIcon />}>
                                    New image comment
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e: any) => {
                                            const file = e.target.files[0];
                                            const fileReader = new FileReader();
                                            fileReader.onload = (function (file) {
                                                return function (e) {
                                                    if (this.result !== null && String(this.result).length > 0) {
                                                        ResourceClient.postResource(
                                                            'api/task/create/taskComment',
                                                            { idUser: MOCK_MY_USER_ID },
                                                            {
                                                                idTask,
                                                                commentImageAsBase64String: getInputText(
                                                                    String(this.result),
                                                                ),
                                                            },
                                                        )
                                                            .then((responseJson: any) => {
                                                                setTaskCommentListState(
                                                                    (prevState: ITaskCommentListState) => {
                                                                        return {
                                                                            ...prevState,
                                                                            commentTextOrCommentTextReplyValue: '',
                                                                            isShowTaskCommentRepliesSet: new Set(),
                                                                        };
                                                                    },
                                                                );
                                                                handlePostResourceTaskComments(
                                                                    'api/task/read/taskComments',
                                                                    {
                                                                        idUser: MOCK_MY_USER_ID,
                                                                    },
                                                                    {
                                                                        idTask,
                                                                    },
                                                                );
                                                            })
                                                            .catch(() => {});
                                                    }
                                                };
                                            })(file);
                                            fileReader.readAsDataURL(file);
                                        }}
                                    />
                                </Button>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container direction="row">
                            <Grid item sx={{ marginRight: 'auto' }}>
                                <Button
                                    onClick={() => {
                                        ResourceClient.postResource(
                                            'api/task/create/taskCommentReply',
                                            { idUser: MOCK_MY_USER_ID },
                                            {
                                                idTaskComment: taskCommentListState.selectedCommentId,
                                                commentReplyText:
                                                    taskCommentListState.commentTextOrCommentTextReplyValue,
                                            },
                                        )
                                            .then(() => {
                                                setTaskCommentListState((prevState: ITaskCommentListState) => {
                                                    return {
                                                        ...prevState,
                                                        commentTextOrCommentTextReplyValue: '',
                                                        isShowTaskCommentRepliesSet: new Set(),
                                                    };
                                                });
                                                handlePostResourceTaskComments(
                                                    'api/task/read/taskComments',
                                                    {
                                                        idUser: MOCK_MY_USER_ID,
                                                    },
                                                    {
                                                        idTask,
                                                    },
                                                );
                                            })
                                            .catch(() => {});
                                    }}
                                    disabled={isErrorTaskCommentOrTaskCommentReply}
                                    variant="contained"
                                >
                                    Reply to comment
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button component="label" variant="contained" startIcon={<ImageIcon />}>
                                    Reply with image
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e: any) => {
                                            const file = e.target.files[0];
                                            const fileReader = new FileReader();
                                            fileReader.onload = (function (file) {
                                                return function (e) {
                                                    if (this.result !== null && String(this.result).length > 0) {
                                                        ResourceClient.postResource(
                                                            'api/task/create/taskCommentReply',
                                                            { idUser: MOCK_MY_USER_ID },
                                                            {
                                                                idTaskComment: taskCommentListState.selectedCommentId,
                                                                commentReplyImageAsBase64String: getInputText(
                                                                    String(this.result),
                                                                ),
                                                            },
                                                        )
                                                            .then((responseJson: any) => {
                                                                setTaskCommentListState(
                                                                    (prevState: ITaskCommentListState) => {
                                                                        return {
                                                                            ...prevState,
                                                                            commentTextOrCommentTextReplyValue: '',
                                                                            isShowTaskCommentRepliesSet: new Set(),
                                                                        };
                                                                    },
                                                                );
                                                                handlePostResourceTaskComments(
                                                                    'api/task/read/taskComments',
                                                                    {
                                                                        idUser: MOCK_MY_USER_ID,
                                                                    },
                                                                    {
                                                                        idTask,
                                                                    },
                                                                );
                                                            })
                                                            .catch(() => {});
                                                    }
                                                };
                                            })(file);
                                            fileReader.readAsDataURL(file);
                                        }}
                                    />
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default TaskCommentList;
