import {
  EDemandType,
  EStructureScopeForEnd,
  EStructureScopeForEndUpdate,
  EStructureStatus,
} from '@utilities/enum/structure.enum';
import {ITableData} from '@shared/components/data-table/data-table.component';
import {IIcon} from './common.interface';
import {ELoadingStatus} from '@utilities/enum/common.enum';

/** 架構圖的說明文字
 * @param order 從 1 開始
 */
export interface IStructureImgItem {
  order: string;
  projectId: string;
  text: string;
  img?: any;
  imgName?: string;
  resizeImgName?: string;
  loadingStatus?: ELoadingStatus;
}
/** 後端定義的tab名稱
 * @param forRes for tab資料
 * @param forUpdate for 更新範圍
 */
export interface IStructureTabMapParam {
  forUpdate: EStructureScopeForEndUpdate;
  forRes?: EStructureScopeForEnd;
}

export interface IStructureList {
  architectureObjVoList: IStructureListItem[];
  docId: string;
  docNum: string;
}

export interface IStructureListItem {
  systemName: string;
  systemId: string;
  apOwner: string;
  buDepartment: string;
  partner: string | null;
  purpose: string | null;
  user: string | null;
  scenario: string | null;
  status: EStructureStatus;
  creator: string;
  editor: string;
  resizeImg: string | null;
  editDate: string;
  basicDataUpdateDate: string;
  basicDataEditor: string;
  basicDataEditorEmail: string;
  basicDataEditorId: string;
  projectId: string;
  TenantId: string;
  base64?: string;
  loadingStatus: ELoadingStatus;
}

export interface IStructureHistory extends ITableData {
  demandType: EDemandType;
  demandAbstract: string | null;
  arcStrategyAbstract: string | null;
  changeField: string[];
  status: EStructureStatus;
  creator: string;
  editor: string;
  editDate: string;
  basicDataUpdateDate: string;
  basicDataEditor: string;
  basicDataEditorEmail: string;
  basicDataEditorId: string;
  systemName: string;
  TenantId: string;
}

export interface IStructureHistorySideTab extends IStructureHistory {
  demandTypeIcon: IIcon;
}

export interface IStructureQuestionApiRes {
  projectId: string;
  systemName: string;
  systemId: string;
  apOwner: string;
  buDepartment: string;
  partner: string;
  purpose: string;
  user: string;
  scenario: string;
  solution: string;
  creator: string;
  createDate: string;
  creatorEmail: string;
  creatorUserId: string;
  editDate: string;
  editor: string;
  editorEmail: string;
  editorUserId: string;
  demandType: EDemandType;
  demandUser: string;
  demandAbstract: string;
  arcStrategyAbstract: string;
  consquence: string;
  arcBussinesses: IStructureImgItem[];
  arcInfos: IStructureImgItem[];
  arcTeches: IStructureImgItem[];
  arcInfras: IStructureImgItem[];
  arcSpecs: IStructureImgItem[];
  status: EStructureStatus;
  TenantId: string;
}

export interface IStructureUpdateReq {
  arcProjectId: string;
  arcPublishId: string;
  projectName: string;
  owner: string;
  demandType: EDemandType;
  demandUser: string;
  demandAbstract: string;
  arcStrategyAbstract: string;
  consquence: string;
  creator: string;
  editorEmail: string;
  editorUserId: string;
  arcBussinesses: IStructureImgItem[];
  arcInfos: IStructureImgItem[];
  arcTeches: IStructureImgItem[];
  arcInfras: IStructureImgItem[];
  arcSpecs: IStructureImgItem[];
  status: EStructureStatus;
  updateBasicData: boolean;
  TenantId: string;
}

export interface IImagIds {
  imgName: string;
  resizeImgName: string;
}

export type IPrcProjectId = string;
export type IStructureScopeName = string;
