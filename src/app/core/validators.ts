import {
  AbstractControl,
  UntypedFormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

/**
 * Performs form validation ensuring user input does not contain an empty-string or a string containing all spaces
 * @param control
 */
export function noWhitespaceValidator(
  control: UntypedFormControl
): ValidationErrors | null {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : {whitespace: true};
}

/**
 * Performs form validation ensuring user password format should include over eight characters or numbers, it must include at least one character and number
 * @param control
 */
export function passwordValidator(
  control: UntypedFormControl
): ValidationErrors | null {
  const pattern =
    /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&_+^(){}|,.[\]]{8,}$/.test(
      control.value
    ); // old Regex
  // const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\[\]\{\}\-\+\/\\=_`~'";:|,.<>?])[^\s]{8,}$/.test(control.value);  // new Regex
  return pattern ? null : {passwordInvalid: true};
}

/**
 * Performs form validation ensuring user input contains only valid characters as part of an email's username (ex. everything before the @ symbol)
 * @param control
 */
export function emailUserValidator(
  control: UntypedFormControl
): ValidationErrors | null {
  const val = control.value;
  const pattern = RegExp('^[\\w\\-\\_\\.]+$');
  return pattern.test(val) ? null : {userInvalid: true};
}

export function validDomainValidator(
  control: UntypedFormControl
): ValidationErrors | null {
  const pattern = RegExp('cathay.*.com.?t?w?');
  return pattern.test(control.value) ? null : {invalid: true};
}

export function customEmailValidator(
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
  return {emailFormat: true};
}

export function confirmPasswordValidator(): ValidatorFn {
  return (): ValidationErrors | null => {
    return null; // TODO: ref: modules/admin/reset-password/confirmed.validators.ts
  };
}

export function duplicateCheckValidator(controlArr: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const targetVal = control.value;
    return controlArr.includes(targetVal) ? {duplicated: true} : null;
  };
}

/**
 * 字符數限制(中文2，其他1)
 * @param maxNumber 限制數
 */
export function maxCharNumberValidator(maxNumber: number): ValidatorFn {
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
    return charAmount > maxNumber ? {charMax: true} : null;
  };
}

/** 限雙層(1父層 + 1子層) */
export function atLeastOneValue(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const values = Object.values(control.value);
    return values.some(value => value !== null && value !== '')
      ? null
      : {atLeastOneValue: true};
  };
}

// TODO: moved other commonly used validators here...
