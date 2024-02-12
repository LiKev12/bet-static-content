import { Button, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { THEME } from 'src/javascripts/Theme';

const StyledFooterButton = styled(Button)<any>(({ theme }: any) => ({
    fontFamily: 'Raleway',
    textTransform: 'none',
    color: theme.palette.grey.A500,
    '&.MuiButton-root:hover': { bgcolor: 'transparent' },
}));

const Footer: React.FC = () => {
    return (
        <footer>
            <Grid
                container
                spacing={4}
                justifyContent="center"
                sx={{
                    background: THEME.palette.other.gradient,
                    paddingBottom: '24px',
                    position: 'absolute',
                    left: '0',
                    bottom: '0',
                    right: '0',
                }}
            >
                <Grid item>
                    <StyledFooterButton
                        variant="text"
                        component={Link}
                        to="/about"
                        disableRipple
                        sx={{
                            '&.MuiButton-root:hover': { bgcolor: 'transparent' },
                        }}
                    >
                        About
                    </StyledFooterButton>
                </Grid>
                <Grid item>
                    <StyledFooterButton
                        variant="text"
                        component={Link}
                        to="/contact"
                        disableRipple
                        sx={{
                            '&.MuiButton-root:hover': { bgcolor: 'transparent' },
                        }}
                    >
                        Contact
                    </StyledFooterButton>
                </Grid>
            </Grid>
        </footer>
    );
};

export default Footer;
