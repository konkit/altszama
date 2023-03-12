import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrderEntryCardComponent } from './new-order-entry-card.component';

describe('NewOrderEntryCardComponent', () => {
  let component: NewOrderEntryCardComponent;
  let fixture: ComponentFixture<NewOrderEntryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewOrderEntryCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOrderEntryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
