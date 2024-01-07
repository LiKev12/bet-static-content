import { Box, Grid, Tooltip, Typography } from '@mui/material';
// import { MOCK_DAILY_ACTIVITY } from 'src/javascripts/mocks/Mocks';
import type NumberOfPointsInTasksCompletedOverTimeVisualizationModel__HeatmapChartDataPointModel from 'src/javascripts/models/NumberOfPointsInTasksCompletedOverTimeVisualizationModel__HeatmapChartDataPointModel';

export interface INumberOfPointsInTasksCompletedOverTimeVisualizationHeatmapChartProps {
    dataHeatmapChart: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__HeatmapChartDataPointModel[];
}

export interface INumberOfPointsInTasksCompletedOverTimeVisualizationHeatmapChartItem {
    date: string;
    dayOfWeek: string;
    points: number;
    pointsColor: string;
}

const DAYS_OF_WEEK_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_OF_WEEK_LABEL_TO_DAY_MAPPING: any = {
    Sun: 'SUNDAY',
    Mon: 'MONDAY',
    Tue: 'TUESDAY',
    Wed: 'WEDNESDAY',
    Thu: 'THURSDAY',
    Fri: 'FRIDAY',
    Sat: 'SATURDAY',
};

const MONTH_IDX_TO_MONTH_LABEL_MAPPING: any = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'Aug',
    '09': 'Sept',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
};
const NumberOfPointsInTasksCompletedOverTimeVisualizationHeatmapChart: React.FC<
    INumberOfPointsInTasksCompletedOverTimeVisualizationHeatmapChartProps
> = (props: INumberOfPointsInTasksCompletedOverTimeVisualizationHeatmapChartProps) => {
    const { dataHeatmapChart } = props;

    const numColumns = dataHeatmapChart.length / 7 + 1;
    const columnIdxAndValuesWithNewMonths = dataHeatmapChart
        .map(
            (
                datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__HeatmapChartDataPointModel,
                idx: number,
            ) => {
                const isFirstDayOfMonth = datapoint.getDateLabel().split('/')[2] === '01';
                return isFirstDayOfMonth
                    ? { columnIdx: Math.floor(idx / 7) + 1, newMonth: datapoint.getDateLabel().split('/')[1] }
                    : null;
            },
        )
        .filter((datapoint: any) => {
            return datapoint !== null;
        });

    const numColumnsIdxArr = [];
    for (let i = 0; i < numColumns; i++) {
        numColumnsIdxArr.push(i);
    }

    const rowMonthLabels = (
        <Grid container direction="row" wrap="nowrap">
            {numColumnsIdxArr.map((currColumnIdx: number) => {
                let isFirstDayOfMonth = false;
                let monthValue;
                for (let j = 0; j < columnIdxAndValuesWithNewMonths.length; j++) {
                    const { columnIdx, newMonth }: any = columnIdxAndValuesWithNewMonths[j];
                    if (columnIdx === currColumnIdx) {
                        isFirstDayOfMonth = true;
                        monthValue = newMonth;
                    }
                }
                if (isFirstDayOfMonth) {
                    return (
                        <Grid item key={`${currColumnIdx}_${String(monthValue)}`}>
                            <Box
                                sx={{
                                    padding: '8px',
                                    margin: '2px',
                                }}
                            >
                                <Typography sx={{ textAlign: 'center', fontSize: '12px' }}>
                                    {MONTH_IDX_TO_MONTH_LABEL_MAPPING[monthValue]}
                                </Typography>
                            </Box>
                        </Grid>
                    );
                }
                return (
                    <Grid item key={`${currColumnIdx}_emptyGridItem`}>
                        <Box sx={{ padding: '8px', width: '18px', height: '18px', margin: '2px' }}></Box>
                    </Grid>
                );
            })}
        </Grid>
    );

    const rowsData = DAYS_OF_WEEK_LABELS.map((dayOfWeek: string, idx: number) => {
        return (
            <Grid container direction="row" key={`${idx}_${dayOfWeek}_row`} wrap="nowrap">
                <Grid item key={`${idx}_${dayOfWeek}_gridItem`}>
                    <Box sx={{ padding: '8px', width: '18px', height: '18px', margin: '2px' }}>
                        <Typography sx={{ textAlign: 'center', fontSize: '12px' }}>{dayOfWeek}</Typography>
                    </Box>
                </Grid>
                {dataHeatmapChart
                    .filter(
                        (
                            datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__HeatmapChartDataPointModel,
                        ) => {
                            return DAY_OF_WEEK_LABEL_TO_DAY_MAPPING[dayOfWeek] === datapoint.getDayOfWeek();
                        },
                    )
                    .map(
                        (
                            datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__HeatmapChartDataPointModel,
                            idx: number,
                        ) => {
                            return (
                                <Tooltip
                                    key={`${idx}_${datapoint.getDateLabel()}_tooltip`}
                                    title={datapoint.getDateLabel()}
                                    placement="right"
                                >
                                    <Grid item key={`${idx}_${datapoint.getDateLabel()}_gridItem`}>
                                        <Box
                                            sx={{
                                                padding: '8px',
                                                backgroundColor: datapoint.getColor(),
                                                margin: '2px',
                                                width: '18px',
                                                height: '18px',
                                            }}
                                        >
                                            <Typography sx={{ textAlign: 'center', fontSize: '12px' }}>
                                                {datapoint.getIsAfterOrEqualToRelevantStartDate()
                                                    ? datapoint.getNumberOfPoints()
                                                    : null}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Tooltip>
                            );
                        },
                    )}
            </Grid>
        );
    });
    return (
        <Grid
            container
            direction="column"
            sx={{
                width: '800px',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'row-reverse',
            }}
        >
            <Grid item>{rowMonthLabels}</Grid>
            {DAYS_OF_WEEK_LABELS.map((dayOfWeek: string, idx: number) => {
                return (
                    <Grid item key={`${dayOfWeek}_fullRow`}>
                        {rowsData[idx]}
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default NumberOfPointsInTasksCompletedOverTimeVisualizationHeatmapChart;
