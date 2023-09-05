/* eslint-disable */
import { useEffect } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { Box, Button, FormControl, TextField, Grid } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';

type FormValues = {
    username: string;
    password: string;
};

const LoginForm = () => {
    const form = useForm<FormValues>({
        defaultValues: {
            username: '',
            password: '',
        },
        mode: 'onTouched',
    });

    const { register, control, handleSubmit, formState, watch, reset } = form;

    const { errors, isDirty, isValid, isSubmitSuccessful } = formState;

    const onSubmit = (data: FormValues) => {
        console.log('[onSubmit]', data);
    };

    const onError = (errors: FieldErrors<FormValues>) => {
        // FILL_HERE
    };

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);

    return (
        <FormControl onSubmit={handleSubmit(onSubmit, onError)}>
            <Grid direction="column" container spacing={2}>
                <Grid item>
                    <TextField
                        type="text"
                        id="username"
                        label="Username"
                        required
                        {...register('username', {
                            required: { value: true, message: 'Username is required' },
                        })}
                        error={!!errors.username?.message}
                        helperText={errors.username?.message}
                        sx={{ width: '300px' }}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        type="password"
                        id="password"
                        label="Password"
                        required
                        {...register('password', {
                            required: { value: true, message: 'Password is required' },
                        })}
                        error={!!errors.password?.message}
                        helperText={errors.password?.message}
                        sx={{ width: '300px' }}
                    />
                </Grid>
                <Grid item sx={{ height: '144px', width: '316px' }}>
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
                <Grid item>
                    <Button
                        onClick={handleSubmit(onSubmit, onError)}
                        disabled={!isDirty || !isValid}
                        variant="contained"
                        sx={{ width: '300px' }}
                    >
                        Log In
                    </Button>
                </Grid>
            </Grid>
        </FormControl>
    );
};

export default LoginForm;
