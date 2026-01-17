import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SevenCouponPage } from './seven-coupon.page';

describe('SevenCouponPage', () => {
  let component: SevenCouponPage;
  let fixture: ComponentFixture<SevenCouponPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SevenCouponPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SevenCouponPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
