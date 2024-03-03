import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ESort } from '@utilities/enum/common.enum';
import { ISortResult } from '@utilities/interface/common.interface';

@Component({
  selector: 'app-sort-th',
  templateUrl: './sort-th.component.html',
  styleUrls: ['./sort-th.component.scss']
})
export class SortThComponent<T> {
get sortType() { return ESort };
@Output() sort = new EventEmitter<ISortResult<T>>();
@Input() data?: T[];
@Input() target?: string;
  constructor() { }

  /**
   * @description 欄位排序
   * @param name 排序依照的欄位名稱
   */
  public toSort(name: string, sortType: ESort): void {
    if (this.data && (this.data[0] as any)[`${name}`]) {
      this.data
      .sort((a: any, b: any) => a[`${name}`] < b[`${name}`] ? sortType === ESort.Asc ? -1 : 1 :
        a[`${name}`] === b[`${name}`] ? 0 :  sortType === ESort.Asc ? 1 : -1
      );
    }
    this.sort.emit({data: this.data || [], type: sortType});
  }
}
