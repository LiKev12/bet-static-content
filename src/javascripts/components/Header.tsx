import React, { useState } from 'react';

import useScrollTrigger from '@mui/material/useScrollTrigger';
import { THEME } from 'src/javascripts/Theme';
import { AppBar, Button, Tab, Tabs, Toolbar } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

function ElevationScroll(props: any): any {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        // eslint-disable-next-line
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

const StyledTab = styled(Tab)<any>(({ theme }: any) => ({
    fontFamily: 'Raleway',
    textTransform: 'none',
    color: theme.palette.grey.A400,
    ...theme.typography.tab,
    '&.Mui-selected': {
        color: theme.palette.grey.A700,
    },
}));

const Header: React.FC = () => {
    const [value, setValue] = useState(0);

    const handleChange = (e: React.SyntheticEvent, value: number): void => {
        setValue(value);
    };

    return (
        <React.Fragment>
            <ElevationScroll>
                <AppBar color="inherit">
                    <Toolbar disableGutters>
                        <Button
                            component={Link}
                            to="/"
                            style={{
                                padding: 0,
                                // eslint-disable-next-line
                                color: `${THEME.palette.primary.main}`,
                                fontSize: '4rem',
                                marginLeft: '20px',
                                // @ts-expect-error: no
                                '&:hover': { backgroundColor: 'transparent' },
                            }}
                            disableRipple
                            onClick={() => {
                                setValue(0);
                            }}
                        >
                            Bet
                        </Button>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            style={{ marginLeft: 'auto' }}
                            indicatorColor="primary"
                        >
                            <StyledTab component={Link} to="/" label="Home" />
                            <StyledTab component={Link} to="/about" label="About Us" />
                            <StyledTab
                                component={Link}
                                style={{ marginRight: '20px' }}
                                to="/contact"
                                label="Contact Us"
                            />
                        </Tabs>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <div style={{ ...THEME.mixins.toolbar, marginBottom: '4rem' }} />
        </React.Fragment>
    );
};

export default Header;
