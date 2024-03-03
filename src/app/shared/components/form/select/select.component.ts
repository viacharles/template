import {
  CustomForm,
  getFormProvider,
} from '@utilities/abstract/customForm.abstract';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {WindowService} from '@shared/service/window.service';
import {IOption} from '@utilities/interface/common.interface';
import {take, takeUntil, timer} from 'rxjs';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [getFormProvider(SelectComponent)],
})
export class SelectComponent<T extends IOption<string>>
  extends CustomForm<string>
  implements OnInit
{
  @ViewChild('tDropDown') tDropDown?: ElementRef<HTMLElement>;
  @Output() select = new EventEmitter<T>();
  @Input() options: T[] = [];
  @Input() placeholder = 'common.please-select';
  @Input() enableAll = false;
  @Input() dropDownDirection?: 'above' | 'below' = 'below';
  @Input() override disabled = false;
  @Input() errorMessage?: string;
  @Input() isError?: boolean;

  constructor(
    private selfElem: ElementRef,
    private render: Renderer2,
    private $window: WindowService
  ) {
    super();
  }

  public isOpen = false;

  get currentOption(): T | undefined {
    return this.options?.find(({code}) => code === this.model);
  }

  ngOnInit(): void {
    this.$window.click$.pipe(takeUntil(this.onDestroy$)).subscribe(click => {
      if (!this.selfElem.nativeElement.contains(click.target as HTMLElement)) {
        this.isOpen = false;
      }
    });
  }

  public open() {
    this.isOpen = this.disabled ? false : !this.isOpen;
    timer(100).pipe(take(1)).subscribe(() => this.setDropdownPosition()); // 等 dropdown render 完成
  }

  /** 選擇選項 */
  public selectOption(option?: T): void {
    this.isOpen = false;
    this.notifyValueChange(option ? option.code : '');
    this.select.emit(option);
  }

  public click(event: Event): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen && this.tDropDown) {
      this.render.setStyle(this.tDropDown.nativeElement, 'opacity', '0');
    }
  }

  private setDropdownPosition(): void {
    if (this.tDropDown) {
      if (this.dropDownDirection !== undefined) {
        this.render.setStyle(this.tDropDown.nativeElement, 'opacity', '1');
        const isBelow = this.dropDownDirection === 'below';
        this.render.setStyle(
          this.tDropDown.nativeElement,
          isBelow ? 'top' : 'bottom',
          isBelow ? 'calc(100% + 5px)' : '2.3rem'
        );
        this.render.setStyle(
          this.tDropDown.nativeElement,
          isBelow ? 'bottom' : 'top',
          'unset'
        );
      } else {
        this.render.setStyle(this.tDropDown.nativeElement, 'opacity', '1');
        const rect = this.tDropDown.nativeElement.getBoundingClientRect();
        const isOffScreen =
          rect.bottom - 120 <
          rect?.height +
            this.selfElem.nativeElement.getBoundingClientRect().height;
        this.render.setStyle(
          this.tDropDown.nativeElement,
          isOffScreen ? 'top' : 'bottom',
          isOffScreen ? '3.3rem' : '1.7rem'
        );
        this.render.setStyle(
          this.tDropDown.nativeElement,
          !isOffScreen ? 'top' : 'bottom',
          'unset'
        );
      }
    }
  }
}
