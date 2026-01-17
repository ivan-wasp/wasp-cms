import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CouponDetailPage } from './coupon-detail.page';

describe('CouponDetailPage', () => {
  let component: CouponDetailPage;
  let fixture: ComponentFixture<CouponDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CouponDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
