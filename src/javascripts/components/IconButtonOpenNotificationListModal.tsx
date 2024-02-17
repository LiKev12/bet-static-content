import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import NotificationListModal from 'src/javascripts/components/NotificationListModal';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import ResourceClient from 'src/javascripts/clients/ResourceClient';

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
    const [iconButtonOpenNotificationListModalState, setIconButtonOpenNotificationListModalState] =
        useState<IIconButtonOpenNotificationListModalState>({
            data: 0,
        });

    const handleGetResourceNotificationsUnseenCount = (): void => {
        ResourceClient.postResource('api/app/GetNotificationsUnseenCount', {})
            .then((responseJson: any) => {
                setIconButtonOpenNotificationListModalState((prevState: IIconButtonOpenNotificationListModalState) => {
                    return {
                        ...prevState,
                        data: responseJson,
                    };
                });
            })
            .catch(() => {});
    };
    useEffect(() => {
        handleGetResourceNotificationsUnseenCount();
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
                    handleClose={() => {
                        setModalOpen(false);
                        ResourceClient.postResource('api/app/MarkAllNotificationsAsSeen', {})
                            .then(() => {
                                handleGetResourceNotificationsUnseenCount();
                            })
                            .catch(() => {});
                    }}
                    modalTitle={'My Notifications'}
                />
            ) : null}
        </React.Fragment>
    );
};
export default IconButtonOpenNotificationListModal;
