import { Button } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';

export interface IJoinPodButtonProps {
    isMember: boolean;
}

const JoinPodButton: React.FC<IJoinPodButtonProps> = (props: IJoinPodButtonProps) => {
    const { isMember } = props;
    if (isMember) {
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
                {'\u2713 Joined Pod'}
            </Button>
        );
    }
    return (
        <Button variant="contained" sx={{ width: '100%' }}>
            Join Pod
        </Button>
    );
};

export default JoinPodButton;
