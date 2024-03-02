import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    Tooltip,
    TextField,
    ListItemIcon,
    Checkbox,
    ListItemButton,
    Grid,
    FormControl,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    InputLabel,
} from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import UserBubbleModel from 'src/javascripts/models/UserBubbleModel';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import PlaceholderImageUser from 'src/assets/PlaceholderImageUser.png';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Constants from 'src/javascripts/Constants';
import IconButtonFollowUser from 'src/javascripts/components/IconButtonFollowUser';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';

import type { IRootState } from 'src/javascripts/store';

export interface IInviteUsersJoinPodModalProps {
    handleClose: any;
    modalTitle: string;
    idPod: string;
}

export interface IInviteUsersJoinPodModalState {
    data: {
        selectedUserIds: Set<string>;
    };
    filterUserText: string;
    sortByOption: string;
    sortByOptionIsAscending: boolean;
    response: {
        state: string;
        errorMessage: string | null;
    };
}

export interface IUserBubbleInviteJoinPodState {
    data: UserBubbleModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const getFilteredUsersByUsernameOrName = (filterTextRaw: string, userBubbles: UserBubbleModel[]): UserBubbleModel[] => {
    const filterText = filterTextRaw.trim().toLowerCase();
    return userBubbles.filter((userBubble: UserBubbleModel) => {
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

const InviteUsersJoinPodModal: React.FC<IInviteUsersJoinPodModalProps> = (props: IInviteUsersJoinPodModalProps) => {
    const { handleClose, idPod, modalTitle } = props;
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    const [inviteUsersJoinPodModalState, setInviteUsersJoinPodModalState] = useState<IInviteUsersJoinPodModalState>({
        data: { selectedUserIds: new Set() },
        filterUserText: '',
        sortByOption: SORT_BY_OPTIONS.FOLLOWING,
        sortByOptionIsAscending: true,
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    });
    const [userBubbleInviteJoinPodState, setUserBubbleInviteJoinPodState] = useState<IUserBubbleInviteJoinPodState>({
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    });
    const userBubblesProcessed: UserBubbleModel[] = getFilteredUsersByUsernameOrName(
        inviteUsersJoinPodModalState.filterUserText,
        userBubbleInviteJoinPodState.data,
    );

    userBubblesProcessed.sort((userBubble1: UserBubbleModel, userBubble2: UserBubbleModel) => {
        if (inviteUsersJoinPodModalState.sortByOption === SORT_BY_OPTIONS.FOLLOWING) {
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
        } else if (inviteUsersJoinPodModalState.sortByOption === SORT_BY_OPTIONS.TIMESTAMP) {
            return userBubble1.getTimestampToSortBy() - userBubble2.getTimestampToSortBy();
        } else {
            return userBubble1.getUsername().toLowerCase().localeCompare(userBubble2.getUsername().toLowerCase());
        }
    });

    if (!inviteUsersJoinPodModalState.sortByOptionIsAscending) {
        userBubblesProcessed.reverse();
    }

    const handleGetUserBubblesInviteJoinPod = async (): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetUserBubblesInviteJoinPod',
                { id: String(idPod) },
                sliceAuthenticationStateData.getJwtToken(),
            );
            setUserBubbleInviteJoinPodState((prevState: IUserBubbleInviteJoinPodState) => {
                return {
                    ...prevState,
                    data: response.data.map((datapoint: any) => new UserBubbleModel(datapoint)),
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_SUCCESS,
                        errorMessage: null,
                    },
                };
            });
        } catch (e: any) {
            setUserBubbleInviteJoinPodState((prevState: IUserBubbleInviteJoinPodState) => {
                return {
                    ...prevState,
                    response: {
                        ...prevState.response,
                        state: Constants.RESPONSE_STATE_ERROR,
                        errorMessage: e?.response?.data?.message,
                    },
                };
            });
        }
    };
    useEffect(() => {
        void handleGetUserBubblesInviteJoinPod();
        // eslint-disable-next-line
    }, []);

