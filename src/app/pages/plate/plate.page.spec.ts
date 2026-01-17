import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlatePage } from './plate.page';

describe('PlatePage', () => {
  let component: PlatePage;
  let fixture: ComponentFixture<PlatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
