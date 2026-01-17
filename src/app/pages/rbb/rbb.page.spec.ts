import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RbbPage } from './rbb.page';

describe('RbbPage', () => {
  let component: RbbPage;
  let fixture: ComponentFixture<RbbPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RbbPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RbbPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
