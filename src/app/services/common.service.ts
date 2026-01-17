import { Injectable, Component, HostListener, NgZone, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavController, MenuController, AlertController, ModalController } from '@ionic/angular';
import { ApiPath, ApiService, Response } from './api.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DataService } from './data.service';
import { GallerySlidesComponent } from '../components/gallery-slides/gallery-slides.component';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public isLoading = false;

  public dark_mode = false;

  public isWeb = Capacitor.getPlatform() == 'web' ? true : false;


  private get dataService() {
    return this.injector.get(DataService);
  }

  constructor(
    private _snackBar: MatSnackBar,
    private nav: NavController,
    public menuCtrl: MenuController,
    private alertController: AlertController,
    private apiService: ApiService,
    public dialog: MatDialog,
    private router: Router,
    private injector: Injector,
    private modalCtrl: ModalController
  ) {
  }

  async openModal(img_url_list: string[]) {
    const modal = await this.modalCtrl.create({
      component: GallerySlidesComponent,
      componentProps: {'img_url_list' : img_url_list},
      cssClass: 'img-preview-modal'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    // if (role === 'confirm') {
    //   this.message = `Hello, ${data}!`;
    // }
  }

  remove_duplicate_from_array(arr) {
    return arr.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
  }

  openSnackBar(message: string, button_text?: string, durantion?: number, horizontalPosition?, verticalPosition?) {
    this._snackBar.open(message, (button_text != undefined ? button_text : 'OK'), {
      duration: (durantion != undefined ? durantion : 2500),
      horizontalPosition: (horizontalPosition != undefined ? horizontalPosition : "end"),
      verticalPosition: (verticalPosition != undefined ? verticalPosition : "top"),
    });
  }

  openErrorSnackBar(message?: string, button_text?: string, durantion?: number, horizontalPosition?, verticalPosition?) {
    this._snackBar.open((message != undefined ? message : '出現錯誤'), (button_text != undefined ? button_text : 'OK'), {
      duration: (durantion != undefined ? durantion : 2500),
      horizontalPosition: (horizontalPosition != undefined ? horizontalPosition : "end"),
      verticalPosition: (verticalPosition != undefined ? verticalPosition : "top"),
      panelClass: "error_snackbar"
    });
  }


  firstFileToBase64(fileImage: File): Promise<{}> {
    return new Promise((resolve, reject) => {
      let fileReader: FileReader = new FileReader();
      if (fileReader && fileImage != null) {
        fileReader.readAsDataURL(fileImage);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      } else {
        reject(new Error('No file found'));
      }
    });
  }

  downloadMedia(url, blank) {
    window.open(environment.media_url + url, '_blank');
  }

  openPage(url, blank, server_media) {
    console.log(url);
    if (server_media) {
      window.open(environment.media_url + url, (blank ? '_blank' : '_self'));
    }
    else {
      window.open(url, (blank ? '_blank' : '_self'));
    }

  }

  openCMSPage(url, type: 'blank' | 'self' | 'forward' | 'root') {
    // console.log(window.location.origin);

    switch (type) {
      case 'blank':
        window.open(((window.location.origin.includes('localhost') ? window.location.origin : (environment.cms_url)) + url), '_blank');
        break;
      case 'self':
        window.open(((window.location.origin.includes('localhost') ? window.location.origin : (environment.cms_url)) + url), '_self');
        break;
      case 'forward':
        this.nav.navigateForward(url);
        break;
      case 'root':
        this.nav.navigateRoot(url);
        break;

      default:
        break;
    }
    // window.open((window.location.origin.includes('localhost') ? window.location.origin : window.location.origin + '/cms') + url, (blank ? '_blank' : '_self'));
  }

  getCMSPage(url) {
    console.log(window.location.origin);
    return ((window.location.origin.includes('localhost') ? window.location.origin : window.location.origin + '/cms') + url);
  }

  sort_new_to_old(array, key) {
    return array.sort(function (a, b) {
      var x = b[key]; var y = a[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  sort_old_to_new(array, key) {
    return array.sort(function (a, b) {
      var x = b[key]; var y = a[key];
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
  }

  viewImage(element) {
    if (document.getElementById(element) != undefined && document.getElementById(element) != null) {
      document.getElementById(element).click();
    }
  }

  refresh() {
    window.location.reload();
  }

  // async deleteDataAlert(data) {
  //   const alert = await this.alertController.create({
  //     cssClass: 'my-custom-class',
  //     mode: "md",
  //     header: '確認刪除資料？(建議使用禁用功能)',
  //     message: '如確認刪除資料，所有跟此資料相關的其他資料，需自行刪除或修改。(例如刪除訂單時，請自行檢查是否需要刪除按金)',
  //     buttons: [
  //       {
  //         text: '是',
  //         handler: () => {
  //           this.deleteData(data);
  //         }
  //       },
  //       {
  //         text: '否',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: (blah) => {
  //           console.log('Confirm Cancel: blah');
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }

  async deleteDataAlert(data) {
    let option = null;
    if (environment.production == false){
      option = {
        cssClass: 'my-custom-class',
        mode: "md",
        header: '不可直接刪除資料',
        message: '',
        buttons: [
          {
            text: '是',
            handler: () => {
              this.deleteData(data);
            }
          },
          {
            text: 'OK',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }
        ]
      }
    }
    else{
      option = {
        cssClass: 'my-custom-class',
        mode: "md",
        header: '不可直接刪除資料',
        message: '',
        buttons: [
          // {
          //   text: '是',
          //   handler: () => {
          //     this.deleteData(data);
          //   }
          // },
          {
            text: 'OK',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }
        ]
      };
    }

    const alert = await this.alertController.create(option);

    await alert.present();
  }

  // async deleteDataAlert(data) {
  //   if (this.isLoading) {
  //     return;
  //   }
  //   const dialogRef = this.dialog.open(ConfirmDialog);

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result != undefined && result) {
  //       console.log(result);
  //       if (result == true) {
  //         // this.deleteData(data);
  //       }
  //     }
  //   });
  //   const alert = await this.alertController.create({
  //     header: '確定要刪除資料?',
  //     mode: 'md',
  //     message: '',
  //     cssClass: 'alertCss',
  //     buttons: [
  //       {
  //         text: '取消',
  //         role: 'cancel',
  //         handler: () => {
  //         }
  //       },
  //       {
  //         text: '是',
  //         handler: () => {
  //           this.deleteData(data);
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }


  deleteData(data) {
    let send_data = {
      id: data.id,
      data_type: data.data_type
    }
    this.isLoading = true;
    this.apiService.postFromServer(ApiPath.delete_data_by_data_type_and_id, send_data).then((res: Response) => {
      console.log(res);
      this.isLoading = false;
      if (res.result == "success") {
        if(this.router.url.includes('maintenance-detail')){
          location.reload();
        }
        else{
          window.history.back();
        }
      }
      else {
        this.openSnackBar("刪除資料失敗！");
      }
    });
  }

  GetDateTimeMatchBackendFormat(date: Date): string {
    return (new Date(date.getTime() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, -1).split(".")[0];
  }

  GetNthDaysAfter(date, days) {
    let d = new Date(new Date(date).setDate(new Date(date).getDate() + days));
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}T${date.slice(11, 19)}`;
  }

  GetNthDaysBefore(date, days) {
    let d = new Date(new Date(date).setDate(new Date(date).getDate() - days));
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}T${date.slice(11, 19)}`;
  }

  getDatesInRange(startDate, endDate) {
    var timeOffsetInMS:number = startDate.getTimezoneOffset() * 60000;
    const date = new Date(startDate.getTime() - timeOffsetInMS);
    const dates = [];
    while (date <= endDate) {
      dates.push(new Date(date).toISOString());
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }


  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@“]+(\.[^<>()\[\]\\.,;:\s@“]+)*)|(“.+“))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validateHongKongPhone(phone) {
    const re = /^-?(0|[1-9]\d*)?$/;
    return re.test(String(phone));
  }

  validateYearStringFormat(date) {
    //YYYY-YYYY
    const re = /^\d{4}-\d{4}$/;
    return re.test(String(date));
  }


  validateDateStringFormat(date) {
    //YYYY-MM-DD
    const re = /^\d{4}-\d{2}-\d{2}$/;
    return re.test(String(date));
  }

  validateHourMinuteStringFormat(date) {
    //HH:mm
    const re = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return re.test(String(date));
  }

  validateHourMinuteWorkingHourStringFormat(date) {
    //HH:mm
    const re = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]-(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return re.test(String(date));
  }

  validatePasswordFormat(date) {
    //Minimum eight characters, at least one letter and one number:
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(String(date));
  }

  validateYYYYmmddFormat(date) {
    const re = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
    return re.test(String(date));
  }

  toggleDarkTheme() {
    document.body.classList.toggle('dark-theme', !this.dark_mode);
    this.dark_mode = !this.dark_mode;
    localStorage.setItem("dark_mode", this.dark_mode.toString());
  }

  getFileType(file_type) {
    switch (file_type) {
      case "image/jpeg":
        return "jpg";
      case "image/png":
        return "png";
      case "image/svg+xml":
        return "svg";
      case "image/gif":
        return "gif";
      case "application/pdf":
        return "pdf";
      case "application/msword":
        return "doc";

      default:
        return "";
    }
  }

  checkTypeString(data) {
    return typeof data === 'string';
  }

  ToBackendDateTimeString(date: Date) {
    return (new Date(date.getTime() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, -1).split(".")[0];
  }

  media_url(){
    return (environment.media_url);
  }

  searchUser(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();
    if (this.dataService.user_data_list$.value != null){
      event.component.items = this.dataService.user_data_list$.value.filter(user => {
        return user.id.toString().toLowerCase().indexOf(text) !== -1 ||
          user.phone.toLowerCase().indexOf(text) !== -1 ||
          user.email.toLowerCase().indexOf(text) !== -1 ||
          user.username.toLowerCase().indexOf(text) !== -1 ||
          user.zh_full_name.toLowerCase().indexOf(text) !== -1 ||
          user.en_full_name.toLowerCase().indexOf(text) !== -1;
      });
    }
    event.component.endSearch();
  }

  searchCar(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    let car_data_list = this.dataService.car_data_list$.value ? this.dataService.car_data_list$.value : this.dataService.rentable_car_data_list$.value;
    if (car_data_list != null){
      event.component.items = car_data_list.filter(car => {
        return car.id.toString().toLowerCase().indexOf(text) !== -1 ||
          car.model.toLowerCase().indexOf(text) !== -1 ||
          car.plate.toLowerCase().replace(' ', '').indexOf(text) !== -1;
      });
    }
    event.component.endSearch();
  }

  searchStaff(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();
    if (this.dataService.all_admin_data_list$.value != null){
      event.component.items = this.dataService.all_admin_data_list$.value.filter(car => {
        return car.id.toString().toLowerCase().indexOf(text) !== -1 ||
          car.username.toLowerCase().indexOf(text) !== -1;
      });
    }
    event.component.endSearch();

  }

  generateAllDateBetweenTwoDate(start_date, end_date): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let booking_date_list = [];
      let day = 1000 * 60 * 60 * 24;
      let diff = (new Date(end_date).getTime() - new Date(start_date).getTime()) / day;
      // console.log(diff);
      for (let i = 0; i < diff; i++) {
        let xx = new Date(start_date).getTime() + day * i;
        let yy = new Date(xx);
        let date = yy.getFullYear() + "-" + ('0' + (yy.getMonth() + 1)).slice(-2) + "-" + ('0' + (yy.getDate())).slice(-2);
        booking_date_list.push(date);
      }
      resolve(booking_date_list);
    });
  }

  updateDataChecker(send_data, update_data, checking_data){
    Object.keys(update_data).forEach(element => {
      if (Array.isArray(update_data[element]) || typeof update_data[element] === 'object'){
        if (JSON.stringify(update_data[element]) != JSON.stringify(checking_data[element])){
          send_data[element] = update_data[element];
        }  
      }else if (update_data[element] != checking_data[element]){
        send_data[element] = update_data[element];
      }
    });
    return send_data;
  }

}


@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html',
})
export class ConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>
  ) {
  }

  close() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }

}