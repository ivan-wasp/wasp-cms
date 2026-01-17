import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlockingPage } from './blocking.page';

describe('BlockingPage', () => {
  let component: BlockingPage;
  let fixture: ComponentFixture<BlockingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BlockingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
