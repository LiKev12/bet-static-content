import { Button } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';

export interface IFollowUserButtonProps {
    isFollowing: boolean;
}

const FollowUserButton: React.FC<IFollowUserButtonProps> = (props: IFollowUserButtonProps) => {
    const { isFollowing } = props;
    if (isFollowing) {
        return (
            <Button
                variant="contained"
                disabled
                sx={{
                    width: '100%',
                    '&.Mui-disabled': {
                        background: THEME.palette.success.light,
                        color: THEME.palette.success.contrastText,
                    },
                }}
            >
                {'\u2713 Following'}
            </Button>
        );
    }
    return (
        <Button variant="contained" sx={{ width: '100%' }}>
            Follow
        </Button>
    );
};

export default FollowUserButton;
