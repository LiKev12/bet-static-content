import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Tab, Tabs } from '@mui/material';
import LoginForm from 'src/javascripts/components/LoginForm';
import SignupForm from 'src/javascripts/components/SignupForm';
import { THEME } from 'src/javascripts/Theme';
import { sliceAuthenticationActions } from '../store/SliceAuthentication';
const LoginAndSignupForms: React.FC = () => {
    const dispatch = useDispatch();

    const toggleValue: boolean = useSelector((state: any) => state.authentication.toggleValue);
    const [isLoginTabActive, setLoginTabActive] = useState(true);
    return (
        <Grid
            container
            direction="column"
            sx={{
                border: '4px solid #97E2FF',
                backgroundColor: THEME.palette.grey['50'],
                borderRadius: '16px',
                boxShadow: '0px 5px 10px 0px rgba(151, 226, 255, 0.5)',
                padding: '16px',
            }}
        >
            <Grid item sx={{ paddingBottom: '12px' }}>
                <Tabs
                    value={isLoginTabActive ? 0 : 1}
                    onChange={(e, activeTabIdx: number) => {
                        if (activeTabIdx === 0) {
                            setLoginTabActive(true);
                        } else {
                            setLoginTabActive(false);
                        }
                    }}
                    indicatorColor="primary"
                    style={{ margin: '8px' }}
                >
                    <Tab sx={{ width: '150px' }} label="Login" />
                    <Tab sx={{ width: '150px' }} label="Sign Up" />
                </Tabs>
            </Grid>
            <Button
                onClick={() => {
                    dispatch(sliceAuthenticationActions.toggle());
                }}
            >
                {`test redux ${toggleValue ? 'true' : 'false'}`}
            </Button>
            {isLoginTabActive ? <LoginForm /> : <SignupForm />}
        </Grid>
    );
};

export default LoginAndSignupForms;
