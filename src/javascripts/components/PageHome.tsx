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
        <React.Fragment>
            <Box
                style={{
                    minHeight: '100vh',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    background: THEME.palette.other.gradient,
                }}
            >
                <Grid container direction="row" spacing={2}>
                    <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                            sx={{
                                width: '1000px',
                                height: '100%',
                                padding: '0px 24px',
                            }}
                        >
                            <Grid item>
                                <img src={LogoWithNameAndSlogan} alt="logo with name and slogan" width="1000px" />
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <LoginAndSignupForms />
                    </Grid>
                </Grid>
            </Box>
            <Footer />
        </React.Fragment>
    );
};

export default PageHome;
