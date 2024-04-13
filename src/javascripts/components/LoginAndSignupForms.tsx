import { useState } from 'react';
import { Grid, Tab, Tabs } from '@mui/material';
import LoginForm from 'src/javascripts/components/LoginForm';
import RegisterForm from 'src/javascripts/components/RegisterForm';
import { THEME } from 'src/javascripts/Theme';
const LoginAndSignupForms: React.FC = () => {
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
                width: '356px',
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
            {isLoginTabActive ? <LoginForm /> : <RegisterForm />}
        </Grid>
    );
};

export default LoginAndSignupForms;
