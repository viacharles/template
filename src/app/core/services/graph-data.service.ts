import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraphDataService {
  private _dataSource = new BehaviorSubject([0, 0, 0]);
  public readonly data$ = this._dataSource.asObservable();

  constructor() {}

  changeData(data: any) {
    this._dataSource.next(data);
  }
}
