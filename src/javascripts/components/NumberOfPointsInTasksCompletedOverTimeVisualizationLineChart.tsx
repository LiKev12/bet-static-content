import { useState } from 'react';
import { Box, FormGroup, FormControlLabel, Switch, Tab, Tabs } from '@mui/material';
// import { THEME } from 'src/javascripts/Theme';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend, Filler } from 'chart.js';
import type NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel from 'src/javascripts/models/NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Legend);

export interface IPointsDisplayProps {
    dataLineChartAggregateDayNotCumulative: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[];
    dataLineChartAggregateDayCumulative: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[];
    dataLineChartAggregateWeekNotCumulative: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[];
    dataLineChartAggregateWeekCumulative: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[];
    dataLineChartAggregateMonthNotCumulative: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[];
    dataLineChartAggregateMonthCumulative: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[];
}
const GRAPH_DEFAULT_COLORS = {
    backgroundColor: '#BDEDFF',
    borderColor: '#02b9ff',
    pointBorderColor: '#02ffc7',
    pointBackgroundColor: '#02ffc7',
};

const NumberOfPointsInTasksCompletedOverTimeVisualizationLineChart: React.FC<IPointsDisplayProps> = (
    props: IPointsDisplayProps,
) => {
    const [timeAggregationActiveTabIdx, setTimeAggregationActiveTabIdx] = useState(0);
    const [isCumulative, setCumulative] = useState(false);

    const {
        dataLineChartAggregateDayNotCumulative,
        dataLineChartAggregateDayCumulative,
        dataLineChartAggregateWeekNotCumulative,
        dataLineChartAggregateWeekCumulative,
        dataLineChartAggregateMonthNotCumulative,
        dataLineChartAggregateMonthCumulative,
    } = props;

    let data = dataLineChartAggregateDayNotCumulative.map(
        (datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel) =>
            datapoint.getNumberOfPoints(),
    );
    let labels = dataLineChartAggregateDayNotCumulative.map(
        (datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel) =>
            datapoint.getDateLabel(),
    );

    if (timeAggregationActiveTabIdx === 0) {
        if (!isCumulative) {
            data = dataLineChartAggregateDayNotCumulative.map(
                (datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel) =>
                    datapoint.getNumberOfPoints(),
            );
            labels = dataLineChartAggregateDayNotCumulative.map(
                (datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel) =>
                    datapoint.getDateLabel(),
            );
        } else {
            data = dataLineChartAggregateDayCumulative.map(
                (datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel) =>
                    datapoint.getNumberOfPoints(),
            );
            labels = dataLineChartAggregateDayCumulative.map(
                (datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel) =>
                    datapoint.getDateLabel(),
            );
        }
    } else if (timeAggregationActiveTabIdx === 1) {
        if (!isCumulative) {
            data = dataLineChartAggregateWeekNotCumulative.map(
                (datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel) =>
                    datapoint.getNumberOfPoints(),
            );
            labels = dataLineChartAggregateWeekNotCumulative.map(
                (datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel) =>
                    datapoint.getDateLabel(),
            );
        } else {
            data = dataLineChartAggregateWeekCumulative.map(
                (datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel) =>
                    datapoint.getNumberOfPoints(),
            );
            labels = dataLineChartAggregateWeekCumulative.map(
                (datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel) =>
                    datapoint.getDateLabel(),
            );
        }
    } else if (timeAggregationActiveTabIdx === 2) {
        if (!isCumulative) {
            data = dataLineChartAggregateMonthNotCumulative.map(
                (datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel) =>
                    datapoint.getNumberOfPoints(),
            );
            labels = dataLineChartAggregateMonthNotCumulative.map(
                (datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel) =>
                    datapoint.getDateLabel(),
            );
        } else {
            data = dataLineChartAggregateMonthCumulative.map(
                (datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel) =>
                    datapoint.getNumberOfPoints(),
            );
            labels = dataLineChartAggregateMonthCumulative.map(
                (datapoint: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel) =>
                    datapoint.getDateLabel(),
            );
        }
    }
    const minimumValue = Math.min(...data) >= 0 ? 0 : Math.min(...data);

    const aggregatePointsSwitch = (
        <Switch
            checked={isCumulative}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCumulative(event.target.checked);
            }}
        />
    );
    return (
        <Box sx={{ padding: '8px' }}>
            <Tabs
                value={timeAggregationActiveTabIdx}
                onChange={(e, activeTabIdx: number) => {
                    setTimeAggregationActiveTabIdx(activeTabIdx);
                }}
                indicatorColor="primary"
                centered
            >
                <Tab sx={{ width: '150px' }} label="Past Week" />
                <Tab sx={{ width: '150px' }} label="Past Month" />
                <Tab sx={{ width: '150px' }} label="Past Year" />
            </Tabs>
            <FormGroup>
                <FormControlLabel control={aggregatePointsSwitch} label="Cumulative" />
            </FormGroup>
            <Line
                data={{
                    labels,
                    datasets: [
                        {
                            data,
                            fill: isCumulative,
                            ...GRAPH_DEFAULT_COLORS,
                        },
                    ],
                }}
                options={{
                    plugins: {
                        legend: { display: false },
                    },
                    scales: {
                        y: {
                            min: minimumValue,
                        },
                    },
                }}
            ></Line>
        </Box>
    );
};

export default NumberOfPointsInTasksCompletedOverTimeVisualizationLineChart;
