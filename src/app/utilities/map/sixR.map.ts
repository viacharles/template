import {IColorString} from './../interface/common.interface';

/** 6R名稱 > 顏色 */
export const sixRColorMap: Map<ISixRName, IColorString> = new Map([
  ['Mantain', ' #a2a0a0'],
  ['Rehost', ' #449bb7'],
  ['Replatform', '#44b787'],
  ['FineTune', '#efad49'],
  ['NewElement', '#fe8e3d'],
  ['Rewrite', '#ef6149'],
  ['TBD', 'gray'],
]);

export type ISixRName =
  | 'Mantain'
  | 'Rehost'
  | 'Replatform'
  | 'FineTune'
  | 'NewElement'
  | 'Rewrite'
  | 'TBD';
