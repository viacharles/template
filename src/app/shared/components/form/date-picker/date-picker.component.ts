import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
  OnInit
} from '@angular/core';
import { WindowService } from '@shared/service/window.service';
import {
  CustomForm,
  getFormProvider,
} from '@utilities/abstract/customForm.abstract';
import { fadeEnterAndHideOutSmaller } from '@utilities/helper/animations.helper';
import { IDynamicFieldValue } from '@utilities/interface/api/df-api.interface';
import { IRangeDate } from '@utilities/interface/common.interface';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  animations: [fadeEnterAndHideOutSmaller()],
  providers: [getFormProvider(DatePickerComponent)],
})
export class DatePickerComponent extends CustomForm<IDynamicFieldValue[] | string> implements OnInit {
  @ViewChild('tCalendarContainer') set tCalendarContainer(
    calendar: ElementRef<HTMLElement>
  ) {
    if (calendar) {
      this.setCalendarPosition(calendar.nativeElement);
    };
  }
  /** 是否為範圍日期 */
  @Input() isRange = false;
  /** 值字體大小 */
  @Input() valueFontSize = '';
  /** placeholder */
  @Input() placeholder = 'YYYY/MM/DD';
  /** placeholder 字體大小 */
  @Input() placeholderFontSize = '';
  /** 是否欄位驗證錯誤 */
  @Input() isError = false;
  @Input() position?: 'right' | 'default' | 'left' = 'default';
  @Input() isDisabled?: boolean;
  /** 是否只限本月 */
  @Input() thisMonthLimit = false;
  /** 是 Dynamic 系統模式： IDynamicFieldValue */
  @Input() isDynamic = false;
  @Output() selectDate = new EventEmitter<string>();
  @Output() calendarShow = new EventEmitter<boolean>();

  constructor(
    private selfElement: ElementRef,
    private renderer: Renderer2,
    private $window: WindowService,
    private datePipe: DatePipe,
  ) {
    super();
  }

  public show = false;
  private readonly format = 'yyyy/MM/dd';

  ngOnInit(): void {
    this.$window.click$.pipe(takeUntil(this.onDestroy$)).subscribe(click => {
      if (!this.selfElement.nativeElement.contains(click.target)) {
        this.show = false;
      };
    });
    this.placeholder = this.isRange ? 'YYYY/MM/DD ~ YYYY/MM/DD' : 'YYYY/MM/DD';
  }

  public showCalendar(): void {
    if (!this.isDisabled) {
      this.show = true;
      this.calendarShow.emit(this.show);
    };
  }

  public clear(event: Event): void {
    event.stopPropagation();
    this.notifyValueChange(this.isDynamic ? [{value: '', memo:''}] : '');
  }

  public select(select: string | IRangeDate) {
    this.show = false;
    const date = (this.isRange ? this.datePipe.transform((select as IRangeDate).start, this.format) + ' ~ ' + this.datePipe.transform((select as IRangeDate).end, this.format) : this.datePipe.transform(select as string, this.format) as string);
    this.notifyValueChange(this.isDynamic ? [{value: date, memo: ''}] : date);
    this.selectDate.emit(date);
    this.calendarShow.emit(this.show);
  }

  private setCalendarPosition(calendar: HTMLElement): void {
    if (calendar) {
      this.renderer.setStyle(
        calendar,
        'top',
        `${-calendar.clientHeight / 3}px`
      );
      switch (this.position) {
        case 'right':
          this.renderer.setStyle(
            calendar,
            'right',
            `${-calendar.clientWidth - 10}px`
          );
          this.renderer.setStyle(calendar, 'left', `unset`);
          break;
        case 'left':
          this.renderer.setStyle(
            calendar,
            'left',
            `${-calendar.clientWidth - 10}px`
          );
          this.renderer.setStyle(calendar, 'right', `unset`);
          break;
        case 'default':
          break;
      }
    }
  }
}
