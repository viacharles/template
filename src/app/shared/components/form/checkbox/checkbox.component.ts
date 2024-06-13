import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';
import { IDynamicOption } from '@utilities/interface/form.interface';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [getFormProvider(CheckboxComponent)]
})
export class CheckboxComponent extends CustomForm {
  @Input() id = '';
  @Input() name = 'checkbox';
  @Input() checked?: boolean;
  @Input() option?: IDynamicOption<string | number | boolean>;
  @Input() override disabled = false;
  @Input() noData = false;
  @Input() isError = false;
  @Input() memo = '';
  @Input() errorMessage = '';
  /** 為群組內元素 */
  @Input() isInGroup = false;
  @Output() valueChange = new EventEmitter<{ value: string | number | boolean | null, memo: string }>();
  @Output() memoChange = new EventEmitter<string>();

  get currentValue() { return { value: this.checked ? this.option!.code : null, memo: this.memo } }

  public onMemoInput(event: Event) {
    if (!this.disabled) {
      this.notifyValueChange(this.currentValue);
      this.valueChange.emit(this.currentValue);
      this.memoChange.emit(this.memo);
    };
  }

  public change(event: Event): void {
    this.checked = (event.target as HTMLInputElement).checked;
    this.notifyValueChange(this.currentValue);
    this.valueChange.emit(this.currentValue);
  }
}
