import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import InviteUsersJoinPodModal from 'src/javascripts/components/InviteUsersJoinPodModal';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';

export interface IIconButtonInviteUsersJoinPodModalProps {
    idPod: string;
}

const IconButtonInviteUsersJoinPodModal: React.FC<IIconButtonInviteUsersJoinPodModalProps> = (
    props: IIconButtonInviteUsersJoinPodModalProps,
) => {
    const { idPod } = props;
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <React.Fragment>
            <Tooltip title={'Invite users to join'} placement="bottom">
                <IconButton
                    edge="end"
                    aria-label="icon-button-inviteUsersJoinPod"
                    onClick={() => {
                        setModalOpen(true);
                    }}
                >
                    <PersonIcon />
                    <AddIcon />
                </IconButton>
            </Tooltip>
            {isModalOpen ? (
                <InviteUsersJoinPodModal
                    handleClose={() => {
                        setModalOpen(false);
                    }}
                    idPod={idPod}
                    modalTitle={'Invite Users you Follow'}
                />
            ) : null}
        </React.Fragment>
    );
};
export default IconButtonInviteUsersJoinPodModal;
