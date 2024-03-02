import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Box, Button, FormControl, TextField, Grid } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import Constants from 'src/javascripts/Constants';
import ResourceClient from 'src/javascripts/clients/ResourceClient';

export interface IForgotUsernameFormState {
    emailValue: string;
    submitEmailResponseIsSuccess: boolean;
    submitEmailResponseIsError: boolean;
    submitEmailResponseErrorMessage: string;
}
export interface IForgotUsernameFormProps {
    handleBackToLogin: any;
}
const DEFAULT_STATE = (): IForgotUsernameFormState => {
    return {
        emailValue: '',
        submitEmailResponseIsSuccess: false,
        submitEmailResponseIsError: false,
        submitEmailResponseErrorMessage: '',
    };
};
const ForgotUsernameForm: React.FC<IForgotUsernameFormProps> = (props: IForgotUsernameFormProps) => {
    const { handleBackToLogin } = props;
    const [forgotUsernameFormState, setForgotUsernameFormState] = useState<IForgotUsernameFormState>(DEFAULT_STATE());

    const isErrorEmail = !Constants.REGEX_USER_EMAIL.test(forgotUsernameFormState.emailValue);
    const isDisabledGetUsername = forgotUsernameFormState.emailValue.length === 0;
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
                        Request username or go{' '}
                        <Link
                            onClick={() => {
                                setForgotUsernameFormState(DEFAULT_STATE());
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
                        id="forgot-email"
                        label="Email"
                        type="email"
                        required
                        value={forgotUsernameFormState.emailValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setForgotUsernameFormState((prevState: IForgotUsernameFormState) => {
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
                                await ResourceClient.postResourceUnauthenticated('api/auth/GetForgottenUsername', {
                                    email: forgotUsernameFormState.emailValue,
                                });
                                setForgotUsernameFormState((prevState: IForgotUsernameFormState) => {
                                    return {
                                        ...prevState,
                                        submitEmailResponseIsSuccess: true,
                                        submitEmailResponseIsError: false,
                                        submitEmailResponseErrorMessage: '',
                                    };
                                });
                            } catch (e: any) {
                                setForgotUsernameFormState((prevState: IForgotUsernameFormState) => {
                                    return {
                                        ...prevState,
                                        submitEmailResponseIsSuccess: false,
                                        submitEmailResponseIsError: true,
                                        submitEmailResponseErrorMessage: e?.response?.data?.message,
                                    };
                                });
                            }
                        }}
                        disabled={isDisabledGetUsername}
                        variant="contained"
                        fullWidth
                    >
                        Request Username
                    </Button>
                </Grid>
                {forgotUsernameFormState.submitEmailResponseIsError ? (
                    <Grid item sx={{ width: '316px' }}>
                        <Alert severity="error">There was an issue requesting username. Please try again.</Alert>
                    </Grid>
                ) : null}
                {forgotUsernameFormState.submitEmailResponseIsSuccess ? (
                    <Grid item sx={{ width: '316px' }}>
                        <Alert severity="success">
                            Username sent to email. Go{' '}
                            <Link
                                onClick={() => {
                                    setForgotUsernameFormState(DEFAULT_STATE);
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
            </Grid>
        </FormControl>
    );
};

export default ForgotUsernameForm;
