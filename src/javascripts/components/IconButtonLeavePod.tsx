import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export interface IIconButtonLeavePodProps {
    handleLeavePod: any;
}

const IconButtonLeavePod: React.FC<IIconButtonLeavePodProps> = (props: IIconButtonLeavePodProps) => {
    const { handleLeavePod } = props;

    return (
        <Tooltip title={'Leave Pod'} placement="bottom">
            <IconButton color="error" edge="end" aria-label="icon-button-leavePod" onClick={handleLeavePod}>
                <LogoutIcon />
            </IconButton>
        </Tooltip>
    );
};
export default IconButtonLeavePod;
