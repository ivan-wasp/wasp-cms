import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RdrPage } from './rdr.page';

describe('RdrPage', () => {
  let component: RdrPage;
  let fixture: ComponentFixture<RdrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RdrPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RdrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
