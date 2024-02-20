import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {
  ICustomChartOption,
  ICustomQuestionChart,
  IDefaultChart,
} from '@utilities/interface/chart.interface';
import {EChartsOption} from 'echarts';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnChanges {
  @Input() data?: {
    chart: ICustomQuestionChart | IDefaultChart;
    colorMap?: Map<string, string>;
  };

  constructor(private $translate: TranslateService) {}

  public options?: EChartsOption;

  /** 預設顏色庫 */
  private defaultColorMap = new Map([]);
  private baseRGB = '68, 183, 135';

  ngOnChanges({data}: SimpleChanges): void {
    const [ColorFirstKey] = (
      data.currentValue.colorMap as Map<string, string>
    ).keys();
    if (data.currentValue && ColorFirstKey !== undefined) {
      const DataSource = data.currentValue.chart;
      const Values = DataSource.values as number[];
      const Options =
        typeof DataSource.options[0] === 'string'
          ? DataSource.options
          : ((DataSource.options as ICustomChartOption[]).map(
              option => option.label
            ) as string[]);
      const TitleCount = this.$translate.instant('portfolio.count');
      const TitleScale = this.$translate.instant('portfolio.scale');
      this.defaultColorMap =
        data.currentValue.colorMap ?? this.getColorMap(Options);
      this.options = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255,0.8)',
          formatter: ({data}: any) => {
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
        grid: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '90%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                fontWeight: 'bold',
                color: '',
                formatter: params => {
                  const Name = params.name;
                  return Name.length > 6 ? Name.slice(0, 6) + '...' : Name;
                },
              },
            },
            data: this.getData(Values, Options),
          },
        ],
      };
    }
  }

  private getData(values: number[], options: string[]): IData[] {
    return options.map((option, index) => ({
      value: values[index],
      name: options[index],
      itemStyle: {color: this.defaultColorMap.get(option)},
    }));
  }

  /** 獲得 colorMap */
  private getColorMap(options: string[]): Map<string, string> {
    const map = new Map();
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

interface IData {
  name: string;
  value: number;
}
