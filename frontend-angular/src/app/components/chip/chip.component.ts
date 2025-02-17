import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';
import {MatChip} from '@angular/material/chips';

@Component({
    selector: 'app-chip',
    templateUrl: './chip.component.html',
    styleUrls: ['./chip.component.scss'],
    standalone: true,
  imports: [NgClass, MatChip]
})
export class ChipComponent {
  @Input() color!: string
}
