import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    Tooltip,
    TextField,
    FormControl,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    InputLabel,
} from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import UserBubbleReactionModel from 'src/javascripts/models/UserBubbleReactionModel';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import PlaceholderImageUser from 'src/assets/PlaceholderImageUser.png';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import IconButtonFollowUser from 'src/javascripts/components/IconButtonFollowUser';
import Constants from 'src/javascripts/Constants';

export interface IUserBubbleReactionListModalProps {
    handleClose: any;
    sortByTimestampLabel: string;
    apiPath: string;
    apiReactionSourceEntityIdValue: string;
    modalTitle: string;
}

export interface IUserBubbleReactionListModalState {
    data: UserBubbleReactionModel[];
    isLoading: boolean;
    responseError: any;
    filterUserText: string;
    sortByOption: string;
    sortByOptionIsAscending: boolean;
}

const getFilteredUsersByUsernameOrName = (
    filterTextRaw: string,
    userBubbles: UserBubbleReactionModel[],
): UserBubbleReactionModel[] => {
    const filterText = filterTextRaw.trim().toLowerCase();
    return userBubbles.filter((userBubble: UserBubbleReactionModel) => {
        return (
            userBubble.getUsername().toLowerCase().includes(filterText) ||
            userBubble.getName().toLowerCase().includes(filterText)
        );
    });
};

const SORT_BY_OPTIONS = {
    FOLLOWING: 'following',
    ALPHABETICAL: 'alphabetical',
    TIMESTAMP: 'timestamp',
};

const SORT_BY_DIRECTION = {
    ASCENDING: 'ascending',
    DESCENDING: 'descending',
};

