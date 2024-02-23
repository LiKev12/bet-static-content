import { Box, CircularProgress, Grid } from '@mui/material';
import NumberOfPointsInTasksCompletedOverTimeVisualizationHeatmapChart from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualizationHeatmapChart';
import NumberOfPointsInTasksCompletedOverTimeVisualizationLineChart from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualizationLineChart';
import type NumberOfPointsInTasksCompletedOverTimeVisualizationModel from 'src/javascripts/models/NumberOfPointsInTasksCompletedOverTimeVisualizationModel';
import type ResponseModel from 'src/javascripts/models/ResponseModel';

export interface IPointsDisplayProps {
    data: NumberOfPointsInTasksCompletedOverTimeVisualizationModel;
    response: ResponseModel;
}
const NumberOfPointsInTasksCompletedOverTimeVisualization: React.FC<IPointsDisplayProps> = (
    props: IPointsDisplayProps,
) => {
    const { data, response } = props;

    return !response.getIsLoading() ? (
        <Box
            sx={{
                borderRadius: '8px',
                padding: '24px',
                paddingTop: '0px',
            }}
        >
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <NumberOfPointsInTasksCompletedOverTimeVisualizationHeatmapChart
                        dataHeatmapChart={data.getDataHeatmapChart()}
                    />
                    <NumberOfPointsInTasksCompletedOverTimeVisualizationLineChart
                        dataLineChartAggregateDayNotCumulative={data.getDataLineChart_AggregateDay_NotCumulative()}
                        dataLineChartAggregateDayCumulative={data.getDataLineChart_AggregateDay_Cumulative()}
                        dataLineChartAggregateWeekNotCumulative={data.getDataLineChart_AggregateWeek_NotCumulative()}
                        dataLineChartAggregateWeekCumulative={data.getDataLineChart_AggregateWeek_Cumulative()}
                        dataLineChartAggregateMonthNotCumulative={data.getDataLineChart_AggregateMonth_NotCumulative()}
                        dataLineChartAggregateMonthCumulative={data.getDataLineChart_AggregateMonth_Cumulative()}
                    />
                </Grid>
            </Grid>
        </Box>
    ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    );
};

export default NumberOfPointsInTasksCompletedOverTimeVisualization;
