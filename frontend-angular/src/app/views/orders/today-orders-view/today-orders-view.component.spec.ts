import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TodayOrdersViewComponent} from './today-orders-view.component';

describe('TodayOrdersViewComponent', () => {
  let component: TodayOrdersViewComponent;
  let fixture: ComponentFixture<TodayOrdersViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayOrdersViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayOrdersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
