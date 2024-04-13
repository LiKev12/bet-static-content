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
        <Grid
            container
            justifyContent="center"
            sx={{
                background: THEME.palette.other.gradient,
                paddingBottom: '24px',
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
                        paddingLeft: '32px',
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
                        paddingLeft: '32px',
                    }}
                >
                    Contact
                </StyledFooterButton>
            </Grid>
        </Grid>
    );
};

export default Footer;
