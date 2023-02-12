import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDishFormComponent } from './create-dish-form.component';

describe('CreateDishFormComponent', () => {
  let component: CreateDishFormComponent;
  let fixture: ComponentFixture<CreateDishFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDishFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDishFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
