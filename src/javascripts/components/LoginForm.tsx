import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, FormControl, TextField, Grid, InputAdornment, IconButton } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import Constants from 'src/javascripts/Constants';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import { getInputText } from 'src/javascripts/utilities';
import { sliceAuthenticationActions } from 'src/javascripts/store/SliceAuthentication';
import ResponseModel from 'src/javascripts/models/ResponseModel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import type { IRootState } from 'src/javascripts/store';

export interface ILoginFormState {
    data: {
        username: string;
        password: string;
    };
    isShowVisiblePassword: boolean;
    response: {
        state: string;
        errorMessage: string | null;
    };
}
const LoginForm: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateResponse = new ResponseModel(sliceAuthenticationState.response);
    const [loginFormState, setLoginFormState] = useState<ILoginFormState>({
        data: { username: 'chenpachi', password: 'chenpachipwd' },
        isShowVisiblePassword: false,
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    });

    const handleOnSubmitLogin = async (): Promise<any> => {
        try {
            dispatch(sliceAuthenticationActions.setStateResponseLoading());
            const response = await ResourceClient.postResourceUnauthenticated('api/auth/Login', {
                username: loginFormState.data.username,
                password: loginFormState.data.password,
            });
            dispatch(sliceAuthenticationActions.setStateData(response.data));
            navigate('/me');
        } catch (e: any) {
            dispatch(sliceAuthenticationActions.setStateResponseError(e?.response?.data?.message));
        }
    };

    const isLoginFormDisabled =
        getInputText(loginFormState.data.username).length === 0 ||
        getInputText(loginFormState.data.password).length === 0;

    return (
        <FormControl
            onSubmit={() => {
                void handleOnSubmitLogin();
            }}
        >
            <Grid direction="column" container spacing={2}>
                <Grid item sx={{ marginBottom: '6px' }}>
                    <TextField
                        id="login-username"
                        label="Username"
                        type="text"
                        required
                        value={loginFormState.data.username}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setLoginFormState((prevState: ILoginFormState) => {
                                return {
                                    ...prevState,
                                    data: {
                                        ...prevState.data,
                                        username: event.target.value,
                                    },
                                };
                            });
                        }}
                        sx={{ width: '316px' }}
                    />
                </Grid>
                <Grid item sx={{ marginBottom: '6px' }}>
                    <TextField
                        id="login-password"
                        label="Password"
                        type={loginFormState.isShowVisiblePassword ? 'text' : 'password'}
                        required
                        value={loginFormState.data.password}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setLoginFormState((prevState: ILoginFormState) => {
                                return {
                                    ...prevState,
                                    data: {
                                        ...prevState.data,
                                        password: event.target.value,
                                    },
                                };
                            });
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => {
                                            setLoginFormState((prevState: ILoginFormState) => {
                                                return {
                                                    ...prevState,
                                                    isShowVisiblePassword: !prevState.isShowVisiblePassword,
                                                };
                                            });
                                        }}
                                        onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                                            event.preventDefault();
                                        }}
                                        edge="end"
                                    >
                                        {loginFormState.isShowVisiblePassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: '316px' }}
                    />
                </Grid>
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
                        Forgot password? Click <a href="/">here</a>.
                    </Box>
                </Grid>
                {sliceAuthenticationStateResponse.getIsError() ? (
                    <Grid item>
                        <Alert severity="error">Invalid login. Please try again.</Alert>
                    </Grid>
                ) : null}
                <Grid item>
                    <Button
                        onClick={() => {
                            void handleOnSubmitLogin();
                        }}
                        disabled={isLoginFormDisabled}
                        variant="contained"
                        fullWidth
                    >
                        Log In
                    </Button>
                </Grid>
            </Grid>
        </FormControl>
    );
};

export default LoginForm;
