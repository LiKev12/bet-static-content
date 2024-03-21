import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';

const PageContact: React.FC = () => {
    return (
        <Box
            style={{
                minHeight: '100vh',
                paddingLeft: '24px',
                paddingRight: '24px',
                background: THEME.palette.other.gradient,
            }}
        >
            <Grid container direction="column" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid item>
                    <Typography variant="h5">
                        We always appreciate any feedback, drop our team a note{' '}
                        <Link to="https://forms.gle/Rq3S8DjZryeybD3PA" target="_blank" rel="noopener noreferrer">
                            here
                        </Link>
                        !
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PageContact;
