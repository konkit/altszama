import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Observable} from "rxjs";
import {CreateDishResponse, DishControllerService} from "../../../../../../frontend-client";

@Component({
  selector: 'app-create-dish-form',
  templateUrl: './create-dish-form.component.html',
  styleUrls: ['./create-dish-form.component.scss']
})
export class CreateDishFormComponent implements OnInit {

  @Input() restaurantId!: string

  createDishForm = this.fb.group({
    name: "",
    price: 0,
    category: ""
  })

  createData$: Observable<CreateDishResponse> | null = null

  constructor(private fb: FormBuilder, private dishControllerService: DishControllerService) {
  }

  ngOnInit() {
    this.createData$ = this.dishControllerService.createDish(this.restaurantId)
  }

  submitCreateDishForm() {

  }

  cancelCreatingDish() {

  }
}
