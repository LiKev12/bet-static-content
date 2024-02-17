import React, { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import UserBubbleReactionListModal from 'src/javascripts/components/UserBubbleReactionListModal';
import UserBubble from 'src/javascripts/components/UserBubble';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import type UserBubbleReactionModel from 'src/javascripts/models/UserBubbleReactionModel';

export interface IUserBubbleReactionListModalButtonProps {
    labelText: string;
    userBubbles: UserBubbleReactionModel[];
    sortByTimestampLabel: string;
    apiPath: string;
    apiReactionSourceEntityIdValue: string;
    modalTitle: string;
}

const MAX_USER_BUBBLES_VISIBLE = 3;

const UserBubbleReactionListModalButton: React.FC<IUserBubbleReactionListModalButtonProps> = (
    props: IUserBubbleReactionListModalButtonProps,
) => {
    const { labelText, userBubbles, apiPath, apiReactionSourceEntityIdValue, modalTitle } = props;
    const [isModalOpen, setModalOpen] = useState(false);
    const userBubblesProcessed: UserBubbleReactionModel[] = [];
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
                    // width: '100%',
                    width: '255px',
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
                        {userBubblesProcessed.map((userBubble: UserBubbleReactionModel, idx: number) => (
                            <Grid item key={`${idx}_${String(userBubble.id)}`} sx={{ marginRight: '14px' }}>
                                <UserBubble imageLink={userBubble.getImageLink()} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Button>
            {isModalOpen ? (
                <UserBubbleReactionListModal
                    handleClose={() => {
                        setModalOpen(false);
                    }}
                    sortByTimestampLabel={props.sortByTimestampLabel}
                    apiPath={apiPath}
                    apiReactionSourceEntityIdValue={apiReactionSourceEntityIdValue}
                    modalTitle={modalTitle}
                />
            ) : null}
        </React.Fragment>
    );
};
export default UserBubbleReactionListModalButton;