const UserBubbleReactionListModal: React.FC<IUserBubbleReactionListModalProps> = (
    props: IUserBubbleReactionListModalProps,
) => {
    const { handleClose, apiPath, apiReactionSourceEntityIdValue } = props;
    const [userBubbleReactionListModalState, setUserBubbleReactionListModalState] =
        useState<IUserBubbleReactionListModalState>({
            data: [],
            isLoading: true,
            responseError: null,
            filterUserText: '',
            sortByOption: SORT_BY_OPTIONS.FOLLOWING,
            sortByOptionIsAscending: true,
        });

    const userBubblesProcessed: UserBubbleReactionModel[] = getFilteredUsersByUsernameOrName(
        userBubbleReactionListModalState.filterUserText,
        userBubbleReactionListModalState.data,
    );
    userBubblesProcessed.sort((userBubble1: UserBubbleReactionModel, userBubble2: UserBubbleReactionModel) => {
        if (userBubbleReactionListModalState.sortByOption === SORT_BY_OPTIONS.FOLLOWING) {
            if (userBubble1.getIsMe() && !userBubble2.getIsMe()) {
                return -1;
            } else if (!userBubble1.getIsMe() && userBubble2.getIsMe()) {
                return 1;
            }
            if (userBubble1.getIsFollowedByMe() && !userBubble2.getIsFollowedByMe()) {
                return -1;
            } else if (!userBubble1.getIsFollowedByMe() && userBubble2.getIsFollowedByMe()) {
                return 1;
            }
            return userBubble1.getUsername().toLowerCase().localeCompare(userBubble2.getUsername().toLowerCase());
        } else if (userBubbleReactionListModalState.sortByOption === SORT_BY_OPTIONS.TIMESTAMP) {
            return userBubble1.getTimestampToSortBy() - userBubble2.getTimestampToSortBy();
        } else {
            return userBubble1.getUsername().toLowerCase().localeCompare(userBubble2.getUsername().toLowerCase());
        }
    });

    if (!userBubbleReactionListModalState.sortByOptionIsAscending) {
        userBubblesProcessed.reverse();
    }

    const handlePostResourceUserBubblesReaction = (): void => {
        ResourceClient.postResource(apiPath, {
            id: apiReactionSourceEntityIdValue,
            numberOfReactionsLimit: -1,
        })
            .then((responseJson: any) => {
                setUserBubbleReactionListModalState((prevState: IUserBubbleReactionListModalState) => {
                    return {
                        ...prevState,
                        data: responseJson.userBubblesReaction.map(
                            (datapoint: any) => new UserBubbleReactionModel(datapoint),
                        ),
                        isLoading: false,
                        responseError: null,
                    };
                });
            })
            .catch((responseError: any) => {
                setUserBubbleReactionListModalState((prevState: IUserBubbleReactionListModalState) => {
                    return {
                        ...prevState,
                        isLoading: false,
                        responseError,
                    };
                });
            });
    };
    useEffect(() => {
        handlePostResourceUserBubblesReaction();
        // eslint-disable-next-line
    }, []);
    const debouncedHandleChangeFilterText = _.debounce((event: React.ChangeEvent<HTMLInputElement>): void => {
        setUserBubbleReactionListModalState((prevState: IUserBubbleReactionListModalState) => {
            return {
                ...prevState,
                filterUserText: event.target.value,
            };
        });
    }, 500);
    return (
        <Dialog open={true} onClose={handleClose} fullWidth>
            <DialogTitle>{`${props.modalTitle} (${String(userBubbleReactionListModalState.data.length)})`}</DialogTitle>
            <DialogContent>
                <Box sx={{ height: '550px', overflowY: 'auto' }}>
                    <Box sx={{ marginTop: '12px', marginBottom: '4px', height: '80px' }}>
                        <TextField
                            id="outlined-basic"
                            label="Filter users"
                            placeholder="Filter users by username or name"
                            fullWidth
                            variant="standard"
                            helperText={
                                userBubbleReactionListModalState.filterUserText.trim().length > 0
                                    ? `Shown: ${String(userBubblesProcessed.length)} users`
                                    : null
                            }
                            onChange={debouncedHandleChangeFilterText}
                        />
                    </Box>
                    <Box sx={{ marginBottom: '16px' }}>
                        <Grid container direction="row">
                            <Grid item sx={{ marginRight: 'auto' }}>
                                <FormControl>
                                    <InputLabel id="user-list-modal-sort-by-select-sort-by">Sort by</InputLabel>
                                    <Select
                                        id="user-list-modal-sort-by-select"
                                        value={userBubbleReactionListModalState.sortByOption}
                                        onChange={(event: any) => {
                                            setUserBubbleReactionListModalState(
                                                (prevState: IUserBubbleReactionListModalState) => {
                                                    return {
                                                        ...prevState,
                                                        sortByOption: event.target.value,
                                                    };
                                                },
                                            );
                                        }}
                                        defaultValue={SORT_BY_OPTIONS.FOLLOWING}
                                        label="Sort by"
                                    >
                                        <MenuItem value={SORT_BY_OPTIONS.FOLLOWING}>
                                            {SORT_BY_OPTIONS.FOLLOWING}
                                        </MenuItem>
                                        <MenuItem value={SORT_BY_OPTIONS.ALPHABETICAL}>
                                            {SORT_BY_OPTIONS.ALPHABETICAL}
                                        </MenuItem>
                                        <MenuItem value={SORT_BY_OPTIONS.TIMESTAMP}>
                                            {props.sortByTimestampLabel}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item sx={{ display: 'flex', verticalAlign: 'middle' }}>
                                <RadioGroup
                                    aria-labelledby="user-list-modal-sort-by-ascending-descending-setting"
                                    defaultValue={SORT_BY_DIRECTION.ASCENDING}
                                    name="radio-buttons-group"
                                    value={
                                        userBubbleReactionListModalState.sortByOptionIsAscending
                                            ? SORT_BY_DIRECTION.ASCENDING
                                            : SORT_BY_DIRECTION.DESCENDING
                                    }
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setUserBubbleReactionListModalState(
                                            (prevState: IUserBubbleReactionListModalState) => {
                                                return {
                                                    ...prevState,
                                                    sortByOptionIsAscending:
                                                        event.target.value === SORT_BY_DIRECTION.ASCENDING,
                                                };
                                            },
                                        );
                                    }}
                                    row
                                >
                                    <FormControlLabel
                                        value={SORT_BY_DIRECTION.ASCENDING}
                                        control={<Radio />}
                                        label={<ArrowUpwardIcon />}
                                    />
                                    <FormControlLabel
                                        value={SORT_BY_DIRECTION.DESCENDING}
                                        control={<Radio />}
                                        label={<ArrowDownwardIcon />}
                                    />
                                </RadioGroup>
                            </Grid>
                        </Grid>
                    </Box>
                    <List dense={false}>
                        <Box
                            sx={{
                                overflowY: 'auto',
                                height: '350px',
                                border: `1px solid`,
                                borderColor: THEME.palette.grey.A400,
                                borderRadius: '4px',
                            }}
                        >
                            {userBubblesProcessed.map((userBubble: UserBubbleReactionModel, idx: number) => {
                                return (
                                    <React.Fragment key={`${idx}_${String(userBubble.getId())}`}>
                                        <ListItem
                                            secondaryAction={
                                                <React.Fragment>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="reaction-emoji"
                                                        sx={{
                                                            marginRight: '12px',
                                                            cursor: 'default',
                                                            color: 'rgba(0,0,0,1)',
                                                        }}
                                                        disableRipple={true}
                                                    >
                                                        {Constants.GET_EMOJI_HTML_FROM_REACTION(
                                                            userBubble.getReactionType(),
                                                        )}
                                                    </IconButton>
                                                    <Tooltip title={'View profile'} placement="bottom">
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="view-profile"
                                                            sx={{ marginRight: '12px' }}
                                                            href={`/profiles/${String(userBubble.getId())}`}
                                                        >
                                                            <AccountBoxIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <IconButtonFollowUser
                                                        isMe={userBubble.getIsMe()}
                                                        isFollowedByMe={userBubble.getIsFollowedByMe()}
                                                        isFollowRequestSentNotYetAccepted={userBubble.getIsFollowRequestSentNotYetAccepted()}
                                                        handleSendFollowRequest={() => {
                                                            ResourceClient.postResource(
                                                                'api/app/SendFollowUserRequest',
                                                                {
                                                                    id: userBubble.getId(),
                                                                },
                                                            )
                                                                .then(() => {
                                                                    handlePostResourceUserBubblesReaction();
                                                                })
                                                                .catch(() => {});
                                                        }}
                                                    />
                                                </React.Fragment>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{
                                                        border: `2px solid ${String(
                                                            THEME.palette.other.formBorderColor,
                                                        )}`,
                                                    }}
                                                    alt={userBubble.getUsername()}
                                                    src={userBubble.getImageLink() ?? PlaceholderImageUser}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`@${String(userBubble.getUsername())}`}
                                                secondary={`${userBubble.getName()} (${userBubble.getDatetimeDateAndTimeLabel()})`}
                                            />
                                        </ListItem>
                                        <Divider variant="fullWidth" />
                                    </React.Fragment>
                                );
                            })}
                        </Box>
                    </List>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserBubbleReactionListModal;
