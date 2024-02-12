import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';

export interface IIconButtonFollowUserProps {
    isMe: boolean;
    isFollowedByMe: boolean;
    isFollowRequestSentNotYetAccepted: boolean;
    handleSendFollowRequest: any;
}

const IconButtonFollowUser: React.FC<IIconButtonFollowUserProps> = (props: IIconButtonFollowUserProps) => {
    const { isMe, isFollowedByMe, isFollowRequestSentNotYetAccepted, handleSendFollowRequest } = props;
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

    if (isFollowedByMe) {
        return (
            <IconButton
                edge="end"
                aria-label="follow-user"
                sx={{
                    cursor: 'default',
                    color: THEME.palette.info.main,
                }}
                disableRipple={true}
            >
                <Tooltip title={'Followed by you'} placement="bottom">
                    <PersonIcon />
                </Tooltip>
            </IconButton>
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
