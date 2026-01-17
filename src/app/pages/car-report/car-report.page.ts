import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CarData } from 'src/app/schema';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-car-report',
  templateUrl: './car-report.page.html',
  styleUrls: ['./car-report.page.scss'],
})
export class CarReportPage implements OnInit {

  car_id: number = null;
  car_data: CarData = null;
  today = new Date();
  car_img = "";

  car_report_stat = null;

  total_income = 0;
  total_expense = 0;

  @ViewChild('content', { static: false }) el!: ElementRef;

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
        if (params && params.car_id) {
          this.car_id = parseInt(params.car_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.car_id != null) {
      this.getCarData();
    }
  }

  getCarData() {
    let send_data = {
      id: this.car_id,
      data_type: "car_data"
    }
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.car_data = res.data;

        this.getYearList();
        this.getCarReportStat();

        this.getBase64ImageFromServer(this.car_data.cover_img_url_list[0]);
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getYearList(){
    if (this.car_data.purchase_date == ''){
      this.commonService.openSnackBar("車輛未有購入日期！");
    }
    let start_year = (this.car_data.launched_date == '' ? (this.car_data.purchase_date == '' ? 2021 : this.car_data.purchase_date) : this.car_data.launched_date).toString().split('-')[0];
    let end_year = new Date().getFullYear().toString();
    console.log(start_year);
    console.log(end_year);
    return getAllNumbersBetween(start_year, end_year);

    function getAllNumbersBetween(x, y) {
      var numbers = [];
      for (var i = x; i <= y; i++) {
        numbers.push(i);
      }
      return numbers;
    }
  }

  getCarReportStat() {
    let send_data = {
      car_id: this.car_id,
      year_list: this.getYearList().filter(d => d >= 2021).map(d => d.toString())
    }
    this.apiService.postFromServer(ApiPath.get_car_report_stat_by_car_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.car_report_stat = res.data;

        this.total_income = this.car_report_stat.map(d => d.income).reduce((a, b) => a+b );
        this.total_expense = this.car_report_stat.map(d => d.maintenance_expenses).reduce((a, b) => a+b )+this.car_report_stat.map(d => d.repair_expenses).reduce((a, b) => a+b );
        console.log(this.total_income);
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  async getBase64ImageFromServer(file_name) {
    let send_data = {
      file_name: file_name
    }
    this.apiService.postFromServer(ApiPath.convert_server_image_to_base64, send_data, true).then((res: Response) => {
      if (res.result == "success") {
        this.car_img = `data:image/jpg;base64,${res.data}`;
      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  makePdf() {
    // let pdf = new jsPDF('p','mm',[297, 210]);
    // pdf.html(this.el.nativeElement, {
    //   callback: (pdf) => {
    //     pdf.save("sample.pdf")
    //   }
    // })
    let DATA: any = document.getElementById('content');
    let options = { scale: 4 }
    this.commonService.isLoading = true;
    html2canvas(DATA, options).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save(`${this.car_data.plate}-${this.car_data.model}-${new Date().getTime()}.pdf`);

      this.commonService.isLoading = false;
    });
  }




}
