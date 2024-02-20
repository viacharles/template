import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StackBarChartComponent} from './stack-bar-chart/stack-bar-chart.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {LineChartComponent} from './line-chart/line-chart.component';
import {EchartBubbleChartComponent} from './echart-bubble-chart/echart-bubble-chart.component';
import {BarChartComponent} from './bar-chart/bar-chart.component';
import {TranslateModule} from '@ngx-translate/core';
import {PieChartComponent} from './pie-chart/pie-chart.component';
import {DirectiveModule} from '@shared/directives/directive.module';
import {CustomBubbleChartComponent} from './custom-bubble-chart/custom-bubble-chart.component';
import {SharedModule} from '@shared/shared.module';

@NgModule({
  declarations: [
    StackBarChartComponent,
    LineChartComponent,
    EchartBubbleChartComponent,
    BarChartComponent,
    PieChartComponent,
    CustomBubbleChartComponent,
  ],
  exports: [
    StackBarChartComponent,
    LineChartComponent,
    EchartBubbleChartComponent,
    BarChartComponent,
    PieChartComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    DirectiveModule,
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
})
export class ChartsModule {}
