import NumberOfPointsInTasksCompletedOverTimeVisualizationModel__HeatmapChartDataPointModel from 'src/javascripts/models/NumberOfPointsInTasksCompletedOverTimeVisualizationModel__HeatmapChartDataPointModel';
import NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel from 'src/javascripts/models/NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel';

export default class NumberOfPointsInTasksCompletedOverTimeVisualizationModel {
    dataHeatmapChart: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__HeatmapChartDataPointModel[];
    dataLineChartAggregateDayNotCumulative: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[];
    dataLineChartAggregateDayCumulative: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[];
    dataLineChartAggregateWeekNotCumulative: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[];
    dataLineChartAggregateWeekCumulative: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[];
    dataLineChartAggregateMonthNotCumulative: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[];
    dataLineChartAggregateMonthCumulative: NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[];

    constructor(numberOfPointsInTasksCompletedOverTimeVisualizationModel: any) {
        this.dataHeatmapChart = numberOfPointsInTasksCompletedOverTimeVisualizationModel.dataHeatmapChart.map(
            (datapoint: any) =>
                new NumberOfPointsInTasksCompletedOverTimeVisualizationModel__HeatmapChartDataPointModel(datapoint),
        );

        this.dataLineChartAggregateDayNotCumulative =
            numberOfPointsInTasksCompletedOverTimeVisualizationModel.dataLineChart_AggregateDay_NotCumulative.map(
                (datapoint: any) =>
                    new NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel(datapoint),
            );
        this.dataLineChartAggregateDayCumulative =
            numberOfPointsInTasksCompletedOverTimeVisualizationModel.dataLineChart_AggregateDay_Cumulative.map(
                (datapoint: any) =>
                    new NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel(datapoint),
            );
        this.dataLineChartAggregateWeekNotCumulative =
            numberOfPointsInTasksCompletedOverTimeVisualizationModel.dataLineChart_AggregateWeek_NotCumulative.map(
                (datapoint: any) =>
                    new NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel(datapoint),
            );
        this.dataLineChartAggregateWeekCumulative =
            numberOfPointsInTasksCompletedOverTimeVisualizationModel.dataLineChart_AggregateWeek_Cumulative.map(
                (datapoint: any) =>
                    new NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel(datapoint),
            );
        this.dataLineChartAggregateMonthNotCumulative =
            numberOfPointsInTasksCompletedOverTimeVisualizationModel.dataLineChart_AggregateMonth_NotCumulative.map(
                (datapoint: any) =>
                    new NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel(datapoint),
            );
        this.dataLineChartAggregateMonthCumulative =
            numberOfPointsInTasksCompletedOverTimeVisualizationModel.dataLineChart_AggregateMonth_Cumulative.map(
                (datapoint: any) =>
                    new NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel(datapoint),
            );
    }

    getDataHeatmapChart(): NumberOfPointsInTasksCompletedOverTimeVisualizationModel__HeatmapChartDataPointModel[] {
        return this.dataHeatmapChart;
    }

    getDataLineChart_AggregateDay_NotCumulative(): NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[] {
        return this.dataLineChartAggregateDayNotCumulative;
    }

    getDataLineChart_AggregateDay_Cumulative(): NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[] {
        return this.dataLineChartAggregateDayCumulative;
    }

    getDataLineChart_AggregateWeek_NotCumulative(): NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[] {
        return this.dataLineChartAggregateWeekNotCumulative;
    }

    getDataLineChart_AggregateWeek_Cumulative(): NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[] {
        return this.dataLineChartAggregateWeekCumulative;
    }

    getDataLineChart_AggregateMonth_NotCumulative(): NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[] {
        return this.dataLineChartAggregateMonthNotCumulative;
    }

    getDataLineChart_AggregateMonth_Cumulative(): NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel[] {
        return this.dataLineChartAggregateMonthCumulative;
    }
}
