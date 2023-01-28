import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankTransferQRCodeComponent } from './bank-transfer-qrcode.component';

describe('BankTransferQRCodeComponent', () => {
  let component: BankTransferQRCodeComponent;
  let fixture: ComponentFixture<BankTransferQRCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankTransferQRCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankTransferQRCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
