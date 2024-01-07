import React, { useState } from 'react';
import { Button } from '@mui/material';
import UserListModal from 'src/javascripts/components/UserListModal';

const UserListButton: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
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
                onClick={() => {
                    setModalOpen(true);
                }}
            >
                See Users
            </Button>
            <UserListModal
                isOpen={isModalOpen}
                handleClose={() => {
                    setModalOpen(false);
                }}
            />
        </React.Fragment>
    );
};

export default UserListButton;

// import { Box } from '@mui/material';
// import { getHashFromString } from 'src/javascripts/utilities';

// export interface IUserBubbleProps {
//     image: string;
// }

// const MOCK_COLORS = [
//     'maroon',
//     'red',
//     'purple',
//     'fuchsia',
//     'green',
//     'lime',
//     'olive',
//     'yellow',
//     'navy',
//     'blue',
//     'teal',
//     'aqua',
// ];

// const UserBubble: React.FC<IUserBubbleProps> = (props: IUserBubbleProps) => {
//     const { image } = props;
//     const mockColor: string = MOCK_COLORS[getHashFromString(image) % MOCK_COLORS.length];
//     return (
//         <Box
//             sx={{
//                 backgroundColor: mockColor,
//                 border: '2px solid #979797',
//                 width: '16px',
//                 height: '16px',
//                 borderRadius: '50%',
//                 position: 'absolute',
//             }}
//         ></Box>
//     );
// };

// export default UserBubble;

// import React from 'react';
// import {
//     Box,
//     Button,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Divider,
//     Grid,
//     List,
//     ListItem,
//     ListItemText,
//     ListItemAvatar,
//     Avatar,
// } from '@mui/material';
// import FolderIcon from '@mui/icons-material/Folder';

// export interface IUserListModalItemProps {
//     id: string;
//     image: string;
//     username: string;
//     name: string;
// }

// export interface IUserListModalProps {
//     isOpen: boolean;
//     handleClose: any;
//     userListModalItems: IUserListModalItemProps[];
// }

// const UserListModal: React.FC<IUserListModalProps> = (props: IUserListModalProps) => {
//     const { isOpen, handleClose, userListModalItems } = props;
//     return (
//         <Dialog open={isOpen} onClose={handleClose} fullWidth>
//             <DialogTitle>Users</DialogTitle>
//             <DialogContent>
//                 <Box sx={{ height: '400px', overflowY: 'auto' }}>
//                     <Grid item>
//                         <List dense={false}>
//                             {userListModalItems.map((userListModalItem: IUserListModalItemProps, idx: number) => {
//                                 return (
//                                     <React.Fragment key={`${idx}_${String(userListModalItem.id)}`}>
//                                         <ListItem>
//                                             <ListItemAvatar>
//                                                 <Avatar>
//                                                     <FolderIcon />
//                                                 </Avatar>
//                                             </ListItemAvatar>
//                                             <ListItemText primary={userListModalItem.username} />
//                                         </ListItem>
//                                         <Divider variant="fullWidth" />
//                                     </React.Fragment>
//                                 );
//                             })}
//                         </List>
//                     </Grid>
//                 </Box>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={handleClose}>Close</Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default UserListModal;

// import React, { useState } from 'react';
// import { Box, Button, Grid } from '@mui/material';
// import UserListModal from 'src/javascripts/snippets/UserListModal';
// import UserBubble from 'src/javascripts/snippets/UserBubble';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// import type { IUserListModalItemProps } from 'src/javascripts/snippets/UserListModal';

// export interface IUserListButtonBubbleProps {
//     id: string;
//     image: string;
// }

// export interface IUserListButtonProps {
//     userListButtonBubbles: IUserListButtonBubbleProps[];
//     userListModalItems: IUserListModalItemProps[];
// }

// const UserListButton: React.FC<IUserListButtonProps> = (props: IUserListButtonProps) => {
//     const [isModalOpen, setModalOpen] = useState(false);
//     const { userListButtonBubbles, userListModalItems } = props;
//     return (
//         <React.Fragment>
//             <Button
//                 sx={{
//                     paddingLeft: '12px',
//                     paddingRight: '16px',
//                     paddingTop: '4px',
//                     paddingBottom: '4px',
//                 }}
//                 variant="contained"
//                 onClick={() => {
//                     setModalOpen(true);
//                 }}
//             >
//                 <Box sx={{ paddingBottom: '24px' }}>
//                     <Grid container direction="row-reverse" sx={{ justifyContent: 'flex-end', marginTop: '4px' }}>
//                         <Grid item sx={{ marginLeft: '6px', marginRight: '16px' }}>
//                             <Box sx={{ position: 'absolute' }}>
//                                 <MoreHorizIcon />
//                             </Box>
//                         </Grid>
//                         {userListButtonBubbles.map((userListButtonBubble: IUserListButtonBubbleProps, idx: number) => (
//                             <Grid item key={`${idx}_${String(userListButtonBubble.id)}`} sx={{ marginRight: '14px' }}>
//                                 <UserBubble image={userListButtonBubble.image} />
//                             </Grid>
//                         ))}
//                     </Grid>
//                 </Box>
//             </Button>
//             <UserListModal
//                 isOpen={isModalOpen}
//                 handleClose={() => {
//                     setModalOpen(false);
//                 }}
//                 userListModalItems={userListModalItems}
//             />
//         </React.Fragment>
//     );
// };

// export default UserListButton;
