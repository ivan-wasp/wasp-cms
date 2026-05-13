import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Response } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-car-obd-map-modal',
  templateUrl: './car-obd-map-modal.component.html',
  styleUrls: ['./car-obd-map-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarObdMapModalComponent implements OnInit, OnDestroy {
  @Input() obdDeviceId: string = '';
  @Output() close = new EventEmitter<void>();

  center: google.maps.LatLngLiteral = { lat: 22.3193, lng: 114.1694 };
  zoom: number = 16;
  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    clickableIcons: false,
    gestureHandling: 'greedy',
    fullscreenControl: false
  };

  currentPosition: google.maps.LatLngLiteral = null;
  routePath: google.maps.LatLngLiteral[] = [];
  routeOptions: google.maps.PolylineOptions = {
    strokeColor: '#126df5',
    strokeOpacity: 0.95,
    strokeWeight: 5,
    geodesic: true
  };
  markerOptions: google.maps.MarkerOptions = {
    icon: {
      url: 'assets/icon/goswap.svg',
      scaledSize: new google.maps.Size(48, 48)
    }
  };

  private pollingTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.refreshLocation();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  closeModal() {
    this.close.emit();
  }

  openExactLocation() {
    if (!this.currentPosition) {
      return;
    }
    window.open(`https://www.google.com/maps?q=${this.currentPosition.lat},${this.currentPosition.lng}`, '_blank');
  }

  private startPolling() {
    this.stopPolling();
    this.pollingTimer = setInterval(() => {
      this.refreshLocation();
    }, 5000);
  }

  private stopPolling() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
  }

  private async refreshLocation() {
    if (this.obdDeviceId == null || this.obdDeviceId === '') {
      return;
    }

    const res: Response = await this.dataService.getObdGpsDataByDeviceId(this.obdDeviceId);
    if (res.result !== 'success' || res.data == null) {
      return;
    }

    const lat = Number(res.data.lat);
    const lon = Number(res.data.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return;
    }

    // console.log('Latest OBD GPS data:', { lat, lon });
    // console.log('Latest OBD data:', res.data);

    const latestPoint: google.maps.LatLngLiteral = { lat: lat, lng: lon };
    this.center = latestPoint;
    this.currentPosition = latestPoint;

    const lastPoint = this.routePath.length > 0 ? this.routePath[this.routePath.length - 1] : null;
    if (!lastPoint || lastPoint.lat !== latestPoint.lat || lastPoint.lng !== latestPoint.lng) {
      this.routePath = [...this.routePath, latestPoint];
    }

    this.cdr.markForCheck();
  }
}
