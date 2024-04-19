import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  CustomForm,
  getFormProvider,
} from '@utilities/abstract/customForm.abstract';
import { IDynamicFieldValue } from '@utilities/interface/api/cab-api.interface';
import { IDynamicOption } from '@utilities/interface/form.interface';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [getFormProvider(RadioComponent)],
})
export class RadioComponent extends CustomForm {
  @Input() option?: IDynamicOption<string | number>;
  /** 最小寬度 / 欄位 */
  @Input() minWidth = '';
  @Input() isError = false;
  @Input() errorMessage = '';
  @Input() override disabled = false;
  @Input() name?: string;
  @Input() id?: string;
  @Input() checked?: boolean;
  @Input() memo?: string;
  /** 無資料樣式 */
  @Input() noData = false;
  @Output() valueChange = new EventEmitter<IDynamicFieldValue>();
  @Output() memoChange = new EventEmitter<string>()

  constructor() {
    super();
  }

  public onMemoChange(event: Event) {
    if (!this.disabled) {
      const value = {value: this.model.value, memo: this.memo??''};
      this.notifyValueChange(value);
      this.memoChange.emit(this.memo);
    };
  }

  public check(event: Event): void {
    if (this.disabled) { event.preventDefault() }
    else {
      const input = event.target as HTMLInputElement;

      const value = {value: input.value, memo: this.memo??''};
      this.notifyValueChange(value);
      this.valueChange.emit(value);
    };
  }
}
