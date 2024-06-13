import {
  EFDProcess,
  ERole,
  EUserStatus,
  EFieldStatus,
} from '@utilities/enum/common.enum';
import { IOption } from '../common.interface';
import { EDFAnswerStatus, EDFSubmitType } from 'src/app/modules/form/dynamic-form-page/shared/enum/df.enum';
import { EErrorMessage, EFieldType } from '@utilities/enum/form.enum';

export interface IDFBasicInfoReq {
  projectName: string;
  projectId: null;
  projectOwnerSectionNameCN: string;
  projectOwnerName: string;
  df: number;
}

export interface IDFBasicInfoRes {
  docId: string;
  dfId: string;
  projectName: string;
  projectId: string;
  projectOwnerSectionNameCN: string;
  projectOwnerName: string;
  df: number;
  questionVersion: string | null;
  version: string;
  status: EFDProcess;
  answers: IDFAnswer | null;
  tenantCn: string;
  tenantId: string;
  createDate: string; // 2023-10-12 09:00:00
  editDate: string | null;
  creator: IDFEditor;
  editor: IDFEditor | null;
  attachment: IDFFile[];
}

export interface IDFAnswer {
  [key: string]: {
    // questionId
    groupId: string;
    sectionId: string;
    values: IDFQuestionValue;
    remark: IDFRemark[] | null;
  };
}

export interface IDFQuestionValue {
  [key: string]: // questionId
  IDynamicFieldValue[];
}

export interface IDynamicFieldValue {
  value: string | number | boolean;
  memo: string;
}

export interface IDFEditor {
  id: string;
  name: string;
  email: string;
  department: string;
  departmentCn: string;
  departmentEn: string;
  section: string;
  sectionCn: string;
  sectionEn: string;
}

export interface IDFFile {
  file: string; // uniq name from BE
  fileName: string;
  uploadDate: string;
  userId: string;
  userName: string;
  department: string;
  departmentCn: string;
  departmentEn: string;
  section: string;
  sectionCn: string;
  sectionEn: string;
  email: string;
  type: EDFAnswerStatus;
  fieldStatus: EFieldStatus;
}

export interface IDFApplicationAnswerReq {
  docId: string;
  dfId: string;
  projectId: string;
  questionVersion: string;
  answers: IDFApplicationAnswerReqAnswers;
  attachment: IDFFile[];
}

export interface IDFSupplementReq {
  projectId: string;
  dfId: string;
  remark: {[questionId: string]: IDFRemark}[] | null;
  attachment: IDFFile | null;
}

export interface IDFApplicationAnswerReqAnswers {
  [key: string]: {
    values: IDynamicFieldValue[];
  };
}


export interface IDFApplicationAnswerRes {
  type: EDFSubmitType;
  docId: string;
  dfId: string;
  projectName: string;
  projectId: string;
  projectOwnerSectionNameCN: string;
  projectOwnerName: string;
  df: number;
  questionVersion: string;
  version: string;
  status: EFDProcess;
  answers: IDFAnswer;
  tenantCn: string;
  tenantId: string;
  createDate: string; // 2023-10-12 09:00:00
  editDate: string;
  creator: IDFEditor;
  editor: IDFEditor;
  submitDate: string;
  attachment: IDFFile[];
  reviewDate: string | null;
  trigger: IDFTrigger;
  triggerDate: string;
}

export interface IDFTrigger {
  id: string;
  department: string;
  departmentCn: string;
  departmentEn: string;
  section: string;
  sectionCn: string;
  sectionEn: string;
  name: string;
  email: string;
}

export interface IDFTemplateRes {
  docId: string;
  id: string;
  createdDate: string; // 2023-08-29 15:00:00
  editDate: string;
  version: string;
  groups: IDFQuestionGroup[];
}

export interface IDFQuestionGroup {
  id: string;
  name: string;
  order: number;
  section: string;
  sectionId: string;
  questions: IDFQuestion;
}
export interface IDFQuestion {
  [key: string]: {
    order: number;
    df: number;
    description: string | null;
    title: string;
    disabled: boolean;
    SubQuestionGroup: {[key: string]: IDFQuestionSubQuestion};
  };
}

export interface IDFQuestionHideExpression {
  questionId: string;
  answerId: string;
  value: any | null;
}

export interface IDFQuestionHideExpressionView {
  selfQuestionId: string;
  selfAnswerId: string;
  questionId: string;
  answerId: string;
  value: any | null;
}

export interface IDFQuestionConfig {
  list: {
    desCode: string | null;
    inSearch: boolean;
    hasFilter: boolean;
    filterConfig: null;
    inform: string | null;
    hasSort: boolean;
    className: string | null;
    style: string | null;
    fixedWidth: string | null;
    fontColor: string | null;
    colorMap: null;
    fontSize: string | null;
    enable: boolean;
    columnWidth: string | null;
  };
}

export interface IDFQuestionSubQuestion {
    type: EFieldType;
    required: boolean;
    disabled: boolean;
    title: string | null;
    placeholder: string | null;
    options: IDFQuestionOption[] | null;
    optionsForNormal?: IOption[] | null;
    className?: string | null;
    hideExpression?: IDFQuestionHideExpression[];
    validation?: IDynamicFromValidator[];
    config?: IDFQuestionConfig;
}

export interface IDynamicFromValidator {
  type: EErrorMessage,
  /** 可放限制的數值 */
  value?: number[] | null,
  regex?: string | null,
}

export interface IDFQuestionOption {
  label: string;
  value: string;
  memo: boolean;
  reportHighLight?: boolean;
  reportAdvice?: string | null;
}

export interface IDFRemark {
  type: EDFAnswerStatus;
  /** 本來有值刪除後傳null，讓後端知道此筆被刪除 */
  content: string | null;
  fieldStatus: EFieldStatus;
  name?: string;
  editDate?: string;
  department: string;
  departmentCn: string;
  departmentEn: string;
  section: string;
  sectionCn: string;
  sectionEn: string;
}

export interface IDFCommentRes {
  docId: string;
  projectDocId: string;
  projectId: string;
  dfId: string;
  comments: {
    [key: number]: IAdminComment[] | IComment[];
  };
}

export interface IComment {
  name: string;
  comment: string;
  date: string;
  tenant: string;
  tenantCn: string;
  tenantEn: string;
  department: string;
  departmentCn: string;
  departmentEn: string;
  section: string;
  sectionCn: string;
}

export interface IAdminComment extends IComment {
  status: EFDProcess;
}

export type ICommitteeRole = 'admin' | 'security' | 'arch' | 'devops' | 'sre';

export interface IDFCommentReq {
  projectId: string;
  dfId: string;
  role: ERole;
  status: EFDProcess;
  comment: string;
}

export interface IDFSchedule {
  dfId: string;
  reviewDate: string;
}

export type IDFRoleReq = IDFRoleForApi[];

export interface IDFRoleForApi {
  userId: string;
  role: string[];
}

export type IDFUserRoleRes = IFDUserRoleForApi[];

export interface IFDUserRoleForApi {
  userId: string;
  tenantId: string;
  name: string;
  email: string;
  status: EUserStatus;
  enabled2fa: boolean;
  enabledNotifications: boolean;
  role: string[];
  createdTime: string;
  lastUpdated: string;
  lastLogin: null;
  imageUrl: string;
}

export interface IDFReviewerPosition {
  id: string;
  nameCn: string;
  nameEn: string;
}
