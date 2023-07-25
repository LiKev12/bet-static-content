import { Button, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const StyledFooterButton = styled(Button)<any>(({ theme }: any) => ({
    fontFamily: 'Raleway',
    textTransform: 'none',
    color: theme.palette.grey.A400,
    '&.MuiButton-root:hover': { bgcolor: 'transparent' },
}));

export interface IFooterProps {
    setActiveTabIdx: any;
}

const Footer: React.FC<IFooterProps> = (props: IFooterProps) => {
    return (
        <footer>
            <Grid container spacing={4} justifyContent="center">
                <Grid item>
                    <StyledFooterButton
                        variant="text"
                        component={Link}
                        to="/about"
                        disableRipple
                        sx={{
                            '&.MuiButton-root:hover': { bgcolor: 'transparent' },
                        }}
                        onClick={() => props.setActiveTabIdx(1)}
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
                        onClick={() => props.setActiveTabIdx(2)}
                    >
                        Contact
                    </StyledFooterButton>
                </Grid>
            </Grid>
        </footer>
    );
};

export default Footer;
