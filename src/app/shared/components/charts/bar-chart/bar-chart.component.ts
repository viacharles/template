import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
  ICustomChartOption,
  ICustomQuestionChart,
  IDefaultChart,
} from '@utilities/interface/chart.interface';
import {EChartsOption} from 'echarts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnChanges {
  @Input() data?: {
    chart?: ICustomQuestionChart | IDefaultChart;
    colorMap?: Map<string, string>;
  };
  /** 圖表底部空間需加大(項目名稱字很多的情況) */
  @Input() increaseGridBottom = false;

  constructor(private $translate: TranslateService) {}

  public options?: EChartsOption;

  /** 預設顏色庫 */
  private defaultColorMap = new Map([]);
  private baseRGB = '68, 183, 135';

  ngOnChanges({data}: SimpleChanges): void {
    if (data.currentValue) {
      const DataSource = data.currentValue.chart;
      const ColorMap = data.currentValue.colorMap;
      const Values = DataSource.values as number[];
      const Options =
        typeof DataSource.options[0] === 'string'
          ? DataSource.options
          : ((DataSource.options as ICustomChartOption[]).map(
              option => option.label
            ) as string[]);
      const TitleCount = this.$translate.instant('portfolio.count');
      const TitleScale = this.$translate.instant('portfolio.scale');
      this.defaultColorMap = ColorMap ?? this.getColorMap(Options);
      this.options = {
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          formatter: (data: any) => {
            const Total = Values.reduce((sum, num) => (sum = sum + num), 0);
            return `<div style="padding: 0 0.2rem;font-size:0.875rem;font-weight:700;color:#898989">
            ${data.name}
            </div>
            <div style="padding: 0 0.2rem;font-size:0.725rem;font-weight:700;color:#898989">
            ${TitleCount}: ${data.value}</div>
            <div style="padding: 0 0.2rem;font-size:0.725rem;font-weight:700;color:#898989">
            ${TitleScale}: ${Math.round((data.value / Total) * 100)}%</div>`;
          },
        },
        legend: {
          show: false,
        },
        grid: {
          top: 20,
          bottom: this.increaseGridBottom ? 50 : 30,
          left: 25,
          right: 10,
        },
        xAxis: {
          type: 'category',
          data: Options,
          axisTick: {
            show: false,
          },
          axisLabel: {
            rotate: 20,
            fontSize: 10,
            fontWeight: 500,
            align: 'center',
            margin: 18,
            color: _ => this.defaultColorMap.get(Options[0]) as string,
            formatter: (name: any) => {
              return name.length > 6 ? name.slice(0, 6) + '...' : name;
            },
          },
          axisLine: {
            symbol: ['none', 'triangle'],
            symbolOffset: [0, 5],
            symbolSize: [7, 7],
          },
        },
        yAxis: {
          min: 0,
          max: Math.max(...Values) ?? 1,
          fontSize: 10,
          fontWeight: 700,
          splitLine: {
            show: false,
          },
          splitNumber:
            Math.max(...Values) < 4 && Math.max(...Values) !== 0
              ? Math.max(...Values)
              : null,
          axisLine: {
            show: true,
            lineStyle: {
              type: 'solid',
            },
            symbol: ['none', 'triangle'],
            symbolOffset: [0, 5],
            symbolSize: [7, 7],
          },
        },
        series: [
          {
            type: 'bar',
            data: this.getSeriesData(Values, Options),
          },
        ],
      } as EChartsOption;
    }
  }

  private getSeriesData(values: number[], options: string[]): ISeriesData[] {
    return values.map((value, index) => {
      const Color = this.defaultColorMap.get(options[index]) as string;
      return {
        value,
        itemStyle: {
          color: Color,
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 14,
          fontWeight: 700,
          color: Color,
        },
      };
    });
  }

  /** 獲得 colorMap */
  private getColorMap(options: string[]): Map<string, string> {
    let map = new Map();
    const TotalCount = options.length;
    Array.from(Array(options.length).keys()).forEach((num, index) =>
      map.set(
        options[index],
        `rgba(${this.baseRGB}, ${(TotalCount - index) / TotalCount})`
      )
    );
    return map;
  }
}

export interface ISeriesData {
  value: number;
  itemStyle?: {
    color: string;
  };
  label: {
    show: boolean;
    position: any | 'outside' | 'top';
    fontWeight: number;
    color: string;
  };
}
