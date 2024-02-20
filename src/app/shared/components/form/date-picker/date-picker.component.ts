import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
  OnInit,
} from '@angular/core';
import {WindowService} from '@shared/service/window.service';
import {
  CustomForm,
  getFormProvider,
} from '@utilities/abstract/customForm.abstract';
import {takeUntil} from 'rxjs';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [getFormProvider(DatePickerComponent)],
})
export class DatePickerComponent extends CustomForm<string> implements OnInit {
  @ViewChild('tCalendarContainer') set tCalendarContainer(
    calendar: ElementRef<HTMLElement>
  ) {
    if (calendar) {
      this.setCalendarPosition(calendar.nativeElement);
    }
  }
  /** 是否為範圍日期 */
  @Input() isRange = false;
  /** 值字體大小 */
  @Input() valueFontSize = '';
  /** placeholder 字體大小 */
  @Input() placeholderFontSize = '';
  /** 是否欄位驗證錯誤 */
  @Input() isError = false;
  @Input() position?: 'right' | 'default' | 'left' = 'default';
  @Input() isDisabled?: boolean;
  /** 是否只限本月 */
  @Input() thisMonthLimit = false;
  @Output() selectDate = new EventEmitter<string>();
  @Output() calendarShow = new EventEmitter<boolean>();

  constructor(
    private selfElement: ElementRef,
    private renderer: Renderer2,
    private $window: WindowService
  ) {
    super();
  }

  public show = false;

  ngOnInit(): void {
    this.$window.click$.pipe(takeUntil(this.onDestroy$)).subscribe(click => {
      if (!this.selfElement.nativeElement.contains(click.target)) {
        this.show = false;
      }
    });
  }

  public showCalendar(): void {
    if (!this.isDisabled) {
      this.show = true;
      this.calendarShow.emit(this.show);
    }
  }

  public select(date: string) {
    this.show = false;
    this.notifyValueChange(date);
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
