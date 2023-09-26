import React from 'react';
import { Box, Grid } from '@mui/material';
import UserBubble from 'src/javascripts/components/UserBubble';
import type { IUserBubbleProps } from 'src/javascripts/components/UserBubble';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
export interface IUserBubbleListProps {
    userBubbles: IUserBubbleProps[];
}

const UserBubbleList: React.FC<IUserBubbleListProps> = (props: IUserBubbleListProps) => {
    const { userBubbles } = props;
    const hasMoreUserBubbles = userBubbles.length > 3;
    const displayedUserBubbles = userBubbles.slice(0, 3).reverse();
    return (
        <React.Fragment>
            <Grid container direction="row-reverse" sx={{ justifyContent: 'flex-end', marginTop: '4px' }}>
                {hasMoreUserBubbles ? (
                    <Grid item sx={{ marginLeft: '6px', marginRight: '16px' }}>
                        <Box sx={{ position: 'absolute' }}>
                            <MoreHorizIcon />
                        </Box>
                    </Grid>
                ) : null}
                {displayedUserBubbles.map((userBubble, idx: number) => (
                    <Grid item key={userBubble.id} sx={{ marginRight: '14px' }}>
                        <UserBubble
                            key={`${idx}_${userBubble.id}`}
                            id={userBubble.id}
                            userName={userBubble.userName}
                            mockColor={userBubble.mockColor}
                        />
                    </Grid>
                ))}
            </Grid>
        </React.Fragment>
    );
};

export default UserBubbleList;
