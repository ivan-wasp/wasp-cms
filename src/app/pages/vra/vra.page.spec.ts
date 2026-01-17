import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VraPage } from './vra.page';

describe('VraPage', () => {
  let component: VraPage;
  let fixture: ComponentFixture<VraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
