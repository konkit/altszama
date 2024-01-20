import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {GroupedOrderEntry} from "../../../../../../frontend-client";
import {MatAccordion, MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from '@angular/material/list';

import {ButtonComponent} from '../../../../../components/button/button.component';

@Component({
    selector: 'app-user-orders',
    templateUrl: './user-orders.component.html',
    styleUrls: ['./user-orders.component.scss'],
    standalone: true,
    imports: [ButtonComponent, MatExpansionModule, MatListModule]
})
export class UserOrdersComponent implements OnInit {
  @Input() groupedEntries!: GroupedOrderEntry[]

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  accordionStates!: Array<boolean>

  ngOnInit() {
    this.accordionStates = this.groupedEntries.map((groupedEntry, index) => {
      return groupedEntry.eatingPeopleEntries.map(x => x.sideDishes.length > 0 || x.comments.length > 0)
        .reduce((x, y) => x || y);
    })
  }
}
