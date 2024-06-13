import { AbstractControl, FormControl, UntypedFormGroup } from '@angular/forms';
import { EFDProcess } from '@utilities/enum/common.enum';
import {
  IDFApplicationAnswerRes,
  IDFQuestionConfig,
  IDFQuestionHideExpressionView, IDFRemark,
  IDFTemplateRes,
  IDynamicFieldValue,
  IDynamicFromValidator
} from '@utilities/interface/api/df-api.interface';
import { IDFRoleInfo } from '../map/df.map';
import { EDFPageFormStyleType } from '../enum/df.enum';
import { IOption } from '@utilities/interface/common.interface';
import { EFieldType } from '@utilities/enum/form.enum';
import { IDynamicOption } from '@utilities/interface/form.interface';

export interface IDFTemplateView extends IDFTemplateRes {
  groupsView: IDFQuestionGroupView[];
}

export interface IDFQuestionView {
  questionId: string;
  form: UntypedFormGroup;
  order: number;
  // df: number;
  show: boolean;
  description: string | null;
  title: string | null;
  disabled: boolean;
  SubQuestionGroupForm: UntypedFormGroup;
  SubQuestionGroup: IDFQuestionSubQuestionGroupView[];
}

export interface IDFQuestionSubQuestionGroupView {
  answerId: string;
  form: FormControl;
  type: EFieldType;
  show: boolean;
  required: boolean;
  disabled: boolean;
  title: string | null;
  placeholder: string | null;
  options: IDynamicOption<string>[] | null;
  optionsForNormal: IDynamicOption<string>[];
  className?: string | null;
  hideExpression?: IDFQuestionHideExpressionView[];
  validation?: IDynamicFromValidator[];
  validationView?: IDynamicFromValidator[];
  config?: IDFQuestionConfig;
}

export interface IDFFormPage {
  styleType: EDFPageFormStyleType;
  groups: IDFQuestionGroupView[];
}

export interface IDFQuestionGroupView {
  id: string;
  form: UntypedFormGroup;
  name: string;
  order: number;
  section: string;
  sectionId: string;
  questions: IDFQuestionView[];
}

export interface IDFCommitteeView {
  docId: string;
  projectDocId: string;
  projectId: string;
  dfId: string;
  comments: IRoleComment[];
}

export interface IDFReviewFormView {
  questionTemplateDocId: string;
  questionTemplateId: string | null;
  createDate: string;
  editDate: string | null;
  version: string;
  groups: any;
  fileForm?: AbstractControl | null;
  groupsView: IDFReviewFormGroupView[];
}

export interface IDFReviewFormGroupView {
  order: number;
  section: string;
  sectionId: string;
  name: string;
  id: string;
  form: UntypedFormGroup;
  questions: IDFReviewFormQuestionView[];
}

export interface IDFReviewFormQuestionView {
  questionId: string;
  description: string | null;
  order: number;
  df: string;
  show: boolean;
  shortTitleEN: string | null;
  shortTitleCN: string | null;
  longTitleEN: string | null;
  longTitleCN: string | null;
  disabled: boolean;
  SubQuestionGroup: IDFReviewFormAnswerView[];
  SubQuestionGroupForm: UntypedFormGroup;
  form: UntypedFormGroup;
  remarks: IDFRemark[];
}

export interface IDFReviewFormAnswerView {
  type: EFieldType;
  answerId: string;
  required: boolean;
  disabled: boolean;
  title: string | null;
  className: string | null;
  placeholder: string | null;
  hideExpression: [
    {
      answerId: string;
      questionId: string;
      value: string | null;
    },
  ];
  config: null;
  options: IDFReviewFormOptionView[][];
  optionForNormal: IOption[];
  valueView: IDynamicFieldValue[];
  form: UntypedFormGroup;
  show: boolean;
}

export interface IDFReviewFormOptionView {
  label: string;
  value: number;
  reportHighLight: boolean;
  reportAdvice: string | null;
  hasMemo: boolean;
}

export interface IRoleComment extends IDFRoleInfo {
  commentInfo: IComment[];
}

// type Comment<Name, Data> = {
//   name: Name,
//   data: Data
// }

// type Admin = Comment<0, IAdminComment>;
// type Other = Comment<1 | 2 | 3 | 4, IComment>;

// type Comment2 = Array<Admin | Other>;

// const test: Comment2 = [
//   {
//     name: 'admin',
//     data: {

//     }
//   },
//   {
//     name: 'devops',
//     data: {

//     }
//   }
// ]
export interface IComment {
  name: string;
  comment: string;
  date: string;
  status?: EFDProcess.Approved | EFDProcess.Rejected | null;
}

export interface IDFRecordInfo {
  current: {
    sourceData: IDFApplicationAnswerRes;
    projectName: string;
    dfId: string;
    status: EFDProcess;
    creator: {
      departmentName: string;
      sectionName: string;
      name: string;
      id: string;
    };
  };
  list: {
    triggerDate: string;
    content: string;
    editorName?: string;
    tenantCn?: string;
    status?: EFDProcess;
  }[];
}

export interface IDFProjectInfo {
  name: string;
  ownerName: string;
  tenantName: string;
}