    const handleUpdateUserBubbleInviteJoinPodState = (responseJson: any): void => {
        setUserBubbleInviteJoinPodState((prevState: IUserBubbleInviteJoinPodState) => {
            return {
                ...prevState,
                data: responseJson.map((datapoint: any) => {
                    return new UserBubbleModel(datapoint);
                }),
                response: {
                    ...prevState.response,
                    state: Constants.RESPONSE_STATE_SUCCESS,
                    errorMessage: null,
                },
            };
        });
        setInviteUsersJoinPodModalState((prevState: IInviteUsersJoinPodModalState) => {
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    selectedUserIds: new Set(),
                },
                response: {
                    ...prevState.response,
                    state: Constants.RESPONSE_STATE_SUCCESS,
                    errorMessage: null,
                },
            };
        });
    };
    const debouncedHandleChangeFilterText = _.debounce((event: React.ChangeEvent<HTMLInputElement>): void => {
        setInviteUsersJoinPodModalState((prevState: IInviteUsersJoinPodModalState) => {
            return {
                ...prevState,
                filterUserText: event.target.value,
            };
        });
    }, 500);
    return (
        <Dialog open={true} onClose={handleClose} fullWidth>
            <DialogTitle>{`${modalTitle} (${String(userBubbleInviteJoinPodState.data.length)})`}</DialogTitle>
            <DialogContent>
                <Box sx={{ height: '600px', overflowY: 'auto' }}>
                    <Box sx={{ marginTop: '12px', marginBottom: '4px', height: '80px' }}>
                        <TextField
                            id="outlined-basic"
                            label="Filter users"
                            placeholder="Filter users by username or name"
                            fullWidth
                            variant="standard"
                            helperText={
                                inviteUsersJoinPodModalState.filterUserText.trim().length > 0
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
                                        value={inviteUsersJoinPodModalState.sortByOption}
                                        onChange={(event: any) => {
                                            setInviteUsersJoinPodModalState(
                                                (prevState: IInviteUsersJoinPodModalState) => {
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
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item sx={{ display: 'flex', verticalAlign: 'middle' }}>
                                <RadioGroup
                                    aria-labelledby="user-list-modal-sort-by-ascending-descending-setting"
                                    defaultValue={SORT_BY_DIRECTION.ASCENDING}
                                    name="radio-buttons-group"
                                    value={
                                        inviteUsersJoinPodModalState.sortByOptionIsAscending
                                            ? SORT_BY_DIRECTION.ASCENDING
                                            : SORT_BY_DIRECTION.DESCENDING
                                    }
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setInviteUsersJoinPodModalState((prevState: IInviteUsersJoinPodModalState) => {
                                            return {
                                                ...prevState,
                                                sortByOptionIsAscending:
                                                    event.target.value === SORT_BY_DIRECTION.ASCENDING,
                                            };
                                        });
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
                                marginBottom: '16px',
                            }}
                        >
                            {userBubblesProcessed.map((userBubble: UserBubbleModel, idx: number) => {
                                return (
                                    <React.Fragment key={`${idx}_${String(userBubble.getId())}`}>
                                        <ListItem>
                                            <ListItemButton
                                                onClick={() => {
                                                    setInviteUsersJoinPodModalState(
                                                        (prevState: IInviteUsersJoinPodModalState) => {
                                                            const selectedUserIds = prevState.data.selectedUserIds;
                                                            if (selectedUserIds.has(userBubble.getId())) {
                                                                selectedUserIds.delete(userBubble.getId());
                                                            } else {
                                                                selectedUserIds.add(userBubble.getId());
                                                            }
                                                            return {
                                                                ...prevState,
                                                                data: {
                                                                    ...prevState.data,
                                                                    selectedUserIds,
                                                                },
                                                                response: {
                                                                    ...prevState.response,
                                                                    state: Constants.RESPONSE_STATE_UNSTARTED,
                                                                    errorMessage: null,
                                                                },
                                                            };
                                                        },
                                                    );
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={inviteUsersJoinPodModalState.data.selectedUserIds.has(
                                                            userBubble.getId(),
                                                        )}
                                                        disableRipple
                                                    />
                                                </ListItemIcon>
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
                                                    secondary={`${userBubble.getName()}`}
                                                />
                                            </ListItemButton>
                                            <Tooltip title={'View profile'} placement="bottom">
                                                <IconButton
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
                                                handleSendFollowRequest={async () => {
                                                    try {
                                                        await ResourceClient.postResource(
                                                            'api/app/SendFollowUserRequest',
                                                            {
                                                                id: userBubble.getId(),
                                                            },
                                                            sliceAuthenticationStateData.getJwtToken(),
                                                        );
                                                        void handleGetUserBubblesInviteJoinPod();
                                                    } catch (e: any) {}
                                                }}
                                                isAllowUnfollow={false}
                                                handleUnfollowUser={() => {}}
                                            />
                                        </ListItem>
                                        <Divider variant="fullWidth" />
                                    </React.Fragment>
                                );
                            })}
                        </Box>
                    </List>
                    {inviteUsersJoinPodModalState.response.state === Constants.RESPONSE_STATE_SUCCESS ? (
                        <Alert severity="success">{`User(s) invited to join Pod.`}</Alert>
                    ) : null}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button
                    disabled={
                        inviteUsersJoinPodModalState.data.selectedUserIds.size === 0 ||
                        userBubbleInviteJoinPodState.data.length === 0
                    }
                    /* eslint-disable @typescript-eslint/no-misused-promises */
                    onClick={async () => {
                        try {
                            setInviteUsersJoinPodModalState((prevState: IInviteUsersJoinPodModalState) => {
                                return {
                                    ...prevState,
                                    response: {
                                        ...prevState.response,
                                        state: Constants.RESPONSE_STATE_LOADING,
                                    },
                                };
                            });
                            const response = await ResourceClient.postResource(
                                'api/app/SendJoinPodInvite',
                                {
                                    id: String(idPod),
                                    idUsers: Array.from(inviteUsersJoinPodModalState.data.selectedUserIds),
                                },
                                sliceAuthenticationStateData.getJwtToken(),
                            );
                            handleUpdateUserBubbleInviteJoinPodState(response.data);
                        } catch (e: any) {
                            setInviteUsersJoinPodModalState((prevState: IInviteUsersJoinPodModalState) => {
                                return {
                                    ...prevState,
                                    response: {
                                        state: Constants.RESPONSE_STATE_ERROR,
                                        errorMessage: e?.response?.data?.message,
                                    },
                                };
                            });
                        }
                    }}
                >
                    Invite
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InviteUsersJoinPodModal;
