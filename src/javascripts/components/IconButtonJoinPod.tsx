import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

export interface IIconButtonJoinPodProps {
    handleJoinPod: any;
}

const IconButtonJoinPod: React.FC<IIconButtonJoinPodProps> = (props: IIconButtonJoinPodProps) => {
    const { handleJoinPod } = props;
    return (
        <IconButton edge="end" aria-label="icon-button-join-pod" onClick={handleJoinPod}>
            <Tooltip title={'Join Pod'} placement="bottom">
                <GroupAddIcon />
            </Tooltip>
        </IconButton>
    );
};
export default IconButtonJoinPod;
