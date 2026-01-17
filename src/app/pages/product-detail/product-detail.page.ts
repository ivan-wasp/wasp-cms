import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { ItemReorderEventDetail } from '@ionic/core';
import { Location } from '@angular/common';
import { CarData, ProductData } from 'src/app/schema';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  product_id = null;

  product_data = null;
  checking_product_data = null;

  upload_type = null;

  readonly = true;

  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();
  all_product_data_list: ProductData[];

  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  constructor(
    public auth: AuthService,
    public commonService: CommonService,
    public apiService: ApiService,
    public dataService: DataService,
    private route: ActivatedRoute,
    public nav: NavController,
    private location: Location
  ) {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      if (params) {
        if (params && params.product_id) {
          this.product_id = parseInt(params.product_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.product_id != null) {
      this.getProductData();
    }
    else {
      this.readonly = false;
      this.setNewProductDataTemplate();
    }
    if (this.dataService.car_data_list$.value == null){
     this.dataService.getAllCarData();
    }
    this.getAllProductData();

  }

  setNewProductDataTemplate() {
    this.product_data = {
      "id": null,
      "data_type": "product_data",
      "create_date": "",
      "disabled": false,
      "zh_name": "",
      "en_name": "",
      "category": "",
      "price": null,
      "inventory": null,
      "company": "",
      "applicable_car_id_list": [],
      "img_url_list": [],
      "incompatible_product_id_list": [],
      "minimum_booking_days": null,
      "maximum_booking_days": null,
      "quota": null
    };
  }

  getProductData() {
    let send_data = {
      id: this.product_id,
      data_type: "product_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.product_data = JSON.parse(JSON.stringify(res.data));
        this.checking_product_data = JSON.parse(JSON.stringify(res.data));

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getAllProductData() {
    let send_data = {
      data_type: "product_data"
    }
    this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.all_product_data_list = res.data;
        if (this.product_id != null){
          this.all_product_data_list = this.all_product_data_list.filter(d => d.id != this.product_id);
        }

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }


  triggerImgUpload(type) {
    if (this.upload_img == null) {
      return;
    }
    this.upload_type = type;
    this.upload_img.nativeElement.click();
  }
  uploadImg() {
    if (this.upload_img == null || this.commonService.isLoading) {
      return;
    }
    const fileList: FileList = this.upload_img.nativeElement.files;
    if (fileList && fileList.length > 0) {
      this.commonService.firstFileToBase64(fileList[0]).then(async (base64: string) => {
        // console.log(base64);

        let send_data = {
          file_name: '',
          file_type: this.commonService.getFileType(fileList[0].type),
          base64: base64
        }
        this.commonService.isLoading = true;
        const upload_base64_to_server = await this.apiService.postFromServer(ApiPath.upload_base64_file_to_server, send_data, true);
        this.commonService.isLoading = false;
        if (upload_base64_to_server.result == "success") {
          switch (this.upload_type) {
            case 'img_url_list':
              this.product_data.img_url_list.push(upload_base64_to_server.data);
              break;

            default:
              break;
          }
        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }

  save() {
    let send_data = {
      id: this.product_data.id
    }

    if (this.product_data.zh_name == null || this.product_data.zh_name == '') {
      return this.commonService.openErrorSnackBar("必須填寫中文名稱");
    }
    if (!Number.isInteger(this.product_data.inventory) || this.product_data.inventory < 0 || this.product_data.inventory === null || this.product_data.inventory === '') {
      return this.commonService.openErrorSnackBar("必須填寫貨存");
    }
    if (!Number.isInteger(this.product_data.price) || this.product_data.price < 0 || this.product_data.price === null || this.product_data.price === '') {
      return this.commonService.openErrorSnackBar("必須填寫售價");
    }

    send_data = this.commonService.updateDataChecker(send_data, this.product_data, this.checking_product_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_product, send_data, true).then((res: Response) => {

      if (res.result == "success") {
        this.readonly = true;
        this.product_data = JSON.parse(JSON.stringify(res.data));
        this.checking_product_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已更新資料");
      } else {
        switch (true) {

          default:
            this.commonService.openErrorSnackBar("未能更新資料");
            break;
        }
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  createNewProduct() {

    if (this.product_data.zh_name == null || this.product_data.zh_name == '') {
      return this.commonService.openErrorSnackBar("必須填寫中文名稱");
    }
    if (!Number.isInteger(this.product_data.inventory) || this.product_data.inventory < 0 || this.product_data.inventory === null || this.product_data.inventory === '') {
      return this.commonService.openErrorSnackBar("必須填寫貨存");
    }
    if (!Number.isInteger(this.product_data.price) || this.product_data.price < 0 || this.product_data.price === null || this.product_data.price === '') {
      return this.commonService.openErrorSnackBar("必須填寫售價");
    }

    this.apiService.postFromServer(ApiPath.new_product, this.product_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.product_id = res.data.id;
        this.product_data = JSON.parse(JSON.stringify(res.data));
        this.checking_product_data = JSON.parse(JSON.stringify(res.data));
        this.commonService.openSnackBar("已建立資料");
        setTimeout(() => {
          this.readonly = true;
          this.location.replaceState('/product-detail?product_id=' + res.data.id);
        }, 1000);
      } else {
        switch (true) {

          default:
            this.commonService.openErrorSnackBar("未能建立資料");
            break;
        }

      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });

  }

  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }



  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.product_data.img_url_list = ev.detail.complete(this.product_data.img_url_list);
    ev.detail.complete();
  }

}
