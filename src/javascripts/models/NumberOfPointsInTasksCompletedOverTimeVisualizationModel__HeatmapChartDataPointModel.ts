export default class NumberOfPointsInTasksCompletedOverTimeVisualizationModel__HeatmapChartDataPointModel {
    numberOfPoints: number;
    numberOfTasksComplete: number;
    color: string;
    dateLabel: string;
    dayOfWeek: string;
    isAfterOrEqualToRelevantStartDate: boolean;
    isBeforeOrEqualToRelevantEndDate: boolean;
    isToday: boolean;

    constructor(heatmapChartDataPointModel: any) {
        this.numberOfPoints = heatmapChartDataPointModel.numberOfPoints;
        this.numberOfTasksComplete = heatmapChartDataPointModel.numberOfTasksComplete;
        this.color = heatmapChartDataPointModel.color;
        this.dateLabel = heatmapChartDataPointModel.dateLabel;
        this.dayOfWeek = heatmapChartDataPointModel.dayOfWeek;
        this.isAfterOrEqualToRelevantStartDate = heatmapChartDataPointModel.isAfterOrEqualToRelevantStartDate;
        this.isBeforeOrEqualToRelevantEndDate = heatmapChartDataPointModel.isBeforeOrEqualToRelevantEndDate;
        this.isToday = heatmapChartDataPointModel.isToday;
    }

    getNumberOfPoints(): number {
        return this.numberOfPoints;
    }

    getNumberOfTasksComplete(): number {
        return this.numberOfTasksComplete;
    }

    getColor(): string {
        return this.color;
    }

    getDateLabel(): string {
        return this.dateLabel;
    }

    getDayOfWeek(): string {
        return this.dayOfWeek;
    }

    getIsAfterOrEqualToRelevantStartDate(): boolean {
        return this.isAfterOrEqualToRelevantStartDate;
    }

    getIsBeforeOrEqualToRelevantEndDate(): boolean {
        return this.isBeforeOrEqualToRelevantEndDate;
    }

    getIsToday(): boolean {
        return this.isToday;
    }
}
