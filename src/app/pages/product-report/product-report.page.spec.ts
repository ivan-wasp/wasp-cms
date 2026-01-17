import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductReportPage } from './product-report.page';

describe('ProductReportPage', () => {
  let component: ProductReportPage;
  let fixture: ComponentFixture<ProductReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
