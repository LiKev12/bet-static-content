import React, { useState } from 'react';
import { IconButton, Badge, Tooltip } from '@mui/material';
import ManagePendingFollowUserRequestsModal from 'src/javascripts/components/ManagePendingFollowUserRequestsModal';
import PersonIcon from '@mui/icons-material/Person';
import DoneIcon from '@mui/icons-material/Done';

export interface IIconButtonManagePendingFollowUserRequestsModalProps {
    numberOfPendingFollowUserRequests: number;
    handleUpdateUserPage: any;
}

const IconButtonManagePendingFollowUserRequestsModal: React.FC<IIconButtonManagePendingFollowUserRequestsModalProps> = (
    props: IIconButtonManagePendingFollowUserRequestsModalProps,
) => {
    const { numberOfPendingFollowUserRequests, handleUpdateUserPage } = props;
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <React.Fragment>
            <Tooltip
                title={`Manage incoming follow requests${
                    numberOfPendingFollowUserRequests === 0 ? ' (none currently)' : ''
                }`}
                placement="bottom"
            >
                <Badge color="primary" badgeContent={numberOfPendingFollowUserRequests}>
                    <IconButton
                        edge="end"
                        aria-label="icon-button-is-me"
                        disabled={numberOfPendingFollowUserRequests === 0}
                        onClick={() => {
                            setModalOpen(true);
                        }}
                    >
                        <PersonIcon />
                        <DoneIcon />
                    </IconButton>
                </Badge>
            </Tooltip>
            {isModalOpen ? (
                <ManagePendingFollowUserRequestsModal
                    handleClose={() => {
                        setModalOpen(false);
                    }}
                    modalTitle={'Manage follow requests'}
                    handleUpdateUserPage={handleUpdateUserPage}
                />
            ) : null}
        </React.Fragment>
    );
};
export default IconButtonManagePendingFollowUserRequestsModal;
