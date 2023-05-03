import {Component, ElementRef, HostBinding, Injector, Input, Optional, Self} from '@angular/core';
import {ControlValueAccessor, NgControl} from "@angular/forms";
import {MatFormFieldControl} from "@angular/material/form-field";
import {BehaviorSubject, Subject, take} from 'rxjs';
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {FocusMonitor} from "@angular/cdk/a11y";

@Component({
  selector: 'app-money-input',
  templateUrl: './money-input.component.html',
  styleUrls: ['./money-input.component.scss'],
  providers: [
    {provide: MatFormFieldControl, useExisting: MoneyInputComponent},
  ]
})
export class MoneyInputComponent implements ControlValueAccessor, MatFormFieldControl<number> {

  /**
   * MatFormFieldControl related
   */

  stateChanges = new Subject<void>();

  private _value: number = 0

  public get value(): number {
    return this._value;
  }

  public set value(val: number) {
    this._value = val;
    this.stateChanges.next();
  }

  controlType = 'money-input';

  static nextId = 0;
  @HostBinding() id = `${this.controlType}-${MoneyInputComponent.nextId++}`;

  private _placeholder: string = ""
  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  focused = false;

  _required = false;
  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elementRef.nativeElement.querySelector('input')?.focus();
    }
    this.onTouched();
  }

  @HostBinding('attr.aria-describedby') describedBy = '';

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  errorState = false;

  get empty() {
    return false;
  }

  @Input() public disabled: boolean = false;

  @Input() currency: string = "zł"


  stringValue$ = new BehaviorSubject<string>("0,00zł");
  newStringValue$ = new BehaviorSubject<string>("0,00zł");

  onChanged: any = (c: any) => {
    console.log("On Changed: ", c)
  };
  onTouched: any = (t: any) => {
    console.log("On Touched: ", t)
    this.errorState = false;
  };

  constructor(
    private injector: Injector,
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef<HTMLInputElement>,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    focusMonitor.monitor(elementRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  /**
   * Handling conversion
   */

  onInput(event: Event) {
    this.newStringValue$.next((event.target as HTMLInputElement).value);
  }

  onBlur() {
    this.newStringValue$.pipe(take(1))
      .subscribe(newStringValue => {
        let valueAsNumber = this.fromString(newStringValue);

        this.stateChanges.next()

        if (valueAsNumber == null) {
          this.errorState = true;
          this.ngControl.control?.setErrors({invalidFormat: true})
        } else {
          this.errorState = false;

          let newCalculatedValue = this.calcNewValue(valueAsNumber, this.currency);

          this.stringValue$.next(newCalculatedValue)
          this.newStringValue$.next(newCalculatedValue)

          this.onChanged(valueAsNumber)
          this.value = valueAsNumber
        }
      })
  }

  /**
   * ControlValueAccessor
   *
   */
  writeValue(value: number): void {
    const newValue = this.calcNewValue(value, this.currency);

    this.stringValue$.next(newValue);
    this.newStringValue$.next(newValue);
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


  /**
   * Helpers
   */

  private fromString(a: string): number | null {
    if (!a) {
      return null;
    }

    const str = a.split(",");

    if (str.length === 0) {
      return null;
    }

    if (str.length === 1) {
      let parsedNumber = parseInt(str[0]) * 100;
      if (isNaN(parsedNumber)) {
        return null;
      }
      return parsedNumber;
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

  private calcNewValue(newVal: number | null, currency: string): string {
    let newValue = 0;

    if (newVal) {
      newValue = newVal;
    }

    const wholePart = Math.floor(newValue / 100);
    const fractionPart = ("0" + (newValue % 100)).slice(-2);

    return `${wholePart},${fractionPart} ${currency}`;
  }
}
