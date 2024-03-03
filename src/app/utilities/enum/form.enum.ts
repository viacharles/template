/** 固定錯誤訊息
 * 有用於i18n
*/
export enum EErrorMessage {
  REQUIRED = 'validator.required',
  MAX_LENGTH = 'validator.max-length',
  MIN_LENGTH = 'validator.min-length',
  MAX_MIN_LENGTH = 'validator.max-min-length',
  MAX_ITEMS = 'validator.max-items',
  MIN_ITEMS = 'validator.min-items',
  MAX_MIN_ITEMS = 'validator.max-min-items',
  NUMBER_ONLY = 'validator.number-only',
  CN_ONLY = 'validator.cn-only',
  EN_NUMBER_ONLY = 'validator.en-number-only',
  FORMAT_ERROR = 'validator.format',
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


