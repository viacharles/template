import { EAction, EContent } from '@utilities/enum/common.enum';
import { IAlign, IArticle, IOption } from './common.interface';
import { Injector } from '@angular/core';

/** overlay 事件 */
export interface IOverlayEvent<T = any> {
  action: EAction.Add | EAction.Delete | EAction.Clear;
  overlay?: IDialog<T>;
}

/** overlay */
export interface IDialog<T = any> {
  component: any;
  injector: Injector;
  id: string;
  data: T;
  params: IDialogParams;
}

/** overlay 選填參數
 * @param hasCloseBtn 是否有關閉 icon
 * @param hasBackDrop 是否有 backdrop
 * @param isBackDropClose 是否能點擊 backdrop 關閉 overlay
 * @param isHideAnim 是否顯示消失動畫
 */
export interface IDialogParams {
  hasCloseBtn?: boolean;
  hasBackDrop?: boolean;
  isBackDropTransparent?: boolean;
  isBackDropClose?: boolean;
  isHideAnim?: boolean;
  callback?: IOverlayCallBack;
}

/** overlay callback */
export interface IOverlayCallBack {
  confirm?: (param: any) => void;
  cancel?: (param: any) => void;
  close?: (param: any) => void;
  emit?: (param: any) => void;
}

/** toast 事件 */
export interface IToastEvent {
  action: EAction.Add | EAction.Delete | EAction.Clear;
  toast: IToast;
}

/** toast 參數
 * @param isHideAnim 是否顯示消失動畫  */
export interface IToast {
  id?: string;
  type?: EContent;
  article?: IArticle;
  isHideAnim?: boolean;
}

export interface IWarnDialogData {
  type?: EContent;
  title?: string;
  innerHTML?: string;
  buttons?: {
    confirm: IButton;
    cancel: IButton;
  };
}

export interface IButton {
  text?: string;
  classes?: string;
  bgColor?: string;
}

export interface ISelectDropdownData {
  width?: number;
  height: number;
  options: IOption[];
  alignTo: IAlign;
  inputHeight?: string;
  /** 有全選項目 */
  enableAll?: boolean;
}

export interface IMultiSelectDropdownData extends ISelectDropdownData {
  hasFilter: boolean,
  filterPlaceholder: string;
  /** 用在 checkbox form 元件上 */
  id: string
}
