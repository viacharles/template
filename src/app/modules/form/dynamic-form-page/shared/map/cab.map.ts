import {IIcon, ILabel} from '@utilities/interface/common.interface';
import {ECab, ECabAnswerStatus, ECabReviewerLevel} from '../enum/cab.enum';
import {UntypedFormGroup} from '@angular/forms';
import {ECabFormProcess, ERole} from '@utilities/enum/common.enum';

export const cabReviewerLevelIconMap = new Map<ECabReviewerLevel, IIcon>([
  [
    ECabReviewerLevel.Admin,
    {
      color: 'green-middle',
      iconCode: '',
      title: 'cab.level-chairman',
      order: 0,
    },
  ],
  [
    ECabReviewerLevel.Committee,
    {
      color: 'blue-middle',
      iconCode: '',
      title: 'cab.level-committee-member',
      order: 1,
    },
  ],
]);

export interface ICabRoleInfo extends IIcon {
  apiAttrName: string;
  value: number;
}

export const cabStatusMap = new Map<ECabFormProcess, IIcon>([
  [
    ECabFormProcess.Approved,
    {
      color: 'green-middle',
      iconCode: '',
      title: 'cab.approved',
    },
  ],
  [
    ECabFormProcess.Rejected,
    {
      color: 'red-middle',
      iconCode: '',
      title: 'cab.reject',
    },
  ],
  [
    ECabFormProcess.Draft,
    {
      color: 'green',
      iconCode: '',
      title: 'cab.draft',
    },
  ],
  [
    ECabFormProcess.UnderReview,
    {
      color: 'orange-middle',
      iconCode: '',
      title: 'cab.under-review',
    },
  ],
]);

/** questionId -> question form */
export const cabQuestionFormMap = new Map<string, UntypedFormGroup>([]);

export const cabTypeIconMap = new Map<ECab, IIcon>([
  [
    ECab.Cab1Online,
    {
      color: 'blue-middle',
      iconCode: '',
      title: 'cab.basic-question-type-1',
    },
  ],
  [
    ECab.Cab1Change,
    {
      color: 'green-middle',
      iconCode: '',
      title: 'cab.basic-question-type-2',
    },
  ],
  [
    ECab.Cab2Online,
    {
      color: 'blue-middle',
      iconCode: '',
      title: 'cab.basic-question-type-3',
    },
  ],
  [
    ECab.Cab2Change,
    {
      color: 'green-middle',
      iconCode: '',
      title: 'cab.basic-question-type-4',
    },
  ],
]);

/** 角色不可造訪的階段 */
export const cabRoleProcessMap = new Map<ECabFormProcess, ERole[]>([
  [ECabFormProcess.Draft, []],
  [ECabFormProcess.SubmitForReview, []],
  [ECabFormProcess.Approved, []],
  [ECabFormProcess.RequiredForApprove, []],
  [ECabFormProcess.SupplementForApprove, []],
  [ECabFormProcess.Rejected, []],
]);

/** 狀態標籤 */
export const cabProcessLabelMap = new Map<ECabFormProcess, ILabel>([
  [
    ECabFormProcess.Draft,
    {
      backgroundColor: 'green-light',
      textColor: 'green-middle',
      title: 'common.draft',
    },
  ],
  [
    ECabFormProcess.SubmitForReview,
    {
      backgroundColor: 'orange-middle',
      textColor: 'white',
      title: 'common.on-submit',
    },
  ],
  [
    ECabFormProcess.Approved,
    {
      backgroundColor: 'green-middle',
      textColor: 'white',
      title: 'common.approved',
    },
  ],
  [
    ECabFormProcess.UnderReview,
    {
      backgroundColor: 'orange-middle',
      textColor: 'white',
      title: 'common.on-review',
    },
  ],
  [
    ECabFormProcess.RequiredForApprove,
    {
      backgroundColor: 'green-light',
      textColor: 'green-middle',
      title: 'common.already-required-for-approve',
    },
  ],
  [
    ECabFormProcess.SupplementForApprove,
    {
      backgroundColor: 'green-middle',
      textColor: 'white',
      title: 'common.already-supplement-for-approve',
    },
  ],
  [
    ECabFormProcess.Rejected,
    {
      backgroundColor: 'red-middle',
      textColor: 'white',
      title: 'common.rejected',
    },
  ],
  [
    ECabFormProcess.BackSubmitForReview,
    {
      backgroundColor: 'orange-middle',
      textColor: 'white',
      title: 'common.on-submit',
    },
  ],
]);

/** 階段 -> 答案標題 */
export const cabAnswerStatusMap = new Map<ECabAnswerStatus, string>([
  [ECabAnswerStatus.Draft, 'cab.answer-status-draft'],
  [ECabAnswerStatus.RequiredForApprove, 'cab.answer-status-supplement'],
]);
