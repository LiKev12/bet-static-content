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

// interface IGraphData {
//     labels: string[];
//     datasets: Array<{
//         data: number[];
//         backgroundColor: string;
//         borderColor: string;
//         pointBorderColor: string;
//         pointBackgroundColor: string;
//         fill: boolean;
//     }>;
// }

const GRAPH_DEFAULT_COLORS = {
    backgroundColor: '#BDEDFF',
    borderColor: '#02b9ff',
    pointBorderColor: '#02ffc7',
    pointBackgroundColor: '#02ffc7',
};

// const getGraphData = (timeAggregationActiveTabIdx: number, isCumulative: boolean): IGraphData => {
//     if (timeAggregationActiveTabIdx === 0) {
//         // duration: WEEK, aggregation: DAY (7 days)
//         const data = MOCK_DAILY_ACTIVITY.slice(-7).map((a: any) => a.points);
//         const labels = MOCK_DAILY_ACTIVITY.slice(-7).map((a: any) => a.date);
//         return {
//             labels,
//             datasets: [
//                 {
//                     data,
//                     fill: isCumulative,
//                     ...GRAPH_DEFAULT_COLORS,
//                 },
//             ],
//         };
//     } else if (timeAggregationActiveTabIdx === 1) {
//         // duration: MONTH, aggregation: WEEK (4+1 = 5 weeks)
//         const numSundaysLimit = 5;
//         let numSundays = 0;
//         let idxFirstSunday = 0;
//         let idxLastSunday = 0;
//         for (let i = MOCK_DAILY_ACTIVITY.length - 1; i >= 0; i--) {
//             if (MOCK_DAILY_ACTIVITY[i].dayOfWeek === 'Sunday') {
//                 numSundays++;
//                 if (numSundays === numSundaysLimit) {
//                     idxFirstSunday = i;
//                 }
//             }
//         }
//         for (let i = 0; i < MOCK_DAILY_ACTIVITY.length; i++) {
//             if (MOCK_DAILY_ACTIVITY[i].dayOfWeek === 'Sunday') {
//                 idxLastSunday = i;
//             }
//         }
//         const data = [];
//         const labels = [];
//         let individualPointsSum = 0;
//         let cumulativePointsSum = 0;
//         // handle first four data points (normal)
//         for (let i = idxFirstSunday; i < idxLastSunday; i++) {
//             individualPointsSum += Number(MOCK_DAILY_ACTIVITY[i].points);
//             cumulativePointsSum += Number(MOCK_DAILY_ACTIVITY[i].points);
//             if (MOCK_DAILY_ACTIVITY[i].dayOfWeek === 'Saturday') {
//                 isCumulative ? data.push(cumulativePointsSum) : data.push(individualPointsSum);
//                 const labelDateStart: string = MOCK_DAILY_ACTIVITY[i - 6].date;
//                 const labelDateEnd: string = MOCK_DAILY_ACTIVITY[i].date;
//                 labels.push(`${labelDateStart}-${labelDateEnd}`);
//                 individualPointsSum = 0;
//             }
//         }
//         individualPointsSum = 0;
//         // handle last data point (which may not be a full week)
//         for (let i = idxLastSunday; i < MOCK_DAILY_ACTIVITY.length; i++) {
//             individualPointsSum += Number(MOCK_DAILY_ACTIVITY[i].points);
//             cumulativePointsSum += Number(MOCK_DAILY_ACTIVITY[i].points);
//         }
//         isCumulative ? data.push(cumulativePointsSum) : data.push(individualPointsSum);
//         const labelDateStart: string = MOCK_DAILY_ACTIVITY[idxLastSunday].date;
//         const labelDateEnd: string = MOCK_DAILY_ACTIVITY[MOCK_DAILY_ACTIVITY.length - 1].date;
//         labels.push(`${labelDateStart}-${labelDateEnd}`);
//         return {
//             labels,
//             datasets: [
//                 {
//                     data,
//                     fill: isCumulative,
//                     ...GRAPH_DEFAULT_COLORS,
//                 },
//             ],
//         };
//     } else {
//         // duration: YEAR, aggregation: MONTH (12+1 = 13 months)
//         const numDayOnesOfMonthLimit = 13;
//         let numDayOnesOfMonth = 0;
//         let idxFirstDayOne = 0;
//         let idxLastDayOne = 0;
//         for (let i = MOCK_DAILY_ACTIVITY.length - 1; i >= 0; i--) {
//             if (MOCK_DAILY_ACTIVITY[i].date.split('/')[2] === '01') {
//                 numDayOnesOfMonth++;
//                 if (numDayOnesOfMonth === numDayOnesOfMonthLimit) {
//                     idxFirstDayOne = i;
//                 }
//             }
//         }
//         for (let i = 0; i < MOCK_DAILY_ACTIVITY.length; i++) {
//             if (MOCK_DAILY_ACTIVITY[i].date.split('/')[2] === '01') {
//                 idxLastDayOne = i;
//             }
//         }
//         const data = [];
//         const labels = [];
//         let individualPointsSum = 0;
//         let cumulativePointsSum = 0;
//         // handle first 12 data points (normal)
//         for (let i = idxFirstDayOne; i < idxLastDayOne; i++) {
//             individualPointsSum += Number(MOCK_DAILY_ACTIVITY[i].points);
//             cumulativePointsSum += Number(MOCK_DAILY_ACTIVITY[i].points);
//             const isCurrDayLastDayOfMonth =
//                 MOCK_DAILY_ACTIVITY[i].date.split('/')[1] !== MOCK_DAILY_ACTIVITY[i + 1].date.split('/')[1];
//             if (isCurrDayLastDayOfMonth) {
//                 isCumulative ? data.push(cumulativePointsSum) : data.push(individualPointsSum);
//                 const firstDateOfMonth = `${String(MOCK_DAILY_ACTIVITY[i].date.split('/')[0])}/${String(
//                     MOCK_DAILY_ACTIVITY[i].date.split('/')[1],
//                 )}/01`;
//                 labels.push(`${firstDateOfMonth}-${String(MOCK_DAILY_ACTIVITY[i].date)}`);
//                 individualPointsSum = 0;
//             }
//         }
//         individualPointsSum = 0;
//         // handle last data point (which may not be a full month)
//         for (let i = idxLastDayOne; i < MOCK_DAILY_ACTIVITY.length; i++) {
//             individualPointsSum += Number(MOCK_DAILY_ACTIVITY[i].points);
//         }
//         isCumulative ? data.push(cumulativePointsSum) : data.push(individualPointsSum);
//         labels.push(
//             `${String(MOCK_DAILY_ACTIVITY[idxLastDayOne].date)}-${String(
//                 MOCK_DAILY_ACTIVITY[MOCK_DAILY_ACTIVITY.length - 1].date,
//             )}`,
//         );
//         return {
//             labels,
//             datasets: [
//                 {
//                     data,
//                     fill: isCumulative,
//                     ...GRAPH_DEFAULT_COLORS,
//                 },
//             ],
//         };
//     }
// };
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
