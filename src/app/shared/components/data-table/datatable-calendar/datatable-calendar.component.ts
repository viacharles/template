import {DatePipe} from '@angular/common';
import {takeUntil, BehaviorSubject} from 'rxjs';
import {Component, Input, Output, EventEmitter} from '@angular/core';
import * as moment from 'moment';
import {UnSubOnDestroy} from '@utilities/abstract/unSubOnDestroy.abstract';
import {TimeHelper} from '@utilities/helper/time-helper';

@Component({
  selector: 'app-datatable-calendar',
  templateUrl: './datatable-calendar.component.html',
  styleUrls: ['./datatable-calendar.component.scss'],
})
export class DataTableCalendarComponent extends UnSubOnDestroy {
  /** 選取的日期 */
  @Output() select = new EventEmitter<string>();
  /** 取消 */
  @Output() cancel = new EventEmitter<void>();
  /** 是否只限本月 */
  @Input() thisMonthLimit = false;

  constructor(private datePipe: DatePipe) {
    super();
  }

  /** 月內7天分一組的日期數字 */
  public datesInMonth: string[][] = [];
  /** 日曆目前的月份 */
  public current = new Date().toISOString();
  /** 日曆目前的月份訂閱主題 */
  public currentSubject = new BehaviorSubject<string>(this.current);
  /** 日曆目前的月份訂閱 */
  public current$ = this.currentSubject.asObservable();
  /** hover到的日期 */
  public hoverDate = '';
  public selectedDate = '';

  get title(): string { 
    const current = this.current.split('/');
    return `${current[0]}年${current[1]}月`;
  }

  ngOnInit(): void {
    this.current$.pipe(takeUntil(this.onDestroy$)).subscribe(date => {
      this.current = date;
      this.datesInMonth = this.chunkByNumber(
        this.getDatesInMonth(this.current),
        7
      );
    });
    this.switch(0, 0);
  }

  public isThisMonth(date: string): boolean {
    return new Date(date).getMonth() === new Date(this.current).getMonth();
  }

  public hover(date: string) {
    this.hoverDate = date;
  }

  public onSelect(date: string) {
    this.selectedDate = this.datePipe.transform(date, 'yyyy/MM/dd') as string;
  }

  public confirm() {
    this.select.emit(this.selectedDate);
  }

  public delete(): void {
    this.select.emit('');
  }

  /**
   * @description 切換排班日曆時間
   * @param yearDiff 年份切換量
   * @param monthDiff 月份切換量
   */
  public switch(yearDiff: number, monthDiff: number) {
    const Date = moment(this.current, 'YYYY/MM')
      .add(yearDiff, 'years')
      .add(monthDiff, 'months')
      .format('YYYY/MM');
    this.currentSubject.next(Date);
  }

  /** 數個分成一個陣列 */
  private chunkByNumber(array: any[], base: number): any[] {
    const Result = [];
    for (let i = 0; i < array.length; i = i + base) {
      Result.push(array.slice(i, i + base));
    }
    return Result;
  }

  /** 得到月內的所有日期 ex. 2023-02-27T00:00:00.000Z */
  private getDatesInMonth(date: string): string[] {
    const Dates = [];
    const Start = TimeHelper.formatBoundaryDate(
      TimeHelper.formatBoundaryDate(date, 0, 'month', true),
      0,
      'week',
      true
    );
    const End = TimeHelper.formatBoundaryDate(
      TimeHelper.formatBoundaryDate(date, 0, 'month', false),
      0,
      'week',
      false
    );
    while (Dates.length < TimeHelper.getOffset(Start, End, 'day')) {
      Dates.push(
        this.datePipe.transform(
          TimeHelper.formatSpecDate(Start, Dates.length + 1, 'day'),
          'yyyy/MM/dd'
        ) as string
      );
    }
    return Dates;
  }
}
