import {ECabFormProcess, EFormMode} from '@utilities/enum/common.enum';
import {IIcon} from '@utilities/interface/common.interface';

export type EProcess = ECabFormProcess | null;

/** 程序 -> icon */
export const ProcessIconMap = new Map<EProcess, IIcon>([
  [
    ECabFormProcess.Approved,
    {
      color: 'green-middle',
      iconCode: 'confirmed-round',
      title: 'common.approved',
    },
  ],
  [
    ECabFormProcess.Draft,
    {
      color: 'orange-middle',
      iconCode: 'edit',
      title: 'common.draft',
    },
  ],
  [
    null,
    {
      color: 'green-light-icon',
      iconCode: 'edit',
      title: 'common.canceled',
    },
  ],
  [
    ECabFormProcess.UnderReview,
    {
      color: 'orange-middle',
      iconCode: 'find-doc-solid',
      title: 'common.on-review',
    },
  ],
  [
    ECabFormProcess.SubmitForReview,
    {
      color: 'orange-middle',
      iconCode: 'edit-project-solid',
      title: 'common.on-submit',
    },
  ],
  [
    ECabFormProcess.RequiredForApprove,
    {
      color: 'green-light-icon',
      iconCode: 'edit-doc-solid',
      title: 'common.already-required-for-approve',
    },
  ],
  [
    ECabFormProcess.SupplementForApprove,
    {
      color: 'green-middle',
      iconCode: 'edit-doc-solid',
      title: 'common.already-supplement-for-approve',
    },
  ],
  [
    ECabFormProcess.Rejected,
    {
      color: 'red-middle',
      iconCode: 'delete-round',
      title: 'common.rejected',
    },
  ],
]);

/** 編輯模式 -> icon */
export const formModeIconMap = new Map<EFormMode, IIcon>([
  [
    EFormMode.Edit,
    {
      color: 'green-middle',
      hoverColor: 'green-hover',
      iconCode: 'edit',
      title: 'common.form-mode-edit',
    },
  ],
  [
    EFormMode.View,
    {
      color: 'green-middle',
      hoverColor: 'green-hover',
      iconCode: 'view',
      title: 'common.form-mode-view',
    },
  ],
  [
    EFormMode.Review,
    {
      color: 'green-middle',
      hoverColor: 'green-hover',
      iconCode: 'edit',
      title: 'common.form-mode-review',
    },
  ],
]);
