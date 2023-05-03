import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingOrderEntryCardComponent } from './existing-order-entry-card.component';

describe('ExistingOrderEntryCardComponent', () => {
  let component: ExistingOrderEntryCardComponent;
  let fixture: ComponentFixture<ExistingOrderEntryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingOrderEntryCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingOrderEntryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
