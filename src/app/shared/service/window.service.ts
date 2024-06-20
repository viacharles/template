import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  constructor() {}

  /** router-outlet scroll to Top */
  public scrollToTopSubject = new Subject<void>();
  public scrollToTop$ = this.scrollToTopSubject.asObservable();

  /** router-outlet scroll detect */
  public mainScrollSubject = new Subject<UIEvent>(); // UIEvent
  public mainScroll$ = this.mainScrollSubject.asObservable();

  /** 視窗 click 偵測 */
  public clickSubject = new Subject<Event>();
  public click$ = this.clickSubject.asObservable();

  /** 視窗 寬度偵測 */
  public windowWidthSubject = new BehaviorSubject<number>(window.innerWidth);
  public windowWidth$ = this.windowWidthSubject.asObservable();

  /** 視窗 尺寸變化 偵測 */
  public windowResizeSubject = new Subject<UIEvent>();
  public windowResize$ = this.windowResizeSubject.asObservable();

  /** 視窗 手持裝置 直橫偵測 */
  public deviceDirectionSubject = new Subject<ScreenOrientation>();
  public deviceDirection$ = this.deviceDirectionSubject.asObservable();

  /** 建立尺寸偵測 */
  public generateResizeObserver = (
    callback: (entry: ResizeObserverEntry) => void
  ): ResizeObserver => {
    return new ResizeObserver((entries: ResizeObserverEntry[]) =>
      entries.forEach(entry => callback(entry))
    );
  };

  public tabCloseSubject = new Subject<BeforeUnloadEvent>();
  public tabClose$ = this.tabCloseSubject.asObservable();
}
