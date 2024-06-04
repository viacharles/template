import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { EErrorMessage } from "@utilities/enum/form.enum";
import { IDynamicFieldValue } from "@utilities/interface/api/cab-api.interface";
@Injectable({
  providedIn: 'root'
})
export class DynamicFormValidatorsService {

  constructor(private $translate: TranslateService){}
    /** 動態表單專用：email */
    public DynamicEmail(control: AbstractControl): { error: string; } | null {
      const isValid = control.value && control.value.length > 0 ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value[0].value) : true;
      const error: any = {};
      error[`${EErrorMessage.EMAIL_ERROR}`] = this.$translate.instant(EErrorMessage.EMAIL_ERROR);
      return isValid ? null : error;
    }

  /** 動態表單專用：只能輸入英數 */
  public DynamicEnNumberOnly(control: AbstractControl): { error: string; } | null {
    const isValid = control.value.every(({ value }: IDynamicFieldValue) => /^[a-zA-Z0-9]+$/.test(`${value}`));
    const error: any = {};
    error[`${EErrorMessage.EN_NUMBER_ONLY}`] = this.$translate.instant(EErrorMessage.EN_NUMBER_ONLY);
    return isValid ? null : error;
  }

  /** 動態表單專用：只能輸入數字 */
  public DynamicNumberOnly(control: AbstractControl): { error: string; } | null {
    const isValid = control.value.every(({ value }: IDynamicFieldValue) => /^[0-9]+$/.test(`${value}`));
    const error: any = {};
    error[`${EErrorMessage.NUMBER_ONLY}`] = this.$translate.instant(EErrorMessage.NUMBER_ONLY);
    return isValid ? null : error;
  }

  /** 動態表單專用：限制最大與最小字串長度 */
  public DynamicMaxMinLength(control: AbstractControl, min: number, max: number): { error: string; } | null {
    const value = control.value;
    const isValid = value.length > 0 ? (`${value[0].value}`.length <= max && `${value[0].value}`.length >= min) : true;
    const error: any = {};
    error[`${EErrorMessage.MAX_MIN_LENGTH}`] = `${this.$translate.instant(EErrorMessage.MAX_MIN_LENGTH)}(${min}-${max})`;
    return isValid ? null : error;
  }

  /** 動態表單專用：限制最大字串長度 */
  public DynamicMaxLength(control: AbstractControl, max: number): { error: string; } | null {
    const isValid = `${control.value}`.length > 0 ? `${control.value[0].value}`.length <= max : true;
    const error: any = {};
    error[`${EErrorMessage.MAX_LENGTH}`] = `${this.$translate.instant(EErrorMessage.MAX_LENGTH)}(${max})`;
    return isValid ? null : error;
  }

  /** 動態表單專用：限制最小字串長度 */
  public DynamicMinLength(control: AbstractControl, min: number): { error: string; } | null {
    const isValid = control.value.length > 0 ? `${control.value[0].value}`.length >= min : true;
    const error: any = {};
    error[`${EErrorMessage.MIN_LENGTH}`] = `${this.$translate.instant(EErrorMessage.MIN_LENGTH)}(${min})`;
    return isValid ? null : error;
  }

  /** 動態表單專用：限制最大與最小選取項目數量 */
  public DynamicMaxMinItems(control: AbstractControl, min: number, max: number): { error: string; } | null {
    const isValid = control.value.length <= max && control.value.length >= min;
    const error: any = {};
    error[`${EErrorMessage.MAX_MIN_ITEMS}`] = `${this.$translate.instant(EErrorMessage.MAX_MIN_ITEMS)}(${min}-${max})`;
    return isValid ? null : error;
  }

  /** 動態表單專用：限制最大選取項目數量 */
  public DynamicMaxItems(control: AbstractControl, max: number): { error: string; } | null {
    const isValid = control.value.length <= max;
    const error: any = {};
    error[`${EErrorMessage.MAX_ITEMS}`] = `${this.$translate.instant(EErrorMessage.MAX_ITEMS)}(${max})`;
    return isValid ? null : error;
  }

  /** 動態表單專用：限制最小選取項目數量 */
  public DynamicMinItems(control: AbstractControl, min: number): { error: string; } | null {
    const isValid = control.value.length >= min;
    const error: any = {};
    error[`${EErrorMessage.MIN_ITEMS}`] = `${this.$translate.instant(EErrorMessage.MIN_ITEMS)}(${min})`;
    return isValid ? null : error;
  }
}
