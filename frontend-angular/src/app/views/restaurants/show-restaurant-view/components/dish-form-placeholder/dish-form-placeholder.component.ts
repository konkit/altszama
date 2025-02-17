import {Component} from '@angular/core';
import {MoneyInputComponent} from '../../../../../components/money-input/money-input.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
    selector: 'app-dish-form-placeholder',
    templateUrl: './dish-form-placeholder.component.html',
    styleUrls: ['./dish-form-placeholder.component.scss'],
    standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MoneyInputComponent, MoneyInputComponent]
})
export class DishFormPlaceholderComponent {

}
