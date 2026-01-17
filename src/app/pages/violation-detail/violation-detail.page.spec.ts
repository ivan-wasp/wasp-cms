import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViolationDetailPage } from './violation-detail.page';

describe('ViolationDetailPage', () => {
  let component: ViolationDetailPage;
  let fixture: ComponentFixture<ViolationDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViolationDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViolationDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
