import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';
import { IOption } from '@utilities/interface/common.interface';
import { IDynamicOption } from '@utilities/interface/form.interface';

/** 沒有使用 reactive form 與 checkbox 互動 */
@Component({
  selector: 'app-checkbox-set',
  templateUrl: './checkbox-set.component.html',
  styleUrls: ['./checkbox-set.component.scss'],
  providers: [getFormProvider(CheckboxSetComponent)]
})
export class CheckboxSetComponent extends CustomForm implements OnInit, OnChanges {
@Input() name = 'checkbox';
@Input() options: IOption<string | number>[] = [];
@Input() override disabled = false;
@Input() direction: 'row' | 'column' = 'row';
@Input() hasOtherInput = false;
@Input() isError = false;
@Input() memo = '';
@Input() errorMessage = '';
@Output() memoChange = new EventEmitter<string>();

public checkboxes: IDynamicOption<string | number>[] = [];
public override model: (string | number)[] = [];

ngOnInit(): void {
  const timer = setTimeout(() => {
      this.setCheckboxIfChecked();
      clearTimeout(timer);
  }, 100);

}

ngOnChanges({options}: SimpleChanges): void {
  if (options && options.currentValue) {
    if (this.model) {
      this.setCheckboxIfChecked();
    };
  };
}

public change(value: string | number): void {
    if (!this.model || !this.model.includes(value)) {
      (this.model as (string | number)[])!.push(value);
    } else {
      this.model = (this.model as string[])!.filter(exist => exist !== value);
    }
  this.notifyValueChange(this.model);
}

private setCheckboxIfChecked(): void {
  this.checkboxes = this.options
  .map(option => ({
    ...option,
    selected: this.model
    ? this.model.some((vale: string | number) => option.code === vale)
    : false
  }))

}
}
