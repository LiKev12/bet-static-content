import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { THEME } from 'src/javascripts/Theme';

export interface IIconButtonLeavePodProps {
    handleLeavePod: any;
    isDisabledOnlyModerator: boolean;
}

const IconButtonLeavePod: React.FC<IIconButtonLeavePodProps> = (props: IIconButtonLeavePodProps) => {
    const { handleLeavePod, isDisabledOnlyModerator } = props;

    if (isDisabledOnlyModerator) {
        return (
            <Tooltip
                title={'You are currently the only moderator. Please designate another moderator before leaving.'}
                placement="bottom"
            >
                <IconButton
                    edge="end"
                    aria-label="icon-button-leavePod"
                    onClick={() => {}}
                    disableRipple={true}
                    sx={{
                        cursor: 'default',
                        color: THEME.palette.other.disabledButtonColor,
                    }}
                >
                    <LogoutIcon />
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <IconButton color="error" edge="end" aria-label="icon-button-leavePod" onClick={handleLeavePod}>
            <Tooltip title={'Leave Pod'} placement="bottom">
                <LogoutIcon />
            </Tooltip>
        </IconButton>
    );
};
export default IconButtonLeavePod;
