/** 主Menu */
export enum Modules {
  Form = 'form',
  Table = 'data-table',
  Setting = 'setting',
}

/** 主Menu：表單元件 */
export enum FormPages {
  CustomComponent = 'custom-component-sample',
  Input = 'input',
  Button = 'button',
  File = 'file',
  DynamicForm = 'dynamic-form-generation',
}

/** 主Menu：表格元件 */
export enum TablePages {
  Table = 'table',
  New = 'new',
}

/** 主Menu：設定 */
export enum SettingPages {
  Logout = 'logout',
  ResetPassword = 'resetPassword',
}

/** 主Menu：AI聊天室 */
export enum AssistantPages {
  Chat = 'chat',
}

/** 獨立頁面 */
export enum IndividualPages {
  Home = 'home',
}

export enum LoginPages {
  Login = 'login',
  Register = 'register',
  UserBasicInfo = 'user-basic-info',
}

/** 菜單項目直接觸發的功能 */
export enum MenuItemFunctionMark {
  Logout = 'logout',
  DFReview = 'df-review',
  PortfolioOverview = 'portfolio-overview',
}
