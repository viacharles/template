import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export abstract class UnSubOnDestroy implements OnDestroy {
  private onDestroySubject = new Subject<void>();
  public onDestroy$ = this.onDestroySubject.asObservable();

  ngOnDestroy(): void {
    this.basePageOnDestroy();
    this.onDestroySubject.next();
    this.onDestroySubject.complete();
  }
  /** base 頁面專用 onDestroy */
  protected basePageOnDestroy(): void {}
  /** 最外層繼承使用 */
  protected onDestroy(): void {}
}
