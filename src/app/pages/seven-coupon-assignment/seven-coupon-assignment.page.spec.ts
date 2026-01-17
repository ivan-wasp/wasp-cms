import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SevenCouponAssignmentPage } from './seven-coupon-assignment.page';

describe('SevenCouponAssignmentPage', () => {
  let component: SevenCouponAssignmentPage;
  let fixture: ComponentFixture<SevenCouponAssignmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SevenCouponAssignmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SevenCouponAssignmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
