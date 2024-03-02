import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Alert,
    Box,
    // Button,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Grid,
    IconButton,
    InputAdornment,
    // FormControlLabel,
    // Checkbox
    TextField,
    Typography,
    Select,
    MenuItem,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AvatarImageEditor from 'src/javascripts/components/AvatarImageEditor';
import { THEME } from 'src/javascripts/Theme';
// import SearchEntities from 'src/javascripts/components/SearchEntities';
// import PodCardList from 'src/javascripts/components/PodCardList';
// import StampCardList from 'src/javascripts/components/StampCardList';
// import CreatePodModal from 'src/javascripts/components/CreatePodModal';
// import CreateStampModalButton from 'src/javascripts/components/CreateStampModalButton';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
// import PodCardModel from 'src/javascripts/models/PodCardModel';
import AccountSettingsPageModel from 'src/javascripts/models/AccountSettingsPageModel';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';
import { getInputText } from 'src/javascripts/utilities';
import ResponseModel from 'src/javascripts/models/ResponseModel';
// import { sliceHeaderActiveTabActions } from 'src/javascripts/store/SliceHeaderActiveTab';
import Constants from 'src/javascripts/Constants';
// import { slicePodCardsDiscoverPageActions } from 'src/javascripts/store/SlicePodCardsDiscoverPage';
// import { sliceStampCardsDiscoverPageActions } from 'src/javascripts/store/SliceStampCardsDiscoverPage';
import { slicePageAccountSettingsActions } from 'src/javascripts/store/SlicePageAccountSettings';
import { sliceAuthenticationActions } from 'src/javascripts/store/SliceAuthentication';
import { sliceHeaderActiveTabActions } from 'src/javascripts/store/SliceHeaderActiveTab';
import PlaceholderImageUser from 'src/assets/PlaceholderImageUser.png';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import type { IRootState } from 'src/javascripts/store';

export interface IPageAccountSettingsState {
    deactivateAccount: {
        isModalOpen: boolean;
        confirmPasswordValue: string;
        isError: boolean;
        errorMessage: string;
        isShowConfirmPasswordValue: boolean;
    };
    changePassword: {
        isModalOpen: boolean;
        currentPasswordValue: string;
        isShowCurrentPasswordValue: boolean;
        newPasswordValue: string;
        isShowNewPasswordValue: boolean;
        newPasswordConfirmedValue: string;
        isShowNewPasswordConfirmedValue: boolean;
        isError: boolean;
        errorMessage: string;
        isSuccess: boolean;
    };
    advancedSettings: {
        isShow: boolean;
    };
}

