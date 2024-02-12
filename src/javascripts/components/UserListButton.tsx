import React, { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import UserListModal from 'src/javascripts/components/UserListModal';
import UserBubble from 'src/javascripts/components/UserBubble';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import type UserBubbleModel from 'src/javascripts/models/UserBubbleModel';

export interface IUserListButtonProps {
    labelText: string;
    userBubbles: UserBubbleModel[];
    sortByTimestampLabel: string;
    apiPath: string;
    modalTitle: string;
    isUseDateTimeDateAndTime: boolean;
}

const MAX_USER_BUBBLES_VISIBLE = 3;

const UserListButton: React.FC<IUserListButtonProps> = (props: IUserListButtonProps) => {
    const { labelText, userBubbles, apiPath, modalTitle, isUseDateTimeDateAndTime } = props;
    const [isModalOpen, setModalOpen] = useState(false);

    const userBubblesProcessed: UserBubbleModel[] = [];
    for (let i = Math.min(MAX_USER_BUBBLES_VISIBLE, userBubbles.length) - 1; i >= 0; i--) {
        userBubblesProcessed.push(userBubbles[i]);
    }

    return (
        <React.Fragment>
            <Button
                sx={{
                    paddingLeft: '12px',
                    paddingRight: '16px',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    width: '100%',
                }}
                variant="contained"
                onClick={() => {
                    setModalOpen(true);
                }}
                disabled={userBubbles.length === 0}
            >
                <Box sx={{}}>
                    <Grid container direction="row-reverse" sx={{ justifyContent: 'flex-end', marginTop: '4px' }}>
                        <Grid item sx={{ marginLeft: '12px' }}>
                            {labelText}
                        </Grid>
                        {userBubbles.length > 0 ? (
                            <Grid item sx={{ marginLeft: '6px', marginRight: '24px' }}>
                                <Box sx={{ position: 'absolute' }}>
                                    <MoreHorizIcon />
                                </Box>
                            </Grid>
                        ) : null}
                        {userBubblesProcessed.map((userBubble: UserBubbleModel, idx: number) => (
                            <Grid item key={`${idx}_${String(userBubble.id)}`} sx={{ marginRight: '14px' }}>
                                <UserBubble imageLink={userBubble.getImageLink()} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Button>
            {isModalOpen ? (
                <UserListModal
                    handleClose={() => {
                        setModalOpen(false);
                    }}
                    sortByTimestampLabel={props.sortByTimestampLabel}
                    apiPath={apiPath}
                    modalTitle={modalTitle}
                    isUseDateTimeDateAndTime={isUseDateTimeDateAndTime}
                />
            ) : null}
        </React.Fragment>
    );
};
export default UserListButton;
