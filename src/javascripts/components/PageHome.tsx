import React from 'react';
import { Box, Grid } from '@mui/material';
import LoginAndSignupForms from 'src/javascripts/components/LoginAndSignupForms';
import Footer from 'src/javascripts/components/Footer';
import LogoWithNameAndSlogan from 'src/assets/logo_with_slogan.png';
import { THEME } from 'src/javascripts/Theme';

export interface IPageHomeProps {
    setActiveTabIdx: string;
}

const PageHome: React.FC = () => {
    return (
        <React.Fragment>
            <Box
                style={{
                    minHeight: '100vh',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    background: THEME.palette.gradient,
                }}
            >
                <Grid container direction="row">
                    <Grid item>
                        <Grid container direction="column">
                            <Box sx={{ width: '800px', height: '100%', padding: '0px 24px', marginRight: '96px' }}>
                                <Grid item>
                                    <img src={LogoWithNameAndSlogan} alt="logo with name and slogan" width="800px" />
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <LoginAndSignupForms />
                    </Grid>
                </Grid>
            </Box>
            <Footer />
        </React.Fragment>
    );
};

export default PageHome;
