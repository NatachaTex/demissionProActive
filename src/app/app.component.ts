import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  config: any;
  fullpageApi: any;
  public isEnded = false;

  constructor() {
    this.config = {
      anchors: ['landing', 'info', 'places'],
      menu: '#menu',
      navigation: true,
      slidesNavigation: true,
      touchSensitivity: 10,
      afterResize: () => {
        console.log('After resize');
      },
      afterLoad: (origin, destination, direction) => {
        if (origin && destination.anchor === 'landing') {
          switch (destination.anchor) {
            case 'landing':
              const videoElem: any = document.getElementById('trailer');
              const videoBgElem: any = document.getElementById('trailer-bg');
              if (videoElem.paused && videoElem.played.length !== 0 && !this.isEnded) {
                videoElem.play();
              }
              videoBgElem.play();
              break;
          }
        }
      }
    };
  }

  getRef(fullPageRef) {
    this.fullpageApi = fullPageRef;
  }

  transformLandingPage() {
    this.isEnded = true;
  }
}
