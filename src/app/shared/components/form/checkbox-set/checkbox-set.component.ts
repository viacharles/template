import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';
import { IDynamicFieldValue } from '@utilities/interface/api/cab-api.interface';
import { IOption } from '@utilities/interface/common.interface';
import { IDynamicOption } from '@utilities/interface/form.interface';

// 因為 model 包含有勾選的項目，所以另外用變數 checkboxes 來顯示畫面上的選項。

@Component({
  selector: 'app-checkbox-set',
  templateUrl: './checkbox-set.component.html',
  styleUrls: ['./checkbox-set.component.scss'],
  providers: [getFormProvider(CheckboxSetComponent)]
})
export class CheckboxSetComponent extends CustomForm implements OnInit, OnChanges, AfterViewInit {
  @Input() name = 'checkbox';
  @Input() options: IOption<string>[] = [];
  @Input() override disabled = false;
  @Input() direction: 'row' | 'column' = 'row';
  @Input() hasOtherInput = false;
  @Input() isError = false;
  @Input() errorMessage = '';

  public checkboxes: IDynamicOption<string | number | boolean>[] = [];
  public override model: IDynamicFieldValue[] = [];
  public form = new FormGroup({ checks: new FormArray<FormControl<IDynamicFieldValue | null>>([])});
  get f() { return this.form.get('checks') as FormArray };


  ngOnInit(): void {
    const timer = setTimeout(() => {
      this.setCheckboxIfChecked();
      clearTimeout(timer);
    }, 100);
  }

  ngAfterViewInit(): void {
    if (this.options && this.options?.length > 0 && this.model && this.model?.length > 0) {
      this.init();
    };
  }

  ngOnChanges({ options }: SimpleChanges): void {
    if (options && options.currentValue) {
      this.options = options.currentValue;
        this.setCheckboxIfChecked();
    };
  }

  public onMemoChange(memo: string, index: number): void {
    this.checkboxes[index].memo = memo;
    const modelIndex = this.model.findIndex(v => v.value === this.checkboxes[index].code);
    const value = this.model;
    value[modelIndex].memo = memo;
    this.notifyValueChange(value);
  }

  public change(checkValue: { value: string | number | boolean | null, memo: string }, targetIndex: number): void {
    // model 沒有相同的 value 值則 push 進此新項目，
    // 否則如果 memo 值不同，則更新該項目的 memo，
    // 否則過濾掉該項目。
    if (checkValue.value !== null) {
      if ( (!this.model || !this.model.some(m => m.value === checkValue.value))) {
        this.model.push({ value: checkValue.value, memo: checkValue.memo });
      } else if ( checkValue.memo !== this.model.find(m => m.value === checkValue.value)?.memo) {
        const index = this.model.findIndex(m => m.value === checkValue.value);
        this.model[index].memo = checkValue.memo;
      }
    } else {
      this.writeValue(this.model.filter(exist => exist.value && (exist.value !== this.checkboxes[targetIndex].code)));
    };

    this.notifyValueChange(this.model);
  }

  private setCheckboxIfChecked(): void {

    this.checkboxes = this.options
      .map((option, index) => {
        const model = this.model.find(v=> `${v.value}` === `${option.code}`);
        return ({
        ...option,
        memo: model ? model.memo : '',
        isSelect: this.model
          ? this.model.some(v => option.code === ((typeof v === 'object' && v !== null) ? v.value : v))
          : false
      })})
  }

  private init(): void {
    const timer = setTimeout(() => {
      this.setCheckboxIfChecked();
      clearTimeout(timer);
    });
  }
}
