import { Component } from '@angular/core';
import { EErrorMessage, EFieldType } from '@utilities/enum/form.enum';
import { IOption } from '@utilities/interface/common.interface';
import { IDynamicOption } from '@utilities/interface/form.interface';

@Component({
  selector: 'app-dynamic-field-edit-dialog',
  templateUrl: './dynamic-field-edit-dialog.component.html',
  styleUrl: './dynamic-field-edit-dialog.component.scss'
})
export class DynamicFieldEditDialogComponent {

  public fieldTypeList: IOption<string>[] = [
    { code: EFieldType.Checkbox, name: 'field' + EFieldType.Checkbox},
    { code: EFieldType.DatePicker, name: 'field' + EFieldType.DatePicker},
    { code: EFieldType.DatePickerRange, name: 'field' + EFieldType.DatePickerRange},
    { code: EFieldType.Input, name: 'field' + EFieldType.Input},
    { code: EFieldType.MultiSelect, name: 'field' + EFieldType.MultiSelect},
    { code: EFieldType.Radio, name: 'field' + EFieldType.Radio},
    { code: EFieldType.Select, name: 'field' + EFieldType.Select},
    { code: EFieldType.TextArea, name: 'field' + EFieldType.TextArea},
    { code: EFieldType.Toggle, name: 'field' + EFieldType.Toggle},
  ];

  public validationOptions: IDynamicOption<string>[] = [
    {code: EErrorMessage.EMAIL_ERROR, name: EErrorMessage.EMAIL_ERROR},
    {code: EErrorMessage.EN_NUMBER_ONLY, name: EErrorMessage.EN_NUMBER_ONLY},
    {code: EErrorMessage.NUMBER_ONLY, name: EErrorMessage.NUMBER_ONLY},
    {code: EErrorMessage.MAX_ITEMS, name: EErrorMessage.MAX_ITEMS, hasMemo: true, memoPlaceholder: '請填數字'},
    {code: EErrorMessage.MIN_ITEMS, name: EErrorMessage.MIN_ITEMS, hasMemo: true, memoPlaceholder: '請填數字'},
    {code: EErrorMessage.MAX_MIN_ITEMS, name: EErrorMessage.MAX_MIN_ITEMS, hasMemo: true, memoPlaceholder: '格式: <min>-<max>'},
    {code: EErrorMessage.MAX_LENGTH, name: EErrorMessage.MAX_LENGTH, hasMemo: true, memoPlaceholder: '請填數字'},
    {code: EErrorMessage.MIN_LENGTH, name: EErrorMessage.MIN_LENGTH, hasMemo: true, memoPlaceholder: '請填數字'},
    {code: EErrorMessage.MAX_MIN_LENGTH, name: EErrorMessage.MAX_MIN_LENGTH, hasMemo: true, memoPlaceholder: '格式: 2-5'},
  ]
}
