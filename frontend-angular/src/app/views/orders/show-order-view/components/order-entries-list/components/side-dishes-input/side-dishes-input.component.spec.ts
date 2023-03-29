import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideDishesInputComponent } from './side-dishes-input.component';

describe('SideDishesInputComponent', () => {
  let component: SideDishesInputComponent;
  let fixture: ComponentFixture<SideDishesInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideDishesInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideDishesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
