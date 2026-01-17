import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GiftDetailPage } from './gift-detail.page';

describe('GiftDetailPage', () => {
  let component: GiftDetailPage;
  let fixture: ComponentFixture<GiftDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GiftDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
