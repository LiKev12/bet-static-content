import { Box } from '@mui/material';
import PlaceholderImageUser from 'src/assets/PlaceholderImageUser.png';

export interface IUserBubbleProps {
    imageLink: string | null;
}
const UserBubble: React.FC<IUserBubbleProps> = (props: IUserBubbleProps) => {
    const { imageLink } = props;
    return (
        <Box
            component="img"
            src={imageLink ?? PlaceholderImageUser}
            sx={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                position: 'absolute',
            }}
        />
    );
};

export default UserBubble;
