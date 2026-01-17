import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';


@Component({
  selector: 'app-custom-page',
  templateUrl: './custom-page.page.html',
  styleUrls: ['./custom-page.page.scss'],
})
export class CustomPagePage implements OnInit {


  all_custom_page_data_list = null;

  constructor(
    private router: Router,
    public commonService: CommonService,
    public auth: AuthService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private location: Location,
    public dataService: DataService
  ) {
  }


  ngOnInit() {
    this.getCustomPageDataList();
  }

  getCustomPageDataList() {
    this.dataService.resetTableData();

    let send_data = {
      data_type:"custom_page_data"
    }

    this.apiService.postFromServer(ApiPath.get_all_data_by_data_type, send_data, true).then((res: Response) => {
      console.log("all_custom_page_data_list: ", res.data);
      if (res.result == 'success') {
        this.all_custom_page_data_list = res.data;
      } else {
        this.commonService.openErrorSnackBar();
      }
    });

  }


}
