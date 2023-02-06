import {Component, Input} from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() color: ThemePalette
  @Input() icon?: IconProp
  @Input() disabled: boolean = false



}
