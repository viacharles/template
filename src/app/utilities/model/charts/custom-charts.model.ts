import {EChartCategory, EChartType} from '@utilities/enum/chart.enum';
import {
  ICustomQuestionChart,
  IDashboards,
  IDefaultChart,
} from '@utilities/interface/chart.interface';

export class CustomCharts {
  public source!: IDashboards;
  private dashboardId!: string;
  /** custom chart Map */
  private chartMap = new Map<IChartId, IDefaultChart | ICustomQuestionChart>();
  /** default chart 數量 */
  private readonly defaultChartCount = 3;
  constructor(dashboard: IDashboards) {
    this.source = dashboard;
    this.dashboardId = Object.keys(dashboard)[0];
    Object.entries(dashboard[this.dashboardId].chartTemplates).forEach(
      ([chartId, chart]) => {
        if (chart.chartType === EChartType.CUSTOM)
          this.chartMap.set(chartId, chart);
      }
    );
  }

  /** 更新某custom chart 的 category
   */
  public updateChartCategory(
    chartId: string,
    category: EChartCategory
  ): IDashboards {
    this.source[this.dashboardId].chartTemplates[chartId].chartCategory =
      category;
    return this.source;
  }

  /** 更新某custom chart 的 sort
   */
  public updateChartSort(targetChartId: string, currentSort: number): void {
    Object.entries(this.source[this.dashboardId].chartTemplates).forEach(
      ([chartId, chart]) => {
        this.source[this.dashboardId].chartTemplates[chartId].sortOrder = `${
          targetChartId === chartId
            ? currentSort
            : +chart.sortOrder >= +currentSort
              ? +chart.sortOrder + 1
              : chart.sortOrder
        }`;
      }
    );
  }
}

type IChartId = string;
