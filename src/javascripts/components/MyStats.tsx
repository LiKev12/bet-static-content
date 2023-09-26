import { Box, Grid } from '@mui/material';
import PointsGrid from 'src/javascripts/components/PointsGrid';
import PointsDisplay from 'src/javascripts/components/PointsGraph';
import { THEME } from 'src/javascripts/Theme';

export interface IMyStatsProps {
    id: string;
}

const MyStats: React.FC<IMyStatsProps> = (props: IMyStatsProps) => {
    return (
        <Box
            sx={{
                backgroundColor: THEME.palette.background.default,
                borderRadius: '8px',
                padding: '24px',
            }}
        >
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <PointsGrid id="temp_id" />
                    <PointsDisplay id="temp_id" />
                </Grid>
            </Grid>
        </Box>
    );
};

export default MyStats;
