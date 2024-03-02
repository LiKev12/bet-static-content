import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Box, Button, FormControl, TextField, Grid, InputAdornment, IconButton } from '@mui/material';
import { getInputText } from 'src/javascripts/utilities';
import { THEME } from 'src/javascripts/Theme';
import Constants from 'src/javascripts/Constants';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ResourceClient from 'src/javascripts/clients/ResourceClient';

export interface IForgotPasswordFormState {
    usernameValue: string;
    emailValue: string;
    secretCodeValue: string;
    newPasswordValue: string;
    isShowNewPasswordValue: boolean;
    newPasswordConfirmedValue: string;
    isShowNewPasswordConfirmedValue: boolean;
    submitUsernameEmailResponseIsSuccess: boolean;
    submitUsernameEmailResponseIsError: boolean;
    submitUsernameEmailResponseErrorMessage: string;
    submitNewPasswordResponseIsSuccess: boolean;
    submitNewPasswordResponseIsError: boolean;
    submitNewPasswordResponseErrorMessage: string;
}

export interface IForgotPasswordFormProps {
    handleBackToLogin: any;
}

const DEFAULT_STATE = (): IForgotPasswordFormState => {
    return {
        usernameValue: '',
        emailValue: '',
        secretCodeValue: '',
        newPasswordValue: '',
        isShowNewPasswordValue: false,
        newPasswordConfirmedValue: '',
        isShowNewPasswordConfirmedValue: false,
        submitUsernameEmailResponseIsSuccess: false,
        submitUsernameEmailResponseIsError: false,
        submitUsernameEmailResponseErrorMessage: '',
        submitNewPasswordResponseIsSuccess: false,
        submitNewPasswordResponseIsError: false,
        submitNewPasswordResponseErrorMessage: '',
    };
};

