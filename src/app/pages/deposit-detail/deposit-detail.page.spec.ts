import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DepositDetailPage } from './deposit-detail.page';

describe('DepositDetailPage', () => {
  let component: DepositDetailPage;
  let fixture: ComponentFixture<DepositDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DepositDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
