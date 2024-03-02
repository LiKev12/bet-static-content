import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import useScrollTrigger from '@mui/material/useScrollTrigger';
import { THEME } from 'src/javascripts/Theme';
import { AppBar, Box, Tab, Tabs, Toolbar } from '@mui/material';
import { styled } from '@mui/system';
import { Link, Outlet } from 'react-router-dom';
import IconButtonOpenNotificationListModal from 'src/javascripts/components/IconButtonOpenNotificationListModal';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';
import { sliceHeaderActiveTabActions } from 'src/javascripts/store/SliceHeaderActiveTab';

import type { IRootState } from 'src/javascripts/store';

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

const Header: React.FC = (props) => {
    const dispatch = useDispatch();
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    const sliceHeaderActiveTabState = useSelector((state: IRootState) => state.headerActiveTab);
    const sliceHeaderActiveTabStateData = sliceHeaderActiveTabState.data;
    return (
        <React.Fragment>
            <ElevationScroll>
                <AppBar color="inherit" sx={{ background: THEME.palette.other.gradient }}>
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
                        {sliceAuthenticationStateData.hasJwtToken() ? (
                            <React.Fragment>
                                <Tabs
                                    value={sliceHeaderActiveTabStateData}
                                    onChange={(e, activeTabIdx) => {
                                        dispatch(sliceHeaderActiveTabActions.setStateData(activeTabIdx));
                                    }}
                                    style={{ marginLeft: 'auto' }}
                                    indicatorColor="primary"
                                >
                                    <StyledTab component={Link} to="/me" label="Me" />
                                    <StyledTab component={Link} to="/discover" label="Discover" />
                                    <StyledTab
                                        component={Link}
                                        to={`/profiles/${String(sliceAuthenticationStateData.getIdUser())}`}
                                        label="Profile"
                                    />
                                    <StyledTab component={Link} to="/account" label="Account" />
                                </Tabs>
                                <Box sx={{ marginRight: '48px' }}>
                                    <IconButtonOpenNotificationListModal />
                                </Box>
                            </React.Fragment>
                        ) : null}
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <div
                style={{
                    ...THEME.mixins.toolbar,
                    paddingBottom: '4rem',
                    background: THEME.palette.other.gradient,
                }}
            />
            <Outlet />
        </React.Fragment>
    );
};

export default Header;
