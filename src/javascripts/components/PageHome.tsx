import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Grid } from '@mui/material';
import LoginAndSignupForms from 'src/javascripts/components/LoginAndSignupForms';
import Footer from 'src/javascripts/components/Footer';
import LogoWithNameAndSlogan from 'src/assets/logo_with_slogan.png';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';
import { THEME } from 'src/javascripts/Theme';

import type { IRootState } from 'src/javascripts/store';

const PageHome: React.FC = () => {
    const navigate = useNavigate();
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    useEffect(() => {
        if (sliceAuthenticationStateData.hasJwtToken()) {
            navigate('/me');
        }
        // eslint-disable-next-line
    }, [sliceAuthenticationStateData]);

    return (
        <Box
            style={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: THEME.palette.other.gradient,
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    verticalAlign: 'middle',
                    paddingBottom: '24px',
                }}
            >
                <Grid container sx={{ justifyContent: 'center', display: 'flex' }}>
                    <Grid item sx={{ justifyContent: 'center', paddingBottom: '24px' }}>
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <img src={LogoWithNameAndSlogan} alt="logo with name and slogan" width="100%%" />
                        </Box>
                    </Grid>
                    <Grid item sx={{ alignItems: 'center', display: 'flex' }}>
                        <LoginAndSignupForms />
                    </Grid>
                </Grid>
            </Box>
            <Footer />
        </Box>
    );
};

export default PageHome;
