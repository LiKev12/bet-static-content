/* eslint-disable */
import { useEffect } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { Button, FormControl, TextField, Grid } from '@mui/material';

type FormValues = {
    username: string;
    email: string;
    password: string;
    password_confirmed: string;
};

const SignupForm = () => {
    const form = useForm<FormValues>({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            password_confirmed: '',
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
                        type="email"
                        id="email"
                        label="Email"
                        required
                        {...register('email', {
                            pattern: {
                                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                message: 'Invalid email format',
                            },
                            required: { value: true, message: 'Email is required' },
                        })}
                        error={!!errors.email?.message}
                        helperText={errors.email?.message}
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
                <Grid item>
                    <TextField
                        type="password"
                        id="password_confirmed"
                        label="Confirm Password"
                        required
                        {...register('password_confirmed', {
                            required: { value: true, message: 'Confirming password is required' },
                            validate: (val: string) => {
                                if (watch('password') != val) {
                                    return 'Your passwords do not match';
                                }
                            },
                        })}
                        error={!!errors.password_confirmed?.message}
                        helperText={errors.password_confirmed?.message}
                        sx={{ width: '300px' }}
                    />
                </Grid>
                <Grid item>
                    <Button
                        onClick={handleSubmit(onSubmit, onError)}
                        disabled={!isDirty || !isValid}
                        variant="contained"
                        sx={{ width: '300px' }}
                    >
                        Sign Up
                    </Button>
                </Grid>
            </Grid>
        </FormControl>
    );
};

export default SignupForm;
