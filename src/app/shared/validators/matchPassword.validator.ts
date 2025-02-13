import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchPasswordValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

        const password = control.get(passwordKey)?.value;
        const confirmPassword = control.get(confirmPasswordKey)?.value;

        if (!password || !confirmPassword) {
            return null;
        }

        if (password && confirmPassword && password !== confirmPassword) {
            const errors = control.get(confirmPasswordKey)?.errors;
            control.get(confirmPasswordKey)?.setErrors({ ...errors, passwordMissMatch: true })
            return { passwordMissMatch: true };
        }

        control.get(confirmPasswordKey)?.setErrors(null);
        return null;
    }

}