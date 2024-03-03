import {
  AbstractControl,
  FormArray,
  FormGroup,
  UntypedFormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { EErrorMessage } from '@utilities/enum/form.enum';

export class ValidatorHelper {

  /**
   * Performs form validation ensuring user input does not contain an empty-string or a string containing all spaces
   * @param control
   */
  public static noWhitespaceValidator(
    control: UntypedFormControl
  ): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  /**
   * Performs form validation ensuring user password format should include over eight characters or numbers, it must include at least one character and number
   * @param control
   */
  public static passwordValidator(
    control: UntypedFormControl
  ): ValidationErrors | null {
    const pattern =
      /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&_+^(){}|,.[\]]{8,}$/.test(
        control.value
      ); // old Regex
    // const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\[\]\{\}\-\+\/\\=_`~'";:|,.<>?])[^\s]{8,}$/.test(control.value);  // new Regex
    return pattern ? null : { passwordInvalid: true };
  }

  /**
   * Performs form validation ensuring user input contains only valid characters as part of an email's username (ex. everything before the @ symbol)
   * @param control
   */
  public static emailUserValidator(
    control: UntypedFormControl
  ): ValidationErrors | null {
    const val = control.value;
    const pattern = RegExp('^[\\w\\-\\_\\.]+$');
    return pattern.test(val) ? null : { userInvalid: true };
  }

  public static validDomainValidator(
    control: UntypedFormControl
  ): ValidationErrors | null {
    const pattern = RegExp('cathay.*.com.?t?w?');
    return pattern.test(control.value) ? null : { invalid: true };
  }

  public static customEmailValidator(
    control: UntypedFormControl
  ): ValidationErrors | null {
    if (
      RegExp(
        /^[^,+=[\]{}*&^%$#@!~?]+@(cathaysec\.com\.tw|cathaylife\.com\.vn|cathaylife\.com\.tw|cathaybk\.com\.tw|cathay-ins\.com\.tw|cathayholdings\.com\.tw)$/
      ).test(control.value) ||
      RegExp('.*@tpisoftware.com').test(control.value)
    ) {
      return null;
    }
    return { emailFormat: true };
  }

  public static confirmPasswordValidator(): ValidatorFn {
    return (): ValidationErrors | null => {
      return null; // TODO: ref: modules/admin/reset-password/confirmed.validators.ts
    };
  }

  public static duplicateCheckValidator(controlArr: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const targetVal = control.value;
      return controlArr.includes(targetVal) ? { duplicated: true } : null;
    };
  }

  /**
   * 字符數限制(中文2，其他1)
   * @param maxNumber 限制數
   */
  public static maxCharNumberValidator(maxNumber: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let charAmount = 0;
      if (control.value) {
        charAmount = control.value
          .split('')
          .reduce(
            (amount: number, letter: string) =>
              (amount = amount + (/[\u4e00-\u9fa5]/.test(letter) ? 2 : 1)),
            0
          );
      }
      return charAmount > maxNumber ? { charMax: true } : null;
    };
  }

  /** 限雙層(1父層 + 1子層) */
  public static atLeastOneValue(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const values = Object.values(control.value);
      return values.some(value => value !== null && value !== '')
        ? null
        : { atLeastOneValue: true };
    };
  }

  /** 子題全都合格(無限層) */
  public static allSubQuestionsValid(control?: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        const allSubControls = control instanceof FormGroup
          ? Object.values(control.controls)
          : control.controls;
        const allValid = allSubControls.every(subControl =>
          subControl instanceof FormGroup || subControl instanceof FormArray
            ? this.allSubQuestionsValid(subControl)
            : subControl.valid
        );
        return allValid ? null : { allSubInvalid: 'not all SubQuestions invalid' }
      }
      else {
        return null;
      }
    };
  }

  /** 只能輸入英數 */
  public static EnNumberOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = /^[a-zA-Z0-9]+$/.test(control.value);
      return isValid ? null : { email: EErrorMessage.EN_NUMBER_ONLY };
    };
  }

  /** 只能輸入數字 */
  public static NumberOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = /^[0-9]+$/.test(control.value);
      return isValid ? null : { email: EErrorMessage.NUMBER_ONLY };
    };
  }

  /** 限制最大與最小字串長度 */
  public static MaxMinLength(max: number, min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value.length <= max && control.value.length >= min;
      return isValid ? null : { email: EErrorMessage.MAX_MIN_LENGTH };
    };
  }

  /** 限制最大字串長度 */
  public static MaxLength(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value.length <= max;
      return isValid ? null : { email: EErrorMessage.MAX_LENGTH };
    };
  }

  /** 限制最小字串長度 */
  public static MinLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value.length >= min;
      return isValid ? null : { email: EErrorMessage.MIN_LENGTH };
    };
  }

  /** 限制最大與最小選取項目數量 */
  public static MaxMinItems(max: number, min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value.length <= max && control.value.length >= min;
      return isValid ? null : { email: EErrorMessage.MAX_MIN_ITEMS };
    };
  }

  /** 限制最大選取項目數量 */
  public static MaxItems(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value.length <= max;
      return isValid ? null : { email: EErrorMessage.MAX_ITEMS };
    };
  }

  /** 限制最小選取項目數量 */
  public static MinItems(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value.length >= min;
      return isValid ? null : { email: EErrorMessage.MIN_ITEMS };
    };
  }

}

