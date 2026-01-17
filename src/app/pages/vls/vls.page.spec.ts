import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VlsPage } from './vls.page';

describe('VlsPage', () => {
  let component: VlsPage;
  let fixture: ComponentFixture<VlsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VlsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VlsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
