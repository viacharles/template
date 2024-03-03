import { IOption } from '@utilities/interface/common.interface';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
@Input() option?: IDynamicOption<string | number>;
@Input() override disabled = false;
@Input() noData = false;
@Input() isError = false;
@Input() memo = '';
@Input() errorMessage = '';
@Output() memoChange = new EventEmitter<string>();


public onMemoInput(event: Event) {
  if (!this.disabled) {
    const value = (event.target as HTMLInputElement).value;
    this.memoChange.emit(value);
  };
}

public change(event: Event): void {
  this.checked = (event.target as HTMLInputElement).checked;
  this.notifyValueChange(this.checked ? this.option?.code : null);
}
}
