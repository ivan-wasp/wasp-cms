import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RbbDetailPage } from './rbb-detail.page';

describe('RbbDetailPage', () => {
  let component: RbbDetailPage;
  let fixture: ComponentFixture<RbbDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RbbDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RbbDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
