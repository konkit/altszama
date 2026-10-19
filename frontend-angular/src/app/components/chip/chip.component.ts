import {Component, input, ChangeDetectionStrategy} from '@angular/core';
import {MatChip} from '@angular/material/chips';

export type ChipTone = 'outline' | 'neutral' | 'primary' | 'success' | 'warning' | 'error'

@Component({
    selector: 'app-chip',
    templateUrl: './chip.component.html',
    styleUrls: ['./chip.component.scss'],
    standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatChip]
})
export class ChipComponent {
  readonly tone = input<ChipTone>('outline');
}
