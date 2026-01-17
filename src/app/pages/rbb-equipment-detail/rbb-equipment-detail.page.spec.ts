import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RbbEquipmentDetailPage } from './rbb-equipment-detail.page';

describe('RbbEquipmentDetailPage', () => {
  let component: RbbEquipmentDetailPage;
  let fixture: ComponentFixture<RbbEquipmentDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RbbEquipmentDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RbbEquipmentDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
