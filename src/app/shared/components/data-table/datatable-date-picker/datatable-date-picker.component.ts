import {
  Component,
  Input,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  Renderer2,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import {WindowService} from '@shared/service/window.service';
import {
  CustomForm,
  getFormProvider,
} from '@utilities/abstract/customForm.abstract';
import {takeUntil} from 'rxjs';

@Component({
  selector: 'app-datatable-date-picker',
  templateUrl: './datatable-date-picker.component.html',
  styleUrls: ['./datatable-date-picker.component.scss'],
  providers: [getFormProvider(DataTableDatePickerComponent)],
})
export class DataTableDatePickerComponent
  extends CustomForm<string>
  implements OnInit, OnChanges
{
  @ViewChild('tCalendarContainer') set tCalendarContainer(
    calendar: ElementRef<HTMLElement>
  ) {
    if (calendar) {
      this.setCalendarPosition(calendar.nativeElement);
    }
  }
  @Output() selectDate = new EventEmitter<string>();
  @Output() calendarShow = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<void>();
  /** 是否為範圍日期 */
  @Input() isRange = false;
  /** 是否欄位驗證錯誤 */
  @Input() isInValid = false;
  @Input() positionX?: 'right' | 'left' | 'default' | undefined = 'default';
  @Input() positionY?: 'top' | 'middle' | 'bottom' = 'middle';
  /** 是否只限本月 */
  @Input() thisMonthLimit = false;
  @Input() value: string | number | null = '';

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

  ngOnChanges({value}: SimpleChanges) {
    this.model = value.currentValue;
  }

  public showCalendar(): void {
    this.show = true;
    this.calendarShow.emit(this.show);
  }

  public select(date: string) {
    this.show = false;
    this.notifyValueChange(date);
    this.selectDate.emit(date);
    this.calendarShow.emit(this.show);
  }

  private setCalendarPosition(calendar: HTMLElement): void {
    if (calendar) {
      switch (this.positionY) {
        case 'top':
          this.renderer.setStyle(
            calendar,
            'top',
            `${-calendar.clientHeight + 30}px`
          );
          this.renderer.setStyle(calendar, 'bottom', `unset`);
          break;
        case 'bottom':
          this.renderer.setStyle(
            calendar,
            'bottom',
            `${-calendar.clientHeight + 30}px`
          );
          this.renderer.setStyle(calendar, 'top', `unset`);
          break;
        default:
          this.renderer.setStyle(
            calendar,
            'top',
            `${-calendar.clientHeight / 3}px`
          );
          this.renderer.setStyle(calendar, 'bottom', `unset`);
          break;
      }
      switch (this.positionX) {
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
