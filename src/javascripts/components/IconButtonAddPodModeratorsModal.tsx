import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import AddPodModeratorsModal from 'src/javascripts/components/AddPodModeratorsModal';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddIcon from '@mui/icons-material/Add';

export interface IIconButtonAddPodModeratorsModalProps {
    idPod: string;
}

const IconButtonAddPodModeratorsModal: React.FC<IIconButtonAddPodModeratorsModalProps> = (
    props: IIconButtonAddPodModeratorsModalProps,
) => {
    const { idPod } = props;
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <React.Fragment>
            <Tooltip title={'Add Pod moderators'} placement="bottom">
                <IconButton
                    edge="end"
                    aria-label="icon-button-addPodModerators"
                    onClick={() => {
                        setModalOpen(true);
                    }}
                >
                    <ManageAccountsIcon />
                    <AddIcon />
                </IconButton>
            </Tooltip>
            {isModalOpen ? (
                <AddPodModeratorsModal
                    handleClose={() => {
                        setModalOpen(false);
                    }}
                    idPod={idPod}
                    modalTitle={'Add Moderators'}
                />
            ) : null}
        </React.Fragment>
    );
};
export default IconButtonAddPodModeratorsModal;
