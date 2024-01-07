export default class NumberOfPointsInTasksCompletedOverTimeVisualizationModel__LineChartDataPointModel {
    numberOfPoints: number;
    dateLabel: string;

    constructor(lineChartDataPointModel: any) {
        this.numberOfPoints = lineChartDataPointModel.numberOfPoints;
        this.dateLabel = lineChartDataPointModel.dateLabel;
    }

    getNumberOfPoints(): number {
        return this.numberOfPoints;
    }

    getDateLabel(): string {
        return this.dateLabel;
    }
}
