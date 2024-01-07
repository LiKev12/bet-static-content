import { Button } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';

export interface ICollectStampButtonProps {
    isCollected: boolean;
    numTasksCompleted: number;
    numTasksTotal: number;
}

const CollectStampButton: React.FC<ICollectStampButtonProps> = (props: ICollectStampButtonProps) => {
    const { isCollected, numTasksCompleted, numTasksTotal } = props;
    if (isCollected) {
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
                {'\u2713 Stamp Collected'}
            </Button>
        );
    }
    if (numTasksCompleted !== numTasksTotal) {
        return (
            <Button
                variant="contained"
                color="success"
                disabled
                sx={{
                    width: '100%',
                    '&.Mui-disabled': {
                        background: THEME.palette.warning.light,
                        color: THEME.palette.warning.contrastText,
                    },
                }}
            >
                {`${numTasksCompleted}/${numTasksTotal} Tasks Completed`}
            </Button>
        );
    }
    return (
        <Button
            variant="contained"
            sx={{ width: '100%' }}
            // onClick={} // handle submit collect stamp
        >
            Collect Stamp
        </Button>
    );
};

export default CollectStampButton;
