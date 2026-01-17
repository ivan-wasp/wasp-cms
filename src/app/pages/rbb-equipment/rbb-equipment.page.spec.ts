import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RbbEquipmentPage } from './rbb-equipment.page';

describe('RbbEquipmentPage', () => {
  let component: RbbEquipmentPage;
  let fixture: ComponentFixture<RbbEquipmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RbbEquipmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RbbEquipmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
