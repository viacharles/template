import {
  IChartCategory,
  IChartType,
  ICustomChartOption,
  ICustomQuestionChart,
  IDefaultChart,
} from '../chart.interface';

/** 生成custom chart時用的選項組 */
export interface IChartCreateOptionGroup {
  groups: {
    groupId: string;
    groupName: string;
    questions: IChartCreateSubOptions;
  }[];
}

export interface IChartCreateSubOptions {
  [questionId: string]: {
    questionOrder: number;
    longTitleCN: string;
    longTitleEN: string;
    shortTitleCN: string;
    shortTitleEN: string;
  };
}

/** 新增dashboard chart回傳 */
export interface ICreateChartRes {
  dashboardId: string;
  chartTemplates: {
    [chartTemplateId: string]: {
      chartName: string;
      chartCategory: IChartCategory;
      chartType: IChartType;
      chartSpacing: number;
      chartUnit: string;
      questionId: string;
      options: ICustomChartOption[];
      values: number[];
      sortOrder: number;
    };
  };
}

export type IDashboardEntire = [string, IDefaultChart | ICustomQuestionChart];

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

/** request用 custom charts (更新/刪除)*/
export interface IChartsForUpdateRequest {
  chartTemplates: {
    [chartTemplatesId: string]: {
      chartCategory: IChartCategory;
      sortOrder: string;
    };
  };
}
/** request用 custom charts (更新/新增問題)*/
export interface IChartsForUpdateQuestionRequest {
  questionId: string;
  chartCategory: string;
  sortOrder: number;
}

/** request 專案結構
 * @param pageNumber 第幾頁
 * @param itemsPerPage 多少物件為一頁
 */
export interface IGetProjectStructurePageRequest {
  pageNumber: number;
  itemsPerPage: number;
}
