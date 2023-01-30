import {Component, OnInit} from '@angular/core';
import {RestaurantControllerService, ShowRestaurantResponse} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {map, Observable, switchMap} from "rxjs";
import {faAdd, faPencil, faTimes} from "@fortawesome/free-solid-svg-icons";
import * as moment from "moment";


@Component({
  selector: 'app-show-restaurant-view',
  templateUrl: './show-restaurant-view.component.html',
  styleUrls: ['./show-restaurant-view.component.scss']
})
export class ShowRestaurantViewComponent implements OnInit {

  restaurant$: Observable<ShowRestaurantResponse>

  faAdd = faAdd;
  faPencil = faPencil;
  faTimes = faTimes;

  constructor(private api: RestaurantControllerService,
              private router: Router,
              private route: ActivatedRoute) {
    this.restaurant$ = this.route.data.pipe(map(r => r['response']))
  }

  ngOnInit() {

  }

  goToCreateDish() {

  }

  editRestaurant() {

  }

  deleteRestaurant() {

  }

  deleteDish($event: any) {

  }

  dateToRel(date?: Date) {
    if (date) {
      return moment(date).fromNow();
    } else {
      return "";
    }
  }
}
