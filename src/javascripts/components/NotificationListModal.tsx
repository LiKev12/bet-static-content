import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
    Box,
    Button,
    ButtonGroup,
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
import NotificationModel from 'src/javascripts/models/NotificationModel';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import PlaceholderImageUser from 'src/assets/PlaceholderImageUser.png';
import PlaceholderImagePod from 'src/assets/PlaceholderImagePod.png';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { MOCK_MY_USER_ID } from 'src/javascripts/mocks/Mocks';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import Constants from 'src/javascripts/Constants';

export interface INotificationListModalProps {
    handleClose: any;
    modalTitle: string;
}

export interface INotificationListModalState {
    data: NotificationModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
    filterNotificationMessageText: string;
    sortByOption: string;
    sortByOptionIsAscending: boolean;
}

const getFilteredNotificationsByNotificationMessage = (
    filterTextRaw: string,
    notifications: NotificationModel[],
): NotificationModel[] => {
    const filterText = filterTextRaw.trim().toLowerCase();
    return notifications.filter((notification: NotificationModel) => {
        return notification.getNotificationMessage().toLowerCase().includes(filterText);
    });
};

const SORT_BY_OPTIONS = {
    ALPHABETICAL: 'alphabetical',
    TIMESTAMP: 'timestamp',
};

const SORT_BY_DIRECTION = {
    ASCENDING: 'ascending',
    DESCENDING: 'descending',
};

