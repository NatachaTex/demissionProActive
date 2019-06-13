import {Component, HostListener} from '@angular/core';
import Hammer from 'hammerjs'


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
  gestureHandler: any;
  public isEnded = false;
  public isRunning = false;
  public isScrolling = false;
  public isLandingPage = true;
  public isLastPage = false;

  constructor() {

    this.config = {
      anchors: ['landing', 'info', 'places'],
      menu: '#menu',
      navigation: true,
      slidesNavigation: true,
      touchSensitivity: 5,
      keyboardScrolling: false,
      controlArrows: false,
      loopHorizontal: false,
      afterResize: () => {
        console.log('After resize');
      },
      afterLoad: (origin, destination, direction) => {
        const videoElem: any = document.getElementById('trailer');
        const videoBgElem: any = document.getElementById('trailer-bg');
        if (origin) {
          switch (destination.anchor) {
            case 'landing':
              videoBgElem.play();
              if (videoElem.paused && videoElem.played.length !== 0 && !this.isEnded) {
                videoElem.play();
                this.isRunning = !videoElem.paused;
              }
              break;
            default:
              break;
          }
        }
        this.isScrolling = false;
      },
      onLeave: (origin, destination) => {
        this.isScrolling = true;
        if(origin) {
          if(destination.isFirst) {
            this.isLandingPage = true;
          } else {
            setTimeout(() => {
              this.isLandingPage = false;
              if(destination.isLast) {
                this.isLastPage = true;
              } else {
                this.isLastPage = false;
              }
            }, 800);
          }


        }
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
    this.fullpageApi.setAllowScrolling(true, 'all');
  }

  handleVideoClick() {
    const videoElem: any = document.getElementById('trailer');
    if (videoElem.paused) {
      videoElem.play();
    } else {
      videoElem.pause();
    }
    this.isRunning = !videoElem.paused;
  }

  goToFirst() {
    this.fullpageApi.moveTo('landing');
  }

  handlePan = () => {
    this.gestureHandler = new Hammer(document.getElementById('fullpage'));
    this.gestureHandler.get('pan').set({ threshold: 100 });
    this.gestureHandler.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    this.gestureHandler.on('panleft panright panup pandown', (event) => {
      if (this.isScrolling === false && !event.target.closest('.prevent-swipe')) {
        switch (event.direction) {
          case Hammer.DIRECTION_LEFT:
            this.fullpageApi.moveSlideRight();
            break;
          case Hammer.DIRECTION_RIGHT:
            this.fullpageApi.moveSlideLeft();
            break;
          case Hammer.DIRECTION_UP:
            this.fullpageApi.moveSectionDown();
            break;
          case Hammer.DIRECTION_DOWN:
            this.fullpageApi.moveSectionUp();
            break;
        }
      }
    });
  };

  nextSection() {
    this.fullpageApi.moveSectionDown();
  }

  prevSection() {
    this.fullpageApi.moveSectionUp();
  }

  nextSlide() {
    this.fullpageApi.moveSlideRight();
  }

  prevSlide() {
    this.fullpageApi.moveSlideLeft();
  }

  transformLandingPage() {
    const videoElem: any = document.getElementById('trailer');
    const videoBgElem: any = document.getElementById('trailer-bg');
    videoElem.currentTime = 0;
    videoElem.load();
    videoBgElem.play();
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
        this.isRunning = !videoElem.paused;
        break;
    }
  }
}
