import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@mui/material';
import NotificationListModal from 'src/javascripts/components/NotificationListModal';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';

import type { IRootState } from 'src/javascripts/store';
const StyledBadge = styled(Badge)<any>(() => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        padding: '0 4px',
    },
}));

export interface IIconButtonOpenNotificationListModalState {
    data: number;
}

const IconButtonOpenNotificationListModal: React.FC = () => {
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    const [iconButtonOpenNotificationListModalState, setIconButtonOpenNotificationListModalState] =
        useState<IIconButtonOpenNotificationListModalState>({
            data: 0,
        });

    const handleGetResourceNotificationsUnseenCount = async (): Promise<any> => {
        try {
            const response = await ResourceClient.postResource(
                'api/app/GetNotificationsUnseenCount',
                {},
                sliceAuthenticationStateData.getJwtToken(),
            );
            setIconButtonOpenNotificationListModalState((prevState: IIconButtonOpenNotificationListModalState) => {
                return {
                    ...prevState,
                    data: response.data,
                };
            });
        } catch (e) {}
    };
    useEffect(() => {
        void handleGetResourceNotificationsUnseenCount();
        // eslint-disable-next-line
    }, []);
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <React.Fragment>
            <Tooltip title={'View notifications'} placement="bottom">
                <StyledBadge color="primary" badgeContent={iconButtonOpenNotificationListModalState.data}>
                    <IconButton
                        edge="end"
                        aria-label="icon-button-addPodModerators"
                        onClick={() => {
                            setModalOpen(true);
                        }}
                    >
                        <NotificationsIcon />
                    </IconButton>
                </StyledBadge>
            </Tooltip>
            {isModalOpen ? (
                <NotificationListModal
                    handleClose={async () => {
                        setModalOpen(false);
                        await ResourceClient.postResource(
                            'api/app/MarkAllNotificationsAsSeen',
                            {},
                            sliceAuthenticationStateData.getJwtToken(),
                        );
                        void handleGetResourceNotificationsUnseenCount();
                    }}
                    modalTitle={'My Notifications'}
                />
            ) : null}
        </React.Fragment>
    );
};
export default IconButtonOpenNotificationListModal;
