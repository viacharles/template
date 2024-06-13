import { Component, Input } from '@angular/core';
import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';
import { ESize } from '@utilities/enum/common.enum';
import { IDynamicFieldValue } from '@utilities/interface/api/df-api.interface';

@Component({
  selector: 'app-input',
  providers: [getFormProvider(InputComponent)],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent extends CustomForm<[IDynamicFieldValue] | string> {
  @Input() type = 'text';
  @Input() id = 'input';
  @Input() placeholder = '請輸入...';
  @Input() errorMessage?: string
  @Input() override disabled = false;
  @Input() isError = false;
  /** 是 Dynamic 系統模式： IDynamicFieldValue */
  @Input() isDynamic = false;
  @Input() size: ESize = ESize.M;

  public input(event: Event): void {
    this.trim(event);
    const value = (event.target as HTMLInputElement).value;
    this.notifyValueChange(this.isDynamic ? [{ value, memo: '' }] : value);
  }

  private trim(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.trim();
  }
}
