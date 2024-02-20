import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [getFormProvider(CheckboxComponent)]
})
export class CheckboxComponent extends CustomForm {
@Input() id = '';
@Input() title?: string;
@Input() override disabled = false;
@Input() noData = false;
@Input() hasOtherInput = false;
@Input() memo = '';
@Output() memoChange = new EventEmitter<string>();
constructor() { super()};

public onOther(event: Event) {
  if (!this.disabled) {
    const value = (event.target as HTMLInputElement).value;
    this.memoChange.emit(value);
  }
}
}
