import { Component } from '@angular/core';
import { PlacesApiService } from './services/places.api.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'destinarium-app';

  constructor(
    private router: Router,
    private placesApiService: PlacesApiService
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    });

    this.loadGoogleMaps().then(() => {
    }).catch(err => console.error(err));
  }

  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google && (window as any).google.maps) {
        resolve();
        return;
      }

      this.placesApiService.getGoogleMapsApiUrl().subscribe(({ url }) => {
        const script = document.createElement('script');
        script.src = url;
        script.defer = true;
        script.async = true;
        script.onload = () => {
        };
        document.head.appendChild(script);
      });
    });
  }
}
