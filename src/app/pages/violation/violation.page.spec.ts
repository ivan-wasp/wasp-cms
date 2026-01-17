import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViolationPage } from './violation.page';

describe('ViolationPage', () => {
  let component: ViolationPage;
  let fixture: ComponentFixture<ViolationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViolationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViolationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
