import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';

import { IonMenu, MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { CommonService } from './services/common.service';
import { Location } from '@angular/common';
import { AuthService } from './services/auth.service';
import { environment } from 'src/environments/environment';
import { AdminType } from './schema';
import { TranslateService } from '@ngx-translate/core';

export interface Page {
  title: string;
  url: string;
  icon: string;
  icon_selected: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages: Page[] = [
    {
      title: '主頁',
      url: 'home',
      icon: 'assets/icon/menu_home.svg',
      icon_selected: 'assets/icon/menu_home_selected.svg'
    },
    {
      title: '現有租客',
      url: 'order',
      icon: 'assets/icon/menu_user.svg',
      icon_selected: 'assets/icon/menu_user_selected.svg'
    },
    {
      title: '用戶',
      url: 'user',
      icon: 'assets/icon/menu_user.svg',
      icon_selected: 'assets/icon/menu_user_selected.svg'
    },
    {
      title: '管理員通知',
      url: 'admin-notification',
      icon: 'assets/icon/menu_notification.svg',
      icon_selected: 'assets/icon/menu_notification_selected.svg'
    },
    {
      title: '租務訂單',
      url: 'order',
      icon: 'assets/icon/menu_order.svg',
      icon_selected: 'assets/icon/menu_order_selected.svg'
    },
    {
      title: '車輛檢查',
      url: 'inspection',
      icon: 'assets/icon/menu_maintenance.svg',
      icon_selected: 'assets/icon/menu_maintenance_selected.svg'
    },
    {
      title: '預約睇車',
      url: 'car-viewing',
      icon: 'assets/icon/menu_order.svg',
      icon_selected: 'assets/icon/menu_order_selected.svg'
    },
    {
      title: '全新車預租',
      url: 'prerent-order',
      icon: 'assets/icon/menu_order.svg',
      icon_selected: 'assets/icon/menu_order_selected.svg'
    },
    {
      title: '車輛',
      url: 'car',
      icon: 'assets/icon/menu_car.svg',
      icon_selected: 'assets/icon/menu_car_selected.svg'
    },
    {
      title: '禁止預約',
      url: 'blocking',
      icon: 'assets/icon/menu_blocking.svg',
      icon_selected: 'assets/icon/menu_blocking_selected.svg'
    },

    {
      title: '停車場',
      url: 'parking',
      icon: 'assets/icon/menu_parking.svg',
      icon_selected: 'assets/icon/menu_parking_selected.svg'
    },
    {
      title: '按金',
      url: 'deposit',
      icon: 'assets/icon/menu_deposit.svg',
      icon_selected: 'assets/icon/menu_deposit_selected.svg'
    },
    {
      title: '賠償',
      url: 'compensation-payment',
      icon: 'assets/icon/menu_compensation.svg',
      icon_selected: 'assets/icon/menu_compensation_selected.svg'
    },
    {
      title: '交通違例',
      url: 'violation',
      icon: 'assets/icon/menu_violation.svg',
      icon_selected: 'assets/icon/menu_violation_selected.svg'
    },
    {
      title: '易通行、公里費、其他罰款',
      url: 'charge',
      icon: 'assets/icon/menu_deposit.svg',
      icon_selected: 'assets/icon/menu_deposit_selected.svg'
    },
    {
      title: 'Supercharge',
      url: 'supercharge',
      icon: 'assets/icon/menu_deposit.svg',
      icon_selected: 'assets/icon/menu_deposit_selected.svg'
    },
    {
      title: '緊急支援',
      url: 'emergency',
      icon: 'assets/icon/menu_emergency.svg',
      icon_selected: 'assets/icon/menu_emergency_selected.svg'
    },
    {
      title: '先租後買',
      url: 'rbb',
      icon: 'assets/icon/menu_rbb.svg',
      icon_selected: 'assets/icon/menu_rbb_selected.svg'
    },
    {
      title: '先租後買(設備)',
      url: 'rbb-equipment',
      icon: 'assets/icon/menu_rbb.svg',
      icon_selected: 'assets/icon/menu_rbb_selected.svg'
    },
    {
      title: '車牌',
      url: 'plate',
      icon: 'assets/icon/menu_plate.svg',
      icon_selected: 'assets/icon/menu_plate_selected.svg'
    },
    {
      title: '設備(租借)',
      url: 'equipment',
      icon: 'assets/icon/menu_product.svg',
      icon_selected: 'assets/icon/menu_product_selected.svg'
    },
    {
      title: '加購品',
      url: 'product',
      icon: 'assets/icon/menu_product.svg',
      icon_selected: 'assets/icon/menu_product_selected.svg'
    },
    {
      title: '設備(租借)報表',
      url: 'equipment-report',
      icon: 'assets/icon/menu_product.svg',
      icon_selected: 'assets/icon/menu_product_selected.svg'
    },
    {
      title: '加購品報表',
      url: 'product-report',
      icon: 'assets/icon/menu_product.svg',
      icon_selected: 'assets/icon/menu_product_selected.svg'
    },
    {
      title: '預約維修',
      url: 'appointment',
      icon: 'assets/icon/menu_appointment.svg',
      icon_selected: 'assets/icon/menu_appointment_selected.svg'
    },
    {
      title: '維修項目',
      url: 'maintenance',
      icon: 'assets/icon/menu_maintenance.svg',
      icon_selected: 'assets/icon/menu_maintenance_selected.svg'
    },
    {
      title: '車房',
      url: 'factory',
      icon: 'assets/icon/menu_garage.svg',
      icon_selected: 'assets/icon/menu_garage_selected.svg'
    },
    {
      title: '通知',
      url: 'notification',
      icon: 'assets/icon/menu_notification.svg',
      icon_selected: 'assets/icon/menu_notification_selected.svg'
    },
    {
      title: '優惠券',
      url: 'coupon',
      icon: 'assets/icon/menu_coupon.svg',
      icon_selected: 'assets/icon/menu_coupon_selected.svg'
    },
    // {
    //   title: '禮品',
    //   url: 'gift',
    //   icon: 'assets/icon/menu_gift.svg',
    //   icon_selected: 'assets/icon/menu_gift_selected.svg'
    // },
    {
      title: '現金券',
      url: 'seven-coupon',
      icon: 'assets/icon/menu_coupon.svg',
      icon_selected: 'assets/icon/menu_coupon_selected.svg'
    },
    {
      title: '活動',
      url: 'campaign',
      icon: 'assets/icon/menu_campaign.svg',
      icon_selected: 'assets/icon/menu_campaign_selected.svg'
    },
    {
      title: '管理員',
      url: 'admin',
      icon: 'assets/icon/menu_user.svg',
      icon_selected: 'assets/icon/menu_user_selected.svg'
    },
    {
      title: '主頁Banner',
      url: 'banner-setting',
      icon: 'assets/icon/menu_home.svg',
      icon_selected: 'assets/icon/menu_home_selected.svg'
    },
    {
      title: 'Blog',
      url: 'custom-page',
      icon: 'assets/icon/menu_home.svg',
      icon_selected: 'assets/icon/menu_home_selected.svg'
    },
    {
      title: '常見問題',
      url: 'faq',
      icon: 'assets/icon/menu_faq.svg',
      icon_selected: 'assets/icon/menu_faq_selected.svg'
    },
    {
      title: 'Log',
      url: 'log',
      icon: 'assets/icon/menu_log.svg',
      icon_selected: 'assets/icon/menu_log_selected.svg'
    },
    {
      title: '系統設定',
      url: 'setting',
      icon: 'assets/icon/menu_setting.svg',
      icon_selected: 'assets/icon/menu_setting_selected.svg'
    },
    {
      title: '企業合作',
      url: 'form-list',
      icon: 'assets/icon/menu_home.svg',
      icon_selected: 'assets/icon/menu_home_selected.svg'
    }
  ];

  public maintainer_appPages: Page[] = [
    {
      title: '主頁',
      url: 'maintenance-dashboard',
      icon: 'assets/icon/menu_home.svg',
      icon_selected: 'assets/icon/menu_home_selected.svg'
    },
    {
      title: '預約',
      url: 'appointment',
      icon: 'assets/icon/menu_appointment.svg',
      icon_selected: 'assets/icon/menu_appointment_selected.svg'
    },
    {
      title: '賠償',
      url: 'compensation-payment',
      icon: 'assets/icon/menu_compensation.svg',
      icon_selected: 'assets/icon/menu_compensation_selected.svg'
    },
    {
      title: '車輛',
      url: 'car',
      icon: 'assets/icon/menu_car.svg',
      icon_selected: 'assets/icon/menu_car_selected.svg'
    },
    {
      title: '緊急支援',
      url: 'emergency',
      icon: 'assets/icon/menu_emergency.svg',
      icon_selected: 'assets/icon/menu_emergency_selected.svg'
    },

  ]

  public buyer_appPages: Page[] = [
    {
      title: '車輛',
      url: 'car',
      icon: 'assets/icon/menu_car.svg',
      icon_selected: 'assets/icon/menu_car_selected.svg'
    },

  ]

  public sales_appPages: Page[] = [
    {
      title: '主頁',
      url: 'home',
      icon: 'assets/icon/menu_home.svg',
      icon_selected: 'assets/icon/menu_home_selected.svg'
    },
    {
      title: '現有租客',
      url: 'order',
      icon: 'assets/icon/menu_user.svg',
      icon_selected: 'assets/icon/menu_user_selected.svg'
    },
    {
      title: '用戶',
      url: 'user',
      icon: 'assets/icon/menu_user.svg',
      icon_selected: 'assets/icon/menu_user_selected.svg'
    },
    {
      title: '管理員通知',
      url: 'admin-notification',
      icon: 'assets/icon/menu_notification.svg',
      icon_selected: 'assets/icon/menu_notification_selected.svg'
    },
    {
      title: '租務訂單',
      url: 'order',
      icon: 'assets/icon/menu_order.svg',
      icon_selected: 'assets/icon/menu_order_selected.svg'
    },
    {
      title: '車輛',
      url: 'car',
      icon: 'assets/icon/menu_car.svg',
      icon_selected: 'assets/icon/menu_car_selected.svg'
    },
    {
      title: '禁止預約',
      url: 'blocking',
      icon: 'assets/icon/menu_blocking.svg',
      icon_selected: 'assets/icon/menu_blocking_selected.svg'
    },
    {
      title: '按金',
      url: 'deposit',
      icon: 'assets/icon/menu_deposit.svg',
      icon_selected: 'assets/icon/menu_deposit_selected.svg'
    },
    {
      title: '賠償',
      url: 'compensation-payment',
      icon: 'assets/icon/menu_compensation.svg',
      icon_selected: 'assets/icon/menu_compensation_selected.svg'
    },
    {
      title: '交通違例',
      url: 'violation',
      icon: 'assets/icon/menu_violation.svg',
      icon_selected: 'assets/icon/menu_violation_selected.svg'
    },
    {
      title: '緊急支援',
      url: 'emergency',
      icon: 'assets/icon/menu_emergency.svg',
      icon_selected: 'assets/icon/menu_emergency_selected.svg'
    },
    {
      title: '預約維修',
      url: 'appointment',
      icon: 'assets/icon/menu_appointment.svg',
      icon_selected: 'assets/icon/menu_appointment_selected.svg'
    },
    {
      title: '',
      url: '',
      icon: '',
      icon_selected: ''
    },
    {
      title: '通知',
      url: 'notification',
      icon: 'assets/icon/menu_notification.svg',
      icon_selected: 'assets/icon/menu_notification_selected.svg'
    },
    {
      title: '',
      url: '',
      icon: '',
      icon_selected: ''
    },
    {
      title: '現金券',
      url: 'seven-coupon',
      icon: 'assets/icon/menu_coupon.svg',
      icon_selected: 'assets/icon/menu_coupon_selected.svg'
    },
    {
      title: '',
      url: '',
      icon: '',
      icon_selected: ''
    },
  ];


  public owner_appPages: Page[] = [
    {
      title: '車輛',
      url: 'car',
      icon: 'assets/icon/menu_car.svg',
      icon_selected: 'assets/icon/menu_car_selected.svg'
    },
    {
      title: '租務訂單',
      url: 'order',
      icon: 'assets/icon/menu_order.svg',
      icon_selected: 'assets/icon/menu_order_selected.svg'
    },

  ]

  public pickup_dropoff_appPages: Page[] = [
    {
      title: '主頁',
      url: 'home',
      icon: 'assets/icon/menu_home.svg',
      icon_selected: 'assets/icon/menu_home_selected.svg'
    },
    // {
    //   title: '租務訂單',
    //   url: 'order',
    //   icon: 'assets/icon/menu_order.svg',
    //   icon_selected: 'assets/icon/menu_order_selected.svg'
    // },

  ]

  current_url = "";

  dev = environment.production ? false : true;

  public get adminType(): typeof AdminType {
    return AdminType;
  }
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private location: Location,
    public menuCtrl: MenuController,
    public commonService: CommonService,
    public authService: AuthService,
    private translateService: TranslateService
  ) {
    // // Use matchMedia to check the user preference
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    // console.log(prefersDark.matches);
    // this.toggleDarkTheme(prefersDark.matches);
    // // Listen for changes to the prefers-color-scheme media query
    // prefersDark.addListener((mediaQuery) => this.toggleDarkTheme(mediaQuery.matches));
    // // Add or remove the "dark" class based on if the media query matches

    let dark_mode = localStorage.getItem("dark_mode");
    if (dark_mode != undefined || dark_mode != null) {
      this.commonService.dark_mode = (dark_mode == 'false' ? false : true);
      document.body.classList.toggle('dark-theme', (dark_mode == 'false' ? false : true));
      // this.commonService.toggleDarkTheme();
    }

    this.initializeApp();


    this.router.events.subscribe(val => {
      if (location.path() != "") {
        this.current_url = this.router.url;
        this.selectedIndex = this.appPages.findIndex(d => d.url == location.path());
      }
    });
  }

  pageClick(p: Page, index: number) {
    switch (p.title) {
      case '現有租客':
        this.commonService?.openCMSPage('order?page=1&limit=10&sorting=null&direction=null&key_word=&status=rendering&create_date_start=&create_date_end=&booking_date_start=&booking_date_end=&user_id=&car_id=', 'root');
        break;

      default:
        this.selectedIndex = index;
        break;
    }
  }

  toggleDarkTheme(shouldAdd) {
    document.body.classList.toggle('dark-theme', shouldAdd);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.translateService.setDefaultLang('zh');
      this.translateService.use('zh');
    });
  }

  ngOnInit() {

    // setTimeout(() => {
    //   console.log(123);
    //   this.toggleDarkTheme(false);
    // }, 5000);
  }

  refresh() {
    location.reload();
  }

}
