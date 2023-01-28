import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestLoginViewComponent } from './test-login-view.component';

describe('TestLoginViewComponent', () => {
  let component: TestLoginViewComponent;
  let fixture: ComponentFixture<TestLoginViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestLoginViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestLoginViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
