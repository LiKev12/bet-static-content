import { useState, useEffect } from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import NumberOfPointsInTasksCompletedOverTimeVisualizationHeatmapChart from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualizationHeatmapChart';
import NumberOfPointsInTasksCompletedOverTimeVisualizationLineChart from 'src/javascripts/components/NumberOfPointsInTasksCompletedOverTimeVisualizationLineChart';
import { MOCK_MY_USER_ID } from 'src/javascripts/mocks/Mocks';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import NumberOfPointsInTasksCompletedOverTimeVisualizationModel from 'src/javascripts/models/NumberOfPointsInTasksCompletedOverTimeVisualizationModel';

export interface IPointsDisplayProps {
    apiPath: string;
    refreshSwitchValue: boolean; // short of refactoring to redux, we need to toggle this to refresh upon completing a personal task, as that is the only page which requires manually refresh (other pages, like Pod, have the viz tucked away in a separate tab from tasks, which loads anew each time)
}

export interface INumberOfPointsInTasksCompletedOverTimeVisualizationStateType {
    data: any;
    isLoading: boolean;
    responseError: any;
}
const NumberOfPointsInTasksCompletedOverTimeVisualization: React.FC<IPointsDisplayProps> = (
    props: IPointsDisplayProps,
) => {
    const { apiPath, refreshSwitchValue } = props;
    const [
        numberOfPointsInTasksCompletedOverTimeVisualizationState,
        setNumberOfPointsInTasksCompletedOverTimeVisualizationState,
    ] = useState<INumberOfPointsInTasksCompletedOverTimeVisualizationStateType>({
        data: {},
        isLoading: true,
        responseError: null,
    });
    const handleGetResouorceNumberOfPointsInTasksCompletedOverTimeVisualization = (
        pathApi: string,
        queryParamsObject: Record<string, unknown>,
    ): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                setNumberOfPointsInTasksCompletedOverTimeVisualizationState((prevState: any) => {
                    const numberOfPointsInTasksCompletedOverTimeVisualizationModel =
                        new NumberOfPointsInTasksCompletedOverTimeVisualizationModel(responseJson);
                    return {
                        ...prevState,
                        data: numberOfPointsInTasksCompletedOverTimeVisualizationModel,
                        isLoading: false,
                    };
                });
            })
            .catch((responseError: any) => {
                setNumberOfPointsInTasksCompletedOverTimeVisualizationState((prevState: any) => {
                    return {
                        ...prevState,
                        isLoading: true,
                        responseError,
                    };
                });
            });
    };
    useEffect(() => {
        handleGetResouorceNumberOfPointsInTasksCompletedOverTimeVisualization(apiPath, {
            idUser: MOCK_MY_USER_ID,
        });
    }, [apiPath, refreshSwitchValue]);

    return !numberOfPointsInTasksCompletedOverTimeVisualizationState.isLoading ? (
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
                        dataHeatmapChart={numberOfPointsInTasksCompletedOverTimeVisualizationState.data.getDataHeatmapChart()}
                    />
                    <NumberOfPointsInTasksCompletedOverTimeVisualizationLineChart
                        dataLineChartAggregateDayNotCumulative={numberOfPointsInTasksCompletedOverTimeVisualizationState.data.getDataLineChart_AggregateDay_NotCumulative()}
                        dataLineChartAggregateDayCumulative={numberOfPointsInTasksCompletedOverTimeVisualizationState.data.getDataLineChart_AggregateDay_Cumulative()}
                        dataLineChartAggregateWeekNotCumulative={numberOfPointsInTasksCompletedOverTimeVisualizationState.data.getDataLineChart_AggregateWeek_NotCumulative()}
                        dataLineChartAggregateWeekCumulative={numberOfPointsInTasksCompletedOverTimeVisualizationState.data.getDataLineChart_AggregateWeek_Cumulative()}
                        dataLineChartAggregateMonthNotCumulative={numberOfPointsInTasksCompletedOverTimeVisualizationState.data.getDataLineChart_AggregateMonth_NotCumulative()}
                        dataLineChartAggregateMonthCumulative={numberOfPointsInTasksCompletedOverTimeVisualizationState.data.getDataLineChart_AggregateMonth_Cumulative()}
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
