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

export interface IManageBecomePodModeratorRequestsModalProps {
    handleClose: any;
    modalTitle: string;
    handleUpdateUserPage: any;
}

export interface IManagePendingFollowUserRequestsModalState {
    data: {
        selectedUserIds: Set<string>;
    };
    isAccept: boolean;
    isShowDeclineConfirmationOptions: boolean;
    filterUserText: string;
    sortByOption: string;
    sortByOptionIsAscending: boolean;
    response: {
        state: string;
        errorMessage: string | null;
    };
}
export interface IUserBubblePendingFollowUserRequestState {
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

const ManagePendingFollowUserRequestsModal: React.FC<IManageBecomePodModeratorRequestsModalProps> = (
    props: IManageBecomePodModeratorRequestsModalProps,
) => {
    const { handleClose, modalTitle, handleUpdateUserPage } = props;
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    const [managePendingFollowUserRequestsModalState, setManagePendingFollowUserRequestsModalState] =
        useState<IManagePendingFollowUserRequestsModalState>({
            data: { selectedUserIds: new Set() },
            isAccept: true,
            isShowDeclineConfirmationOptions: false,
            filterUserText: '',
            sortByOption: SORT_BY_OPTIONS.FOLLOWING,
            sortByOptionIsAscending: true,
            response: {
                state: Constants.RESPONSE_STATE_UNSTARTED,
                errorMessage: null,
            },
        });
    const [userBubblePendingFollowUserRequestState, setUserBubblePendingFollowUserRequestState] =
        useState<IUserBubblePendingFollowUserRequestState>({
            data: [],
            response: {
                state: Constants.RESPONSE_STATE_UNSTARTED,
                errorMessage: null,
            },
        });
    const userBubblesProcessed: UserBubbleModel[] = getFilteredUsersByUsernameOrName(
        managePendingFollowUserRequestsModalState.filterUserText,
        userBubblePendingFollowUserRequestState.data,
    );
    userBubblesProcessed.sort((userBubble1: UserBubbleModel, userBubble2: UserBubbleModel) => {
        if (managePendingFollowUserRequestsModalState.sortByOption === SORT_BY_OPTIONS.FOLLOWING) {
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
        } else if (managePendingFollowUserRequestsModalState.sortByOption === SORT_BY_OPTIONS.TIMESTAMP) {
            return userBubble1.getTimestampToSortBy() - userBubble2.getTimestampToSortBy();
        } else {
            return userBubble1.getUsername().toLowerCase().localeCompare(userBubble2.getUsername().toLowerCase());
        }
    });

    if (!managePendingFollowUserRequestsModalState.sortByOptionIsAscending) {
        userBubblesProcessed.reverse();
    }

    const handleGetUserBubblesPendingFollowUserRequest = async (): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetUserBubblesPendingFollowUserRequest',
                {},
                sliceAuthenticationStateData.getJwtToken(),
            );
            setUserBubblePendingFollowUserRequestState((prevState: IUserBubblePendingFollowUserRequestState) => {
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
            setUserBubblePendingFollowUserRequestState((prevState: IUserBubblePendingFollowUserRequestState) => {
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
        void handleGetUserBubblesPendingFollowUserRequest();
        // eslint-disable-next-line
    }, []);

    const handleUpdateUserBubblePendingFollowUserRequestState = (responseJson: any): void => {
        setUserBubblePendingFollowUserRequestState((prevState: IUserBubblePendingFollowUserRequestState) => {
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
        setManagePendingFollowUserRequestsModalState((prevState: IManagePendingFollowUserRequestsModalState) => {
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
        setManagePendingFollowUserRequestsModalState((prevState: IManagePendingFollowUserRequestsModalState) => {
            return {
                ...prevState,
                filterUserText: event.target.value,
            };
        });
    }, 500);
    return (
        <Dialog open={true} onClose={handleClose} fullWidth>
            <DialogTitle>{`${modalTitle} (${String(
                userBubblePendingFollowUserRequestState.data.length,
            )})`}</DialogTitle>
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
                                managePendingFollowUserRequestsModalState.filterUserText.trim().length > 0
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
                                        value={managePendingFollowUserRequestsModalState.sortByOption}
                                        onChange={(event: any) => {
                                            setManagePendingFollowUserRequestsModalState(
                                                (prevState: IManagePendingFollowUserRequestsModalState) => {
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
                                        <MenuItem value={SORT_BY_OPTIONS.TIMESTAMP}>{'time request sent'}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item sx={{ display: 'flex', verticalAlign: 'middle' }}>
                                <RadioGroup
                                    aria-labelledby="user-list-modal-sort-by-ascending-descending-setting"
                                    defaultValue={SORT_BY_DIRECTION.ASCENDING}
                                    name="radio-buttons-group"
                                    value={
                                        managePendingFollowUserRequestsModalState.sortByOptionIsAscending
                                            ? SORT_BY_DIRECTION.ASCENDING
                                            : SORT_BY_DIRECTION.DESCENDING
                                    }
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setManagePendingFollowUserRequestsModalState(
                                            (prevState: IManagePendingFollowUserRequestsModalState) => {
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
                                marginBottom: '16px',
                            }}
                        >
                            {userBubblesProcessed.map((userBubble: UserBubbleModel, idx: number) => {
                                return (
                                    <React.Fragment key={`${idx}_${String(userBubble.getId())}`}>
                                        <ListItem>
                                            <ListItemButton
                                                onClick={() => {
                                                    setManagePendingFollowUserRequestsModalState(
                                                        (prevState: IManagePendingFollowUserRequestsModalState) => {
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
                                                                isShowDeclineConfirmationOptions: false,
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
                                                        checked={managePendingFollowUserRequestsModalState.data.selectedUserIds.has(
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
                                                    secondary={`${userBubble.getName()} (${userBubble.getDatetimeDateOnlyLabel()})`}
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
                                                        void handleGetUserBubblesPendingFollowUserRequest();
                                                    } catch (e: any) {}
                                                }}
                                            />
                                        </ListItem>
                                        <Divider variant="fullWidth" />
                                    </React.Fragment>
                                );
                            })}
                        </Box>
                    </List>
                    {managePendingFollowUserRequestsModalState.response.state === Constants.RESPONSE_STATE_SUCCESS ? (
                        <Alert severity="success">{`Follow requests have been ${
                            managePendingFollowUserRequestsModalState.isAccept ? 'accepted' : 'declined'
                        }.`}</Alert>
                    ) : null}
                    {managePendingFollowUserRequestsModalState.isShowDeclineConfirmationOptions ? (
                        <Alert severity="warning">{`Are you sure you want to decline the above request(s)?`}</Alert>
                    ) : null}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                {managePendingFollowUserRequestsModalState.isShowDeclineConfirmationOptions ? (
                    <React.Fragment>
                        <Button
                            onClick={() => {
                                setManagePendingFollowUserRequestsModalState(
                                    (prevState: IManagePendingFollowUserRequestsModalState) => {
                                        return {
                                            ...prevState,
                                            isShowDeclineConfirmationOptions: false,
                                        };
                                    },
                                );
                            }}
                        >
                            No
                        </Button>
                        <Button
                            /* eslint-disable @typescript-eslint/no-misused-promises */
                            onClick={async () => {
                                try {
                                    setManagePendingFollowUserRequestsModalState(
                                        (prevState: IManagePendingFollowUserRequestsModalState) => {
                                            return {
                                                ...prevState,
                                                isAccept: false,
                                                isShowDeclineConfirmationOptions: false,
                                                response: {
                                                    ...prevState.response,
                                                    state: Constants.RESPONSE_STATE_LOADING,
                                                },
                                            };
                                        },
                                    );
                                    const response = await ResourceClient.postResource(
                                        'api/app/DeclineFollowUserRequests',
                                        {
                                            idUsers: Array.from(
                                                managePendingFollowUserRequestsModalState.data.selectedUserIds,
                                            ),
                                        },
                                        sliceAuthenticationStateData.getJwtToken(),
                                    );
                                    handleUpdateUserBubblePendingFollowUserRequestState(response.data);
                                    handleUpdateUserPage();
                                } catch (e: any) {
                                    setManagePendingFollowUserRequestsModalState(
                                        (prevState: IManagePendingFollowUserRequestsModalState) => {
                                            return {
                                                ...prevState,
                                                response: {
                                                    state: Constants.RESPONSE_STATE_ERROR,
                                                    errorMessage: e?.response?.data?.message,
                                                },
                                            };
                                        },
                                    );
                                }
                            }}
                        >
                            Yes
                        </Button>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Button
                            disabled={
                                managePendingFollowUserRequestsModalState.data.selectedUserIds.size === 0 ||
                                userBubblePendingFollowUserRequestState.data.length === 0
                            }
                            onClick={() => {
                                setManagePendingFollowUserRequestsModalState(
                                    (prevState: IManagePendingFollowUserRequestsModalState) => {
                                        return {
                                            ...prevState,
                                            isShowDeclineConfirmationOptions: true,
                                        };
                                    },
                                );
                            }}
                        >
                            Decline
                        </Button>
                        <Button
                            disabled={
                                managePendingFollowUserRequestsModalState.data.selectedUserIds.size === 0 ||
                                userBubblePendingFollowUserRequestState.data.length === 0
                            }
                            /* eslint-disable @typescript-eslint/no-misused-promises */
                            onClick={async () => {
                                try {
                                    setManagePendingFollowUserRequestsModalState(
                                        (prevState: IManagePendingFollowUserRequestsModalState) => {
                                            return {
                                                ...prevState,
                                                isAccept: true,
                                                response: {
                                                    ...prevState.response,
                                                    state: Constants.RESPONSE_STATE_LOADING,
                                                },
                                            };
                                        },
                                    );
                                    const response = await ResourceClient.postResource(
                                        'api/app/AcceptFollowUserRequests',
                                        {
                                            idUsers: Array.from(
                                                managePendingFollowUserRequestsModalState.data.selectedUserIds,
                                            ),
                                        },
                                        sliceAuthenticationStateData.getJwtToken(),
                                    );
                                    handleUpdateUserBubblePendingFollowUserRequestState(response.data);
                                    handleUpdateUserPage();
                                } catch (e: any) {
                                    setManagePendingFollowUserRequestsModalState(
                                        (prevState: IManagePendingFollowUserRequestsModalState) => {
                                            return {
                                                ...prevState,
                                                response: {
                                                    state: Constants.RESPONSE_STATE_ERROR,
                                                    errorMessage: e?.response?.data?.message,
                                                },
                                            };
                                        },
                                    );
                                }
                            }}
                        >
                            Accept
                        </Button>
                    </React.Fragment>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ManagePendingFollowUserRequestsModal;
