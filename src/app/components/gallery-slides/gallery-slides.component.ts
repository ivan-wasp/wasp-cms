import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-gallery-slides',
  templateUrl: './gallery-slides.component.html',
  styleUrls: ['./gallery-slides.component.scss'],
})
export class GallerySlidesComponent implements OnInit, AfterViewInit {
  @Input('img_url_list') img_url_list: string[] = null;
  @Input() height: string = "";
  @Input() width: string = "";

  @ViewChild('slides',{ static: true }) slides: IonSlides;
  canGoBack = false;
  canGoNext = false;
  currentIndex = 0;
  constructor(
    public commonService: CommonService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  async ngAfterViewInit() {
    await this.updateNavState();
  }

  async onSlideDidChange() {
    await this.updateNavState();
  }

  async next() {
    this.slides.slideNext();
    await this.updateNavState();
  }
  async back() {
    this.slides.slidePrev();
    await this.updateNavState();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  private async updateNavState() {
    const total = this.img_url_list?.length ?? 0;
    if (total <= 1) {
      this.currentIndex = total > 0 ? 0 : -1;
      this.canGoBack = false;
      this.canGoNext = false;
      return;
    }
    const activeIndex = await this.slides.getActiveIndex();
    this.currentIndex = activeIndex;
    this.canGoBack = activeIndex > 0;
    this.canGoNext = activeIndex < total - 1;
  }

}
