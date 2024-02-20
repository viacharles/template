import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-datatable-pagination',
  templateUrl: './datatable-pagination.component.html',
  styleUrls: ['./datatable-pagination.component.scss']
})
export class DataTablePaginationComponent implements OnChanges {
  @Output() pageChange = new EventEmitter<number>();
  @Input() pages: any[] = [];
  @Input() currentPage = 0;

  ngOnChanges({pages}: SimpleChanges): void {
    if (pages.currentValue) {
      this.pages = pages.currentValue.map((page: any, index: number) => {
        return index > 14 && index !== (pages.currentValue.length - 1) && index !== 0 ? null : index;
      });
    };
  }

  /** 換頁 
   * @param isNext true:下一頁;false:上一頁
  */
  public change(isNext: boolean) {
    this.currentPage = this.currentPage + (isNext ? 1 : -1);
    this.pageChange.emit(this.currentPage); 
  }
}
