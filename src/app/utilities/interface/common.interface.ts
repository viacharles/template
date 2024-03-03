import {HttpHeaders} from '@angular/common/http';
import {ELoadingStatus, ESort} from '@utilities/enum/common.enum';

export interface IArticle {
  title: string;
  content?: string;
}

/** api response */
export interface IApiRes<T = any> {
  data: T;
  action?: string;
  result?: string;
  url?: string;
}

/** api error */
export interface IApiError<T = any> {
  error: {
    code: string;
    data: T;
    message: string;
  };
  headers: HttpHeaders;
  message: string;
  name: string;
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
}

/** api error */
export interface IApiError<T = any> {
  error: {
    code: string;
    data: T;
    message: string;
  };
  headers: HttpHeaders;
  message: string;
  name: string;
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
}

/** 顏色字串 */
export type IColorString = string;

/** 選項通用 */
export interface IOption<T = (string | number)> {
  code: T;
  name: string;
  icon?: string;
  isSelect?: boolean,
  [key: string]: any;
}

/**
 * @description 選項通用（畫面）
 */
export interface IOptionView extends IOption {
  show: boolean,
}

/** 路由歷史
 * @param revertFilter 是否回復過濾&排序狀態
 * @param isBeforehand 是預先設置的資料
 * */
export interface IRouterHistory {
  url: string;
  params?: any;
  revertFilter?: boolean;
  isBeforehand?: boolean;
  [key: string]: any;
}

export interface IIcon {
  color: string;
  hoverColor?: string;
  iconCode: any;
  title?: string;
  order?: number;
}

export interface ILabel {
  backgroundColor: string;
  textColor: string;
  backgroundHoverColor?: string;
  textHoverColor?: string;
  iconCode?: any;
  title?: string;
  order?: number;
}

export interface IPosition {
  isLeft: boolean;
  x: number;
  isTop: boolean;
  y: number;
}

export type ITimeUnitName = 'date' | 'week' | 'month' | 'year';

export interface IFile {
  url: string;
  name: string;
  id: string;
  status: ELoadingStatus;
}

/** 範圍日期 : yyyy/MM/dd */
export interface IRangeDate {
  start: string,
  end: string,
}

/**
 * @description 排序結果
 */
export interface ISortResult<T> {
  data: T[],
  type: ESort,
}
