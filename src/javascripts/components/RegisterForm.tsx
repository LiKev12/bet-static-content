import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, FormControl, TextField, Grid, InputAdornment, IconButton } from '@mui/material';
import Constants from 'src/javascripts/Constants';
import { getInputText } from 'src/javascripts/utilities';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { sliceAuthenticationActions } from 'src/javascripts/store/SliceAuthentication';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import ResponseModel from 'src/javascripts/models/ResponseModel';

import type { IRootState } from 'src/javascripts/store';
export interface IRegisterFormState {
    data: {
        username: { value: string; isBlurredInput: boolean };
        name: { value: string; isBlurredInput: boolean };
        email: { value: string; isBlurredInput: boolean };
        password: { value: string; isBlurredInput: boolean; isShowVisible: boolean };
        passwordConfirmed: { value: string; isBlurredInput: boolean; isShowVisible: boolean };
    };
    response: {
        state: string;
        errorMessage: string | null;
    };
}
const RegisterForm: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateResponse = new ResponseModel(sliceAuthenticationState.response);
    const [registerFormState, setRegisterFormState] = useState<IRegisterFormState>({
        data: {
            username: { value: '', isBlurredInput: false },
            name: { value: '', isBlurredInput: false },
            email: { value: '', isBlurredInput: false },
            password: { value: '', isBlurredInput: false, isShowVisible: false },
            passwordConfirmed: { value: '', isBlurredInput: false, isShowVisible: false },
        },
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    });

    const handleOnSubmitSignUp = async (): Promise<any> => {
        try {
            dispatch(sliceAuthenticationActions.setStateResponseLoading());
            const response = await ResourceClient.postResourceUnauthenticated('api/auth/Register', {
                username: getInputText(registerFormState.data.username.value),
                name: getInputText(registerFormState.data.name.value),
                email: getInputText(registerFormState.data.email.value),
                password: registerFormState.data.password.value,
                passwordConfirmed: registerFormState.data.passwordConfirmed.value,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            });
            dispatch(sliceAuthenticationActions.setStateData(response.data));
            navigate('/me');
        } catch (e: any) {
            dispatch(sliceAuthenticationActions.setStateResponseError(e?.response?.data?.message));
        }
    };

    const isErrorUsername =
        registerFormState.data.username.isBlurredInput &&
        (getInputText(registerFormState.data.username.value).length < Constants.USER_USERNAME_MIN_LENGTH_CHARACTERS ||
            getInputText(registerFormState.data.username.value).length >
                Constants.USER_USERNAME_MAX_LENGTH_CHARACTERS ||
            !Constants.REGEX_USER_USERNAME.test(registerFormState.data.username.value));
    const isErrorName =
        (registerFormState.data.name.isBlurredInput &&
            getInputText(registerFormState.data.name.value).length < Constants.USER_USERNAME_MIN_LENGTH_CHARACTERS) ||
        getInputText(registerFormState.data.name.value).length > Constants.USER_USERNAME_MAX_LENGTH_CHARACTERS;
    const isErrorEmail =
        registerFormState.data.email.isBlurredInput &&
        !Constants.REGEX_USER_EMAIL.test(registerFormState.data.email.value);
    const isErrorPassword =
        registerFormState.data.password.isBlurredInput &&
        registerFormState.data.password.value.length < Constants.USER_PASSWORD_MIN_LENGTH_CHARACTERS;
    const isErrorPasswordConfirmed =
        registerFormState.data.passwordConfirmed.isBlurredInput &&
        registerFormState.data.password.value !== registerFormState.data.passwordConfirmed.value;

    const isErrorRegisterForm =
        isErrorUsername || isErrorName || isErrorEmail || isErrorPassword || isErrorPasswordConfirmed;

    return (
        <FormControl
            onSubmit={() => {
                void handleOnSubmitSignUp();
            }}
        >
            <Grid direction="column" container spacing={2}>
                <Grid item sx={{ marginBottom: '6px' }}>
                    <TextField
                        id="sign-up-username"
                        label="Username"
                        type="text"
                        required
                        value={registerFormState.data.username.value}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setRegisterFormState((prevState: IRegisterFormState) => {
                                return {
                                    ...prevState,
                                    data: {
                                        ...prevState.data,
                                        username: {
                                            ...prevState.data.username,
                                            isBlurredInput: true,
                                            value: event.target.value,
                                        },
                                    },
                                };
                            });
                        }}
                        helperText={
                            getInputText(registerFormState.data.username.value).length > 0
                                ? Constants.USER_SIGN_UP_INPUT_USERNAME_HELPER_TEXT(
                                      getInputText(registerFormState.data.username.value).length,
                                  )
                                : null
                        }
                        error={isErrorUsername}
                        sx={{ width: '316px' }}
                    />
                </Grid>
                <Grid item sx={{ marginBottom: '6px' }}>
                    <TextField
                        id="sign-up-name"
                        label="Name"
                        type="text"
                        required
                        value={registerFormState.data.name.value}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setRegisterFormState((prevState: IRegisterFormState) => {
                                return {
                                    ...prevState,
                                    data: {
                                        ...prevState.data,
                                        name: {
                                            ...prevState.data.name,
                                            isBlurredInput: true,
                                            value: event.target.value,
                                        },
                                    },
                                };
                            });
                        }}
                        helperText={
                            getInputText(registerFormState.data.name.value).length > 0
                                ? Constants.USER_SIGN_UP_INPUT_NAME_HELPER_TEXT(
                                      getInputText(registerFormState.data.name.value).length,
                                  )
                                : null
                        }
                        error={isErrorName}
                        sx={{ width: '316px' }}
                    />
                </Grid>
                <Grid item sx={{ marginBottom: '6px' }}>
                    <TextField
                        id="sign-up-email"
                        label="Email"
                        type="email"
                        required
                        value={registerFormState.data.email.value}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setRegisterFormState((prevState: IRegisterFormState) => {
                                return {
                                    ...prevState,
                                    data: {
                                        ...prevState.data,
                                        email: {
                                            ...prevState.data.email,
                                            isBlurredInput: true,
                                            value: event.target.value,
                                        },
                                    },
                                };
                            });
                        }}
                        error={isErrorEmail}
                        sx={{ width: '316px' }}
                    />
                </Grid>
                <Grid item sx={{ marginBottom: '6px' }}>
                    <TextField
                        id="sign-up-password"
                        label="Password"
                        type={registerFormState.data.password.isShowVisible ? 'text' : 'password'}
                        required
                        value={registerFormState.data.password.value}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setRegisterFormState((prevState: IRegisterFormState) => {
                                return {
                                    ...prevState,
                                    data: {
                                        ...prevState.data,
                                        password: {
                                            ...prevState.data.password,
                                            isBlurredInput: true,
                                            value: event.target.value,
                                        },
                                    },
                                };
                            });
                        }}
                        helperText={
                            getInputText(registerFormState.data.password.value).length > 0
                                ? Constants.USER_SIGN_UP_INPUT_PASSWORD_HELPER_TEXT(
                                      getInputText(registerFormState.data.password.value).length,
                                  )
                                : null
                        }
                        error={isErrorPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => {
                                            setRegisterFormState((prevState: IRegisterFormState) => {
                                                return {
                                                    ...prevState,
                                                    data: {
                                                        ...prevState.data,
                                                        password: {
                                                            ...prevState.data.password,
                                                            isShowVisible: !prevState.data.password.isShowVisible,
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                                            event.preventDefault();
                                        }}
                                        edge="end"
                                    >
                                        {registerFormState.data.password.isShowVisible ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: '316px' }}
                    />
                </Grid>
                <Grid item sx={{ marginBottom: '6px' }}>
                    <TextField
                        id="sign-up-password-confirmed"
                        label="Confirm password"
                        type={registerFormState.data.passwordConfirmed.isShowVisible ? 'text' : 'password'}
                        required
                        value={registerFormState.data.passwordConfirmed.value}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setRegisterFormState((prevState: IRegisterFormState) => {
                                return {
                                    ...prevState,
                                    data: {
                                        ...prevState.data,
                                        passwordConfirmed: {
                                            ...prevState.data.passwordConfirmed,
                                            isBlurredInput: true,
                                            value: event.target.value,
                                        },
                                    },
                                };
                            });
                        }}
                        error={isErrorPasswordConfirmed}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirm-password visibility"
                                        onClick={() => {
                                            setRegisterFormState((prevState: IRegisterFormState) => {
                                                return {
                                                    ...prevState,
                                                    data: {
                                                        ...prevState.data,
                                                        passwordConfirmed: {
                                                            ...prevState.data.passwordConfirmed,
                                                            isShowVisible:
                                                                !prevState.data.passwordConfirmed.isShowVisible,
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                        onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                                            event.preventDefault();
                                        }}
                                        edge="end"
                                    >
                                        {registerFormState.data.passwordConfirmed.isShowVisible ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: '316px' }}
                    />
                </Grid>
                {sliceAuthenticationStateResponse.getIsError() ? (
                    <Grid item sx={{ width: '316px' }}>
                        <Alert severity="error">
                            {sliceAuthenticationStateResponse.getErrorMessage() === 'DUPLICATE_ACCOUNT_USERNAME'
                                ? 'There is already an account with this username. Please login or try a different username.'
                                : sliceAuthenticationStateResponse.getErrorMessage() === 'DUPLICATE_ACCOUNT_EMAIL'
                                ? 'There is already an account with this email. Please login or try a different email.'
                                : 'There was an issue creating an account. Please try again.'}
                        </Alert>
                    </Grid>
                ) : null}
                <Grid item>
                    <Button
                        onClick={() => {
                            void handleOnSubmitSignUp();
                        }}
                        disabled={isErrorRegisterForm}
                        variant="contained"
                        fullWidth
                    >
                        Sign Up
                    </Button>
                </Grid>
            </Grid>
        </FormControl>
    );
};

export default RegisterForm;
