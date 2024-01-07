import React from 'react';
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
import FolderIcon from '@mui/icons-material/Folder';

export interface IUserListModalProps {
    isOpen: boolean;
    handleClose: any;
}

const UserListModal: React.FC<IUserListModalProps> = (props: IUserListModalProps) => {
    const { isOpen, handleClose } = props;
    return (
        <Dialog open={isOpen} onClose={handleClose} fullWidth>
            <DialogTitle>Users</DialogTitle>
            <DialogContent>
                <Box sx={{ height: '400px', overflowY: 'auto' }}>
                    <Grid item>
                        <List dense={false}>
                            {[].map((userListModalItem: any, idx: number) => {
                                return (
                                    <React.Fragment key={`${idx}_${String(userListModalItem.id)}`}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <FolderIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={userListModalItem.username} />
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
    );
};

export default UserListModal;
