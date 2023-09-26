import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
} from '@mui/material';
import UserBubbleList from 'src/javascripts/components/UserBubbleList';
import FolderIcon from '@mui/icons-material/Folder';
import type { IUserBubbleProps } from 'src/javascripts/components/UserBubble';

export interface IUserBubbleListButtonProps {
    userBubbles: IUserBubbleProps[];
}

const UserBubbleListButton: React.FC<IUserBubbleListButtonProps> = (props: IUserBubbleListButtonProps) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };
    return (
        <React.Fragment>
            <Button
                sx={{
                    paddingLeft: '12px',
                    paddingRight: '16px',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                }}
                variant="contained"
                onClick={handleClickOpen}
            >
                <Box sx={{ paddingBottom: '24px' }}>
                    <UserBubbleList userBubbles={props.userBubbles} />
                </Box>
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Users</DialogTitle>
                <DialogContent>
                    <Box sx={{ height: '400px', overflowY: 'auto' }}>
                        <Grid item>
                            <List dense={false}>
                                {props.userBubbles.map((userBubble: IUserBubbleProps, idx: number) => {
                                    return (
                                        <React.Fragment key={`${idx}_${userBubble.userName}`}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <FolderIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={userBubble.userName} />
                                            </ListItem>
                                            <Divider variant="fullWidth" />
                                        </React.Fragment>
                                    );
                                })}
                            </List>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default UserBubbleListButton;
