import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FaqDetailPage } from './faq-detail.page';

describe('FaqDetailPage', () => {
  let component: FaqDetailPage;
  let fixture: ComponentFixture<FaqDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FaqDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
