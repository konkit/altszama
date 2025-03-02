import {Component} from '@angular/core';
import {MatChip} from '@angular/material/chips';

@Component({
    selector: 'app-chip',
    templateUrl: './chip.component.html',
    styleUrls: ['./chip.component.scss'],
    standalone: true,
  imports: [MatChip]
})
export class ChipComponent {
}
