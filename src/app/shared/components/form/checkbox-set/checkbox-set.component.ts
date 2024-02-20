import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomForm } from '@utilities/abstract/customForm.abstract';
import { IOption } from '@utilities/interface/common.interface';

@Component({
  selector: 'app-checkbox-set',
  templateUrl: './checkbox-set.component.html',
  styleUrls: ['./checkbox-set.component.scss']
})
export class CheckboxSetComponent extends CustomForm {
@Input() id = '';
@Input() options: IOption[] = [];
@Input() override disabled = false;
@Input() direction: 'row' | 'column' = 'row';
@Input() hasOtherInput = false;
@Input() memo = '';
@Output() memoChange = new EventEmitter<string>();

public onOther(event: Event) {
  if (!this.disabled) {
    const value = (event.target as HTMLInputElement).value;
    this.memoChange.emit(value);
  }
}
}
