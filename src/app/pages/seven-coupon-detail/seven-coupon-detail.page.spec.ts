import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SevenCouponDetailPage } from './seven-coupon-detail.page';

describe('SevenCouponDetailPage', () => {
  let component: SevenCouponDetailPage;
  let fixture: ComponentFixture<SevenCouponDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SevenCouponDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SevenCouponDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
