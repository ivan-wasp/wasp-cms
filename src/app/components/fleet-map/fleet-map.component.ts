import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminData, AdminType, ParkingData } from 'src/app/schema';
import { Response } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

const google_map_style = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "lightness": "0"
      },
      {
        "gamma": "0.00"
      },
      {
        "weight": "4"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ffffff"
      },
      {
        "lightness": 20
      },
      {
        "gamma": 0.01
      },
      {
        "weight": "1.39"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#000000"
      },
      {
        "visibility": "on"
      },
      {
        "weight": "4.65"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#222222"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "saturation": 20
      },
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#4b3c00"
      },
      {
        "lightness": "0"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ac8900"
      },
      {
        "lightness": "-20"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "saturation": 25
      },
      {
        "lightness": 25
      },
      {
        "weight": "0.01"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "weight": 0.5
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "visibility": "simplified"
      },
      {
        "weight": 1
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      {
        "saturation": "0"
      },
      {
        "lightness": "0"
      }
    ]
  }
];

@Component({
  selector: 'app-fleet-map',
  templateUrl: './fleet-map.component.html',
  styleUrls: ['./fleet-map.component.scss'],
})
export class FleetMapComponent implements OnInit {
  admin_data: Observable<AdminData> = this.auth.adminData.pipe();


  center: google.maps.LatLngLiteral = {
    // lat: 22.312481113809177,
    // lng: 114.22044263401351
    lat: 22.33563442872316,
    lng: 114.13727684763826
  };

  zoom = 12;
  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    backgroundColor: '#126df5',
    clickableIcons: false,
    disableDoubleClickZoom: true,
    draggable: true,
    zoomControl: false,
    styles: google_map_style
  };

  markers: any[] = [];

  selected_marker: any[] = null;

  all_rental_point_parking_data_list$: Observable<ParkingData[]> = this.dataService.parking_data_list$.pipe(
    map((p: ParkingData[]) => {
      return p == null ? null : p.filter(d => d.is_car_rental_point == true)
    })
  );

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;
  public get adminType(): typeof AdminType {
    return AdminType;
  }
  constructor(
    private dataService: DataService,
    private auth: AuthService,
    public commonService: CommonService
  ) {
  }

  async ngOnInit() {
    const res: Response = await this.dataService.getAllRentalPointParkingDataWithApplicableCarDataList();
    if (res.result == 'success') {
      this.markers = res.data.map((r: any) => {
        return {
          position: { lat: Number(r.latitude), lng: Number(r.longitude) },
          title: `租車點：${r.zh_name}`,
          // info: `Name: ${r.zh_name}\n`,
          applicable_car_data_list: r.applicable_car_data_list,
          options: {
            animation: google.maps.Animation.BOUNCE,
            icon: {
              url: 'assets/icon/goswap.svg',
              scaledSize: new google.maps.Size(30, 30),
            },
          }
        };
      });
    }
  }

  openInfoWindow(marker: MapMarker, selected_marker: any[]) {
    this.selected_marker = selected_marker;
    this.infoWindow.open(marker);
  }



}