const ForgotPasswordForm: React.FC<IForgotPasswordFormProps> = (props: IForgotPasswordFormProps) => {
    const { handleBackToLogin } = props;
    const [forgotPasswordFormState, setForgotPasswordFormState] = useState<IForgotPasswordFormState>(DEFAULT_STATE());

    const isErrorEmail = !Constants.REGEX_USER_EMAIL.test(forgotPasswordFormState.emailValue);
    const isDisabledGetCode =
        forgotPasswordFormState.usernameValue.length === 0 ||
        forgotPasswordFormState.emailValue.length === 0 ||
        isErrorEmail;

    const isDisabledSubmitNewPassword =
        forgotPasswordFormState.secretCodeValue.length < Constants.FORGOT_PASSWORD_SECRET_CODE_LENGTH_CHARACTERS ||
        forgotPasswordFormState.newPasswordValue.length < Constants.USER_PASSWORD_MIN_LENGTH_CHARACTERS ||
        forgotPasswordFormState.newPasswordValue !== forgotPasswordFormState.newPasswordConfirmedValue;

    if (forgotPasswordFormState.submitUsernameEmailResponseIsSuccess) {
        return (
            <FormControl>
                <Grid direction="column" container spacing={2}>
                    <Grid item sx={{ marginBottom: '6px' }}>
                        <TextField
                            id="forgot-password-secret-code"
                            label="Secret Code"
                            type="text"
                            required
                            value={forgotPasswordFormState.secretCodeValue}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setForgotPasswordFormState((prevState: IForgotPasswordFormState) => {
                                    return {
                                        ...prevState,
                                        secretCodeValue: event.target.value,
                                    };
                                });
                            }}
                            sx={{ width: '316px' }}
                        />
                    </Grid>
                    <Grid item sx={{ marginBottom: '6px' }}>
                        <TextField
                            id="forgot-password-new-password"
                            label="New password"
                            type={forgotPasswordFormState.isShowNewPasswordValue ? 'text' : 'password'}
                            required
                            value={forgotPasswordFormState.newPasswordValue}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setForgotPasswordFormState((prevState: IForgotPasswordFormState) => {
                                    return {
                                        ...prevState,
                                        newPasswordValue: event.target.value,
                                    };
                                });
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => {
                                                setForgotPasswordFormState((prevState: IForgotPasswordFormState) => {
                                                    return {
                                                        ...prevState,
                                                        isShowNewPasswordValue: !prevState.isShowNewPasswordValue,
                                                    };
                                                });
                                            }}
                                            onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                event.preventDefault();
                                            }}
                                            edge="end"
                                        >
                                            {forgotPasswordFormState.isShowNewPasswordValue ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            helperText={
                                getInputText(forgotPasswordFormState.newPasswordValue).length > 0
                                    ? Constants.USER_SIGN_UP_INPUT_PASSWORD_HELPER_TEXT(
                                          getInputText(forgotPasswordFormState.newPasswordValue).length,
                                      )
                                    : null
                            }
                            sx={{ width: '316px' }}
                        />
                    </Grid>
                    <Grid item sx={{ marginBottom: '6px' }}>
                        <TextField
                            id="forgot-password-new-password-confirmed"
                            label="Confirm new password"
                            type={forgotPasswordFormState.isShowNewPasswordConfirmedValue ? 'text' : 'password'}
                            required
                            value={forgotPasswordFormState.newPasswordConfirmedValue}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setForgotPasswordFormState((prevState: IForgotPasswordFormState) => {
                                    return {
                                        ...prevState,
                                        newPasswordConfirmedValue: event.target.value,
                                    };
                                });
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => {
                                                setForgotPasswordFormState((prevState: IForgotPasswordFormState) => {
                                                    return {
                                                        ...prevState,
                                                        isShowNewPasswordConfirmedValue:
                                                            !prevState.isShowNewPasswordConfirmedValue,
                                                    };
                                                });
                                            }}
                                            onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                event.preventDefault();
                                            }}
                                            edge="end"
                                        >
                                            {forgotPasswordFormState.isShowNewPasswordConfirmedValue ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            helperText={
                                getInputText(forgotPasswordFormState.newPasswordConfirmedValue).length > 0
                                    ? Constants.USER_SIGN_UP_INPUT_PASSWORD_HELPER_TEXT(
                                          getInputText(forgotPasswordFormState.newPasswordConfirmedValue).length,
                                      )
                                    : null
                            }
                            sx={{ width: '316px' }}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            /* eslint-disable @typescript-eslint/no-misused-promises */
                            onClick={async () => {
                                try {
                                    await ResourceClient.postResourceUnauthenticated('api/auth/ResetPassword', {
                                        username: forgotPasswordFormState.usernameValue,
                                        secretCode: forgotPasswordFormState.secretCodeValue,
                                        newPassword: forgotPasswordFormState.newPasswordValue,
                                        newPasswordConfirmed: forgotPasswordFormState.newPasswordConfirmedValue,
                                    });
                                    setForgotPasswordFormState((prevState: IForgotPasswordFormState) => {
                                        return {
                                            ...prevState,
                                            submitNewPasswordResponseIsSuccess: true,
                                            submitNewPasswordResponseIsError: false,
                                            submitNewPasswordResponseErrorMessage: '',
                                        };
                                    });
                                } catch (e: any) {
                                    setForgotPasswordFormState((prevState: IForgotPasswordFormState) => {
                                        return {
                                            ...prevState,
                                            submitNewPasswordResponseIsSuccess: false,
                                            submitNewPasswordResponseIsError: true,
                                            submitNewPasswordResponseErrorMessage: e?.response?.data?.message,
                                        };
                                    });
                                }
                            }}
                            disabled={isDisabledSubmitNewPassword}
                            variant="contained"
                            fullWidth
                        >
                            Reset Password
                        </Button>
                    </Grid>
                    {forgotPasswordFormState.submitNewPasswordResponseIsSuccess ? (
                        <Grid item sx={{ width: '316px' }}>
                            <Alert severity="success">
                                Reset success. Go{' '}
                                <Link
                                    onClick={() => {
                                        setForgotPasswordFormState(DEFAULT_STATE());
                                        handleBackToLogin();
                                    }}
                                    to="/"
                                >
                                    back
                                </Link>{' '}
                                to login.
                            </Alert>
                        </Grid>
                    ) : null}
                    {forgotPasswordFormState.submitNewPasswordResponseIsError ? (
                        forgotPasswordFormState.submitNewPasswordResponseErrorMessage === 'INCORRECT_SECRET_CODE' ? (
                            <Grid item sx={{ width: '316px' }}>
                                <Alert severity="error">Incorrect code. Please try again.</Alert>
                            </Grid>
                        ) : (
                            <Grid item sx={{ width: '316px' }}>
                                <Alert severity="error">
                                    There was an issue with resetting your password. Please try again.
                                </Alert>
                            </Grid>
                        )
                    ) : null}
                </Grid>
            </FormControl>
        );
    }
    return (
        <FormControl>
            <Grid direction="column" container spacing={2}>
                <Grid item>
                    <Box
                        sx={{
                            fontFamily: 'Raleway',
                            color: THEME.palette.grey.A700,
                            backgroundColor: THEME.palette.grey.A200,
                            padding: '16px',
                            borderRadius: '16px',
                        }}
                    >
                        Request email code or go{' '}
                        <Link
                            onClick={() => {
                                setForgotPasswordFormState(DEFAULT_STATE);

                                handleBackToLogin();
                            }}
                            to="/"
                        >
                            back
                        </Link>{' '}
                        to login
                    </Box>
                </Grid>
                <Grid item sx={{ marginBottom: '6px' }}>
                    <TextField
                        id="login-username"
                        label="Username"
                        type="text"
                        required
                        value={forgotPasswordFormState.usernameValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setForgotPasswordFormState((prevState: IForgotPasswordFormState) => {
                                return {
                                    ...prevState,
                                    usernameValue: event.target.value,
                                };
                            });
                        }}
                        sx={{ width: '316px' }}
                    />
                </Grid>
                <Grid item sx={{ marginBottom: '6px' }}>
                    <TextField
                        id="sign-up-email"
                        label="Email"
                        type="email"
                        required
                        value={forgotPasswordFormState.emailValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setForgotPasswordFormState((prevState: IForgotPasswordFormState) => {
                                return {
                                    ...prevState,
                                    emailValue: event.target.value,
                                };
                            });
                        }}
                        error={isErrorEmail}
                        sx={{ width: '316px' }}
                    />
                </Grid>
                <Grid item>
                    <Button
                        /* eslint-disable @typescript-eslint/no-misused-promises */
                        onClick={async () => {
                            try {
                                await ResourceClient.postResourceUnauthenticated('api/auth/GetForgotPasswordCode', {
                                    username: forgotPasswordFormState.usernameValue,
                                    email: forgotPasswordFormState.emailValue,
                                });
                                setForgotPasswordFormState((prevState: IForgotPasswordFormState) => {
                                    return {
                                        ...prevState,
                                        submitUsernameEmailResponseIsSuccess: true,
                                        submitUsernameEmailResponseIsError: false,
                                        submitUsernameEmailResponseErrorMessage: '',
                                    };
                                });
                            } catch (e: any) {
                                setForgotPasswordFormState((prevState: IForgotPasswordFormState) => {
                                    return {
                                        ...prevState,
                                        submitUsernameEmailResponseIsSuccess: false,
                                        submitUsernameEmailResponseIsError: true,
                                        submitUsernameEmailResponseErrorMessage: e?.response?.data?.message,
                                    };
                                });
                            }
                        }}
                        disabled={isDisabledGetCode}
                        variant="contained"
                        fullWidth
                    >
                        Request Code
                    </Button>
                </Grid>
                {forgotPasswordFormState.submitUsernameEmailResponseIsError ? (
                    forgotPasswordFormState.submitUsernameEmailResponseErrorMessage ===
                    'INVALID_USERNAME_EMAIL_COMBINATION' ? (
                        <Grid item sx={{ width: '316px' }}>
                            <Alert severity="error">
                                No combination of username and email found. Please ensure info is correct.
                            </Alert>
                        </Grid>
                    ) : forgotPasswordFormState.submitUsernameEmailResponseErrorMessage ===
                      'ALREADY_SENT_FORGOT_PASSWORD_CODE' ? (
                        <Grid item sx={{ width: '316px' }}>
                            <Alert severity="error">
                                You recently requested a code. Please wait 5 minutes before trying again.
                            </Alert>
                        </Grid>
                    ) : (
                        <Grid item sx={{ width: '316px' }}>
                            <Alert severity="error">There was an issue requesting a code. Please try again.</Alert>
                        </Grid>
                    )
                ) : null}
            </Grid>
        </FormControl>
    );
};

export default ForgotPasswordForm;
