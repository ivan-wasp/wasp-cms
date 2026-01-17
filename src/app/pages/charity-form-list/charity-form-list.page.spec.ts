import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CharityFormListPage } from './charity-form-list.page';

describe('CharityFormListPage', () => {
  let component: CharityFormListPage;
  let fixture: ComponentFixture<CharityFormListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharityFormListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CharityFormListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
