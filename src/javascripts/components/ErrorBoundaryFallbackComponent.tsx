import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { THEME } from 'src/javascripts/Theme';

export interface IErrorBoundaryFallbackComponentState {
    isOpen: boolean;
}

const ErrorBoundaryFallbackComponent: React.FC = () => {
    const [errorBoundaryFallbackComponentState, setErrorBoundaryFallbackComponentState] =
        useState<IErrorBoundaryFallbackComponentState>({
            isOpen: true,
        });

    const handleClose = (): void => {
        setErrorBoundaryFallbackComponentState((prevState: IErrorBoundaryFallbackComponentState) => {
            return {
                ...prevState,
                isOpen: false,
            };
        });
    };
    return (
        <Box
            style={{
                minHeight: '100vh',
                background: THEME.palette.other.gradient,
            }}
        >
            <Dialog open={errorBoundaryFallbackComponentState.isOpen} onClose={handleClose} fullWidth>
                <DialogTitle>{`Unexpected Error Occurred`}</DialogTitle>
                <DialogContent>
                    <Typography>
                        There was an unexpected error with loading this page. Our team is currently looking into it.
                        Please try refreshing the page. <br />
                        <br />
                        If this issue is recurring, please drop a note to our team{' '}
                        <Link to="https://forms.gle/Rq3S8DjZryeybD3PA" target="_blank" rel="noopener noreferrer">
                            {'here'}
                        </Link>
                        . Thank you.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ErrorBoundaryFallbackComponent;
