/** 角色 */
export enum ERole {
  SiteAdmin = 'SITE_ADMIN',
  TenantAdmin = 'TENANT_ADMIN',
  Reviewer = 'REVIEWER',
  User = 'USER',
  Consultant = 'CONSULTANT',
  Chairman = 'CHAIRMAN',
  Committee = 'COMMITTEE',
  Secretary = 'SECRETARY',
}

/** 表單目的 */
export enum EFormMode {
  Edit = 'edit',
  View = 'view',
  Add = 'new',
  Review = 'review',
  Null = 'null',
}

/** 行為 */
export enum EAction {
  Add = 'add',
  Delete = 'delete',
  Clear = 'clear',
  Close = 'close',
  Cancel = 'cancel',
  Modify = 'modify',
  View = 'view',
}

/** 語言 */
export enum ELang {
  En = 'en',
  Cn = 'zh',
}

/** 內容目的 */
export enum EContent {
  Success = 'success',
  Error = 'error',
  Info = 'inform',
  Warn = 'warn',
  Paused = 'paused',
  NoResponse = 'noResponse',
  Timeout = 'timeout',
}

export enum ELoadingStatus {
  Loading = 0,
  Complete,
  Empty,
  Error,
}

/** 申請流程 */
export enum EFDProcess {
  /** 草稿 */
  Draft = 0,
  /** 申請中 */
  SubmitForReview,
  /** 審核中 */
  UnderReview,
  /** 不通過 */
  Rejected,
  /** 通過 */
  Approved,
  /** 通過待補件 */
  RequiredForApprove,
  /** 通過已補件 */
  SupplementForApprove,
  /** 暫時隱藏：刪除 */
  // Delete,
  /** 取消排程 */
  CancelSchedule = 8,
  /** 返回申請 */
  BackSubmitForReview,
}

/** 欄位狀態 */
export enum EFieldStatus {
  /** 輸入中 */
  Inputting = 0,
  /** 已選取 */
  Checked,
  /** api loading */
  Loading,
  /** 完成 */
  Complete,
  /** 取消 */
  Cancel,
}

export enum EFileType {
  PDF = 'pdf',
  PPT = 'ppt',
  PPT_VND_POWERPOINT = 'vnd.ms-powerpoint',
  PPT_VND_PRESENTATION = 'vnd.openxmlformats-officedocument.presentationml.presentation',
  PPT_MSPOWERPOINT = 'vnd.mspowerpoint',
  PPT_POWERPOINT = 'powerpoint',
  PPT_X_MSPOWERPOINT = 'x-mspowerpoint',
  PPTX = 'vnd.openxmlformats-officedocument.presentationml.presentation',
  IMAGE = 'image',
  PNG = 'png',
  GIF = 'gif',
}

/** 使用者狀態 */
export enum EUserStatus {
  Active = 'ACTIVE',
}

/** 排序方式 */
export enum ESort {
  /** 順冪 */
  Asc = 'asc',
  /** 降冪 */
  Desc = 'desc',
}

/** 樣式種類 */
export enum EColorType {
  /** 主色 */
  Primary = 'primary',
  /** 副色 */
  Secondary = 'secondary',
  /** 警示色 */
  Warn = 'warn',
  /** 無色 */
  Default = 'default',
}

/** 尺寸 */
export enum ESize {
  /** Small */
  S = 's',
  /** Middle */
  M = 'm',
  /** Large */
  L = 'l'
}
