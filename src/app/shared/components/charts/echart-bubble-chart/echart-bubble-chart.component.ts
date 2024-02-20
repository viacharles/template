import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IChartData, IDefaultChart} from '@utilities/interface/chart.interface';
import {EChartsOption} from 'echarts';

/*  data index desc
 * 0 -  TechnicalCost  ToolTip、X軸
 * 1 -  RiskLevel      ToolTip、Y軸
 * 2 -  WaveLevel      ToolTip、bubble color
 * 3 -  System6r       ToolTip
 * 4 -  BusinessImpact ToolTip、bubble size
 * 5 -  ProjectName    ToolTip
 */
@Component({
  selector: 'app-echart-bubble-chart',
  templateUrl: './echart-bubble-chart.component.html',
  styleUrls: ['./echart-bubble-chart.component.scss'],
})
export class EchartBubbleChartComponent implements OnChanges {
  @Input() data?: {chart: IDefaultChart; minX: number; minY: number};

  /** 所有泡泡群組名稱 */
  private groupNames: (string | number)[] = [];
  /** 資料轉換前的index >  資料轉換後的index */
  private IndexMap = new Map<number, number>([]);
  public colorMap = new Map([
    ['Wave1', '#EF6149'],
    ['Wave2', '#EFAD49'],
    ['Wave3', '#44B787'],
    ['Wave4', '#449BB7'],
  ]);
  public options: EChartsOption = {};

  ngOnChanges({data}: SimpleChanges): void {
    if (data.currentValue) {
      const Data = data.currentValue;
      const Dataset = (Data.chart.values as (string | number)[][]).sort(
        (a, b) => +b[4] - +a[4]
      ) as IChartData;
      this.groupNames = this.getGroupNames(Dataset);
      const Config = this.getConfig(Data.chart, Data.minX, Data.minY);
      this.options = {
        ...this.options,
        ...(Config as any),
        ...{
          dataset: [
            {
              source: Dataset,
            },
            ...this.groupNames.map(name => ({
              transform: {
                type: 'filter',
                config: {
                  dimension: 2,
                  eq: name,
                },
              },
            })),
          ],
        },
      };
    }
  }

  /** 獲得 所有泡泡群組名稱 */
  private getGroupNames(dataset: IChartData): (string | number)[] {
    return dataset.reduce((groups, item) => {
      const Name = `${item[2]}`;
      return !groups.includes(Name) ? [...groups, ...[Name]] : groups;
    }, []);
  }

  private getConfig(
    chart: IDefaultChart,
    minX: number,
    minY: number
  ): IBubbleConfig {
    const SizeGroup = (chart.values as (string | number)[][]).map(
      value => value[4] as number
    );
    return {
      visualMap: {
        show: false,
        dimension: 4,
        min: Math.min(...SizeGroup),
        max: Math.max(...SizeGroup),
        seriesIndex: [0, 1, 2, 3],
        inRange: {
          symbolSize: [10, 47],
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        formatter: ({value}: any) => {
          const Content = value.filter(
            (_: (string | number)[], index: number) =>
              index !== 5 && index !== 2 && index !== 3
          );
          return `<div style="padding: 0 0.2rem;font-size:0.875rem;font-weight:700;color:#898989">
          ${value[5]}
          </div>
          <div style="padding: 0 0.2rem;font-size:0.725rem;font-weight:700;color:#898989">
          Wave: ${value[2].slice(-1)}</div>
          <div style="padding: 0 0.2rem;font-size:0.725rem;font-weight:700;color:#898989">
          6R: ${value[3]}</div>
          <div style="padding: 0 0.2rem;font-size:0.725rem;font-weight:700;color:#898989">
          Business: ${value[4]}</div>
          <div style="padding: 0 0.2rem;font-size:0.725rem;font-weight:700;color:#898989">
          Technical: ${value[0]}</div>
          <div style="padding: 0 0.2rem;font-size:0.725rem;font-weight:700;color:#898989">
          Risk: ${value[1]}</div>
        `;
        },
      },
      grid: {
        right: 30,
        left: 30,
        top: 30,
        bottom: 30,
      },
      xAxis: {
        type: 'value',
        show: false,
        min: minX,
      },
      yAxis: {
        type: 'value',
        show: false,
        min: minY,
      },
      series: [
        ...this.groupNames.map((name, index) => {
          const Color = this.colorMap.get(name as string);
          return {
            name,
            type: 'scatter',
            datasetIndex: index + 1,
            itemStyle: {
              opacity: 0.5,
              color: Color,
              emphasis: {
                emphasis: {disabled: true},
                shadowBlur: 6,
                shadowColor: Color,
                borderColor: Color,
                borderWidth: 2,
              },
            },
            emphasis: {
              scale: 0.9,
            },
          };
        }),
      ],
    };
  }
}

/** 數據源 */
export type IBubbleDataSet = {
  source?: ISource;
  transform?: ITransform;
}[];
type ISource = (number | string)[][];
type ITransform = {
  type: string;
  config: {dimension: number; eq: string | number};
};

/** 設置 */
export interface IBubbleConfig {
  series: IBubbleSeries;
  visualMap?: IBubbleVisualMap;
  tooltip?: {
    backgroundColor: string;
    formatter: (param: any) => string;
  };
  grid: any;
  xAxis: {
    type: string;
    show: boolean;
    min: number;
  };
  yAxis: {
    type: string;
    show: boolean;
    min: number;
  };
}

/** 系列設置 */
type IBubbleSeries = (
  | {
      name: string | number;
      type: string;
      datasetIndex: number;
    }
  | {itemStyle?: any}
)[];

/** 元素視覺設定 */
interface IBubbleVisualMap {
  show: boolean;
  dimension: number;
  min: number;
  max: number;
  seriesIndex: number[];
  inRange: {
    symbolSize: number[];
  };
}