const PageAccountSettings: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    const slicePageAccountSettingsState = useSelector((state: IRootState) => state.pageAccountSettings);
    const slicePageAccountSettingsStateData = new AccountSettingsPageModel(slicePageAccountSettingsState.data);
    const slicePageAccountSettingsStateResponse = new ResponseModel(slicePageAccountSettingsState.response);
    const [pageAccountSettingsState, setPageAccountSettingsState] = useState<IPageAccountSettingsState>({
        deactivateAccount: {
            isModalOpen: false,
            confirmPasswordValue: '',
            isError: false,
            errorMessage: '',
            isShowConfirmPasswordValue: false,
        },
        changePassword: {
            isModalOpen: false,
            currentPasswordValue: '',
            isShowCurrentPasswordValue: false,
            newPasswordValue: '',
            isShowNewPasswordValue: false,
            newPasswordConfirmedValue: '',
            isShowNewPasswordConfirmedValue: false,
            isError: false,
            errorMessage: '',
            isSuccess: false,
        },
        advancedSettings: {
            isShow: false,
        },
    });

    // const slicePageAccountSettingsStateResponse = new ResponseModel(slicePageAccountSettingsState.response);

    const setPageAccountSettingsStateData = async (): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetAccountSettingsPage',
                {},
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(slicePageAccountSettingsActions.setStateDataInitial(response.data));
        } catch (e: any) {
            dispatch(slicePageAccountSettingsActions.setStateResponseError(e?.response?.data?.message));
        }
    };

    useEffect(() => {
        void dispatch(sliceHeaderActiveTabActions.setStateData(Constants.HEADER_ACTIVE_TAB_IDX__PAGE_ACCOUNT_SETTINGS));
        void setPageAccountSettingsStateData();
        // eslint-disable-next-line
    }, []);

    const isErrorEmail = !Constants.REGEX_USER_EMAIL.test(slicePageAccountSettingsState.email);
    const isErrorChangePassword =
        pageAccountSettingsState.changePassword.newPasswordValue !==
            pageAccountSettingsState.changePassword.newPasswordConfirmedValue ||
        pageAccountSettingsState.changePassword.newPasswordValue.length < Constants.USER_PASSWORD_MIN_LENGTH_CHARACTERS;
    return (
        <Box
            sx={{
                background: THEME.palette.other.gradient,
                minHeight: '100vh',
            }}
        >
            <Grid container direction="column" sx={{ display: 'flex', justifyContent: 'center' }}>
                <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                    <AvatarImageEditor
                        imageUploadHandler={async (imageAsBase64String: string) => {
                            try {
                                const response = await ResourceClient.postResource(
                                    'api/app/UpdateAccountSettingsPage',
                                    {
                                        imageAsBase64String: getInputText(imageAsBase64String),
                                    },
                                    sliceAuthenticationStateData.getJwtToken(),
                                );
                                dispatch(slicePageAccountSettingsActions.setStateData(response.data));
                            } catch (e: any) {}
                        }}
                        imageLink={slicePageAccountSettingsStateData.getImageLink()}
                        placeholderImage={PlaceholderImageUser}
                        isReadOnly={false}
                    />
                </Grid>
                <Grid item sx={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <Typography variant="h6">
                        <Link to={`/profiles/${String(slicePageAccountSettingsStateData.getId())}`}>
                            {`@${slicePageAccountSettingsStateData.getUsername()}`}
                        </Link>
                    </Typography>
                </Grid>
                <Grid item sx={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                    <Grid container direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Grid
                            item
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: '12px',
                                width: '200px',
                            }}
                        >
                            <Typography variant="h5">Select Time Zone:</Typography>
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Select
                                labelId="select-time-zone-account-setting-label-id"
                                id="select-time-zone-account-setting-id"
                                value={slicePageAccountSettingsState.timeZone}
                                label="Time Zone"
                                /* eslint-disable @typescript-eslint/no-misused-promises */
                                onChange={(event: any) => {
                                    dispatch(slicePageAccountSettingsActions.setStateResponseUnstarted());

                                    dispatch(slicePageAccountSettingsActions.setTimeZone(event.target.value));
                                }}
                                sx={{ width: '300px' }}
                            >
                                {Constants.TIME_ZONE_CHOICES.map((timeZone: string, idx: number) => (
                                    <MenuItem key={`${idx}_${timeZone}`} value={timeZone}>
                                        {timeZone}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sx={{ display: 'flex', justifyContent: 'center', marginBottom: '36px' }}>
                    <Grid container direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Grid
                            item
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: '12px',
                                width: '200px',
                            }}
                        >
                            <Typography variant="h5">Email:</Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                onChange={(event: any) => {
                                    dispatch(slicePageAccountSettingsActions.setStateResponseUnstarted());
                                    dispatch(slicePageAccountSettingsActions.setEmail(event.target.value));
                                }}
                                value={slicePageAccountSettingsState.email}
                                error={isErrorEmail}
                                sx={{ width: '300px' }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                {slicePageAccountSettingsStateResponse.getIsSuccess() ? (
                    <Grid item sx={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <Alert severity="success">Your changes have been saved.</Alert>
                    </Grid>
                ) : null}
                <Grid item>
                    <Grid
                        container
                        direction="row"
                        sx={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}
                    >
                        <Grid item sx={{ marginRight: '24px' }}>
                            <Button
                                variant="contained"
                                disabled={isErrorEmail}
                                /* eslint-disable @typescript-eslint/no-misused-promises */
                                onClick={async () => {
                                    const response = await ResourceClient.postResource(
                                        'api/app/UpdateAccountSettingsPage',
                                        {
                                            timeZone: slicePageAccountSettingsState.timeZone,
                                            email: slicePageAccountSettingsState.email,
                                        },
                                        sliceAuthenticationStateData.getJwtToken(),
                                    );
                                    dispatch(slicePageAccountSettingsActions.setStateData(response.data));
                                }}
                                sx={{ width: '200px' }}
                            >
                                Save Changes
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    dispatch(sliceAuthenticationActions.clearStateData());
                                    navigate('/');
                                }}
                                color="warning"
                                sx={{ width: '200px' }}
                            >
                                Logout
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sx={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    {!pageAccountSettingsState.advancedSettings.isShow ? (
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none', padding: '0px' }}
                            onClick={() => {
                                setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                    return {
                                        ...prevState,
                                        advancedSettings: { ...prevState.advancedSettings, isShow: true },
                                    };
                                });
                            }}
                        >
                            Show advanced options
                        </Button>
                    ) : (
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none', padding: '0px' }}
                            onClick={() => {
                                setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                    return {
                                        ...prevState,
                                        advancedSettings: { ...prevState.advancedSettings, isShow: false },
                                    };
                                });
                            }}
                        >
                            Hide advanced options
                        </Button>
                    )}
                </Grid>
                {pageAccountSettingsState.advancedSettings.isShow ? (
                    <React.Fragment>
                        <Grid item sx={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                        return {
                                            ...prevState,
                                            changePassword: {
                                                ...prevState.changePassword,
                                                isModalOpen: true,
                                            },
                                        };
                                    });
                                }}
                                sx={{ width: '200px' }}
                            >
                                Change Password
                            </Button>
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                        return {
                                            ...prevState,
                                            deactivateAccount: {
                                                ...prevState.deactivateAccount,
                                                isModalOpen: true,
                                            },
                                        };
                                    });
                                }}
                                color="error"
                                sx={{ width: '200px' }}
                            >
                                Deactivate Account
                            </Button>
                        </Grid>
                    </React.Fragment>
                ) : null}
            </Grid>
            <Dialog
                open={pageAccountSettingsState.deactivateAccount.isModalOpen}
                onClose={() => {
                    setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                        return {
                            ...prevState,
                            deactivateAccount: {
                                ...prevState.deactivateAccount,
                                isModalOpen: false,
                                isError: false,
                                errorMessage: '',
                            },
                        };
                    });
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{`Are you sure you would like to deactivate your account? This is irreversible!`}</DialogContentText>
                    <DialogContentText id="alert-dialog-description">{`Please enter your password to confirm.`}</DialogContentText>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '12px', marginBottom: '12px' }}>
                        <TextField
                            value={pageAccountSettingsState.deactivateAccount.confirmPasswordValue}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                    return {
                                        ...prevState,
                                        deactivateAccount: {
                                            ...prevState.deactivateAccount,
                                            isError: false,
                                            errorMessage: '',
                                            confirmPasswordValue: event.target.value,
                                        },
                                    };
                                });
                            }}
                            fullWidth
                            type={
                                pageAccountSettingsState.deactivateAccount.isShowConfirmPasswordValue
                                    ? 'text'
                                    : 'password'
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => {
                                                setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                                    return {
                                                        ...prevState,
                                                        deactivateAccount: {
                                                            ...prevState.deactivateAccount,
                                                            isShowConfirmPasswordValue:
                                                                !prevState.deactivateAccount.isShowConfirmPasswordValue,
                                                        },
                                                    };
                                                });
                                            }}
                                            onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                event.preventDefault();
                                            }}
                                            edge="end"
                                        >
                                            {pageAccountSettingsState.deactivateAccount.isShowConfirmPasswordValue ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    {pageAccountSettingsState.deactivateAccount.isError ? (
                        pageAccountSettingsState.deactivateAccount.errorMessage === 'INCORRECT_PASSWORD' ? (
                            <Alert severity="error">Incorrect password. Please try again.</Alert>
                        ) : (
                            <Alert severity="error">
                                There was an issue in deactivating the account. Please try again.
                            </Alert>
                        )
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                return {
                                    ...prevState,
                                    deactivateAccount: {
                                        ...prevState.deactivateAccount,
                                        isError: false,
                                        errorMessage: '',
                                        isModalOpen: false,
                                    },
                                };
                            });
                        }}
                        autoFocus
                    >
                        Close
                    </Button>
                    <Button
                        /* eslint-disable @typescript-eslint/no-misused-promises */
                        onClick={async () => {
                            try {
                                await ResourceClient.postResource(
                                    'api/app/DeleteAccount',
                                    { password: pageAccountSettingsState.deactivateAccount.confirmPasswordValue },
                                    sliceAuthenticationStateData.getJwtToken(),
                                );
                                navigate('/');
                            } catch (e: any) {
                                setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                    // done
                                    return {
                                        ...prevState,
                                        deactivateAccount: {
                                            ...prevState.deactivateAccount,
                                            isError: true,
                                            errorMessage: e?.response?.data?.message,
                                        },
                                    };
                                });
                            }
                        }}
                        color="error"
                        disabled={pageAccountSettingsState.deactivateAccount.confirmPasswordValue.length === 0}
                    >
                        Deactivate
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                // here
                open={pageAccountSettingsState.changePassword.isModalOpen}
                onClose={() => {
                    setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                        return {
                            ...prevState,
                            changePassword: {
                                ...prevState.changePassword,
                                isModalOpen: false,
                                currentPasswordValue: '',
                                isShowCurrentPasswordValue: false,
                                newPasswordValue: '',
                                isShowNewPasswordValue: false,
                                newPasswordConfirmedValue: '',
                                isShowNewPasswordConfirmedValue: false,
                                isError: false,
                                errorMessage: '',
                                isSuccess: false,
                            },
                        };
                    });
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{`Please enter the following information to confirm your changes:`}</DialogContentText>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '12px', marginBottom: '12px' }}>
                        <TextField
                            value={pageAccountSettingsState.changePassword.currentPasswordValue}
                            label="Current password"
                            required
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                    return {
                                        ...prevState,
                                        changePassword: {
                                            ...prevState.changePassword,
                                            currentPasswordValue: event.target.value,
                                            isError: false,
                                            errorMessage: '',
                                        },
                                    };
                                });
                            }}
                            fullWidth
                            type={
                                pageAccountSettingsState.changePassword.isShowCurrentPasswordValue ? 'text' : 'password'
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => {
                                                setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                                    return {
                                                        ...prevState,
                                                        changePassword: {
                                                            ...prevState.changePassword,
                                                            isShowCurrentPasswordValue:
                                                                !prevState.changePassword.isShowCurrentPasswordValue,
                                                        },
                                                    };
                                                });
                                            }}
                                            onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                event.preventDefault();
                                            }}
                                            edge="end"
                                        >
                                            {pageAccountSettingsState.changePassword.isShowCurrentPasswordValue ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '12px', marginBottom: '12px' }}>
                        <TextField
                            value={pageAccountSettingsState.changePassword.newPasswordValue}
                            label="New password"
                            required
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                    return {
                                        ...prevState,
                                        changePassword: {
                                            ...prevState.changePassword,
                                            newPasswordValue: event.target.value,
                                            isError: false,
                                            errorMessage: '',
                                        },
                                    };
                                });
                            }}
                            fullWidth
                            type={pageAccountSettingsState.changePassword.isShowNewPasswordValue ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => {
                                                setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                                    return {
                                                        ...prevState,
                                                        changePassword: {
                                                            ...prevState.changePassword,
                                                            isShowNewPasswordValue:
                                                                !prevState.changePassword.isShowNewPasswordValue,
                                                        },
                                                    };
                                                });
                                            }}
                                            onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                event.preventDefault();
                                            }}
                                            edge="end"
                                        >
                                            {pageAccountSettingsState.changePassword.isShowNewPasswordValue ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '12px', marginBottom: '12px' }}>
                        <TextField
                            value={pageAccountSettingsState.changePassword.newPasswordConfirmedValue}
                            label="New password confirmed"
                            required
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                    return {
                                        ...prevState,
                                        changePassword: {
                                            ...prevState.changePassword,
                                            newPasswordConfirmedValue: event.target.value,
                                            isError: false,
                                            errorMessage: '',
                                        },
                                    };
                                });
                            }}
                            fullWidth
                            type={
                                pageAccountSettingsState.changePassword.isShowNewPasswordConfirmedValue
                                    ? 'text'
                                    : 'password'
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => {
                                                setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                                    return {
                                                        ...prevState,
                                                        changePassword: {
                                                            ...prevState.changePassword,
                                                            isShowNewPasswordConfirmedValue:
                                                                !prevState.changePassword
                                                                    .isShowNewPasswordConfirmedValue,
                                                        },
                                                    };
                                                });
                                            }}
                                            onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                event.preventDefault();
                                            }}
                                            edge="end"
                                        >
                                            {pageAccountSettingsState.changePassword.isShowNewPasswordConfirmedValue ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    {pageAccountSettingsState.changePassword.isSuccess ? (
                        <Alert severity="success">Your password has been successfully changed.</Alert>
                    ) : null}
                    {pageAccountSettingsState.changePassword.isError ? (
                        pageAccountSettingsState.changePassword.errorMessage === 'INCORRECT_CURRENT_PASSWORD' ? (
                            <Alert severity="error">Incorrect current password. Please try again.</Alert>
                        ) : (
                            <Alert severity="error">
                                There was an issue in changing your password. Please try again.
                            </Alert>
                        )
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                return {
                                    ...prevState,
                                    changePassword: {
                                        ...prevState.changePassword,
                                        isModalOpen: false,
                                        currentPasswordValue: '',
                                        isShowCurrentPasswordValue: false,
                                        newPasswordValue: '',
                                        isShowNewPasswordValue: false,
                                        newPasswordConfirmedValue: '',
                                        isShowNewPasswordConfirmedValue: false,
                                        isError: false,
                                        errorMessage: '',
                                        isSuccess: false,
                                    },
                                };
                            });
                        }}
                        autoFocus
                    >
                        Close
                    </Button>
                    <Button
                        /* eslint-disable @typescript-eslint/no-misused-promises */
                        onClick={async () => {
                            try {
                                await ResourceClient.postResource(
                                    'api/app/ChangePassword',
                                    {
                                        currentPassword: pageAccountSettingsState.changePassword.currentPasswordValue,
                                        newPassword: pageAccountSettingsState.changePassword.newPasswordValue,
                                        newPasswordConfirmed:
                                            pageAccountSettingsState.changePassword.newPasswordConfirmedValue,
                                    },
                                    sliceAuthenticationStateData.getJwtToken(),
                                );
                                setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                    return {
                                        ...prevState,
                                        changePassword: {
                                            ...prevState.changePassword,
                                            currentPasswordValue: '',
                                            isShowCurrentPasswordValue: false,
                                            newPasswordValue: '',
                                            isShowNewPasswordValue: false,
                                            newPasswordConfirmedValue: '',
                                            isShowNewPasswordConfirmedValue: false,
                                            isError: false,
                                            errorMessage: '',
                                            isSuccess: true,
                                        },
                                    };
                                });
                            } catch (e: any) {
                                setPageAccountSettingsState((prevState: IPageAccountSettingsState) => {
                                    return {
                                        ...prevState,
                                        changePassword: {
                                            ...prevState.changePassword,
                                            isError: true,
                                            errorMessage: e?.response?.data?.message,
                                        },
                                    };
                                });
                            }
                        }}
                        disabled={isErrorChangePassword}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PageAccountSettings;
