export default class NumberOfPointsInTasksCompletedOverTimeVisualizationModel__HeatmapChartDataPointModel {
    numberOfPoints: number;
    color: string;
    dateLabel: string;
    dayOfWeek: string;
    isAfterOrEqualToRelevantStartDate: boolean;

    constructor(heatmapChartDataPointModel: any) {
        this.numberOfPoints = heatmapChartDataPointModel.numberOfPoints;
        this.color = heatmapChartDataPointModel.color;
        this.dateLabel = heatmapChartDataPointModel.dateLabel;
        this.dayOfWeek = heatmapChartDataPointModel.dayOfWeek;
        this.isAfterOrEqualToRelevantStartDate = heatmapChartDataPointModel.isAfterOrEqualToRelevantStartDate;
    }

    getNumberOfPoints(): number {
        return this.numberOfPoints;
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
}
