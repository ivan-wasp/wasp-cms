import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminData, AdminType, Authority, CarData, ChargeData, ChargeType, PaymentMethod, UserData } from 'src/app/schema';

export interface ImportHkeTollResultData {
  total_count: number,
  success_count: number,
  duplicate_count: number,
  duplicate_list: [],
  not_matching_count: number,
  not_matching_list: [],
  invalid_plate_count: number,
  invalid_plate_list: []
}
@Component({
  selector: 'app-charge',
  templateUrl: './charge.page.html',
  styleUrls: ['./charge.page.scss'],
})
export class ChargePage implements OnInit {

  sorting = null;
  direction = null;
  limit = null;
  page = null;

  all_user_data_list$: Observable<UserData[]> = this.dataService.user_data_list$.pipe();;
  all_car_data_list$: Observable<CarData[]> = this.dataService.car_data_list$.pipe();
  
  status = null;
  type: ChargeType = null;
  user_id = null;
  car_id = null;

  import_hke_toll_result_data: ImportHkeTollResultData = null;
  isModalOpen: boolean = false;

  unpaid_ranking = null;

  select_multiple_mode: boolean = false;

  selected_charge_id_list$ = new BehaviorSubject<number[]>([]);
  selected_charge_data_list$ = new BehaviorSubject<ChargeData[]>([]);
  selected_charge_amount$: Observable<number> = this.selected_charge_data_list$.pipe(
    map((cdl: ChargeData[]) => {
      return cdl != null && cdl.length > 0 ? cdl.map(d => d.total_amount).reduce((accumulator, currentValue) => accumulator + currentValue) : 0;
    }),
  );
  bank_transfer_img_url: string = "";

  admin_data: Observable<AdminData> = this.auth.adminData.pipe();

  @ViewChild('upload_csv', { static: false }) upload_csv: ElementRef;
  @ViewChild('upload_img', { static: false }) upload_img: ElementRef;
  @ViewChild('ionSelectable') ionSelectable: IonicSelectableComponent;
  public get chargeType(): typeof ChargeType {
    return ChargeType;
  }
  public get authority(): typeof Authority {
    return Authority;
  }
  public get adminType(): typeof AdminType {
    return AdminType;
  }
  public get chargeTypeList() {
    return Object.keys(ChargeType);
  }
  constructor(
    private router: Router,
    public commonService: CommonService,
    public auth: AuthService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public location: Location,
    public dataService: DataService,
    private cdf: ChangeDetectorRef
  ) {
    this.dataService.table_data_list = null;

    this.route.queryParams.subscribe(params => {
      this.page = (params && params.page ? parseInt(params.page) : 1);
      this.limit = (params && params.limit ? (params.limit) : 10);
      this.sorting = (params && params.sorting ? (params.sorting) : "create_date");
      this.direction = (params && params.direction && params.direction != null ? (params.direction) : "DESC");

      this.status = (params && params.status ? (params.status) : "");
      this.type = (params && params.type ? (params.type) : "");
      this.user_id = (params && params.user_id ? (params.user_id) : "");
    });
  }

  ngOnInit() {
    if (this.dataService.table_data_list != null){
      this.sorting = null;
      this.direction = null;
      this.page = 1;
    }
    if (this.dataService.car_data_list$.value == null){
      this.dataService.getAllCarData();
    }
    this.getChargeDataList();
    if (this.dataService.user_data_list$.value == null){
      this.dataService.getAllUserData();
    }
    this.getUnpaidRanking();
  }

  async getUnpaidRanking(){
    const get_unpaid_ranking: Response = await this.dataService.getUnpaidChargeDataRanking();
    if (get_unpaid_ranking.result == 'success'){
      console.log(get_unpaid_ranking.data);
      this.unpaid_ranking = get_unpaid_ranking.data;
    }
  }

  getChargeDataList(export_to_excel?: boolean) {
    this.selected_charge_id_list$.next([]);
    this.selected_charge_data_list$.next([]);

    if (!export_to_excel){
      this.dataService.resetTableData();
    }

    let send_data = {
      sorting: this.sorting,
      direction: this.direction,
      limit: this.limit,
      page: this.page,

      status: this.status,
      type: this.type,
      user_id: this.user_id,
      car_id: this.car_id,
      export_to_excel: export_to_excel ?? false
    }

    this.apiService.postFromServer(ApiPath.get_charge_data_and_total_number_by_sorting_and_limit_or_search, send_data, true).then((res: Response) => {
      if (send_data.export_to_excel){
        if (this.dataService.table_data_list == null || this.dataService.table_data_list.length == 0){
          return this.commonService.openSnackBar("沒有資料");
        }
        else{
          if (res.result == 'success' && res.data != ''){
            return this.commonService.downloadMedia(res.data, true);
          }
          else{
            return this.commonService.openErrorSnackBar();
          }
        }
      }
      
      let new_path = `/charge?page=${this.page}&limit=${this.limit}&sorting=${this.sorting}&direction=${this.direction}&status=${this.status}&type=${this.type}&user_id=${this.user_id||''}&car_id=${this.car_id||''}`;
      if (this.location.path() != new_path) {
        this.location.replaceState(new_path);
      }
      // this.commonService.isLoading = false;
      console.log(res.data);
      if (res.result == 'success') {
        this.dataService.table_data_list = res.data.item_list;
        this.dataService.table_data_total_number = res.data.total_number;
        this.dataService.table_data_number_of_page = Math.ceil(res.data.total_number / this.limit);
      } else {
        this.commonService.openErrorSnackBar();
      }
    });

  }
  
