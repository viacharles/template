import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _loading = new BehaviorSubject<boolean>(true);
  public readonly loading$ = this._loading.asObservable();

  private _miniLoading = new BehaviorSubject<boolean>(false);
  public readonly miniLoading$ = this._miniLoading.asObservable();

  constructor() {}

  show() {
    this._loading.next(true);
  }

  hide() {
    this._loading.next(false);
  }

  showMini() {
    this._miniLoading.next(true);
  }

  hideMini() {
    this._miniLoading.next(false);
  }
}
