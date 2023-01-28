import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysOrderViewComponent } from './todays-order-view.component';

describe('TodaysOrderViewComponent', () => {
  let component: TodaysOrderViewComponent;
  let fixture: ComponentFixture<TodaysOrderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodaysOrderViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodaysOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
