import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CvaPage } from './cva.page';

describe('CvaPage', () => {
  let component: CvaPage;
  let fixture: ComponentFixture<CvaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CvaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
