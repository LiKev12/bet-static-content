import { Box, CircularProgress, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import NumberOfPointsInTasksCompletedOverTimeVisualizationHeatmapChart from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualizationHeatmapChart';
import NumberOfPointsInTasksCompletedOverTimeVisualizationLineChart from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualizationLineChart';
import NumberOfPointsInTasksCompletedOverTimeVisualizationModel from 'src/javascripts/models/NumberOfPointsInTasksCompletedOverTimeVisualizationModel';
import ResponseModel from 'src/javascripts/models/ResponseModel';

import type { IRootState } from 'src/javascripts/store';
const NumberOfPointsInTasksCompletedOverTimeVisualization: React.FC = () => {
    const sliceVisualizationState = useSelector((state: IRootState) => state.visualization);
    const sliceVisualizationStateData = new NumberOfPointsInTasksCompletedOverTimeVisualizationModel(
        sliceVisualizationState.data,
    );
    const sliceVisualizationStateResponse = new ResponseModel(sliceVisualizationState.response);
    return sliceVisualizationStateResponse.getIsLoading() &&
        sliceVisualizationStateData.getDataHeatmapChart().length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    ) : (
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
                        dataHeatmapChart={sliceVisualizationStateData.getDataHeatmapChart()}
                    />
                    <NumberOfPointsInTasksCompletedOverTimeVisualizationLineChart
                        dataLineChartAggregateDayNotCumulative={sliceVisualizationStateData.getDataLineChart_AggregateDay_NotCumulative()}
                        dataLineChartAggregateDayCumulative={sliceVisualizationStateData.getDataLineChart_AggregateDay_Cumulative()}
                        dataLineChartAggregateWeekNotCumulative={sliceVisualizationStateData.getDataLineChart_AggregateWeek_NotCumulative()}
                        dataLineChartAggregateWeekCumulative={sliceVisualizationStateData.getDataLineChart_AggregateWeek_Cumulative()}
                        dataLineChartAggregateMonthNotCumulative={sliceVisualizationStateData.getDataLineChart_AggregateMonth_NotCumulative()}
                        dataLineChartAggregateMonthCumulative={sliceVisualizationStateData.getDataLineChart_AggregateMonth_Cumulative()}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default NumberOfPointsInTasksCompletedOverTimeVisualization;
