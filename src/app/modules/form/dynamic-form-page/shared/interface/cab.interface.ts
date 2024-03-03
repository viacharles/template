import {AbstractControl, UntypedFormGroup} from '@angular/forms';
import {ECabFormProcess} from '@utilities/enum/common.enum';
import {
  ICabApplicationAnswerRes,
  ICabQuestionConfig,
  ICabQuestionHideExpressionView,
  ICabQuestionOption,
  ICabRemark,
  ICabTemplateRes,
  ICabValue,
  IDynamicFromValidator,
} from '@utilities/interface/api/cab-api.interface';
import {ICabRoleInfo} from '../map/cab.map';
import {ECab, ECabPageFormStyleType} from '../enum/cab.enum';
import {IOption} from '@utilities/interface/common.interface';
import { EFieldType } from '@utilities/enum/form.enum';
import { IDynamicOption } from '@utilities/interface/form.interface';

export interface ICabTemplateView extends ICabTemplateRes {
  groupsView: ICabQuestionGroupView[];
}

export interface ICabQuestionView {
  questionId: string;
  form: UntypedFormGroup;
  order: number;
  cab: number;
  show: boolean;
  description: string | null;
  title: string | null;
  disabled: boolean;
  SubQuestionGroupForm: UntypedFormGroup;
  SubQuestionGroup: ICabQuestionSubQuestionGroupView[];
}

export interface ICabQuestionSubQuestionGroupView {
  answerId: string;
  form: UntypedFormGroup;
  type: EFieldType;
  show: boolean;
  required: boolean;
  disabled: boolean;
  title: string | null;
  placeholder: string | null;
  options: ICabQuestionOption[][] | null;
  optionsForNormal: IDynamicOption<string>[];
  className?: string | null;
  hideExpression?: ICabQuestionHideExpressionView[];
  validation?: IDynamicFromValidator[];
  validationView?: IDynamicFromValidator[];
  config?: ICabQuestionConfig;
}

export interface ICabFormPage {
  styleType: ECabPageFormStyleType;
  groups: ICabQuestionGroupView[];
}

export interface ICabQuestionGroupView {
  id: string;
  form: UntypedFormGroup;
  name: string;
  order: number;
  section: string;
  sectionId: string;
  questions: ICabQuestionView[];
}

export interface ICabCommitteeView {
  docId: string;
  projectDocId: string;
  projectId: string;
  cabId: string;
  comments: IRoleComment[];
}

export interface ICabReviewFormView {
  questionTemplateDocId: string;
  questionTemplateId: string | null;
  createDate: string;
  editDate: string | null;
  version: string;
  groups: any;
  fileForm?: AbstractControl | null;
  groupsView: ICabReviewFormGroupView[];
}

export interface ICabReviewFormGroupView {
  order: number;
  section: string;
  sectionId: string;
  name: string;
  id: string;
  form: UntypedFormGroup;
  questions: ICabReviewFormQuestionView[];
}

export interface ICabReviewFormQuestionView {
  questionId: string;
  description: string | null;
  order: number;
  cab: ECab;
  show: boolean;
  shortTitleEN: string | null;
  shortTitleCN: string | null;
  longTitleEN: string | null;
  longTitleCN: string | null;
  disabled: boolean;
  SubQuestionGroup: ICabReviewFormAnswerView[];
  SubQuestionGroupForm: UntypedFormGroup;
  form: UntypedFormGroup;
  remarks: ICabRemark[];
}

export interface ICabReviewFormAnswerView {
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
  options: ICabReviewFormOptionView[][];
  optionForNormal: IOption[];
  valueView: ICabValue[];
  form: UntypedFormGroup;
  show: boolean;
}

export interface ICabReviewFormOptionView {
  label: string;
  value: number;
  reportHighLight: boolean;
  reportAdvice: string | null;
  memo: boolean;
}

export interface IRoleComment extends ICabRoleInfo {
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
  status?: ECabFormProcess.Approved | ECabFormProcess.Rejected | null;
}

export interface ICabRecordInfo {
  current: {
    sourceData: ICabApplicationAnswerRes;
    projectName: string;
    cabId: string;
    status: ECabFormProcess;
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
    status?: ECabFormProcess;
  }[];
}

export interface ICabProjectInfo {
  name: string;
  ownerName: string;
  tenantName: string;
}
