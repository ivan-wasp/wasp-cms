import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CarOverviewPage } from './car-overview.page';

describe('CarOverviewPage', () => {
  let component: CarOverviewPage;
  let fixture: ComponentFixture<CarOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarOverviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CarOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
