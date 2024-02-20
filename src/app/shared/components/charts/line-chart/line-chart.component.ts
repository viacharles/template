import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {EChartsOption} from 'echarts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnChanges {
  @Input() sixRs? = [''];

  /** 6r名稱 > 6r位置 */
  private sixRMap = new Map([
    ['Mantain', 0],
    ['Rehost', 1],
    ['Replatform', 2],
    ['FineTune', 3],
    ['Rewrite', 4],
    ['NewElement', 5],
  ]);

  public options: EChartsOption = {
    legend: {},
    grid: {
      top: 7,
      bottom: 10,
      left: 5,
    },
    xAxis: {
      type: 'category',
      show: true,
      min: 0,
      boundaryGap: false,
      data: Array.from(Array(12).keys()),
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
      boundaryGap: false,
      data: Array.from(Array(20).keys()),
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisLine: {
        symbol: ['none', 'triangle'],
        symbolOffset: [0, 5],
        symbolSize: [7, 7],
      },
    },
    series: [
      {
        data: [
          {value: [0, 0], symbol: 'none'},
          {
            value: [1, 3],
            itemStyle: {color: '#999999'},
            label: {show: true, formatter: 'Rehost'},
          },
          {
            value: [2.6, 7.5],
            itemStyle: {color: '#999999'},
            label: {show: true, formatter: 'Replatform'},
          },
          {
            value: [4.5, 11.4],
            itemStyle: {color: '#999999'},
            label: {show: true, formatter: 'FineTune', color: '#999999'},
          },
          {
            value: [6.5, 12.3],
            itemStyle: {color: '#999999'},
            label: {show: true, formatter: 'Rewrite'},
          },
          {
            value: [8.5, 9],
            itemStyle: {color: '#999999'},
            label: {show: true, formatter: 'NewElement'},
          },
          {value: [9.5, 0], symbol: 'none'},
        ],
        label: {
          fontSize: 12,
          fontWeight: 'bolder',
          color: '#999999',
          distance: 10,
        },
        type: 'line',
        symbol: 'circle',
        symbolSize: 15,
        color: '#7D7D7D',
        smooth: true,
      },
    ],
  };

  ngOnChanges({sixRs}: SimpleChanges): void {
    if (sixRs.currentValue) {
      this.options = {
        ...this.options,
        ...{series: this.getSeries(sixRs.currentValue)},
      };
    }
  }

  private getSeries(sixR: string[]): any[] {
    const First6r = sixR[0];
    return [
      {
        ...(this.options.series as any)[0],
        ...{
          data: (this.options.series as any)[0]?.data.map(
            (item: any, index: number) => {
              {
                return index === this.sixRMap.get(First6r)
                  ? {
                      ...item,
                      ...{
                        itemStyle: {color: '#44B787'},
                        label: {
                          show: true,
                          formatter: First6r,
                          color: '#44B787',
                        },
                      },
                    }
                  : item;
              }
            }
          ),
        },
      },
    ];
  }
}