  switchSorting(sorting) {
    if (this.sorting == sorting && this.direction == 'DESC') {
      this.direction = 'ASC';
      this.page = 1;
      this.getChargeDataList();
    }
    else if (this.sorting == sorting && this.direction == 'ASC') {
      this.direction = 'DESC';
      this.page = 1;
      this.getChargeDataList();
    }
    else if (this.sorting != sorting) {
      this.sorting = sorting;
      this.direction = 'DESC';
      this.page = 1;
      this.getChargeDataList();
    }
  }

  selectPage(page) {
    if (this.page == page){
      return;
    }
    this.page = page;
    this.getChargeDataList();
  }

  goPreviousPage() {
    this.page--;
    this.getChargeDataList();
  }

  goNextPage() {
    this.page++;
    this.getChargeDataList();
  }


  clearSearch(ev) {
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getChargeDataList();
  }

  limitChange(ev) {
    // console.log(ev);
    this.limit = ev.value;
    this.page = 1;
    this.getChargeDataList();
  }

  onUserChange(event){
    this.resetAndGetData(null);
  }


  getUserDataById(id) {
    return this.dataService.user_data_list$.value != null ? this.dataService.user_data_list$.value.filter(d => d.id == id)[0] : null;
  }



  getCarDataById(id) {
    return this.dataService.car_data_list$.value != null ? this.dataService.car_data_list$.value.filter(d => d.id == id)[0] : null;
  }




  onCarChange(event){
    this.resetAndGetData(null);
  }

  resetAndGetData(event){
    this.sorting = null;
    this.direction = null;
    this.page = 1;
    this.getChargeDataList();
  }


  onOpen(event: { component: IonicSelectableComponent }) {
    if (this.dataService.user_data_list$.value == null || this.dataService.user_data_list$.value.length == 0){
      this.dataService.getAllUserData();
    }
  }

  showLoading() {
    this.ionSelectable.showLoading();
  }

  hideLoading() {
    this.ionSelectable.hideLoading();
  }



  triggerCsvUpload() {
    if (this.upload_csv == null) {
      return;
    }
    this.upload_csv.nativeElement.click();
  }
  uploadCsv() {
    if (this.upload_csv == null || this.commonService.isLoading) {
      return;
    }
    const fileList: FileList = this.upload_csv.nativeElement.files;
    if (fileList && fileList.length > 0) {
      this.commonService.firstFileToBase64(fileList[0]).then(async (base64: string) => {
        // console.log(fileList);
        // console.log(this.commonService.getFileType(fileList[0].type));
        // console.log(base64);

        this.importHkeTollFile(base64);
      })
    }
    else{
      this.commonService.openSnackBar("上載失敗");
    }
  }


  async importHkeTollFile(base64){
    this.import_hke_toll_result_data = null;
    let send_data = {
      base64: base64
    }
    const import_hke_toll_file = await this.apiService.postFromServer(ApiPath.import_hke_toll_file, send_data, true);
    console.log(import_hke_toll_file);
    if (import_hke_toll_file.result == 'success'){
      this.import_hke_toll_result_data = import_hke_toll_file.data;
      this.setOpen(true);
    }else{
      this.commonService.openSnackBar("上載失敗");
    }
  }

  setOpen(isOpen: boolean) {
    if (isOpen == false){
      location.reload();
    }
    this.isModalOpen = isOpen;
  }

  ionChange(ev, charge_data: ChargeData){
    console.log(ev);
    if (ev.detail.checked){
      this.selected_charge_id_list$.next([...this.selected_charge_id_list$.value.filter(d => d != charge_data.id), ...[charge_data.id]])
      this.selected_charge_data_list$.next([...this.selected_charge_data_list$.value.filter(d => d.id != charge_data.id), ...[charge_data]])
    }
    else{
      this.selected_charge_id_list$.next(this.selected_charge_id_list$.value.filter(d => d != charge_data.id));
      this.selected_charge_data_list$.next(this.selected_charge_data_list$.value.filter(d => d.id != charge_data.id));
    }
    console.log(this.selected_charge_data_list$.value);
  }

  selectAll(){
    this.selected_charge_id_list$.next(this.dataService.table_data_list.map(d => d.id));
    this.selected_charge_data_list$.next(this.dataService.table_data_list);
    this.cdf.detectChanges();
  }



  triggerImgUpload() {
    if (this.upload_img == null) {
      return;
    }
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
          this.bank_transfer_img_url = upload_base64_to_server.data;
        }
        else {
          this.commonService.openErrorSnackBar("無法上載檔案");
        }
      })
    }
  }

  async PayChargeData(){

    if (this.selected_charge_data_list$.value.length <= 0){
      return this.commonService.openErrorSnackBar("請選擇多於一筆紀錄");
    }
    if (this.bank_transfer_img_url == ''){
      return this.commonService.openErrorSnackBar("請上載付款證明相片");
    }
    if (this.selected_charge_data_list$.value.map(d => d.user_id).filter((item, i, ar) => ar.indexOf(item) === i).length > 1){
      return this.commonService.openErrorSnackBar("只可選擇相同租客");
    }
    let cdl: ChargeData[] = this.selected_charge_data_list$.value;
    cdl = cdl.map((cd: ChargeData) => {
      cd.payment_method = PaymentMethod.bank_transfer;
      return cd;
    })
    const pay_charge_data: Response = await this.dataService.payChargeData(cdl, this.bank_transfer_img_url);
    console.log(pay_charge_data);
    if(pay_charge_data.result == 'success'){
      window.location.reload();
    }
  }

}
