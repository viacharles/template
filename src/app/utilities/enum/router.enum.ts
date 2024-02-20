/** 主Menu */
export enum EModule {
  Form = 'form',
  Table = 'data-table',
  Setting = 'setting',
}

/** 主Menu：表單元件 */
export enum EFormPages {
  Select = 'select',
  Input = 'input',
  Button = 'button',
  File = 'file',
  Calendar = 'calendar',
  DataDrivenForm = 'data-driven-form',
}

/** 主Menu：表格元件 */
export enum ETablePages {
  Table = 'table',
  New = 'new',
}

/** 主Menu：設定 */
export enum ESettingPages {
  Logout = 'logout',
  ResetPassword = 'resetPassword',
}

/** 主Menu：AI聊天室 */
export enum EAssistantPages {
  Chat = 'chat',
}

/** 獨立頁面 */
export enum EIndividualPages {
  Home = 'home',
}

export enum ELogin {
  Login = 'login',
  Register = 'register',
  UserBasicInfo = 'user-basic-info',
}

/** 菜單項目直接觸發的功能 */
export enum EMenuItemFunctionMark {
  Logout = 'logout',
  CabReview = 'cab-review',
  PortfolioOverview = 'portfolio-overview',
}
