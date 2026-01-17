import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VrfPage } from './vrf.page';

describe('VrfPage', () => {
  let component: VrfPage;
  let fixture: ComponentFixture<VrfPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VrfPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VrfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
