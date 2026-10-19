import {Component, computed, input, signal, ChangeDetectionStrategy} from '@angular/core';
import {GroupedOrderEntry} from "../../../../../../frontend-client";
import {MatCheckboxModule} from '@angular/material/checkbox';

// Checklist of dishes to read out to the restaurant; ticks live only in this page
@Component({
    selector: 'app-user-orders',
    templateUrl: './user-orders.component.html',
    styleUrls: ['./user-orders.component.scss'],
    standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatCheckboxModule]
})
export class UserOrdersComponent {
  readonly groupedEntries = input.required<GroupedOrderEntry[]>();

  readonly checkedIndexes = signal(new Set<number>())

  readonly doneCount = computed(() => this.checkedIndexes().size)

  isChecked(index: number) {
    return this.checkedIndexes().has(index)
  }

  toggle(index: number, checked: boolean) {
    this.checkedIndexes.update(current => {
      const next = new Set(current)
      if (checked) {
        next.add(index)
      } else {
        next.delete(index)
      }
      return next
    })
  }
}
