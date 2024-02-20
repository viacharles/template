import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IChartData, IDefaultChart} from '@utilities/interface/chart.interface';
/*  data index desc
 * 0 -  TechnicalCost  ToolTip、X軸
 * 1 -  RiskLevel      ToolTip、Y軸
 * 2 -  WaveLevel      ToolTip、bubble color
 * 3 -  System6r       ToolTip
 * 4 -  BusinessImpact ToolTip、bubble size
 * 5 -  ProjectName    ToolTip
 */
/**
 * @param sameBubbleList 所有數值都相同的bubble名稱列表
 */
interface IBubble {
  x: {
    name: string;
    diff: string;
  };
  y: {
    name: string;
    diff: string;
  };
  size: string;
  color: string;
  name: string;
  sameList?: ISameBubble[];
  [key: string]: any;
}

interface ISameBubble {
  name: string;
  sixR: string;
  wave: string;
}
@Component({
  selector: 'app-custom-bubble-chart',
  templateUrl: './custom-bubble-chart.component.html',
  styleUrls: ['./custom-bubble-chart.component.scss'],
})
export class CustomBubbleChartComponent implements OnChanges, AfterViewInit {
  @ViewChildren('tBubbles') tBubbles?: QueryList<ElementRef>;
  @Input() data?: {
    chart: IDefaultChart;
    minX: number;
    minY: number;
    startDiff: {x: number; y: number};
  };

  constructor(
    private self: ElementRef,
    private render: Renderer2,
    private $translate: TranslateService
  ) {}

  public bubbles: IBubble[] = [];
  public showTooltip = false;
  public tooltip?: {
    innerHtml: string;
    borderColor: string;
    position: {
      isLeft: boolean;
      x: number;
      isTop: boolean;
      y: number;
    };
  };
  public readonly BaseBubbleSize = {
    min: 8,
    max: 40,
  };
  private selfSize = {
    width: 0,
    height: 0,
  };
  public readonly ColorMap = new Map([
    ['Wave1', '239, 97, 73'], // #EF6149
    ['Wave2', '239, 173, 73'], // #EFAD49
    ['Wave3', '68, 183, 135'], // #44B787
    ['Wave4', '68, 155, 183'], // #449BB7
  ]);

  ngOnChanges({data}: SimpleChanges): void {
    if (data.currentValue) {
      const MinX = data.currentValue.minX;
      const MinY = data.currentValue.minY;
      const StartDiff = data.currentValue.startDiff;
      const Chart = data.currentValue.chart as IDefaultChart;
      const Values = (Chart.values as (string | number)[][]).sort(
        (a, b) => +b[4] - +a[4]
      ) as IChartData;
      const Option = Chart.options;
      this.bubbles = Values.map(value => ({
        x: {
          name: `${value[0]}`,
          diff:
            ((+value[0] - MinX) * (100 - StartDiff.x)) / (100 - MinX) +
            StartDiff.x +
            '%',
        },
        y: {
          name: `${value[1]}`,
          diff:
            ((+value[1] - MinY) * (100 - StartDiff.y)) / (100 - MinY) +
            StartDiff.y +
            '%',
        },
        size: +value[4] * 0.4 + 'px',
        color: this.ColorMap.get(`${value[2]}`)!,
        name: `${value[5]}`,
        biz: `${value[4]}`,
        wave: `${value[2]}`,
        sixR: `${value[3]}`,
        sameList: this.getSameList(Values, value),
      }));
    }
  }

  ngAfterViewInit(): void {
    this.selfSize = {
      width: this.self.nativeElement.clientWidth,
      height: this.self.nativeElement.clientHeight,
    };
  }

  public onMouseMove(event: MouseEvent, bubble: IBubble, index: number): void {
    this.showTooltip = true;
    this.render.setStyle(
      this.tBubbles?.get(index)?.nativeElement,
      'boxShadow',
      '0 0 4px rgba(' + bubble.color + ', 0.9)'
    );
    const Target = event.target as HTMLElement;
    const isLeft = Target.offsetLeft < this.selfSize.width / 2;
    const isTop = Target.offsetTop < this.selfSize.height / 2;
    this.tooltip = {
      innerHtml: this.getTooltipInnerHTML(bubble),
      borderColor: bubble.color,
      position: {
        isLeft: isLeft,
        x: isLeft ? event.clientX + 10 : event.clientX - 10,
        isTop: isTop,
        y: isTop ? event.clientY - 10 : event.clientY + 10,
      },
    };
  }

  public onMouseLeave(event: Event, index: number): void {
    this.showTooltip = false;
    this.render.removeStyle(
      this.tBubbles?.get(index)?.nativeElement,
      'boxShadow'
    );
  }

  private getSameList(
    all: (number | string)[][],
    value: (number | string)[]
  ): ISameBubble[] {
    return all
      .filter(
        item =>
          item[4] === value[4] &&
          item[0] === value[0] &&
          item[1] === value[1] &&
          item[5] !== value[5]
      )
      .map(item => ({
        name: item[5] as string,
        sixR: item[3] as string,
        wave: item[2] as string,
      }));
  }

  private getTooltipInnerHTML(bubble: IBubble): string {
    const Tech = this.$translate.instant('portfolio.tech');
    const Risk = this.$translate.instant('portfolio.risk');
    const Biz = this.$translate.instant('portfolio.biz');
    const SameList = bubble.sameList?.reduce(
      (temp, item) =>
        temp +
        `<div style="padding: 0.5rem 0.2rem 0 0.2rem;font-size:0.875rem;font-weight:700;color:#898989;border-top:1px solid #D8D8D8">
    ${item.name}
    </div>
    <div style="padding: 0 0.2rem;font-size:0.725rem;font-weight:700;color:#898989">
    Wave: ${item.wave.slice(-1)}</div>
    <div style="padding: 0 0.2rem;font-size:0.725rem;font-weight:700;color:#898989">
    6R: ${item.sixR}</div>
    `,
      ''
    );
    return `<div style="padding: 0 0.2rem;font-size:0.875rem;font-weight:700;color:#898989">
    ${bubble.name}
    </div>
    <div style="padding: 0 0.2rem;font-size:0.725rem;font-weight:700;color:#898989">
    Wave: ${bubble['wave'].slice(-1)}</div>
    <div style="padding: 0 0.2rem;font-size:0.725rem;font-weight:700;color:#898989">
    6R: ${bubble['sixR']}</div>
    <div style="padding: 0 0.2rem;font-size:0.725rem;font-weight:700;color:#898989">
    ${Biz}: ${bubble['biz']}</div>
    <div style="padding: 0 0.2rem;font-size:0.725rem;font-weight:700;color:#898989">
    ${Tech}: ${bubble.x.name}</div>
    <div style="padding: 0 0.2rem;font-size:0.725rem;font-weight:700;color:#898989">
    ${Risk}: ${bubble.y.name}</div>
    ${SameList ?? ''}
  `;
  }
}
