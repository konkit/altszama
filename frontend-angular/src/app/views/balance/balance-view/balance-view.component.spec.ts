import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceViewComponent } from './balance-view.component';

describe('BalanceViewComponent', () => {
  let component: BalanceViewComponent;
  let fixture: ComponentFixture<BalanceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
