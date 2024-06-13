
export enum EDFReviewerRole {
  Admin = 0,
  Security,
  Arch,
  Devops,
  Sre,
}

export enum EDFReviewerRoleApiName {
  Admin = 'admin',
  Security = 'security',
  Arch = 'arch',
  Devops = 'devops',
  Sre = 'sre',
}

/** 審核單位列表， 由後端資料動態生成內容 */
export enum EDFReviewerRole {}

export enum EDFReviewerLevel {
  /** 主席 */
  Admin = 0,
  /** 委員 */
  Committee,
}

export enum EDFSubmitType {
  /** 草稿 */
  Draft = 0,
  /** 完成 */
  Complete,
}

export enum EDFPageFormStyleType {
  /** 基本資訊 */
  BasicInfo = 0,
  Default,
}

export enum EDFAnswerStatus {
  /** 審核內容 */
  Draft = 0,
  /** 補件說明 */
  RequiredForApprove,
}
