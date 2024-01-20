import {Component, Input} from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    standalone: true,
    imports: [MatButtonModule]
})
export class ButtonComponent {
  @Input() color: ThemePalette
  @Input() disabled: boolean = false
  @Input() type: string = ""



}
