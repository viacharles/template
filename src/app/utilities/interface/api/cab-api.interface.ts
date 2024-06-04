import {
  ECabFormProcess,
  ERole,
  EUserStatus,
  EFieldStatus,
} from '@utilities/enum/common.enum';
import {IOption} from '../common.interface';
import { ECabAnswerStatus, ECabFormSubmitType } from 'src/app/modules/form/dynamic-form-page/shared/enum/cab.enum';
import { EErrorMessage, EFieldType } from '@utilities/enum/form.enum';

export interface ICabBasicInfoReq {
  projectName: string;
  projectId: null;
  projectOwnerSectionNameCN: string;
  projectOwnerName: string;
  cab: number;
}

export interface ICabBasicInfoRes {
  docId: string;
  cabId: string;
  projectName: string;
  projectId: string;
  projectOwnerSectionNameCN: string;
  projectOwnerName: string;
  cab: number;
  questionVersion: string | null;
  version: string;
  status: ECabFormProcess;
  answers: ICabAnswer | null;
  tenantCn: string;
  tenantId: string;
  createDate: string; // 2023-10-12 09:00:00
  editDate: string | null;
  creator: ICabEditor;
  editor: ICabEditor | null;
  attachment: ICabFile[];
}

export interface ICabAnswer {
  [key: string]: {
    // questionId
    groupId: string;
    sectionId: string;
    values: ICabQuestionValue;
    remark: ICabRemark[] | null;
  };
}

export interface ICabQuestionValue {
  [key: string]: // questionId
  IDynamicFieldValue[];
}

export interface IDynamicFieldValue {
  value: string | number | boolean;
  memo: string;
}

export interface ICabEditor {
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

export interface ICabFile {
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
  type: ECabAnswerStatus;
  fieldStatus: EFieldStatus;
}

export interface ICabApplicationAnswerReq {
  docId: string;
  cabId: string;
  projectId: string;
  questionVersion: string;
  answers: ICabApplicationAnswerReqAnswers;
  attachment: ICabFile[];
}

export interface ICabSupplementReq {
  projectId: string;
  cabId: string;
  remark: {[questionId: string]: ICabRemark}[] | null;
  attachment: ICabFile | null;
}

export interface ICabApplicationAnswerReqAnswers {
  [key: string]: {
    values: IDynamicFieldValue[];
  };
}


export interface ICabApplicationAnswerRes {
  type: ECabFormSubmitType;
  docId: string;
  cabId: string;
  projectName: string;
  projectId: string;
  projectOwnerSectionNameCN: string;
  projectOwnerName: string;
  cab: number;
  questionVersion: string;
  version: string;
  status: ECabFormProcess;
  answers: ICabAnswer;
  tenantCn: string;
  tenantId: string;
  createDate: string; // 2023-10-12 09:00:00
  editDate: string;
  creator: ICabEditor;
  editor: ICabEditor;
  submitDate: string;
  attachment: ICabFile[];
  reviewDate: string | null;
  trigger: ICabTrigger;
  triggerDate: string;
}

export interface ICabTrigger {
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

export interface ICabTemplateRes {
  docId: string;
  id: string;
  createdDate: string; // 2023-08-29 15:00:00
  editDate: string;
  version: string;
  groups: ICabQuestionGroup[];
}

export interface ICabQuestionGroup {
  id: string;
  name: string;
  order: number;
  section: string;
  sectionId: string;
  questions: ICabQuestion;
}
export interface ICabQuestion {
  [key: string]: {
    order: number;
    cab: number;
    description: string | null;
    title: string;
    disabled: boolean;
    SubQuestionGroup: {[key: string]: ICabQuestionSubQuestion};
  };
}

export interface ICabQuestionHideExpression {
  questionId: string;
  answerId: string;
  value: any | null;
}

export interface ICabQuestionHideExpressionView {
  selfQuestionId: string;
  selfAnswerId: string;
  questionId: string;
  answerId: string;
  value: any | null;
}

export interface ICabQuestionConfig {
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

export interface ICabQuestionSubQuestion {
    type: EFieldType;
    required: boolean;
    disabled: boolean;
    title: string | null;
    placeholder: string | null;
    options: ICabQuestionOption[] | null;
    optionsForNormal?: IOption[] | null;
    className?: string | null;
    hideExpression?: ICabQuestionHideExpression[];
    validation?: IDynamicFromValidator[];
    config?: ICabQuestionConfig;
}

export interface IDynamicFromValidator {
  type: EErrorMessage,
  /** 可放限制的數值 */
  value?: number[] | null,
  regex?: string | null,
}

export interface ICabQuestionOption {
  label: string;
  value: string;
  memo: boolean;
  reportHighLight?: boolean;
  reportAdvice?: string | null;
}

export interface ICabRemark {
  type: ECabAnswerStatus;
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

export interface ICabCommentRes {
  docId: string;
  projectDocId: string;
  projectId: string;
  cabId: string;
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
  status: ECabFormProcess;
}

export type ICommitteeRole = 'admin' | 'security' | 'arch' | 'devops' | 'sre';

export interface ICabCommentReq {
  projectId: string;
  cabId: string;
  role: ERole;
  status: ECabFormProcess;
  comment: string;
}

export interface ICabSchedule {
  cabId: string;
  reviewDate: string;
}

export type ICabRoleReq = ICabRoleForApi[];

export interface ICabRoleForApi {
  userId: string;
  role: string[];
}

export type ICabUserRoleRes = ICabUserRoleForApi[];

export interface ICabUserRoleForApi {
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

export interface ICabReviewerPosition {
  id: string;
  nameCn: string;
  nameEn: string;
}
