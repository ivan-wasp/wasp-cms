import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ApiPath, ApiService, Response } from 'src/app/services/api.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormControl, Validators } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AdminData, AdminType, Authority, DepositStatus } from 'src/app/schema';
import { Observable } from 'rxjs';

class Bank {
  public bank_code: string;
  public bank_name: string;
}

@Component({
  selector: 'app-deposit-detail',
  templateUrl: './deposit-detail.page.html',
  styleUrls: ['./deposit-detail.page.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: 'LL',
        },
        display: {
          dateInput: 'YYYY-MM-DD',
          monthYearLabel: 'YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'YYYY',
        },
      }
    },
  ]
})
export class DepositDetailPage implements OnInit {

  deposit_id = null;

  deposit_data = null;
  checking_deposit_data = null;
  user_data = null;
  upload_type = null;
  readonly = true;
  other_doc_file_name = "";

  admin_data: Observable<AdminData> = this.auth.adminData.pipe();

  public get authority(): typeof Authority {
    return Authority;
  }
  public get adminType(): typeof AdminType {
    return AdminType;
  }

  bank_list: Bank[] = [
    {
      "bank_code": "552",
      "bank_name": "AAREAL BANK AG, WIESBADEN, GERMANY"
    },
    {
      "bank_code": "400",
      "bank_name": "AGRICULTURAL BANK OF CHINA, BEIJING"
    },
    {
      "bank_code": "222",
      "bank_name": "AGRICULTURAL BANK OF CHINA LIMITED"
    },
    {
      "bank_code": "340",
      "bank_name": "AGRICULTURAL BANK OF CHINA LIMITED, SINGAPORE BRANCH"
    },
    {
      "bank_code": "395",
      "bank_name": "AIRSTAR BANK LIMITED"
    },
    {
      "bank_code": "402",
      "bank_name": "ALLIED BANKING CORPORATION (HK) LTD."
    },
    {
      "bank_code": "393",
      "bank_name": "ANT BANK (HONG KONG) LIMITED"
    },
    {
      "bank_code": "152",
      "bank_name": "AUSTRALIA AND NEW ZEALAND BANKING GROUP LTD"
    },
    {
      "bank_code": "404",
      "bank_name": "AUTORIDADE MONETARIA DE MACAU, MACAU"
    },
    {
      "bank_code": "147",
      "bank_name": "BANCO BILBAO VIZCAYA ARGENTARIA, S.A."
    },
    {
      "bank_code": "356",
      "bank_name": "BANCO DO BRASIL S. A., TOKYO BRANCH"
    },
    {
      "bank_code": "267",
      "bank_name": "BANCO SANTANDER S.A."
    },
    {
      "bank_code": "049",
      "bank_name": "BANGKOK BANK PUBLIC COMPANY LTD"
    },
    {
      "bank_code": "553",
      "bank_name": "BANK FOR FOREIGN TRADE OF VIETNAM"
    },
    {
      "bank_code": "320",
      "bank_name": "BANK JULIUS BAER & CO. LTD."
    },
    {
      "bank_code": "278",
      "bank_name": "BANK J. SAFRA SARASIN LTD"
    },
    {
      "bank_code": "055",
      "bank_name": "BANK OF AMERICA, NATIONAL ASSOCIATION"
    },
    {
      "bank_code": "529",
      "bank_name": "BANK OF CHANGSHA CO LTD, CHANGSHA, HUNAN"
    },
    {
      "bank_code": "315",
      "bank_name": "BANK OF CHINA (AUSTRALIA) LIMITED"
    },
    {
      "bank_code": "326",
      "bank_name": "BANK OF CHINA (BRASIL) S.A."
    },
    {
      "bank_code": "310",
      "bank_name": "BANK OF CHINA (CANADA)"
    },
    {
      "bank_code": "290",
      "bank_name": "BANK OF CHINA (CENTRAL AND EASTERN EUROPE) LIMITED"
    },
    {
      "bank_code": "369",
      "bank_name": "BANK OF CHINA (DUBAI) BRANCH"
    },
    {
      "bank_code": "300",
      "bank_name": "BANK OF CHINA (EUROPE) S.A."
    },
    {
      "bank_code": "012",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED"
    },
    {
      "bank_code": "014",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED"
    },
    {
      "bank_code": "019",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED"
    },
    {
      "bank_code": "026",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED"
    },
    {
      "bank_code": "030",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED"
    },
    {
      "bank_code": "031",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED"
    },
    {
      "bank_code": "033",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED"
    },
    {
      "bank_code": "036",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED"
    },
    {
      "bank_code": "064",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED"
    },
    {
      "bank_code": "070",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED"
    },
    {
      "bank_code": "871",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED - GEBSC"
    },
    {
      "bank_code": "348",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED HO CHI MINH CITY BRANCH"
    },
    {
      "bank_code": "279",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED, MANILA BRANCH"
    },
    {
      "bank_code": "838",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED - RMB CLEARING BANK"
    },
    {
      "bank_code": "833",
      "bank_name": "BANK OF CHINA (HK) LTD. RMB FIDUCIARY ACCOUNT"
    },
    {
      "bank_code": "872",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED - SZFESC"
    },
    {
      "bank_code": "A28",
      "bank_name": "BANK OF CHINA (HONG KONG) LIMITED YANGON BRANCH"
    },
    {
      "bank_code": "A30",
      "bank_name": "BANK OF CHINA (PERU) S.A."
    },
    {
      "bank_code": "321",
      "bank_name": "BANK OF CHINA INTERNATIONAL LIMITED"
    },
    {
      "bank_code": "A24",
      "bank_name": "BANK OF CHINA LIMITED, AUCKLAND BRANCH"
    },
    {
      "bank_code": "A23",
      "bank_name": "BANK OF CHINA LIMITED COLOMBO BRANCH"
    },
    {
      "bank_code": "287",
      "bank_name": "BANK OF CHINA LIMITED FRANKFURT BRANCH"
    },
    {
      "bank_code": "A31",
      "bank_name": "BANK OF CHINA LIMITED, GENEVA BRANCH"
    },
    {
      "bank_code": "302",
      "bank_name": "BANK OF CHINA LIMITED GRAND CAYMAN BRANCH"
    },
    {
      "bank_code": "414",
      "bank_name": "BANK OF CHINA LIMITED, HEAD OFFICE"
    },
    {
      "bank_code": "338",
      "bank_name": "BANK OF CHINA LIMITED, HONG KONG BRANCH"
    },
    {
      "bank_code": "A15",
      "bank_name": "BANK OF CHINA LIMITED HUNGARIAN BRANCH"
    },
    {
      "bank_code": "A26",
      "bank_name": "BANK OF CHNA LIMITED INDIA BRANCH"
    },
    {
      "bank_code": "284",
      "bank_name": "BANK OF CHINA LIMITED JAKARTA BRANCH"
    },
    {
      "bank_code": "298",
      "bank_name": "BANK OF CHINA LIMITED JOHANNESBURG BRANCH"
    },
    {
      "bank_code": "A20",
      "bank_name": "BANK OF CHINA LIMITED,  KARACHI BRANCH"
    },
    {
      "bank_code": "A19",
      "bank_name": "BANK OF CHINA LIMITED,  LUANDA BRANCH"
    },
    {
      "bank_code": "301",
      "bank_name": "BANK OF CHINA LIMITED LUXEMBOURG BRANCH"
    },
    {
      "bank_code": "420",
      "bank_name": "BANK OF CHINA LIMITED MACAU BRANCH"
    },
    {
      "bank_code": "291",
      "bank_name": "BANK OF CHINA LIMITED MILAN BRANCH"
    },
    {
      "bank_code": "304",
      "bank_name": "BANK OF CHINA LIMITED NEW YORK BRANCH"
    },
    {
      "bank_code": "311",
      "bank_name": "BANK OF CHINA LIMITED, PANAMA BRANCH"
    },
    {
      "bank_code": "303",
      "bank_name": "BANK OF CHINA LIMITED PARIS BRANCH"
    },
    {
      "bank_code": "327",
      "bank_name": "BANK OF CHINA LIMITED PHNOM PENH BRANCH"
    },
    {
      "bank_code": "A22",
      "bank_name": "BANK OF CHINA LIMITED QATAR FINANCIAL CENTRE BRANCH"
    },
    {
      "bank_code": "285",
      "bank_name": "BANK OF CHINA LIMITED SEOUL BRANCH"
    },
    {
      "bank_code": "286",
      "bank_name": "BANK OF CHINA LIMITED SINGAPORE BRANCH"
    },
    {
      "bank_code": "A29",
      "bank_name": "BANK OF CHINA LIMITED SUCURSAL BUENOS AIRES"
    },
    {
      "bank_code": "288",
      "bank_name": "BANK OF CHINA LIMITED SYDNEY BRANCH"
    },
    {
      "bank_code": "A00",
      "bank_name": "BANK OF CHINA LIMITED TAIPEI BRANCH"
    },
    {
      "bank_code": "280",
      "bank_name": "BANK OF CHINA LIMITED TOKYO BRANCH"
    },
    {
      "bank_code": "A16",
      "bank_name": "BANK OF CHINA LIMITED VIENTIANE BRANCH"
    },
    {
      "bank_code": "292",
      "bank_name": "BANK OF CHINA LONDON BRANCH"
    },
    {
      "bank_code": "A12",
      "bank_name": "BANK OF CHINA LTD. - ABU DHABI"
    },
    {
      "bank_code": "282",
      "bank_name": "BANK OF CHINA (MALAYSIA) BERHAD"
    },
    {
      "bank_code": "A18",
      "bank_name": "BANK OF CHINA (MAURITIUS) LIMITED"
    },
    {
      "bank_code": "A14",
      "bank_name": "BANK OF CHINA (NEW ZEALAND) LIMITED"
    },
    {
      "bank_code": "289",
      "bank_name": "BANK OF CHINA (THAI) PUBLIC COMPANY LIMITED "
    },
    {
      "bank_code": "A17",
      "bank_name": "BANK OF CHINA, TORONTO BRANCH"
    },
    {
      "bank_code": "A21",
      "bank_name": "BANK OF CHINA TURKEY A.S."
    },
    {
      "bank_code": "314",
      "bank_name": "BANK OF CHINA (UK) LIMITED"
    },
    {
      "bank_code": "306",
      "bank_name": "BANK OF CHINA (ZAMBIA) LIMITED"
    },
    {
      "bank_code": "027",
      "bank_name": "BANK OF COMMUNICATIONS CO., LTD."
    },
    {
      "bank_code": "428",
      "bank_name": "BANK OF COMMUNICATIONS CO., LTD. HEAD OFFICE, SHANGHAI"
    },
    {
      "bank_code": "429",
      "bank_name": "BANK OF COMMUNICATIONS CO., LTD. SHENZHEN BRANCH"
    },
    {
      "bank_code": "382",
      "bank_name": "BANK OF COMMUNICATIONS (HONG KONG) LIMITED"
    },
    {
      "bank_code": "349",
      "bank_name": "BANK OF COMMUNICATIONS SEOUL BRANCH"
    },
    {
      "bank_code": "365",
      "bank_name": "BANK OF DONGGUAN CO., LTD."
    },
    {
      "bank_code": "540",
      "bank_name": "BANK OF GUIYANG CO LTD, GUIYANG"
    },
    {
      "bank_code": "058",
      "bank_name": "BANK OF INDIA"
    },
    {
      "bank_code": "086",
      "bank_name": "BANK OF MONTREAL"
    },
    {
      "bank_code": "478",
      "bank_name": "BANK OF NINGBO CO. LTD., ZHEJIANG"
    },
    {
      "bank_code": "372",
      "bank_name": "BANK OF SHANGHAI (HONG KONG) LIMITED"
    },
    {
      "bank_code": "272",
      "bank_name": "BANK OF SINGAPORE LIMITED"
    },
    {
      "bank_code": "201",
      "bank_name": "BANK OF TAIWAN"
    },
    {
      "bank_code": "241",
      "bank_name": "BANK SINOPAC"
    },
    {
      "bank_code": "244",
      "bank_name": "BANK SINOPAC"
    },
    {
      "bank_code": "431",
      "bank_name": "BANK SINOPAC, TAIPEI"
    },
    {
      "bank_code": "A27",
      "bank_name": "BANQUE DE CHINE (DJIBOUTI) S.A."
    },
    {
      "bank_code": "364",
      "bank_name": "BANQUE PICTET & CIE SA"
    },
    {
      "bank_code": "074",
      "bank_name": "BARCLAYS BANK PLC"
    },
    {
      "bank_code": "067",
      "bank_name": "BDO UNIBANK, INC."
    },
    {
      "bank_code": "056",
      "bank_name": "BNP PARIBAS"
    },
    {
      "bank_code": "339",
      "bank_name": "CA INDOSUEZ (SWITZERLAND) SA"
    },
    {
      "bank_code": "351",
      "bank_name": "CAMBODIA MEKONG BANK PUBLIC LIMITED"
    },
    {
      "bank_code": "092",
      "bank_name": "CANADIAN IMPERIAL BANK OF COMMERCE"
    },
    {
      "bank_code": "263",
      "bank_name": "CATHAY BANK "
    },
    {
      "bank_code": "236",
      "bank_name": "CATHAY UNITED BANK COMPANY, LIMITED"
    },
    {
      "bank_code": "206",
      "bank_name": "CHANG HWA COMMERCIAL BANK LTD"
    },
    {
      "bank_code": "361",
      "bank_name": "CHINA BOHAI BANK CO., LTD."
    },
    {
      "bank_code": "437",
      "bank_name": "CHINA CITIC BANK, BEIJING"
    },
    {
      "bank_code": "018",
      "bank_name": "CHINA CITIC BANK INTERNATIONAL LIMITED"
    },
    {
      "bank_code": "051",
      "bank_name": "CHINA CITIC BANK INTERNATIONAL LIMITED"
    },
    {
      "bank_code": "009",
      "bank_name": "CHINA CONSTRUCTION BANK (ASIA) CORPORATION LIMITED"
    },
    {
      "bank_code": "221",
      "bank_name": "CHINA CONSTRUCTION BANK CORPORATION"
    },
    {
      "bank_code": "358",
      "bank_name": "CHINA CONSTRUCTION BANK CORPORATION SEOUL BRANCH"
    },
    {
      "bank_code": "276",
      "bank_name": "CHINA DEVELOPMENT BANK"
    },
    {
      "bank_code": "434",
      "bank_name": "CHINA EVERBRIGHT BANK, BEIJING "
    },
    {
      "bank_code": "368",
      "bank_name": "CHINA EVERBRIGHT BANK CO., LTD"
    },
    {
      "bank_code": "359",
      "bank_name": "CHINA GUANGFA BANK CO., LTD."
    },
    {
      "bank_code": "447",
      "bank_name": "CHINA GUANGFA BANK CO. LTD, BEIJING"
    },
    {
      "bank_code": "238",
      "bank_name": "CHINA MERCHANTS BANK CO., LTD."
    },
    {
      "bank_code": "A09",
      "bank_name": "CHINA MERCHANTS BANK CO., LTD, SINGAPORE BRANCH"
    },
    {
      "bank_code": "435",
      "bank_name": "CHINA MERCHANTS BANK, HEAD OFFICE, SHENZHEN"
    },
    {
      "bank_code": "353",
      "bank_name": "CHINA MINSHENG BANKING CORP., LTD."
    },
    {
      "bank_code": "436",
      "bank_name": "CHINA MINSHENG BANKING CORPORATION LTD., BEIJING"
    },
    {
      "bank_code": "507",
      "bank_name": "CHINA RESOURCES BANK OF ZHUHAI CO LTD., ZHUHAI"
    },
    {
      "bank_code": "383",
      "bank_name": "CHINA ZHESHANG BANK CO., LTD."
    },
    {
      "bank_code": "039",
      "bank_name": "CHIYU BANKING CORPORATION LTD"
    },
    {
      "bank_code": "041",
      "bank_name": "CHONG HING BANK LIMITED"
    },
    {
      "bank_code": "374",
      "bank_name": "CIMB BANK BERHAD"
    },
    {
      "bank_code": "343",
      "bank_name": "CIMB THAI BANK PUBLIC COMPANY LIMITED"
    },
    {
      "bank_code": "531",
      "bank_name": "CITIBANK (CHINA) CO LTD, SHENZHEN BRANCH"
    },
    {
      "bank_code": "250",
      "bank_name": "CITIBANK (HONG KONG) LIMITED"
    },
    {
      "bank_code": "006",
      "bank_name": "CITIBANK N.A."
    },
    {
      "bank_code": "020",
      "bank_name": "CMB WING LUNG BANK LIMITED"
    },
    {
      "bank_code": "153",
      "bank_name": "COMMONWEALTH BANK OF AUSTRALIA"
    },
    {
      "bank_code": "524",
      "bank_name": "CONCORD BANK LTD., NINGBO"
    },
    {
      "bank_code": "868",
      "bank_name": "CONTINUOUS LINKED SETTLEMENT BANK INTERNATIONAL"
    },
    {
      "bank_code": "183",
      "bank_name": "COOPERATIEVE RABOBANK U.A. "
    },
    {
      "bank_code": "319",
      "bank_name": "COOPERATIEVE RABOBANK U.A., SINGAPORE "
    },
    {
      "bank_code": "005",
      "bank_name": "CREDIT AGRICOLE CORPORATE AND INVESTMENT BANK"
    },
    {
      "bank_code": "324",
      "bank_name": "CREDIT INDUSTRIEL ET COMMERCIAL"
    },
    {
      "bank_code": "233",
      "bank_name": "CREDIT SUISSE AG"
    },
    {
      "bank_code": "229",
      "bank_name": "CTBC BANK CO., LTD."
    },
    {
      "bank_code": "040",
      "bank_name": "DAH SING BANK LTD"
    },
    {
      "bank_code": "185",
      "bank_name": "DBS BANK LTD, HONG KONG BRANCH"
    },
    {
      "bank_code": "016",
      "bank_name": "DBS BANK (HONG KONG) LIMITED"
    },
    {
      "bank_code": "032",
      "bank_name": "DBS BANK (HONG KONG) LIMITED"
    },
    {
      "bank_code": "052",
      "bank_name": "DBS BANK (HONG KONG) LIMITED"
    },
    {
      "bank_code": "054",
      "bank_name": "DEUTSCHE BANK AG"
    },
    {
      "bank_code": "439",
      "bank_name": "DONGGUAN RURAL CREDIT COOPERATIVES UNION, DONGGUAN"
    },
    {
      "bank_code": "113",
      "bank_name": "DZ BANK AG DEUTSCHE ZENTRAL-GENOSSENSCHAFTSBANK"
    },
    {
      "bank_code": "258",
      "bank_name": "EAST WEST BANK"
    },
    {
      "bank_code": "243",
      "bank_name": "E.SUN COMMERCIAL BANK, LTD"
    },
    {
      "bank_code": "557",
      "bank_name": "E.SUN COMMERCIAL BANK, LTD., TAIPEI"
    },
    {
      "bank_code": "237",
      "bank_name": "EFG BANK AG"
    },
    {
      "bank_code": "227",
      "bank_name": "ERSTE GROUP BANK AG"
    },
    {
      "bank_code": "440",
      "bank_name": "EXPORT-IMPORT BANK OF THAILAND, BANGKOK"
    },
    {
      "bank_code": "260",
      "bank_name": "FAR EASTERN INTERNATIONAL BANK"
    },
    {
      "bank_code": "277",
      "bank_name": "FIRST ABU DHABI BANK PJSC"
    },
    {
      "bank_code": "203",
      "bank_name": "FIRST COMMERCIAL BANK"
    },
    {
      "bank_code": "128",
      "bank_name": "FUBON BANK (HONG KONG) LIMITED"
    },
    {
      "bank_code": "391",
      "bank_name": "FUSION BANK LIMITED"
    },
    {
      "bank_code": "325",
      "bank_name": "GRANIT BANK ZRT"
    },
    {
      "bank_code": "322",
      "bank_name": "HABIB BANK ZURICH (HONG KONG) LIMITED"
    },
    {
      "bank_code": "024",
      "bank_name": "HANG SENG BANK LTD"
    },
    {
      "bank_code": "308",
      "bank_name": "HDFC BANK LTD."
    },
    {
      "bank_code": "888",
      "bank_name": "HONG KONG MONETARY AUTHORITY"
    },
    {
      "bank_code": "809",
      "bank_name": "HONG KONG MONETARY AUTHORITY CMU"
    },
    {
      "bank_code": "808",
      "bank_name": "HONG KONG MONETARY AUTHORITY - SUB-ACCOUNT"
    },
    {
      "bank_code": "802",
      "bank_name": "HONG KONG SECURITIES CLEARING COMPANY LIMITED"
    },
    {
      "bank_code": "248",
      "bank_name": "HONG LEONG BANK BERHAD"
    },
    {
      "bank_code": "450",
      "bank_name": "HSBC BANGLADESH"
    },
    {
      "bank_code": "457",
      "bank_name": "HSBC BANK MALAYSIA BERHAD"
    },
    {
      "bank_code": "106",
      "bank_name": "HSBC BANK USA, NATIONAL ASSOCIATION"
    },
    {
      "bank_code": "466",
      "bank_name": "HSBC BANK VIETNAM LTD"
    },
    {
      "bank_code": "452",
      "bank_name": "HSBC INDIA"
    },
    {
      "bank_code": "454",
      "bank_name": "HSBC JAPAN"
    },
    {
      "bank_code": "456",
      "bank_name": "HSBC MACAU"
    },
    {
      "bank_code": "460",
      "bank_name": "HSBC SEOUL BRANCH"
    },
    {
      "bank_code": "461",
      "bank_name": "HSBC BANK (CHINA) COMPANY LIMITED"
    },
    {
      "bank_code": "462",
      "bank_name": "HSBC SINGAPORE"
    },
    {
      "bank_code": "463",
      "bank_name": "HSBC SRI LANKA"
    },
    {
      "bank_code": "464",
      "bank_name": "HSBC BANK (TAIWAN) LIMITED"
    },
    {
      "bank_code": "465",
      "bank_name": "HSBC THAILAND"
    },
    {
      "bank_code": "198",
      "bank_name": "HUA NAN COMMERCIAL BANK LTD"
    },
    {
      "bank_code": "550",
      "bank_name": "HUA NAN COMMERCIAL BANK LTD., TAIPEI"
    },
    {
      "bank_code": "386",
      "bank_name": "HUA XIA BANK CO., LIMITED"
    },
    {
      "bank_code": "251",
      "bank_name": "ICICI BANK LIMITED"
    },
    {
      "bank_code": "050",
      "bank_name": "INDIAN OVERSEAS BANK"
    },
    {
      "bank_code": "029",
      "bank_name": "INDUSTRIAL AND COMMERCIAL BANK OF CHINA (ASIA) LTD "
    },
    {
      "bank_code": "072",
      "bank_name": "INDUSTRIAL AND COMMERCIAL BANK OF CHINA (ASIA) LTD "
    },
    {
      "bank_code": "214",
      "bank_name": "INDUSTRIAL AND COMMERCIAL BANK OF CHINA LIMITED"
    },
    {
      "bank_code": "469",
      "bank_name": "INDUSTRIAL AND COMMERCIAL BANK OF CHINA, BEIJING"
    },
    {
      "bank_code": "483",
      "bank_name": "INDUSTRIAL AND COMMERCIAL BANK OF CHINA (MACAU) LIMITED, MACAU"
    },
    {
      "bank_code": "377",
      "bank_name": "INDUSTRIAL BANK CO., LTD."
    },
    {
      "bank_code": "445",
      "bank_name": "INDUSTRIAL BANK COMPANY LTD., FUZHOU"
    },
    {
      "bank_code": "271",
      "bank_name": "INDUSTRIAL BANK OF KOREA"
    },
    {
      "bank_code": "470",
      "bank_name": "INDUSTRIAL BANK OF TAIWAN, TAIPEI"
    },
    {
      "bank_code": "145",
      "bank_name": "ING BANK N.V."
    },
    {
      "bank_code": "161",
      "bank_name": "INTESA SANPAOLO S.P.A."
    },
    {
      "bank_code": "283",
      "bank_name": "JOINT-STOCK COMMERCIAL BANK <BANK OF CHINA (RUSSIA)>"
    },
    {
      "bank_code": "007",
      "bank_name": "JPMORGAN CHASE BANK, N.A."
    },
    {
      "bank_code": "375",
      "bank_name": "J.P. MORGAN SECURITIES (ASIA PACIFIC) LIMITED"
    },
    {
      "bank_code": "305",
      "bank_name": "JSC AB (BANK OF CHINA KAZAKHSTAN)"
    },
    {
      "bank_code": "380",
      "bank_name": "KASIKORNBANK PUBLIC COMPANY LIMITED"
    },
    {
      "bank_code": "178",
      "bank_name": "KBC BANK N.V."
    },
    {
      "bank_code": "318",
      "bank_name": "KDB ASIA LIMITED"
    },
    {
      "bank_code": "046",
      "bank_name": "KEB HANA BANK"
    },
    {
      "bank_code": "A02",
      "bank_name": "KEB HANA BANK, SEOUL"
    },
    {
      "bank_code": "381",
      "bank_name": "KOOKMIN BANK"
    },
    {
      "bank_code": "264",
      "bank_name": "LAND BANK OF TAIWAN CO., LTD."
    },
    {
      "bank_code": "342",
      "bank_name": "LGT BANK AG"
    },
    {
      "bank_code": "388",
      "bank_name": "LIVI BANK LIMITED"
    },
    {
      "bank_code": "063",
      "bank_name": "MALAYAN BANKING BERHAD (MAYBANK)"
    },
    {
      "bank_code": "352",
      "bank_name": "MASHREQBANK PSC"
    },
    {
      "bank_code": "379",
      "bank_name": "MASHREQ BANK - PUBLIC SHAREHOLDING COMPANY"
    },
    {
      "bank_code": "242",
      "bank_name": "MEGA INTERNATIONAL COMMERCIAL BANK CO., LTD."
    },
    {
      "bank_code": "295",
      "bank_name": "METROPOLITAN BANK & TRUST COMPANY"
    },
    {
      "bank_code": "254",
      "bank_name": "MELLI BANK PLC"
    },
    {
      "bank_code": "138",
      "bank_name": "MITSUBISHI UFJ TRUST AND BANKING CORPORATION"
    },
    {
      "bank_code": "109",
      "bank_name": "MIZUHO BANK, LTD."
    },
    {
      "bank_code": "384",
      "bank_name": "MORGAN STANLEY BANK ASIA LIMITED"
    },
    {
      "bank_code": "389",
      "bank_name": "MOX BANK LIMITED"
    },
    {
      "bank_code": "047",
      "bank_name": "MUFG BANK, LTD."
    },
    {
      "bank_code": "043",
      "bank_name": "NANYANG COMMERCIAL BANK LTD"
    },
    {
      "bank_code": "150",
      "bank_name": "NATIONAL AUSTRALIA BANK LTD"
    },
    {
      "bank_code": "331",
      "bank_name": "NATIONAL BANK OF CANADA"
    },
    {
      "bank_code": "060",
      "bank_name": "NATIONAL BANK OF PAKISTAN"
    },
    {
      "bank_code": "210",
      "bank_name": "NATIXIS"
    },
    {
      "bank_code": "376",
      "bank_name": "NONGHYUP BANK"
    },
    {
      "bank_code": "274",
      "bank_name": "O-BANK CO., LTD."
    },
    {
      "bank_code": "035",
      "bank_name": "OCBC BANK (HONG KONG) LIMITED"
    },
    {
      "bank_code": "044",
      "bank_name": "OCBC BANK (HONG KONG) LIMITED"
    },
    {
      "bank_code": "022",
      "bank_name": "OVERSEA-CHINESE BANKING CORPORATION LTD"
    },
    {
      "bank_code": "119",
      "bank_name": "PHILIPPINE NATIONAL BANK"
    },
    {
      "bank_code": "385",
      "bank_name": "PING AN BANK CO., LTD."
    },
    {
      "bank_code": "485",
      "bank_name": "PING AN BANK CO., LTD, SHENZHEN"
    },
    {
      "bank_code": "392",
      "bank_name": "PING AN ONECONNECT BANK (HONG KONG) LIMITED"
    },
    {
      "bank_code": "281",
      "bank_name": "PT BANK CENTRAL ASIA TBK, INDONESIA"
    },
    {
      "bank_code": "453",
      "bank_name": "PT BANK HSBC INDONESIA"
    },
    {
      "bank_code": "480",
      "bank_name": "PT. BANK MANDIRI (PERSERO) TBK, HONG KONG BRANCH"
    },
    {
      "bank_code": "066",
      "bank_name": "PT. BANK NEGARA INDONESIA (PERSERO) TBK."
    },
    {
      "bank_code": "028",
      "bank_name": "PUBLIC BANK (HONG KONG) LIMITED"
    },
    {
      "bank_code": "394",
      "bank_name": "QATAR NATIONAL BANK (Q.P.S.C.)"
    },
    {
      "bank_code": "080",
      "bank_name": "ROYAL BANK OF CANADA"
    },
    {
      "bank_code": "296",
      "bank_name": "SAIGON THUONG TIN COMMERCIAL JOINT STOCK BANK"
    },
    {
      "bank_code": "025",
      "bank_name": "SHANGHAI COMMERCIAL BANK LTD"
    },
    {
      "bank_code": "345",
      "bank_name": "SHANGHAI PUDONG DEVELOPMENT BANK CO., LTD"
    },
    {
      "bank_code": "484",
      "bank_name": "SHANGHAI PUDONG DEVELOPMENT BANK, SHANGHAI"
    },
    {
      "bank_code": "486",
      "bank_name": "SHENZHEN DEVELOPMENT BANK, SHENZHEN"
    },
    {
      "bank_code": "509",
      "bank_name": "SHENZHEN RURAL COMMERCIAL BANK"
    },
    {
      "bank_code": "273",
      "bank_name": "SHINHAN BANK"
    },
    {
      "bank_code": "316",
      "bank_name": "SKANDINAVISKA ENSKILDA BANKEN AB"
    },
    {
      "bank_code": "081",
      "bank_name": "SOCIETE GENERALE"
    },
    {
      "bank_code": "249",
      "bank_name": "STANDARD CHARTERED BANK HONG KONG BRANCH"
    },
    {
      "bank_code": "003",
      "bank_name": "STANDARD CHARTERED BANK (HONG KONG) LIMITED"
    },
    {
      "bank_code": "818",
      "bank_name": "STANDARD CHARTERED BANK (HONG KONG) LIMITED - EURO CLEARING SETTLEMENT INSTITUTION"
    },
    {
      "bank_code": "521",
      "bank_name": "STANDARD CHARTERED BANK, BANGKOK"
    },
    {
      "bank_code": "489",
      "bank_name": "STANDARD CHARTERED BANK, BEIJING BRANCH"
    },
    {
      "bank_code": "515",
      "bank_name": "STANDARD CHARTERED BANK, JAKARTA BRANCH"
    },
    {
      "bank_code": "519",
      "bank_name": "STANDARD CHARTERED BANK, MALAYSIA BERHAD"
    },
    {
      "bank_code": "490",
      "bank_name": "STANDARD CHARTERED BANK, NANJING BRANCH"
    },
    {
      "bank_code": "517",
      "bank_name": "STANDARD CHARTERED BANK, PHILIPPINES BRANCH"
    },
    {
      "bank_code": "518",
      "bank_name": "STANDARD CHARTERED BANK, SEOUL KOREA"
    },
    {
      "bank_code": "491",
      "bank_name": "STANDARD CHARTERED BANK, SHANGHAI BRANCH"
    },
    {
      "bank_code": "492",
      "bank_name": "STANDARD CHARTERED BANK, SHENZHEN BRANCH"
    },
    {
      "bank_code": "516",
      "bank_name": "STANDARD CHARTERED BANK, SINGAPORE BRANCH"
    },
    {
      "bank_code": "522",
      "bank_name": "STANDARD CHARTERED BANK, SRI LANKA"
    },
    {
      "bank_code": "520",
      "bank_name": "STANDARD CHARTERED BANK, TAIWAN"
    },
    {
      "bank_code": "493",
      "bank_name": "STANDARD CHARTERED BANK, TIANJIN BRANCH"
    },
    {
      "bank_code": "494",
      "bank_name": "STANDARD CHARTERED BANK, XIAMEN BRANCH"
    },
    {
      "bank_code": "495",
      "bank_name": "STANDARD CHARTERED BANK, ZHUHAI BRANCH"
    },
    {
      "bank_code": "536",
      "bank_name": "STANDARD CHARTERED BANK PLC, LONDON"
    },
    {
      "bank_code": "082",
      "bank_name": "STATE BANK OF INDIA"
    },
    {
      "bank_code": "220",
      "bank_name": "STATE STREET BANK AND TRUST COMPANY"
    },
    {
      "bank_code": "065",
      "bank_name": "SUMITOMO MITSUI BANKING CORPORATION"
    },
    {
      "bank_code": "371",
      "bank_name": "SUMITOMO MITSUI TRUST BANK, LIMITED"
    },
    {
      "bank_code": "061",
      "bank_name": "TAI SANG BANK LTD"
    },
    {
      "bank_code": "038",
      "bank_name": "TAI YAU BANK LTD"
    },
    {
      "bank_code": "239",
      "bank_name": "TAIPEI FUBON COMMERCIAL BANK CO., LTD."
    },
    {
      "bank_code": "245",
      "bank_name": "TAISHIN INTERNATIONAL BANK CO., LTD"
    },
    {
      "bank_code": "230",
      "bank_name": "TAIWAN BUSINESS BANK, LTD."
    },
    {
      "bank_code": "265",
      "bank_name": "TAIWAN COOPERATIVE BANK, LTD."
    },
    {
      "bank_code": "337",
      "bank_name": "TAIWAN SHIN KONG COMMERCIAL BANK CO., LTD."
    },
    {
      "bank_code": "474",
      "bank_name": "TAIWAN SHIN KONG COMMERCIAL BANK COMPANY LIMITED, TAIPEI"
    },
    {
      "bank_code": "015",
      "bank_name": "THE BANK OF EAST ASIA, LIMITED"
    },
    {
      "bank_code": "139",
      "bank_name": "THE BANK OF NEW YORK MELLON"
    },
    {
      "bank_code": "076",
      "bank_name": "THE BANK OF NOVA SCOTIA"
    },
    {
      "bank_code": "329",
      "bank_name": "THE BANK OF NOVA SCOTIA, SINGAPORE"
    },
    {
      "bank_code": "170",
      "bank_name": "THE CHIBA BANK LTD"
    },
    {
      "bank_code": "202",
      "bank_name": "THE CHUGOKU BANK LTD"
    },
    {
      "bank_code": "188",
      "bank_name": "THE HACHIJUNI BANK, LTD"
    },
    {
      "bank_code": "004",
      "bank_name": "THE HONGKONG AND SHANGHAI BANKING CORPORATION LTD"
    },
    {
      "bank_code": "828",
      "bank_name": "THE HONGKONG AND SHANGHAI BANKING CORPORATION LTD - USD CLEARING SETTLEMENT INSTITUTION"
    },
    {
      "bank_code": "554",
      "bank_name": "THE HOUSING BANK FOR TRADE AND FINANCE, JORDAN"
    },
    {
      "bank_code": "396",
      "bank_name": "THE KOREA DEVELOPMENT BANK"
    },
    {
      "bank_code": "538",
      "bank_name": "THE MACAU CHINESE BANK LTD, MACAU"
    },
    {
      "bank_code": "269",
      "bank_name": "THE SHANGHAI COMMERCIAL & SAVINGS BANK LTD"
    },
    {
      "bank_code": "199",
      "bank_name": "THE SHIGA BANK, LTD."
    },
    {
      "bank_code": "186",
      "bank_name": "THE SHIZUOKA BANK, LTD"
    },
    {
      "bank_code": "487",
      "bank_name": "THE SIAM COMMERCIAL BANK PUBLIC COMPANY LIMITED"
    },
    {
      "bank_code": "085",
      "bank_name": "THE TORONTO-DOMINION BANK"
    },
    {
      "bank_code": "103",
      "bank_name": "UBS AG, HONG KONG"
    },
    {
      "bank_code": "045",
      "bank_name": "UCO BANK"
    },
    {
      "bank_code": "164",
      "bank_name": "UNICREDIT BANK AG"
    },
    {
      "bank_code": "309",
      "bank_name": "UNION BANCAIRE PRIVEE, UBP SA"
    },
    {
      "bank_code": "268",
      "bank_name": "UNION BANK OF INDIA"
    },
    {
      "bank_code": "071",
      "bank_name": "UNITED OVERSEAS BANK LTD"
    },
    {
      "bank_code": "504",
      "bank_name": "UNITED SUBURBAN AND RURAL CREDIT COOPERATIVE WUXI, WUXI"
    },
    {
      "bank_code": "293",
      "bank_name": "VIETNAM JOINT STOCK COMMERCIAL BANK FOR INDUSTRY AND TRADE"
    },
    {
      "bank_code": "390",
      "bank_name": "WELAB BANK LIMITED"
    },
    {
      "bank_code": "180",
      "bank_name": "WELLS FARGO BANK, N.A."
    },
    {
      "bank_code": "118",
      "bank_name": "WOORI BANK "
    },
    {
      "bank_code": "A05",
      "bank_name": "WOORI BANK, KOREA"
    },
    {
      "bank_code": "547",
      "bank_name": "XIAMEN BANK CO., LTD., XIAMEN"
    },
    {
      "bank_code": "378",
      "bank_name": "YUANTA COMMERCIAL BANK CO., LTD."
    },
    {
      "bank_code": "387",
      "bank_name": "ZA BANK LIMITED"
    }
  ];
  bank: Bank = null;

