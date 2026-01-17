import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BannerSettingPage } from './banner-setting.page';

describe('BannerSettingPage', () => {
  let component: BannerSettingPage;
  let fixture: ComponentFixture<BannerSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerSettingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BannerSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
