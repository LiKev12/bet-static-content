import { Box } from '@mui/material';
export interface IUserBubbleProps {
    id: string;
    userName: string;
    mockColor: string;
}

const UserBubble: React.FC<IUserBubbleProps> = (props: IUserBubbleProps) => {
    return (
        <Box
            sx={{
                backgroundColor: props.mockColor,
                border: '2px solid #979797',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                position: 'absolute',
            }}
        ></Box>
    );
};

export default UserBubble;
