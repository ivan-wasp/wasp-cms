import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OutstandingPaymentPage } from './outstanding-payment.page';

describe('OutstandingPaymentPage', () => {
  let component: OutstandingPaymentPage;
  let fixture: ComponentFixture<OutstandingPaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingPaymentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OutstandingPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
