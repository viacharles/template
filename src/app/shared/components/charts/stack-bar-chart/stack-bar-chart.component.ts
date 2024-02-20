import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EChartsOption} from 'echarts';

@Component({
  selector: 'app-stack-bar-chart',
  templateUrl: './stack-bar-chart.component.html',
  styleUrls: ['./stack-bar-chart.component.scss'],
})
export class StackBarChartComponent implements OnChanges {
  @Input() data?: IGroupBarChart;

  constructor(private $translate: TranslateService) {}
  public options: EChartsOption = {
    legend: {},
    grid: {
      top: 35,
      bottom: 5,
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow',
      },
    },
    dataset: {
      source: [
        //  ['product', '2015', '2016', '2017', '2023'], // 說明圖示：範例
        ['category', 'bar1', 'stack1', 'stack2', 'stack3', 'stack4'],
        ['A', 20, 2, 50, 12, 8],
        ['B', 9, 18, 8, 15, 7],
        ['C', 10, 15, 7, 30, 9],
      ],
    },
    xAxis: {
      type: 'category',
      show: true,
      axisTick: {
        show: false,
      },
      axisLine: {
        symbol: ['none', 'triangle'],
        symbolOffset: [0, 5],
        symbolSize: [7, 7],
      },
      axisLabel: {
        show: false,
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      interval: 25,
      splitNumber: 4,
      splitArea: {
        show: true,
        interval: 'auto',
        areaStyle: {
          opacity: 0,
          color: ['white', 'white'],
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          type: 'solid',
        },
        symbol: ['none', 'triangle'],
        symbolOffset: [0, 5],
        symbolSize: [7, 7],
      },
      splitLine: {
        show: false,
        lineStyle: {
          width: 2,
          color: '#333',
        },
      },
    },
    series: [
    ],
  };

  ngOnChanges({data}: SimpleChanges): void {
    if (data?.currentValue) {
      this.resetOptions(data.currentValue);
    }
  }

  private resetOptions(data: IGroupBarChart): void {
    this.options = {
      ...this.options,
      ...{
        dataset: {
          source: this.getSource(data),
        },
        series: this.getSeries(data),
      },
    };
  }

  /** 資料 */
  private getSource(data: IGroupBarChart): (number | string)[][] {
    let titleColumns = ['x'];
    let source = data.bars.map((barsGroup, index) => {
      if (index === 0) {
        // stack bar
        barsGroup.forEach(bar => {
          bar.group.forEach(seg => titleColumns.push(seg.name));
        });
      }
      let result = barsGroup.reduce(
        (stack: any[], bar, index) => {
          return [...stack, ...bar.group.map(item => item.score)];
        },
        [barsGroup[0].name]
      );
      return result;
    });
    source.unshift(titleColumns);
    return source;
  }

  /** 設定 */
  private getSeries(data: IGroupBarChart): any[] {
    return data.bars.map((barsGroup, barsGroupIndex) =>
      barsGroup.reduce(
        (stack: any[], bar) => [
          ...stack,
          ...(bar.group.length > 1
            ? bar.group.map(item => ({
                type: 'bar',
                stack: this.$translate.instant(bar.name),
                color: item.color,
                encode: {x: 'x', y: item.name},
                barWidth: bar.width,
                itemStyle: {
                  color: item.color,
                  opacity: 0.6,
                },
                barGap: 1,
              }))
            : bar.group.map(item => {
                return {
                  type: 'bar',
                  datasetIndex: 0,
                  color: item.color,
                  encode: {x: 'x', y: item.name},
                  barWidth: bar.width,
                  itemStyle: {
                    color: item.color,
                  },
                };
              })),
        ],
        []
      )
    )[0];
  }
}

export interface IGroupBarChart {
  bars: IBar[][];
}

export interface IBar {
  group: {
    score: Number;
    color: string | ((params: any) => string);
    name: string;
  }[];
  name: string;
  width: string;
}
