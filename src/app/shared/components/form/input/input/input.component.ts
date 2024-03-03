import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';
import { ESize } from '@utilities/enum/common.enum';

@Component({
  selector: 'app-input',
  providers: [getFormProvider(InputComponent)],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent extends CustomForm {
  @Input() type = 'text';
  @Input() id = 'input';
  @Input() placeholder = '請輸入...';
  @Input() errorMessage?: string
  @Input() override disabled = false;
  @Input() isError = false;
  @Input() size: ESize = ESize.Medium;

  public input(event: Event): void {
    this.trim(event);
    this.notifyValueChange((event.target as HTMLInputElement).value);
  }

  private trim(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.trim();
  }
}
