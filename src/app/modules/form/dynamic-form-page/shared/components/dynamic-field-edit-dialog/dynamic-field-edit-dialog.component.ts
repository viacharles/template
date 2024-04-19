import { EFieldMemoType, EInputType } from '@utilities/enum/form.enum';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogContainerComponent } from '@shared/components/overlay/dialog-container/dialog-container.component';
import { BaseDialog } from '@utilities/base/base-dialog';
import { EErrorMessage, EFieldType } from '@utilities/enum/form.enum';
import { IOption } from '@utilities/interface/common.interface';
import { IDynamicOption, ToForm } from '@utilities/interface/form.interface';
import { IEditDynamicForm } from '../../interface/dynamic-form-form.interface';
import { verticalShortenOut } from '@utilities/helper/animations.helper';
import { takeUntil } from 'rxjs';
import { ICabQuestionView } from '../../interface/dynamic-form.interface';

@Component({
  selector: 'app-dynamic-field-edit-dialog',
  templateUrl: './dynamic-field-edit-dialog.component.html',
  styleUrl: './dynamic-field-edit-dialog.component.scss',
  animations: [ verticalShortenOut() ]
})
export class DynamicFieldEditDialogComponent extends BaseDialog<ICabQuestionView> {

  constructor(
    override dialog: DialogContainerComponent,
    ) { super(dialog) }

  public questionForm = new FormGroup<ToForm<IEditDynamicForm>>({
    required: new FormControl(false, Validators.required),
    title: new FormControl('', Validators.required),
    des: new FormControl(''),
    placeholder: new FormControl(''),
    fieldType: new FormControl(null, Validators.required),
    validation: new FormControl([]),
    options: new FormControl([]),
  });

  public validationForm = new FormGroup({});

  public fieldTypeList: IOption<string>[] = [
    { code: EFieldType.Checkbox, name: 'field.' + EFieldType.Checkbox },
    { code: EFieldType.DatePicker, name: 'field.' + EFieldType.DatePicker },
    { code: EFieldType.DatePickerRange, name: 'field.' + EFieldType.DatePickerRange },
    { code: EFieldType.Input, name: 'field.' + EFieldType.Input },
    { code: EFieldType.MultiSelect, name: 'field.' + EFieldType.MultiSelect },
    { code: EFieldType.Radio, name: 'field.' + EFieldType.Radio },
    { code: EFieldType.Select, name: 'field.' + EFieldType.Select },
    { code: EFieldType.TextArea, name: 'field.' + EFieldType.TextArea },
    { code: EFieldType.Toggle, name: 'field.' + EFieldType.Toggle },
  ];

  private validationOptionsSource: IDynamicOption<string>[] = [
    { code: EErrorMessage.EMAIL_ERROR, name: EErrorMessage.EMAIL_ERROR },
    { code: EErrorMessage.EN_NUMBER_ONLY, name: EErrorMessage.EN_NUMBER_ONLY },
    { code: EErrorMessage.NUMBER_ONLY, name: EErrorMessage.NUMBER_ONLY, memoInputType: EInputType.Number },
    { code: EErrorMessage.MAX_ITEMS, name: EErrorMessage.MAX_ITEMS, hasMemo: true, memoPlaceholder: '請填數字', memoInputType: EInputType.Number },
    { code: EErrorMessage.MIN_ITEMS, name: EErrorMessage.MIN_ITEMS, hasMemo: true, memoPlaceholder: '請填數字', memoInputType: EInputType.Number },
    { code: EErrorMessage.MAX_MIN_ITEMS, name: EErrorMessage.MAX_MIN_ITEMS, hasMemo: true, memoType: EFieldMemoType.Range, memoInputType: EInputType.Number },
    { code: EErrorMessage.MAX_LENGTH, name: EErrorMessage.MAX_LENGTH, hasMemo: true, memoPlaceholder: '請填數字', memoInputType: EInputType.Number },
    { code: EErrorMessage.MIN_LENGTH, name: EErrorMessage.MIN_LENGTH, hasMemo: true, memoPlaceholder: '請填數字', memoInputType: EInputType.Number },
    { code: EErrorMessage.MAX_MIN_LENGTH, name: EErrorMessage.MAX_MIN_LENGTH, hasMemo: true, memoType: EFieldMemoType.Range, memoInputType: EInputType.Number },
  ];
  public validationOptions: IDynamicOption<string>[] = [];
  /** 顯示選項欄位 */
  public showOptionField = false;

  protected override onInit() {
    this.reCreateValidationForm();
    this.subscribeQuestionForm();
    if (this.data) {
      this.setValue(this.data);
    };
    console.log('aa-dialog', this.data);
  };

  public submit() {
    console.log('aa-form value', this.questionForm.value);
  }

  public setValue(data: ICabQuestionView): void {
    console.log('aa-setValue', data)
    this.questionForm.patchValue({
      required: data.SubQuestionGroup[0].required,
      title: data.title,
      des: data.description,
      placeholder: data.SubQuestionGroup[0].placeholder,
      fieldType: data.SubQuestionGroup[0].type,
      validation: data.SubQuestionGroup[0].validationView?.map(v => ({type: v.type, value: v.value})),
      options: data.SubQuestionGroup[0].optionsForNormal.map(option => ({content: option.name, hasMemo: !!option.memo})),
    });
  }

  public onAddEmptyItem() {

  }

  private reCreateValidationForm() {
    this.validationForm = new FormGroup({});
    this.validationOptions.forEach(option => {
      if (option.hasMemo) {
        this.validationForm.addControl(option.code, new FormControl('', [
          Validators.required,
          ...(option.memoInputType === EInputType.Number ? [Validators.pattern('^[0-9]*$')] : [])
        ]));
      };
    });
  }

  private subscribeQuestionForm() {
    this.questionForm.controls.fieldType.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((type: EFieldType | null) => {
      this.questionForm.controls.validation.setValue([]);
      this.reSetValidationOptions(type);
      this.reCreateValidationForm();
      if(type === EFieldType.MultiSelect || type === EFieldType.Checkbox || type === EFieldType.Radio || type === EFieldType.Select) {
        this.showOptionField = true;
      };
    });
  }

  // 重新設定驗證選項
  private reSetValidationOptions(value: string | null) {
    const source = [...this.validationOptionsSource];
    if (value === EFieldType.MultiSelect || value === EFieldType.Checkbox) {
      this.validationOptions = source.filter(option => option.code === EErrorMessage.MAX_ITEMS || option.code === EErrorMessage.MIN_ITEMS || option.code === EErrorMessage.MAX_MIN_ITEMS
    );
    }  else if (value === EFieldType.Input || value === EFieldType.TextArea) {
      this.validationOptions = source.filter(option => option.code === EErrorMessage.MAX_LENGTH || option.code === EErrorMessage.MIN_LENGTH || option.code === EErrorMessage.MAX_MIN_LENGTH || option.code === EErrorMessage.CN_ONLY || option.code === EErrorMessage.EMAIL_ERROR || option.code === EErrorMessage.EN_NUMBER_ONLY || option.code === EErrorMessage.NUMBER_ONLY)
    } else {
      this.validationOptions = [];
    };
  }
}
