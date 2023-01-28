import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutOneComponent } from './layout-one.component';

describe('LayoutOneComponent', () => {
  let component: LayoutOneComponent;
  let fixture: ComponentFixture<LayoutOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
