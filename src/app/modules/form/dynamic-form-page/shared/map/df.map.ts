import { IIcon, ILabel } from '@utilities/interface/common.interface';
import { EDFAnswerStatus, EDFReviewerLevel } from '../enum/df.enum';
import { UntypedFormGroup } from '@angular/forms';
import { EFDProcess, ROLE } from '@utilities/enum/common.enum';

export const dfReviewerLevelIconMap = new Map<EDFReviewerLevel, IIcon>([
  [
    EDFReviewerLevel.Admin,
    {
      color: 'green-middle',
      iconCode: '',
      title: 'df.level-chairman',
      order: 0,
    },
  ],
  [
    EDFReviewerLevel.Committee,
    {
      color: 'blue-middle',
      iconCode: '',
      title: 'df.level-committee-member',
      order: 1,
    },
  ],
]);

export interface IDFRoleInfo extends IIcon {
  apiAttrName: string;
  value: number;
}

export const dfStatusMap = new Map<EFDProcess, IIcon>([
  [
    EFDProcess.Approved,
    {
      color: 'green-middle',
      iconCode: '',
      title: 'df.approved',
    },
  ],
  [
    EFDProcess.Rejected,
    {
      color: 'red-middle',
      iconCode: '',
      title: 'df.reject',
    },
  ],
  [
    EFDProcess.Draft,
    {
      color: 'green',
      iconCode: '',
      title: 'df.draft',
    },
  ],
  [
    EFDProcess.UnderReview,
    {
      color: 'orange-middle',
      iconCode: '',
      title: 'df.under-review',
    },
  ],
]);

/** questionId -> question form */
export const dfQuestionFormMap = new Map<string, UntypedFormGroup>([]);

/** 角色不可造訪的階段 */
export const dfRoleProcessMap = new Map<EFDProcess, ROLE[]>([
  [EFDProcess.Draft, []],
  [EFDProcess.SubmitForReview, []],
  [EFDProcess.Approved, []],
  [EFDProcess.RequiredForApprove, []],
  [EFDProcess.SupplementForApprove, []],
  [EFDProcess.Rejected, []],
]);

/** 狀態標籤 */
export const dfProcessLabelMap = new Map<EFDProcess, ILabel>([
  [
    EFDProcess.Draft,
    {
      backgroundColor: 'green-light',
      textColor: 'green-middle',
      title: 'common.draft',
    },
  ],
  [
    EFDProcess.SubmitForReview,
    {
      backgroundColor: 'orange-middle',
      textColor: 'white',
      title: 'common.on-submit',
    },
  ],
  [
    EFDProcess.Approved,
    {
      backgroundColor: 'green-middle',
      textColor: 'white',
      title: 'common.approved',
    },
  ],
  [
    EFDProcess.UnderReview,
    {
      backgroundColor: 'orange-middle',
      textColor: 'white',
      title: 'common.on-review',
    },
  ],
  [
    EFDProcess.RequiredForApprove,
    {
      backgroundColor: 'green-light',
      textColor: 'green-middle',
      title: 'common.already-required-for-approve',
    },
  ],
  [
    EFDProcess.SupplementForApprove,
    {
      backgroundColor: 'green-middle',
      textColor: 'white',
      title: 'common.already-supplement-for-approve',
    },
  ],
  [
    EFDProcess.Rejected,
    {
      backgroundColor: 'red-middle',
      textColor: 'white',
      title: 'common.rejected',
    },
  ],
  [
    EFDProcess.BackSubmitForReview,
    {
      backgroundColor: 'orange-middle',
      textColor: 'white',
      title: 'common.on-submit',
    },
  ],
]);

/** 階段 -> 答案標題 */
export const dfAnswerStatusMap = new Map<EDFAnswerStatus, string>([
  [EDFAnswerStatus.Draft, 'df.answer-status-draft'],
  [EDFAnswerStatus.RequiredForApprove, 'df.answer-status-supplement'],
]);
