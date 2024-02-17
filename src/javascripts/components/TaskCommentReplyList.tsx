import React, { useState } from 'react';
import { Box, Divider, Grid, List, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import Constants from 'src/javascripts/Constants';
import PlaceholderImageUser from 'src/assets/PlaceholderImageUser.png';
import UserBubbleReactionListModalButton from 'src/javascripts/components/UserBubbleReactionListModalButton';
import ReactionSelector from 'src/javascripts/components/ReactionSelector';
import { getUserListButtonText } from 'src/javascripts/utilities';
import ReactionsModel from 'src/javascripts/models/ReactionsModel';

import ResourceClient from 'src/javascripts/clients/ResourceClient';
import { THEME } from 'src/javascripts/Theme';

import type TaskCommentReplyModel from 'src/javascripts/models/TaskCommentReplyModel';

export interface ITaskCommentReplyListProps {
    taskCommentReplies: TaskCommentReplyModel[];
}

export interface ITaskCommentReplyListState {
    data: TaskCommentReplyModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
}
export interface ITaskCommentRepliesReactionsState {
    data: any;
}

const getTaskCommentRepliesReactionsInitialState = (taskCommentReplies: TaskCommentReplyModel[]): any => {
    const initialState: any = {};
    taskCommentReplies.forEach((taskCommentReply: TaskCommentReplyModel) => {
        initialState[taskCommentReply.getIdTaskCommentReply()] = taskCommentReply.getReactions();
    });
    return initialState;
};

const TaskCommentReplyList: React.FC<ITaskCommentReplyListProps> = (props: ITaskCommentReplyListProps) => {
    const { taskCommentReplies } = props;
    const [taskCommentRepliesState] = useState<ITaskCommentReplyListState>({
        data: taskCommentReplies,
        response: {
            state: Constants.RESPONSE_STATE_SUCCESS,
            errorMessage: null,
        },
    });
    const [taskCommentRepliesReactionsState, setTaskCommentRepliesReactionsState] =
        useState<ITaskCommentRepliesReactionsState>({
            data: getTaskCommentRepliesReactionsInitialState(taskCommentReplies),
        });

    const handleGetTaskCommentReplyReactions = (
        requestBodyObject: Record<string, unknown>,
        idTaskCommentReply: string,
    ): void => {
        ResourceClient.postResource('api/app/GetTaskCommentReplyReactions', requestBodyObject)
            .then((responseJson: any) => {
                setTaskCommentRepliesReactionsState((prevState: ITaskCommentRepliesReactionsState) => {
                    return {
                        ...prevState,
                        data: { ...prevState.data, [idTaskCommentReply]: new ReactionsModel(responseJson) },
                    };
                });
            })
            .catch(() => {});
    };
    return (
        <List dense={false}>
            <Grid container direction="column">
                {taskCommentRepliesState.data.map((taskCommentReplyModel: TaskCommentReplyModel, idx: number) => {
                    return (
                        <React.Fragment key={`comment_reply_${idx}_${taskCommentReplyModel.getIdTaskCommentReply()}`}>
                            <Grid item key={`comment_reply_${idx}_${taskCommentReplyModel.getIdUser()}`}>
                                <Grid container direction="row">
                                    <Grid
                                        item
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    border: `2px solid ${String(THEME.palette.other.formBorderColor)}`,
                                                }}
                                                alt={taskCommentReplyModel.getUsername()}
                                                src={taskCommentReplyModel.getUserImageLink() ?? PlaceholderImageUser}
                                            />
                                        </ListItemAvatar>
                                    </Grid>
                                    <Grid item>
                                        <ListItemText
                                            primary={`@${String(taskCommentReplyModel.getUsername())}`}
                                            secondary={taskCommentReplyModel.getDatetimeDateAndTimeLabel()}
                                        />
                                    </Grid>
                                </Grid>
                                {taskCommentReplyModel.getIsText() ? (
                                    <Grid item>
                                        <ListItemText primary={taskCommentReplyModel.getCommentReplyText()} />
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
                                            alt="task-comment-reply-image"
                                            src={taskCommentReplyModel.getCommentReplyImageLink()}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                            <Divider variant="fullWidth" sx={{ marginTop: '12px', marginBottom: '12px' }} />
                            <Grid item>
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
                                                handleGetTaskCommentReplyReactions(
                                                    {
                                                        idTaskCommentReply:
                                                            taskCommentReplyModel.getIdTaskCommentReply(),
                                                        numberOfReactionsLimit: 3,
                                                    },
                                                    taskCommentReplyModel.getIdTaskCommentReply(),
                                                );
                                            }}
                                            myReaction={
                                                taskCommentReplyModel.getIdTaskCommentReply() in
                                                taskCommentRepliesReactionsState.data
                                                    ? taskCommentRepliesReactionsState.data[
                                                          taskCommentReplyModel.getIdTaskCommentReply()
                                                      ].getMyReactionType()
                                                    : null
                                            }
                                            apiPathSelectReaction={'api/app/UpdateTaskCommentReplyReaction'}
                                            apiSelectReactionSourceEntityIdValue={taskCommentReplyModel.getIdTaskCommentReply()}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Divider
                                            orientation="vertical"
                                            sx={{ marginLeft: '12px', width: '100%', marginRight: '12px' }}
                                            flexItem
                                        />
                                    </Grid>
                                    <Grid item>
                                        <UserBubbleReactionListModalButton
                                            labelText={getUserListButtonText(
                                                taskCommentRepliesReactionsState.data[
                                                    taskCommentReplyModel.getIdTaskCommentReply()
                                                ].getUserBubblesReactionTotalNumber(),
                                                'reaction',
                                                'reactions',
                                            )}
                                            userBubbles={taskCommentRepliesReactionsState.data[
                                                taskCommentReplyModel.getIdTaskCommentReply()
                                            ].getUserBubblesReaction()}
                                            sortByTimestampLabel="time of reaction"
                                            apiPath={'api/app/GetTaskCommentReplyReactions'}
                                            apiReactionSourceEntityIdValue={taskCommentReplyModel.getIdTaskCommentReply()}
                                            modalTitle="Reactions"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid
                                item
                                sx={{
                                    marginBottom: '12px',
                                }}
                            >
                                <Divider variant="fullWidth" />
                            </Grid>
                        </React.Fragment>
                    );
                })}
            </Grid>
        </List>
    );
};

export default TaskCommentReplyList;
