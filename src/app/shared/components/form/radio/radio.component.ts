import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {
  CustomForm,
  getFormProvider,
} from '@utilities/abstract/customForm.abstract';
import { IDynamicOption } from '@utilities/interface/form.interface';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [getFormProvider(RadioComponent)],
})
export class RadioComponent extends CustomForm implements AfterViewInit {
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
  @Output() memoChange = new EventEmitter<string>();

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    if (this.option) {
      const timer = setTimeout(() => {
        clearTimeout(timer);
      });
      ;
    };
  }

  public onOther(event: Event) {
    if (!this.disabled) {
      const value = (event.target as HTMLInputElement).value;
      this.memoChange.emit(value);
    }
  }

  public check(event: Event): void {
    if (this.disabled) { event.preventDefault() }
    else {
      const input = event.target as HTMLInputElement;
      this.model = input.value;
      this.notifyValueChange(input.value);
    };
  }
}
