import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CharityFormPage } from './charity-form.page';

describe('CharityFormPage', () => {
  let component: CharityFormPage;
  let fixture: ComponentFixture<CharityFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharityFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CharityFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
