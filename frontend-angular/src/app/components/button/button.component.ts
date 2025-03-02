import {Component, input} from '@angular/core';
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
  readonly color = input<ThemePalette>();
  readonly disabled = input<boolean>(false);
  readonly type = input<string>("");



}
