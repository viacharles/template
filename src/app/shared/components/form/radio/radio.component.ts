import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {
  CustomForm,
  getFormProvider,
} from '@utilities/abstract/customForm.abstract';
import {IOption} from '@utilities/interface/common.interface';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [getFormProvider(RadioComponent)],
})
export class RadioComponent extends CustomForm implements OnChanges {
  @Input() options: IOption<string | number>[] = [];
  /** 是否 直排版 */
  @Input() isColumn = true;
  /** 是否最後一項有input欄位 */
  @Input() hasOtherInput = false;
  /** 最小寬度 / 欄位 */
  @Input() minWidth = '';
  @Input() isError = false;
  @Input() override disabled = false;
  @Input() name?: string;
  @Input() memo?: string;
  @Input() itemMarginTop?: string;
  @Input() groupMarginTop?: string;
  /** 無資料樣式 */
  @Input() noData = false;
  @Output() memoChange = new EventEmitter<string>();

  constructor() {
    super();
  }

  ngOnChanges(): void {}

  public onOther(event: Event) {
    if (!this.disabled) {
      const value = (event.target as HTMLInputElement).value;
      this.memoChange.emit(value);
    }
  }

  public check(event: any): void {
    if (!this.disabled) {
      this.model = event.target.value;
      this.notifyValueChange(event.target.value);
    }
  }
}
