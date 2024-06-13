import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import {
  CustomForm,
  getFormProvider,
} from '@utilities/abstract/customForm.abstract';
import { IOption } from '@utilities/interface/common.interface';

@Component({
  selector: 'app-mapping-input',
  templateUrl: './mapping-input.component.html',
  styleUrls: ['./mapping-input.component.scss'],
  providers: [getFormProvider(MappingInputComponent)],
})
export class MappingInputComponent extends CustomForm implements OnChanges {
  @Output() select = new EventEmitter();
  @Output() touch = new EventEmitter();
  @Input() optionSource: IOption<string>[] = [];
  @Input() placeholder = 'df.basic-question-placeholder';
  @Input() enableAll = false;
  @Input() isError = false;

  constructor() {
    super();
  }

  public options: IOption[] = [];
  public isOpen = false;
  public isTouched = false;
  private optionLib: IOption[] = [];

  ngOnChanges() {
    this.optionLib = this.optionSource.map(option => ({
      ...option,
      code: option.code.toLocaleLowerCase(),
    }));
  }

  public onInput(value: string) {
    this.options = value
      ? this.optionSource.filter(option =>
          option.code.includes(this.model.toLocaleLowerCase())
        )
      : [];
    this.isOpen = this.options.length > 0;
    this.notifyValueChange(value);
  }

  public selectOption(option?: IOption) {
    this.isOpen = false;
    this.notifyValueChange(option?.code);
    this.select.emit(this.model);
  }

  public onBlur() {
    this.isTouched = true;
    this.touch.emit();
  }
}
