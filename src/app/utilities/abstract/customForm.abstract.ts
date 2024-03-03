import {forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {UnSubOnDestroy} from './unSubOnDestroy.abstract';

export function getFormProvider(component: any) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => component),
    multi: true,
  };
}

export class CustomForm<T = any>
  extends UnSubOnDestroy
  implements ControlValueAccessor
{
  constructor() {
    super();
  }

  public model: T | null = null;
  public disabled = false;
  private firstChange = true;

  private onChange?: (value: any) => {};

  protected onTouch(value: any) {}

  writeValue(value: T): void {
    this.model = value;
    this.onModelChanged({
      value,
      isFirstChange: this.firstChange,
    });
    this.firstChange = false;
  }

  protected onModelChanged({
    value,
    isFirstChange,
  }: {
    value: T;
    isFirstChange: boolean;
  }): void {}

  /** 傳入的 value 如果不是 undefined，就使用原本 model 值 */
  protected notifyValueChange(value?: T): void {
    this.model = value !== undefined ? value : this.model;
    if (this.onChange) {
      this.onChange(this.model);
    }
  }

  registerOnChange(fn: (value: any) => {}): void {
    this.onChange = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  registerOnTouched(fn: (value: any) => {}): void {
    this.onTouch = fn;
  }
}
