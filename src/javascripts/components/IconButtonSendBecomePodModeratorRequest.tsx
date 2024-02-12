import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddIcon from '@mui/icons-material/Done';
import { THEME } from 'src/javascripts/Theme';

export interface IIconButtonSendBecomePodModeratorRequestProps {
    isSentBecomePodModeratorRequest: boolean;
    handleSendBecomePodModeratorRequest: any;
}

const IconButtonSendBecomePodModeratorRequest: React.FC<IIconButtonSendBecomePodModeratorRequestProps> = (
    props: IIconButtonSendBecomePodModeratorRequestProps,
) => {
    const { isSentBecomePodModeratorRequest, handleSendBecomePodModeratorRequest } = props;

    return (
        <Tooltip
            title={`Request to be added as a moderator${isSentBecomePodModeratorRequest ? ' (pending)' : ''}`}
            placement="bottom"
        >
            <IconButton
                edge="end"
                aria-label="icon-button-sendBecomePodModeratorRequest"
                onClick={handleSendBecomePodModeratorRequest}
                disableRipple={isSentBecomePodModeratorRequest}
                sx={
                    isSentBecomePodModeratorRequest
                        ? {
                              cursor: 'default',
                              color: THEME.palette.other.pendingActionColor,
                          }
                        : {}
                }
            >
                <ManageAccountsIcon />
                <AddIcon />
            </IconButton>
        </Tooltip>
    );
};
export default IconButtonSendBecomePodModeratorRequest;
