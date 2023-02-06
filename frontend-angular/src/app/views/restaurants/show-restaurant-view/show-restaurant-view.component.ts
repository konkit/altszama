import {Component, OnInit} from '@angular/core';
import {RestaurantControllerService, ShowRestaurantResponse} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {map, Observable, switchMap, take, tap} from "rxjs";
import {faAdd, faPencil, faTimes} from "@fortawesome/free-solid-svg-icons";
import * as moment from "moment";
import {FormBuilder} from "@angular/forms";


@Component({
  selector: 'app-show-restaurant-view',
  templateUrl: './show-restaurant-view.component.html',
  styleUrls: ['./show-restaurant-view.component.scss']
})
export class ShowRestaurantViewComponent implements OnInit {

  restaurant$: Observable<ShowRestaurantResponse>

  faPencil = faPencil;
  faTimes = faTimes;

  restaurantEdited = false;
  restaurantEditFormGroup = this.fb.group({
    name: "",
    address: "",
    url: "",
    telephone: "",
  })

  constructor(private restaurantControllerService: RestaurantControllerService,
              private router: Router,
              private fb: FormBuilder,
              private route: ActivatedRoute) {
    this.restaurant$ = this.route.data.pipe(map(r => r['response']))
  }

  ngOnInit() {

  }



  editRestaurant() {
    this.restaurant$.pipe(take(1)).subscribe(response => {
      this.restaurantEditFormGroup.controls.name.setValue(response.restaurant.name)
      this.restaurantEditFormGroup.controls.url.setValue(response.restaurant.url)
      this.restaurantEditFormGroup.controls.address.setValue(response.restaurant.address)
      this.restaurantEditFormGroup.controls.telephone.setValue(response.restaurant.telephone)
      this.setRestaurantEdited(true)
    })
  }

  submitEdit() {
    const formValue = this.restaurantEditFormGroup.value;

    this.restaurant$.pipe(
      take(1),
      switchMap(payload => {
        let restaurantId = payload.restaurant.id;

        let body = {
          id: restaurantId,
          name: formValue.name || "",
          url: formValue.url || "",
          address: formValue.address || "",
          telephone: formValue.telephone || ""
        };

        return this.restaurantControllerService.updateRestaurant(body)
          .pipe(tap(() => {
            this.setRestaurantEdited(false)
            this.router.navigate(['/restaurants/', restaurantId], {onSameUrlNavigation: "reload"})
          }))
      })
    ).subscribe()
  }

  cancelEdit() {
    this.setRestaurantEdited(false)
  }

  deleteRestaurant() {

    this.restaurant$.pipe(
      take(1),
      switchMap(payload => {
        let restaurantId = payload.restaurant.id;

        return this.restaurantControllerService.deleteRestaurant(restaurantId)
          .pipe(tap(() => {
            this.router.navigate(['/restaurants/'], {onSameUrlNavigation: "reload"})
          }))
      })
    ).subscribe()
  }

  deleteDish($event: any) {

  }

  setRestaurantEdited(newValue: boolean) {
    console.trace(newValue)
    this.restaurantEdited = newValue;
  }

  dateToRel(date?: Date) {
    if (date) {
      return moment(date).fromNow();
    } else {
      return "";
    }
  }
}
