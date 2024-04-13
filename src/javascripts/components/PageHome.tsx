import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Grid } from '@mui/material';
import LoginAndSignupForms from 'src/javascripts/components/LoginAndSignupForms';
import Footer from 'src/javascripts/components/Footer';
import LogoWithNameAndSlogan from 'src/assets/logo_with_slogan.png';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';
import { THEME } from 'src/javascripts/Theme';
import useMediaQuery from '@mui/material/useMediaQuery';

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

    const isScreenSmall = !useMediaQuery(THEME.breakpoints.up(1480));

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
                }}
            >
                {!isScreenSmall ? (
                    <Box sx={{ justifyContent: 'center' }}>
                        <Grid container>
                            <Grid item sx={{ justifyContent: 'center' }}>
                                <Box
                                    sx={{
                                        width: '1100px',
                                        height: '100%',
                                        padding: '0px 24px 0px 0px',
                                    }}
                                >
                                    <img src={LogoWithNameAndSlogan} alt="logo with name and slogan" width="1100px" />
                                </Box>
                            </Grid>
                            <Grid item sx={{ alignItems: 'center', display: 'flex' }}>
                                <LoginAndSignupForms />
                            </Grid>
                        </Grid>
                    </Box>
                ) : (
                    <Grid container direction="column">
                        <Grid item sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '48px' }}>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    justifyContent: 'center',
                                    display: 'flex',
                                }}
                            >
                                <img src={LogoWithNameAndSlogan} alt="logo with name and slogan" width="80%" />
                            </Box>
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                            <LoginAndSignupForms />
                        </Grid>
                    </Grid>
                )}
            </Box>
            <Footer />
        </Box>
    );
};

export default PageHome;
