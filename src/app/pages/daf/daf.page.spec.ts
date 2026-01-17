import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DafPage } from './daf.page';

describe('DafPage', () => {
  let component: DafPage;
  let fixture: ComponentFixture<DafPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DafPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DafPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
