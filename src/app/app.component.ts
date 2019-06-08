import {Component, HostListener} from '@angular/core';


export enum KEY_CODE {
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
  UP_ARROW = 'ArrowUp',
  DOWN_ARROW = 'ArrowDown',
  SPACE = 'Space'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  config: any;
  fullpageApi: any;
  public isEnded = false;
  public isScrolling = false;

  constructor() {

    this.config = {
      anchors: ['landing', 'info', 'places'],
      menu: '#menu',
      navigation: true,
      slidesNavigation: true,
      touchSensitivity: '1',
      keyboardScrolling: false,
      allowScrolling: false,
      afterResize: () => {
        console.log('After resize');
      },
      afterLoad: (origin, destination, direction) => {
        const videoElem: any = document.getElementById('trailer');
        const videoBgElem: any = document.getElementById('trailer-bg');
        if (origin && destination.anchor === 'landing') {
          switch (destination.anchor) {
            case 'landing':
              if (videoElem.paused && videoElem.played.length !== 0 && !this.isEnded) {
                videoElem.play();
              }
              videoBgElem.play();
              break;
          }
        }
        this.isScrolling = false;
      },
      onLeave: () => {
        this.isScrolling = true;
      },
      afterSlideLoad: () => {
        this.isScrolling = false;
      },
      onSlideLeave: () => {
        this.isScrolling = true;
      }
    };
  }

  getRef(fullPageRef) {
    this.fullpageApi = fullPageRef;
    this.fullpageApi.setAllowScrolling(false);
  }

  handleVideoClick() {
    const videoElem: any = document.getElementById('trailer');
    if (videoElem.paused) {
      videoElem.play();
    } else {
      videoElem.pause();
    }
  }

  nextSection() {
    this.fullpageApi.moveSectionDown();
  }

  transformLandingPage() {
    const videoElem: any = document.getElementById('trailer');
    videoElem.currentTime = 0;
    this.isEnded = true;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.code) {
      case KEY_CODE.DOWN_ARROW:
          this.fullpageApi.moveSectionDown();
        break;
      case KEY_CODE.UP_ARROW:
          this.fullpageApi.moveSectionUp();
        break;
      case KEY_CODE.LEFT_ARROW:
          this.fullpageApi.moveSlideLeft();
        break;
      case KEY_CODE.RIGHT_ARROW:
          this.fullpageApi.moveSlideRight();
        break;
      case KEY_CODE.SPACE:
        const videoElem: any = document.getElementById('trailer');
        if (videoElem.paused) {
          videoElem.play();
        } else {
          videoElem.pause();
        }
        break;
    }
  }

  @HostListener('mousewheel', ['$event']) // for window scroll events
  onScroll(event) {
    if(event.deltaY >= 70 && this.isScrolling === false) {
      this.fullpageApi.moveSectionDown();
    } else if(event.deltaY <= -70  && this.isScrolling === false) {
      this.fullpageApi.moveSectionUp();
    } else if(event.deltaX >= 70 && this.isScrolling === false) {
      this.fullpageApi.moveSlideRight();
    }  else if(event.deltaX <= -70 && this.isScrolling === false) {
      this.fullpageApi.moveSlideLeft();
    }
  }
}
