import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-money-input',
  templateUrl: './money-input.component.html',
  styleUrls: ['./money-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MoneyInputComponent),
    multi: true
  }]
})
export class MoneyInputComponent implements ControlValueAccessor {

  @Input() currency: string = "zł"


  stringValue: any;
  newStringValue: any;

  public disabled: boolean = false;
  onChanged: any = (c: any) => {console.log(c)};
  onTouched: any = (t: any) => {console.log(t)};

  /*
  * ControlValueAccessor boilerplate
  *
  */
  writeValue(value: number): void {
    const newValue = this.calcNewValue(value, this.currency);

    this.stringValue = newValue;
    this.newStringValue = newValue;
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }




  onInput(event: Event) {
    this.newStringValue = (event.target as HTMLInputElement).value;

    console.log("newStringValue: ", this.newStringValue, "stringValue: ", this.stringValue)
  }

  onBlur() {
    let valueAsNumber = this.fromString(this.newStringValue);
    this.stringValue = this.calcNewValue(valueAsNumber, this.currency)
    this.newStringValue = this.stringValue

    this.onChanged(valueAsNumber)
  }






  private fromString(a: string) {
    if (!a) {
      return 0;
    }

    const str = a.split(",");

    if (str.length === 0) {
      return 0;
    }

    if (str.length === 1) {
      return parseInt(str[0]) * 100;
    }

    const wholePart = parseInt(str[0].trim()) * 100;

    const fractionPartString = str[1].trim();
    let fractionPart = 0;
    if (fractionPartString.length === 0) {
      fractionPart = 0;
    } else if (fractionPartString.length === 1) {
      fractionPart = parseInt(fractionPartString) * 10;
    } else {
      fractionPart = parseInt(str[1].trim().substr(0, 2));
    }

    return wholePart + fractionPart;
  }

  private calcNewValue(newVal: number, currency: string): string {
    let newValue = 0;

    if (newVal) {
      newValue = newVal;
    }

    const wholePart = Math.floor(newValue / 100);
    const fractionPart = ("0" + (newValue % 100)).slice(-2);

    return `${wholePart},${fractionPart} ${currency}`;
  }
}
