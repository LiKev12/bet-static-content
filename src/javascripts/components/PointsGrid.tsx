import { Box, Grid, Typography } from '@mui/material';
import { MOCK_DAILY_ACTIVITY } from 'src/javascripts/mocks/MockPointsGrid';

export interface IPointsGridProps {
    id: string;
}

export interface IPointsGridItem {
    date: string;
    dayOfWeek: string;
    points: number;
    pointsColor: string;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const FILLER_FIRST_ROW_COLUMN_ITEM = (
    <Grid item>
        <Box sx={{ padding: '8px', width: '18px', height: '18px', margin: '2px' }}></Box>
    </Grid>
);

const PointsGrid: React.FC<IPointsGridProps> = (props: IPointsGridProps) => {
    const dailyActivityRows = [];
    const daysOfWeek = (
        <Grid item>
            <Grid container direction="column">
                {FILLER_FIRST_ROW_COLUMN_ITEM}
                {DAYS_OF_WEEK.map((dayOfWeek, idx) => (
                    <Grid key={`${idx}_${dayOfWeek}`} item>
                        <Box sx={{ padding: '8px', width: '18px', height: '18px', margin: '2px' }}>
                            <Typography sx={{ textAlign: 'center', fontSize: '12px' }}>{dayOfWeek}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
    dailyActivityRows.push(daysOfWeek);
    const numWeeks = MOCK_DAILY_ACTIVITY.filter((data) => data.dayOfWeek === 'Saturday').length;
    for (let i = 0; i < numWeeks; i++) {
        const dailyActivityColumnItems = [];
        let columnContainsFirstDayOfMonth = false;
        let newMonth = '';
        for (let idx = i * 7; idx < (i + 1) * 7; idx++) {
            const { date } = MOCK_DAILY_ACTIVITY[idx];
            if (date.split('/')[2] === '01') {
                columnContainsFirstDayOfMonth = true;
                newMonth = date.split('/')[1];
            }
        }
        const newMonthLabelColumnItem = columnContainsFirstDayOfMonth ? (
            <Grid item>
                <Box
                    sx={{
                        padding: '8px',
                        margin: '2px',
                    }}
                >
                    <Typography sx={{ textAlign: 'center', fontSize: '12px' }}>{newMonth}</Typography>
                </Box>
            </Grid>
        ) : (
            FILLER_FIRST_ROW_COLUMN_ITEM
        );
        dailyActivityColumnItems.push(newMonthLabelColumnItem);
        for (let idx = i * 7; idx < (i + 1) * 7; idx++) {
            const dailyActivityDataPoint = MOCK_DAILY_ACTIVITY[idx];
            dailyActivityColumnItems.push(
                <Grid key={`${idx}_${dailyActivityDataPoint.points}`} item>
                    <Box
                        sx={{
                            padding: '8px',
                            backgroundColor: dailyActivityDataPoint.pointsColor,
                            margin: '2px',
                            width: '18px',
                            height: '18px',
                        }}
                    >
                        <Typography sx={{ textAlign: 'center', fontSize: '12px' }}>
                            {dailyActivityDataPoint.points}
                        </Typography>
                    </Box>
                </Grid>,
            );
        }
        const dailyActivityColumn = (
            <Grid container direction="column">
                {dailyActivityColumnItems}
            </Grid>
        );
        const dailyActivityRowItem = <Grid item>{dailyActivityColumn}</Grid>;
        dailyActivityRows.push(dailyActivityRowItem);
    }
    console.log({ dailyActivityRows });

    return (
        <Grid container direction="row" sx={{ border: '1px solid green', marginBottom: '24px' }}>
            {dailyActivityRows}
        </Grid>
    );
};

export default PointsGrid;
