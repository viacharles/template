import {EChartCategory, EChartType} from '@utilities/enum/chart.enum';
import {ELoadingStatus} from '@utilities/enum/common.enum';

/** 儀表板群組 */
export interface IDashboards {
  [dashboardId: string]: IDashboard;
}

/** 儀表板 */
export interface IDashboard {
  userId: string;
  chartTemplates: {
    [key: string]: IDefaultChart | ICustomQuestionChart;
  };
}

/** request用 custom charts (更新/刪除)*/
export interface IChartsForUpdateRequest {
  chartTemplates: {
    [chartTemplatesId: string]: {
      chartCategory: IChartCategory;
      sortOrder: string;
    };
  };
}
/** request用 custom charts (更新問題)*/
export interface IChartsForUpdateQuestionRequest {
  questionId: string;
  chartCategory: string;
  sortOrder: number;
}
/** 預設圖表 */
export interface IDefaultChart extends IChartConfig {
  options: string[];
  values: (string | number)[][] | number[];
}

/** 客製圖表 */
export interface ICustomQuestionChart extends IChartConfig {
  questionId: string;
  options: ICustomChartOption[];
  values: number[];
}
/** 圖表種類 */
export type IChartCategory =
  | EChartCategory.BAR
  | EChartCategory.BUBBLE
  | EChartCategory.PIE;
/** 圖表是否預設 */
export type IChartType = EChartType.CUSTOM | EChartType.DEFAULT;
/** 圖表設定 */
export interface IChartConfig {
  chartName: string;
  chartCategory: string;
  chartType: string;
  chartSpacing: number;
  chartUnit: string;
  sortOrder: string;
  chartId?: string;
  loadingStatus?: ELoadingStatus;
}
export interface ICustomChartOption {
  label: string;
  value: number;
}

/** echarts 資料格式  */
export type IChartData = (string | number)[][];

/** echarts bubble chart 設定 */
export interface IBubbleChartConfig {
  xAxis: {
    name: string;
    index: number;
    min: number;
    max: number;
  };
  yAxis: {
    name: string;
    index: number;
    min: number;
    max: number;
  };
  bubbleInfo: {
    sizeIndex: number;
    groupIndex: number;
    groupInfo: {
      name: string;
      color: string;
    }[];
  };
  tooltip: {name: string; index: number; showName: boolean}[];
}

/** echarts 迴傳函數參數 */
export interface IBubbleTooltipParam {
  componentType: string;
  componentSubType: string;
  componentIndex: number;
  seriesType: string;
  seriesIndex: number;
  seriesId: string;
  seriesName: string;
  name: string;
  dataIndex: number;
  data: (string | number)[];
  value: (string | number)[];
  color: string;
  dimensionNames: string[];
  encode: {
    x: number[];
    y: number[];
  };
  $vars: string[];
  marker: string;
}

export interface IChartQuestionRes {
  dashboardId: string;
  chartTemplates: {
    [chartTemplateId: string]: {
      chartName: string;
      chartCategory: string;
      chartType: string;
      chartSpacing: number;
      chartUnit: string;
      questionId: string;
      options: ICustomChartOption[];
      values: number[];
      sortOrder: number;
    };
  };
}

// 範例
//{
//   "componentType": "series",
//   "componentSubType": "scatter",
//   "componentIndex": 2,
//   "seriesType": "scatter",
//   "seriesIndex": 2,
//   "seriesId": "\u00002013\u00000",
//   "seriesName": "2013",
//   "name": "",
//   "dataIndex": 4,
//   "data": [
//       53354,
//       79.1,
//       321773631,
//       "United States",
//       2013
//   ],
//   "value": [
//       53354,
//       79.1,
//       321773631,
//       "United States",
//       2013
//   ],
//   "color": "#fac858",
//   "dimensionNames": [
//       "x",
//       "y",
//       "value",
//       "value0",
//       "value1"
//   ],
//   "encode": {
//       "x": [
//           0
//       ],
//       "y": [
//           1
//       ]
//   },
//   "$vars": [
//       "seriesName",
//       "name",
//       "value"
//   ],
//   "marker": "<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#fac858;\"></span>"
// }
