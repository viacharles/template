/** 固定錯誤訊息
 * 有用於i18n
*/
export enum EErrorMessage {
  /** 有用在 i18n */
  REQUIRED = 'validator.required',
  /** 有用在 i18n */
  MAX_LENGTH = 'validator.max-length',
  /** 有用在 i18n */
  MIN_LENGTH = 'validator.min-length',
  /** 有用在 i18n */
  MAX_MIN_LENGTH = 'validator.max-min-length',
  /** 有用在 i18n */
  MAX_ITEMS = 'validator.max-items',
  /** 有用在 i18n */
  MIN_ITEMS = 'validator.min-items',
  /** 有用在 i18n */
  MAX_MIN_ITEMS = 'validator.max-min-items',
  /** 有用在 i18n */
  NUMBER_ONLY = 'validator.number-only',
  /** 有用在 i18n */
  CN_ONLY = 'validator.cn-only',
  /** 有用在 i18n */
  EN_NUMBER_ONLY = 'validator.en-number-only',
  /** 有用在 i18n */
  FORMAT_ERROR = 'validator.format',
  /** 有用在 i18n */
  EMAIL_ERROR = 'validator.email'
}

/** 欄位類型 */
export enum EFieldType {
  Select = 'select',
  MultiSelect = 'multiselect',
  Radio = 'radio',
  Toggle = 'toggle',
  Checkbox = 'checkbox',
  TextArea = 'textarea',
  Input = 'input',
  DatePicker = 'datepicker',
  DatePickerRange = 'datepicker-range',
}

/** 說明欄位型態 */
export enum EFieldMemoType {
  Default = 'default',
  /** 範圍:兩欄 [min]-[max] */
  Range = 'range',
}

/** 輸入欄型態 */
export enum EInputType {
  Text = 'text',
  Number = 'number',
  Email = 'email',
  Password = 'password',
  Tel = 'tel',
  Url = 'url',
  Search = 'search',
  Date = 'date',
  Time = 'time',
  DateTimeLocal = 'datetime-local',
  Month = 'month',
  Week = 'week',
  Color = 'color',
}


