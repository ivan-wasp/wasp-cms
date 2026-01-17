import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-gallery-slides',
  templateUrl: './gallery-slides.component.html',
  styleUrls: ['./gallery-slides.component.scss'],
})
export class GallerySlidesComponent implements OnInit {
  @Input('img_url_list') img_url_list: string[] = null;
  @Input() height: string = "";
  @Input() width: string = "";

  @ViewChild('slides',{ static: true }) slides: IonSlides;
  constructor(
    public commonService: CommonService
  ) { }

  ngOnInit() {}

  next(){
    this.slides.slideNext();
  }
  back(){
    this.slides.slidePrev();
  }

}
