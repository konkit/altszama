import {Validators} from "@angular/forms";

// Polish IBAN: 26 digits, optionally prefixed with "PL"; spaces allowed
export const bankTransferNumberValidators = [Validators.required, Validators.pattern(/^\s*(PL)?\s*(\d\s*){26}$/i)]

// 9-digit phone number, optionally prefixed with +48; spaces allowed
export const blikPhoneNumberValidators = [Validators.required, Validators.pattern(/^\s*(\+?48)?\s*(\d\s*){9}$/)]

export const discountInPercentValidators = [Validators.min(0), Validators.max(100)]
