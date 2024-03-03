import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';
import { IDynamicOption } from '@utilities/interface/form.interface';

@Component({
  selector: 'app-radio-set',
  templateUrl: './radio-set.component.html',
  styleUrl: './radio-set.component.scss',
  providers: [getFormProvider(RadioSetComponent)],
})
export class RadioSetComponent extends CustomForm {
  @Input() options: IDynamicOption<string | number>[] = [];
  /** 是否 直排版 */
  @Input() isColumn = true;
  /** 最小寬度 / 欄位 */
  @Input() minWidth = '';
  @Input() isError = false;
  @Input() errorMessage = '';
  @Input() override disabled = false;
  @Input() name?: string;
  @Input() memo?: string;
  @Input() groupMarginTop?: string;
  /** 無資料樣式 */
  @Input() noData = false;
  @Output() memoChange = new EventEmitter<string>();

  constructor() {
    super();
  }

  public change(value: string | number): void {
    this.model = value;
  this.notifyValueChange(value);
}

  public onOther(event: Event) {
    if (!this.disabled) {
      const value = (event.target as HTMLInputElement).value;
      this.memoChange.emit(value);
    }
  }
}
