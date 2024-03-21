import React from 'react';
import { Box, Typography } from '@mui/material';
import Header from 'src/javascripts/components/Header';
import { THEME } from 'src/javascripts/Theme';
import { Link } from 'react-router-dom';

const PageNotFoundAsErrorElement: React.FC = () => {
    return (
        <React.Fragment>
            <Header />
            <Box
                style={{
                    minHeight: '100vh',
                    background: THEME.palette.other.gradient,
                    paddingLeft: '36px',
                }}
            >
                <Typography variant="h5">
                    Page not found. Please ensure the URL is correct or go back <Link to="/">home</Link>.
                </Typography>
            </Box>
        </React.Fragment>
    );
};

export default PageNotFoundAsErrorElement;
