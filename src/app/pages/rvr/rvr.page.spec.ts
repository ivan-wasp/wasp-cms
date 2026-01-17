import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RvrPage } from './rvr.page';

describe('RvrPage', () => {
  let component: RvrPage;
  let fixture: ComponentFixture<RvrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RvrPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RvrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
