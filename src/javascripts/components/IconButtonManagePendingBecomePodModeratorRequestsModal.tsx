import React, { useState } from 'react';
import { IconButton, Badge, Tooltip } from '@mui/material';
import ManagePendingBecomePodModeratorRequestsModal from 'src/javascripts/components/ManagePendingBecomePodModeratorRequestsModal';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DoneIcon from '@mui/icons-material/Done';

export interface IIconButtonApproveBecomePodModeratorRequestModalProps {
    idPod: string;
    numberOfPendingBecomeModeratorRequests: number;
    handleUpdatePodPage: any;
}

const IconButtonManagePendingBecomePodModeratorRequestsModal: React.FC<
    IIconButtonApproveBecomePodModeratorRequestModalProps
> = (props: IIconButtonApproveBecomePodModeratorRequestModalProps) => {
    const { idPod, numberOfPendingBecomeModeratorRequests, handleUpdatePodPage } = props;
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <React.Fragment>
            <Tooltip
                title={`Manage incoming requests from members wishing to become moderators${
                    numberOfPendingBecomeModeratorRequests === 0 ? ' (none currently)' : ''
                }`}
                placement="bottom"
            >
                <Badge color="primary" badgeContent={numberOfPendingBecomeModeratorRequests}>
                    <IconButton
                        edge="end"
                        aria-label="icon-button-is-me"
                        disabled={numberOfPendingBecomeModeratorRequests === 0}
                        onClick={() => {
                            setModalOpen(true);
                        }}
                    >
                        <ManageAccountsIcon />
                        <DoneIcon />
                    </IconButton>
                </Badge>
            </Tooltip>
            {isModalOpen ? (
                <ManagePendingBecomePodModeratorRequestsModal
                    handleClose={() => {
                        setModalOpen(false);
                    }}
                    idPod={idPod}
                    modalTitle={'Manage moderator requests'}
                    handleUpdatePodPage={handleUpdatePodPage}
                />
            ) : null}
        </React.Fragment>
    );
};
export default IconButtonManagePendingBecomePodModeratorRequestsModal;
