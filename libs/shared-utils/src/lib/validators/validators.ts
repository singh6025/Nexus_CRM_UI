import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const cleaned = String(control.value).replace(/\D/g, '');
    const valid = /^[6-9]\d{9}$/.test(cleaned);
    return valid ? null : { invalidPhone: { value: control.value } };
  };
}

export function gstValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(control.value) ? null : { invalidGst: { value: control.value } };
  };
}

export function positiveNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = Number(control.value);
    if (control.value === null || control.value === '') return null;
    return value > 0 ? null : { notPositive: { value: control.value } };
  };
}
