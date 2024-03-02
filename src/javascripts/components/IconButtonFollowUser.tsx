import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';

export interface IIconButtonFollowUserProps {
    isMe: boolean;
    isFollowedByMe: boolean;
    isFollowRequestSentNotYetAccepted: boolean;
    handleSendFollowRequest: any;
    isAllowUnfollow: boolean;
    handleUnfollowUser: any;
}

const IconButtonFollowUser: React.FC<IIconButtonFollowUserProps> = (props: IIconButtonFollowUserProps) => {
    const {
        isMe,
        isFollowedByMe,
        isFollowRequestSentNotYetAccepted,
        handleSendFollowRequest,
        isAllowUnfollow,
        handleUnfollowUser,
    } = props;
    const [anchorElUnfollowUserMenuItem, setAnchorElUnfollowUserMenuItem] = useState<null | HTMLElement>(null);
    const isOpenMenuItemUnfollowUser = isAllowUnfollow && Boolean(anchorElUnfollowUserMenuItem);
    if (isMe) {
        return (
            <IconButton
                edge="end"
                aria-label="icon-button-is-me"
                sx={{
                    cursor: 'default',
                    color: '#fdd835',
                }}
                disableRipple={true}
            >
                <Tooltip title={'You'} placement="bottom">
                    <StarIcon />
                </Tooltip>
            </IconButton>
        );
    }

    if (isFollowedByMe && !isAllowUnfollow) {
        return (
            <IconButton
                edge="end"
                aria-label="following-user"
                sx={{
                    color: THEME.palette.info.main,
                    cursor: 'default',
                }}
                disableRipple={true}
            >
                <Tooltip title={'Followed by you'} placement="bottom">
                    <PersonIcon />
                </Tooltip>
            </IconButton>
        );
    }

    if (isFollowedByMe && isAllowUnfollow) {
        return (
            <Box>
                <Menu
                    open={isOpenMenuItemUnfollowUser}
                    anchorEl={anchorElUnfollowUserMenuItem}
                    onClose={() => {
                        setAnchorElUnfollowUserMenuItem(null);
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            handleUnfollowUser();
                            setAnchorElUnfollowUserMenuItem(null);
                        }}
                        color="error"
                    >
                        Unfollow
                    </MenuItem>
                </Menu>
                <IconButton
                    edge="end"
                    aria-label="following-user"
                    sx={{
                        color: THEME.palette.info.main,
                    }}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        setAnchorElUnfollowUserMenuItem(event.currentTarget);
                    }}
                    aria-controls={isOpenMenuItemUnfollowUser ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={isOpenMenuItemUnfollowUser ? 'true' : undefined}
                >
                    <Tooltip title={'Followed by you'} placement="bottom">
                        <PersonIcon />
                    </Tooltip>
                </IconButton>
            </Box>
        );
    }

    if (isFollowRequestSentNotYetAccepted) {
        return (
            <IconButton
                edge="end"
                aria-label="follow-user"
                sx={{
                    cursor: 'default',
                    color: THEME.palette.other.pendingActionColor,
                }}
                disableRipple={true}
            >
                <Tooltip title={'Send follow request (pending)'} placement="bottom">
                    <PersonAddAlt1Icon />
                </Tooltip>
            </IconButton>
        );
    }
    return (
        <IconButton edge="end" aria-label="follow-user" onClick={handleSendFollowRequest}>
            <Tooltip title={'Send follow request'} placement="bottom">
                <PersonAddAlt1Icon />
            </Tooltip>
        </IconButton>
    );
};
export default IconButtonFollowUser;
