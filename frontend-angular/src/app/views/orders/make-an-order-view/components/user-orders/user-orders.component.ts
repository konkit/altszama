import {Component, input, OnInit, ViewChild} from '@angular/core';
import {GroupedOrderEntry} from "../../../../../../frontend-client";
import {MatAccordion, MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from '@angular/material/list';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'app-user-orders',
    templateUrl: './user-orders.component.html',
    styleUrls: ['./user-orders.component.scss'],
    standalone: true,
  imports: [MatExpansionModule, MatListModule, MatButton]
})
export class UserOrdersComponent implements OnInit {
  readonly groupedEntries = input.required<GroupedOrderEntry[]>();

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  accordionStates!: Array<boolean>

  ngOnInit() {
    this.accordionStates = this.groupedEntries().map((groupedEntry, index) => {
      return groupedEntry.eatingPeopleEntries.map(x => x.sideDishes.length > 0 || x.comments.length > 0)
        .reduce((x, y) => x || y);
    })
  }
}
