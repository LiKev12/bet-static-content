import React from 'react';

import useScrollTrigger from '@mui/material/useScrollTrigger';
import { THEME } from 'src/javascripts/Theme';
import { AppBar, Tab, Tabs, Toolbar } from '@mui/material';
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
    color: theme.palette.grey.A500,
    ...theme.typography.tab,
    '&.Mui-selected': {
        color: theme.palette.grey.A700,
    },
}));

export interface IHeaderProps {
    activeTabIdx: number;
    setActiveTabIdx: any;
}

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
    return (
        <React.Fragment>
            <ElevationScroll>
                <AppBar color="inherit" sx={{ background: THEME.palette.gradient }}>
                    <Toolbar disableGutters>
                        {/* <Button
                            component={Link}
                            to="/"
                            sx={{
                                padding: '12px 12px 12px 12px',
                                '&.MuiButton-root:hover': { bgcolor: 'transparent' },
                            }}
                            disableRipple
                            onClick={() => props.setActiveTabIdx(0)}
                        >
                            <Box sx={{ width: '12px' }}></Box>
                            <img src={Logo} alt="bet logo" width="64px" height="64px" />
                            <Box sx={{ width: '12px' }}></Box>
                        </Button> */}
                        <Tabs
                            value={props.activeTabIdx}
                            onChange={(e, activeTabIdx) => {
                                props.setActiveTabIdx(activeTabIdx);
                            }}
                            style={{ marginLeft: 'auto' }}
                            indicatorColor="primary"
                        >
                            <StyledTab component={Link} to="/" label="Home" />
                            <StyledTab component={Link} to="/me" label="Me" />
                            <StyledTab
                                component={Link}
                                to="/discover"
                                label="Discover"
                                style={{ marginRight: '20px' }}
                            />
                        </Tabs>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <div
                style={{
                    ...THEME.mixins.toolbar,
                    paddingBottom: '4rem',
                    background: THEME.palette.gradient,
                }}
            />
        </React.Fragment>
    );
};

export default Header;