  entity_type: 'PERSONAL' | 'COMPANY' = 'PERSONAL';
  account_name = new FormControl('', [Validators.required]);
  account_number = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(15)]);
  refund_amount: number = null;
  
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
        if (params && params.deposit_id) {
          this.deposit_id = parseInt(params.deposit_id);
        }
      }
    });
  }

  ngOnInit() {
    if (this.deposit_id != null) {
      this.getDepositData();
    }
    else {
      this.readonly = false;
      // this.setNewCouponDataTemplate();
    }
  }

  getDepositData() {
    let send_data = {
      id: this.deposit_id,
      data_type: "deposit_data"
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_single_data_by_data_type_and_id, send_data, true).then((res: Response) => {

      console.log(res.data);
      if (res.result == "success") {
        this.deposit_data = JSON.parse(JSON.stringify(res.data));
        this.checking_deposit_data = JSON.parse(JSON.stringify(res.data));
        this.getUserData();

      } else {
        this.commonService.openErrorSnackBar();
      }
    }, err => {
      this.commonService.openErrorSnackBar();
    });
  }

  getUserData() {
    let send_data = {
      id: this.deposit_data.user_id,
    }
    console.log(send_data);
    this.apiService.postFromServer(ApiPath.get_user_data_by_id, send_data, true).then((res: Response) => {
      console.log(res.data);
      if (res.result == "success") {
        this.user_data = JSON.parse(JSON.stringify(res.data));

        if (this.deposit_data.status == DepositStatus.awaiting_application){
          this.account_name.setValue(this.user_data.en_full_name);
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

            case 'doc_url_list':
              this.deposit_data.doc_url_list.unshift({
                name: this.other_doc_file_name,
                url: upload_base64_to_server.data,
                upload_date: this.commonService.GetDateTimeMatchBackendFormat(new Date())
              });
              this.other_doc_file_name = "";
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
      id: this.deposit_data.id
    }
    if (this.deposit_data.estimated_refund_date != this.checking_deposit_data.estimated_refund_date) {
      if (this.deposit_data.estimated_refund_date != '' && !this.commonService.validateDateStringFormat(this.deposit_data.estimated_refund_date)){
        return this.commonService.openErrorSnackBar("估計退款日期格式不正確");
      }
      send_data['estimated_refund_date'] = this.deposit_data.estimated_refund_date;
    }
    if (this.deposit_data.actual_refund_date != this.checking_deposit_data.actual_refund_date) {
      if (this.deposit_data.actual_refund_date != '' && !this.commonService.validateDateStringFormat(this.deposit_data.actual_refund_date)){
        return this.commonService.openErrorSnackBar("退款日期格式不正確");
      }
      send_data['actual_refund_date'] = this.deposit_data.actual_refund_date;
    }

    send_data = this.commonService.updateDataChecker(send_data, this.deposit_data, this.checking_deposit_data);

    if (Object.keys(send_data).length <= 1) {
      return this.commonService.openErrorSnackBar("沒有資料需要更新");
    }

    this.apiService.postFromServer(ApiPath.update_deposit_handler, send_data, true).then((res: Response) => {
      console.log(res);
      if (res.result == "success") {
        this.readonly = true;
        this.deposit_data = JSON.parse(JSON.stringify(res.data));
        this.checking_deposit_data = JSON.parse(JSON.stringify(res.data));
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


  selectionDateChanged(field, date: HTMLInputElement) {
    if (date.value != null && date.value != '' && date.value != null && date.value != '') {
      this.deposit_data[field] = date.value.substring(0, 10);
    }
  }



  entityChange(ev){
    console.log(ev);
    if (ev.detail.value == 'PERSONAL'){
      this.account_name.setValue(this.user_data.en_full_name);
    }
    else{
      this.account_name.setValue(this.user_data.en_company_name);
    }
  }


  bankChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('bank:', event.value);
  }


  searchBankList(event: { component: IonicSelectableComponent; text: string }) {
    console.log(event.component._searchText);
    // let text = event.text.trim().toLowerCase();
    let text = event.component._searchText.trim().toLowerCase();
    event.component.startSearch();
      console.log(text);
    event.component.items = this.bank_list.filter((bank: Bank) => {
      return bank.bank_code.toString().toLowerCase().indexOf(text) !== -1 ||
        bank.bank_name.toLowerCase().indexOf(text) !== -1
    });
    event.component.endSearch();
  }

  async applyReturnDeposit(){
    let send_data = {
      user_id: this.user_data.id,
      bank_code: this.bank.bank_code,
      bank_name: this.bank.bank_name,
      account_number: this.account_number.value,
      account_name: this.account_name.value,
      entity_type: this.entity_type,
      refund_amount: this.refund_amount
    }
    console.log(send_data);
    const apply_return_deposit: Response = await this.dataService.applyReturnDepositByUserId(send_data);
    if (apply_return_deposit.result == 'success'){
      this.getDepositData();
    }
  }

}
