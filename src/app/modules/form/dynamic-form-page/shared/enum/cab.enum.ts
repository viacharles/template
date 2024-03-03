export enum ECab {
  /** cab1 上線 */
  Cab1Online = 0,
  /** cab1 變更 */
  Cab1Change,
  /** cab2 上線 */
  Cab2Online,
  /** cab2 變更 */
  Cab2Change,
}

export enum ECabReviewerRole {
  Admin = 0,
  Security,
  Arch,
  Devops,
  Sre,
}

export enum ECabReviewerRoleApiName {
  Admin = 'admin',
  Security = 'security',
  Arch = 'arch',
  Devops = 'devops',
  Sre = 'sre',
}

/** cab審核單位列表， 由後端資料動態生成內容 */
export enum ECabReviewerRole {}

export enum ECabReviewerLevel {
  /** 主席 */
  Admin = 0,
  /** 委員 */
  Committee,
}

export enum ECabFormSubmitType {
  /** 草稿 */
  Draft = 0,
  /** 完成 */
  Complete,
}

export enum ECabPageFormStyleType {
  /** 基本資訊 */
  BasicInfo = 0,
  Default,
}

export enum ECabAnswerStatus {
  /** 審核內容 */
  Draft = 0,
  /** 補件說明 */
  RequiredForApprove,
}
