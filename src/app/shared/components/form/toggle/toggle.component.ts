import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [getFormProvider(ToggleComponent)]
})
export class ToggleComponent<T> extends CustomForm {
  @Input() checked?: boolean;
  @Input() id?: string;
  @Input() value?: T;
  @Output() check = new EventEmitter<Event>();

  constructor() { super() }

  public toCheck(event: Event): void {
    this.notifyValueChange(
      // 如果外面沒有傳value就用checked值
      this.value ?
        (event.target as HTMLInputElement).checked ? this.value : null
        : (event.target as HTMLInputElement).checked);
    this.check.emit(event);
  }
}