const NotificationListModal: React.FC<INotificationListModalProps> = (props: INotificationListModalProps) => {
    const { handleClose } = props;
    const [notificationListModalState, setNotificationListModalState] = useState<INotificationListModalState>({
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
        filterNotificationMessageText: '',
        sortByOption: SORT_BY_OPTIONS.TIMESTAMP,
        sortByOptionIsAscending: false,
    });

    const notificationsProcessed: NotificationModel[] = getFilteredNotificationsByNotificationMessage(
        notificationListModalState.filterNotificationMessageText,
        notificationListModalState.data,
    );
    notificationsProcessed.sort((notification1: NotificationModel, notification2: NotificationModel) => {
        if (notificationListModalState.sortByOption === SORT_BY_OPTIONS.TIMESTAMP) {
            return notification1.getTimestampToSortBy() - notification2.getTimestampToSortBy();
        } else {
            return notification1
                .getNotificationMessage()
                .toLowerCase()
                .localeCompare(notification2.getNotificationMessage().toLowerCase());
        }
    });

    if (!notificationListModalState.sortByOptionIsAscending) {
        notificationsProcessed.reverse();
    }

    const handleGetResourceNotifications = (
        pathApi: string,
        queryParamsObject: Record<string, unknown>,
        requestBodyObject: Record<string, unknown>,
    ): void => {
        ResourceClient.postResource(pathApi, queryParamsObject, requestBodyObject)
            .then((responseJson: any) => {
                setNotificationListModalState((prevState: INotificationListModalState) => {
                    return {
                        ...prevState,
                        data: responseJson.map((datapoint: any) => new NotificationModel(datapoint)),
                        isLoading: false,
                        responseError: null,
                    };
                });
            })
            .catch((responseError: any) => {
                setNotificationListModalState((prevState: INotificationListModalState) => {
                    return {
                        ...prevState,
                        isLoading: false,
                        responseError,
                    };
                });
            });
    };
    useEffect(() => {
        handleGetResourceNotifications(
            'api/user/read/notifications',
            {
                idUser: MOCK_MY_USER_ID,
            },
            {},
        );
        // eslint-disable-next-line
    }, []);
    const debouncedHandleChangeFilterText = _.debounce((event: React.ChangeEvent<HTMLInputElement>): void => {
        setNotificationListModalState((prevState: INotificationListModalState) => {
            return {
                ...prevState,
                filterNotificationMessageText: event.target.value,
            };
        });
    }, 500);
    return (
        <Dialog open={true} onClose={handleClose} fullWidth>
            <DialogTitle>{`${props.modalTitle} (${String(notificationListModalState.data.length)})`}</DialogTitle>
            <DialogContent>
                <Box sx={{ height: '550px', overflowY: 'auto' }}>
                    <Box sx={{ marginTop: '12px', marginBottom: '4px', height: '80px' }}>
                        <TextField
                            id="outlined-basic"
                            label="Filter notifications"
                            placeholder="Filter notifications"
                            fullWidth
                            variant="standard"
                            helperText={
                                notificationListModalState.filterNotificationMessageText.trim().length > 0
                                    ? `Shown: ${String(notificationsProcessed.length)} users`
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
                                        value={notificationListModalState.sortByOption}
                                        onChange={(event: any) => {
                                            setNotificationListModalState((prevState: INotificationListModalState) => {
                                                return {
                                                    ...prevState,
                                                    sortByOption: event.target.value,
                                                };
                                            });
                                        }}
                                        defaultValue={SORT_BY_OPTIONS.TIMESTAMP}
                                        label="Sort by"
                                    >
                                        <MenuItem value={SORT_BY_OPTIONS.TIMESTAMP}>{'time of notification'}</MenuItem>
                                        <MenuItem value={SORT_BY_OPTIONS.ALPHABETICAL}>
                                            {SORT_BY_OPTIONS.ALPHABETICAL}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item sx={{ display: 'flex', verticalAlign: 'middle' }}>
                                <RadioGroup
                                    aria-labelledby="notification-list-modal-sort-by-ascending-descending-setting"
                                    defaultValue={SORT_BY_DIRECTION.DESCENDING}
                                    name="radio-buttons-group"
                                    value={
                                        notificationListModalState.sortByOptionIsAscending
                                            ? SORT_BY_DIRECTION.ASCENDING
                                            : SORT_BY_DIRECTION.DESCENDING
                                    }
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setNotificationListModalState((prevState: INotificationListModalState) => {
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
                            }}
                        >
                            {notificationsProcessed.map((notification: NotificationModel, idx: number) => {
                                let secondaryAction = null;
                                if (
                                    notification.getNotificationType() ===
                                    Constants.NOTIFICATION_TYPE_ACCEPTED_YOUR_FOLLOW_REQUEST
                                ) {
                                    secondaryAction = (
                                        <Tooltip title={'View profile'} placement="bottom">
                                            <IconButton
                                                edge="end"
                                                aria-label="view-profile"
                                                href={`/profiles/${String(notification.getIdLinkPage())}`}
                                                sx={{ marginRight: '0px' }}
                                            >
                                                <AccountBoxIcon />
                                            </IconButton>
                                        </Tooltip>
                                    );
                                } else if (
                                    notification.getNotificationType() ===
                                    Constants.NOTIFICATION_TYPE_SENT_YOU_FOLLOW_REQUEST
                                ) {
                                    if (notification.getIsFollowedByUserWhoSentFollowRequest()) {
                                        secondaryAction = (
                                            <Tooltip title={'View profile'} placement="bottom">
                                                <IconButton
                                                    edge="end"
                                                    aria-label="view-profile"
                                                    href={`/profiles/${String(notification.getIdLinkPage())}`}
                                                    sx={{ marginRight: '0px' }}
                                                >
                                                    <AccountBoxIcon />
                                                </IconButton>
                                            </Tooltip>
                                        );
                                    } else {
                                        if (!notification.getIsDismissed()) {
                                            secondaryAction = (
                                                <ButtonGroup>
                                                    <IconButton
                                                        onClick={() => {
                                                            ResourceClient.postResource(
                                                                'api/user/update/acceptFollowUserRequests',
                                                                {
                                                                    idUser: MOCK_MY_USER_ID,
                                                                },
                                                                {
                                                                    idUsersWithFollowRequestAccepted: [
                                                                        notification.getIdLinkPage(),
                                                                    ],
                                                                },
                                                            )
                                                                .then(() => {})
                                                                .catch(() => {});
                                                            ResourceClient.postResource(
                                                                'api/user/update/dismissNotification',
                                                                {
                                                                    idUser: MOCK_MY_USER_ID,
                                                                },
                                                                {
                                                                    idNotification: notification.getId(),
                                                                },
                                                            )
                                                                .then(() => {
                                                                    handleGetResourceNotifications(
                                                                        'api/user/read/notifications',
                                                                        {
                                                                            idUser: MOCK_MY_USER_ID,
                                                                        },
                                                                        {},
                                                                    );
                                                                })
                                                                .catch(() => {});
                                                        }}
                                                    >
                                                        <CheckIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => {
                                                            ResourceClient.postResource(
                                                                'api/user/update/declineFollowUserRequests',
                                                                {
                                                                    idUser: MOCK_MY_USER_ID,
                                                                },
                                                                {
                                                                    idUsersWithFollowRequestDeclined: [
                                                                        notification.getIdLinkPage(),
                                                                    ],
                                                                },
                                                            )
                                                                .then(() => {})
                                                                .catch(() => {});
                                                            ResourceClient.postResource(
                                                                'api/user/update/dismissNotification',
                                                                {
                                                                    idUser: MOCK_MY_USER_ID,
                                                                },
                                                                {
                                                                    idNotification: notification.getId(),
                                                                },
                                                            )
                                                                .then(() => {
                                                                    handleGetResourceNotifications(
                                                                        'api/user/read/notifications',
                                                                        {
                                                                            idUser: MOCK_MY_USER_ID,
                                                                        },
                                                                        {},
                                                                    );
                                                                })
                                                                .catch(() => {});
                                                        }}
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                </ButtonGroup>
                                            );
                                        }
                                    }
                                } else if (
                                    notification.getNotificationType() ===
                                        Constants.NOTIFICATION_TYPE_APPROVED_YOUR_BECOME_POD_MODERATOR_REQUEST ||
                                    notification.getNotificationType() ===
                                        Constants.NOTIFICATION_TYPE_ADDED_YOU_AS_POD_MODERATOR
                                ) {
                                    secondaryAction = (
                                        <Tooltip title={'View Pod'} placement="bottom">
                                            <IconButton
                                                edge="end"
                                                aria-label="view-pod"
                                                href={`/pods/${String(notification.getIdLinkPage())}`}
                                                sx={{ marginRight: '0px' }}
                                            >
                                                <LoginIcon />
                                            </IconButton>
                                        </Tooltip>
                                    );
                                } else if (
                                    notification.getNotificationType() ===
                                    Constants.NOTIFICATION_TYPE_SENT_YOU_JOIN_POD_INVITE
                                ) {
                                    if (notification.getIsMemberOfPod()) {
                                        secondaryAction = (
                                            <Tooltip title={'View Pod'} placement="bottom">
                                                <IconButton
                                                    edge="end"
                                                    aria-label="view-pod"
                                                    href={`/pods/${String(notification.getIdLinkPage())}`}
                                                    sx={{ marginRight: '0px' }}
                                                >
                                                    <LoginIcon />
                                                </IconButton>
                                            </Tooltip>
                                        );
                                    } else {
                                        if (!notification.getIsDismissed()) {
                                            secondaryAction = (
                                                <ButtonGroup>
                                                    <IconButton
                                                        onClick={() => {
                                                            ResourceClient.postResource(
                                                                'api/pod/update/acceptJoinPodInvite',
                                                                {
                                                                    idUser: MOCK_MY_USER_ID,
                                                                },
                                                                {
                                                                    idPod: notification.getIdLinkPage(),
                                                                },
                                                            )
                                                                .then(() => {})
                                                                .catch(() => {});
                                                            ResourceClient.postResource(
                                                                'api/user/update/dismissNotification',
                                                                {
                                                                    idUser: MOCK_MY_USER_ID,
                                                                },
                                                                {
                                                                    idNotification: notification.getId(),
                                                                },
                                                            )
                                                                .then(() => {
                                                                    handleGetResourceNotifications(
                                                                        'api/user/read/notifications',
                                                                        {
                                                                            idUser: MOCK_MY_USER_ID,
                                                                        },
                                                                        {},
                                                                    );
                                                                })
                                                                .catch(() => {});
                                                        }}
                                                    >
                                                        <CheckIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => {
                                                            ResourceClient.postResource(
                                                                'api/pod/update/declineJoinPodInvite',
                                                                {
                                                                    idUser: MOCK_MY_USER_ID,
                                                                },
                                                                {
                                                                    idPod: notification.getIdLinkPage(),
                                                                },
                                                            )
                                                                .then(() => {})
                                                                .catch(() => {});
                                                            ResourceClient.postResource(
                                                                'api/user/update/dismissNotification',
                                                                {
                                                                    idUser: MOCK_MY_USER_ID,
                                                                },
                                                                {
                                                                    idNotification: notification.getId(),
                                                                },
                                                            )
                                                                .then(() => {
                                                                    handleGetResourceNotifications(
                                                                        'api/user/read/notifications',
                                                                        {
                                                                            idUser: MOCK_MY_USER_ID,
                                                                        },
                                                                        {},
                                                                    );
                                                                })
                                                                .catch(() => {});
                                                        }}
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                </ButtonGroup>
                                            );
                                        }
                                    }
                                }
                                const listItemBackgroundColor: any = !notification.getIsSeen()
                                    ? { backgroundColor: '#e3f2fd' }
                                    : {};
                                return (
                                    <React.Fragment key={`${idx}_${String(notification.getId())}`}>
                                        <ListItem sx={{ ...listItemBackgroundColor }} secondaryAction={secondaryAction}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{
                                                        border: `2px solid ${String(
                                                            THEME.palette.other.formBorderColor,
                                                        )}`,
                                                    }}
                                                    alt={'notification-image'}
                                                    src={
                                                        notification.getImageLink() ??
                                                        (notification.getLinkPageType() ===
                                                        Constants.NOTIFICATION_LINK_PAGE_TYPE_USER
                                                            ? PlaceholderImageUser
                                                            : PlaceholderImagePod)
                                                    }
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${String(notification.getNotificationMessage())}`}
                                                secondary={`(${notification.getDatetimeDateAndTimeLabel()})`}
                                                primaryTypographyProps={{
                                                    style: {
                                                        width: '370px',
                                                        height: '50px',
                                                        overflowY: 'auto',
                                                    },
                                                }}
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

export default NotificationListModal;
